const Redis = require('ioredis');
const config = require('../config');
const Task = require('../model/task');
const logger = require('../logger')('redis-connector');

class RedisConnector {
    constructor() {
        const connectionOptions = {
            host: config.REDIS_HOST,
            port: config.REDIS_PORT,
        };

        this.redis = new Redis(connectionOptions);
    }

    async createGroup() {
        try {
            await this.redis.xgroup(
                'CREATE',
                config.STREAM_NAME,
                config.STREAM_CONSUMER_GROUP_NAME,
                '$',
                'MKSTREAM',
            );
        } catch (error) {
            if (error.message.includes('BUSYGROUP')) {
                logger.info('Consumer group already exists');

                return;
            }

            logger.error(error.message);
        }
    }

    async addToStream(task) {
        await this.redis.xadd(
            config.STREAM_NAME,
            task.id,
            'message',
            task.message,
            'timestamp',
            task.timestamp,
        );
    }

    async consumePendingMessages(consumerId) {
        const result = await this.redis.xreadgroup(
            'GROUP',
            config.STREAM_CONSUMER_GROUP_NAME,
            consumerId,
            'STREAMS',
            config.STREAM_NAME,
            0,
        );

        if (!result) {
            return [];
        }

        return result[0][1].map((rawStreamMessage) =>
            Task.extractFromStreamMessage(rawStreamMessage),
        );
    }

    async consumeNewMessages(consumerId) {
        const result = await this.redis.xreadgroup(
            'GROUP',
            config.STREAM_CONSUMER_GROUP_NAME,
            consumerId,
            'COUNT',
            1,
            'STREAMS',
            config.STREAM_NAME,
            '>',
        );

        if (!result) {
            return [];
        }

        return result[0][1].map((rawStreamMessage) =>
            Task.extractFromStreamMessage(rawStreamMessage),
        );
    }

    acknowledgeMessage(id) {
        return this.redis.xack(config.STREAM_NAME, config.STREAM_CONSUMER_GROUP_NAME, id);
    }
}

module.exports = RedisConnector;
