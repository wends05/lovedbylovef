import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { chatQueryOptions } from "../options";

const PLACEHOLDER_MESSAGES = [
	{
		id: "msg-1",
		author: "Admin",
		content: "Hi! We are getting started on your order.",
		timestamp: new Date(),
	},
	{
		id: "msg-2",
		author: "You",
		content: "Thanks! Looking forward to it.",
		timestamp: new Date(),
	},
	{
		id: "msg-3",
		author: "Admin",
		content: "We'll keep you updated with progress.",
		timestamp: new Date(),
	},
];

type OrderChatPageProps = {
	orderId: string;
};

export default function OrderChatPage({ orderId }: OrderChatPageProps) {
	const router = useRouter();

	const { data: userData } = authClient.useSession();
	const { data: chatData } = useSuspenseQuery(
		chatQueryOptions.getChatData(orderId),
	);

	const handleBack = () => {
		if (userData?.user.role === "ADMIN") {
			router.navigate({
				to: "/admin/orders",
			});
		} else {
			router.navigate({
				to: "/requests",
			});
		}
	};
	return (
		<div className="space-y-6 h-full flex-1">
			<Card className="h-full">
				<CardHeader>
					<CardAction>
						<Button onClick={handleBack}>Back</Button>
					</CardAction>
					<CardTitle>Order Chat · #{orderId}</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 h-full flex flex-col">
					<div className="space-y-3 h-full">
						{PLACEHOLDER_MESSAGES.map((message) => (
							<div key={message.id} className="rounded-xl border p-3">
								<div className="flex items-center justify-between text-xs text-muted-foreground">
									<span>{message.author}</span>
									<span>
										{format(message.timestamp, "MMM d, yyyy • h:mm a")}
									</span>
								</div>
								<p className="mt-2 text-sm">{message.content}</p>
							</div>
						))}
					</div>
					<Input disabled placeholder="Chat input coming soon..." />
				</CardContent>
			</Card>
		</div>
	);
}
