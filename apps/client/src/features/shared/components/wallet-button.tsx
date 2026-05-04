import { meQueryOptions } from "@/services/api/me/me-query-options";
import { useClaimDailyBonus } from "@/services/api/me/use-claim-daily-bonus";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Option } from "effect";
import { Coins, Gift } from "lucide-react";
import { useState } from "react";

const yenFormatter = new Intl.NumberFormat("ja-JP", {
	style: "currency",
	currency: "JPY",
	maximumFractionDigits: 0,
});

const startOfUtcDay = (date: Date): number =>
	Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

const canClaimToday = (lastClaim: Option.Option<Date>): boolean =>
	Option.match(lastClaim, {
		onNone: () => true,
		onSome: (claimedAt) => startOfUtcDay(claimedAt) < startOfUtcDay(new Date()),
	});

export function WalletButton() {
	const { data: me } = useSuspenseQuery(meQueryOptions);

	if (Option.isNone(me)) return null;

	return (
		<WalletButtonInner
			cashBalance={me.value.cashBalance}
			canClaim={canClaimToday(me.value.lastDailyBonusAt)}
		/>
	);
}

interface WalletButtonInnerProps {
	cashBalance: number;
	canClaim: boolean;
}

function WalletButtonInner(props: WalletButtonInnerProps) {
	const claim = useClaimDailyBonus();
	const [error, setError] = useState<string | null>(null);

	const handleClaim = () => {
		setError(null);
		claim.mutate(undefined, {
			onError: (mutationError) => setError(mutationError.message),
		});
	};

	return (
		<div className="flex items-center gap-3">
			<span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-sm font-medium tabular-nums">
				<Coins className="size-4 text-muted-foreground" aria-hidden />
				{yenFormatter.format(props.cashBalance)}
			</span>

			{props.canClaim ? (
				<button
					type="button"
					onClick={handleClaim}
					disabled={claim.isPending}
					className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
				>
					<Gift className="size-4" aria-hidden />
					Claim ¥500
				</button>
			) : null}

			{error ? <span className="text-xs text-destructive">{error}</span> : null}
		</div>
	);
}
