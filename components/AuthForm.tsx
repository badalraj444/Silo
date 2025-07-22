'use client';

import { createAccount, signInUser } from '@/lib/actions/user.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React from 'react';
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

import { Input } from '@/components/ui/input';
type FormType = 'sign-in' | 'sign-up';

const authFormSchema = (formType: FormType) => {
  return z.object({
    fullName:
      formType === 'sign-up'
        ? z.string().min(2, {
            message: 'Username must be at least 2 characters.',
          })
        : z.string().optional(),
    email: z.string().email(),
  });
};

export function AuthForm({ type }: { type: FormType }) {
  const [isloading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [accountId, setAccountId] = React.useState<string | null>(null);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === 'sign-in' ? 'Sign-in' : 'Sign-up'}
          </h1>
          {type === 'sign-up' && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Please enter your full name"
                        {...field}
                        className="shad-input"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Please enter your email address"
                      {...field}
                      className="shad-input"
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button type="submit" className="form-submit-button">
            {isloading
              ? 'Loading...'
              : type === 'sign-in'
              ? 'Sign in'
              : 'Sign up'}
          </Button>
          {errorMessage && (
            <div className="error-message">
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
    </>
  );
}
// todo: add loading spinner to button
// todo: add styles to form
