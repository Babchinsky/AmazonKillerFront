import { z } from "zod";


const passwordMinValue = 8;

const signUpFormSchema = z.object({
  email: z.string()
    .email("Wrong or invalid email address"),
  password: z.string()
    .superRefine((value, ctx) => {
      const errors: string[] = [];

      if (!/[A-Z]/.test(value)) {
        errors.push(`contain at least 1 uppercase letter`);
      }
      if (!/[a-z]/.test(value)) {
        errors.push(`${errors.length === 0 ? "contain at least" : ""} 1 lowercase letter`);
      }
      if (!/\d/.test(value)) {
        errors.push(`${errors.length === 0 ? "contain at least" : ""} 1 digit`);
      }
      if (value.length < passwordMinValue) {
        errors.push(`${errors.length > 0 ? "and" : ""} be at least ${passwordMinValue} characters long`);
      }

      if (errors.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Password must ${errors.join(", ")}`,
        });
      }
    }),
  confirmPassword: z.string()
    .nonempty("Passwords must match")
})
.superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      path: ["confirmPassword"],
      message: "Passwords must match",
      code: z.ZodIssueCode.custom
    });
  }
});

const signUpNameFormSchema = z.object({
  firstName: z.string()
    .nonempty("First name is required"),
  lastName: z.string()
    .nonempty("Last name is required")
});

type SignUpFormType = z.infer<typeof signUpFormSchema>;
type SignUpNameFormType = z.infer<typeof signUpNameFormSchema>;

export type { SignUpFormType, SignUpNameFormType };
export { signUpFormSchema, signUpNameFormSchema };