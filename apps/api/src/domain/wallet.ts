import {
	addDays,
	setHours,
	setMilliseconds,
	setMinutes,
	setSeconds,
} from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export const STARTING_CASH = 10000;
export const DAILY_BONUS_AMOUNT = 500;
export const DAILY_BONUS_RESET_HOUR_LOCAL = 8;

// Strictly after `from`: at 8:00am exact we return tomorrow's 8am, not now.
export const nextLocalResetAfter = (from: Date, timezone: string): Date => {
	const local = toZonedTime(from, timezone);
	let candidateLocal = setMilliseconds(
		setSeconds(setMinutes(setHours(local, DAILY_BONUS_RESET_HOUR_LOCAL), 0), 0),
		0,
	);

	if (candidateLocal <= local) {
		candidateLocal = addDays(candidateLocal, 1);
	}

	return fromZonedTime(candidateLocal, timezone);
};
