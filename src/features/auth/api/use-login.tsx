import type { InferRequestType, InferResponseType } from 'hono'
import { toastError, toastSuccess } from '@/components/toast'
import { client } from '@/lib/rpc'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

const $login = client.api.auth.login.$post

type RequestType = InferRequestType<typeof $login>
type ResponseType = InferResponseType<typeof $login, 200>

export function useLogin() {
  const router = useRouter()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await $login(json)

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
      }

      return await res.json()
    },
    onSuccess: ({ message }) => {
      toastSuccess(message)
      router.push('/')
    },
    onError: (error) => {
      toastError(error.message)
    },
  })

  return mutation
}
