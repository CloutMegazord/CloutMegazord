const notificationsTemplates = {
    welcome: (data) => `Welcome %username% to CloutMegazord.`
}

module.exports = function(type, data) {
    return {message: notificationsTemplates[type](data), ts: Date.now()};
}