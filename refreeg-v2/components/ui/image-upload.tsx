"use client";

import * as React from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./button";
import { Icons } from "@/components/icons";

interface ImageUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
}

export function ImageUpload({
  onUpload,
  maxFiles = 1,
  accept = "image/*",
}: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: accept ? { [accept]: [] } : undefined,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <Icons.upload className="h-8 w-8 text-muted-foreground" />
        <div className="text-sm text-muted-foreground">
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>
              Drag & drop files here, or{" "}
              <Button variant="link" className="p-0 h-auto" type="button">
                click to select
              </Button>
            </p>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {maxFiles === 1
            ? "Upload a single file"
            : `Upload up to ${maxFiles} files`}
        </p>
      </div>
    </div>
  );
}
