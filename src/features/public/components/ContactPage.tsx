import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
	const instagramUrl = "https://instagram.com/_lovedbylovef";

	return (
		<div className="container mx-auto px-4 py-20">
			<div className="max-w-2xl mx-auto text-center">
				{/* Icon */}
				<div
					className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
					style={{
						background:
							"linear-gradient(135deg, var(--color-rose-light), var(--color-pink-soft))",
					}}
				>
					<Instagram
						className="w-12 h-12"
						style={{ color: "var(--primary)" }}
					/>
				</div>

				{/* Title */}
				<h1
					className="text-4xl font-bold mb-4 font-display"
					style={{
						background:
							"linear-gradient(135deg, var(--color-rose), var(--color-magenta))",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
					}}
				>
					Get in Touch
				</h1>

				{/* Handle */}
				<p
					className="text-xl font-medium mb-4"
					style={{ color: "var(--primary)" }}
				>
					@_lovedbylovef
				</p>

				{/* Description */}
				<p
					className="text-lg mb-8 max-w-md mx-auto"
					style={{ color: "var(--secondary-foreground)" }}
				>
					Follow us on Instagram for our latest designs, behind-the-scenes
					content, and custom order updates.
				</p>

				{/* CTA Button */}
				<Button
					size="lg"
					className="rounded-full px-8"
					style={{ backgroundColor: "var(--primary)" }}
					onClick={() =>
						window.open(instagramUrl, "_blank", "noopener,noreferrer")
					}
				>
					<Instagram className="w-5 h-5 mr-2" />
					Follow on Instagram
				</Button>

				{/* Additional Info */}
				<div className="mt-12 pt-8 border-t border-border">
					<p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
						DM us on Instagram for inquiries and custom orders
					</p>
				</div>
			</div>
		</div>
	);
}
