// ============================
// TaskPro
// ============================


// ============================
// Elements
// ============================

const taskInput =
    document.getElementById("taskInput");

const prioritySelect =
    document.getElementById("prioritySelect");

const addBtn =
    document.getElementById("addBtn");

const taskList =
    document.getElementById("taskList");

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const remainingTasks =
    document.getElementById("remainingTasks");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const darkModeBtn =
    document.getElementById("darkModeBtn");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const sortSelect =
    document.getElementById("sortSelect");


// ============================
// State
// ============================

let tasks =
    JSON.parse(
        localStorage.getItem("taskpro_tasks")
    ) || [];

let currentFilter = "all";

let currentSort = "newest";


// ============================
// Dark Mode
// ============================

let darkMode =
    localStorage.getItem(
        "taskpro_darkMode"
    ) === "true";


function applyDarkMode() {

    if (darkMode) {

        document.body.classList.add("dark");

        darkModeBtn.textContent = "☀️";

    } else {

        document.body.classList.remove("dark");

        darkModeBtn.textContent = "🌙";

    }

}


applyDarkMode();


darkModeBtn.addEventListener(
    "click",
    function () {

        darkMode = !darkMode;

        localStorage.setItem(
            "taskpro_darkMode",
            darkMode
        );

        applyDarkMode();

    }
);


// ============================
// Save Tasks
// ============================

function saveTasks() {

    localStorage.setItem(
        "taskpro_tasks",
        JSON.stringify(tasks)
    );

}


// ============================
// Add Task
// ============================

function addTask() {

    const text =
        taskInput.value.trim();

    const priority =
        prioritySelect.value;


    if (text === "") {

        alert("لطفاً یک کار وارد کن!");

        return;

    }


    tasks.push({

        id: Date.now(),

        text: text,

        priority: priority,

        completed: false

    });


    saveTasks();


    taskInput.value = "";

    prioritySelect.value = "medium";


    renderTasks();

}


// ============================
// Delete Task
// ============================

function deleteTask(id) {

    tasks =
        tasks.filter(
            function (task) {

                return task.id !== id;

            }
        );


    saveTasks();

    renderTasks();

}


// ============================
// Toggle Task
// ============================

function toggleTask(id) {

    tasks.forEach(
        function (task) {

            if (task.id === id) {

                task.completed =
                    !task.completed;

            }

        }
    );


    saveTasks();

    renderTasks();

}


// ============================
// Priority Info
// ============================

function getPriorityInfo(priority) {

    if (priority === "high") {

        return {

            text: "🔴 زیاد",

            className: "priority-high"

        };

    }


    if (priority === "medium") {

        return {

            text: "🟡 متوسط",

            className: "priority-medium"

        };

    }


    return {

        text: "🟢 کم",

        className: "priority-low"

    };

}


// ============================
// Edit Task
// ============================

function editTask(id) {

    const taskElement =
        document.querySelector(
            `[data-id="${id}"]`
        );


    const task =
        tasks.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!task || !taskElement) {

        return;

    }


    taskElement.innerHTML = `

        <div class="edit-area">

            <input
                class="edit-input"
                value="${task.text}"
            >

            <select class="edit-select">

                <option
                    value="low"
                    ${task.priority === "low"
                        ? "selected"
                        : ""}>

                    🟢 کم

                </option>

                <option
                    value="medium"
                    ${task.priority === "medium"
                        ? "selected"
                        : ""}>

                    🟡 متوسط

                </option>

                <option
                    value="high"
                    ${task.priority === "high"
                        ? "selected"
                        : ""}>

                    🔴 زیاد

                </option>

            </select>

            <button class="save-edit">

                ذخیره

            </button>

        </div>

    `;


    const input =
        taskElement.querySelector(
            ".edit-input"
        );


    const select =
        taskElement.querySelector(
            ".edit-select"
        );


    const saveButton =
        taskElement.querySelector(
            ".save-edit"
        );


    input.focus();


    function saveEdit() {

        const newText =
            input.value.trim();


        if (newText === "") {

            alert("نام کار نمی‌تواند خالی باشد!");

            input.focus();

            return;

        }


        task.text =
            newText;


        task.priority =
            select.value;


        saveTasks();

        renderTasks();

    }


    saveButton.addEventListener(
        "click",
        saveEdit
    );


    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                saveEdit();

            }

        }
    );

}


