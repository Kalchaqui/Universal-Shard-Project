// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RBUToken is ERC20, Ownable(0x8869685b9a5bF8a8450B9fE9944E5E3D287d8F77) {
    address public router; // Dirección del contrato enrutador
    uint256 public totalClaims; // Contador de reclamos registrados
    uint256 public constant MIN_CLAIM = 4 * 10**18; // Mínimo a reclamar (4 RBU tokens)
    uint256 public constant MAX_CLAIM = 4 * 10**18; // Máximo a reclamar (4 RBU tokens)

    // Estructura para almacenar detalles de interacciones
    struct ClaimLog {
        address user;
        uint256 amount;
        uint256 timestamp;
    }

    // Array para almacenar todos los reclamos realizados
    ClaimLog[] public claimLogs;

    // Evento para registrar cada reclamo
    event Claimed(address indexed user, uint256 amount, uint256 timestamp);

    // Modificador para permitir solo al router
    modifier _onlyRouter() { 
        require(msg.sender == router, "Only the router can call this function.");
        _;
    }

    constructor() ERC20("RBU Token", "RBU") {
        // Inicialización del contrato
        _mint(msg.sender, 1000 * 10**18); // Mintear tokens iniciales para el deployer
    }

    // Establecer la dirección del router
    function setRouter(address _router) external onlyOwner {
        require(_router != address(0), "Direccion invalida");
        router = _router;
    }

    // Reclamar tokens, solo el router puede llamar esta función
    function claimToken(address to, uint256 amount) external _onlyRouter returns (bool) {
        // Requerimientos para realizar el reclamo
        require(to != address(0), "Direccion invalida");
        require(amount >= MIN_CLAIM && amount <= MAX_CLAIM, "La cantidad debe ser exactamente 4 RBU tokens");

        _mint(to, amount);

        // Registrar la interacción en el log
        claimLogs.push(ClaimLog({
            user: to,
            amount: amount,
            timestamp: block.timestamp
        }));

        // Incrementar contador de reclamos
        totalClaims++;

        // Emitir evento para la interacción
        emit Claimed(to, amount, block.timestamp);

        return true;
    }

    // Obtener un log específico de reclamos
    function getClaimLog(uint256 index) external view returns (ClaimLog memory) {
        require(index < claimLogs.length, "Indice fuera de rango");
        return claimLogs[index];
    }

    // Obtener el total de reclamos
    function getTotalClaims() external view returns (uint256) {
        return totalClaims;
    }
}