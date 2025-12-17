from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.github_loader import fetch_repo_content
from services.ai_generator import generate_viral_content
from services.usage_service import check_and_increment_usage

from services.usage_service import check_and_increment_usage, supabase
import json

from routers import webhooks

app = FastAPI(title="Repo2Viral Backend")

app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RepoRequest(BaseModel):
    url: str
    user_id: str
    email: str
    tone: str = "Educator"

@app.get("/")
def read_root():
    return {"status": "Repo2Viral Backend API is running"}

@app.post("/analyze")
async def analyze_repo(request: RepoRequest):
    # Step 0: Check Usage/Auth
    try:
        check_and_increment_usage(request.user_id, request.email)
    except Exception as e:
        if "Free limit reached" in str(e):
             raise HTTPException(status_code=403, detail="Free limit reached. Upgrade to Pro.")
        raise HTTPException(status_code=500, detail=f"Usage check failed: {str(e)}")

    # Step 1: Get Data from GitHub
    print(f"Fetching repo: {request.url}")
    try:
        readme_content = await fetch_repo_content(request.url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching repo: {str(e)}")
    
    if not readme_content:
        raise HTTPException(status_code=400, detail="Could not fetch README from this URL.")

    # Step 2: Generate Content with AI
    print(f"Generating AI content with tone: {request.tone}")
    content_data = generate_viral_content(readme_content, request.tone)
    
    if not content_data:
        raise HTTPException(status_code=500, detail="AI generation failed. Check API server logs or keys.")

    # Step 3: Save to History
    try:
        supabase.table("content_history").insert({
            "user_id": request.user_id,
            "repo_url": request.url,
            "generated_content": content_data,
            "platform": "All",
            "tone_used": request.tone
        }).execute()
    except Exception as e:
        print(f"Failed to save history: {e}")
        # We don't fail the request if history save fails, just log it.
        
    return content_data

from services.deep_analyser import analyze_repo_structure

class AnalyzeRequest(BaseModel):
    repo_url: str
    github_token: str
    user_id: str
    email: str
    tone: str = "Educator"

@app.post("/api/analyze-repo")
async def analyze_repo_deep(request: AnalyzeRequest):
    # Step 0: Check Usage/Auth
    try:
        check_and_increment_usage(request.user_id, request.email)
    except Exception as e:
        if "Free limit reached" in str(e):
             raise HTTPException(status_code=403, detail="Free limit reached. Upgrade to Pro.")
        raise HTTPException(status_code=500, detail=f"Usage check failed: {str(e)}")

    # Step 1: Deep Analysis using User Token
    print(f"Deep analyzing repo: {request.repo_url}")
    try:
        structure_data = await analyze_repo_structure(request.repo_url, request.github_token)
    except Exception as e:
        error_msg = str(e)
        if "401" in error_msg or "403" in error_msg or "Expired" in error_msg:
             raise HTTPException(status_code=401, detail="GitHub Token Expired or Invalid. Please log in again.")
        raise HTTPException(status_code=400, detail=f"Deep analysis failed: {error_msg}")

    # Step 2: Generate AI Content
    print(f"Generating AI content with tone: {request.tone}")
    content_data = generate_viral_content(structure_data, request.tone)
    
    if not content_data:
        raise HTTPException(status_code=500, detail="AI generation failed.")

    # Step 3: Save to History
    try:
        supabase.table("content_history").insert({
            "user_id": request.user_id,
            "repo_url": request.repo_url,
            "generated_content": content_data,
            "platform": "Deep Analysis",
            "tone_used": request.tone
        }).execute()
    except Exception as e:
        print(f"Failed to save history: {e}")

    return content_data

@app.get("/history")
def get_user_history(user_id: str):
    try:
        response = supabase.table("content_history").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")

@app.get("/profile")
def get_user_profile(user_id: str):
    try:
        # Fetch usage and subscription status
        response = supabase.table("user_usage").select("*").eq("user_id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {str(e)}")
