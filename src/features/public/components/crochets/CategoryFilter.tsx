import type { Category } from "@/generated/prisma/enums";

const categoryLabels: Record<Category, string> = {
	ACCESSORY: "Accessories",
	HOME_DECOR: "Home Decor",
	TOY: "Toys",
	WEARABLE: "Wearables",
	OTHERS: "Others",
};

interface CategoryFilterProps {
	categories: Category[];
	activeCategory: Category | "ALL";
	onCategoryChange: (category: Category | "ALL") => void;
}

export function CategoryFilter({
	categories,
	activeCategory,
	onCategoryChange,
}: CategoryFilterProps) {
	return (
		<div className="flex flex-wrap gap-2 justify-center">
			<button
				onClick={() => onCategoryChange("ALL")}
				className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
					activeCategory === "ALL"
						? "bg-primary text-primary-foreground shadow-lg"
						: "bg-muted text-muted-foreground hover:bg-muted/80"
				}`}
			>
				All
			</button>
			{categories.map((category) => (
				<button
					key={category}
					onClick={() => onCategoryChange(category)}
					className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
						activeCategory === category
							? "bg-primary text-primary-foreground shadow-lg"
							: "bg-muted text-muted-foreground hover:bg-muted/80"
					}`}
				>
					{categoryLabels[category]}
				</button>
			))}
		</div>
	);
}

export { categoryLabels };
