export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className='w-full sm:max-w-md absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
      {children}
    </main>
  )
}
