const notificationsTemplates = {
    welcome: (data) => `Welcome %username% to CloutMegazord.`,
    newMegazord: (data) => `You were invited as Zord for new Megazord`,
}

module.exports = function(type, data) {
    return {message: notificationsTemplates[type](data), ts: Date.now()};
}