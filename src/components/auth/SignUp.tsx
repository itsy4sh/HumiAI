'use client';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { SignUpForm } from '@/types';
import { FieldInfo } from '@/utils/FieldInfo';

export default function SignUp() {
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    validators: {
      onChange: SignUpForm,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const { data, error } = await authClient.signUp.email(
          {
            name: value.username,
            email: value.email,
            password: value.password,
            callbackURL: '/dashboard',
          },
          {
            onSuccess: () => {
              toast('Sign-Up successfull', {
                position: 'bottom-left',
                description: `Welcom ${data?.user.name || 'user'}`,
              });
            },
            onError: (ctx) => {
              toast('Sign-Up successfull', {
                position: 'bottom-left',
                description: ctx.error.message,
              });
            },
          },
        );
        if (error) {
          formApi.setFieldMeta('email', (prev) => ({
            ...prev,
            isTouched: true,
            errors: [{ message: error.message || 'Unable to create account' }],
          }));
          return;
        }

        formApi.reset();
      } catch (e) {
        formApi.setFieldMeta('email', (prev) => ({
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
        {/*username*/}
        <div className='mb-4'>
          <form.Field
            children={(field) => (
              <>
                <label
                  className='mb-2 block text-sm'
                  htmlFor={`input-${field.name}`}
                >
                  Username
                </label>
                <input
                  aria-describedby={`field-${field.name}-info`}
                  className='h-9 w-full border bg-secondary/20 px-3 text-sm'
                  id={`input-${field.name}`}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='you@example.com'
                  type='text'
                  value={field.state.value}
                />
                <FieldInfo field={field} />
              </>
            )}
            name='username'
          />
        </div>
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
                    'Create an account'
                  )}
                </button>
              </div>
            </>
          )}
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        />
      </form>
    </div>
  );
}
