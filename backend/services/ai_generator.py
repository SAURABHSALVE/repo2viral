import os
from openai import OpenAI
import re
from dotenv import load_dotenv

load_dotenv()

# Configure OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# The System Prompt
SYSTEM_PROMPT = """
Role: Expert Developer Advocate.
Objective: Analyze the provided code context and output 3 distinct pieces of content.
Output format must be strictly separated by these headers:
### TWITTER THREAD
### LINKEDIN POST
### BLOG INTRO

Instructions:
1. **Twitter Thread**: Create a compelling thread (5-8 tweets). Hook the reader in the first tweet. Focus on the "Problem" and "Solution" provided by the tool. Use emojis. End with a call to action (link to repo).
2. **LinkedIn Post**: Write a professional yet engaging post. Focus on the technical implementation, the architecture, and the value proposition. Use bullet points for key features.
3. **Blog Intro**: Write an engaging introduction for a technical blog post about this repository. Hook the reader with a relatable struggle or an exciting new technology.

Tone: Enthusiastic, technical but accessible, and "viral" (high energy).
"""

def generate_viral_content(readme_text: str):
    try:
        if not os.getenv("OPENAI_API_KEY"):
            print("Error: OPENAI_API_KEY not found in environment variables.")
            return None

        # We combine instructions + data
        full_user_message = f"Here is the Repository README:\n{readme_text}"
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": full_user_message}
            ]
        )
        
        raw_text = response.choices[0].message.content
        
        return parse_ai_response(raw_text)
    except Exception as e:
        print(f"AI Generation Error: {e}")
        return None

def parse_ai_response(text: str):
    """
    Splits the AI's raw text response into a structured dictionary
    using Regex to find the headers.
    """
    data = {
        "twitter_thread": "",
        "linkedin_post": "",
        "blog_intro": ""
    }

    # Regex to find content between headers
    # We look for the header, capture everything (.) until the next header or end of string
    twitter_match = re.search(r"### TWITTER THREAD\s*(.*?)\s*(?=### LINKEDIN POST|$)", text, re.DOTALL)
    linkedin_match = re.search(r"### LINKEDIN POST\s*(.*?)\s*(?=### BLOG INTRO|$)", text, re.DOTALL)
    blog_match = re.search(r"### BLOG INTRO\s*(.*?)$", text, re.DOTALL)

    if twitter_match:
        data["twitter_thread"] = twitter_match.group(1).strip()
    if linkedin_match:
        data["linkedin_post"] = linkedin_match.group(1).strip()
    if blog_match:
        data["blog_intro"] = blog_match.group(1).strip()
        
    return data
