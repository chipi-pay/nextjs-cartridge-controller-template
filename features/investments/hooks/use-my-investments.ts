import { Investment } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface PaginatedResponse {
  investments: Investment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UseMyInvestmentsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useMyInvestments({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
}: UseMyInvestmentsParams = {}) {
  return useQuery({
    queryKey: ["investments", { page, limit, sortBy, sortOrder }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/investments/me?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch investments");
      }

      return response.json() as Promise<PaginatedResponse>;
    },
  });
}
