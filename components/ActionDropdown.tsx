'use client';

import { FileDetails, ShareInput } from '@/components/ActionsModalContent';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { actionsDropdownItems } from '@/constants';
import {
  deleteFile,
  renameFile,
  updateFileUsers,
} from '@/lib/actions/file.actions';
import { constructDownloadUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Models } from 'node-appwrite';
import { useState } from 'react';

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);

  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
    //   setEmails([]);
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () => updateFileUsers({ fileId: file.$id, emails, path }),
      delete: () =>
        deleteFile({ fileId: file.$id, bucketFileId: file.bucketFileId, path }),
    };

    success = await actions[action.value as keyof typeof actions]();

    if (success) closeAllModals();

    setIsLoading(false);
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email);

    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    });

    if (success) setEmails(updatedEmails);
    closeAllModals();
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="w-full max-w-md rounded-md border border-light-300 bg-white p-6 text-dark-900 shadow-lg dark:border-dark-400 dark:bg-dark-300 dark:text-white">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-lg font-semibold text-light-100 dark:text-light-100">
            {label}
          </DialogTitle>

          {value === 'rename' && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md border border-light-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-dark-400 dark:bg-dark-200 dark:text-white"
            />
          )}

          {value === 'details' && <FileDetails file={file} />}

          {value === 'share' && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}

          {value === 'delete' && (
            <p className="text-sm text-light-100 dark:text-light-100">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-red-500">{file.name}</span>?
            </p>
          )}
        </DialogHeader>

        {['rename', 'delete', 'share'].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button
              onClick={closeAllModals}
              className="w-full rounded-md border border-light-300 bg-gray-200 px-4 py-2 text-sm font-medium text-dark-900 hover:bg-gray-300 dark:border-dark-400 dark:bg-dark-400 dark:text-white dark:hover:bg-dark-300 md:w-auto"
            >
              Cancel
            </Button>

            <Button
              onClick={handleAction}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-primary dark:hover:bg-primary/90 md:w-auto"
            >
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="focus:outline-none focus:ring-0 ring-offset-0">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="min-w-[220px] rounded-md border border-light-300 bg-white p-2 shadow-md dark:border-dark-400 dark:bg-dark-300">
          <DropdownMenuLabel className="max-w-[200px] truncate text-sm font-semibold text-dark-900 dark:text-white">
            {file.name}
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1 h-px bg-light-200 dark:bg-dark-400" />

          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-dark-900 hover:bg-gray-100 dark:text-white dark:hover:bg-dark-400"
              onClick={() => {
                setAction(actionItem);
                if (
                  ['rename', 'share', 'delete', 'details'].includes(
                    actionItem.value
                  )
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {actionItem.value === 'download' ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};
export default ActionDropdown;
