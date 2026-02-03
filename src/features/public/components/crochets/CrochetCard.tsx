import { Package } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Category } from "@/generated/prisma";
import { categoryLabels } from "./CategoryFilter";

interface Crochet {
	id: string;
	name: string;
	description: string;
	category: Category;
	price: number;
	imageURL: string;
}

interface CrochetCardProps {
	crochet: Crochet;
}

export function CrochetCard({ crochet }: CrochetCardProps) {
	return (
		<Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
			<AspectRatio ratio={4 / 3}>
				{crochet.imageURL ? (
					<img
						src={crochet.imageURL}
						alt={crochet.name}
						className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
					/>
				) : (
					<div className="w-full h-full bg-muted flex items-center justify-center">
						<Package className="w-12 h-12 text-muted-foreground/50" />
					</div>
				)}
			</AspectRatio>
			<CardHeader className="pb-2">
				<div className="flex items-start justify-between gap-2">
					<CardTitle className="text-lg font-semibold line-clamp-1">
						{crochet.name}
					</CardTitle>
				</div>
				<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
					{categoryLabels[crochet.category]}
				</span>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
					{crochet.description}
				</p>
				<p className="font-semibold text-lg">${crochet.price.toFixed(2)}</p>
			</CardContent>
		</Card>
	);
}
