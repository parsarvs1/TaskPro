// ========================================
// TaskPro
// Version 1.1.0
// ========================================


// ========================================
// ELEMENTS
// ========================================

// Dark Mode
const darkModeBtn =
    document.getElementById("darkModeBtn");


// Navigation
const navButtons =
    document.querySelectorAll(".nav-btn");


// Pages
const homePage =
    document.getElementById("homePage");

const tasksPage =
    document.getElementById("tasksPage");

const statsPage =
    document.getElementById("statsPage");


// Home
const goToTasksBtn =
    document.getElementById("goToTasksBtn");

const homeProgress =
    document.getElementById("homeProgress");

const homeProgressBar =
    document.getElementById("homeProgressBar");


// Task input
const taskInput =
    document.getElementById("taskInput");

const prioritySelect =
    document.getElementById("prioritySelect");

const addBtn =
    document.getElementById("addBtn");


// Search
const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");


// Filters
const filterButtons =
    document.querySelectorAll(".filter-btn");


// Sort
const sortSelect =
    document.getElementById("sortSelect");


// Task list
const taskList =
    document.getElementById("taskList");


// Task toolbar
const taskCount =
    document.getElementById("taskCount");

const clearCompletedBtn =
    document.getElementById(
        "clearCompletedBtn"
    );


// Statistics
const bigProgress =
    document.getElementById("bigProgress");

const bigProgressBar =
    document.getElementById("bigProgressBar");

const statsTotal =
    document.getElementById("statsTotal");

const statsCompleted =
    document.getElementById("statsCompleted");

const statsRemaining =
    document.getElementById("statsRemaining");

const statsMessage =
    document.getElementById("statsMessage");


// Toast
const toast =
    document.getElementById("toast");

const toastIcon =
    document.getElementById("toastIcon");

const toastMessage =
    document.getElementById("toastMessage");


// ========================================
// DATA
// ========================================

let tasks = [];


// Load tasks from localStorage

try {

    tasks =
        JSON.parse(
            localStorage.getItem(
                "taskpro_tasks"
            )
        ) || [];

} catch (error) {

    tasks = [];

}


// Current filter
let currentFilter = "all";


// Search text
let searchText = "";


// Current sort
let currentSort = "newest";


// ========================================
// SAVE TASKS
// ========================================

function saveTasks() {

    localStorage.setItem(
        "taskpro_tasks",
        JSON.stringify(tasks)
    );

}


// ========================================
// TOAST
// ========================================

let toastTimer = null;


function showToast(
    message,
    icon = "✅"
) {

    if (!toast) {
        return;
    }


    toastIcon.textContent =
        icon;


    toastMessage.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

}


// ========================================
// DARK MODE
// ========================================

let darkMode =
    localStorage.getItem(
        "taskpro_darkMode"
    ) === "true";


function applyDarkMode() {

    document.body.classList.toggle(
        "dark",
        darkMode
    );


    if (darkModeBtn) {

        darkModeBtn.textContent =
            darkMode
                ? "☀️"
                : "🌙";

    }

}


applyDarkMode();


if (darkModeBtn) {

    darkModeBtn.addEventListener(
        "click",
        () => {

            darkMode =
                !darkMode;


            localStorage.setItem(
                "taskpro_darkMode",
                darkMode
            );


            applyDarkMode();


            showToast(

                darkMode
                    ? "حالت تاریک فعال شد"
                    : "حالت روشن فعال شد",

                darkMode
                    ? "🌙"
                    : "☀️"

            );

        }
    );

}


// ========================================
// NAVIGATION
// ========================================

