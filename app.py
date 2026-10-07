from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import urlparse
import re
import subprocess
import os

app = Flask(__name__)
CORS(app)

# ==========================================
# KNOWN PHISHING DOMAINS
# ==========================================

KNOWN_PHISHING_DOMAINS = {
    "fake-wallet-demo.com",
    "phishing-login-demo.com",
    "crypto-scam-demo.com"
}


# ==========================================
# HOME
# ==========================================

@app.route("/")
def home():
    return "PhishGuard AI Backend is Running!"


# ==========================================
# URL CHECKER
# ==========================================

@app.route("/check", methods=["POST"])
def check_url():

    data = request.get_json() or {}
    url = data.get("url", "").strip().lower()

    if not url:
        return jsonify({
            "error": "Please enter a URL."
        }), 400

    # ======================================
    # ADD HTTPS IF MISSING
    # ======================================

    test_url = url

    if not test_url.startswith(("http://", "https://")):
        test_url = "https://" + test_url

    # ======================================
    # PARSE URL
    # ======================================

    parsed = urlparse(test_url)

    domain = parsed.netloc.lower()
    domain = domain.split(":")[0]

    score = 0
    reasons = []

    # ======================================
    # BLOCKCHAIN CHECK
    # ======================================

    bridge_path = os.path.join(
        os.path.dirname(__file__),
        "blockchain",
        "bridge.cjs"
    )

    try:

        result = subprocess.run(
            ["node", bridge_path, domain],
            capture_output=True,
            text=True,
            timeout=5
        )

        if result.stdout.strip() == "true":

            return jsonify({
                "url": url,
                "domain": domain,
                "risk": "HIGH",
                "score": 100,
                "ai_analysis": (
                    "Blockchain verification found this domain "
                    "in the phishing registry."
                ),
                "reasons": [
                    "⛓️ Domain found in blockchain phishing registry"
                ]
            })

    except Exception as e:

        print("Blockchain check error:", e)

    # ======================================
    # KNOWN PHISHING DOMAIN
    # ======================================

    if domain in KNOWN_PHISHING_DOMAINS:

        return jsonify({
            "url": url,
            "domain": domain,
            "risk": "HIGH",
            "score": 100,
            "ai_analysis": (
                "This domain matches a known phishing domain "
                "in the security database."
            ),
            "reasons": [
                "🚨 Domain found in known phishing database"
            ]
        })

    # ======================================
    # SUSPICIOUS WORDS
    # ======================================

    suspicious_words = [
        "login",
        "verify",
        "wallet",
        "password",
        "claim",
        "bonus",
        "secure",
        "update",
        "account",
        "signin",
        "confirm",
        "payment"
    ]

    found_words = []

    for word in suspicious_words:

        if word in url and word not in found_words:

            found_words.append(word)
            score += 15

            reasons.append(
                "⚠️ Suspicious word detected: " + word
            )

    # ======================================
    # @ URL TRICK
    # ======================================

    if "@" in url:

        score += 25

        reasons.append(
            "🚨 URL contains an @ symbol, which can hide "
            "the real destination"
        )

    # ======================================
    # MANY HYPHENS
    # ======================================

    if domain.count("-") >= 3:

        score += 15

        reasons.append(
            "⚠️ Domain contains many hyphens"
        )

    # ======================================
    # IP ADDRESS
    # ======================================

    if re.match(
        r"^\d{1,3}(\.\d{1,3}){3}$",
        domain
    ):

        score += 30

        reasons.append(
            "🚨 Website uses an IP address instead of "
            "a normal domain"
        )

    # ======================================
    # LOOKALIKE DOMAINS
    # ======================================

    lookalikes = [
        "paypa1",
        "paypai",
        "g00gle",
        "micros0ft",
        "faceb00k",
        "amaz0n",
        "app1e"
    ]

    for word in lookalikes:

        if word.lower() in url:

            score += 40

            reasons.append(
                "🚨 Possible lookalike domain detected"
            )

            break

    # ======================================
    # LONG URL
    # ======================================

    if len(url) > 100:

        score += 10

        reasons.append(
            "⚠️ URL is unusually long"
        )

    # ======================================
    # TOO MANY SUBDOMAINS
    # ======================================

    if domain.count(".") >= 3:

        score += 15

        reasons.append(
            "⚠️ Domain contains multiple subdomains"
        )

    # ======================================
    # HTTPS CHECK
    # ======================================

    if not test_url.startswith("https://"):

        score += 10

        reasons.append(
            "⚠️ Website does not use HTTPS"
        )

    # ======================================
    # LIMIT SCORE
    # ======================================

    score = min(score, 100)

    # ======================================
    # RISK LEVEL
    # ======================================

    if score >= 50:

        risk = "HIGH"

    elif score >= 25:

        risk = "MEDIUM"

    else:

        risk = "LOW"

    # ======================================
    # SAFE URL
    # ======================================

    if not reasons:

        reasons.append(
            "🟢 No major suspicious pattern detected"
        )

    # ======================================
    # EXPLAINABLE AI ANALYSIS
    # ======================================

    if risk == "HIGH":

        ai_analysis = (
            "AI analysis indicates a high phishing risk. "
            "The URL contains multiple suspicious characteristics "
            "that may indicate an attempt to deceive users."
        )

    elif risk == "MEDIUM":

        ai_analysis = (
            "AI analysis indicates a moderate phishing risk. "
            "Some suspicious URL characteristics were detected, "
            "so the link should be verified before opening."
        )

    else:

        ai_analysis = (
            "AI analysis indicates a low phishing risk. "
            "No major suspicious URL characteristics were detected."
        )

    # ======================================
    # RESPONSE
    # ======================================

    return jsonify({
        "url": url,
        "domain": domain,
        "risk": risk,
        "score": score,
        "ai_analysis": ai_analysis,
        "reasons": reasons
    })


# ==========================================
# START SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5001
    )