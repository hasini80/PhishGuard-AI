// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PhishingRegistry {
    mapping(string => bool) private phishingDomains;

    function addDomain(string calldata domain) external {
        phishingDomains[domain] = true;
    }

    function isPhishingDomain(string calldata domain)
        external
        view
        returns (bool)
    {
        return phishingDomains[domain];
    }
}
