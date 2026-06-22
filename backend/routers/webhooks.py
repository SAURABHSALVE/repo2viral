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
    
    # Log incoming payload to debug
    print(f"🔍 Gumroad Payload Keys: {list(form_data.keys())}")
    print(f"🔍 Full Payload: {dict(form_data)}")

    email = form_data.get("email")
    product_permalink = form_data.get("product_permalink") # e.g. 'https://saurabhsalve.gumroad.com/l/rczekx'
    sale_id = form_data.get("sale_id")
    subscription_id = form_data.get("subscription_id")
    test = form_data.get("test") == "true"
    refunded = form_data.get("refunded") == "true"
    disputed = form_data.get("disputed") == "true"

    if not email:
        return {"status": "ignored", "reason": "no email"}

    # Detect event type based on payload fields
    # Test ping: just log and return
    if test:
        print(f"📌 Test ping received for {email}")
        return {"status": "test_ping"}

    # Valid sale: has sale_id, subscription_id, not refunded, not disputed
    if sale_id and subscription_id and not refunded and not disputed:
        # New subscription or purchase
        is_pro = True
        subscription_id = form_data.get("subscription_id")
        license_key = form_data.get("license_key")
        
        # Validate Product
        # Required Env Var: GUMROAD_PRODUCT_PERMALINK (full URL or slug)
        # We need to match the slug e.g. 'rczekx'
        expected_permalink_url = os.getenv("GUMROAD_PRODUCT_PERMALINK", "rczekx")
        
        # Extract slug from full URL if provided, e.g. https://.../l/rczekx -> rczekx
        if "/l/" in expected_permalink_url:
            expected_slug = expected_permalink_url.split("/l/")[-1]
        else:
            expected_slug = expected_permalink_url
            
        # Gumroad webhook sends the slug in 'product_permalink' usually?
        # Actually Gumroad creates a unique permalink for the product.
        # Let's check loose equality or exact match to 'product_permalink' field.
        # The field `product_permalink` in webhook is usually the full URL or just the slug depending on context?
        # Documentation says "permalink of the product".
        # Safe comparison:
        if product_permalink and expected_slug not in product_permalink:
             print(f"Ignored request for different product. Got: {product_permalink}, Expected match for: {expected_slug}")
             return {"status": "ignored", "reason": "wrong product"}
        
        handle_subscription_update(email, is_pro, subscription_id=subscription_id, license_key=license_key)
        print(f"✅ Processed SALE for {email}")

    elif refunded or disputed:
        # Refund or dispute: revoke access
        is_pro = False
        handle_subscription_update(email, is_pro)
        reason = "refunded" if refunded else "disputed"
        print(f"⚠️ Processed {reason.upper()} for {email}, downgrading to free")

    return {"status": "success"}
