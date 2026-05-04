import { Loader2 } from "lucide-react";

export function FullPageLoader() {
	return (
		<div className="flex min-h-screen items-center justify-center text-muted-foreground">
			<Loader2 className="size-6 animate-spin" aria-label="Loading" />
		</div>
	);
}
