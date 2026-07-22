// Forces an actual download for cross-origin URLs (e.g. Firebase
// Storage), where the native `<a download>` attribute is silently
// ignored by browsers for security reasons and just navigates/opens
// the file instead. Fetches the bytes, downloads via a same-origin
// blob: URL (where `download` DOES work), and falls back to opening
// the original URL in a new tab if the fetch fails (e.g. CORS not
// configured on the bucket) so the user can still save it manually.
export async function downloadFile(url: string, filename: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
