import Image from "next/image";
import React from "react";

export default function ResponsiveImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative">
      <div className="overflow-hidden">
        <Image
          src=""
          alt="Cover"
          className="w-full border border-gray-200 rounded-xl dark:border-gray-800"
          width={1054}
          height={600}
        />
      </div>
    </div>
  );
}
