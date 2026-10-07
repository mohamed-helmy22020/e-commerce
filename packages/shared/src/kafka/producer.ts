import { Producer, RecordMetadata } from "kafkajs";
import { logger } from "../logger/logger";
import { createKafkaClient } from "./client";

export async function createProducer(clientId: string): Promise<Producer> {
    const kafka = createKafkaClient(clientId);
    const producer = kafka.producer();
    await producer.connect();
    logger.info({ clientId }, "Kafka producer connected");
    return producer;
}

export async function publishJSON(
    producer: Producer,
    topic: string,
    payload: Record<string, unknown>,
    key?: string,
): Promise<RecordMetadata[]> {
    const result = await producer.send({
        topic,
        messages: [
            {
                key: key ?? null,
                value: JSON.stringify(payload),
            },
        ],
    });

    logger.info({ topic }, "Kafka message published");
    return result;
}

export async function publishJSONSafe(
    producer: Producer | null,
    topic: string,
    payload: Record<string, unknown>,
    key?: string,
): Promise<void> {
    if (!producer) {
        logger.warn("Kafka producer is not initialized");
        return;
    }

    try {
        await publishJSON(producer, topic, payload, key);
    } catch (e) {
        logger.error({ e, topic }, "Error publishing to Kafka");
    }
}
