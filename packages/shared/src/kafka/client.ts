import { Kafka, KafkaConfig, logLevel } from "kafkajs";

export function createKafkaClient(
    clientId: string,
    config: Partial<KafkaConfig> = {},
) {
    const brokers = (process.env.KAFKA_BROKERS || "localhost:9092")
        .split(",")
        .map((b) => b.trim())
        .filter((broker) => broker.length > 0);

    if (brokers.length === 0) {
        throw new Error("KAFKA_BROKERS is empty");
    }

    return new Kafka({
        clientId,
        brokers,
        logLevel: logLevel.ERROR,
        retry: {
            retries: 8,
        },
        ...config,
    });
}
