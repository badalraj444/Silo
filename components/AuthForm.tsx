'use client';

import { createAccount, signInUser } from '@/lib/actions/user.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { OtpModal } from '@/components/otpModal';
import { Input } from '@/components/ui/input';

type FormType = 'sign-in' | 'sign-up';

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  });
};

export function AuthForm({ type }: { type: FormType }) {
  const [isloading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [accountId, setAccountId] = useState(null);
  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const user =
        type === 'sign-up'
          ? await createAccount({
              fullName: values.fullName || '',
              email: values.email,
            })
          : await signInUser({ email: values.email });

      setAccountId(user.accountId);
    } catch {
      setErrorMessage('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
  <form
    onSubmit={form.handleSubmit(onSubmit)}
    className="flex max-h-[800px] w-full max-w-[580px] flex-col justify-center space-y-6 transition-all lg:h-full lg:space-y-8"
  >
    <h1 className="text-[34px] leading-[42px] font-bold text-center text-light-100 md:text-left">
      {type === 'sign-in' ? 'Sign-in' : 'Sign-up'}
    </h1>
    {type === 'sign-up' && (
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <div className="flex h-[78px] flex-col justify-center rounded-xl border border-light-300 px-4 shadow-[0px_10px_30px_0px_rgba(66,71,97,0.1)]">
              <FormLabel className="text-light-100 pt-2 text-[14px] leading-[20px] font-normal w-full">
                Full Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Please enter your full name"
                  {...field}
                  className="border-none shadow-none p-0 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 placeholder:text-light-200 text-[14px] leading-[20px] font-normal"
                />
              </FormControl>
            </div>
            <FormMessage className="text-red text-[14px] leading-[20px] font-normal ml-4" />
          </FormItem>
        )}
      />
    )}
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <div className="flex h-[78px] flex-col justify-center rounded-xl border border-light-300 px-4 shadow-[0px_10px_30px_0px_rgba(66,71,97,0.1)]">
            <FormLabel className="text-light-100 pt-2 text-[14px] leading-[20px] font-normal w-full">
              Email
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="Please enter your email address"
                {...field}
                className="border-none shadow-none p-0 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 placeholder:text-light-200 text-[14px] leading-[20px] font-normal"
              />
            </FormControl>
          </div>
          <FormMessage className="text-red text-[14px] leading-[20px] font-normal ml-4" />
        </FormItem>
      )}
    />
    <Button
      type="submit"
      className="bg-brand hover:bg-brand-100 transition-all rounded-full text-[14px] leading-[20px] font-medium h-[66px]"
    >
      {isloading
        ? 'Loading...'
        : type === 'sign-in'
        ? 'Sign in'
        : 'Sign up'}
    </Button>
    {errorMessage && (
      <div className="text-[14px] leading-[20px] font-normal mx-auto w-fit rounded-xl bg-[#b80000]/5 px-8 py-4 text-center text-[#b80000]">
        <p>{errorMessage}</p>
      </div>
    )}
    <div>
      <p className="form-footer-text">
        {type === 'sign-in'
          ? "Don't have an account?"
          : 'Already have an account?'}{' '}
        <Link
          href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
          className="text-brand"
        >
          {type === 'sign-in' ? 'Sign up' : 'Sign in'}
        </Link>
      </p>
    </div>
  </form>
</Form>

      {accountId && (
        <OtpModal email={form.getValues('email')} accountId={accountId} />
      )}
    </>
  );
}
// todo: add loading spinner to button
// todo: add styles to form
