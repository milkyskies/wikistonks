import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/_onboarded/_home/")({
	component: IndexPage,
});

function IndexPage() {
	return (
		<div className="space-y-2">
			<h1 className="text-2xl font-bold">Trending</h1>
			<p className="text-sm text-muted-foreground">
				Nothing here yet — listings come in the next slice.
			</p>
		</div>
	);
}
