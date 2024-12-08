"use client";

import { useEffect, useState } from "react";
import enrutadorData from "../hardhat/deployments/arbitrumSepolia/Enrutador.json";
import Fundamentals from "../components/scaffold-eth/Fundamentals";
import RegisterWhitelistButton from "../components/scaffold-eth/RegisterWhitelistButton";
import { BrowserProvider, Contract, parseEther } from "ethers";

const CONTRACT_ADDRESS = enrutadorData.address; // Dirección del contrato
const enrutadorAbi = enrutadorData.abi; // ABI del contrato

const RBU_TOKEN_ADDRESS = "0xf8bF1c13fc62e9a09e4e9e549431f950135Dd315";

const Home: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // Para mostrar mensajes de error o éxito

  // Borrar mensaje al presionar "Escape"
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMessage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Conectar MetaMask
  const connectWallet = async () => {
    setMessage(null); // Limpiar mensaje al interactuar
    if (!window.ethereum) {
      setMessage("MetaMask no está instalado. Por favor, instalalo para continuar.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      setMessage("Wallet conectada correctamente.");
    } catch (error: any) {
      setMessage(`Error al conectar la wallet: ${error.message}`);
    }
  };

  // Reclamar NFT Llave 1
  const handleClaimNFT = async () => {
    setMessage(null); // Limpiar mensaje al interactuar
    try {
      if (!walletAddress) throw new Error("Primero tenés que conectar tu wallet.");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const enrutadorContract = new Contract(CONTRACT_ADDRESS, enrutadorAbi, signer);
      const tx = await enrutadorContract.mintNFTLlave1({
        value: parseEther("0.0005"),
      });
      await tx.wait();
      setMessage("NFT Llave 1 reclamado exitosamente.");
    } catch (error: any) {
      if (error.code === 4001) {
        setMessage("Acción rechazada por el usuario.");
      } else if (error.message.includes("gas")) {
        setMessage("Error en la transacción: no hay suficiente gas.");
      } else {
        setMessage(`Error al reclamar el NFT: ${error.message}`);
      }
    }
  };
  // Reclamar RBU Token
  const handleClaimToken = async () => {
    setMessage(null); // Limpiar mensaje al interactuar
    try {
      if (!walletAddress) throw new Error("Primero tenés que conectar tu wallet.");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      // ABI Simplificado del contrato RBU
      const rbuAbi = [
        "function balanceOf(address account) external view returns (uint256)",
        "function claim(address to, uint256 amount) external",
      ];
      const rbuContract = new Contract(RBU_TOKEN_ADDRESS, rbuAbi, signer);
      // Verificar el balance del usuario
      try {
        const balance = await rbuContract.balanceOf(walletAddress);
        if (balance.lt(parseEther("8"))) {
          setMessage("Saldo insuficiente para interactuar con el contrato.");
          return;
        }
      } catch {
        // Ignorar errores de balanceOf
      }
      // Reclamar los tokens
      const enrutadorContract = new Contract(CONTRACT_ADDRESS, enrutadorAbi, signer);
      const tx = await enrutadorContract.routeToRBUToken();
      await tx.wait();
      setMessage("RBU Token reclamado exitosamente.");
    } catch (error: any) {
      if (error.code === 4001) {
        setMessage("Acción rechazada por el usuario.");
      } else {
        setMessage(null); // No mostrar mensajes adicionales
      }
    }
  };
  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 id="margin" className="text-center">
          <span className="block text-2xl mb-2">Bienvenidos</span>
          <span className="block text-4xl font-bold">Universal Shard Project</span>
        </h1>
      </div>
      <Fundamentals />

      <div className="flex-grow w-full mt-60 px-8 py-12" style={{ background: "transparent" }}>
        {/* Mostrar mensajes al usuario */}
        <div className="relative w-full">
          {message && (
            <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center py-2 z-50 shadow-md">{message}</div>
          )}
        </div>

        <div className="flex justify-center items-center gap-9 flex-wrap">
          {/* Botón Conectar Wallet */}
          <button
            className="bg-blue-500 text-black px-4 py-3 rounded-lg shadow-md hover:bg-blue-600"
            onClick={connectWallet}
          >
            {walletAddress ? `Wallet: ${walletAddress}` : "Conectar Wallet"}
          </button>

          {/* Botón Registrar en Whitelist */}
          <RegisterWhitelistButton />

          {/* Botón Reclamar NFT Llave 1 */}
          <button
            className="bg-blue-500 text-black px-4 py-3 rounded-lg shadow-md hover:bg-blue-600"
            onClick={handleClaimNFT}
          >
            Reclamar NFT Llave 1
          </button>

          {/* Botón Reclamar RBU Token */}
          <button
            className="bg-blue-500 text-black px-4 py-3 rounded-lg shadow-md hover:bg-blue-600"
            onClick={handleClaimToken}
          >
            Reclamar RBU Token
          </button>

          {/* Botón de RV Token (En desarrollo) */}
          <button className="bg-blue-500 text-black px-6 py-3 rounded-lg shadow-md hover:bg-blue-600" disabled>
            Botón de RV Token (En desarrollo)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
