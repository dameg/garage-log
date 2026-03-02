import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  FRONTEND_URLS: z
    .string()
    .default("http://localhost:5173")
    .transform((val) =>
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(raw: Record<string, unknown>): Env {
  const parsed = EnvSchema.safeParse(raw);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");

    const formatted = parsed.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    }));

    console.error(formatted);

    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}
