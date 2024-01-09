import Login from '@/app/login/page'
import { Card } from '@/components/ui/card'

import { Modal } from './modal'

export default function LoginModal({
  searchParams,
}: {
  searchParams: { message: string; type: string | undefined }
}) {
  return (
    <Card>
      <Modal>
        <Login searchParams={searchParams} />
      </Modal>
    </Card>
  )
}
