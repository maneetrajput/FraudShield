from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="FraudShield API",
    description="A rule-based suspicious message analysis API",
    version="1.0.0"
)

# Allow the local frontend to communicate with the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "null"
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class MessageRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {
        "message": "Welcome to FraudShield API!",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/analyze")
def analyze_message(request: MessageRequest):
    message = request.message.strip()
    text = message.lower()

    warnings = []

    if not message:
        return {
            "risk_level": "Unknown",
            "message": "Please provide a message to analyze.",
            "warnings": []
        }

    # Check for urgency and pressure.
    urgency_words = [
        "urgent",
        "immediately",
        "act now",
        "within 24 hours",
        "last chance"
    ]

    if any(word in text for word in urgency_words):
        warnings.append(
            "The message uses urgent language to pressure you into acting quickly."
        )

    # Check for requests involving sensitive information.
    sensitive_words = [
        "share your otp",
        "send your otp",
        "tell me your otp",
        "share your password",
        "send your password",
        "enter your pin"
    ]

    if any(word in text for word in sensitive_words):
        warnings.append(
            "The message may be asking for sensitive information such as an OTP, password, or PIN."
        )

    # Check for suspicious financial requests.
    payment_words = [
        "send money",
        "pay immediately",
        "transfer money",
        "pay processing fee",
        "claim your refund by paying"
    ]

    if any(word in text for word in payment_words):
        warnings.append(
            "The message contains a potentially suspicious payment request."
        )

    # Check for prize or reward claims.
    prize_words = [
        "you have won",
        "you won a prize",
        "claim your reward",
        "lottery winner",
        "free gift"
    ]

    if any(word in text for word in prize_words):
        warnings.append(
            "The message makes a prize or reward claim that should be verified."
        )

    # Check for threats involving account access.
    account_words = [
        "account will be blocked",
        "account suspended",
        "account will be closed",
        "verify your account immediately"
    ]

    if any(word in text for word in account_words):
        warnings.append(
            "The message threatens account restrictions or urges account verification."
        )

    # Check for links.
    if "http://" in text or "https://" in text or "www." in text:
        warnings.append(
            "The message contains a link. Verify the website independently before opening it."
        )

    # Determine a risk level from the number of warning signs.
    if len(warnings) >= 3:
        risk_level = "High"
        summary = "Multiple suspicious warning signs were detected."
    elif len(warnings) >= 1:
        risk_level = "Caution"
        summary = "Some warning signs were detected. Verify the message carefully."
    else:
        risk_level = "Low"
        summary = "No warning signs were detected by the current checks."

    return {
        "risk_level": risk_level,
        "message": summary,
        "warnings": warnings
    }