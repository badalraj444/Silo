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
        <AlertDialogContent>
          <AlertDialogHeader>
            <span className="text-brand-100">Account ID: {accountId}</span>
            <AlertDialogTitle>Please enter OTP</AlertDialogTitle>
            <AlertDialogDescription>
              we've sent an one time password to{' '}
              <span className="text-brand-100">{email}</span>
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
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              {isloading ? 'Verifying...' : 'Verify OTP'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// todo: finish styles