function showPage(pageName) {

    // Hide pages

    homePage.classList.remove(
        "active-page"
    );

    tasksPage.classList.remove(
        "active-page"
    );

    statsPage.classList.remove(
        "active-page"
    );


    // Show selected page

    if (pageName === "home") {

        homePage.classList.add(
            "active-page"
        );

    }


    if (pageName === "tasks") {

        tasksPage.classList.add(
            "active-page"
        );

    }


    if (pageName === "stats") {

        statsPage.classList.add(
            "active-page"
        );

    }


    // Update navigation

    navButtons.forEach(
        button => {

            button.classList.toggle(

                "active",

                button.dataset.page ===
                pageName

            );

        }
    );


    updateStats();

}


// Navigation events

navButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                showPage(
                    button.dataset.page
                );

            }
        );

    }
);


// ========================================
// GO TO TASKS
// ========================================

if (goToTasksBtn) {

    goToTasksBtn.addEventListener(
        "click",
        () => {

            showPage("tasks");


            setTimeout(
                () => {

                    taskInput.focus();

                },
                100
            );

        }
    );

}


// ========================================
// ADD TASK
// ========================================

function addTask() {

    const text =
        taskInput.value.trim();


    // Empty input

    if (!text) {

        showToast(
            "اول نام کار را بنویس!",
            "⚠️"
        );


        taskInput.focus();


        return;

    }


    // Create new task

    const newTask = {

        id: Date.now(),

        text: text,

        priority:
            prioritySelect.value,

        completed: false,

        createdAt: Date.now()

    };


    // Add task

    tasks.push(
        newTask
    );


    // Save

    saveTasks();


    // Clear input

    taskInput.value = "";


    // Reset priority

    prioritySelect.value =
        "medium";


    // Update

    renderTasks();

    updateStats();


    // Message

    showToast(
        "کار جدید اضافه شد 🎉",
        "✅"
    );


    taskInput.focus();

}


// Add button

addBtn.addEventListener(
    "click",
    addTask
);


// Enter key

taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// ========================================
// DELETE TASK
// ========================================

function deleteTask(id) {

    tasks =
        tasks.filter(
            task =>
                task.id !== id
        );


    saveTasks();


    renderTasks();

    updateStats();


    showToast(
        "کار حذف شد",
        "🗑️"
    );

}


// ========================================
// TOGGLE TASK
// ========================================

function toggleTask(id) {

    const task =
        tasks.find(
            task =>
                task.id === id
        );


    if (!task) {
        return;
    }


    task.completed =
        !task.completed;


    saveTasks();


    renderTasks();

    updateStats();


    if (task.completed) {

        showToast(
            "آفرین! کار انجام شد 🎉",
            "✅"
        );

    } else {

        showToast(
            "کار دوباره فعال شد",
            "↩️"
        );

    }

}


// ========================================
// EDIT TASK
// ========================================

function editTask(id) {

    const task =
        tasks.find(
            task =>
                task.id === id
        );


    if (!task) {
        return;
    }


    const element =
        document.querySelector(
            `[data-id="${id}"]`
        );


    if (!element) {
        return;
    }


    element.innerHTML = `

        <div class="edit-area">

            <input
                class="edit-input"
                value="${escapeHTML(
                    task.text
                )}"
                type="text"
            >


            <select class="edit-select">

                <option value="low">
                    🟢 کم
                </option>

                <option value="medium">
                    🟡 متوسط
                </option>

                <option value="high">
                    🔴 زیاد
                </option>

            </select>


            <button
                class="save-edit"
                type="button"
            >
                ذخیره
            </button>

        </div>

    `;


    const input =
        element.querySelector(
            ".edit-input"
        );


    const select =
        element.querySelector(
            ".edit-select"
        );


    const saveButton =
        element.querySelector(
            ".save-edit"
        );


    select.value =
        task.priority;


    input.focus();


    // Save

    saveButton.addEventListener(
        "click",
        () => {

            const newText =
                input.value.trim();


            if (!newText) {

                showToast(
                    "نام کار نمی‌تواند خالی باشد!",
                    "⚠️"
                );


                return;

            }


            task.text =
                newText;


            task.priority =
                select.value;


            saveTasks();


            renderTasks();

            updateStats();


            showToast(
                "کار ویرایش شد",
                "✏️"
            );

        }
    );


    // Enter to save

    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                saveButton.click();

            }

        }
    );

}


