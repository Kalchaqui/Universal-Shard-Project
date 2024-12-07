import React, { useState } from "react";

const RegisterWhitelistButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [wallet, setWallet] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false); // Estado para el segundo modal

  const handleRegister = () => {
    if (!wallet || !email) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, ingresa un email válido.");
      return;
    }

    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!walletRegex.test(wallet)) {
      alert("Por favor, ingresa una dirección de wallet válida.");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("whitelistData", JSON.stringify({ wallet, email }));
    }

    setSubmitted(true);
  };

  return (
    <>
      {/* Botón principal */}
      <button
        className="btn bg-white text-black border border-black px-6 py-3 rounded-lg"
        onClick={() => setIsOpen(true)}
      >
        Solicitar acceso a la Whitelist
      </button>

      {/* Modal principal */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            {!submitted ? (
              <>
                <h2 className="text-xl font-bold mb-4 text-black">Solicitud de Whitelist</h2>
                <div className="mb-4">
                  <label className="block mb-2 text-black">Dirección de Wallet</label>
                  <input
                    type="text"
                    className="border border-gray-300 p-2 w-full rounded"
                    placeholder="Ingresa tu dirección de wallet"
                    value={wallet}
                    onChange={e => setWallet(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-black">Email</label>
                  <input
                    type="email"
                    className="border border-gray-300 p-2 w-full rounded"
                    placeholder="Ingresa tu email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button className="btn bg-gray-200 text-black px-4 py-2 rounded" onClick={() => setIsOpen(false)}>
                    Cancelar
                  </button>
                  <button className="btn bg-blue-500 text-white px-4 py-2 rounded" onClick={handleRegister}>
                    Enviar solicitud
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4 text-black">¡Solicitud enviada!</h2>
                <p className="mb-4 text-black">
                  Por favor, envía un correo electrónico a{" "}
                  <a
                    href={`mailto:universalshardproject@gmail.com?subject=UNIVERSAL SHARDING&body=Wallet: ${wallet}%0AEmail: ${email}`}
                    className="text-blue-600 underline"
                  >
                    universalshardproject@gmail.com
                  </a>{" "}
                  con el asunto <strong className="text-blue-600">UNIVERSAL SHARDING</strong>.
                </p>
                <p className="mb-4 text-black">
                  Incluye la dirección de tu billetera (<strong className="text-sm">{wallet}</strong>) y el email que
                  ingresaste: <strong>{email}</strong>.
                </p>
                <button
                  className="btn bg-blue-500 text-white px-4 py-2 rounded mt-4"
                  onClick={() => {
                    setIsOpen(false);
                    setSubmitted(false);
                    setWallet("");
                    setEmail("");
                  }}
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal secundario para enviar el correo */}
      {isEmailModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4 text-black">Enviar correo electrónico</h2>
            <p className="mb-4 text-black">
              Copiá el contenido necesario y envíalo al siguiente correo:{" "}
              <strong className="text-blue-600">universalshardproject@gmail.com</strong>
            </p>
            <p className="mb-4 text-black">
              Asunto: <strong className="text-blue-600">UNIVERSAL SHARDING</strong>
            </p>
            <p className="mb-4 text-black">
              Mensaje:
              <br />
              Wallet: <strong>{wallet}</strong>
              <br />
              Email: <strong className="text-sm">{email}</strong>
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="btn bg-gray-200 text-black px-4 py-2 rounded text-xs"
                onClick={() => setIsEmailModalOpen(false)} // Cierra el segundo modal
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterWhitelistButton;
