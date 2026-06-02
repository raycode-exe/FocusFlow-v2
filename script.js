/* ==========================
   FOCUSFLOW V2
========================== */

/* NAVIGATION */

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const pageId = button.dataset.page;

        pages.forEach(page =>
            page.classList.remove("active")
        );

        navButtons.forEach(btn =>
            btn.classList.remove("active-nav")
        );

        document
            .getElementById(pageId)
            .classList.add("active");

        button.classList.add("active-nav");

    });

});

/* DATE */

const currentDate =
document.getElementById("currentDate");

const today = new Date();

currentDate.textContent =
today.toDateString();

/* DARK MODE */

const themeToggle =
document.getElementById("themeToggle");

const savedTheme =
localStorage.getItem(
"focusflow_theme"
);

if(savedTheme === "dark"){

document.body.classList.add(
"dark"
);

themeToggle.textContent = "☀️";

}

themeToggle.addEventListener(
"click",
() => {

document.body.classList.toggle(
"dark"
);

if(
document.body.classList.contains(
"dark"
)
){

localStorage.setItem(
"focusflow_theme",
"dark"
);

themeToggle.textContent = "☀️";

}else{

localStorage.setItem(
"focusflow_theme",
"light"
);

themeToggle.textContent = "🌙";

}

}
);

/* TASKS */

const taskInput =
document.getElementById("taskInput");

const taskCategory =
document.getElementById("taskCategory");

const addTaskBtn =
document.getElementById("addTaskBtn");

const taskList =
document.getElementById("taskList");

let tasks =
JSON.parse(
localStorage.getItem(
"focusflow_tasks"
)
) || [];

function saveTasks(){

localStorage.setItem(
"focusflow_tasks",
JSON.stringify(tasks)
);

updateDashboard();

}

function renderTasks(){

taskList.innerHTML = "";

tasks.forEach(task => {

const li =
document.createElement("li");

li.className =
"task-item";

li.innerHTML = `

<div class="task-info">

<strong class="${
task.completed
? "completed"
: ""
}">

${task.text}

</strong>

<span class="task-category">

${task.category}

</span>

</div>

<div>

<button onclick="
toggleTask(${task.id})
">
✓
</button>

<button onclick="
deleteTask(${task.id})
">
✕
</button>

</div>

`;

taskList.appendChild(li);

});

updateDashboard();

}

function addTask(){

const text =
taskInput.value.trim();

if(!text) return;

tasks.push({

id: Date.now(),

text,

category:
taskCategory.value,

completed:false

});

taskInput.value = "";

saveTasks();

renderTasks();

}

function toggleTask(id){

tasks = tasks.map(task => {

if(task.id === id){

task.completed =
!task.completed;

}

return task;

});

saveTasks();

renderTasks();

}

function deleteTask(id){

tasks = tasks.filter(
task =>
task.id !== id
);

saveTasks();

renderTasks();

}

addTaskBtn.addEventListener(
"click",
addTask
);

/* NOTES */

const notesArea =
document.getElementById(
"notesArea"
);

const saveNoteBtn =
document.getElementById(
"saveNoteBtn"
);

const saveStatus =
document.getElementById(
"saveStatus"
);

notesArea.value =
localStorage.getItem(
"focusflow_notes"
) || "";

notesArea.addEventListener(
"input",
() => {

localStorage.setItem(
"focusflow_notes",
notesArea.value
);

saveStatus.textContent =
"Auto Saved ✓";

}
);

saveNoteBtn.addEventListener(
"click",
() => {

localStorage.setItem(
"focusflow_notes",
notesArea.value
);

saveStatus.textContent =
"Saved Successfully ✓";

}
);

/* DASHBOARD */

function updateDashboard(){

const total =
tasks.length;

const completed =
tasks.filter(
task =>
task.completed
).length;

const pending =
total - completed;

document.getElementById(
"totalTasks"
).textContent = total;

document.getElementById(
"completedTasks"
).textContent =
completed;

document.getElementById(
"pendingTasks"
).textContent =
pending;

const percentage =
total === 0
? 0
: Math.round(
completed /
total * 100
);

document.getElementById(
"progressFill"
).style.width =
percentage + "%";

document.getElementById(
"progressText"
).textContent =
percentage +
"% Completed";

}

/* QUOTES */

const quotes = [

"Stay focused and never quit.",

"Success starts with consistency.",

"Discipline beats motivation.",

"Small progress is still progress.",

"Focus on the goal, not the obstacle.",

"Done is better than perfect."

];

const quote =
document.getElementById(
"quote"
);

quote.textContent =
quotes[
Math.floor(
Math.random() *
quotes.length
)
];

/* POMODORO */

let focusTime =
25 * 60;

let currentTime =
focusTime;

let timer = null;

let focusSessions =
parseInt(
localStorage.getItem(
"focus_sessions"
)
) || 0;

document.getElementById(
"focusSessions"
).textContent =
focusSessions;

const timerDisplay =
document.getElementById(
"timerDisplay"
);

function updateTimer(){

const min =
Math.floor(
currentTime / 60
);

const sec =
currentTime % 60;

timerDisplay.textContent =
`${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;

}

document
.getElementById("startBtn")
.addEventListener(
"click",
() => {

if(timer) return;

timer = setInterval(() => {

currentTime--;

updateTimer();

if(currentTime <= 0){

clearInterval(timer);

timer = null;

focusSessions++;

localStorage.setItem(
"focus_sessions",
focusSessions
);

document.getElementById(
"focusSessions"
).textContent =
focusSessions;

alert(
"Focus Session Completed!"
);

currentTime =
focusTime;

updateTimer();

}

},1000);

}
);

document
.getElementById("pauseBtn")
.addEventListener(
"click",
() => {

clearInterval(timer);

timer = null;

}
);

document
.getElementById("resetBtn")
.addEventListener(
"click",
() => {

clearInterval(timer);

timer = null;

currentTime =
focusTime;

updateTimer();

}
);

/* CLEAR DATA */

document
.getElementById(
"clearDataBtn"
)
.addEventListener(
"click",
() => {

const confirmDelete =
confirm(
"Delete all saved data?"
);

if(confirmDelete){

localStorage.clear();

location.reload();

}

}
);

/* SERVICE WORKER */

if("serviceWorker" in navigator){

window.addEventListener(
"load",
() => {

navigator.serviceWorker
.register(
"service-worker.js"
)
.then(() => {

console.log(
"Service Worker Registered"
);

})
.catch(err => {

console.log(err);

});

}
);

}

/* INITIAL LOAD */

renderTasks();
updateDashboard();
updateTimer();