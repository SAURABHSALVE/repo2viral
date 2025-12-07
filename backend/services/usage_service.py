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
