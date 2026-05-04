import { describe, expect, test } from "vitest";
import { nextLocalResetAfter } from "./wallet";

describe("nextLocalResetAfter", () => {
	test("returns today's 8am when called before 8am local", () => {
		const at7amJst = new Date("2026-05-04T07:00:00+09:00");

		const result = nextLocalResetAfter(at7amJst, "Asia/Tokyo");

		expect(result.toISOString()).toBe("2026-05-03T23:00:00.000Z");
	});

	test("returns tomorrow's 8am when called at exactly 8am local", () => {
		const at8amJst = new Date("2026-05-04T08:00:00+09:00");

		const result = nextLocalResetAfter(at8amJst, "Asia/Tokyo");

		expect(result.toISOString()).toBe("2026-05-04T23:00:00.000Z");
	});

	test("returns tomorrow's 8am when called after 8am local", () => {
		const at10amJst = new Date("2026-05-04T10:00:00+09:00");

		const result = nextLocalResetAfter(at10amJst, "Asia/Tokyo");

		expect(result.toISOString()).toBe("2026-05-04T23:00:00.000Z");
	});

	test("respects timezone independently of input wall clock", () => {
		const sameInstant = new Date("2026-05-04T01:00:00Z");

		const utcResult = nextLocalResetAfter(sameInstant, "UTC");
		const pstResult = nextLocalResetAfter(sameInstant, "America/Los_Angeles");

		expect(utcResult.toISOString()).toBe("2026-05-04T08:00:00.000Z");
		expect(pstResult.toISOString()).toBe("2026-05-04T15:00:00.000Z");
	});

	test("crosses midnight correctly", () => {
		const at11pmJst = new Date("2026-05-04T23:00:00+09:00");

		const result = nextLocalResetAfter(at11pmJst, "Asia/Tokyo");

		expect(result.toISOString()).toBe("2026-05-04T23:00:00.000Z");
	});

	test("a TZ change cannot move the gate backwards in time", () => {
		const claimAt = new Date("2026-05-04T00:00:00Z");

		const gateInJst = nextLocalResetAfter(claimAt, "Asia/Tokyo");
		const gateInUtc14 = nextLocalResetAfter(claimAt, "Pacific/Kiritimati");

		expect(gateInJst.getTime()).toBeGreaterThan(claimAt.getTime());
		expect(gateInUtc14.getTime()).toBeGreaterThan(claimAt.getTime());
	});
});
