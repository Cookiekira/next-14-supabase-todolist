import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { createClient } from '@/supabase/server'

import { Toast } from './_component/Toast'

export default async function Login({
  searchParams,
}: {
  searchParams: { message: string; type: string | undefined }
}) {
  const {
    data: { session },
  } = await createClient(cookies()).auth.getSession()

  if (session) return redirect('/')

  const signInWithGithub = async () => {
    'use server'

    const supabase = createClient(cookies())

    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${headers().get('origin')}/auth/callback`,
      },
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }

    return redirect(data.url)
  }

  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }

    return redirect('/')
  }

  const signUp = async (formData: FormData) => {
    'use server'

    const origin = headers().get('origin')
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }

    return redirect(
      '/login?message=Check email to continue sign in process&type=success'
    )
  }

  return (
    <>
      <Link
        href='/'
        className='absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1'
        >
          <polyline points='15 18 9 12 15 6' />
        </svg>{' '}
        Back
      </Link>
      <div className='py-5 rounded-lg  flex-1 flex flex-col w-full px-8 sm:max-w-md gap-2 mx-auto  absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
        <form action={signInWithGithub}>
          <button className='w-full flex items-center justify-center border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-6  gap-2 bg-slate-100 hover:bg-slate-200 '>
            <span className='i-ph-github-logo' />
            Sign in with Github
          </button>
        </form>

        <form
          className='animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground  '
          action={signIn}
        >
          <label className='text-md' htmlFor='email'>
            Email
          </label>
          <input
            className='rounded-md px-4 py-2 bg-inherit border mb-6'
            name='email'
            placeholder='you@example.com'
            required
          />
          <label className='text-md' htmlFor='password'>
            Password
          </label>
          <input
            className='rounded-md px-4 py-2 bg-inherit border mb-6'
            type='password'
            name='password'
            placeholder='••••••••'
            required
          />
          <button className='bg-green-500 rounded-md px-4 py-2 text-foreground mb-2'>
            Sign In
          </button>
          <button
            formAction={signUp}
            className='border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2'
          >
            Sign Up
          </button>
          {searchParams?.message && (
            <Toast message={searchParams.message} type={searchParams.type} />
          )}
        </form>
      </div>
    </>
  )
}
