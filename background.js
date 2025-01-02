chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('taskReminder', { periodInMinutes: 60 });  // Trigger every 30 seconds
    console.log('Alarm created on installation.');
});

// Ensure alarm is recreated if extension is restarted
chrome.runtime.onStartup.addListener(() => {
    chrome.alarms.create('taskReminder', { periodInMinutes: 60 });  // Trigger every 30 seconds
    console.log('Alarm recreated on startup.');
});

// Handle alarm trigger
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'taskReminder') {
        chrome.storage.local.get('tasks', (result) => {
            const tasks = result.tasks || [];
            const incompleteTasks = tasks.filter(task => !task.completed);

            if (incompleteTasks.length > 0) {
                const taskListText = incompleteTasks
                    .slice(0, 5)
                    .map((task, index) => `${index + 1}. ${task.text}`)
                    .join('\n');

                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon48.png',
                    title: 'Task Reminder',
                    message: `You have ${incompleteTasks.length} tasks left:\n\n${taskListText}`,
                    priority: 2
                });
            }
        });
    }
});
