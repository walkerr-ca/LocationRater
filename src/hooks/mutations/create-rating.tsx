import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { useAuth } from "../auth";
import { useConfig } from "../config";
import { Rating } from "../../types/rating";
import { BaseResponse } from "../../types/response";

export const createRatingSchema = z.object({
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  rating: z.number().min(1).max(5),
});

export type CreateRatingSchema = z.infer<typeof createRatingSchema>;

export const useCreateRatingMutation = () => {
  const { apiUrl } = useConfig();
  const { accessToken } = useAuth();

  const { mutate, data, error, isPending, isSuccess, isError } = useMutation({
    mutationKey: ["ratings", "create"],
    mutationFn: async (input: CreateRatingSchema) => {
      const response = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken!.value}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("Failed to create ratings");
      }

      const data = (await response.json()) as BaseResponse<Rating>;
      return data;
    },
  });

  return { mutate, data, error, isPending, isSuccess, isError };
};
