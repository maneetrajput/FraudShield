const messageInput = document.getElementById("messageInput");
const characterCount = document.getElementById("characterCount");
const checkButton = document.getElementById("checkButton");
const clearButton = document.getElementById("clearButton");

const apiStatus = document.getElementById("apiStatus");
const resultCard = document.getElementById("resultCard");
const resultMessage = document.getElementById("resultMessage");
const resultDetails = document.getElementById("resultDetails");
const resultDisclaimer = document.getElementById("resultDisclaimer");

// Update the character count as the user types.
messageInput.addEventListener("input", () => {
    characterCount.textContent = `${messageInput.value.length} characters`;
});

// Clear the message and previous results.
clearButton.addEventListener("click", () => {
    messageInput.value = "";
    characterCount.textContent = "0 characters";

    resultCard.hidden = true;
    apiStatus.textContent = "Ready to check your message";

    messageInput.focus();
});

// Send the message to the FastAPI backend.
checkButton.addEventListener("click", async () => {
    const message = messageInput.value.trim();

    if (!message) {
        apiStatus.textContent = "Please enter a message first.";
        messageInput.focus();
        return;
    }

    checkButton.disabled = true;
    checkButton.textContent = "Checking...";
    apiStatus.textContent = "Analyzing message...";
    resultCard.hidden = true;

    try {
        const response = await fetch("http://127.0.0.1:8000/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            throw new Error("The server could not analyze the message.");
        }

        const data = await response.json();

        displayResults(data);

        apiStatus.textContent = "Analysis complete";
    } catch (error) {
        console.error("FraudShield error:", error);

        apiStatus.textContent =
            "Could not connect to the backend. Make sure FastAPI is running.";

        resultCard.hidden = false;
        resultMessage.textContent = "Unable to analyze this message";
        resultDetails.replaceChildren();

        const warning = document.createElement("p");
        warning.textContent =
            "Start the FastAPI server and try again.";
        resultDetails.appendChild(warning);

        resultDisclaimer.textContent =
            "This is a connection error, not a fraud verdict.";
    } finally {
        checkButton.disabled = false;
        checkButton.textContent = "Check Message";
    }
});

// Display the analysis returned by the backend.
function displayResults(data) {
    resultCard.hidden = false;
    resultDetails.replaceChildren();

    const riskLevel = String(data.risk_level || "Unknown");
    const warnings = Array.isArray(data.warnings) ? data.warnings : [];

    resultMessage.textContent =
        data.message || `Risk level: ${riskLevel}`;

    if (warnings.length === 0) {
        const item = document.createElement("p");
        item.textContent = "No warning signs were detected by our current checks.";
        resultDetails.appendChild(item);
    } else {
        const heading = document.createElement("h3");
        heading.textContent = "Warning signs detected:";
        resultDetails.appendChild(heading);

        const list = document.createElement("ul");

        warnings.forEach((warningText) => {
            const item = document.createElement("li");
            item.textContent = String(warningText);
            list.appendChild(item);
        });

        resultDetails.appendChild(list);
    }

    resultDisclaimer.textContent =
        "FraudShield uses basic rule-based checks. It can make mistakes, so verify suspicious messages independently.";
}