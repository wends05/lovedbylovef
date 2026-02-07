"use client";

import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/lib/try-catch";
import { adminDashboardQueryOptions } from "../../../options";
import { galleryMutationOptions } from "../../options";
import { GallerySkeleton } from "../GallerySkeleton";
import { DeleteGalleryItemDialog } from "./GalleryDeleteDialog";
import { GalleryFilters } from "./GalleryFilters";
import type { CrochetListItem } from "./GalleryGrid";
import { GalleryGrid } from "./GalleryGrid";

export default function GalleryManagement() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const toggleVisibilityMutation = useMutation(
		galleryMutationOptions.toggleCrochetVisibility,
	);
	const deleteCrochetMutation = useMutation(
		galleryMutationOptions.deleteCrochet,
	);

	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
	const [visibilityFilter, setVisibilityFilter] = useState<string>("ALL");
	const [sortOption, setSortOption] = useState<string>("newest");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<CrochetListItem | null>(
		null,
	);

	const { data: crochets, isLoading } = useSuspenseQuery(
		adminDashboardQueryOptions.getAllCrochets,
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

	const handleToggleVisibility = async (item: CrochetListItem) => {
		const { success, error } = await tryCatch(
			toggleVisibilityMutation.mutateAsync({
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
	};

	const handleDelete = async () => {
		if (!itemToDelete) return;

		const { success, error } = await tryCatch(
			deleteCrochetMutation.mutateAsync({ data: { id: itemToDelete.id } }),
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
	};

	const openDeleteDialog = (item: CrochetListItem) => {
		setItemToDelete(item);
		setDeleteDialogOpen(true);
	};

	if (isLoading) {
		return <GallerySkeleton />;
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-end">
				<Button onClick={() => navigate({ to: "/admin/gallery/create" })}>
					Create Item
				</Button>
			</div>

			<GalleryFilters
				categoryFilter={categoryFilter}
				visibilityFilter={visibilityFilter}
				sortOption={sortOption}
				searchQuery={searchQuery}
				onCategoryChange={setCategoryFilter}
				onVisibilityChange={setVisibilityFilter}
				onSortChange={setSortOption}
				onSearchChange={setSearchQuery}
			/>

			<GalleryGrid
				items={filteredCrochets}
				onToggleVisibility={handleToggleVisibility}
				onEdit={(item) =>
					navigate({
						to: "/admin/gallery/$id/edit",
						params: { id: item.id },
					})
				}
				onDelete={openDeleteDialog}
			/>

			<DeleteGalleryItemDialog
				open={deleteDialogOpen}
				itemName={itemToDelete?.name ?? ""}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
