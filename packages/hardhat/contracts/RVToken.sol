// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RVToken is ERC20, Ownable {
    uint256 public blockCooldown = 24 hours; // Cooldown entre bloques
    uint256 public lastBlockTime; // Marca temporal del último bloque emitido
    uint256 public tokensPerKey; // RV TOKEN inicial por cada LLAVE1
    address public collateralWallet; // Billetera colateral
    uint256 public collateralFee = 0.00025 ether; // Tarifa adicional
    address public router; // Dirección del contrato enrutador

    mapping(uint256 => uint256) public blockSupply; // Suministro por bloque
    mapping(address => uint256) public cooldowns; // Cooldowns por billetera

    constructor(address _collateralWallet, address _router) 
        ERC20("RV Token", "RVT") 
        Ownable(0x7c46F2F14164CB725292a313612d42E421Ba8c99) 
    {
        collateralWallet = _collateralWallet;
        router = _router;
        lastBlockTime = block.timestamp;
        tokensPerKey = 6 * 10 ** decimals(); // RV TOKEN inicial por cada LLAVE1
    }

    modifier onlyRouter() {
        require(msg.sender == router, "Access restricted to the router");
        _;
    }

    function mintTokens(uint256 keysOwned, address to) external payable onlyRouter {
        require(block.timestamp >= lastBlockTime + blockCooldown, "Cooldown active");
        require(msg.value >= collateralFee, "Insufficient ETH for collateral fee");

        uint256 currentBlockSupply = blockSupply[block.number];
        if (currentBlockSupply == 0) {
            // Inicia un nuevo bloque si no hay suministro disponible
            uint256 totalSupply = keysOwned * tokensPerKey;
            blockSupply[block.number] = totalSupply;
            currentBlockSupply = totalSupply;
            lastBlockTime = block.timestamp;
        }

        require(currentBlockSupply >= 2 * 10 ** decimals(), "Insufficient block supply");

        // Transferencia de la tarifa adicional a la billetera colateral
        payable(collateralWallet).transfer(msg.value);

        // Mint tokens al destinatario
        uint256 mintAmount = 2 * 10 ** decimals();
        _mint(to, mintAmount);

        // Reduce el suministro disponible del bloque actual
        blockSupply[block.number] -= mintAmount;
    }

    function burnRBU(address burner, uint256 amount) external onlyRouter {
        require(balanceOf(burner) >= amount, "Insufficient RBU balance to burn");
        _burn(burner, amount);
    }

    function setCooldown(address user, uint256 cooldownTime) external onlyRouter {
        cooldowns[user] = block.timestamp + cooldownTime;
    }

    function getCooldownRemaining(address user) external view returns (uint256) {
        if (block.timestamp >= cooldowns[user]) return 0;
        return cooldowns[user] - block.timestamp;
    }

    function setCollateralWallet(address newWallet) external onlyOwner {
        collateralWallet = newWallet;
    }

    function setRouter(address newRouter) external onlyOwner {
        router = newRouter;
    }
}

