import { z } from "zod";

export const passTemplateSchema = z.object({
  id: z.string(),
  description: z.string().min(1, { message: "特典の内容を入力してください" }),
  caveats: z.string().nullable().optional(),
  stripUrl: z.string(),
  expirationDate: z.date().nullable(),
  noExpirationDate: z.boolean(),
  foregroundColor: z.string(),
  backgroundColor: z.string(),
});
