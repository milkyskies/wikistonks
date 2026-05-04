import { useCreateMe } from "@/services/api/me/use-create-me";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_authed/onboarding/")({
	component: OnboardingPage,
});

const detectBrowserTimezone = (): string => {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
	} catch {
		return "UTC";
	}
};

const listTimezones = (): readonly string[] => {
	if (typeof Intl.supportedValuesOf === "function") {
		return Intl.supportedValuesOf("timeZone");
	}

	return ["UTC"];
};

function OnboardingPage() {
	const navigate = useNavigate();
	const createMe = useCreateMe();
	const [displayName, setDisplayName] = useState("");
	const [timezone, setTimezone] = useState(detectBrowserTimezone);
	const [error, setError] = useState<string | null>(null);

	const timezones = useMemo(listTimezones, []);

	const handleSubmit = async (formEvent: React.FormEvent) => {
		formEvent.preventDefault();
		setError(null);

		try {
			await createMe.mutateAsync({
				displayName: displayName.trim(),
				timezone,
			});
			navigate({ to: "/" });
		} catch (caught) {
			setError(
				caught instanceof Error ? caught.message : "Failed to create profile",
			);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center p-6">
			<form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
				<h1 className="text-2xl font-bold">Welcome to wikistonks</h1>
				<p className="text-sm text-muted-foreground">
					Pick a display name and confirm your timezone. Your daily ¥500 bonus
					resets at 8am in this timezone.
				</p>

				<label className="block space-y-1">
					<span className="text-sm font-medium">Display name</span>
					<input
						type="text"
						placeholder="trader-san"
						value={displayName}
						onChange={(changeEvent) => setDisplayName(changeEvent.target.value)}
						required
						minLength={1}
						maxLength={40}
						className="w-full rounded-md border border-border bg-background px-3 py-2"
					/>
				</label>

				<label className="block space-y-1">
					<span className="text-sm font-medium">Timezone</span>
					<select
						value={timezone}
						onChange={(changeEvent) => setTimezone(changeEvent.target.value)}
						className="w-full rounded-md border border-border bg-background px-3 py-2"
					>
						{timezones.map((zoneName) => (
							<option key={zoneName} value={zoneName}>
								{zoneName}
							</option>
						))}
					</select>
				</label>

				{error ? <p className="text-sm text-destructive">{error}</p> : null}

				<button
					type="submit"
					disabled={createMe.isPending}
					className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-50"
				>
					{createMe.isPending ? "Creating..." : "Continue"}
				</button>
			</form>
		</div>
	);
}
