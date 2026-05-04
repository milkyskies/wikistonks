import { Field } from "@base-ui/react/field";

export interface TextFieldProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	disabled?: boolean;
	autoComplete?: string;
	type?: "text" | "email" | "password";
}

export function TextField(props: TextFieldProps) {
	return (
		<Field.Root className="block space-y-1">
			<Field.Label className="text-sm font-medium">{props.label}</Field.Label>
			<Field.Control
				type={props.type ?? "text"}
				value={props.value}
				onChange={(changeEvent) => props.onChange(changeEvent.target.value)}
				required={props.required}
				minLength={props.minLength}
				maxLength={props.maxLength}
				disabled={props.disabled}
				autoComplete={props.autoComplete}
				className="w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
			/>
		</Field.Root>
	);
}
