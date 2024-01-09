import { getHash } from 'next/dist/server/image-optimizer'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient, createClientWithCookies } from '@/supabase/server'

import { SubmitButton } from './_component/SubmitButton'
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

    const supabase = createClientWithCookies(cookies())

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
    const supabase = createClientWithCookies(cookieStore)

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
    const supabase = createClientWithCookies(cookieStore)

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
      <div className='py-5 rounded-lg  flex-1 flex flex-col w-full px-8 sm:max-w-md gap-2 mx-auto'>
        <form action={signInWithGithub}>
          <SubmitButton className='w-full flex items-center justify-center border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-6  gap-2 bg-slate-100 hover:bg-slate-200 '>
            <span className='i-ph-github-logo' />
            Sign in with Github
          </SubmitButton>
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
          <SubmitButton className='bg-green-500 hover:bg-green-500/90 rounded-md px-4 py-2 text-foreground mb-2'>
            Sign In
          </SubmitButton>
          <SubmitButton
            formAction={signUp}
            className='border border-foreground/20 rounded-md px-4 py-2 bg-secondary text-secondary-foreground
             hover:bg-secondary/50
            mb-2'
          >
            Sign Up
          </SubmitButton>
          {!!searchParams?.message && (
            <Toast
              key={getHash([searchParams.message, new Date().getTime()])}
              message={searchParams.message}
              type={searchParams.type}
            />
          )}
        </form>
      </div>
    </>
  )
}
