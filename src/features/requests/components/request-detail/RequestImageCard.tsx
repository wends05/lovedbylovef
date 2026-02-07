import { Package } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { ImageZoom } from "@/components/ui/image-zoom";

type RequestImageCardProps = {
	imageUrl?: string | null;
	title: string;
};

export function RequestImageCard({ imageUrl, title }: RequestImageCardProps) {
	return (
		<Card className="overflow-hidden">
			<ImageZoom>
				<AspectRatio ratio={4 / 3}>
					{imageUrl ? (
						<img
							src={imageUrl}
							alt={title}
							className="object-cover w-full h-full"
						/>
					) : (
						<div className="w-full h-full bg-muted flex items-center justify-center">
							<Package className="w-16 h-16 text-muted-foreground/50" />
						</div>
					)}
				</AspectRatio>
			</ImageZoom>
		</Card>
	);
}
