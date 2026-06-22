"""
Test script to verify MongoDB connection and basic operations.
Run: python test_mongodb.py
"""

from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB_NAME", "repo2viral")

print("=" * 60)
print("MONGODB CONNECTION TEST")
print("=" * 60)

if not MONGODB_URI:
    print("❌ ERROR: MONGODB_URI not found in .env file")
    exit(1)

print(f"📦 Database: {DB_NAME}")
print(f"🔗 URI: {MONGODB_URI[:60]}...")

try:
    # 1. Connect
    print("\n⏳ Connecting to MongoDB...")
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)

    # Test the connection
    client.admin.command('ping')
    print("✅ Connected successfully!")

    # 2. Get database
    db = client[DB_NAME]
    print(f"✅ Database '{DB_NAME}' ready")

    # 3. Test write operation
    print("\n⏳ Testing write operation...")
    test_collection = db["test_connection"]
    test_doc = {
        "test": "connection",
        "timestamp": datetime.utcnow(),
        "message": "This is a test document"
    }
    result = test_collection.insert_one(test_doc)
    print(f"✅ Document inserted with ID: {result.inserted_id}")

    # 4. Test read operation
    print("\n⏳ Testing read operation...")
    found_doc = test_collection.find_one({"test": "connection"})
    if found_doc:
        print(f"✅ Document retrieved:")
        print(f"   - ID: {found_doc['_id']}")
        print(f"   - Message: {found_doc['message']}")
        print(f"   - Timestamp: {found_doc['timestamp']}")
    else:
        print("❌ Document not found!")
        exit(1)

    # 5. Test collections
    print("\n⏳ Checking existing collections...")
    collections = db.list_collection_names()
    print(f"✅ Collections in database: {collections if collections else 'None yet'}")

    # 6. Cleanup
    print("\n⏳ Cleaning up test document...")
    test_collection.delete_one({"test": "connection"})
    print("✅ Test document deleted")

    print("\n" + "=" * 60)
    print("✅ ALL TESTS PASSED - MongoDB is working!")
    print("=" * 60)
    print("\nYou can now start the backend:")
    print("  uvicorn main:app --reload --port 8000")

except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    print("\nTroubleshooting:")
    print("1. Check your MONGODB_URI in .env is correct")
    print("2. Check username and password are correct")
    print("3. Make sure MongoDB Atlas IP whitelist includes your IP (or add 0.0.0.0/0)")
    print("4. Check your internet connection")
    exit(1)
finally:
    try:
        client.close()
        print("\n🔌 Connection closed")
    except:
        pass
