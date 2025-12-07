from pydantic import BaseModel

class RepoRequest(BaseModel):
    url: str
