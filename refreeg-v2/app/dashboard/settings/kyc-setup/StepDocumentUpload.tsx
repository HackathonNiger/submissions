"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";

const documentTypes = [
  "NIN",
  "BVN",
  "International Passport",
  "Driver's License",
  "Voter's Card",
];

export default function StepDocumentUpload({
  selectedDoc,
  setSelectedDoc,
  file,
  setFile,
}: {
  selectedDoc: string;
  setSelectedDoc: (doc: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const f = acceptedFiles[0];
      if (!f) return;
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

      if (
        !["image/", "application/pdf"].some((type) => f.type.startsWith(type))
      ) {
        setError("Only image or PDF files are allowed.");
        setFile(null);
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        setError("File size too large. Maximum size is 5MB.");
        setFile(null);
        return;
      }
      setError(null);
      setFile(f);
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
      "application/pdf": [],
    },
  });

  return (
    <div className="space-y-4">
      {/* Document Type Select */}
      <div className="space-y-2">
        <Label htmlFor="documentType" className="block">
          Document Type
        </Label>
        <select
          id="documentType"
          className="w-full md:w-2/5 h-12 rounded-xl border px-4 bg-gray-100"
          value={selectedDoc}
          onChange={(e) => setSelectedDoc(e.target.value)}
        >
          <option value="">Select document type</option>
          {documentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {!selectedDoc && (
          <span className="text-red-600 text-xs font-montserrat">
            Please select a document type.
          </span>
        )}
      </div>

      {/* File Upload Drag Area */}
      <div className="space-y-2">
        <Label htmlFor="documentFile">Upload Document</Label>
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center h-60 border-2 border-dashed rounded-xl cursor-pointer px-4 transition
            
          `}
        >
          <input {...getInputProps()} />
          {file ? (
            file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-full h-full rounded object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm7 1.414L18.586 9H15a2 2 0 0 1-2-2V3.414z"
                    fill="#e53e3e"
                  />
                </svg>
                <p className="text-sm text-gray-700 text-center break-all px-2">
                  {file.name}
                </p>
              </div>
            )
          ) : (
            <>
              <UploadCloud className="w-10 h-10 text-[#003366] font-normal mb-2" />
              <p className="text-sm text-gray-700">
                Drag & Drop your document or{" "}
                <span className="underline font-medium #003366">
                  click to select
                </span>
              </p>
            </>
          )}

          {error && (
            <span className="text-red-600 text-xs font-montserrat mt-2">
              {error}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
