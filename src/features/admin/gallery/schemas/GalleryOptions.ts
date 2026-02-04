import { Category } from "@/generated/prisma/enums";

export type GalleryOption = { value: string; label: string };

export const CATEGORY_OPTIONS = [
	{ value: "ALL", label: "All Categories" },
	{ value: Category.TOY, label: "Toy" },
	{ value: Category.WEARABLE, label: "Wearable" },
	{ value: Category.HOME_DECOR, label: "Home Decor" },
	{ value: Category.ACCESSORY, label: "Accessory" },
	{ value: Category.OTHERS, label: "Others" },
] as const;

export const VISIBILITY_OPTIONS = [
	{ value: "ALL", label: "All Items" },
	{ value: "VISIBLE", label: "Visible" },
	{ value: "HIDDEN", label: "Hidden" },
] as const;

export const SORT_OPTIONS = [
	{ value: "newest", label: "Newest First" },
	{ value: "oldest", label: "Oldest First" },
	{ value: "price-asc", label: "Price: Low to High" },
	{ value: "price-desc", label: "Price: High to Low" },
	{ value: "name-asc", label: "Name: A-Z" },
	{ value: "name-desc", label: "Name: Z-A" },
] as const;
