"use client";

import Fundamentals from "../components/scaffold-eth/Fundamentals";
import RegisterWhitelistButton from "../components/scaffold-eth/RegisterWhitelistButton";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const handleClaimNFT = () => {
    alert("Reclamar NFT Llave 1: Funcionalidad aún por conectar");
  };

  const handleClaimToken = () => {
    alert("Reclamar RBU Token: Funcionalidad aún por conectar");
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 id="margin" className="text-center">
            <span className="block text-2xl mb-2">Bienvenidos</span>
            <span className="block text-4xl font-bold">Universal Shard Project</span>
          </h1>
        </div>
        <Fundamentals />

        {/* Contenedor de los botones */}
        <div className="flex-grow w-full mt-60 px-8 py-12" style={{ background: "transparent" }}>
          <div className="flex justify-center items-center gap-9 flex-wrap">
            {/* Botón Registrar en Whitelist */}
            <RegisterWhitelistButton />

            {/* Botón Reclamar NFT Llave 1 */}
            <button
              className="bg-white text-black border border-black px-6 py-3 rounded-lg shadow-md hover:bg-gray-100"
              onClick={handleClaimNFT}
            >
              Reclamar NFT Llave 1
            </button>

            {/* Botón Reclamar RBU Token */}
            <button
              className="bg-white text-black border border-black px-6 py-3 rounded-lg shadow-md hover:bg-gray-100"
              onClick={handleClaimToken}
            >
              Reclamar RBU Token
            </button>

            {/* Botón de RV Token (En desarrollo) */}
            <button
              className="bg-white text-black border border-black px-6 py-3 rounded-lg shadow-md hover:bg-gray-100"
              disabled
            >
              Botón de RV Token (En desarrollo)
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
