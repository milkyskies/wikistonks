import { Option } from "effect";
import type { User } from "../../domain/models/user";
import type { UserRepository } from "../../domain/repositories/user-repository";
import { DAILY_BONUS_AMOUNT, nextLocalResetAfter } from "../../domain/wallet";
import { DailyBonusAlreadyClaimed } from "../errors";

export type ClaimDailyBonusResult = {
	user: User;
	credited: number;
};

export async function claimDailyBonus(
	users: UserRepository,
	user: User,
	now: Date = new Date(),
): Promise<ClaimDailyBonusResult> {
	const nextDailyBonusAt = nextLocalResetAfter(now, user.timezone);
	const updated = await users.claimDailyBonus({
		userId: user.id,
		now,
		nextDailyBonusAt,
		amount: DAILY_BONUS_AMOUNT,
	});

	if (Option.isSome(updated)) {
		return { user: updated.value, credited: DAILY_BONUS_AMOUNT };
	}

	throw new DailyBonusAlreadyClaimed({
		userId: user.id,
		nextClaimAt: Option.getOrElse(
			user.nextDailyBonusAt,
			() => nextDailyBonusAt,
		),
	});
}
