import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { toastError, toastSuccess } from "@/components/toast";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.auth.logout.$post>;

export const useLogout = () => {
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout["$post"]();
      return await response.json();
    },
    onSuccess: () => {
      toastSuccess("当前账号已退出");
      router.push("/sign-in");
      router.refresh();
    },
    onError: () => {
      toastError("退出失败");
    },
  });

  return mutation;
};
