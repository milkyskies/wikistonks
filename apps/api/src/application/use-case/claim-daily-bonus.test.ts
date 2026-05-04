import { Option } from "effect";
import { beforeEach, describe, expect, test } from "vitest";
import { User } from "../../domain/models/user";
import type {
	ClaimDailyBonusInput,
	NewUser,
	UserRepository,
} from "../../domain/repositories/user-repository";
import { DailyBonusAlreadyClaimed } from "../errors";
import { claimDailyBonus } from "./claim-daily-bonus";

const baseUser = (overrides: Partial<User> = {}): User =>
	User.make({
		id: "user-1",
		firebaseUid: "fb-1",
		email: "a@b.c",
		displayName: "tester",
		avatarUrl: Option.none(),
		cashBalance: 10000,
		timezone: "Asia/Tokyo",
		lastDailyBonusAt: Option.none(),
		nextDailyBonusAt: Option.none(),
		createdAt: new Date("2026-01-01T00:00:00Z"),
		updatedAt: new Date("2026-01-01T00:00:00Z"),
		...overrides,
	});

const makeFakeRepo = (initial: User): UserRepository => {
	let stored = initial;

	return {
		findById: async (id) =>
			stored.id === id ? Option.some(stored) : Option.none(),
		findByFirebaseUid: async () => Option.none(),
		findByEmail: async () => Option.none(),
		create: async (input: NewUser) => {
			stored = baseUser({
				id: input.id,
				firebaseUid: input.firebaseUid,
				email: input.email,
				displayName: input.displayName,
				avatarUrl: input.avatarUrl,
				cashBalance: input.cashBalance,
				timezone: input.timezone,
			});
			return stored;
		},
		update: async () => Option.none(),
		claimDailyBonus: async (input: ClaimDailyBonusInput) => {
			if (stored.id !== input.userId) return Option.none();

			const gate = Option.getOrNull(stored.nextDailyBonusAt);
			if (gate && gate > input.now) return Option.none();

			stored = User.make({
				...stored,
				cashBalance: stored.cashBalance + input.amount,
				lastDailyBonusAt: Option.some(input.now),
				nextDailyBonusAt: Option.some(input.nextDailyBonusAt),
				updatedAt: input.now,
			});

			return Option.some(stored);
		},
	};
};

const currentUser = async (repo: UserRepository): Promise<User> =>
	Option.getOrThrow(await repo.findById("user-1"));

describe("claimDailyBonus", () => {
	let repo: UserRepository;

	beforeEach(() => {
		repo = makeFakeRepo(baseUser());
	});

	test("first claim adds 500 and sets next to today's 8am JST", async () => {
		const at7amJst = new Date("2026-05-04T07:00:00+09:00");

		const result = await claimDailyBonus(
			repo,
			await currentUser(repo),
			at7amJst,
		);

		expect(result.credited).toBe(500);
		expect(result.user.cashBalance).toBe(10500);
		expect(Option.getOrNull(result.user.nextDailyBonusAt)?.toISOString()).toBe(
			"2026-05-03T23:00:00.000Z",
		);
	});

	test("second claim within the same window throws DailyBonusAlreadyClaimed", async () => {
		const at9amJst = new Date("2026-05-04T09:00:00+09:00");
		await claimDailyBonus(repo, await currentUser(repo), at9amJst);

		const at10amJst = new Date("2026-05-04T10:00:00+09:00");
		await expect(
			claimDailyBonus(repo, await currentUser(repo), at10amJst),
		).rejects.toThrow(DailyBonusAlreadyClaimed);
	});

	test("punctual 8am claim works every day with no drift", async () => {
		const monday8am = new Date("2026-05-04T08:00:00+09:00");
		const tuesday8am = new Date("2026-05-05T08:00:00+09:00");
		const wednesday8am = new Date("2026-05-06T08:00:00+09:00");

		const monday = await claimDailyBonus(
			repo,
			await currentUser(repo),
			monday8am,
		);
		const tuesday = await claimDailyBonus(
			repo,
			await currentUser(repo),
			tuesday8am,
		);
		const wednesday = await claimDailyBonus(
			repo,
			await currentUser(repo),
			wednesday8am,
		);

		expect(monday.user.cashBalance).toBe(10500);
		expect(tuesday.user.cashBalance).toBe(11000);
		expect(wednesday.user.cashBalance).toBe(11500);
	});

	test("changing TZ between claims doesn't grant a free claim", async () => {
		const claim1 = new Date("2026-05-04T09:00:00+09:00");
		await claimDailyBonus(repo, await currentUser(repo), claim1);

		const updatedToUtc14 = User.make({
			...(await currentUser(repo)),
			timezone: "Pacific/Kiritimati",
		});
		repo = makeFakeRepo(updatedToUtc14);

		const fiveMinutesLater = new Date("2026-05-04T09:05:00+09:00");
		await expect(
			claimDailyBonus(repo, await currentUser(repo), fiveMinutesLater),
		).rejects.toThrow(DailyBonusAlreadyClaimed);
	});
});
