// LogoCard component displaying light and dark mode logos
import React from "react";
import Image from "next/image";

export const LogoCard = () => {
  return (
    <>
      {/* Light Logo */}
      <div className="rounded-2xl border border-gray-200 p-6 dark:hidden dark:border-gray-800 bg-white flex items-center justify-center">
        <Image 
          src="/images/logo/UXCLJ.png" 
          alt="Light mode logo" 
          width={250} 
          height={120} 
          className="rounded-lg"
        />
      </div>

      {/* Dark Logo */}
      <div className="hidden dark:flex rounded-2xl border border-gray-800 p-6 dark:bg-white/[0.03] items-center justify-center">
        <Image 
          src="/images/logo/UXCLJ-dark.png" 
          alt="Dark mode logo" 
          width={250} 
          height={120} 
          className="rounded-lg"
        />
      </div>
    </>
  );
};