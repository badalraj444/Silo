import Image from 'next/image';
import React from 'react';
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="hidden w-1/2 items-center justify-center bg-brand p-10 lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-4">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            width={250}
            height={180}
            className="h-auto"
          />
          <div>
            <h1 className="h1">Manage your files best</h1>
            <p className="body-1">
              This is a place where you can store all your files
            </p>
          </div>
          <Image
            src="/assets/images/files.png"
            alt="logo"
            width={342}
            height={342}
            className="h-auto hover:scale-110 hover:rotate-2"
          />
        </div>
      </section>
      <section className="flex flex-1 flex-col items-center bg-brand2  py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <Image
            src="/assets/icons/logo-full-brand2.svg"
            alt="logo"
            width={108}
            height={82}
            className="h-auto w-[200px] lg:w-[250px]"
          />
        </div>
        <div>{children}</div>
      </section>
    </div>
  );
};

export default Layout;
