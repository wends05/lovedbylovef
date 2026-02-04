import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	CATEGORY_OPTIONS,
	SORT_OPTIONS,
	VISIBILITY_OPTIONS,
} from "../../schemas/GalleryOptions";

interface GalleryFiltersProps {
	searchQuery: string;
	categoryFilter: string;
	visibilityFilter: string;
	sortOption: string;
	onSearchChange: (value: string) => void;
	onCategoryChange: (value: string) => void;
	onVisibilityChange: (value: string) => void;
	onSortChange: (value: string) => void;
}

export function GalleryFilters({
	searchQuery,
	categoryFilter,
	visibilityFilter,
	sortOption,
	onSearchChange,
	onCategoryChange,
	onVisibilityChange,
	onSortChange,
}: GalleryFiltersProps) {
	return (
		<div className="flex flex-col sm:flex-row gap-4">
			<div className="relative flex-1">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search items..."
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					className="pl-9"
				/>
			</div>

			<Select
				value={categoryFilter}
				onValueChange={(value) => onCategoryChange(value || "ALL")}
			>
				<SelectTrigger className="w-45">
					<SelectValue placeholder="Category" />
				</SelectTrigger>
				<SelectContent>
					{CATEGORY_OPTIONS.map((cat) => (
						<SelectItem key={cat.value} value={cat.value}>
							{cat.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={visibilityFilter}
				onValueChange={(value) => onVisibilityChange(value || "ALL")}
			>
				<SelectTrigger className="w-37.5">
					<SelectValue placeholder="Visibility" />
				</SelectTrigger>
				<SelectContent>
					{VISIBILITY_OPTIONS.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={sortOption}
				onValueChange={(value) => onSortChange(value || "newest")}
			>
				<SelectTrigger className="w-45">
					<SelectValue placeholder="Sort by" />
				</SelectTrigger>
				<SelectContent>
					{SORT_OPTIONS.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
