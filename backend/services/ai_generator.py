import os
from openai import OpenAI
import re
import json
from dotenv import load_dotenv

load_dotenv()

# Configure OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# The System Prompt
def get_system_prompt(tone: str = "Educator"):
    # Base Persona: Technical Storyteller
    base = """You are a Senior Technical Writer & Code Analyst. Your goal is not just to "audit" the code, but to *teach* and *explain* the architecture to developers.
    
    Even if a codebase is small, your job is to extract the maximum educational value from it. 
    - Don't just say "It uses FastAPI". Say "It leverages FastAPI's dependency injection system [found in dependencies.py] to handle auth cleanly."
    - Don't just say "It has tests". Say "It ensures reliability with a rigorous Pytest suite covering edge cases [found in tests/test_auth.py]."

Your Constraints:
1. **Show, Don't Just Tell**: Every claim must be backed by a file reference. e.g., "The app uses a factory pattern [found in /src/factory.ts]."
2. **No Hallucinations**: stick to the provided file tree and code snippets.
3. **Depth over Breadth**: If you find a specific interesting file (like a custom middleware or a complex SQL model), spend time explaining *how it works* in the Twitter thread/Blog.
4. **Avoid Generic Fillers**: Bans words like "Revolutionary", "Game-changing". Use "Efficient", "Modular", "Type-Safe".

Target Audience: Engineers who want to learn *patterns* and *techniques* from this repo.
"""

    # Tone Specifics
    if tone == "Senior Dev":
        tone_instruction = """
Tone: Senior Architect.
Style: Critical, analytical, and authoritative. Discuss trade-offs (e.g., "This monolith structure simplifies deployment but might limit scaling").
"""
    elif tone == "Hype Man":
        tone_instruction = """
Tone: Enthusiastic Developer Advocate.
Style: High energy ("🔥 Check this pattern out!"), but focused on the *cool tech* details, not marketing fluff.
"""
    else: # Educator
        tone_instruction = """
Tone: Technical Instructor.
Style: Clear, step-by-step breakdown. "First, it does X..." "Then, it processes Y...". Perfect for tutorials.
"""

    # Strict Rules & JSON Output
    rules = """
Output strictly valid JSON. Do not output markdown or plain text.

Structure your response exactly like this JSON structure:
{
  "twitter_thread": "A viral 6-10 tweet thread. Use '1/X' numbering at the start of each tweet. Do NOT use 'Tweet 1:' labels. Separate tweets with double newlines. Emojis are mandatory. Tweet 1 must be a killer hook.",
  "linkedin_post": "A professional, high-reach post. Structure: Hook -> The Problem -> The Tech Stack (Bulleted) -> Why it matters. Use minimal emojis (only for bullets). No markdown headers (#), use bold or CAPS if needed.",
  "blog_intro": "A compelling, SEO-friendly introduction (300 words). Title at the top. Hook the reader immediately.",
  "slides": [
    {
      "slide_number": 1,
      "type": "hook",
      "headline": "<Use a Catchy Hook related to the Repo>",
      "body": "<A question or statement about the problem the repo solves>",
      "visual_cue": "warning_icon"
    },
    // ... 5-7 slides total. 
    // Slide 4 MUST be type='technical' and cite a file. 
    // Slide 5 MUST be type='technical' and cite a file.
  ]
}

Carousel Rules:
- Headlines: Must be under 40 characters. Punchy and bold.
- Body Text: Must be under 140 characters. Simple English. No jargon without explanation.
- **CRITICAL**: Every single slide (except Hook/CTA) MUST mention a specific technical feature found in the Evidence Checklist or File Tree.
- Structure:
    Slide 1: The Hook. A startling fact or a question about the problem.
    Slide 2: The Struggle. Describe the 'Old Way'. (type="problem")
    Slide 3: The Solution. Introduce the Repo. (type="feature")
    Slide 4: Technical Deep Dive 1. **MUST cite a file** (e.g., "Secure Auth [found in auth.py]"). (type="technical")
    Slide 5: Technical Deep Dive 2. **MUST cite a file** (e.g., "Smart Caching [found in redis_service.py]"). (type="technical")
    Slide 6: Call to Action. (type="cta")
- Slide 4 & 5 should use visual_cue='code' or 'server'.
- If you have a specific short code snippet (max 5 lines) for Slide 4/5, put it in 'code_snippet'.

"""
    
    return f"{base}\n{tone_instruction}\n{rules}"

def generate_viral_content(context_data: any, tone: str = "Educator"):
    try:
        if not os.getenv("OPENAI_API_KEY"):
            print("Error: OPENAI_API_KEY not found in environment variables.")
            return None

        # Format input based on type
        if isinstance(context_data, dict):
            # It's our new Deep Analysis format
            full_user_message = f"""Here is the Deep Code Analysis of the Repository:
            
            README CONTENT (Context):
            {context_data.get('readme_content', 'No README')}
            
            TECH STACK: {', '.join(context_data.get('tech_stack', []))}
            
            EVIDENCE CHECKLIST (Verified Features):
            {json.dumps(context_data.get('evidence', {}), indent=2)}
            
            ENTRY POINT ({context_data.get('entry_point_name')}):
            ```
            {context_data.get('entry_point_content')}
            ```
            
            FILE STRUCTURE (Top 200 files):
            {', '.join(context_data.get('file_tree', []))}
            """
        else:
            # Legacy string input
            full_user_message = f"Here is the Repository README:\n{context_data}"
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": get_system_prompt(tone)},
                {"role": "user", "content": full_user_message}
            ],
            response_format={ "type": "json_object" }
        )
        
        raw_text = response.choices[0].message.content
        
        return parse_ai_response(raw_text)
    except Exception as e:
        print(f"AI Generation Error: {e}")
        return None

def parse_ai_response(text: str):
    """
    Parses the valid JSON output from the AI.
    """
    import json
    try:
        data = json.loads(text)
        return {
            "twitter_thread": data.get("twitter_thread", ""),
            "linkedin_post": data.get("linkedin_post", ""),
            "blog_intro": data.get("blog_intro", ""),
            "slides": data.get("slides", [])
        }
    except json.JSONDecodeError:
        print("Failed to parse JSON response")
        return {
            "twitter_thread": "",
            "linkedin_post": "",
            "blog_intro": "",
            "slides": []
        }
