import { Select as BaseSelect } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
	readonly value: string;
	readonly label: string;
}

export interface SelectProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: readonly SelectOption[];
	disabled?: boolean;
}

export function Select(props: SelectProps) {
	return (
		<BaseSelect.Root
			value={props.value}
			onValueChange={(next) => {
				if (next !== null) props.onChange(next);
			}}
			disabled={props.disabled}
		>
			<BaseSelect.Label className="block text-sm font-medium mb-1">
				{props.label}
			</BaseSelect.Label>
			<BaseSelect.Trigger className="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50">
				<BaseSelect.Value />
				<BaseSelect.Icon>
					<ChevronDown className="size-4 text-muted-foreground" aria-hidden />
				</BaseSelect.Icon>
			</BaseSelect.Trigger>
			<BaseSelect.Portal>
				<BaseSelect.Positioner sideOffset={4} alignItemWithTrigger={false}>
					<BaseSelect.Popup className="max-h-72 overflow-auto rounded-md border border-border bg-background py-1 shadow-md">
						{props.options.map((option) => (
							<BaseSelect.Item
								key={option.value}
								value={option.value}
								className="relative flex cursor-default select-none items-center gap-2 px-3 py-1.5 text-sm outline-none data-[highlighted]:bg-muted"
							>
								<BaseSelect.ItemIndicator className="flex size-4 items-center justify-center">
									<Check className="size-3.5" aria-hidden />
								</BaseSelect.ItemIndicator>
								<BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
							</BaseSelect.Item>
						))}
					</BaseSelect.Popup>
				</BaseSelect.Positioner>
			</BaseSelect.Portal>
		</BaseSelect.Root>
	);
}
