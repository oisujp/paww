import { z } from "zod";

export const passTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  caveats: z.string().nullable().optional(),
  passContentLabel: z.string(),
  passContentValue: z
    .string()
    .min(1, { message: "特典の内容を入力してください" }),
  stripUrl: z.string(),
  expirationDate: z.date().nullable(),
  noExpirationDate: z.boolean(),
  foregroundColor: z.string(),
  backgroundColor: z.string(),
});
