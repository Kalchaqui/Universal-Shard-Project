// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract UnifiedFactionToken is ERC1155, Ownable, ReentrancyGuard {
    // Tokens de facción
    uint256 public constant RV_TOKEN = 0; // RV Token
    uint256 public constant LLAVE1_NFT = 7; // NFT Llave1

    uint256 public constant AA_TOKEN = 1;
    uint256 public constant EE_TOKEN = 2;
    uint256 public constant AE_TOKEN = 3;
    uint256 public constant EA_TOKEN = 4;

    // NFTs de facción
    uint256 public constant NFT_DOMINANTE = 5;
    uint256 public constant NFT_RECESIVO = 6;

    // Dirección del router
    address public router;
    mapping(address => bool) public allowedMinters;

    // Estructuras y mapeos para logs y datos
    struct Scores {
        int256 reputation;
        int256 wealth;
        int256 total;
    }
    struct FactionNFT {
        uint256 dominant;
        uint256 recessive;
        bool exists;
    }
    struct MintLog {
        address user;
        uint256 tokenId;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => Scores) public userScores;
    mapping(address => FactionNFT) public userFactionNFTs;
    MintLog[] public factionTokenLogs;
    mapping(address => MintLog[]) public userFactionTokenLogs;

    // Eventos
    event FactionNFTMinted(address indexed user, uint256 dominant, uint256 recessive);
    event FactionNFTUpgraded(address indexed user, uint256 tokenId, string upgradeType);
    event SoulboundTokenMinted(address indexed to, uint256 id, uint256 amount);
    event SoulboundTokenBurned(address indexed from, uint256 id, uint256 amount);
    event FactionTokenObtained(address indexed user, uint256 factionTokenId, uint256 rvTokenAmount, uint256 burnPercentage, uint256 stakePercentage);

 constructor(address _router, address initialOwner) ERC1155("https://game.example/api/item/{id}.json") Ownable(initialOwner) {
    router = _router;
}



    // Modificadores
    modifier onlyRouter() {
        require(msg.sender == router, "Solo el enrutador puede interactuar");
        _; 
    }

    // Función para obtener tokens de facción
    function obtainFactionToken(address user, uint256 optionSelected) external onlyRouter nonReentrant {
        require(balanceOf(user, LLAVE1_NFT) > 0, "Se requiere NFT Llave1");
        require(balanceOf(user, RV_TOKEN) >= 1, "Se requiere al menos 1 RV TOKEN");

        uint256 factionTokenId;
        uint256 burnPercentage;
        uint256 stakePercentage;

        if (optionSelected == 1) {
            factionTokenId = AA_TOKEN;
            burnPercentage = 100;
        } else if (optionSelected == 2) {
            factionTokenId = EE_TOKEN;
            stakePercentage = 100;
        } else if (optionSelected == 3) {
            factionTokenId = AE_TOKEN;
            burnPercentage = 60;
            stakePercentage = 40;
        } else if (optionSelected == 4) {
            factionTokenId = EA_TOKEN;
            burnPercentage = 40;
            stakePercentage = 60;
        } else {
            revert(unicode"Opción inválida");
        }

        factionTokenLogs.push(MintLog(user, factionTokenId, 1, block.timestamp));
        userFactionTokenLogs[user].push(MintLog(user, factionTokenId, 1, block.timestamp));
        emit FactionTokenObtained(user, factionTokenId, 1, burnPercentage, stakePercentage);
        _mint(user, factionTokenId, 1, "");
    }

    // Función para mintear NFTs de facción
    function mintFactionNFT(uint256 dominantFaction, uint256 recessiveFaction) external nonReentrant {
        require(dominantFaction != recessiveFaction, "Facciones deben ser diferentes");
        require(balanceOf(msg.sender, dominantFaction) >= 21, "Tokens dominantes insuficientes");
        require(balanceOf(msg.sender, recessiveFaction) >= 11, "Tokens recesivos insuficientes");

        _burn(msg.sender, dominantFaction, 20);
        _burn(msg.sender, recessiveFaction, 10);
        userFactionNFTs[msg.sender] = FactionNFT(dominantFaction, recessiveFaction, true);
        emit FactionNFTMinted(msg.sender, dominantFaction, recessiveFaction);
        _mint(msg.sender, NFT_DOMINANTE, 1, "");
        _mint(msg.sender, NFT_RECESIVO, 1, "");
    }

    // Función para mejorar NFTs de facción
    function upgradeFactionNFT(string memory upgradeType) external nonReentrant {
        FactionNFT storage factionNFT = userFactionNFTs[msg.sender];
        require(factionNFT.exists, (unicode"No posee un NFT de facción"));

        if (keccak256(abi.encodePacked(upgradeType)) == keccak256(abi.encodePacked("dominant"))) {
            require(balanceOf(msg.sender, factionNFT.dominant) >= 20, "Tokens dominantes insuficientes");
            _burn(msg.sender, factionNFT.dominant, 20);
        } else if (keccak256(abi.encodePacked(upgradeType)) == keccak256(abi.encodePacked("recessive"))) {
            require(balanceOf(msg.sender, factionNFT.recessive) >= 10, "Tokens recesivos insuficientes");
            _burn(msg.sender, factionNFT.recessive, 10);
        } else {
            revert("TIPO DE MEJORA INVALIDO");
        }

        emit FactionNFTUpgraded(msg.sender, factionNFT.dominant, upgradeType);
    }

    // Funciones Soulbound
    function mintSoulbound(address to, uint256 id, uint256 amount) external onlyRouter nonReentrant {
        _mint(to, id, amount, "");
        emit SoulboundTokenMinted(to, id, amount);
    }

    function burnSoulbound(address from, uint256 id, uint256 amount) external nonReentrant {
        require(msg.sender == from || msg.sender == router, "No autorizado para quemar");
        _burn(from, id, amount);
        emit SoulboundTokenBurned(from, id, amount);
    }

    // Gestión de minters
    function setAllowedMinter(address minter, bool allowed) public onlyOwner {
        allowedMinters[minter] = allowed;
    }

    // Función para actualizar el URI
    function setURI(string memory newURI) public onlyOwner {
        _setURI(newURI);
    }

    // Consultar logs
    function getFactionTokenLogs() external view returns (MintLog[] memory) {
        return factionTokenLogs;
    }

    function getUserFactionTokenLogs(address user) external view returns (MintLog[] memory) {
        return userFactionTokenLogs[user];
    }
}

