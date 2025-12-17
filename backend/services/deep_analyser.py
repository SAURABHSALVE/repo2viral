import httpx
import re
import base64

async def analyze_repo_structure(repo_url: str, token: str):
    """
    Deep scan of repository using user's GitHub token.
    Returns:
    {
        "file_tree": ["src/main.py", "package.json", ...],
        "tech_stack": ["Python", "FastAPI"],
        "entry_point": "def main(): ...",
        "readme_content": "# My Repo...",
        "evidence": { ... }
    }
    """
    # 1. Parse URL
    match = re.search(r"github\.com/([^/]+)/([^/]+)", repo_url)
    if not match:
        raise ValueError("Invalid GitHub URL")
    
    owner = match.group(1)
    repo = match.group(2)
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    async with httpx.AsyncClient() as client:
        # 1. Fetch Root Content (File Tree)
        repo_resp = await client.get(f"https://api.github.com/repos/{owner}/{repo}", headers=headers)
        if repo_resp.status_code == 401 or repo_resp.status_code == 403:
             raise PermissionError("GitHub Token Expired or Invalid")
        if repo_resp.status_code != 200:
            raise Exception(f"Failed to fetch repo info: {repo_resp.text}")
            
        default_branch = repo_resp.json().get("default_branch", "main")
        
        # Get Tree
        tree_resp = await client.get(f"https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1", headers=headers)
        if tree_resp.status_code != 200:
             raise Exception("Failed to fetch file tree")
             
        tree_data = tree_resp.json()
        all_files = [item["path"] for item in tree_data.get("tree", []) if item["type"] == "blob"]
        
        # Helper to fetch content
        async def fetch_file(path):
            try:
                url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
                resp = await client.get(url, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    if data.get("encoding") == "base64":
                        return base64.b64decode(data["content"]).decode("utf-8")
            except:
                return None
            return None

        # 1.5 Fetch README (Critical for Context)
        readme_file = next((f for f in all_files if f.lower() == "readme.md"), None)
        readme_content = "No README found."
        if readme_file:
            content = await fetch_file(readme_file)
            if content:
                readme_content = content[:8000] # Cap at 8k chars to fit in context

        # 2. Detect Stack
        stack = []
        if any(f.endswith("requirements.txt") or f.endswith("pyproject.toml") for f in all_files):
            stack.append("Python")
        if any(f.endswith("package.json") for f in all_files):
            stack.append("JavaScript/Node.js")
            if any("next" in f for f in all_files):
                stack.append("Next.js")
        if any(f.endswith("go.mod") for f in all_files):
            stack.append("Go")
        if any(f.endswith("Cargo.toml") for f in all_files):
            stack.append("Rust")

        # 3. EVIDENCE COLLECTION (The "No-Bluff" Logic)
        evidence = {
            "features": [],
            "test_count": 0,
            "entities": [],
            "config_evidence": [] 
        }

        # Structure Checks
        if any("docker-compose" in f for f in all_files):
            evidence["features"].append("Containerized / Easy Deploy [docker-compose.yml]")
        
        if any(".github/workflows" in f for f in all_files):
            evidence["features"].append("CI/CD Pipeline Active [.github/workflows]")
        
        test_files = [f for f in all_files if "test" in f.lower() and (f.endswith(".py") or f.endswith(".js") or f.endswith(".ts"))]
        evidence["test_count"] = len(test_files)
        if len(test_files) > 0:
            evidence["features"].append(f"Includes {len(test_files)} Test Suites [tests/]")

        # Content Scans (Fetch specific files)
        # Check requirements.txt for Stripe/Integrations
        req_file = next((f for f in all_files if f.endswith("requirements.txt")), None)
        if req_file:
            content = await fetch_file(req_file)
            if content:
                if "stripe" in content.lower():
                    evidence["features"].append("Payment Integration (Stripe) [requirements.txt]")
                if "fastapi" in content.lower():
                    evidence["features"].append("FastAPI High Performance [requirements.txt]")
                if "django" in content.lower():
                    evidence["features"].append("Django Core [requirements.txt]")

        # Check Models for Data Entities
        # Simple regex heuristic to find class names in models.py
        model_file = next((f for f in all_files if "models.py" in f or "schema.prisma" in f), None)
        if model_file:
            content = await fetch_file(model_file)
            if content:
                # Python Class Regex
                classes = re.findall(r"class\s+(\w+)\(", content)
                # Prisma Model Regex
                prisma_models = re.findall(r"model\s+(\w+)\s+{", content)
                
                found_entities = classes[:5] + prisma_models[:5] # Top 5
                if found_entities:
                    evidence["entities"] = found_entities
                    evidence["features"].append(f"Data Models: {', '.join(found_entities)} [{model_file}]")
        
        # 4. Find Entry Point & Read
        entry_candidates = ["main.py", "app.py", "index.js", "app.js", "index.ts", "src/index.js", "src/main.rs", "main.go"]
        selected_entry = None
        for candidate in entry_candidates:
            if candidate in all_files:
                selected_entry = candidate
                break
        
        # Fallback
        if not selected_entry:
            for f in all_files:
                 if "main" in f.lower() or "app" in f.lower():
                     selected_entry = f
                     break
                     
        entry_content = ""
        if selected_entry:
            entry_content = await fetch_file(selected_entry) or ""
            entry_content = entry_content[:1500] # Cap it

        return {
            "file_tree": all_files[:200], 
            "tech_stack": stack,
            "entry_point_name": selected_entry,
            "entry_point_content": entry_content,
            "readme_content": readme_content,
            "evidence": evidence
        }
