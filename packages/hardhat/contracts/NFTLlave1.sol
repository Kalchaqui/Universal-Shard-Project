// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTLLAVE1 is ERC721, Ownable {
    string private _baseURIextended;

    address public router; // Declare and initialize the Router
    uint256 private _currentTokenId; // Variable para llevar el control de los tokens emitidos
    
    // Constructor de NFTLLAVE1
    constructor(address initialOwner) ERC721("NFT Llave", "LLAVE") Ownable(0x8869685b9a5bF8a8450B9fE9944E5E3D287d8F77) {
        
        // Aquí Ownable no necesita un constructor vacío. 
        // La dirección del propietario se pasa directamente al constructor de Ownable
        transferOwnership(initialOwner); // Llama al constructor de Ownable con la dirección del propietario inicial
        _baseURIextended = "";
        
        // Inicializar la dirección del router (puedes dejarla como address(0) si no se desea asignar una dirección aún)
        router = address(0); // O puedes poner una dirección válida si es necesario
        _currentTokenId = 0; // Inicializar el contador de tokens
    }

    // Modificador para permitir solo al propietario o al router
    modifier onlyOwnerOrRouter() {
        require(msg.sender == owner() || msg.sender == router, "Only the contract's owner or Router can call this");
        _;
    }

    // Función para crear un solo token
    function createToken() external onlyOwnerOrRouter {
        _safeMint(address(this), _currentTokenId + 1); // Mint a new token for the contract itself
        _currentTokenId++; // Incrementar el contador de tokens
    }

    // Función para crear múltiples tokens para un creador con un nombre
    function createTokensForCreator(string memory name) external onlyOwnerOrRouter {
        _mintTokenForCreator(name);
    }

    // Función interna para crear un token con metadata para el creador
    function _mintTokenForCreator(string memory name) internal {
        uint256 tokenId = _currentTokenId + 1; // Usar el contador para asignar el siguiente tokenId
        _safeMint(msg.sender, tokenId); // Mint the token for the creator
        _setTokenUri(tokenId, name); // Set token URI (assuming you have a _setTokenUri function)
        _currentTokenId++; // Incrementar el contador de tokens
    }

    // Función para crear múltiples tokens
    function createTokens(address recipient, uint256 quantity) external onlyOwnerOrRouter {
        require(recipient != address(0), "Recipient cannot be the zero address");

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _currentTokenId + 1; // Usar el contador para asignar el siguiente tokenId
            _safeMint(recipient, tokenId); // Mint the token for the recipient
            _setTokenUri(tokenId, "some metadata URI"); // Set the URI for the token
            _currentTokenId++; // Incrementar el contador de tokens
        }
    }

    // Función para establecer URI de un token
    function _setTokenUri(uint256 tokenId, string memory uri) internal {
        // Esta función debería establecer el URI de los metadatos para el token correspondiente
    }
}