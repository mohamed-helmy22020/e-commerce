import { createConsumer, logger, runConsumer, sendEmail, TOPICS } from "shared";
import { EmailEventSchema } from "../schemas/email.schema";
import { EmailEvent } from "../utils/types";

export async function startKafka() {
    const consumer = await createConsumer(
        "email-service",
        "email-service-group",
    );

    await runConsumer(
        consumer,
        [TOPICS.EMAIL_EVENTS],
        async ({ topic, message, partition }) => {
            const raw = message.value?.toString();
            if (!raw) return;

            let event: EmailEvent;
            try {
                event = EmailEventSchema.parse(JSON.parse(raw));
            } catch (e) {
                logger.error(
                    { e, raw, topic, partition },
                    "invalid email event",
                );
                return;
            }
            try {
                await sendEmail(event.to, event.subject, event.html);
            } catch (e) {
                logger.error({ e }, "email consumer failed");
            }
        },
    );
}
