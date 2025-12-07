import httpx
import base64
import re

async def fetch_repo_content(url: str) -> str:
    """
    Fetches the README.md content from a GitHub repository.
    Also attempts to fetch the file structure for context.
    """
    # Extract owner and repo from URL
    match = re.search(r"github\.com/([^/]+)/([^/]+)", url)
    if not match:
        raise ValueError("Invalid GitHub URL. format: https://github.com/owner/repo")
    
    owner = match.group(1)
    repo = match.group(2)
    
    async with httpx.AsyncClient() as client:
        readme_content = ""
        
        # 1. Fetch README content via GitHub API
        # GET /repos/{owner}/{repo}/readme
        readme_url = f"https://api.github.com/repos/{owner}/{repo}/readme"
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Repo2Viral-Agent"
        }
        
        try:
            resp = await client.get(readme_url, headers=headers)
            
            if resp.status_code == 200:
                data = resp.json()
                if "content" in data and data.get("encoding") == "base64":
                    readme_content = base64.b64decode(data["content"]).decode("utf-8")
                elif "download_url" in data:
                     raw_resp = await client.get(data["download_url"])
                     readme_content = raw_resp.text
            else:
                # If API fails (e.g. 404 or rate limit), try raw.githubusercontent.com
                # master and main are common branches
                for branch in ["main", "master"]:
                    raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/README.md"
                    raw_resp = await client.get(raw_url)
                    if raw_resp.status_code == 200:
                        readme_content = raw_resp.text
                        break
        except Exception as e:
            print(f"Error fetching README: {e}")

        if not readme_content:
             readme_content = "Could not fetch README.md content."

        # 2. Bonus: Fetch file structure
        file_structure = []
        try:
            # Get default branch first
            repo_info_url = f"https://api.github.com/repos/{owner}/{repo}"
            repo_info_resp = await client.get(repo_info_url, headers=headers)
            
            if repo_info_resp.status_code == 200:
                repo_info = repo_info_resp.json()
                default_branch = repo_info.get("default_branch", "main")
                
                # Get Tree
                tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1"
                tree_resp = await client.get(tree_url, headers=headers)
                
                if tree_resp.status_code == 200:
                    tree_data = tree_resp.json()
                    # Filter for files (blob)
                    file_structure = [item["path"] for item in tree_data.get("tree", []) if item["type"] == "blob"]
        except Exception as e:
            print(f"Error fetching tree: {e}")

        # Combine
        result = readme_content.strip()
        if file_structure:
            structure_str = "\n".join(file_structure[:300]) # Limit to 300 files to avoid massive context
            result += f"\n\n\n--- Repository Structure Context ({len(file_structure)} files) ---\n{structure_str}"
            
        return result
