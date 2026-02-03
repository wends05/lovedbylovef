import { useSuspenseQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import type { Category } from "@/generated/prisma/enums";
import { publicOptions } from "../../options";
import { CategoryFilter } from "./CategoryFilter";
import { CrochetCard } from "./CrochetCard";

export default function GalleryPage() {
	const [activeCategory, setActiveCategory] = useState<Category | "ALL">("ALL");
	const { data: crochets } = useSuspenseQuery(
		publicOptions.getVisibleCrochets(
			activeCategory === "ALL" ? undefined : activeCategory,
		),
	);
	const { data: categories } = useSuspenseQuery(publicOptions.getCategories());

	return (
		<div className="container mx-auto px-4 py-12">
			{/* Hero Section */}
			<div className="text-center mb-12">
				<div
					className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pink mb-6"
					style={{ backgroundColor: "var(--color-rose-light)" }}
				>
					<Sparkles
						className="w-4 h-4"
						style={{ color: "var(--color-rose)" }}
					/>
					<span
						className="text-sm font-medium"
						style={{ color: "var(--primary)" }}
					>
						Handmade Collection
					</span>
				</div>
				<h1
					className="text-4xl md:text-5xl font-bold mb-4 font-display"
					style={{
						background:
							"linear-gradient(135deg, var(--color-rose), var(--color-magenta))",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
					}}
				>
					Our Gallery
				</h1>
				<p
					className="text-lg max-w-2xl mx-auto"
					style={{ color: "var(--secondary-foreground)" }}
				>
					Explore our collection of handcrafted crochet pieces, each made with
					love and attention to detail.
				</p>
			</div>

			{/* Category Filter */}
			<div className="mb-10">
				<CategoryFilter
					categories={categories || []}
					activeCategory={activeCategory}
					onCategoryChange={setActiveCategory}
				/>
			</div>

			{/* Gallery Grid */}
			{crochets && crochets.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{crochets.map((crochet) => (
						<CrochetCard key={crochet.id} crochet={crochet} />
					))}
				</div>
			) : (
				<div className="text-center py-16">
					<div
						className="rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6"
						style={{ backgroundColor: "var(--color-rose-light)" }}
					>
						<Sparkles
							className="w-10 h-10"
							style={{ color: "var(--color-rose)" }}
						/>
					</div>
					<h3 className="text-xl font-semibold mb-2">No items available</h3>
					<p style={{ color: "var(--secondary-foreground)" }}>
						Check back soon for new handmade pieces!
					</p>
				</div>
			)}
		</div>
	);
}
