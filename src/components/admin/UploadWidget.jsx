import { useState, useRef } from "react";
import { UploadCloud, FileImage } from "lucide-react";
import toast from "react-hot-toast";

const MAX_FILE_SIZE_MB = 10;

export default function UploadWidget({ onUpload, currentImage }) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    /* =========================
       VALIDATION
    ========================= */
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      resetInput();
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      resetInput();
      return;
    }

    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      setUploading(true);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.secure_url) {
        throw new Error(
          data?.error?.message || "Upload failed"
        );
      }

      onUpload?.(data.secure_url);
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Image upload failed");
      setFileName("");
    } finally {
      setUploading(false);
      resetInput();
    }
  };

  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        Product Image
      </label>

      {/* Upload Area */}
      <div
        className="
          relative w-full
          border-2 border-dashed border-amber-300
          rounded-xl
          bg-amber-50
          hover:bg-amber-100
          transition
          px-4 py-5
          flex flex-col items-center justify-center
          text-center
        "
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <UploadCloud className="w-8 h-8 text-amber-600 mb-2" />

        <p className="text-sm font-medium text-gray-700">
          {uploading
            ? "Uploading…"
            : "Click or tap to upload image"}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          JPG, PNG, WEBP • Max 10MB
        </p>
      </div>

      {/* Loading bar */}
      {uploading && (
        <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-amber-500 animate-pulse" />
        </div>
      )}

      {/* Filename display */}
      {currentImage && (
        <div
          className="
            flex items-center gap-2
            text-sm text-gray-700
            bg-white border border-amber-200
            rounded-lg px-3 py-2
            w-full
            break-all
          "
        >
          <FileImage
            size={16}
            className="text-amber-600 shrink-0"
          />
          <span className="truncate">
            {fileName ||
              currentImage.split("/").pop()}
          </span>
        </div>
      )}
    </div>
  );
}
