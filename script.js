const form = document.querySelector("form");
const titleInput = document.querySelector("#titleInput");
const submitBtn = document.querySelector("#submitBtn");
const body = document.body;
const tasksContainer = document.createElement("div");
tasksContainer.classList.add("tasks_container");
body.appendChild(tasksContainer);

const tasks = localStorage.getItem("tasks");
const parsedTasks = tasks ? JSON.parse(tasks) : [];
const tasksArray = Array.isArray(parsedTasks) ? parsedTasks : [];

let editingId = null;

const creatTasksHandler = () => {
    tasksContainer.innerHTML = "";
    const existingWarning = document.querySelector(".msg");
    if (existingWarning) existingWarning.remove();
    if (tasksArray.length > 0) {
        tasksArray.forEach((task) => {
            const currentTask = document.createElement("div");
            currentTask.classList.add("task");

            const toggleBtn = document.createElement("input");
            toggleBtn.type = "checkbox";
            toggleBtn.classList.add("toggleBtn");
            toggleBtn.checked = task.completed;

            toggleBtn.addEventListener("click", () => {
                task.completed = !task.completed;
                localStorage.setItem("tasks", JSON.stringify(tasksArray));
                creatTasksHandler();
            });

            const textContainer = document.createElement("p");
            textContainer.classList.add("text");
            textContainer.textContent = task.text;

            if (task.completed) {
                textContainer.classList.add("completed");
            }

            const editBtn = document.createElement("button");
            editBtn.classList.add("editBtn");
            editBtn.textContent = "📝";

            editBtn.addEventListener("click", () => {
                titleInput.value = task.text;
                editingId = task.id;
                submitBtn.value = "Update Task";
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("deleteBtn");
            deleteBtn.textContent = "❌";

            deleteBtn.addEventListener("click", () => {
                deleteTasks(task.id);
            });

            currentTask.appendChild(toggleBtn);
            currentTask.appendChild(textContainer);
            currentTask.appendChild(editBtn);
            currentTask.appendChild(deleteBtn);
            tasksContainer.appendChild(currentTask);
        });
    } else {
        const Warn = document.createElement("li");
        Warn.textContent = "No Tasks Added Yet. Add Your First Task...";
        Warn.classList.add("msg");
        body.appendChild(Warn);
    }
};

const deleteTasks = (id) => {
    const index = tasksArray.findIndex(task => task.id === id);
    if (index > -1) {
        tasksArray.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasksArray));
        creatTasksHandler();
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = titleInput.value.trim();
    if (taskText === "") return;

    if (editingId !== null) {
        const taskIndex = tasksArray.findIndex(task => task.id === editingId);
        if (taskIndex > -1) {
            tasksArray[taskIndex].text = taskText;
            localStorage.setItem("tasks", JSON.stringify(tasksArray));
            creatTasksHandler();
        }
        editingId = null;
        submitBtn.value = "Add Task";
    } else {
        tasksArray.push({
            id: Date.now(),
            text: taskText,
            completed: false,
        });
        localStorage.setItem("tasks", JSON.stringify(tasksArray));
    }
    creatTasksHandler();
    titleInput.value = "";
});

creatTasksHandler();