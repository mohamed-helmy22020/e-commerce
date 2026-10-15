import { createProducer, logger, publishJSONSafe, TOPICS } from "shared";

let producerPromise: ReturnType<typeof createProducer> | null = null;

export function initKafka() {
    if (producerPromise === null) {
        producerPromise = createProducer("auth-service").catch((error) => {
            producerPromise = null;
            throw error;
        });
    }
    return producerPromise;
}

export async function publishEmailEvent(
    eventType: "email.confirm" | "email.reset",
    to: string,
    subject: string,
    html: string,
) {
    try {
        const producer = await initKafka();
        return await publishJSONSafe(
            producer,
            TOPICS.EMAIL_EVENTS,
            {
                eventType,
                to,
                subject,
                html,
            },
            to,
        );
    } catch (error) {
        logger.error(error);
        return false;
    }
}
