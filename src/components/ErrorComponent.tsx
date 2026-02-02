import { Link, useRouter } from "@tanstack/react-router";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorComponentProps {
	error: Error;
	info?: { componentStack?: string };
	reset?: () => void;
}

export default function ErrorComponent({ error, reset }: ErrorComponentProps) {
	const router = useRouter();

	const handleReset = () => {
		if (reset) {
			reset();
		} else {
			router.invalidate();
		}
	};

	return (
		<div className="min-h-screen bg-gradient-soft-pink flex items-center justify-center px-4">
			{/* Decorative background elements */}
			<div
				className="absolute top-20 right-[15%] w-48 h-48 rounded-full opacity-20 blur-3xl animate-float"
				style={{ backgroundColor: "var(--color-rose)" }}
			/>
			<div
				className="absolute bottom-32 left-[20%] w-64 h-64 rounded-full opacity-15 blur-3xl animate-float"
				style={{
					backgroundColor: "var(--color-magenta-light)",
					animationDelay: "1s",
				}}
			/>

			<div className="relative z-10 max-w-lg w-full text-center">
				{/* Error Icon */}
				<div className="mb-8">
					<div className="w-24 h-24 mx-auto rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center animate-float">
						<AlertCircle className="w-12 h-12 text-destructive" />
					</div>
				</div>

				{/* Title */}
				<h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
					Something Went Wrong
				</h1>

				{/* Description */}
				<p className="text-lg text-muted-foreground mb-4 leading-relaxed">
					We hit a snag while stitching things together. Don't worry, even the
					best crochet projects have tangles!
				</p>

				{/* Error Message (if available) */}
				{error.message && (
					<div className="mb-8 p-4 rounded-lg bg-card border border-border">
						<p className="text-sm text-destructive font-medium">
							{error.message}
						</p>
					</div>
				)}

				{/* Actions */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<Button
						size="lg"
						onClick={handleReset}
						className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-pink"
					>
						<RefreshCcw className="w-4 h-4 mr-2" />
						Try Again
					</Button>

					<Link to="/">
						<Button
							variant="outline"
							size="lg"
							className="rounded-full border-primary text-primary hover:bg-primary/10"
						>
							<Home className="w-4 h-4 mr-2" />
							Back Home
						</Button>
					</Link>
				</div>

				{/* Support message */}
				<p className="mt-8 text-sm text-muted-foreground">
					Need help? Contact us and we'll help you untangle this.
				</p>
			</div>
		</div>
	);
}