// ========================================
// PRIORITY
// ========================================

function priorityInfo(priority) {

    if (priority === "high") {

        return {

            text: "🔴 زیاد",

            className:
                "priority-high"

        };

    }


    if (priority === "low") {

        return {

            text: "🟢 کم",

            className:
                "priority-low"

        };

    }


    return {

        text: "🟡 متوسط",

        className:
            "priority-medium"

    };

}


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener(
    "input",
    () => {

        searchText =
            searchInput.value.trim();


        renderTasks();

    }
);


clearSearch.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        searchText = "";


        renderTasks();


        searchInput.focus();

    }
);


// ========================================
// FILTER
// ========================================

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                // Remove active

                filterButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                // Add active

                button.classList.add(
                    "active"
                );


                // Set filter

                currentFilter =
                    button.dataset.filter;


                renderTasks();

            }
        );

    }
);


// ========================================
// SORT
// ========================================

sortSelect.addEventListener(
    "change",
    () => {

        currentSort =
            sortSelect.value;


        renderTasks();

    }
);


// ========================================
// CLEAR COMPLETED TASKS
// ========================================

function clearCompletedTasks() {

    const completedCount =
        tasks.filter(
            task =>
                task.completed
        ).length;


    // Nothing to delete

    if (completedCount === 0) {

        showToast(
            "کاری برای پاک کردن وجود ندارد",
            "ℹ️"
        );


        return;

    }


    // Remove completed

    tasks =
        tasks.filter(
            task =>
                !task.completed
        );


    // Save

    saveTasks();


    // Update

    renderTasks();

    updateStats();


    // Message

    showToast(
        `${completedCount} کار انجام‌شده پاک شد`,
        "🧹"
    );

}


// Clear completed button

if (clearCompletedBtn) {

    clearCompletedBtn.addEventListener(
        "click",
        clearCompletedTasks
    );

}


// ========================================
// RENDER TASKS
// ========================================

