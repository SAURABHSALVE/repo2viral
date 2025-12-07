from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.github_loader import fetch_repo_content
from services.ai_generator import generate_viral_content
from services.usage_service import check_and_increment_usage

app = FastAPI(title="Repo2Viral Backend")

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RepoRequest(BaseModel):
    url: str
    user_id: str
    email: str

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
    print("Generating AI content...")
    content_data = generate_viral_content(readme_content)
    
    if not content_data:
        raise HTTPException(status_code=500, detail="AI generation failed. Check API server logs or keys.")
        
    return content_data
