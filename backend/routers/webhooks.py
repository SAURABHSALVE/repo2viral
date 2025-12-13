from fastapi import APIRouter, Request, HTTPException, status
from services.usage_service import handle_subscription_update
import os
import hashlib
import hmac

router = APIRouter()

GUMROAD_SECRET = os.getenv("GUMROAD_COMMUNICATION_SECRET")

@router.post("/gumroad", status_code=status.HTTP_200_OK)
async def gumroad_webhook(request: Request):
    if not GUMROAD_SECRET:
         print("GUMROAD_COMMUNICATION_SECRET is not set. Skipping verification (unsafe in prod).")
         # In production, this should be a hard error.
    
    # 1. Get Signature
    # Gumroad sends 'x-gumroad-signature' if a secret is configured.
    # Note: If no secret is set in Gumroad, this header might be missing or verification not needed.
    # But user specifically asked for verification.
    signature = request.headers.get("x-gumroad-signature")
    
    # 2. Get Raw Body
    body = await request.body()
    
    # 3. Verify Signature
    if GUMROAD_SECRET:
        if not signature:
            raise HTTPException(status_code=400, detail="Missing x-gumroad-signature header")
        
        # Verify
        # hmac.new(key, msg, digest).hexdigest()
        expected_signature = hmac.new(
            GUMROAD_SECRET.encode("utf-8"),
            body,
            hashlib.sha256
        ).hexdigest()
        
        if signature != expected_signature:
             print(f"Invalid signature. Expected {expected_signature}, got {signature}")
             raise HTTPException(status_code=403, detail="Invalid signature")

    # 4. Parse Form Data
    # Gumroad sends application/x-www-form-urlencoded
    form_data = await request.form()
    
    # Log incoming (excluding secrets)
    # print(f"Gumroad Payload: {form_data}") 
    
    event = form_data.get("resource_name") # 'sale', 'cancellation', etc.
    email = form_data.get("email")
    product_permalink = form_data.get("product_permalink") # e.g. 'rczekx'
    
    if not email:
        return {"status": "ignored", "reason": "no email"}

    # Handle Events
    if event == "sale":
        # New subscription or purchase
        is_pro = True
        subscription_id = form_data.get("subscription_id")
        license_key = form_data.get("license_key")
        
        # Validate Product
        if product_permalink != "rczekx":
            print(f"Ignored request for different product: {product_permalink}")
            return {"status": "ignored", "reason": "wrong product"}
        
        handle_subscription_update(email, is_pro, subscription_id=subscription_id, license_key=license_key)
        print(f"✅ Processed SALE for {email}")

    elif event in ["cancellation", "refund"]:
        # Subscription ended
        is_pro = False
        handle_subscription_update(email, is_pro)
        print(f"Processed {event.upper()} for {email}")
    
    elif event == "ping":
        # Test ping
        print("Received Gumroad ping.")
        
    else:
        print(f"Unhandled Gumroad event: {event}")

    return {"status": "success"}