// ============================
// Render Tasks
// ============================

function renderTasks() {

    taskList.innerHTML = "";


    // =========================
    // Filter
    // =========================

    let filteredTasks =
        tasks.filter(
            function (task) {

                if (currentFilter === "all") {

                    return true;

                }


                if (currentFilter === "active") {

                    return !task.completed;

                }


                if (currentFilter === "completed") {

                    return task.completed;

                }


                if (currentFilter === "high") {

                    return task.priority === "high";

                }


                return true;

            }
        );


    // =========================
    // Sort
    // =========================

    filteredTasks.sort(
        function (a, b) {

            if (currentSort === "newest") {

                return b.id - a.id;

            }


            if (currentSort === "oldest") {

                return a.id - b.id;

            }


            if (currentSort === "priority") {

                const priorityValue = {

                    high: 3,

                    medium: 2,

                    low: 1

                };


                return (
                    priorityValue[b.priority] -
                    priorityValue[a.priority]
                );

            }


            return 0;

        }
    );


    // =========================
    // Display Tasks
    // =========================

    filteredTasks.forEach(
        function (task) {

            // برای Taskهای قدیمی

            if (!task.priority) {

                task.priority = "medium";

            }


            const priorityInfo =
                getPriorityInfo(
                    task.priority
                );


            const taskElement =
                document.createElement("div");


            taskElement.className =
                "task";


            taskElement.dataset.id =
                task.id;


            if (task.completed) {

                taskElement.classList.add(
                    "completed"
                );

            }


            taskElement.innerHTML = `

                <input
                    type="checkbox"
                    ${task.completed
                        ? "checked"
                        : ""}
                >

                <span class="task-text">

                    ${task.text}

                </span>

                <span
                    class="priority
                    ${priorityInfo.className}">

                    ${priorityInfo.text}

                </span>

                <div class="task-actions">

                    <button
                        class="edit-btn"
                        type="button">

                        ✏️

                    </button>

                    <button
                        class="delete-btn"
                        type="button">

                        🗑️

                    </button>

                </div>

            `;


            // Checkbox

            const checkbox =
                taskElement.querySelector(
                    "input"
                );


            checkbox.addEventListener(
                "change",
                function () {

                    toggleTask(task.id);

                }
            );


            // Edit Button

            const editButton =
                taskElement.querySelector(
                    ".edit-btn"
                );


            editButton.addEventListener(
                "click",
                function () {

                    editTask(task.id);

                }
            );


            // Delete Button

            const deleteButton =
                taskElement.querySelector(
                    ".delete-btn"
                );


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteTask(task.id);

                }
            );


            taskList.appendChild(
                taskElement
            );

        }
    );


    saveTasks();

    updateStats();

}


// ============================
// Statistics
// ============================

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function (task) {

                return task.completed;

            }
        ).length;


    const remaining =
        total - completed;


    totalTasks.textContent =
        total;


    completedTasks.textContent =
        completed;


    remainingTasks.textContent =
        remaining;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    progressBar.style.width =
        percentage + "%";


    progressText.textContent =
        percentage + "٪ انجام شده";

}


// ============================
// Filter Buttons
// ============================

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderTasks();

            }
        );

    }
);


// ============================
// Sort
// ============================

sortSelect.addEventListener(
    "change",
    function () {

        currentSort =
            sortSelect.value;


        renderTasks();

    }
);


// ============================
// Add Button
// ============================

addBtn.addEventListener(
    "click",
    addTask
);


// ============================
// Enter Key
// ============================

taskInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// ============================
// Start App
// ============================

renderTasks();