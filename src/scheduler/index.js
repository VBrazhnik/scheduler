const config = require('../config');
const RedisConnector = require('../connectors/redis');
const logger = require('../logger')('scheduler');

class Scheduler {
    constructor() {
        this.connector = new RedisConnector();

        this.consumerId = `consumer-${config.INSTANCE_ID}`;
    }

    async start() {
        await this.connector.createGroup();
        await this.recover();
        await this.run();
    }

    async addTask(task) {
        await this.connector.addToStream(task);
        logger.info(
            `Task with message '${task.message}' and timestamp ${task.timestamp} added to stream`,
        );
    }

    async recover() {
        logger.info('Fetch pending tasks');
        const tasks = await this.connector.consumePendingMessages(this.consumerId);

        logger.info(`Fetched pending tasks: ${tasks.length}`);
        this.processTasks(tasks);
    }

    async run() {
        logger.info('Fetch new tasks');
        const tasks = await this.connector.consumeNewMessages(this.consumerId);

        logger.info(`Fetched new tasks: ${tasks.length}`);
        this.processTasks(tasks);

        setTimeout(() => this.run(), tasks.length ? 0 : 1000);
    }

    processTasks(tasks) {
        tasks.forEach((task) => this.scheduleTask(task));
    }

    scheduleTask(task) {
        const now = new Date().valueOf();
        const diff = Math.max(task.timestamp - now, 0);

        setTimeout(() => {
            console.log(`EchoAtTime: ${task.message} at ${task.timestamp}`);
            this.acknowledgeTask(task).then(() => {
                logger.info(`Printed task with id '${task.id}'`);
            });
        }, diff);
    }

    async acknowledgeTask(task) {
        await this.connector.acknowledgeMessage(task.id);
        logger.info(`Acknowledged task with id: '${task.id}'`);
    }
}

module.exports = new Scheduler();
