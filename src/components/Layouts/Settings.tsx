'use client';

import { useForm } from '@tanstack/react-form';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { authClient } from '@/lib/auth-client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

// ─── Validation Schema ────────────────────────────────────────────────────────
const UserProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  image: z.string().optional(),
  age: z.coerce.number().min(1).max(120).optional().or(z.literal('')),
  country: z.string().optional(),
  gender: z
    .enum(['male', 'female', 'non-binary', 'prefer-not-to-say'])
    .optional(),
  goals: z.string().optional(), // comma-separated
  industry: z.string().optional(),
  interests: z.string().optional(), // comma-separated
  languages: z.string().optional(), // comma-separated
  profession: z.string().optional(),
  region: z
    .enum(['Asia-Pacific(APAC)', 'Europe', 'America', 'Africa', 'Oceania'])
    .optional(),
});

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserProfile {
  age?: number;
  country?: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  goals?: string[];
  industry?: string;
  interests?: string[];
  languages?: string[];
  profession?: string;
  region?: 'Asia-Pacific(APAC)' | 'Europe' | 'America' | 'Africa' | 'Oceania';
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className='mb-1.5 block font-medium text-muted-foreground text-xs uppercase tracking-wide'
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}

function FieldError({ errors }: { errors: { message: string }[] }) {
  if (!errors.length) {
    return null;
  }
  return (
    <p className='mt-1 text-destructive text-xs'>
      {errors.map((e) => e.message).join(', ')}
    </p>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        'h-9 w-full border border-border bg-secondary/30 px-3 text-sm',
        'placeholder:text-muted-foreground/50 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring',
        'transition-colors',
        props.className,
      ].join(' ')}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        'h-9 w-full border border-border bg-secondary/30 px-3 text-sm',
        'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring',
        'appearance-none transition-colors',
        props.className,
      ].join(' ')}
    />
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className='mb-4 border-border border-b pb-2 font-semibold text-foreground text-sm'>
      {children}
    </h2>
  );
}

// ─── Avatar Upload ────────────────────────────────────────────────────────────
function AvatarUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value || '');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(url);
  };

  return (
    <div className='flex flex-col items-center gap-3'>
      <div className='group relative'>
        <div className='h-24 w-24 overflow-hidden rounded-full border-2 border-border bg-secondary/40'>
          {preview ? (
            <img
              alt='Profile'
              className='h-full w-full object-cover'
              src={preview}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              <svg
                className='h-10 w-10 text-muted-foreground/40'
                fill='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z' />
              </svg>
            </div>
          )}
        </div>
        <button
          className='absolute inset-0 flex items-center justify-center rounded-full bg-black/50 font-medium text-white text-xs opacity-0 transition-opacity group-hover:opacity-100'
          onClick={() => inputRef.current?.click()}
          type='button'
        >
          Edit
        </button>
      </div>
      <input
        accept='image/*'
        className='hidden'
        onChange={handleFile}
        ref={inputRef}
        type='file'
      />
      <button
        className='flex items-center gap-1.5 border border-border px-3 py-1.5 text-muted-foreground text-xs transition-colors hover:bg-secondary/50'
        onClick={() => inputRef.current?.click()}
        type='button'
      >
        <svg
          className='h-3.5 w-3.5'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z' />
        </svg>
        Change photo
      </button>
    </div>
  );
}

