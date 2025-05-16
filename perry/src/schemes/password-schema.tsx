import { z } from "zod";


const passwordMinValue = 8;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

const forgotPasswordFormSchema = z.object({
  email: z.string()
    .email("Wrong or invalid email address")
});

const resetPasswordFormSchema = z.object({
  newPassword: z.string()
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
  repeatPassword: z.string()
    .nonempty("Passwords must match")
})
.superRefine((data, ctx) => {
  if (data.newPassword !== data.repeatPassword) {
    ctx.addIssue({
      path: ["repeatPassword"],
      message: "Passwords must match",
      code: z.ZodIssueCode.custom
    });
  }
});

type ForgotPasswordFormType = z.infer<typeof forgotPasswordFormSchema>;
type ResetPasswordFormType = z.infer<typeof resetPasswordFormSchema>;

export type { ForgotPasswordFormType, ResetPasswordFormType };
export { forgotPasswordFormSchema, resetPasswordFormSchema };