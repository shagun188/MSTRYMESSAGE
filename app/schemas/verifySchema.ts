
import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().min(10, "Invalid verification code")
});
