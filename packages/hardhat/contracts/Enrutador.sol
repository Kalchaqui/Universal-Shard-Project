// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


// Interfaces para contratos secundarios
interface INFTLlave1 {
    function isWhitelisted(address user) external view returns (bool);
    function mint(address to) external payable;
    function balanceOf(address owner) external view returns (uint256);
}

interface IRBUToken {
    function claim(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function transfer(address recipient, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
}

interface IRVToken {
    function claim(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function stake(address from, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
}

interface IFaccionToken {
    function mint(address to, uint256 tokenId, uint256 amount) external;
}

contract Enrutador is ReentrancyGuard {
    uint256 public constant BASE_RBU_COOLDOWN = 14400; // 4 hours in seconds
    address public owner;
    address public walletColateral; 
    address public nftLlave1Contract; 
    address public rbuTokenContract;
    address public rvTokenContract;
    address public faccionTokenContract;

    uint256 public constant MINT_FEE = 0.0005 ether;
    uint256 public constant MAX_ITERATIONS = 10;

    event UserInteracted(address indexed user, string contractType, uint256 cooldown);
    event RoutedInteraction(address indexed user, string routeType, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede realizar esta accion");
        _;
    }

    modifier hasNFTLlave(address user) {
        require(
            INFTLlave1(nftLlave1Contract).balanceOf(user) > 0,
            "Debes poseer el NFT Llave 1 para realizar esta accion"
        );
        _;
    }

    modifier validAddress(address addr) {
        require(addr != address(0), "Direccion invalida");
        _;
    }

    constructor(
        address _nftLlave1, 
        address _rbuToken, 
        address _rvToken, 
        address _faccionToken, 
        address _walletColateral
    ) 
        validAddress(_nftLlave1)
        validAddress(_rbuToken)
        validAddress(_rvToken)
        validAddress(_faccionToken)
        validAddress(_walletColateral)
    {
        nftLlave1Contract = _nftLlave1;
        rbuTokenContract = _rbuToken;
        rvTokenContract = _rvToken;
        faccionTokenContract = _faccionToken;
        walletColateral = _walletColateral;
        owner = msg.sender;
    }

    function setNFTLlave1Contract(address _nftLlave1Contract) external onlyOwner validAddress(_nftLlave1Contract) {
        nftLlave1Contract = _nftLlave1Contract;
    }

    function mintNFTLlave1() external payable nonReentrant {
        require(msg.value == MINT_FEE, "Monto incorrecto para mintear el NFT");
        
        INFTLlave1 llave1 = INFTLlave1(nftLlave1Contract);
        require(llave1.isWhitelisted(msg.sender), "No estas en la whitelist");

        (bool success, ) = walletColateral.call{value: msg.value}("");
        require(success, "Transferencia de fondos fallida");
        
        llave1.mint{value: msg.value}(msg.sender);
    }

    // Función para actualizar los cooldowns
    function updateCooldown(address user, string memory contractType, uint256 interactionCount) internal {
        require(interactionCount <= MAX_ITERATIONS, "Se excedio el maximo de iteraciones permitidas");
        uint256 newCooldown = BASE_RBU_COOLDOWN * fibonacci(interactionCount);
        emit UserInteracted(user, contractType, newCooldown);
    }

    // Lógica de Fibonacci limitada
    function fibonacci(uint256 n) internal pure returns (uint256) {
        require(n <= MAX_ITERATIONS, "Limite de Fibonacci alcanzado");
        if (n <= 1) return 1;
        uint256 a = 1;
        uint256 b = 1;
        for (uint256 i = 2; i <= n; i++) {
            uint256 temp = a;
            a = b;
            b = a + temp;
        }
        return b;
    }

    // Función para interactuar con RBU Token
    function routeToRBUToken() external nonReentrant {
        require(
            IRBUToken(rbuTokenContract).balanceOf(msg.sender) >= 8 * 10**18,
            "Saldo insuficiente de RBU tokens para interactuar"
        );
        IRBUToken(rbuTokenContract).claim(msg.sender, 2 * 10**18);
        emit RoutedInteraction(msg.sender, "RBU", 2 * 10**18);
    }

    // Validaciones y funciones de minteo de tokens
    function routeToMintAAToken() external nonReentrant {
        require(
            IRVToken(rvTokenContract).balanceOf(msg.sender) >= 1 * 10**18,
            "Saldo insuficiente de RV tokens para quemar"
        );
        IRVToken(rvTokenContract).burn(msg.sender, 1 * 10**18);
        IFaccionToken(faccionTokenContract).mint(msg.sender, 1, 1);
        emit RoutedInteraction(msg.sender, "AA Token", 1);
    }

    function routeToMintEEToken() external nonReentrant {
        require(
            IRVToken(rvTokenContract).balanceOf(msg.sender) >= 1 * 10**18,
            "Saldo insuficiente de RV tokens para stakear"
        );
        IRVToken(rvTokenContract).stake(msg.sender, 1 * 10**18);
        IFaccionToken(faccionTokenContract).mint(msg.sender, 2, 1);
        emit RoutedInteraction(msg.sender, "EE Token", 1);
    }

    function routeToMintAEToken() external nonReentrant {
        require(
            IRVToken(rvTokenContract).balanceOf(msg.sender) >= 1 * 10**18,
            "Saldo insuficiente de RV tokens para quemar y stakear"
        );
        IRVToken(rvTokenContract).burn(msg.sender, 0.6 * 10**18);
        IRVToken(rvTokenContract).stake(msg.sender, 0.4 * 10**18);
        IFaccionToken(faccionTokenContract).mint(msg.sender, 3, 1);
        emit RoutedInteraction(msg.sender, "AE Token", 1);
    }

    function routeToMintEAToken() external nonReentrant {
        require(
            IRVToken(rvTokenContract).balanceOf(msg.sender) >= 1 * 10**18,
            "Saldo insuficiente de RV tokens para stakear y quemar"
        );
        IRVToken(rvTokenContract).stake(msg.sender, 0.6 * 10**18);
        IRVToken(rvTokenContract).burn(msg.sender, 0.4 * 10**18);
        IFaccionToken(faccionTokenContract).mint(msg.sender, 4, 1);
        emit RoutedInteraction(msg.sender, "EA Token", 1);
    }
}