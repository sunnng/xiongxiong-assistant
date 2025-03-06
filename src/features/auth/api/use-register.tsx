import type { InferRequestType, InferResponseType } from 'hono'
import { toastError, toastSuccess } from '@/components/toast'
import { client } from '@/lib/rpc'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

const $register = client.api.auth.register.$post

type RequestType = InferRequestType<typeof $register>
type ResponseType = InferResponseType<typeof $register, 200>

export function useRegister() {
  const router = useRouter()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await $register(json)

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
