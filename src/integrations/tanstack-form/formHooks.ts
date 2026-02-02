import { createFormHook } from "@tanstack/react-form";
import { TextareaField, TextField } from "./components";
import { SubmitButton } from "./components/SubmitButton";
import { fieldContext, formContext } from "./createFormHooks";

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField,
		TextareaField,
	},
	formComponents: {
		SubmitButton,
	},
});
