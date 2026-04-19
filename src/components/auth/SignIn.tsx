'use client';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { SignInForm } from '@/types';
import { FieldInfo } from '@/utils/FieldInfo';
import { Checkbox } from '../ui/checkbox';
import { Spinner } from '../ui/spinner';
export default function SignIn() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: SignInForm,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const { data, error } = await authClient.signIn.email(
          {
            email: value.email,
            password: value.password,
            callbackURL: '/dashboard',
            rememberMe: false,
            //redirect to the dashboard or sign in page
          },
          {
            onSuccess: () => {
              toast('Sign-In successfull', {
                position: 'bottom-left',
                description: `Welcom ${data?.user.name || 'user'}`,
              });
            },
            onError: (ctx) => {
              toast('Sign-In successfull', {
                position: 'bottom-left',
                description: ctx.error.message,
              });
            },
          },
        );

        if (error) {
          formApi.setFieldMeta('password', (prev) => ({
            ...prev,
            isTouched: true,
            errors: [{ message: error.message || 'Invalid email or password' }],
          }));
          return;
        }

        formApi.reset();
      } catch (e) {
        formApi.setFieldMeta('password', (prev) => ({
          ...prev,
          isTouched: true,
          errors: [{ message: 'Something went wrong. Please try again.' }],
        }));
      }
    },
  });
  return (
    <div className='mt-5'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* EMAIL*/}
        <div className='mb-4'>
          <form.Field
            children={(field) => (
              <>
                <label
                  className='mb-2 block text-sm'
                  htmlFor={`input-${field.name}`}
                >
                  Email
                </label>
                <input
                  aria-describedby={`field-${field.name}-info`}
                  autoComplete='email'
                  className='h-9 w-full border bg-secondary/20 px-3 text-sm'
                  id={`input-${field.name}`}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='you@example.com'
                  type='email'
                  value={field.state.value}
                />
                <FieldInfo field={field} />
              </>
            )}
            name='email'
          />
        </div>
        {/*PASSWORD*/}
        <div className='mb-4'>
          <form.Field
            children={(field) => (
              <>
                <label
                  className='mb-2 block text-sm'
                  htmlFor={`input-${field.name}`}
                >
                  Password
                </label>
                <input
                  aria-describedby={`field-${field.name}-info`}
                  autoComplete='current-password'
                  className='w-full border bg-secondary/20 px-3 py-2 text-sm'
                  id={`input-${field.name}`}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='Enter your password'
                  type='password'
                  value={field.state.value}
                />
                <FieldInfo field={field} />
              </>
            )}
            name='password'
          />
        </div>
        <div className='mt-2 flex items-center gap-2 text-sm'>
          <Checkbox aria-setsize={2} /> <span>Remember me</span>
        </div>
        <form.Subscribe
          children={([canSubmit, isSubmitting]) => (
            <>
              <div className='mt-5 flex gap-2 border'>
                <button
                  className='flex h-9 w-full cursor-pointer items-center justify-center bg-primary px-4 py-2 text-sm disabled:opacity-50'
                  disabled={!canSubmit}
                  type='submit'
                >
                  {isSubmitting ? (
                    <Spinner variant={'circle-filled'} />
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </>
          )}
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        />
      </form>
      <button
        className='mt-2 flex h-9 w-full cursor-pointer items-center justify-center border px-4 py-2 text-sm disabled:opacity-50'
        onClick={async () => {
          await authClient.signIn.email(
            {
              email: 'cindy@gmail.com',
              password: 'cindy@gmail.com',
              callbackURL: '/dashboard',
            },
            {
              onSuccess: () => {
                toast('Sign-In successfull', {
                  position: 'bottom-left',
                  description: 'Welcome Cindy',
                });
              },
              onError: (ctx) => {
                toast('Sign-In successfull', {
                  position: 'bottom-left',
                  description: ctx.error.message,
                });
              },
            },
          );
        }}
        type='submit'
      >
        Sign In as Cindy
      </button>
    </div>
  );
}
