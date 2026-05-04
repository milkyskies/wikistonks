import { Option } from "effect";
import { describe, expect, test } from "vitest";
import { Me, type MeApiDto } from "./me";

const baseDto: MeApiDto = {
	id: "user-1",
	email: "a@b.c",
	displayName: "tester",
	avatarUrl: null,
	cashBalance: 10000,
	timezone: "Asia/Tokyo",
	lastDailyBonusAt: null,
	nextDailyBonusAt: null,
	createdAt: "2026-01-01T00:00:00.000Z",
	updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("Me.fromApi", () => {
	test("converts null nullable fields to Option.none()", () => {
		const me = Me.fromApi(baseDto);

		expect(Option.getOrNull(me.avatarUrl)).toBeNull();
		expect(Option.getOrNull(me.lastDailyBonusAt)).toBeNull();
		expect(Option.getOrNull(me.nextDailyBonusAt)).toBeNull();
	});

	test("parses ISO date strings to Date instances", () => {
		const me = Me.fromApi({
			...baseDto,
			nextDailyBonusAt: "2026-05-04T23:00:00.000Z",
		});

		const parsed = Option.getOrThrow(me.nextDailyBonusAt);
		expect(parsed).toBeInstanceOf(Date);
		expect(parsed.toISOString()).toBe("2026-05-04T23:00:00.000Z");
	});

	test("preserves cashBalance and timezone", () => {
		const me = Me.fromApi({
			...baseDto,
			cashBalance: 42000,
			timezone: "America/Los_Angeles",
		});

		expect(me.cashBalance).toBe(42000);
		expect(me.timezone).toBe("America/Los_Angeles");
	});
});
