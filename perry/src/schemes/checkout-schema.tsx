import { z } from "zod";


const checkoutFormSchema = z.object({
  firstName: z.string()
    .nonempty("This field is necessary to continue!"),
  lastName: z.string()
    .nonempty("This field is necessary to continue!"),
  email: z.string()
    .nonempty("This field is necessary to continue!")
    .email("Wrong or invalid email address"),

  country: z.string()
    .nonempty("This field is necessary to continue!"),
  state: z.string()
    .nonempty("This field is necessary to continue!"),
  city: z.string()
    .nonempty("This field is necessary to continue!"),
  postcode: z.string()
    .nonempty("This field is necessary to continue!"),

  paymentMethod: z.enum(["cash", "card"]),

  cardNumber: z.string()
    .optional(),
  cardExpirationDate: z.string()
    .optional(),
  cardSecurityCode: z.string()
    .optional(),
})
.superRefine((data, ctx) => {
  if (data.paymentMethod === "card") {
    if (!/^\d{16}$/.test(data.cardNumber ?? "")) {
      ctx.addIssue({
        path: ["cardNumber"],
        message: "Incorrect card number",
        code: z.ZodIssueCode.custom
      });
    }

    if (!/^\d{2}\/\d{2}$/.test(data.cardExpirationDate ?? "")) {
      ctx.addIssue({
        path: ["cardExpirationDate"],
        message: "Incorrect date",
        code: z.ZodIssueCode.custom
      });
    }

    if (!/^\d{3}$/.test(data.cardSecurityCode ?? "")) {
      ctx.addIssue({
        path: ["cardSecurityCode"],
        message: "Incorrect code",
        code: z.ZodIssueCode.custom
      });
    }
  }
});

type CheckoutFormType = z.infer<typeof checkoutFormSchema>;

export type { CheckoutFormType };
export { checkoutFormSchema };