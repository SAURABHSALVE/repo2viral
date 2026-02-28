from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB_NAME", "repo2viral")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI not found in .env")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
