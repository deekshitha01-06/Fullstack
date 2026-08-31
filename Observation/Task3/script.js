const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

addTaskButton.addEventListener("click", function () {

    const task = taskInput.value.trim();

    if (task === "") {
        return;
    }

    const listItem = document.createElement("li");

    const taskText = document.createElement("span");
    taskText.textContent = task;
    taskText.className = "taskText";

    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";

    completeButton.addEventListener("click", function () {
        taskText.classList.toggle("completed");

        if (taskText.classList.contains("completed")) {
            completeButton.textContent = "Completed";
        } else {
            completeButton.textContent = "Complete";
        }
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
        listItem.remove();
        updateEmptyMessage();
    });

    listItem.appendChild(taskText);
    listItem.appendChild(completeButton);
    listItem.appendChild(deleteButton);

    taskList.appendChild(listItem);

    taskInput.value = "";

    updateEmptyMessage();
});

function updateEmptyMessage() {
    if (taskList.children.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}

updateEmptyMessage();
