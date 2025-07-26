"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { useDebounce } from "use-debounce";
const Search = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }

      const files = await getFiles({ types: [], searchText: debouncedQuery });
      setResults(files.documents);
      setOpen(true);
    };

    fetchFiles();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);

    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`,
    );
  };

  return (
   <div className="relative w-full max-w-md">
  <div className="flex w-full items-center gap-2 rounded-xl border border-light-400 bg-white px-4 py-2 shadow-sm dark:border-dark-400 dark:bg-dark-300">
    <Image
      src="/assets/icons/search.svg"
      alt="Search"
      width={24}
      height={24}
    />
    <Input
      value={query}
      placeholder="Search..."
      className="flex-1 border-none bg-transparent p-0 text-base text-dark-900 placeholder:text-light-500 focus:outline-none dark:text-white"
      onChange={(e) => setQuery(e.target.value)}
    />

    {open && (
      <ul className="absolute left-0 top-full z-10 mt-2 w-full max-h-80 overflow-y-auto rounded-xl border border-light-400 bg-white p-2 shadow-lg dark:border-dark-400 dark:bg-dark-300">
        {results.length > 0 ? (
          results.map((file) => (
            <li
              className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 hover:bg-light-100 dark:hover:bg-dark-200"
              key={file.$id}
              onClick={() => handleClickItem(file)}
            >
              <div className="flex items-center gap-4">
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                  className="size-9 min-w-9"
                />
                <p className="text-base font-semibold text-light-100 truncate">
                  {file.name}
                </p>
              </div>

              <FormattedDateTime
                date={file.$createdAt}
                className="text-xs text-light-200 truncate"
              />
            </li>
          ))
        ) : (
          <p className="px-3 py-2 text-sm text-light-500">No files found</p>
        )}
      </ul>
    )}
  </div>
</div>

  );
};

export default Search;
