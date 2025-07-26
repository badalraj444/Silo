import Image from 'next/image';
import Search from './Search';
import FileUploader from './FileUploader';
import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from './ui/button';
const Header = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  return (
   <header className="hidden items-center justify-between gap-5 p-5 sm:flex lg:py-7 xl:gap-10">
  <Search />
  <div className="flex items-center justify-center min-w-fit gap-4">
    <FileUploader ownerId={userId} accountId={accountId} />
    <form
      action={async () => {
        "use server";
        await signOutUser();
      }}
    >
      <Button type="submit" className="flex-center h-[52px] min-w-[54px] items-center rounded-full bg-brand/10 p-0 text-brand shadow-none transition-all hover:bg-brand/20">
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
    </form>
  </div>
</header>

  );
};

export default Header;
