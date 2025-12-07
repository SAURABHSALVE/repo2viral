from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("Error: Missing Supabase credentials in .env")
    exit(1)

supabase: Client = create_client(url, key)

def create_demo_user():
    email = "test@repo2viral.com"
    password = "password123"
    
    print(f"Attempting to create confirmed user: {email}")
    
    try:
        # Create user with admin privilege (auto-confirms email)
        attributes = {
            "email": email, 
            "password": password, 
            "email_confirm": True,
            "user_metadata": {"full_name": "Demo User"}
        }
        user = supabase.auth.admin.create_user(attributes)
        print("✅ Success! User created.")
        print(f"Email: {email}")
        print(f"Password: {password}")
        print("Use these credentials to login immediately.")
    except Exception as e:
        print(f"Error (User might already exist): {e}")

if __name__ == "__main__":
    create_demo_user()
