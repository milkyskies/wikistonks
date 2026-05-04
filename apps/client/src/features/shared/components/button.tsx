import { Button as BaseButton } from "@base-ui/react/button";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps {
	type?: "button" | "submit";
	variant?: ButtonVariant;
	disabled?: boolean;
	loading?: boolean;
	onClick?: () => void;
	children: React.ReactNode;
	className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
	primary: "bg-primary text-primary-foreground hover:opacity-90",
	secondary:
		"bg-secondary text-secondary-foreground border border-border hover:opacity-90",
	ghost: "text-foreground hover:bg-muted",
};

export function Button(props: ButtonProps) {
	const variant = props.variant ?? "primary";
	const isDisabled = props.disabled || props.loading;

	return (
		<BaseButton
			type={props.type ?? "button"}
			disabled={isDisabled}
			onClick={props.onClick}
			className={[
				"inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed",
				variantClasses[variant],
				props.className ?? "",
			].join(" ")}
		>
			{props.loading ? (
				<Loader2 className="size-4 animate-spin" aria-hidden />
			) : null}
			{props.children}
		</BaseButton>
	);
}
