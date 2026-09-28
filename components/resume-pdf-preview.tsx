"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getDocumentProxy, renderPageAsImage } from "unpdf";

const RESUME_URL = "/resume/saurabh-jadhav-resume.pdf";

type ResumePdfPreviewProps = {
  onReady?: () => void;
};

export default function ResumePdfPreview({ onReady }: ResumePdfPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const onReadyRef = useRef(onReady);
  const readyRef = useRef(false);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    let cancelled = false;

    async function renderResume() {
      try {
        const response = await fetch(RESUME_URL, { cache: "force-cache" });

        if (!response.ok) {
          throw new Error(`Resume request failed with ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const document = await getDocumentProxy(new Uint8Array(buffer));
        const renderedPage = await renderPageAsImage(document, 1, {
          scale: 2,
          toDataURL: true,
        });

        if (!cancelled) {
          setImageUrl(renderedPage);
        }
      } catch {
        if (!cancelled) {
          setHasError(true);
          onReadyRef.current?.();
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
        priority
        onLoad={() => {
          if (readyRef.current) return;
          readyRef.current = true;
          onReadyRef.current?.();
        }}
        className="block h-auto w-full object-contain object-top"
      />
    );
  }

  return (
    <div className="flex aspect-[0.7727/1] items-center justify-center bg-[#f7f2e9] px-6 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-[#1a1a1a]/45">
      {hasError ? "Resume preview unavailable" : "Loading resume"}
    </div>
  );
}