// ─── Tag Input (comma-separated displayed as pills) ───────────────────────────
function TagInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Input
        id={id}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        value={value}
      />
      {value && (
        <div className='mt-2 flex flex-wrap gap-1.5'>
          {value
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
            .map((tag) => (
              <span
                className='inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-primary text-xs'
                key={tag}
              >
                {tag}
              </span>
            ))}
        </div>
      )}
      <p className='mt-1 text-muted-foreground/60 text-xs'>
        Separate multiple values with commas
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const session = authClient.useSession();
  const [openConfirm, setOpenConfirm] = useState(false);
  const form = useForm({
    defaultValues: {
      name: session.data?.user.name ?? '',
      email: session.data?.user.email ?? '',
      image: session.data?.user.image ?? '',
      age: '' as string | number,
      country: '',
      gender: '' as UserProfile['gender'] | '',
      goals: '',
      industry: '',
      interests: '',
      languages: '',
      profession: '',
      region: '' as UserProfile['region'] | '',
    },
    validators: {
      onChange: UserProfileSchema,
    },
    onSubmit: async ({ value }) => {
      // Build typed UserProfile from form values
      const profile: UserProfile = {
        age: value.age ? Number(value.age) : undefined,
        country: value.country || undefined,
        gender: (value.gender as UserProfile['gender']) || undefined,
        goals: value.goals
          ? value.goals
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        industry: value.industry || undefined,
        interests: value.interests
          ? value.interests
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        languages: value.languages
          ? value.languages
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        profession: value.profession || undefined,
        region: (value.region as UserProfile['region']) || undefined,
      };

      console.log('Submitted:', {
        name: value.name,
        email: value.email,
        image: value.image,
        ...profile,
      });

      toast('Profile updated', {
        position: 'bottom-left',
        description: `Changes saved for ${value.name}`,
      });
    },
  });

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <div className='mx-auto max-w-4xl px-4 py-10'>
        {/* Page Header */}
        <div className='mb-8'>
          <h1 className='font-semibold text-xl'>Profile</h1>
          <p className='mt-1 text-muted-foreground text-sm'>
            This information will be shared to agents. Update your details below
            if you wish to have your agent more access.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-[1fr_260px]'>
            {/* ── Left Column ───────────────────────────────────── */}
            <div className='space-y-8'>
              {/* Basic Info */}
              <section className='border border-border p-5'>
                <SectionTitle>Basic Information</SectionTitle>
                <div className='space-y-4'>
                  {/* Name */}
                  <div>
                    <form.Field name='name'>
                      {(field) => (
                        <>
                          <Label htmlFor={`input-${field.name}`}>Name</Label>
                          <Input
                            id={`input-${field.name}`}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder='Your full name'
                            type='text'
                            value={field.state.value}
                          />
                          <FieldError
                            errors={
                              field.state.meta.isTouched
                                ? (field.state.meta.errors as {
                                    message: string;
                                  }[])
                                : []
                            }
                          />
                        </>
                      )}
                    </form.Field>
                  </div>

                  {/* Email */}
                  <div>
                    <form.Field name='email'>
                      {(field) => (
                        <>
                          <Label htmlFor={`input-${field.name}`}>Email</Label>
                          <Input
                            autoComplete='email'
                            id={`input-${field.name}`}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder='you@example.com'
                            type='email'
                            value={field.state.value}
                          />
                          <FieldError
                            errors={
                              field.state.meta.isTouched
                                ? (field.state.meta.errors as {
                                    message: string;
                                  }[])
                                : []
                            }
                          />
                        </>
                      )}
                    </form.Field>
                  </div>

                  {/* Age + Gender row */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <form.Field name='age'>
                        {(field) => (
                          <>
                            <Label htmlFor={`input-${field.name}`}>Age</Label>
                            <Input
                              id={`input-${field.name}`}
                              max={120}
                              min={1}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder='e.g. 28'
                              type='number'
                              value={field.state.value as string}
                            />
                            <FieldError
                              errors={
                                field.state.meta.isTouched
                                  ? (field.state.meta.errors as {
                                      message: string;
                                    }[])
                                  : []
                              }
                            />
                          </>
                        )}
                      </form.Field>
                    </div>

                    <div>
                      <form.Field name='gender'>
                        {(field) => (
                          <>
                            <Label htmlFor={`input-${field.name}`}>
                              Gender
                            </Label>
                            <Select
                              id={`input-${field.name}`}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(
                                  e.target.value as UserProfile['gender'],
                                )
                              }
                              value={field.state.value}
                            >
                              <option value=''>Select gender</option>
                              <option value='male'>Male</option>
                              <option value='female'>Female</option>
                              <option value='non-binary'>Non-binary</option>
                              <option value='prefer-not-to-say'>
                                Prefer not to say
                              </option>
                            </Select>
                          </>
                        )}
                      </form.Field>
                    </div>
                  </div>
                </div>
              </section>

              {/* Location */}
              <section className='border border-border p-5'>
                <SectionTitle>Location</SectionTitle>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <form.Field name='country'>
                      {(field) => (
                        <>
                          <Label htmlFor={`input-${field.name}`}>Country</Label>
                          <Input
                            id={`input-${field.name}`}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder='e.g. India'
                            type='text'
                            value={field.state.value}
                          />
                        </>
                      )}
                    </form.Field>
                  </div>

                  <div>
                    <form.Field name='region'>
                      {(field) => (
                        <>
                          <Label htmlFor={`input-${field.name}`}>Region</Label>
                          <Select
                            id={`input-${field.name}`}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(
                                e.target.value as UserProfile['region'],
                              )
                            }
                            value={field.state.value}
                          >
                            <option value=''>Select region</option>
                            <option value='Asia-Pacific(APAC)'>
                              Asia-Pacific (APAC)
                            </option>
                            <option value='Europe'>Europe</option>
                            <option value='America'>America</option>
                            <option value='Africa'>Africa</option>
                            <option value='Oceania'>Oceania</option>
                          </Select>
                        </>
                      )}
                    </form.Field>
                  </div>
                </div>
              </section>

              {/* Professional */}
              <section className='border border-border p-5'>
                <SectionTitle>Professional</SectionTitle>
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <form.Field name='profession'>
                        {(field) => (
                          <>
                            <Label htmlFor={`input-${field.name}`}>
                              Profession
                            </Label>
                            <Input
                              id={`input-${field.name}`}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder='e.g. Software Engineer'
                              type='text'
                              value={field.state.value}
                            />
                          </>
                        )}
                      </form.Field>
                    </div>
                    <div>
                      <form.Field name='industry'>
                        {(field) => (
                          <>
                            <Label htmlFor={`input-${field.name}`}>
                              Industry
                            </Label>
                            <Input
                              id={`input-${field.name}`}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder='e.g. Technology'
                              type='text'
                              value={field.state.value}
                            />
                          </>
                        )}
                      </form.Field>
                    </div>
                  </div>

                  <div>
                    <form.Field name='languages'>
                      {(field) => (
                        <>
                          <Label htmlFor={`input-${field.name}`}>
                            Languages
                          </Label>
                          <TagInput
                            id={`input-${field.name}`}
                            onChange={field.handleChange}
                            placeholder='e.g. English, Hindi, Japanese'
                            value={field.state.value}
                          />
                        </>
                      )}
                    </form.Field>
                  </div>
                </div>
              </section>

              {/* Personal */}
              <section className='border border-border p-5'>
                <SectionTitle>Personal</SectionTitle>
                <div className='space-y-4'>
                  <div>
                    <form.Field name='interests'>
                      {(field) => (
                        <>
                          <Label htmlFor={`input-${field.name}`}>
                            Interests
                          </Label>
                          <TagInput
                            id={`input-${field.name}`}
                            onChange={field.handleChange}
                            placeholder='e.g. Open Source, Music, Travel'
                            value={field.state.value}
                          />
                        </>
                      )}
                    </form.Field>
                  </div>

                  <div>
                    <form.Field name='goals'>
                      {(field) => (
                        <>
                          <Label htmlFor={`input-${field.name}`}>Goals</Label>
                          <TagInput
                            id={`input-${field.name}`}
                            onChange={field.handleChange}
                            placeholder='e.g. Learn Rust, Ship a product, Read 12 books'
                            value={field.state.value}
                          />
                        </>
                      )}
                    </form.Field>
                  </div>
                </div>
              </section>
            </div>

            {/* ── Right Column ──────────────────────────────────── */}
            <div className='space-y-6'>
              <section className='border border-border p-5'>
                <SectionTitle>Profile Picture</SectionTitle>
                <form.Field name='image'>
                  {(field) => (
                    <AvatarUpload
                      onChange={field.handleChange}
                      value={field.state.value}
                    />
                  )}
                </form.Field>
              </section>

              {/* Submit sticky card */}
              <div className='border border-border bg-secondary/10 p-4'>
                <p className='mb-3 text-muted-foreground text-xs'>
                  By Updating the profile you agree to terms and conditions
                  viable by the company and hearby provide access to personal
                  information
                </p>
                <form.Subscribe
                  selector={(s) => [s.canSubmit, s.isSubmitting, s.isDirty]}
                >
                  {([canSubmit, isSubmitting, isDirty]) => (
                    <Button
                      className='flex w-full items-center justify-center gap-2 bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:opacity-50'
                      disabled={!canSubmit || isSubmitting}
                      onClick={() => setOpenConfirm(true)}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className='h-4 w-4 animate-spin'
                            fill='none'
                            viewBox='0 0 24 24'
                          >
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'
                            />
                            <path
                              className='opacity-75'
                              d='M4 12a8 8 0 018-8v8H4z'
                              fill='currentColor'
                            />
                          </svg>
                          Saving…
                        </>
                      ) : (
                        'Save profile'
                      )}
                    </Button>
                  )}
                </form.Subscribe>

                <form.Subscribe selector={(s) => s.isDirty}>
                  {(isDirty) =>
                    isDirty ? (
                      <p className='mt-2 text-center text-amber-500 text-xs'>
                        You have unsaved changes
                      </p>
                    ) : null
                  }
                </form.Subscribe>
              </div>
            </div>
          </div>
        </form>
        <AlertDialog onOpenChange={setOpenConfirm} open={openConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save profile changes?</AlertDialogTitle>
              <AlertDialogDescription>
                This will update your personal profile information.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => form.handleSubmit()}>
                Confirm Save
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
