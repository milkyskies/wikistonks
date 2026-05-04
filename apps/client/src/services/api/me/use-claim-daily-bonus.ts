import { Me } from "@/models/me";
import { api } from "@/services/api/client";
import { meQueryOptions } from "@/services/api/me/me-query-options";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Option } from "effect";

export type ClaimDailyBonusResponse = {
	credited: number;
	me: Me;
};

export function useClaimDailyBonus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (): Promise<ClaimDailyBonusResponse> => {
			const response = await api.me["daily-bonus"].$post();

			if (!response.ok) {
				const body = await response.json().catch(() => null);
				const errorTag =
					body && typeof body === "object" && "error" in body
						? String(body.error)
						: `HTTP ${response.status}`;
				throw new Error(errorTag);
			}

			const dto = await response.json();

			return { credited: dto.credited, me: Me.fromApi(dto.me) };
		},
		onSuccess: ({ me }) => {
			queryClient.setQueryData(meQueryOptions.queryKey, Option.some(me));
		},
	});
}
