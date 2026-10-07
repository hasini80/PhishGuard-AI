// ==========================================
// PHISHGUARD AI - URL SCANNER
// ==========================================

const urlInput = document.getElementById("url");
const scanButton = document.getElementById("scanButton");


// ==========================================
// SCAN BUTTON
// ==========================================

scanButton.addEventListener("click", checkURL);


// Allow pressing ENTER to scan

urlInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        checkURL();
    }

});


// ==========================================
// EXAMPLE URL
// ==========================================

function useExample(exampleURL) {

    urlInput.value = exampleURL;

    checkURL();

}


// ==========================================
// CHECK URL
// ==========================================

async function checkURL() {

    const url = urlInput.value.trim();

    const resultSection =
        document.getElementById("resultSection");

    const riskText =
        document.getElementById("riskText");

    const riskIcon =
        document.getElementById("riskIcon");

    const riskDescription =
        document.getElementById("riskDescription");

    const scoreText =
        document.getElementById("scoreText");

    const scoreBar =
        document.getElementById("scoreBar");

    const analysisText =
        document.getElementById("analysisText");

    const reasonsContainer =
        document.getElementById("reasons");


    // ======================================
    // EMPTY URL
    // ======================================

    if (url === "") {

        alert("Please enter a URL first.");

        urlInput.focus();

        return;
    }


    // ======================================
    // SHOW RESULT AREA
    // ======================================

    resultSection.classList.remove("hidden");


    // ======================================
    // LOADING
    // ======================================

    riskText.textContent = "SCANNING";

    riskIcon.textContent = "🔍";

    riskDescription.textContent =
        "Analyzing URL security...";

    scoreText.textContent = "--/100";

    scoreBar.style.width = "0%";

    analysisText.textContent =
        "Checking URL patterns, phishing indicators and blockchain records...";

    reasonsContainer.innerHTML =
        `<div class="reason-item">
            🔍 Security scan in progress...
        </div>`;


    // ======================================
    // SCROLL TO RESULTS
    // ======================================

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });


    // ======================================
    // SEND TO FLASK BACKEND
    // ======================================

    try {

        const response = await fetch(
            "http://127.0.0.1:5001/check",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    url: url
                })
            }
        );


        const data = await response.json();


        // ==================================
        // BACKEND ERROR
        // ==================================

        if (!response.ok || data.error) {

            throw new Error(
                data.error || "Unable to analyze URL."
            );

        }


        // ==================================
        // DISPLAY RESULT
        // ==================================

        displayResult(data);

    }

    catch (error) {

        console.error(error);

        riskText.textContent = "ERROR";

        riskIcon.textContent = "⚠️";

        riskDescription.textContent =
            "Could not connect to the security server.";

        scoreText.textContent = "--/100";

        scoreBar.style.width = "0%";

        analysisText.textContent =
            "Please make sure the Flask backend is running.";

        reasonsContainer.innerHTML =
            `<div class="reason-item">
                ❌ Backend connection failed.
            </div>`;

    }

}


// ==========================================
// DISPLAY RESULT
// ==========================================

function displayResult(data) {

    const riskText =
        document.getElementById("riskText");

    const riskIcon =
        document.getElementById("riskIcon");

    const riskDescription =
        document.getElementById("riskDescription");

    const scoreText =
        document.getElementById("scoreText");

    const scoreBar =
        document.getElementById("scoreBar");

    const analysisText =
        document.getElementById("analysisText");

    const reasonsContainer =
        document.getElementById("reasons");


    const risk =
        data.risk || "LOW";

    const score =
        data.score || 0;

    const reasons =
        data.reasons || [];

    const aiAnalysis =
        data.ai_analysis ||
        "AI analysis is not available.";


    // ======================================
    // RISK LEVEL
    // ======================================

    riskText.textContent = risk;

    scoreText.textContent =
        score + "/100";

    scoreBar.style.width =
        score + "%";


    // ======================================
    // AI ANALYSIS
    // ======================================

    analysisText.textContent = aiAnalysis;


    // ======================================
    // LOW
    // ======================================

    if (risk === "LOW") {

        riskIcon.textContent = "🟢";

        riskDescription.textContent =
            "This URL appears safe based on the security checks.";

        riskText.style.color = "#22c55e";

    }


    // ======================================
    // MEDIUM
    // ======================================

    else if (risk === "MEDIUM") {

        riskIcon.textContent = "🟠";

        riskDescription.textContent =
            "This URL contains some suspicious characteristics.";

        riskText.style.color = "#f59e0b";

    }


    // ======================================
    // HIGH
    // ======================================

    else {

        riskIcon.textContent = "🔴";

        riskDescription.textContent =
            "This URL shows strong indicators of phishing.";

        riskText.style.color = "#ef4444";

    }


    // ======================================
    // DISPLAY REASONS
    // ======================================

    reasonsContainer.innerHTML = "";


    if (reasons.length === 0) {

        reasonsContainer.innerHTML =
            `<div class="reason-item">
                🟢 No suspicious indicators detected.
            </div>`;

        return;
    }


    reasons.forEach(function (reason) {

        const item =
            document.createElement("div");

        item.className = "reason-item";

        item.textContent = reason;

        reasonsContainer.appendChild(item);

    });

}