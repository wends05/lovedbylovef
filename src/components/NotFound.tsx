import { Link, useRouter } from "@tanstack/react-router";
import { Heart, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	const router = useRouter();
	const handleBack = () => router.history.back();

	return (
		<div className="min-h-screen bg-gradient-soft-pink flex items-center justify-center px-4">
			{/* Decorative background elements */}
			<div
				className="absolute top-20 left-[15%] w-48 h-48 rounded-full opacity-20 blur-3xl animate-float"
				style={{ backgroundColor: "var(--color-rose)" }}
			/>
			<div
				className="absolute bottom-32 right-[20%] w-64 h-64 rounded-full opacity-15 blur-3xl animate-float"
				style={{
					backgroundColor: "var(--color-pink-soft)",
					animationDelay: "1s",
				}}
			/>

			<div className="relative z-10 max-w-md w-full text-center">
				{/* 404 Illustration */}
				<div className="mb-8 relative">
					<div className="w-32 h-32 mx-auto rounded-full bg-card border-2 border-border flex items-center justify-center">
						<span className="text-6xl font-bold text-gradient-magenta font-display">
							404
						</span>
					</div>
					<div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-float">
						<Search className="w-4 h-4 text-primary-foreground" />
					</div>
				</div>

				{/* Title */}
				<h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
					Page Not Found
				</h1>

				{/* Description */}
				<p className="text-lg text-muted-foreground mb-8 leading-relaxed">
					Oops! It seems like this page has unraveled. Let's get you back to
					something cozy.
				</p>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<Button
						size={"lg"}
						onClick={handleBack}
						className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-pink"
					>
						Back
					</Button>
					<Link to="/">
						<Button
							size="lg"
							className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-pink"
						>
							<Home className="w-4 h-4 mr-2" />
							Back Home
						</Button>
					</Link>

					<Link to="/contact">
						<Button
							variant="outline"
							size="lg"
							className="rounded-full border-primary text-primary hover:bg-primary/10"
						>
							<Heart className="w-4 h-4 mr-2" />
							Contact Us
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
