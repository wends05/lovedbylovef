"use client";

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ImageZoom } from "@/components/ui/image-zoom";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Crochet } from "@/generated/prisma/client";
import { Category } from "@/generated/prisma/enums";
import { tryCatch } from "@/lib/try-catch";
import { adminDashboardOptions } from "../options";
import { deleteCrochet, toggleCrochetVisibility } from "./server";
import { GallerySkeleton } from "./GallerySkeleton";

const CATEGORY_OPTIONS = [
	{ value: "ALL", label: "All Categories" },
	{ value: Category.TOY, label: "Toy" },
	{ value: Category.WEARABLE, label: "Wearable" },
	{ value: Category.HOME_DECOR, label: "Home Decor" },
	{ value: Category.ACCESSORY, label: "Accessory" },
	{ value: Category.OTHERS, label: "Others" },
] as const;

const VISIBILITY_OPTIONS = [
	{ value: "ALL", label: "All Items" },
	{ value: "VISIBLE", label: "Visible" },
	{ value: "HIDDEN", label: "Hidden" },
] as const;

const SORT_OPTIONS = [
	{ value: "newest", label: "Newest First" },
	{ value: "oldest", label: "Oldest First" },
	{ value: "price-asc", label: "Price: Low to High" },
	{ value: "price-desc", label: "Price: High to Low" },
	{ value: "name-asc", label: "Name: A-Z" },
	{ value: "name-desc", label: "Name: Z-A" },
] as const;

export default function GalleryManagement() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
	const [visibilityFilter, setVisibilityFilter] = useState<string>("ALL");
	const [sortOption, setSortOption] = useState<string>("newest");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<Crochet | null>(null);

	const { data: crochets, isLoading } = useSuspenseQuery(
		adminDashboardOptions.getAllCrochets,
	);

	const filteredCrochets = useMemo(() => {
		let result = [...crochets];

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(item) =>
					item.name.toLowerCase().includes(query) ||
					item.description.toLowerCase().includes(query),
			);
		}

		// Category filter
		if (categoryFilter !== "ALL") {
			result = result.filter((item) => item.category === categoryFilter);
		}

		// Visibility filter
		if (visibilityFilter !== "ALL") {
			const isVisible = visibilityFilter === "VISIBLE";
			result = result.filter((item) => item.isVisible === isVisible);
		}

		// Sort
		result.sort((a, b) => {
			switch (sortOption) {
				case "newest":
					return (
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
				case "oldest":
					return (
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					);
				case "price-asc":
					return (a.price ?? 0) - (b.price ?? 0);
				case "price-desc":
					return (b.price ?? 0) - (a.price ?? 0);
				case "name-asc":
					return a.name.localeCompare(b.name);
				case "name-desc":
					return b.name.localeCompare(a.name);
				default:
					return 0;
			}
		});

		return result;
	}, [crochets, searchQuery, categoryFilter, visibilityFilter, sortOption]);

	const handleToggleVisibility = useCallback(
		async (item: Crochet) => {
			const { success, error } = await tryCatch(
				toggleCrochetVisibility({
					data: {
						id: item.id,
						isVisible: !item.isVisible,
					},
				}),
			);

			if (!success) {
				toast.error("Failed to update visibility", {
					description: error || "Something went wrong",
				});
			} else {
				toast.success(
					`Item ${!item.isVisible ? "visible" : "hidden"} successfully`,
				);
				await queryClient.invalidateQueries({
					queryKey: ["adminCrochets"],
				});
			}
		},
		[queryClient],
	);

	const handleDelete = useCallback(async () => {
		if (!itemToDelete) return;

		const { success, error } = await tryCatch(
			deleteCrochet({ data: { id: itemToDelete.id } }),
		);

		if (!success) {
			toast.error("Failed to delete item", {
				description: error || "Something went wrong",
			});
		} else {
			toast.success("Item deleted successfully");
			await queryClient.invalidateQueries({
				queryKey: ["adminCrochets"],
			});
		}

		setDeleteDialogOpen(false);
		setItemToDelete(null);
	}, [itemToDelete, queryClient]);

	const openDeleteDialog = useCallback((item: Crochet) => {
		setItemToDelete(item);
		setDeleteDialogOpen(true);
	}, []);

	if (isLoading) {
		return <GallerySkeleton />;
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground font-display">
						Gallery Management
					</h1>
					<p className="text-muted-foreground mt-1">
						Manage your crochet gallery items ({filteredCrochets.length} of{" "}
						{crochets.length})
					</p>
				</div>

				<Button
					className="gap-2"
					onClick={() => navigate({ to: "/admin/gallery/create" })}
				>
					<Plus className="h-4 w-4" />
					Add New Item
				</Button>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search items..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>

				<Select
					value={categoryFilter}
					onValueChange={(value) => setCategoryFilter(value || "ALL")}
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
					onValueChange={(value) => setVisibilityFilter(value || "ALL")}
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
					onValueChange={(value) => setSortOption(value || "newest")}
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

			{/* Grid */}
			{filteredCrochets.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-muted-foreground">
							No items found. Try adjusting your filters or add a new item.
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredCrochets.map((item) => (
						<Card key={item.id} className={item.isVisible ? "" : "opacity-60"}>
							<div className="aspect-video relative overflow-hidden rounded-t-lg">
								<ImageZoom>
									<img
										src={item.imageURL}
										alt={item.name}
										className="w-full h-full object-cover"
									/>
								</ImageZoom>
							</div>
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div>
										<CardTitle className="text-lg">{item.name}</CardTitle>
										<CardDescription>{item.category}</CardDescription>
									</div>
									<div className="flex gap-1">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleToggleVisibility(item)}
											title={item.isVisible ? "Hide item" : "Show item"}
										>
											{item.isVisible ? (
												<Eye className="h-4 w-4" />
											) : (
												<EyeOff className="h-4 w-4" />
											)}
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() =>
												navigate({
													to: "/admin/gallery/$id/edit",
													params: { id: item.id },
												})
											}
											title="Edit item"
										>
											<Pencil className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="text-destructive"
											onClick={() => openDeleteDialog(item)}
											title="Delete item"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground mb-2 line-clamp-2">
									{item.description}
								</p>
								<p className="font-semibold text-lg">
									{item.price ? `$${item.price.toFixed(2)}` : "No price set"}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Item</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete &quot;{itemToDelete?.name}&quot;?
							This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDelete}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
