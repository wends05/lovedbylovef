import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
	return (
		<section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-soft-pink">
			{/* Floating gradient circles - using theme colors */}
			<div
				className="absolute top-20 left-[10%] w-64 h-64 rounded-full opacity-30 blur-3xl animate-float"
				style={{ backgroundColor: "var(--color-rose)" }}
			/>
			<div
				className="absolute top-40 right-[15%] w-72 h-72 rounded-full opacity-25 blur-3xl animate-float"
				style={{
					backgroundColor: "var(--color-pink-soft)",
					animationDelay: "1s",
				}}
			/>
			<div
				className="absolute bottom-32 left-[20%] w-80 h-80 rounded-full opacity-20 blur-3xl animate-float"
				style={{
					backgroundColor: "var(--color-magenta-light)",
					animationDelay: "2s",
				}}
			/>

			{/* Decorative sparkles - using theme colors */}
			<div
				className="absolute top-32 right-[25%] animate-sparkle"
				style={{ color: "var(--color-rose)" }}
			>
				<Sparkles className="w-5 h-5" />
			</div>
			<div
				className="absolute bottom-48 left-[15%] animate-sparkle"
				style={{ color: "var(--color-rose-light)", animationDelay: "0.5s" }}
			>
				<Sparkles className="w-4 h-4" />
			</div>
			<div
				className="absolute top-48 right-[10%] animate-sparkle"
				style={{ color: "var(--color-pink-soft)", animationDelay: "1s" }}
			>
				<Sparkles className="w-3 h-3" />
			</div>

			{/* Content */}
			<div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
				{/* Badge - using card/border theme colors */}
				<div
					className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pink mb-8 animate-float"
					style={{ animationDelay: "0.5s", animationDuration: "4s" }}
				>
					<Heart
						className="w-4 h-4"
						style={{ color: "var(--ring)", fill: "var(--ring)" }}
					/>
					<span
						className="text-sm font-medium"
						style={{ color: "var(--primary)" }}
					>
						Handmade with love
					</span>
				</div>

				{/* Main Heading */}
				<h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-magenta font-display leading-tight">
					Loved by Lovef
				</h1>

				{/* Subheading - using secondary-foreground */}
				<p
					className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
					style={{ color: "var(--secondary-foreground)" }}
				>
					Custom crochet designs crafted with care. From adorable amigurumi to
					cozy wearables, each piece is made uniquely for you.
				</p>

				{/* CTA Buttons */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<Button
						size="lg"
						className="rounded-full px-8 py-6 text-base font-medium text-primary-foreground transition-all hover:-translate-y-0.5 glow-pink"
						style={{
							backgroundColor: "var(--primary)",
						}}
						render={
							<Link to="/gallery">
								Explore Designs
								<ArrowRight className="w-4 h-4 ml-2" />
							</Link>
						}
					/>

					<Button
						variant="outline"
						size="lg"
						className="rounded-full px-8 py-6 text-base font-medium transition-all hover:-translate-y-0.5"
						style={{
							borderColor: "var(--ring)",
							color: "var(--primary)",
							backgroundColor: "transparent",
						}}
						render={<Link to="/about">Learn More</Link>}
					/>
				</div>
			</div>

			{/* Bottom gradient fade - using background */}
			<div
				className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t to-transparent"
				style={{
					backgroundImage: `linear-gradient(to top, var(--background), transparent)`,
				}}
			/>
		</section>
	);
}
