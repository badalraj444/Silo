'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { verifySecret } from '@/lib/actions/user.actions';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export const OtpModal = ({
  accountId,
  email,
}: {
  accountId: string;
  email: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [isloading, setIsloading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsloading(true);

    try {
      const sessionId = await verifySecret({ accountId, password });

      if (sessionId) router.push('/');
    } catch (error) {
      console.log('Failed to verify OTP', error);
    } finally {
      console.log('OTP verification Block executed');
      setIsloading(false);
    }
  };
  return (
    <div className="flex justify-center items-center">
  <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
    <AlertDialogContent className="shad-alert-dialog bg-white">
      <AlertDialogHeader className="relative flex justify-center">
        
        <AlertDialogTitle className="h2 text-center">Please enter OTP</AlertDialogTitle>
        <AlertDialogDescription className="subtitle-2 text-center text-black">
          we've sent an one time password to{' '}
          <span className="text-primary">{email}</span>
          <br /> Please enter it below to verify your account.
          <br />
        </AlertDialogDescription>
        <div className="flex justify-center items-center mt-4">
          <InputOTP
            maxLength={6}
            value={password}
            onChange={setPassword}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          >
            <InputOTPGroup >
              <InputOTPSlot index={0} className='border-primary text-black' />
              <InputOTPSlot index={1} className='border-primary text-black'/>
              <InputOTPSlot index={2} className='border-primary text-black'/>
              <InputOTPSlot index={3} className='border-primary text-black'/>
              <InputOTPSlot index={4} className='border-primary text-black'/>
              <InputOTPSlot index={5} className='border-primary text-black'/>
            </InputOTPGroup>
          </InputOTP>
        </div>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <div className="flex w-full flex-col gap-4">
          <AlertDialogCancel onClick={() => setIsOpen(false)} className="bg-white text-[14px] leading-[20px] font-medium transition-all rounded-full">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction onClick={handleSubmit} className="bg-brand text-[14px] leading-[20px] font-medium hover:bg-brand-100 transition-all rounded-full">
          Submit
              {isloading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
        </AlertDialogAction>
        </div>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</div>

  );
};

// todo: finish styles
