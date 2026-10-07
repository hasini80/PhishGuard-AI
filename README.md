# PhishGuard AI 🛡️

PhishGuard AI is a smart phishing URL detection system that analyzes suspicious links and provides a risk score with reasons.

## Features

- URL risk analysis
- Suspicious keyword detection
- Lookalike domain detection
- IP address detection
- Known phishing domain database
- Blockchain-based phishing domain registry
- Explainable security analysis
- Dark-themed user interface

## Technology Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- Flask
- Flask-CORS

### Blockchain
- Solidity
- Hardhat
- Node.js
- ethers.js

## Blockchain Architecture

User → Frontend → Flask Backend → Node.js Bridge → Smart Contract → Hardhat Blockchain

The `PhishingRegistry` smart contract stores phishing domains and provides the `isPhishingDomain()` function to verify whether a domain is registered.

## Demo

Example URLs:

- Safe: `https://example.com`
- Suspicious: `https://example.com/login-wallet`
- Lookalike: `https://paypa1-login.com`
- Blockchain: `https://blockchain-phishing-demo.com`

## Future Scope

- Deploy the smart contract to a public testnet
- Integrate a trained machine-learning model
- Build a browser extension
- Connect real-time threat-intelligence feeds

## Disclaimer

This is a prototype developed for demonstration and educational purposes.
