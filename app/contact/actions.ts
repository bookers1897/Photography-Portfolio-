"use server";

import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Valid email required").max(200),
  projectType: z.string().min(1).max(80),
  budget: z.string().max(80).optional().default(""),
  timeline: z.string().max(120).optional().default(""),
  message: z
    .string()
    .min(10, "Tell us a little more about the project")
    .max(4000),
  company: z.string().max(0).optional().default(""),
});

export type ContactInput = z.infer<typeof ContactSchema>;

export type ContactResult =
  | { ok: true }
  | { ok: false; errors: Partial<Record<keyof ContactInput, string>> };

export async function submitContact(
  _prev: ContactResult | null,
  formData: FormData,
): Promise<ContactResult> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    projectType: String(formData.get("projectType") ?? ""),
    budget: String(formData.get("budget") ?? ""),
    timeline: String(formData.get("timeline") ?? ""),
    message: String(formData.get("message") ?? ""),
    company: String(formData.get("company") ?? ""),
  };

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactInput;
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors };
  }

  if (parsed.data.company) {
    return { ok: true };
  }

  console.log("[contact]", {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  return { ok: true };
}
