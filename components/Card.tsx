import { Models } from "node-appwrite";
import Link from "next/link";
import Thumbnail from "@/components/Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";
import ActionDropdown from "@/components/ActionDropdown";

const Card = ({ file }: { file: Models.Document }) => {
  return (
   <Link
  href={file.url}
  target="_blank"
  className="block w-full rounded-xl border border-light-400 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-dark-400 dark:bg-dark-300"
>
  <div className="flex justify-between gap-4">
    <Thumbnail
      type={file.type}
      extension={file.extension}
      url={file.url}
      className="!size-20"
      imageClassName="!size-11"
    />

    <div className="flex flex-col items-end justify-between">
      <ActionDropdown file={file} />
      <p className="text-sm font-medium text-light-800 dark:text-white">
        {convertFileSize(file.size)}
      </p>
    </div>
  </div>

  <div className="mt-4 space-y-1">
    <p className="text-base font-semibold text-dark-900 dark:text-white truncate">
      {file.name}
    </p>
    <FormattedDateTime
      date={file.$createdAt}
      className="text-sm text-light-100"
    />
    <p className="text-xs text-light-200 truncate">
      By: {file.owner.fullName}
    </p>
  </div>
</Link>

  );
};
export default Card;
