import { Button } from "@/features/shared/components/button";
import { Select, type SelectOption } from "@/features/shared/components/select";
import { TextField } from "@/features/shared/components/text-field";
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

const listTimezones = (): readonly SelectOption[] => {
	const zones =
		typeof Intl.supportedValuesOf === "function"
			? Intl.supportedValuesOf("timeZone")
			: ["UTC"];

	return zones.map((zone) => ({ value: zone, label: zone }));
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
		<form onSubmit={handleSubmit} className="w-full space-y-4">
			<h1 className="text-2xl font-bold">Welcome to wikistonks</h1>

			<TextField
				label="Display name"
				value={displayName}
				onChange={setDisplayName}
				required
				minLength={1}
				maxLength={40}
			/>

			<Select
				label="Timezone"
				value={timezone}
				onChange={setTimezone}
				options={timezones}
			/>

			{error ? <p className="text-sm text-destructive">{error}</p> : null}

			<Button type="submit" loading={createMe.isPending} className="w-full">
				Continue
			</Button>
		</form>
	);
}
