import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import { Shield, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { authQueryOptions } from "@/features/auth/options";
import { AdminOrderActionsSheet } from "@/features/orders/components/sheets/AdminOrderActionsSheet";
import { UserOrderActionsSheet } from "@/features/orders/components/sheets/UserOrderActionsSheet";
import { OrderStatus } from "@/generated/prisma/enums";
import { useSupabaseSession } from "@/integrations/supabase/use-session";
import { cn } from "@/lib/utils";
import { useRealtimeChat } from "../hooks/useRealtimeChat";
import { chatQueryOptions } from "../options";

type OrderChatPageProps = {
	orderId?: string;
};

export default function OrderChatPage({ orderId }: OrderChatPageProps) {
	const router = useRouter();
	const { session } = useSupabaseSession();
	const viewerId = session?.user?.id ?? null;

	const { data: roleData } = useQuery(authQueryOptions.getCurrentUserRole);

	const { data: chatData, error: chatDataError } = useQuery({
		...chatQueryOptions.getChatData(orderId ?? "missing"),
		enabled: Boolean(orderId),
	});

	const isAdmin = roleData?.role === "ADMIN";
	const isRoleKnown = roleData?.role === "ADMIN" || roleData?.role === "USER";
	const ownerId = chatData?.order.requestorId ?? chatData?.user.id ?? null;
	const isOwner = Boolean(viewerId && ownerId && viewerId === ownerId);
	const isAllowed = Boolean(isAdmin || isOwner);
	const isForbidden =
		chatDataError instanceof Error
			? chatDataError.message === "Forbidden"
			: false;

	const orderChatId = chatData?.order.orderChat?.id ?? "missing";
	const {
		data: messagesData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		...chatQueryOptions.getChatMessagesInfinite(orderChatId),
		enabled: Boolean(chatData?.order.orderChat?.id) && isAllowed,
	});

	const { isConnected, form } = useRealtimeChat({
		orderChatId,
	});

	const orderStatus = chatData?.order?.status;
	const requestId = chatData?.order?.requestId;
	const orderTotalPrice = chatData?.order?.totalPrice ?? null;
	const viewerRoleLabel = isAdmin ? "Admin" : "Customer";
	const connectionLabel = isConnected ? "Live" : "Reconnecting";
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const isAtBottomRef = useRef(true);
	const [isAtBottom, setIsAtBottom] = useState(true);
	const [isLoadingOlder, setIsLoadingOlder] = useState(false);
	const messages = useMemo(() => {
		const pages = messagesData?.pages ?? [];
		const flattened = pages.flatMap((page) => page.items);
		return flattened.slice().reverse();
	}, [messagesData?.pages]);

	useEffect(() => {
		if (!scrollRef.current) {
			return;
		}

		if (!isAtBottomRef.current) {
			return;
		}

		if (messages.length === 0) {
			return;
		}

		scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
	}, [messages]);

	const handleBack = () => {
		if (roleData?.role === "ADMIN") {
			router.navigate({
				to: "/admin/orders",
			});
		} else if (session) {
			router.navigate({
				to: "/orders",
			});
		} else {
			router.navigate({ to: "/" });
		}
	};

	if (!orderId) {
		return (
			<Card>
				<CardHeader>
					<CardAction>
						<Button onClick={handleBack}>Back</Button>
					</CardAction>
					<CardTitle>Chat</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Select an order to view its chat thread.
					</p>
				</CardContent>
			</Card>
		);
	}

	if (isForbidden) {
		return (
			<div className="space-y-6 h-full flex-1">
				<Card className="h-full">
					<CardHeader>
						<CardAction>
							<Button onClick={handleBack}>Back</Button>
						</CardAction>
						<CardTitle>Order Chat · #{orderId}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<h2 className="text-lg font-semibold">Access denied</h2>
						<p className="text-sm text-muted-foreground">
							You are not allowed to view messages in this order chat.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<Card className="h-full overflow-hidden py-0">
			<CardHeader className="border-b border-primary/10 bg-card/70 backdrop-blur-sm pt-5">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="flex items-center gap-2">
						<Button onClick={handleBack} className="rounded-full">
							Back
						</Button>
						{isRoleKnown && orderId && requestId ? (
							isAdmin ? (
								<AdminOrderActionsSheet
									orderId={orderId}
									requestId={requestId}
									status={orderStatus ?? OrderStatus.PENDING}
									totalPrice={orderTotalPrice}
									showChatLink={false}
								/>
							) : (
								<UserOrderActionsSheet
									orderId={orderId}
									requestId={requestId}
									status={orderStatus ?? OrderStatus.PENDING}
									canMarkDelivered={isOwner}
									showChatLink={false}
								/>
							)
						) : null}
					</div>
					<div className="flex flex-wrap items-center gap-2">
						{orderStatus && (
							<Badge
								variant="outline"
								className="rounded-full border-primary/20 bg-primary/5 text-xs"
							>
								Order: {orderStatus}
							</Badge>
						)}
						<Badge
							variant="secondary"
							className="rounded-full bg-secondary/70 text-xs"
						>
							{viewerRoleLabel}
						</Badge>
						<Badge
							variant={isConnected ? "default" : "outline"}
							className="rounded-full border-primary/30 text-xs"
						>
							{connectionLabel}
						</Badge>
					</div>
				</div>
				<CardTitle className="truncate">Order Chat · #{orderId}</CardTitle>
			</CardHeader>
			<CardContent className="flex min-h-0 flex-1 flex-col p-0">
				<div
					ref={scrollRef}
					className="min-h-0 flex-1 overflow-y-auto px-4 py-2 sm:px-6"
					onScroll={async (event) => {
						const target = event.currentTarget;
						const { scrollTop, scrollHeight, clientHeight } = target;
						const nearTop = scrollTop <= 40;
						const atBottom = scrollTop + clientHeight >= scrollHeight - 20;
						setIsAtBottom(atBottom);
						isAtBottomRef.current = atBottom;

						if (nearTop && hasNextPage && !isFetchingNextPage) {
							setIsLoadingOlder(true);
							const previousHeight = scrollHeight;
							await fetchNextPage();
							requestAnimationFrame(() => {
								if (!scrollRef.current) {
									return;
								}
								const nextHeight = scrollRef.current.scrollHeight;
								scrollRef.current.scrollTop =
									nextHeight - previousHeight + scrollTop;
								setIsLoadingOlder(false);
							});
						}
					}}
				>
					{isLoadingOlder && (
						<p className="py-2 text-center text-xs text-muted-foreground">
							Loading older messages...
						</p>
					)}
					{messages.length > 0 ? (
						<div className="space-y-4">
							{messages.map((message) => {
								const isOwnMessage = Boolean(
									viewerId && message.author.id === viewerId,
								);
								const messageAuthor = message.author.name ?? "User";
								const messageInitial = messageAuthor.slice(0, 1).toUpperCase();

								return (
									<div
										key={message.id}
										className={cn(
											"flex w-full items-end gap-2",
											isOwnMessage ? "justify-end" : "justify-start",
										)}
									>
										{!isOwnMessage && (
											<div className="flex size-8 items-center justify-center rounded-full border bg-muted text-xs font-semibold text-muted-foreground">
												{messageInitial}
											</div>
										)}
										<div
											className={cn(
												"max-w-[82%] rounded-2xl border px-4 py-3 shadow-sm sm:max-w-[75%]",
												isOwnMessage
													? "rounded-br-md border-primary/40 bg-primary/10 shadow-[0_6px_20px_-12px_rgba(197,41,125,0.6)]"
													: "rounded-bl-md border-primary/10 bg-card/80 shadow-[0_10px_30px_-24px_rgba(90,16,60,0.5)]",
											)}
										>
											<div
												className={cn(
													"mb-1 flex items-center gap-3 text-[11px] text-muted-foreground",
													isOwnMessage ? "justify-end" : "justify-between",
												)}
											>
												<span className="font-medium">{messageAuthor}</span>
												<span>
													{format(message.createdAt, "MMM d • h:mm a")}
												</span>
											</div>
											<p className="text-sm leading-relaxed wrap-break-word">
												{message.content}
											</p>
										</div>
										{isOwnMessage && (
											<div className="flex size-8 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-xs font-semibold text-primary">
												{messageInitial}
											</div>
										)}
									</div>
								);
							})}
						</div>
					) : (
						<div className="flex h-full min-h-64 items-center justify-center rounded-2xl border border-dashed border-primary/15 bg-muted/10 p-8 text-center">
							<div className="space-y-2">
								<div className="mx-auto flex size-8 items-center justify-center rounded-full border border-primary/20 bg-card/80 text-muted-foreground">
									{isAdmin ? (
										<Shield className="size-4" />
									) : (
										<User className="size-4" />
									)}
								</div>
								<p className="text-sm font-medium">No messages yet</p>
								<p className="text-xs text-muted-foreground">
									Start the convo and keep the order updates flowing.
								</p>
							</div>
						</div>
					)}
					{!isAtBottom && messages.length > 0 && (
						<div className="sticky bottom-4 flex justify-end">
							<Button
								size="sm"
								variant="secondary"
								className="rounded-full shadow-sm"
								onClick={() => {
									if (!scrollRef.current) {
										return;
									}
									scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
									setIsAtBottom(true);
								}}
							>
								Jump to latest
							</Button>
						</div>
					)}
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						if (!isAllowed) {
							return;
						}
						form.handleSubmit();
					}}
					className="shrink-0 border-t border-primary/10 bg-card/70 px-4 py-4 backdrop-blur-sm sm:px-6"
				>
					<InputGroup className="w-full rounded-full border border-primary/20 bg-background/70 p-1 shadow-[0_12px_24px_-18px_rgba(90,16,60,0.5)]">
						<form.AppField name="message">
							{(field) => (
								<InputGroupInput
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									value={field.state.value}
									placeholder={
										isAllowed
											? "Type your message..."
											: "You cannot send messages in this chat"
									}
									disabled={!isAllowed || !isConnected}
									className="h-11 border-0 bg-transparent shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0"
								/>
							)}
						</form.AppField>
						<form.AppForm>
							<InputGroupAddon className="py-1 pr-1" align="inline-end">
								<form.SubmitButton
									disabled={!isConnected || !isAllowed}
									label="Send"
									isSubmittingLabel="Sending"
								/>
							</InputGroupAddon>
						</form.AppForm>
					</InputGroup>
				</form>
			</CardContent>
		</Card>
	);
}
