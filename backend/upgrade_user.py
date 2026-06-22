from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["repo2viral"]

result = db.user_usage.update_one(
    {"user_id": "90780335"},
    {"$set": {"is_pro": True}}
)

print(f"Modified: {result.modified_count}")
user = db.user_usage.find_one({"user_id": "90780335"})
print(f"is_pro: {user['is_pro']}")
client.close()
