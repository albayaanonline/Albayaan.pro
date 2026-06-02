import { useState, useRef } from "react";
import { Upload, Link, CheckCircle, X, Loader2, Image as ImageIcon, Video } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface MediaUrlInputProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  placeholder?: string;
  type?: "image" | "video" | "any";
  maxSizeMb?: number;
  className?: string;
}

type UploadStatus = "idle" | "uploading" | "done" | "error";

export function MediaUrlInput({
  value,
  onChange,
  accept,
  placeholder,
  type = "any",
  maxSizeMb = 500,
  className = "",
}: MediaUrlInputProps) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const inp = `w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 text-sm transition-colors ${className}`;

  const acceptStr = accept || (type === "image" ? "image/*" : type === "video" ? "video/*" : "*/*");
  const ph = placeholder || (type === "image" ? "https://example.com/image.jpg" : type === "video" ? "https://youtube.com/watch?v=... or direct video URL" : "https://example.com/file");

  const uploadFile = async (file: File) => {
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError(`File too large. Maximum: ${maxSizeMb} MB`);
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    setUploadProgress(0);
    setUploadError("");

    try {
      let token: string | null = null;
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        token = data.session?.access_token ?? null;
      }

      const xhr = new XMLHttpRequest();
      const result = await new Promise<{ publicUrl: string }>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try { resolve(JSON.parse(xhr.responseText)); }
            catch { reject(new Error("Invalid server response")); }
          } else {
            let msg = `Upload failed (${xhr.status})`;
            try { msg = JSON.parse(xhr.responseText)?.error || msg; } catch {}
            reject(new Error(msg));
          }
        });
        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.open("POST", "/api/storage/upload");
        xhr.setRequestHeader("x-file-type", file.type || "application/octet-stream");
        xhr.setRequestHeader("x-filename", file.name);
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.withCredentials = true;
        xhr.send(file);
      });

      onChange(result.publicUrl);
      setUploadStatus("done");
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
      setUploadStatus("error");
    }
  };

  const TypeIcon = type === "image" ? ImageIcon : type === "video" ? Video : Upload;

  return (
    <div className="space-y-2">
      <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            mode === "url" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
          }`}
        >
          <Link className="w-3 h-3" /> URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            mode === "upload" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
          }`}
        >
          <Upload className="w-3 h-3" /> Upload
        </button>
      </div>

      {mode === "url" && (
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <TypeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={value}
              onChange={e => onChange(e.target.value)}
              className={inp + " pl-9"}
              placeholder={ph}
            />
          </div>
          {type === "image" && value && (
            <img
              src={value}
              alt=""
              className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          )}
        </div>
      )}

      {mode === "upload" && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept={acceptStr}
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file);
              e.target.value = "";
            }}
          />

          {uploadStatus === "idle" && (
            <div
              className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 cursor-pointer hover:bg-white/3 transition-all"
              onClick={() => inputRef.current?.click()}
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Upload className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">Click to select file</p>
                <p className="text-xs text-muted-foreground">max {maxSizeMb} MB</p>
              </div>
            </div>
          )}

          {uploadStatus === "uploading" && (
            <div className="p-3 rounded-xl bg-white/3 border border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                <span className="text-sm text-white">Uploading... {uploadProgress}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {uploadStatus === "done" && (
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-sm text-green-400 font-medium">Uploaded!</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setUploadStatus("idle"); onChange(""); }}
                  className="text-xs text-muted-foreground hover:text-white transition-colors"
                >
                  Replace
                </button>
              </div>
              {type === "image" && value && (
                <img src={value} alt="" className="mt-2 w-full max-h-24 object-cover rounded-lg" onError={() => {}} />
              )}
              {type !== "image" && value && (
                <p className="text-xs text-muted-foreground mt-1 truncate">{value}</p>
              )}
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-sm text-red-400">{uploadError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setUploadStatus("idle"); inputRef.current?.click(); }}
                  className="text-xs text-primary hover:underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
