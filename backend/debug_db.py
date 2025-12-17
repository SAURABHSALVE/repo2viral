import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_SERVICE_KEY not found in .env")
    exit(1)

supabase: Client = create_client(url, key)

def debug_history():
    print("--- Debugging Content History Table ---")
    
    # 1. Check if table exists by selecting 1 row
    print("1. Checking permissions and table existence...")
    try:
        response = supabase.table("content_history").select("*").limit(1).execute()
        print("Success: Table exists and is readable.")
    except Exception as e:
        print(f"Error: Could not read table. {e}")
        return

    # 2. Try to insert a dummy record
    print("\n2. Attempting a test insert...")
    dummy_user_id = "00000000-0000-0000-0000-000000000000" # Should fail FK if strictly enforced, but let's see.
    # We need a real user ID usually. Let's ask user to provide one or try to fetch one.
    
    # Fetch a real user
    users = supabase.table("user_usage").select("user_id").limit(1).execute()
    if not users.data:
        print("No users found in user_usage to test with.")
        return
        
    real_user_id = users.data[0]['user_id']
    print(f"Using existing user_id for test: {real_user_id}")
    
    test_content = {
        "twitter_thread": "Test Thread",
        "linkedin_post": "Test Post",
        "blog_intro": "Test Blog"
    }
    
    try:
        response = supabase.table("content_history").insert({
            "user_id": real_user_id,
            "repo_url": "https://github.com/test/debug",
            "generated_content": test_content,
            "platform": "Debug Script",
            "tone_used": "Debugger"
        }).execute()
        print("Success: Inserted test record.")
    except Exception as e:
        print(f"Error inserting record: {e}")

if __name__ == "__main__":
    debug_history()
