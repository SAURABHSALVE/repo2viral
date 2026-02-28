from services.database import db
import secrets
import string
from datetime import datetime

def check_and_increment_usage(user_id: str, email: str):
    """
    Checks if a user is allowed to generate content.
    - If user doesn't exist, create them.
    - Free tier = 2 credits.
    - Throws Exception if limit reached.
    """
    try:
        collection = db["user_usage"]

        # 1. Fetch user usage
        user = collection.find_one({"user_id": user_id})

        if not user:
            # User doesn't exist, create them (First use is free)
            print("Creating new user...")
            collection.insert_one({
                "user_id": user_id,
                "email": email,
                "usage_count": 0,
                "is_pro": False,
                "created_at": datetime.utcnow()
            })
            usage_count = 0
            is_pro = False
        else:
            usage_count = user.get("usage_count", 0)
            is_pro = user.get("is_pro", False)

        # 2. Check limits
        if is_pro:
            if usage_count >= 1000:
                raise Exception("Pro limit reached (1000/month)")
        else:
            if usage_count >= 2:
                raise Exception("Free limit reached")

        # 3. Increment usage
        new_count = usage_count + 1
        collection.update_one(
            {"user_id": user_id},
            {"$set": {"usage_count": new_count}}
        )

        return True

    except Exception as e:
        if str(e) == "Free limit reached":
            raise e
        print(f"Db Error: {e}")
        raise Exception(f"Database error: {str(e)}")


def generate_random_password(length=16):
    chars = string.ascii_letters + string.digits + "!@#$%"
    return ''.join(secrets.choice(chars) for _ in range(length))


def handle_subscription_update(email: str, is_pro: bool, subscription_id: str = None, license_key: str = None):
    """
    Updates the user's pro status based on Gumroad events.
    Finds user by email in user_usage.
    If not found, creates a new record.
    """
    print(f"Processing subscription update for {email}: Pro={is_pro}")
    try:
        collection = db["user_usage"]

        # 1. Try to find in user_usage
        user = collection.find_one({"email": email})

        if user:
            user_id = user["user_id"]
            print(f"Found existing usage record for {user_id}")
            update_data = {"is_pro": is_pro}
            if subscription_id:
                update_data["gumroad_subscription_id"] = subscription_id
            if license_key:
                update_data["gumroad_license_key"] = license_key

            collection.update_one(
                {"user_id": user_id},
                {"$set": update_data}
            )
            print("Updated user_usage successfully.")
            return True

        # 2. If not in user_usage, create a new record
        print(f"User {email} not found in user_usage. Creating new record...")

        try:
            # Generate a unique user_id for this Gumroad user
            new_user_id = f"gumroad_{secrets.token_hex(16)}"

            insert_data = {
                "user_id": new_user_id,
                "email": email,
                "usage_count": 0,
                "is_pro": is_pro,
                "gumroad_subscription_id": subscription_id,
                "gumroad_license_key": license_key,
                "created_at": datetime.utcnow()
            }

            collection.insert_one(insert_data)
            print(f"Created new user {new_user_id} for {email}")
            return True

        except Exception as create_error:
            print(f"Could not create new user: {create_error}")
            return False

    except Exception as e:
        print(f"Error updating subscription: {e}")
        raise e
