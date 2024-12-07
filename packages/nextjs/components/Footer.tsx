import React from "react";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div id="redes" className="py-5 px-4 bg-transparent flex justify-center items-center">
      <div className="flex flex-row gap-8 text-center">
        {/* Email */}
        <a
          href="mailto:universalshardproject@gmail.com"
          target="_blank"
          rel="noreferrer"
          className="link text-black hover:underline font-bold"
        >
          universalshardproject@gmail.com
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com/universalshardproject"
          target="_blank"
          rel="noreferrer"
          className="link text-black font-bold hover:underline"
        >
          Instagram
        </a>

        {/* Twitter */}
        <a
          href="https://twitter.com/universalshard"
          target="_blank"
          rel="noreferrer"
          className="link text-black font-bold hover:underline"
        >
          Twitter
        </a>
      </div>
    </div>
  );
};
