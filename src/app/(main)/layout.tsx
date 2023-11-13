import { Header } from './Header'
import { Providers } from './providers'

export default function TodoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Providers>
        <Header />
        {children}
      </Providers>
    </>
  )
}
