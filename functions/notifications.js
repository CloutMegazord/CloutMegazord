const notificationsTemplates = {
    welcome: (data) => `Welcome %username% to CloutMegazord.`,
    newMegazord: (data) => `You were invited as Zord for new Megazord`,
    taskFailed: (data) => `Task ${data.taskType} failed by next reason: ${data.error}`,
    taskDone: (data) => `Task ${data.taskType} successfully finished`
}

module.exports = function(type, data) {
    return {message: notificationsTemplates[type](data), ts: Date.now(), status: 0};
}