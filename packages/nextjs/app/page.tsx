"use client";

import { useEffect, useState } from "react";
import NFTLLAVE1 from "../../hardhat/deployments/arbitrumSepolia/NFTLLAVE1.json";
import RBUToken from "../../hardhat/deployments/arbitrumSepolia/RBUToken.json";
import Fundamentals from "../components/scaffold-eth/Fundamentals";
import RegisterWhitelistButton from "../components/scaffold-eth/RegisterWhitelistButton";
import { ethers } from "ethers";
import type { NextPage } from "next";

const nftContractAddress = NFTLLAVE1.address;
const nftAbi = NFTLLAVE1.abi;

const rbuContractAddress = RBUToken.address;
const rbuAbi = RBUToken.abi;

const Home: NextPage = () => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isProcessingNFT, setIsProcessingNFT] = useState(false);
  const [isProcessingRBU, setIsProcessingRBU] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      setIsMetaMaskInstalled(true);
    }
  }, []);

  const handleClaimNFT = async () => {
    setErrorMessage("");
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask no está instalada o no está disponible.");
      }
      setIsProcessingNFT(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nftContract = new ethers.Contract(nftContractAddress, nftAbi, signer);
      const tx = await nftContract.createToken();
      console.log("Transacción enviada:", tx.hash);
      await tx.wait();
      alert("¡NFT Llave 1 reclamado con éxito!");
    } catch (error) {
      console.error("Error al reclamar NFT:", error);
      setErrorMessage("Hubo un error al reclamar el NFT. Revisa los detalles.");
    } finally {
      setIsProcessingNFT(false);
    }
  };

  const handleClaimToken = async () => {
    setErrorMessage("");
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask no está instalada o no está disponible.");
      }
      setIsProcessingRBU(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const rbuContract = new ethers.Contract(rbuContractAddress, rbuAbi, signer);

      const amountToClaim = ethers.parseUnits("4", 18); // 4 RBU Tokens
      const tx = await rbuContract.claimToken(await signer.getAddress(), amountToClaim);
      console.log("Transacción enviada:", tx.hash);
      await tx.wait();
      alert("¡Tokens RBU reclamados con éxito!");
    } catch (error) {
      console.error("Error al reclamar tokens RBU:", error);
      setErrorMessage("Hubo un error al reclamar los tokens. Revisa los detalles.");
    } finally {
      setIsProcessingRBU(false);
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
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="flex-grow w-full mt-60 px-8 py-12" style={{ background: "transparent" }}>
        <div className="flex justify-center items-center gap-9 flex-wrap">
          <RegisterWhitelistButton />
          <button
            className={`bg-white text-black font-bold px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 ${
              isProcessingNFT ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleClaimNFT}
            disabled={isProcessingNFT}
          >
            {isProcessingNFT ? "Procesando NFT..." : "Reclamar NFT Llave 1"}
          </button>
          <button
            className={`bg-white text-black font-bold px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 ${
              isProcessingRBU ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleClaimToken}
            disabled={isProcessingRBU}
          >
            {isProcessingRBU ? "Procesando Token..." : "Reclamar RBU Token"}
          </button>
          <button className="bg-gray-400 text-black px-6 py-3 rounded-lg shadow-md cursor-not-allowed" disabled>
            Botón de RV Token (En desarrollo)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
