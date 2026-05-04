import { Option } from "effect";
import type { User } from "../../domain/models/user";
import type { UserRepository } from "../../domain/repositories/user-repository";
import { DAILY_BONUS_AMOUNT, nextLocalResetAfter } from "../../domain/wallet";
import { DailyBonusAlreadyClaimed, UserNotFound } from "../errors";

export type ClaimDailyBonusResult = {
	user: User;
	credited: number;
};

export async function claimDailyBonus(
	users: UserRepository,
	userId: string,
	now: Date = new Date(),
): Promise<ClaimDailyBonusResult> {
	const existing = await users.findById(userId);
	if (Option.isNone(existing)) {
		throw new UserNotFound({ userId });
	}

	const nextDailyBonusAt = nextLocalResetAfter(now, existing.value.timezone);
	const updated = await users.claimDailyBonus({
		userId,
		now,
		nextDailyBonusAt,
		amount: DAILY_BONUS_AMOUNT,
	});

	if (Option.isSome(updated)) {
		return { user: updated.value, credited: DAILY_BONUS_AMOUNT };
	}

	throw new DailyBonusAlreadyClaimed({
		userId,
		nextClaimAt: Option.getOrElse(
			existing.value.nextDailyBonusAt,
			() => nextDailyBonusAt,
		),
	});
}
