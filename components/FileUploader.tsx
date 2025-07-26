"use client";

import React, { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";

import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { toast } from "sonner"

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name),
          );

          return toast(
            `File ${file.name} exceeds the maximum size of ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
          );
        }

        return uploadFile({ file, ownerId, accountId, path }).then(
          (uploadedFile) => {
            if (uploadedFile) {
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name !== file.name),
              );
            }
          },
        );
      });

      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string,
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
  <input {...getInputProps()} />
  <Button
    type="button"
    className={cn(
      "flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-white hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/50 dark:bg-brand-200 dark:hover:bg-brand-200/80 dark:focus:ring-brand-200/40",
      className
    )}
  >
    <Image
      src="/assets/icons/upload.svg"
      alt="upload"
      width={24}
      height={24}
    />
    <p>Upload</p>
  </Button>

  {files.length > 0 && (
    <ul className="mt-6 space-y-4">
      <h4 className="text-xl font-semibold text-light-100">Uploading</h4>

      {files.map((file, index) => {
        const { type, extension } = getFileType(file.name);

        return (
          <li
            key={`${file.name}-${index}`}
            className="flex items-center justify-between gap-4 rounded-md border border-light-400 bg-light-800 px-4 py-3 dark:border-dark-400 dark:bg-dark-300"
          >
            <div className="flex items-center gap-3">
              <Thumbnail
                type={type}
                extension={extension}
                url={convertFileToUrl(file)}
              />

              <div className="text-sm text-white">
                {file.name}
                <Image
                  src="/assets/icons/file-loader.gif"
                  width={80}
                  height={26}
                  alt="Loader"
                  className="mt-1"
                />
              </div>
            </div>

            <Image
              src="/assets/icons/remove.svg"
              width={24}
              height={24}
              alt="Remove"
              onClick={(e) => handleRemoveFile(e, file.name)}
              className="cursor-pointer hover:opacity-70"
            />
          </li>
        );
      })}
    </ul>
  )}
</div>

  );
};

export default FileUploader;
