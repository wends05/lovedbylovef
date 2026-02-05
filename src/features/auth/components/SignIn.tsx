import { useMutation } from "@tanstack/react-query";
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
import { tryCatch } from "@/lib/try-catch";
import { authOptions } from "../options";
import { SignInSchema } from "../schemas/standard";

const useSignIn = () => {
	const navigate = useNavigate();
	const signInMutation = useMutation(authOptions.signInServer);
	return useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: { onSubmit: SignInSchema },
		onSubmit: async ({ value }) => {
			const { error, success, data } = await tryCatch(
				signInMutation.mutateAsync({ data: value }),
			);

			if (success) {
				toast.success("Signed in successfully. Redirecting...");
				const role = data?.role;
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
