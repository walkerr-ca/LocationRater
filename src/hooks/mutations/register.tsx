import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { useConfig } from "../config";
import { BaseResponse } from "../../types/response";

export const registerSchema = z
  .object({
    username: z.string().min(4).max(20),
    password: z.string().min(8),
    secondPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.secondPassword, {
    message: "Passwords do not match",
    path: ["secondPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
export type RegisterResponse = BaseResponse<{
  id: number;
}>;

export const useRegisterMutation = () => {
  const { apiUrl } = useConfig();

  const { mutate, isIdle, isPending, isSuccess, isError, error, data } = useMutation({
    mutationKey: ["auth", "register"],
    mutationFn: async (input: RegisterSchema) => {
      const { success, error } = await registerSchema.safeParseAsync(input);

      if (!success) {
        throw error;
      }

      const response = await fetch(`${apiUrl}/auth/register`, {
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

      return data.result as RegisterResponse;
    },
  });

  return {
    mutate,
    isIdle,
    isPending,
    isSuccess,
    isError,
    error,
    data,
  };
};
