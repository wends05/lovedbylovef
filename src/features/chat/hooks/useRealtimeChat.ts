import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAppForm } from "@/integrations/tanstack-form/formHooks";
import { chatMutationOptions, chatQueryOptions } from "../options";

export const EVENT_MESSAGE_TYPE = "message";

export const EVENT_TYPING_TYPE = "typing";

interface UseRealtimeChatProps {
	orderChatId: string;
}
export function useRealtimeChat({ orderChatId }: UseRealtimeChatProps) {
	const queryClient = useQueryClient();

	const [isConnected, setIsConnected] = useState(false);

	const [channel, setChannel] = useState<ReturnType<
		typeof supabase.channel
	> | null>(null);

	const form = useAppForm({
		defaultValues: {
			message: "",
		},
		validators: {
			onSubmit: z.object({
				message: z.string().min(1, "Message cannot be empty"),
			}),
		},
		onSubmit: async ({ value, formApi }) => {
			await sendMessage(value.message);
			await queryClient.invalidateQueries(
				chatQueryOptions.getChatMessagesInfinite(orderChatId),
			);

			formApi.reset();
		},
	});

	const { mutateAsync } = useMutation(chatMutationOptions.sendMessage);

	useEffect(() => {
		if (!orderChatId || orderChatId === "missing") {
			setIsConnected(false);
			setChannel(null);
			return;
		}

		const channel = supabase
			.channel(`room:${orderChatId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "messages",
					filter: `'orderChatId'=eq.${orderChatId}`,
				},
				(payload) => {
					console.log("Received message:", payload);
				},
			)
			.subscribe(async (status) => {
				if (status === "SUBSCRIBED") {
					console.log("Successfully subscribed to channel:", channel);
					setIsConnected(true);
				} else {
					console.error("Failed to subscribe to channel:", channel);
					setIsConnected(false);
				}
			});

		setChannel(channel);

		return () => {
			supabase.removeChannel(channel);
		};
	}, [orderChatId]);

	const sendMessage = async (content: string) => {
		if (!channel) return;

		console.log("Sending message:", content);
		await mutateAsync({ orderChatId, content });
		channel.send({
			type: "postgres_changes",
			event: "INSERT",
			payload: { content },
		});
	};

	return {
		form,
		isConnected,
	};
}
