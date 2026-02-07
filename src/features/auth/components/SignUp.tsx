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
import { SignUpSchema } from "../schemas/standard";

const useSignUp = () => {
	const navigate = useNavigate();
	const signUpMutation = useMutation(authOptions.signUpServer);
	return useAppForm({
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
		validators: { onSubmit: SignUpSchema },
		onSubmit: async ({ value }) => {
			const { success, error, data } = await tryCatch(() =>
				signUpMutation.mutateAsync({ data: value }),
			);
			if (success) {
				toast.success("Account created successfully");
				const role = (data as { role?: string } | undefined)?.role;
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

export default function SignUp() {
	const form = useSignUp();
	return (
		<div className="flex items-center justify-center h-screen px-10">
			<Card className=" max-w-md w-full">
				<CardHeader>
					<CardTitle>Sign Up</CardTitle>
					<CardDescription>Create a new account</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.stopPropagation();
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<form.AppField name="name">
							{(field) => <field.TextField label="Name" />}
						</form.AppField>
						<form.AppField name="email">
							{(field) => <field.TextField label="Email" />}
						</form.AppField>
						<form.AppField name="password">
							{(field) => <field.TextField label="Password" type="password" />}
						</form.AppField>
						<form.AppForm>
							<form.SubmitButton
								label="Sign Up"
								isSubmittingLabel="Signing Up"
							/>
						</form.AppForm>
					</form>
				</CardContent>
				<CardFooter className="flex flex-col items-start">
					<p>Already Have an account?</p>
					<Link to="/signin" className="font-semibold">
						Sign In
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
