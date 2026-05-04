import { Button } from "@/features/shared/components/button";
import { meQueryOptions } from "@/services/api/me/me-query-options";
import { useClaimDailyBonus } from "@/services/api/me/use-claim-daily-bonus";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Option } from "effect";
import { Coins, Gift } from "lucide-react";
import { useState } from "react";

const groupedNumber = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 0,
});

const formatCash = (amount: number): string =>
	`¥${groupedNumber.format(amount)}`;

const formatNextClaim = (instant: Date, timezone: string): string => {
	const local = toZonedTime(instant, timezone);
	return `${format(local, "EEE h:mma")} ${timezone}`;
};

export function WalletButton() {
	const { data: me } = useSuspenseQuery(meQueryOptions);

	if (Option.isNone(me)) return null;

	const now = new Date();
	const canClaim = Option.match(me.value.nextDailyBonusAt, {
		onNone: () => true,
		onSome: (instant) => instant <= now,
	});

	return (
		<WalletButtonInner
			cashBalance={me.value.cashBalance}
			canClaim={canClaim}
			nextDailyBonusAt={me.value.nextDailyBonusAt}
			timezone={me.value.timezone}
		/>
	);
}

interface WalletButtonInnerProps {
	cashBalance: number;
	canClaim: boolean;
	nextDailyBonusAt: Option.Option<Date>;
	timezone: string;
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

	const nextClaimLabel = Option.match(props.nextDailyBonusAt, {
		onNone: () => null,
		onSome: (instant) => formatNextClaim(instant, props.timezone),
	});

	return (
		<div className="flex items-center gap-3">
			<span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-sm font-medium tabular-nums">
				<Coins className="size-4 text-muted-foreground" aria-hidden />
				{formatCash(props.cashBalance)}
			</span>

			{props.canClaim ? (
				<Button
					onClick={handleClaim}
					loading={claim.isPending}
					className="px-2.5 py-1 text-sm"
				>
					<Gift className="size-4" aria-hidden />
					Claim ¥500
				</Button>
			) : nextClaimLabel ? (
				<span className="text-xs text-muted-foreground">
					Next: {nextClaimLabel}
				</span>
			) : null}

			{error ? <span className="text-xs text-destructive">{error}</span> : null}
		</div>
	);
}