function renderTasks() {

    taskList.innerHTML = "";


    // Copy tasks

    let result =
        [...tasks];


    // ====================================
    // SEARCH
    // ====================================

    if (searchText) {

        result =
            result.filter(
                task => {

                    return task.text
                        .toLowerCase()
                        .includes(
                            searchText
                                .toLowerCase()
                        );

                }
            );

    }


    // ====================================
    // FILTER
    // ====================================

    if (
        currentFilter ===
        "active"
    ) {

        result =
            result.filter(
                task =>
                    !task.completed
            );

    }


    if (
        currentFilter ===
        "completed"
    ) {

        result =
            result.filter(
                task =>
                    task.completed
            );

    }


    if (
        currentFilter ===
        "high"
    ) {

        result =
            result.filter(
                task =>
                    task.priority ===
                    "high"
            );

    }


    // ====================================
    // SORT
    // ====================================

    if (
        currentSort ===
        "newest"
    ) {

        result.sort(
            (a, b) =>
                b.id - a.id
        );

    }


    if (
        currentSort ===
        "oldest"
    ) {

        result.sort(
            (a, b) =>
                a.id - b.id
        );

    }


    if (
        currentSort ===
        "priority"
    ) {

        const priorityValue = {

            low: 1,

            medium: 2,

            high: 3

        };


        result.sort(
            (a, b) => {

                return (

                    priorityValue[
                        b.priority
                    ]

                    -

                    priorityValue[
                        a.priority
                    ]

                );

            }
        );

    }


    // ====================================
    // EMPTY
    // ====================================

    if (result.length === 0) {

        taskList.innerHTML = `

            <div class="task empty-task">

                <div>

                    <strong>

                        ${
                            searchText
                                ? "چیزی پیدا نشد 🔎"
                                : "هنوز کاری نداری 🎉"
                        }

                    </strong>


                    <small>

                        ${
                            searchText
                                ? "جستجوی دیگری امتحان کن."
                                : "اولین کارتت را اضافه کن!"
                        }

                    </small>

                </div>

            </div>

        `;


        return;

    }


    // ====================================
    // CREATE TASKS
    // ====================================

    result.forEach(
        task => {

            const info =
                priorityInfo(
                    task.priority
                );


            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "task";


            element.dataset.id =
                task.id;


            // Completed class

            if (task.completed) {

                element.classList.add(
                    "completed"
                );

            }


            // HTML

            element.innerHTML = `

                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${
                        task.completed
                            ? "checked"
                            : ""
                    }
                >


                <span class="task-text">

                    ${escapeHTML(
                        task.text
                    )}

                </span>


                <span
                    class="priority
                    ${info.className}"
                >

                    ${info.text}

                </span>


                <div class="task-actions">

                    <button
                        class="edit-btn"
                        type="button"
                        title="ویرایش"
                    >
                        ✏️
                    </button>


                    <button
                        class="delete-btn"
                        type="button"
                        title="حذف"
                    >
                        🗑️
                    </button>

                </div>

            `;


            // Checkbox

            const checkbox =
                element.querySelector(
                    ".task-checkbox"
                );


            checkbox.addEventListener(
                "change",
                () => {

                    toggleTask(
                        task.id
                    );

                }
            );


            // Edit

            const editButton =
                element.querySelector(
                    ".edit-btn"
                );


            editButton.addEventListener(
                "click",
                () => {

                    editTask(
                        task.id
                    );

                }
            );


            // Delete

            const deleteButton =
                element.querySelector(
                    ".delete-btn"
                );


            deleteButton.addEventListener(
                "click",
                () => {

                    deleteTask(
                        task.id
                    );

                }
            );


            // Add to list

            taskList.appendChild(
                element
            );

        }
    );

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// ========================================
// UPDATE STATISTICS
// ========================================

function updateStats() {

    // Total

    const total =
        tasks.length;


    // Completed

    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    // Remaining

    const remaining =
        total - completed;


    // Percentage

    const percent =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    // ====================================
    // TASK COUNTER
    // ====================================

    if (taskCount) {

        taskCount.textContent =
            total;

    }


    // ====================================
    // CLEAR COMPLETED BUTTON
    // ====================================

    if (clearCompletedBtn) {

        clearCompletedBtn.disabled =
            completed === 0;

    }


    // ====================================
    // HOME
    // ====================================

    homeProgress.textContent =
        percent + "٪";


    homeProgressBar.style.width =
        percent + "%";


    // ====================================
    // STATS
    // ====================================

    statsTotal.textContent =
        total;


    statsCompleted.textContent =
        completed;


    statsRemaining.textContent =
        remaining;


    bigProgress.textContent =
        percent + "٪";


    bigProgressBar.style.width =
        percent + "%";


    // ====================================
    // STATS MESSAGE
    // ====================================

    if (total === 0) {

        statsMessage.textContent =
            "هنوز کاری ثبت نکردی. اولین کارت رو اضافه کن! 🚀";

    }

    else if (percent === 100) {

        statsMessage.textContent =
            "🎉 فوق‌العاده! همه کارها انجام شدند!";

    }

    else if (percent >= 70) {

        statsMessage.textContent =
            "🔥 عالی پیش رفتی! فقط کمی دیگه مونده.";

    }

    else if (percent >= 30) {

        statsMessage.textContent =
            "💪 خوبه! ادامه بده.";

    }

    else {

        statsMessage.textContent =
            "🚀 شروع کن! هر کار یک قدم جلوتره.";

    }

}


// ========================================
// START APP
// ========================================

renderTasks();

updateStats();

showPage("home");
