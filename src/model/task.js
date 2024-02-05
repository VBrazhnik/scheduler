class Task {
    constructor(message, timestamp) {
        this.message = message;
        this.timestamp = timestamp;
    }

    get id() {
        return this._id ?? `${this.timestamp}-*`;
    }

    set id(taskId) {
        this._id = taskId;
    }

    static extractFromStreamMessage(rawArray) {
        const [taskId, taskDetails] = rawArray;
        const [, message, , timestamp] = taskDetails;

        const task = new Task(message, timestamp);
        task.id = taskId;

        return task;
    }
}

module.exports = Task;
