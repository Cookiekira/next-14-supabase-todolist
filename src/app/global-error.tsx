'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <main className='flex flex-col items-center justify-center min-h-[50vh]'>
          <h1 className='text-[4rem] font-bold  mb-8 mx-auto'>Error</h1>
          <p className='text-xl text-center mb-8'>
            {error.message ?? 'An error occurred.'}
          </p>
          <button
            className='bg-[#0070f3] text-white px-4 py-2 rounded-md'
            onClick={reset}
          >
            Reset
          </button>
        </main>
      </body>
    </html>
  )
}
