import { useState } from 'preact/hooks';

type Props = {
	initial?: number;
};

export default function CounterIsland({ initial = 0 }: Props) {
	const [count, setCount] = useState(initial);

	return (
		<div className="flex items-center justify-between gap-3">
			<div className="flex items-center gap-2">
				<button
					type="button"
					className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
					onClick={() => setCount((c) => c + 1)}
				>
					+1
				</button>
				<span className="text-sm">
					<span className="text-muted-foreground">Count:</span> {count}
				</span>
			</div>
			<span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">hydrates on visible</span>
		</div>
	);
}
