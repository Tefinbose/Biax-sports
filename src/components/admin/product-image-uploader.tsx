"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import {
  FiUploadCloud,
  FiLink,
  FiTrash2,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiAlertCircle,
  FiPlus,
  FiX,
} from "react-icons/fi";

interface ProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ProductImageUploader({
  images,
  onChange,
  maxImages = 10,
}: ProductImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAddMore = images.length < maxImages;

  async function handleFilesUpload(files: FileList | File[]) {
    const validFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") && file.size > 0
    );

    if (validFiles.length === 0) {
      setUploadError("Please select valid image files (JPG, PNG, WebP, etc.).");
      return;
    }

    const availableSlots = maxImages - images.length;
    if (availableSlots <= 0) {
      setUploadError(`Maximum limit of ${maxImages} images reached.`);
      return;
    }

    const filesToUpload = validFiles.slice(0, availableSlots);
    if (validFiles.length > availableSlots) {
      setUploadError(
        `Only ${availableSlots} more image(s) could be uploaded due to the ${maxImages} images limit.`
      );
    } else {
      setUploadError("");
    }

    setUploading(true);

    try {
      const formData = new FormData();
      filesToUpload.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image(s).");
      }

      if (Array.isArray(data.urls) && data.urls.length > 0) {
        onChange([...images, ...data.urls]);
        setUploadError("");
      }
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Error uploading files."
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (canAddMore) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!canAddMore) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      void handleFilesUpload(e.dataTransfer.files);
    }
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      void handleFilesUpload(e.target.files);
    }
  }

  function handleAddUrl() {
    const trimmed = urlInputValue.trim();
    if (!trimmed) return;

    // Support multiple URLs separated by newline or space
    const urls = trimmed
      .split(/[\n,]/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    const availableSlots = maxImages - images.length;
    const urlsToAdd = urls.slice(0, availableSlots);

    if (urlsToAdd.length > 0) {
      onChange([...images, ...urlsToAdd]);
      setUrlInputValue("");
      setShowUrlInput(false);
      setUploadError("");
    } else {
      setUploadError(`Maximum limit of ${maxImages} images reached.`);
    }
  }

  function handleRemove(index: number) {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  }

  function handleSetCover(index: number) {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([target, ...rest]);
  }

  function handleMove(index: number, direction: "left" | "right") {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-800">
          Product Images <span className="text-[#d71920]">*</span>
        </label>
        <span className="text-xs font-medium text-gray-500">
          {images.length} / {maxImages} images
        </span>
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
          <FiAlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <FiX className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed p-5 text-center transition-all ${
            isDragging
              ? "border-[#d71920] bg-red-50/60"
              : "border-gray-300 bg-gray-50/70 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            onChange={handleFileInputChange}
            className="hidden"
            id="product-image-file-input"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200">
              {uploading ? (
                <FiLoader className="h-6 w-6 animate-spin text-[#d71920]" />
              ) : (
                <FiUploadCloud className="h-6 w-6 text-gray-600" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                {uploading ? "Uploading images..." : "Upload images from your device"}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                Drag and drop files here, or{" "}
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="font-semibold text-[#d71920] underline hover:text-red-700"
                >
                  browse from system
                </button>
              </p>
            </div>

            <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-500">
              <span className="rounded bg-white px-2 py-0.5 shadow-xs">
                Multiple files supported
              </span>
              <span>·</span>
              <span>JPG, PNG, WebP up to 10MB</span>
              <span>·</span>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="inline-flex items-center gap-1 font-medium text-gray-700 underline hover:text-[#d71920]"
              >
                <FiLink className="h-3 w-3" />
                {showUrlInput ? "Hide URL input" : "Or enter image URL"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optional Direct URL Input */}
      {showUrlInput && canAddMore && (
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-xs">
          <p className="mb-2 text-xs font-semibold text-gray-700">
            Add Image by Web URL
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInputValue}
              onChange={(e) => setUrlInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
              placeholder="https://example.com/product-image.jpg"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-[#d71920] focus:ring-1 focus:ring-[#d71920] focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black"
            >
              <FiPlus className="h-3.5 w-3.5" />
              Add URL
            </button>
          </div>
          <span className="mt-1 block text-[11px] text-gray-500">
            Tip: You can paste multiple URLs separated by commas or lines.
          </span>
        </div>
      )}

      {/* Image Gallery Grid */}
      {images.length > 0 ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((url, index) => {
              const isCover = index === 0;
              return (
                <div
                  key={`${url}-${index}`}
                  className={`group relative aspect-square overflow-hidden rounded-xl border bg-gray-100 transition shadow-xs ${
                    isCover
                      ? "border-2 border-[#d71920] ring-2 ring-[#d71920]/20"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/images/logo.png";
                    }}
                  />

                  {/* Cover Badge */}
                  {isCover && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-[#d71920] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
                      <FiStar className="h-2.5 w-2.5 fill-current" /> Cover
                    </span>
                  )}

                  {/* Index Badge */}
                  {!isCover && (
                    <span className="absolute top-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                      #{index + 1}
                    </span>
                  )}

                  {/* Action Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between bg-black/50 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        title="Remove image"
                        className="rounded-full bg-red-600 p-1.5 text-white transition hover:bg-red-700 shadow-sm"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <div className="flex gap-1">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMove(index, "left")}
                            title="Move left"
                            className="rounded bg-white/90 p-1 text-gray-800 transition hover:bg-white"
                          >
                            <FiChevronLeft className="h-3 w-3" />
                          </button>
                        )}
                        {index < images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMove(index, "right")}
                            title="Move right"
                            className="rounded bg-white/90 p-1 text-gray-800 transition hover:bg-white"
                          >
                            <FiChevronRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(index)}
                          className="rounded bg-white/95 px-2 py-1 text-[10px] font-bold text-gray-900 transition hover:bg-white shadow-xs"
                        >
                          Set Cover
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-gray-500">
            ★ The first image marked <strong className="text-gray-700">Cover</strong> is displayed as the primary thumbnail on store cards and search results.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-400">
            No images added yet. Upload files from your system or add image URLs above.
          </p>
        </div>
      )}
    </div>
  );
}
