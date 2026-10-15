import z from "zod";

export const EmailEventSchema = z.object({
    eventType: z.enum(["email.confirm", "email.reset"]),
    to: z.string(),
    subject: z.string(),
    html: z.string(),
});
