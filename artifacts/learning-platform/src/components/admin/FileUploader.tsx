import { useState, useRef, useCallback } from "react";
import { Upload, X, CheckCircle, Loader2, FileText, Video, Image as ImageIcon, File as FileIcon, Copy, AlertCircle } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";

export interface UploadedFile {
  name: string;
  objectPath: string;
  publicUrl: string;
  contentType: string;
  size: number;
}

interface FileUploaderProps {
  accept?: string;
  label?: string;
  onUploaded?: (file: UploadedFile) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function getFileIcon(contentType: string) {
  if (contentType.startsWith("video/")) return Video;
  if (contentType.startsWith("image/")) return ImageIcon;
  if (contentType === "application/pdf") return FileText;
  return FileIcon;
}

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: number; name: string; size: number }
  | { status: "done"; file: UploadedFile }
  | { status: "error"; message: string };

function copyText(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function showToast(msg: string, type: "ok" | "err" = "ok") {
  const el = document.createElement("div");
  el.className = `fixed bottom-6 right-6 z-[9999] px-4 py-3 rounded-xl text-sm font-medium shadow-2xl transition-opacity duration-300 ${
    type === "ok" ? "bg-green-600 text-white" : "bg-red-600 text-white"
  }`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, 2500);
}

export function FileUploader({
  accept = "*/*",
  label = "Upload File",
  onUploaded,
}: FileUploaderProps) {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const abortedRef = useRef(false);

  const uploadFile = useCallback(async (file: File) => {
    abortedRef.current = false;
    setState({ status: "uploading", progress: 0, name: file.name, size: file.size });

    try {
      // Step 1: Get signed upload URL from our API (tiny JSON request — works on Vercel)
      setState(prev => prev.status === "uploading" ? { ...prev, progress: 2 } : prev);

      const urlRes = await adminFetch("/api/storage/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
        }),
      });

      if (!urlRes.ok) {
        const err = await urlRes.json().catch(() => ({}));
        throw new Error(err?.error || `Failed to get upload URL (${urlRes.status})`);
      }

      const { signedUrl, publicUrl, objectPath } = await urlRes.json();

      if (abortedRef.current) { setState({ status: "idle" }); return; }

      setState(prev => prev.status === "uploading" ? { ...prev, progress: 5 } : prev);

      // Step 2: Upload file directly to Supabase via signed URL (bypasses Vercel — any file size)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        xhr.timeout = 0;

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setState(prev =>
              prev.status === "uploading"
                ? { ...prev, progress: 5 + Math.round((e.loaded / e.total) * 90) }
                : prev
            );
          }
        });

        xhr.addEventListener("load", () => {
          xhrRef.current = null;
          if (xhr.status >= 200 && xhr.status < 300) {
            setState(prev => prev.status === "uploading" ? { ...prev, progress: 100 } : prev);
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
          reject(new Error("__CANCELLED__"));
        });

        xhr.open("PUT", signedUrl);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        xhr.send(file);
      });

      const uploaded: UploadedFile = {
        name: file.name,
        objectPath: objectPath ?? publicUrl ?? "",
        publicUrl: publicUrl ?? "",
        contentType: file.type || "application/octet-stream",
        size: file.size,
      };

      setState({ status: "done", file: uploaded });
      onUploaded?.(uploaded);
    } catch (err: any) {
      if (err.message === "__CANCELLED__") {
        setState({ status: "idle" });
      } else {
        setState({ status: "error", message: err.message || "Upload failed" });
      }
    }
  }, [onUploaded]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    uploadFile(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (state.status === "uploading") return;
    handleFiles(e.dataTransfer.files);
  };

  const cancelUpload = () => {
    abortedRef.current = true;
    xhrRef.current?.abort();
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          state.status === "uploading"
            ? "border-primary/30 bg-primary/3 cursor-not-allowed"
            : dragging
            ? "border-primary/60 bg-primary/5 cursor-copy"
            : state.status === "done"
            ? "border-green-500/40 bg-green-500/5"
            : state.status === "error"
            ? "border-red-500/40 bg-red-500/5 cursor-pointer"
            : "border-white/10 hover:border-white/20 hover:bg-white/3 cursor-pointer"
        }`}
        onDragOver={e => { e.preventDefault(); if (state.status !== "uploading") setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (state.status === "uploading") return;
          if (state.status === "done") return;
          inputRef.current?.click();
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => { handleFiles(e.target.files); e.target.value = ""; }}
        />

        {state.status === "idle" && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-medium text-white">{label}</p>
            <p className="text-xs text-muted-foreground">Drag & drop or click to browse</p>
          </div>
        )}

        {state.status === "uploading" && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <div className="w-full max-w-xs space-y-1">
              <p className="text-sm font-medium text-white truncate">{state.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(state.size)}</p>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary to-blue-400 rounded-full h-2 transition-all duration-300" style={{ width: `${state.progress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{state.progress < 5 ? "Preparing upload..." : state.progress < 95 ? "Uploading..." : "Saving..."}</span>
                <span>{state.progress}%</span>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); cancelUpload(); }}
              className="mt-1 text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        )}

        {state.status === "done" && (() => {
          const Icon = getFileIcon(state.file.contentType);
          return (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-sm font-medium text-green-400">Uploaded successfully!</p>
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{state.file.name} · {formatBytes(state.file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setState({ status: "idle" }); }}
                className="text-xs text-muted-foreground hover:text-white transition-colors mt-1"
              >
                Upload another file
              </button>
            </div>
          );
        })()}

        {state.status === "error" && (
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm font-medium text-red-400">Upload failed</p>
            <p className="text-xs text-red-300/70">{state.message}</p>
            <p className="text-xs text-muted-foreground">Click to try again</p>
          </div>
        )}
      </div>

      {state.status === "done" && (
        <div className="p-3 rounded-xl bg-white/3 border border-green-500/20">
          <p className="text-xs text-muted-foreground mb-1.5">File URL — paste into lesson or course fields:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono text-green-400 bg-black/20 px-2 py-1.5 rounded-lg overflow-x-auto whitespace-nowrap">
              {state.file.publicUrl}
            </code>
            <button
              type="button"
              onClick={() => { copyText(state.file.publicUrl); showToast("URL copied!"); }}
              className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors shrink-0"
              title="Copy URL"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
