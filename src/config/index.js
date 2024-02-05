const config = {
    INSTANCE_ID: process.env.INSTANCE_ID || 1,
    API_PORT: process.env.API_PORT || 3000,
    REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    STREAM_NAME: 'tasks',
    STREAM_CONSUMER_GROUP_NAME: 'task-consumers',
};

module.exports = config;
