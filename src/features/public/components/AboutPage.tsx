import { useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	Handshake,
	Heart,
	MessageCircle,
	Palette,
	Search,
	Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function AboutPage() {
	const navigate = useNavigate();

	const processSteps = [
		{
			icon: Search,
			title: "Browse",
			description: "Explore our gallery or share your custom design ideas",
		},
		{
			icon: MessageCircle,
			title: "Consult",
			description: "We discuss details, colors, and personalization options",
		},
		{
			icon: Palette,
			title: "Create",
			description: "Handcrafted with care and attention to every stitch",
		},
		{
			icon: Handshake,
			title: "Meet Up",
			description:
				"We coordinate a safe, convenient meet-up where you receive your order",
		},
	];

	const values = [
		{
			title: "Quality Craftsmanship",
			description:
				"Every piece is meticulously handcrafted with premium yarns and careful attention to detail.",
		},
		{
			title: "Personalized Service",
			description:
				"We work closely with you to bring your vision to life, from colors to custom designs.",
		},
		{
			title: "Sustainable Materials",
			description:
				"We prioritize eco-friendly yarns and sustainable practices in all our creations.",
		},
	];

	return (
		<div className="container mx-auto px-4 py-12">
			{/* Hero Section */}
			<section className="text-center mb-20">
				<div
					className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
					style={{ backgroundColor: "var(--color-rose-light)" }}
				>
					<Heart
						className="w-4 h-4"
						style={{ color: "var(--color-rose)", fill: "var(--color-rose)" }}
					/>
					<span
						className="text-sm font-medium"
						style={{ color: "var(--primary)" }}
					>
						Handmade with love
					</span>
				</div>
				<h1
					className="text-4xl md:text-6xl font-bold mb-6 font-display"
					style={{
						background:
							"linear-gradient(135deg, var(--color-rose), var(--color-magenta))",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
					}}
				>
					About Loved by Lovef
				</h1>
				<p
					className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
					style={{ color: "var(--secondary-foreground)" }}
				>
					Creating unique, handcrafted crochet pieces that bring warmth and joy
					to your life. Each item is made with passion, patience, and a whole
					lot of love.
				</p>
			</section>

			{/* What We Offer Section */}
			<section className="mb-20">
				<h2
					className="text-3xl font-bold text-center mb-12 font-display"
					style={{ color: "var(--primary)" }}
				>
					What We Offer
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
					<Card className="hover:shadow-lg transition-all duration-300">
						<CardHeader>
							<div
								className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
								style={{ backgroundColor: "var(--color-rose-light)" }}
							>
								<Sparkles
									className="w-6 h-6"
									style={{ color: "var(--color-rose)" }}
								/>
							</div>
							<CardTitle style={{ color: "var(--primary)" }}>
								Ready-Made Collection
							</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription className="text-base mb-4">
								Browse our gallery of handcrafted crochet items available for
								immediate purchase. From cozy wearables to adorable amigurumi.
							</CardDescription>
							<Button
								variant="outline"
								className="w-full"
								onClick={() => navigate({ to: "/gallery" })}
							>
								View Gallery
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-all duration-300">
						<CardHeader>
							<div
								className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
								style={{ backgroundColor: "var(--color-rose-light)" }}
							>
								<Palette
									className="w-6 h-6"
									style={{ color: "var(--color-rose)" }}
								/>
							</div>
							<CardTitle style={{ color: "var(--primary)" }}>
								Custom Orders
							</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription className="text-base mb-4">
								Have something specific in mind? Submit a custom request and
								we'll bring your vision to life. Perfect for gifts and special
								occasions.
							</CardDescription>
							<Button
								className="w-full"
								style={{ backgroundColor: "var(--primary)" }}
								onClick={() => navigate({ to: "/create-request" })}
							>
								Request Custom Order
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Process Section */}
			<section className="mb-20">
				<h2
					className="text-3xl font-bold text-center mb-12 font-display"
					style={{ color: "var(--primary)" }}
				>
					Our Process
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{processSteps.map((step, index) => {
						const Icon = step.icon;
						return (
							<div key={step.title} className="relative">
								<Card className="h-full hover:shadow-md transition-all duration-300">
									<CardHeader>
										<div
											className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
											style={{ backgroundColor: "var(--color-rose-light)" }}
										>
											<Icon
												className="w-6 h-6"
												style={{ color: "var(--color-rose)" }}
											/>
										</div>
										<div
											className="text-sm font-medium mb-2"
											style={{ color: "var(--primary)" }}
										>
											Step {index + 1}
										</div>
										<CardTitle className="text-lg">{step.title}</CardTitle>
									</CardHeader>
									<CardContent>
										<p style={{ color: "var(--secondary-foreground)" }}>
											{step.description}
										</p>
									</CardContent>
								</Card>
								{index < processSteps.length - 1 && (
									<div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
										<ArrowRight
											className="w-6 h-6"
											style={{ color: "var(--color-rose)" }}
										/>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</section>

			{/* Values Section */}
			<section className="mb-20">
				<h2
					className="text-3xl font-bold text-center mb-12 font-display"
					style={{ color: "var(--primary)" }}
				>
					Our Values
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{values.map((value) => (
						<Card
							key={value.title}
							className="hover:shadow-md transition-all duration-300"
						>
							<CardHeader>
								<CardTitle
									className="text-lg"
									style={{ color: "var(--primary)" }}
								>
									{value.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p style={{ color: "var(--secondary-foreground)" }}>
									{value.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
			<section className="text-center">
				<div
					className="rounded-2xl p-12"
					style={{ backgroundColor: "var(--color-rose-light)" }}
				>
					<h2
						className="text-3xl font-bold mb-4 font-display"
						style={{ color: "var(--primary)" }}
					>
						Ready to get started?
					</h2>
					<p
						className="text-lg mb-8 max-w-2xl mx-auto"
						style={{ color: "var(--secondary-foreground)" }}
					>
						Whether you're looking for a ready-made piece or want something
						custom-made, we'd love to create something special for you.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Button
							size="lg"
							style={{ backgroundColor: "var(--primary)" }}
							onClick={() => navigate({ to: "/gallery" })}
						>
							Browse Gallery
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
						<Button
							variant="outline"
							size="lg"
							onClick={() => navigate({ to: "/contact" })}
							style={{ borderColor: "var(--ring)", color: "var(--primary)" }}
						>
							Contact Us
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
