document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('addTaskBtn').addEventListener('click', addTask);

function loadTasks() {
    chrome.storage.local.get('tasks', (result) => {
        const tasks = result.tasks || [];
        console.log("Loaded tasks from storage:", tasks);

        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';  // Clear previous list

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.textContent = task.text;
            span.className = task.completed ? 'completed' : '';
            span.addEventListener('click', () => toggleTask(index));

            const button = document.createElement('button');
            button.textContent = 'Done';
            button.className = 'done-btn';
            button.addEventListener('click', () => markDone(index));

            li.appendChild(span);
            li.appendChild(button);
            taskList.appendChild(li);
        });
    });
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    if (taskInput.value.trim() !== "") {
        chrome.storage.local.get('tasks', (result) => {
            const tasks = result.tasks || [];
            tasks.push({ text: taskInput.value.trim(), completed: false });
            chrome.storage.local.set({ tasks }, () => {
                console.log("Task added and saved.");
                taskInput.value = '';
                loadTasks();
            });
        });
    }
}

function markDone(index) {
    chrome.storage.local.get('tasks', (result) => {
        const tasks = result.tasks || [];
        tasks.splice(index, 1);  // Remove completed task
        chrome.storage.local.set({ tasks }, () => {
            console.log("Task removed.");
            loadTasks();
        });
    });
}

function toggleTask(index) {
    chrome.storage.local.get('tasks', (result) => {
        const tasks = result.tasks || [];
        tasks[index].completed = !tasks[index].completed;
        chrome.storage.local.set({ tasks }, () => {
            console.log(`Task at index ${index} toggled.`);
            loadTasks();
        });
    });
}
