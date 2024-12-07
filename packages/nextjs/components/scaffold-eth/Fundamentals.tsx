import React, { useState } from "react";

const Fundamentals: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div id="fundamentos" className="absolute top-20 left-5 w-2/5">
      {/* Título de los fundamentos */}
      <h2 className="text-xl font-bold mb-2 text-white">Fundamentos del Proyecto</h2>
      {/* Resumen */}
      <p className="text-white font-bold text-sm mb-4">
        El Universal Shard Project (USP) propone un modelo innovador: una plataforma que combina renta básica universal,
        blockchain, gamificación y autoorganización comunitaria. Nuestro objetivo es crear un ecosistema donde la
        colaboración, la equidad y la sostenibilidad sean el núcleo. Nuestro modelo combina renta básica y gobernanza
        para crear una comunidad de ciudadanos digitales que aprenden a tomar decisiones estratégicas y responsables.
      </p>
      {/* Botón "Leer más" */}
      <button
        className="bg-white text-black border border-black px-1 py-0.5 rounded-lg shadow-md hover:bg-gray-100"
        onClick={() => setModalOpen(true)}
      >
        Leer más
      </button>

      {/* Modal para "Leer más" */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl overflow-y-auto max-h-[80vh]">
            <h3 className="text-xl font-bold mb-4">Fundamentos completos del proyecto</h3>
            <p className="text-gray-700 mb-4">
              &quot;Enfrentamos un mundo donde la desigualdad económica crece y la automatización transforma el empleo.
              Realidades exigen soluciones innovadoras que no solo mitiguen los problemas actuales, sino que reimaginen
              cómo nos organizamos como sociedad. Nuestro objetivo es crear un ecosistema donde la colaboración, la
              equidad y la sostenibilidad sean el núcleo. Nuestro modelo combina renta básica y gobernanza para crear
              una comunidad de ciudadanos digitales que aprenden a tomar decisiones estratégicas y responsables. A
              medida que ganan experiencia, también aumentan su impacto en la gobernanza y sus recompensas. En este
              sentido, podemos mencionar que un estudio publicado recientemente ha demostrado que un incentivo económico
              puede permitirle a las personas explorar y conocer sus propias aptitudes sin la presión de subsistencia.
              Creemos que esto puede fomentar la creacion de comunidades más colaborativas y diversas. Para nosotros la
              renta básica no es solo un derecho, sino también una herramienta para fomentar la participación cívica en
              una comunidad emergente. Con la tecnología de Arbitrum, una red rápida, accesible y económica, USP
              predefine cómo se distribuyen los recursos, incentivando la participación activa y democratizando la
              gobernanza progresivamente por etapas a través de un proceso de comunalización que debe surgir como
              emergente social, En este sentido la DAO operará como un motor económico surgido de la coordinación, donde
              todas las actividades comunitarias generan valor que es redistribuido equitativamente a través de la renta
              básica universal. &quot;No es solo tecnología; es una obra de arte de la ingenieria social, bien
              entendida.&quot;
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={() => setModalOpen(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fundamentals;
