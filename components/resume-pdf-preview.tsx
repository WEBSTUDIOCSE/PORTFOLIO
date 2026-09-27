"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getDocumentProxy, renderPageAsImage } from "unpdf";

const RESUME_URL = "/resume/saurabh-jadhav-resume.pdf";

export default function ResumePdfPreview() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function renderResume() {
      try {
        const response = await fetch(RESUME_URL, { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Resume request failed with ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const document = await getDocumentProxy(new Uint8Array(buffer));
        const renderedPage = await renderPageAsImage(document, 1, {
          scale: 1.5,
          toDataURL: true,
        });

        if (!cancelled) {
          setImageUrl(renderedPage);
        }
      } catch {
        if (!cancelled) {
          setHasError(true);
        }
      }
    }

    void renderResume();

    return () => {
      cancelled = true;
    };
  }, []);

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt="Saurabh Jadhav resume preview"
        width={612}
        height={792}
        unoptimized
        className="block h-auto w-full"
      />
    );
  }

  return (
    <div className="flex aspect-[0.7727/1] items-center justify-center bg-[#f7f2e9] px-6 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-[#1a1a1a]/45">
      {hasError ? "Resume preview unavailable" : "Loading resume"}
    </div>
  );
}
