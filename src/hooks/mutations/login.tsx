import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { useConfig } from "../config";
import { BaseResponse } from "../../types/response";

export const loginSchema = z.object({
  username: z.string().min(4).max(20),
  password: z.string().min(8),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type LoginResponse = BaseResponse<{
  token: string;
  refreshToken: string;
}>;

export const useLoginMutation = () => {
  const { apiUrl } = useConfig();

  const { mutateAsync, isIdle, isPending, isSuccess, isError, error, data } = useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: async (input: LoginSchema) => {
      const { success, error } = await loginSchema.safeParseAsync(input);

      if (!success) {
        throw error;
      }

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const data = (await response.json()) as BaseResponse<unknown>;
      if (!data.success) {
        throw new Error(data.error);
      }

      return data.result as LoginResponse;
    },
  });

  return {
    mutate: mutateAsync,
    isIdle,
    isPending,
    isSuccess,
    isError,
    error,
    data,
  };
};
