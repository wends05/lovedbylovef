import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/integrations/tanstack-form/formHooks";
import { authClient } from "@/lib/auth-client";
import { tryCatch } from "@/lib/try-catch";
import { SignInSchema } from "../schemas/auth";
import { signInServer } from "../server";

const useSignIn = () => {
	const navigate = useNavigate();
	return useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: { onSubmit: SignInSchema },
		onSubmit: async ({ value }) => {
			const { error, success } = await tryCatch(() =>
				signInServer({ data: value }),
			);

			if (success) {
				toast.success("Signed in successfully. Redirecting...");
				const { data: session } = await authClient.getSession();
				const role = (session?.user as { role?: string })?.role;
				if (role === "ADMIN") {
					navigate({ to: "/admin/dashboard" });
				} else {
					navigate({ to: "/dashboard" });
				}
			} else {
				toast.error(error);
			}
		},
	});
};

export default function SignIn() {
	const form = useSignIn();
	return (
		<div className="flex items-center justify-center h-screen px-10">
			<Card className=" max-w-md w-full">
				<CardHeader>
					<CardTitle>Sign In</CardTitle>
					<CardDescription>Sign in to your existing account</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.stopPropagation();
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<form.AppField name="email">
							{(field) => <field.TextField label="Email" />}
						</form.AppField>
						<form.AppField name="password">
							{(field) => <field.TextField label="Password" type="password" />}
						</form.AppField>
						<form.AppForm>
							<form.SubmitButton
								label="Sign In"
								isSubmittingLabel="Signing In"
							/>
						</form.AppForm>
					</form>
				</CardContent>
				<CardFooter className="flex flex-col items-start">
					<p>Don't have an account?</p>
					<Link to="/signup" className="font-semibold">
						Sign Up
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
