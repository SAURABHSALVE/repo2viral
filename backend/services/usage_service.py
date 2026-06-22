from services.database import db
import secrets
import string
from datetime import datetime

def check_usage(user_id: str, email: str):
    """
    Validates that the user is allowed to generate content and ensures they exist in the DB.
    Does NOT increment — call increment_usage() only after a successful generation.
    Raises Exception with "Free limit reached" or "Pro limit reached" if over quota.
    """
    try:
        collection = db["user_usage"]
        user = collection.find_one({"user_id": user_id})

        if not user:
            print(f"New user {user_id}, creating record...")
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

        if is_pro:
            if usage_count >= 1000:
                raise Exception("Pro limit reached (1000/month)")
        else:
            if usage_count >= 2:
                raise Exception("Free limit reached")

        return True

    except Exception as e:
        if "limit reached" in str(e):
            raise e
        print(f"Db Error in check_usage: {e}")
        raise Exception(f"Database error: {str(e)}")


def increment_usage(user_id: str):
    """Increments usage count after a successful generation."""
    try:
        db["user_usage"].update_one(
            {"user_id": user_id},
            {"$inc": {"usage_count": 1}}
        )
    except Exception as e:
        print(f"Failed to increment usage for {user_id}: {e}")


def check_and_increment_usage(user_id: str, email: str):
    """Kept for backwards compatibility. Prefer check_usage + increment_usage."""
    check_usage(user_id, email)
    increment_usage(user_id)
    return True


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
