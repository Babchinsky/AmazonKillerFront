import { z } from "zod";


const passwordMinValue = 8;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

const logInFormSchema = z.object({
  email: z.string()
    .email("Wrong or invalid email address"),
  password: z.string()
    .min(passwordMinValue, "Incorrect password")
    .refine((val) => passwordRegex.test(val), {
      message: "Incorrect password"
    })
});

type LogInFormType = z.infer<typeof logInFormSchema>;

export type { LogInFormType };
export { logInFormSchema };