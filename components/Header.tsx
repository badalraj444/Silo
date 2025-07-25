import Image from 'next/image';
import Search from './Search';
import FileUploader from './FileUploader';
import { signOutUser } from '@/lib/actions/user.actions';
const Header = () => {
  return (
    <header className="hidden items-center justify-between gap-5 p-5 sm:flex lg:py-7 xl:gap-10">
      <Search />
      <div className="flex-center min-w-fit gap-4">
        <FileUploader />
        <form action={async () => {
          "use server";
          await signOutUser();
        }}>
          <button type="submit" className="sign-out">
            <Image
              src="/assets/icons/logout.svg"
              alt="logout"
              width={24}
              height={24}
              className="w-6"
            />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
