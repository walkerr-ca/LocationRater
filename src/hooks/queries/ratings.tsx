import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../auth";
import { useConfig } from "../config";
import { Rating } from "../../types/rating";
import { BaseResponse } from "../../types/response";

export const useRatings = () => {
  const { apiUrl } = useConfig();
  const { accessToken } = useAuth();

  const { data, error, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["ratings"],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/reviews`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken!.value}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ratings");
      }

      const data = (await response.json()) as BaseResponse<Rating[]>;
      return data.result ?? [];
    },
  });

  return { data, error, isLoading, isSuccess, isError };
};
