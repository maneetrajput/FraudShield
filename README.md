# FraudShield 🔐

FraudShield is a web-based suspicious message analyzer that identifies potential warning signs in messages using rule-based checks.

## Features

- Analyze text messages for potential scam indicators.
- Detect suspicious urgency and pressure tactics.
- Flag potentially unsafe requests for OTPs, passwords, or PINs.
- Identify suspicious payment requests and prize claims.
- Flag messages containing links for additional verification.
- Display a simple risk level and detected warning signs.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python, FastAPI
- **Validation:** Pydantic

## Project Structure

```text
FraudShield/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── main.py
│   └── requirements.txt
├── .gitignore
└── README.md
```

## Run Locally

### 1. Install dependencies

```bash
python -m pip install -r backend/requirements.txt
```

### 2. Start the backend

From the project root, run:

```bash
python -m uvicorn backend.main:app --reload
```

### 3. Start the frontend

Open `frontend/index.html` using VS Code Live Server.

The frontend communicates with the backend at:

`http://127.0.0.1:8000`

Interactive API documentation is available at:

`http://127.0.0.1:8000/docs`

## How It Works

The backend checks incoming messages against predefined rules and returns detected warning signs with a risk category.

## Limitations

FraudShield currently uses rule-based detection, not a trained machine learning model. It may miss scams or flag legitimate messages. A low-risk result does not guarantee that a message is safe.

## Future Improvements

- Expand scam detection rules.
- Improve the user interface and accessibility.
- Add a labeled dataset and evaluate detection performance.
- Explore machine learning-based classification.

## Disclaimer

FraudShield is an educational prototype. It should not be used as the sole basis for deciding whether a message is safe.