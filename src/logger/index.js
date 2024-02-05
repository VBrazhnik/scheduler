const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;

function createLogger(sourceName) {
    const format = printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
    });

    return winston.createLogger({
        format: combine(label({ label: sourceName }), timestamp(), format),
        transports: [new winston.transports.Console()],
        silent: process.env.NODE_ENV === 'production',
    });
}

module.exports = createLogger;
