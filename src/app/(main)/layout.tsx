import { Header } from './Header'

export default function TodoLayout({
  children,
  login,
}: {
  children: React.ReactNode
  login: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      {login}
    </>
  )
}
