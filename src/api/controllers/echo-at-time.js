const Task = require('../../model/task');
const scheduler = require('../../scheduler');

const echoAtTime = async (req, res) => {
    const { message, timestamp } = req.body;

    const task = new Task(message, timestamp);

    await scheduler.addTask(task);

    res.json({ message, timestamp, scheduled: true });
};

module.exports = echoAtTime;
