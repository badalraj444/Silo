"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { sortTypes } from "@/constants";

const Sort = () => {
  const path = usePathname();
  const router = useRouter();

  const handleSort = (value: string) => {
    router.push(`${path}?sort=${value}`);
  };

  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
  <SelectTrigger className="w-[180px] rounded-md border border-light-300 bg-white px-3 py-2 text-sm text-dark-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-dark-400 dark:bg-dark-300 dark:text-white">
    <SelectValue placeholder={sortTypes[0].value} />
  </SelectTrigger>

  <SelectContent className="z-50 w-[180px] rounded-md border border-light-200 bg-white p-1 shadow-lg dark:border-dark-400 dark:bg-dark-300">
    {sortTypes.map((sort) => (
      <SelectItem
        key={sort.label}
        value={sort.value}
        className="cursor-pointer rounded-sm px-3 py-2 text-sm text-dark-800 hover:bg-light-100 dark:text-light-200 dark:hover:bg-dark-400"
      >
        {sort.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

  );
};

export default Sort;
