import sys
from services.database import db


def toggle_pro_status(email: str, status: bool):
    collection = db["user_usage"]

    # Check if user exists in user_usage
    user = collection.find_one({"email": email})

    if not user:
        print("User not found in 'user_usage' table.")
        print(f"Make sure {email} has logged in at least once.")
        return

    user_id = user["user_id"]
    current_status = user.get("is_pro", False)
    print(f"User ID: {user_id}")
    print(f"Current Pro Status: {current_status}")

    # Toggle
    collection.update_one(
        {"user_id": user_id},
        {"$set": {"is_pro": status}}
    )
    print(f"Pro status updated to: {status}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python toggle_pro.py <email> [true|false]")
        sys.exit(1)

    email = sys.argv[1]
    # Default to True (i.e., make them pro)
    status = True
    if len(sys.argv) > 2 and sys.argv[2].lower() == "false":
        status = False

    toggle_pro_status(email, status)
