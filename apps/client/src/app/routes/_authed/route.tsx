import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Match } from "effect";

export const Route = createFileRoute("/_authed")({
	beforeLoad: ({ context }) => {
		Match.value(context.auth).pipe(
			Match.tag("SignedIn", () => {}),
			Match.tag("SignedOut", () => {
				throw redirect({ to: "/sign-in" });
			}),
			Match.exhaustive,
		);
	},
	component: AuthedLayout,
});

function AuthedLayout() {
	return <Outlet />;
}
