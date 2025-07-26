'use client';

import FileUploader from '@/components/FileUploader';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { navItems } from '@/constants';
import { signOutUser } from '@/lib/actions/user.actions';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-separator';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface Props {
  $id: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

const MobileNavigation = ({
  $id: ownerId,
  accountId,
  fullName,
  avatar,
  email,
}: Props) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="flex h-[60px] items-center justify-between px-5 sm:hidden">
      <Image
        src="/assets/icons/logo-full-brand2.svg"
        alt="logo"
        width={60}
        height={52}
        className="h-auto"
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={30}
            height={30}
          />
        </SheetTrigger>

        <SheetContent className="h-screen px-3 bg-white dark:bg-dark-300">
          <SheetTitle>
            <div className="flex items-center gap-4 px-2 py-4">
              <Image
                src={avatar}
                alt="avatar"
                width={44}
                height={44}
                className="rounded-full object-cover"
              />
              <div className="hidden flex-col sm:hidden lg:flex">
                <p className="text-base font-semibold capitalize text-dark-900 dark:text-white">
                  {fullName}
                </p>
                <p className="text-xs text-light-500 dark:text-light-300">
                  {email}
                </p>
              </div>
            </div>
            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>

          <nav>
            <ul className="flex flex-col gap-3">
              {navItems.map(({ url, name, icon }) => (
                <Link key={name} href={url} className="w-full">
                  <li
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-base text-dark-800 hover:bg-light-100 dark:text-white dark:hover:bg-dark-200',
                      pathname === url &&
                        'bg-light-200 font-semibold dark:bg-dark-400'
                    )}
                  >
                    <Image
                      src={icon}
                      alt={name}
                      width={24}
                      height={24}
                      className={cn(
                        'transition-transform duration-200',
                        pathname === url && 'scale-110'
                      )}
                    />
                    <p>{name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>

          <Separator className="my-5 bg-light-200/20" />

          <div className="flex flex-col gap-4 pb-5">
            <FileUploader ownerId={ownerId} accountId={accountId} />
            <Button
              type="submit"
              onClick={async () => await signOutUser()}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              <Image
                src="/assets/icons/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
              <p>Logout</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
