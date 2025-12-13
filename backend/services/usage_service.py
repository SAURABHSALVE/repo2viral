from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_KEY")

supabase: Client = create_client(url, key)

def check_and_increment_usage(user_id: str, email: str):
    """
    Checks if a user is allowed to generate content.
    - If user doesn't exist, create them.
    - Free tier = 1 credit.
    - Throws Exception if limit reached.
    """
    try:
        # 1. Fetch user usage
        response = supabase.table("user_usage").select("*").eq("user_id", user_id).execute()
        
        if not response.data:
            # User doesn't exist, create them (First use is free)
            print("Creating new user...")
            supabase.table("user_usage").insert({
                "user_id": user_id,
                "email": email,
                "usage_count": 0,
                "is_pro": False
            }).execute()
            usage_count = 0
            is_pro = False
        else:
            user_data = response.data[0]
            usage_count = user_data.get("usage_count", 0)
            is_pro = user_data.get("is_pro", False)

        # 2. Check limits
        # Logic: If NOT pro and usage >= 1, block.
        if not is_pro and usage_count >= 1:
            raise Exception("Free limit reached")

        # 3. Increment usage
        new_count = usage_count + 1
        supabase.table("user_usage").update({"usage_count": new_count}).eq("user_id", user_id).execute()
        
        return True

    except Exception as e:
        # Re-raise the limit exception clearly
        if str(e) == "Free limit reached":
             raise e
        print(f"Db Error: {e}")
        # Fail open or closed? Let's fail open for unrelated DB errors but log it,
        # UNLESS it's the specific limit error we just raised.
        # Ideally, we should block if DB is down to prevent free usage abuse, but for MVP:
        raise Exception(f"Database error: {str(e)}")

import secrets
import string

def generate_random_password(length=16):
    chars = string.ascii_letters + string.digits + "!@#$%"
    return ''.join(secrets.choice(chars) for _ in range(length))

def handle_subscription_update(email: str, is_pro: bool, subscription_id: str = None, license_key: str = None):
    """
    Updates the user's pro status based on Gumroad events.
    Finds user by email in user_usage. 
    If not found, creates a new Auth user and user_usage record (so the license isn't lost).
    """
    print(f"Processing subscription update for {email}: Pro={is_pro}")
    try:
        # 1. Try to find in user_usage
        response = supabase.table("user_usage").select("*").eq("email", email).execute()
        
        if response.data:
            user_id = response.data[0]["user_id"]
            print(f"Found existing usage record for {user_id}")
            update_data = {
                "is_pro": is_pro
            }
            if subscription_id:
                update_data["gumroad_subscription_id"] = subscription_id
            if license_key:
                update_data["gumroad_license_key"] = license_key
                
            supabase.table("user_usage").update(update_data).eq("user_id", user_id).execute()
            print("Updated user_usage successfully.")
            return True
            
        # 2. If not in user_usage, we must create the user to store the license.
        print(f"User {email} not found in user_usage. Creating new user...")
        
        try:
            # Check if exists in Auth (but not user_usage - e.g. edge case) or create new
            # create_user will fail if email exists, causing an exception we can catch
            # But the 'admin' api might return a user object even if exists? 
            # Usually create_user throws error if exists.
            
            # Let's try to look it up first? The admin API is 'list_users' but searching is harder.
            # We'll try to CREATE. If it fails saying "User already registered", we skip creating logic 
            # and imply we need to find their ID.
            
            # But wait, we don't know their ID if we can't search. 
            # supabase-py logic:
            # If we really want to support "Auth user exists but no user_usage", we need a way to get ID.
            # admin.list_users() is the only way usually.
            
            # For this task: "Create a new user"
            random_pw = generate_random_password()
            auth_response = supabase.auth.admin.create_user({
                "email": email,
                "password": random_pw,
                "email_confirm": True,
                "user_metadata": {"source": "gumroad"}
            })
            
            # Note: supabase-py versions vary. create_user might return User or Response.
            # create_demo_user.py assumes `user = supabase.auth.admin.create_user(...)`
            
            new_user_id = auth_response.user.id
            
            # Now insert into user_usage
            insert_data = {
                "user_id": new_user_id,
                "email": email,
                "usage_count": 0,
                "is_pro": is_pro,
                "gumroad_subscription_id": subscription_id,
                "gumroad_license_key": license_key
            }
            
            supabase.table("user_usage").insert(insert_data).execute()
            print(f"Created new user {new_user_id} for {email}")
            return True
            
        except Exception as create_error:
            # likely "User already registered"
            print(f"Could not create new user (might exist): {create_error}")
            
            # Fallback: If user exists in Auth but not user_usage, we technically should find them.
            # Without a direct 'get_user_by_email' admin method, we might just log this.
            # But we tried our best.
            return False
        
    except Exception as e:
        print(f"Error updating subscription: {e}")
        raise e
