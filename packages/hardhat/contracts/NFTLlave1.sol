// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTLLAVE1 is ERC1155, Ownable, ReentrancyGuard {
    uint256 public constant LLAVE1 = 1; // Token ID for LLAVE1
    uint256 public constant MINT_COST = 0.0005 ether; // Cost to mint
    mapping(address => bool) public authorizedMinters; // Track authorized wallets
    mapping(address => bool) public hasMinted; // Track if a wallet has minted

    // Constructor with initial owner
    constructor(address initialOwner) ERC1155("https://blush-fantastic-rooster-314.mypinata.cloud/ipfs/QmbVKgMBpGBLganzS4k1GPQoKXLpaNVy4UBhdESitXH8Kt/{id}.json"
) Ownable(0x8869685b9a5bF8a8450B9fE9944E5E3D287d8F77) {}

    // Function to authorize wallets to mint
    function authorizeWallets(address[] calldata wallets) external onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            authorizedMinters[wallets[i]] = true;
        }
    }

    // Function to revoke authorization
    function revokeWallets(address[] calldata wallets) external onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            authorizedMinters[wallets[i]] = false;
        }
    }

    // Mint function
    function mint() external payable nonReentrant {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        require(!hasMinted[msg.sender], "NFT already minted");
        require(msg.value == MINT_COST, "Incorrect ETH amount");

        hasMinted[msg.sender] = true; // Mark wallet as minted
        _mint(msg.sender, LLAVE1, 1, ""); // Mint 1 token of type LLAVE1
    }

    // Withdraw collected ETH to the owner's wallet
    function withdraw() external onlyOwner nonReentrant {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    // Fallback to receive ETH
    receive() external payable {}
    fallback() external payable {}
}