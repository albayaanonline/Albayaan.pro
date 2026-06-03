import { useState, useRef } from "react";
import { Upload, Link, CheckCircle, X, Loader2, Image as ImageIcon, Video, File as FileIcon, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface MediaUrlInputProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  placeholder?: string;
  type?: "image" | "video" | "any";
  className?: string;
}

type UploadStatus = "idle" | "uploading" | "done" | "error";

const ACCEPTED: Record<"image" | "video" | "any", string> = {
  image: "image/jpeg,image/jpg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif",
  video: "video/mp4,video/quicktime,video/webm,video/x-msvideo,video/avi,.mp4,.mov,.webm,.avi",
  any: "*/*",
};

const LABELS: Record<"image" | "video" | "any", string> = {
  image: "JPG, PNG, WEBP — any size",
  video: "MP4, MOV, WEBM, AVI — any size",
  any: "Any file — any size",
};

const PLACEHOLDERS: Record<"image" | "video" | "any", string> = {
  image: "https://example.com/thumbnail.jpg",
  video: "https://youtube.com/watch?v=... or https://vimeo.com/...",
  any: "https://example.com/file",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

export function MediaUrlInput({
  value,
  onChange,
  accept,
  placeholder,
  type = "any",
  className = "",
}: MediaUrlInputProps) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [uploadedFilename, setUploadedFilename] = useState("");
  const [uploadedSize, setUploadedSize] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const abortedRef = useRef(false);

  const inp = `w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 text-sm transition-colors ${className}`;
  const acceptStr = accept || ACCEPTED[type];
  const ph = placeholder || PLACEHOLDERS[type];
  const TypeIcon = type === "image" ? ImageIcon : type === "video" ? Video : FileIcon;

  const uploadFile = async (file: File) => {
    abortedRef.current = false;
    setUploadedFilename(file.name);
    setUploadedSize(file.size);
    setUploadStatus("uploading");
    setUploadProgress(0);
    setUploadError("");

    try {
      let token: string | null = null;
      if (supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          token = data.session?.access_token ?? null;
        } catch { /* ignore */ }
      }

      // Step 1: Get a signed upload URL from our API (tiny JSON — works on Vercel)
      setUploadProgress(2);

      const urlRes = await fetch(getApiUrl("/storage/upload-url"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
        }),
      });

      if (!urlRes.ok) {
        const err = await urlRes.json().catch(() => ({}));
        throw new Error(err?.error || `Failed to get upload URL (${urlRes.status})`);
      }

      const { signedUrl, publicUrl } = await urlRes.json();

      if (abortedRef.current) { setUploadStatus("idle"); return; }
      setUploadProgress(5);

      // Step 2: Upload file directly to Supabase via signed URL (bypasses Vercel — any file size)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        xhr.timeout = 0;

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setUploadProgress(5 + Math.round((e.loaded / e.total) * 90));
          }
        });

        xhr.addEventListener("load", () => {
          xhrRef.current = null;
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(100);
            resolve();
          } else {
            reject(new Error(`Upload to storage failed (${xhr.status})`));
          }
        });

        xhr.addEventListener("error", () => {
          xhrRef.current = null;
          reject(new Error("Network error — check your connection and try again"));
        });

        xhr.addEventListener("abort", () => {
          xhrRef.current = null;
          reject(new Error("Upload cancelled"));
        });

        xhr.open("PUT", signedUrl);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        xhr.send(file);
      });

      onChange(publicUrl);
      setUploadStatus("done");
    } catch (err: any) {
      if (err.message !== "Upload cancelled") {
        setUploadError(err.message || "Upload failed");
        setUploadStatus("error");
      } else {
        setUploadStatus("idle");
      }
    }
  };

  const cancelUpload = () => {
    abortedRef.current = true;
    xhrRef.current?.abort();
  };

  const reset = () => {
    setUploadStatus("idle");
    setUploadProgress(0);
    setUploadError("");
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {/* Mode toggle */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10 w-fit">
        {(["url", "upload"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              mode === m ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
            }`}
          >
            {m === "url" ? <Link className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
            {m === "url" ? "URL" : "Upload"}
          </button>
        ))}
      </div>

      {/* URL mode */}
      {mode === "url" && (
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <TypeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={inp + " pl-9"}
              placeholder={ph}
            />
          </div>
          {type === "image" && value && (
            <img
              src={value}
              alt=""
              className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          )}
        </div>
      )}

      {/* Upload mode */}
      {mode === "upload" && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept={acceptStr}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file);
              e.target.value = "";
            }}
          />

          {/* Idle */}
          {uploadStatus === "idle" && (
            <div
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-primary/40 cursor-pointer hover:bg-primary/3 transition-all group"
              onClick={() => inputRef.current?.click()}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Upload className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">Click to select file</p>
                <p className="text-xs text-muted-foreground">{LABELS[type]}</p>
              </div>
            </div>
          )}

          {/* Uploading */}
          {uploadStatus === "uploading" && (
            <div className="p-4 rounded-xl bg-white/3 border border-primary/20 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{uploadedFilename}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(uploadedSize)} · {uploadProgress < 5 ? "Preparing..." : "Uploading..."}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={cancelUpload}
                  className="shrink-0 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Cancel upload"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{uploadProgress < 5 ? "Preparing upload..." : uploadProgress < 95 ? "Uploading to storage..." : "Saving..."}</span>
                  <span>{uploadProgress}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Done */}
          {uploadStatus === "done" && (
            <div className="p-4 rounded-xl bg-green-500/8 border border-green-500/20 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  <div>
                    <span className="text-sm text-green-400 font-medium">Uploaded successfully!</span>
                    <p className="text-xs text-muted-foreground truncate max-w-xs">{uploadedFilename} · {formatBytes(uploadedSize)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs text-muted-foreground hover:text-white transition-colors shrink-0"
                >
                  Replace
                </button>
              </div>
              {type === "image" && value && (
                <img
                  src={value}
                  alt=""
                  className="w-full max-h-32 object-cover rounded-lg border border-white/10"
                  onError={() => {}}
                />
              )}
              {type === "video" && value && (
                <p className="text-xs text-muted-foreground font-mono truncate bg-white/5 px-2 py-1 rounded">{value}</p>
              )}
            </div>
          )}

          {/* Error */}
          {uploadStatus === "error" && (
            <div className="p-4 rounded-xl bg-red-500/8 border border-red-500/20">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-400 font-medium">Upload failed</p>
                    <p className="text-xs text-red-300/70 mt-0.5">{uploadError}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => { setUploadStatus("idle"); setTimeout(() => inputRef.current?.click(), 50); }}
                    className="text-xs text-primary hover:underline"
                  >
                    Retry
                  </button>
                  <span className="text-muted-foreground/40">·</span>
                  <button
                    type="button"
                    onClick={() => setUploadStatus("idle")}
                    className="text-xs text-muted-foreground hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
