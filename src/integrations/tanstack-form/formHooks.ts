import { createFormHook } from "@tanstack/react-form";
import { TextareaField, TextField } from "./components";
import NumberField from "./components/NumberField";
import SelectField from "./components/SelectField";
import { SubmitButton } from "./components/SubmitButton";
import { fieldContext, formContext } from "./createFormHooks";

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField,
		TextareaField,
		NumberField,
		SelectField,
	},
	formComponents: {
		SubmitButton,
	},
});
