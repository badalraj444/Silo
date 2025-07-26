import React from "react";
import Image from "next/image";
import { cn, getFileIcon } from "@/lib/utils";

interface Props {
  type: string;
  extension: string;
  url?: string;
  imageClassName?: string;
  className?: string;
}

export const Thumbnail = ({
  type,
  extension,
  url = "",
  imageClassName,
  className,
}: Props) => {
  const isImage = type === "image" && extension !== "svg";

  return (
    <figure
  className={cn(
    "flex size-10 items-center justify-center rounded-sm bg-white shadow-md dark:bg-dark-300",
    className
  )}
>
  <Image
    src={isImage ? url : getFileIcon(extension, type)}
    alt="thumbnail"
    width={100}
    height={100}
    className={cn(
      "size-8 object-contain",
      imageClassName,
      isImage && "h-8 w-8 object-contain rounded-sm shadow-sm"
    )}
  />
</figure>

  );
};
export default Thumbnail;
