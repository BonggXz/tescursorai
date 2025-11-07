"use client";

import { Download } from "lucide-react";
import { useState } from "react";

interface DownloadButtonProps {
  assetId: string;
  fileUrl: string;
  fileName: string;
}

export function DownloadButton({ assetId, fileUrl, fileName }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/assets/${assetId}/download?file=${encodeURIComponent(fileUrl)}`);
      if (!response.ok) {
        throw new Error("Download failed");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert("Failed to download file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="btn-primary inline-flex items-center space-x-2"
    >
      <Download className="h-4 w-4" />
      <span>{loading ? "Downloading..." : "Download"}</span>
    </button>
  );
}
