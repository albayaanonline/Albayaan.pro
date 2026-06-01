import { useState, useRef, useCallback } from "react";
import { Upload, X, CheckCircle, Loader2, FileText, Video, Image as ImageIcon, File as FileIcon, Copy } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";

interface UploadedFile {
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
  multiple?: boolean;
  maxSizeMb?: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(contentType: string) {
  if (contentType.startsWith("video/")) return Video;
  if (contentType.startsWith("image/")) return ImageIcon;
  if (contentType === "application/pdf") return FileText;
  return FileIcon;
}

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: number; name: string }
  | { status: "done"; file: UploadedFile }
  | { status: "error"; message: string };

function copyText(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function toast(msg: string, type: "ok" | "err" = "ok") {
  const el = document.createElement("div");
  el.className = `fixed bottom-6 right-6 z-[9999] px-4 py-3 rounded-xl text-sm font-medium shadow-2xl transition-all ${
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
  multiple = false,
  maxSizeMb = 500,
}: FileUploaderProps) {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      setState({ status: "error", message: `File too large. Maximum size is ${maxSizeMb} MB.` });
      return;
    }

    setState({ status: "uploading", progress: 0, name: file.name });

    try {
      const urlRes = await adminFetch("/api/storage/uploads/request-url", {
        method: "POST",
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type || "application/octet-stream" }),
      });

      if (!urlRes.ok) {
        const err = await urlRes.json().catch(() => ({}));
        setState({ status: "error", message: err.error || "Failed to get upload URL" });
        return;
      }

      const { uploadURL, objectPath } = await urlRes.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setState({ status: "uploading", progress: Math.round((e.loaded / e.total) * 100), name: file.name });
          }
        });
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed: ${xhr.status}`));
        });
        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.open("PUT", uploadURL);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        xhr.send(file);
      });

      const publicUrl = `${window.location.origin}/api${objectPath}`;
      const uploaded: UploadedFile = {
        name: file.name,
        objectPath,
        publicUrl,
        contentType: file.type || "application/octet-stream",
        size: file.size,
      };

      setState({ status: "done", file: uploaded });
      onUploaded?.(uploaded);
    } catch (err: any) {
      setState({ status: "error", message: err.message || "Upload failed" });
    }
  }, [maxSizeMb, onUploaded]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    uploadFile(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const FileIconComp = state.status === "done" ? getFileIcon(state.file.contentType) : Upload;

  return (
    <div className="space-y-3">
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragging
            ? "border-primary/60 bg-primary/5"
            : state.status === "done"
            ? "border-green-500/40 bg-green-500/5"
            : state.status === "error"
            ? "border-red-500/40 bg-red-500/5"
            : "border-white/10 hover:border-white/20 hover:bg-white/3"
        }`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => state.status !== "uploading" && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />

        {state.status === "idle" && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-medium text-white">{label}</p>
            <p className="text-xs text-muted-foreground">Drag & drop or click to browse — max {maxSizeMb} MB</p>
          </div>
        )}

        {state.status === "uploading" && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-medium text-white">{state.name}</p>
            <div className="w-full max-w-xs bg-white/10 rounded-full h-2">
              <div className="bg-primary rounded-full h-2 transition-all duration-300" style={{ width: `${state.progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{state.progress}%</p>
          </div>
        )}

        {state.status === "done" && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-sm font-medium text-green-400">Uploaded successfully!</p>
            <p className="text-xs text-muted-foreground">{state.file.name} · {formatBytes(state.file.size)}</p>
          </div>
        )}

        {state.status === "error" && (
          <div className="flex flex-col items-center gap-2">
            <X className="w-8 h-8 text-red-400" />
            <p className="text-sm font-medium text-red-400">{state.message}</p>
            <p className="text-xs text-muted-foreground">Click to try again</p>
          </div>
        )}
      </div>

      {state.status === "done" && (
        <div className="p-3 rounded-xl bg-white/3 border border-green-500/20">
          <p className="text-xs text-muted-foreground mb-1.5">File URL (copy to use in lessons/courses):</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono text-green-400 bg-black/20 px-2 py-1.5 rounded-lg overflow-x-auto whitespace-nowrap">
              {state.file.publicUrl}
            </code>
            <button
              onClick={() => { copyText(state.file.publicUrl); toast("URL copied!"); }}
              className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors shrink-0"
              title="Copy URL"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={() => setState({ status: "idle" })}
            className="mt-2 text-xs text-muted-foreground hover:text-white transition-colors"
          >
            Upload another file
          </button>
        </div>
      )}
    </div>
  );
}
