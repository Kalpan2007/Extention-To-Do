chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('taskReminder', { periodInMinutes: 60 }); 
    // console.log('Alarm created on installation.');
});


chrome.runtime.onStartup.addListener(() => {
    chrome.alarms.create('taskReminder', { periodInMinutes: 60 });  
    // console.log('Alarm recreated on startup.');
});

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
