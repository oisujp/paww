import { z } from "zod";

export const passTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoText: z.string(),
  description: z.string(),
  passContentLabel: z.string(),
  passContentValue: z.string(),
  stripUrl: z.string(),
  expirationDate: z.date(),
  labelColor: z.string(),
  foregroundColor: z.string(),
  backgroundColor: z.string(),
});
