import os
from supabase import create_client, Client
from dotenv import load_dotenv
import argparse

load_dotenv()

# Initialize Supabase
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_SERVICE_KEY not found in .env")
    exit(1)

supabase: Client = create_client(url, key)

def set_pro_status(email: str, status: bool):
    print(f"Finding user with email: {email}...")
    
    # Check if user exists in user_usage
    response = supabase.table("user_usage").select("*").eq("email", email).execute()
    
    if not response.data:
        print("User not found in 'user_usage' table.")
        print("Please log in and generate at least one content piece to initialize your user record.")
        return

    user_id = response.data[0]['user_id']
    print(f"Found User ID: {user_id}")
    
    # Update status
    print(f"Setting is_pro = {status}...")
    supabase.table("user_usage").update({"is_pro": status}).eq("user_id", user_id).execute()
    
    print("Success! 🎉")
    print(f"User {email} is now {'PRO' if status else 'FREE'}.")
    print("Refresh your dashboard to see the changes.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Toggle Pro status for a user')
    parser.add_argument('email', type=str, help='The email of the user to update')
    parser.add_argument('--free', action='store_true', help='Set status to Free instead of Pro')
    
    args = parser.parse_args()
    
    is_pro = not args.free
    set_pro_status(args.email, is_pro)
