import type { InferResponseType } from 'hono'
import { toastError, toastSuccess } from '@/components/toast'
import { client } from '@/lib/rpc'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

type ResponseType = InferResponseType<typeof client.api.auth.logout.$post>

export function useLogout() {
  const router = useRouter()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post()
      return await response.json()
    },
    onSuccess: () => {
      toastSuccess('当前账号已退出')
      router.push('/sign-in')
      router.refresh()
    },
    onError: () => {
      toastError('退出失败')
    },
  })

  return mutation
}
