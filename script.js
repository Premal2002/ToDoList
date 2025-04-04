//Constants 
const taskAddedSuceessToast = document.getElementById('taskAddedSuccess');
const taskDeletedSuceessToast = document.getElementById('taskDeletedSuccess');
const taskAddedFailedToast = document.getElementById('taskAddedFailed');
const taskUpdateFailedToast = document.getElementById('taskUpdateFailed');
const taskUpdateSuccessToast = document.getElementById('taskUpdateSuccess');

const weekDays =
    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Satuarday'];

const monthsArr =
    ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'Septemper', 'Octomber', 'November', 'December'];

//Normal variables
let completedTasksCount = 0;
let incompleteTasksCount = 0;

const date = new Date();


// console.log(`${day}, ${month} ${dateNumber}`);
const displayDate = formatDate(date);

let tasks = [];

//On Load Things

function formatDate(dateString){
    const date = new Date(dateString); 
    const day = weekDays[date.getDay()];
    const month = monthsArr[date.getMonth()];
    const dateNumber = date.getDate();
    
    return `${day}, ${month} ${dateNumber}`;
}

document.getElementById("todaysDate").innerText = displayDate

function refreshTaskList() {       
    const emptyListDiv = document.getElementById("emptyTaskContainer");
    const tasksCountToDisplay = document.getElementById("taskDisplayCount");
    if (tasks.length == 0) {
        localStorage.removeItem("tasks");
        emptyListDiv.classList.remove("hidden");
        tasksCountToDisplay.classList.add("hidden");
    } else {
        localStorage.setItem("tasks",JSON.stringify(tasks));
        tasksCountToDisplay.innerText = `Total Tasks : ${tasks.length} | Completed Tasks : ${completedTasksCount}`;
        emptyListDiv.classList.add("hidden");
        tasksCountToDisplay.classList.remove("hidden");
    }
}

function onLoad() {
    let localStorageData = localStorage.getItem("tasks");
    if(localStorageData == null || localStorageData == ""){
        tasks = [];
        return;
    }
    tasks = JSON.parse(localStorageData);
    
    tasks.forEach( (task) => { 
        task.status == "Pending" ? incompleteTasksCount++ : completedTasksCount++;
        addNewListItem(task);
    });
}

onLoad();
refreshTaskList();


//functions
function addTask() {
    const inputTask = document.getElementById("taskInput");
    const inputValue = inputTask.value;
    if (inputValue != "") {
        let newId = tasks.length == 0 ? 0 : tasks[tasks.length - 1].id;
        const newTask = { id : newId+1,code: `T${newId + 1}`, status : "Pending", date : date, task: inputValue };
        tasks.push(newTask);
        // alert("Task Added Successfully");
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(taskAddedSuceessToast)
        toastBootstrap.show();
        inputTask.value ="";
        refreshTaskList();
        addNewListItem(newTask);
        incompleteTasksCount++;
        // console.log(`Completed Tasks : ${completedTasksCount}, Incomplete Tasks : ${incompleteTasksCount}`);
    }
    else {
        // alert("Failed to add Task!");
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(taskAddedFailedToast)
        toastBootstrap.show();
    }
}

function addNewListItem(newTask) {
    const taskUL = document.getElementById("tasksUL");
    const li = document.createElement("li");
    li.className = "list-group-item py-3";
    li.id = `T${newTask.id}`;
    li.innerHTML = generateTaskHTML(newTask);

    taskUL.appendChild(li);
    const br = document.createElement("br");
    taskUL.appendChild(br);
}

function generateTaskHTML(newTask) {
    return `
    <div class="container d-flex flex-column flex-md-row">
         <div class="d-flex">
            <input type="checkbox" class="form-check-input me-2" id="checkbox${newTask.id}" ${newTask.status=="Completed" ? "checked" : ""}>
            <label class="form-check-label" for="checkbox${newTask.id}" id="label${newTask.id}">${newTask.task}</label>
         </div>
         <div class="d-flex flex-row py-2 py-md-0 ms-md-auto"> 
             <a href="#" class="justify-self-end link-danger link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover float-end px-3">Delete</a>
             <a href="#" class="justify-self-end link-warning link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover float-end px-3" 
                role="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</a>
         </div>  
    </div>
    <div class="taskStatusLine d-flex flex-column flex-sm-row small ps-2"> <div><span> Status : <span class="taskStatus ${newTask.status == "Pending" ? "text-info" : "text-success"}"> ${newTask.status} </span> <span class="ms-3"> </div> <div> Created On : ${formatDate(newTask.date)} </span></div></div>
    `;
}

//Event Listeners
const taskUL = document.getElementById("tasksUL");
const taskEditBtn = document.getElementById("taskEditBtn");

taskUL.addEventListener('change', (event) => {
    // console.log(event.target.type);
    if (event.target.type == "checkbox") {
        const li = event.target.closest("li");
        const label = li.querySelector("label");
        const status = li.querySelector(".taskStatus");
        const editLink = li.querySelector("a.link-warning");
        let index = tasks.findIndex(t => t.code == li.id);
        
        if (event.target.checked) {
            editLink.style.pointerEvents = "none"; // Prevents clicks
            editLink.style.opacity = "0.5"; // Makes it look disabled
            editLink.style.color = "gray";
            label.style.textDecoration = "line-through";
            label.style.color = "#6c757d";
            completedTasksCount++;
            incompleteTasksCount--;
            tasks[index].status = "Completed";
            status.textContent = "Completed";
            status.classList.remove("text-info");
            status.classList.add("text-success");
            // console.log(`Completed Tasks : ${completedTasksCount}, Incomplete Tasks : ${incompleteTasksCount}`);
        } else {
            editLink.style.pointerEvents = "auto"; // Re-enable clicking
            editLink.style.opacity = "1";
            editLink.style.color = ""; // Restore default color
            label.style.textDecoration = "none"
            label.style.color = "";
            completedTasksCount--;
            incompleteTasksCount++;
            tasks[index].status = "Pending";
            status.textContent = "Pending";
            status.classList.remove("text-success");
            status.classList.add("text-info");
            // console.log(`Completed Tasks : ${completedTasksCount}, Incomplete Tasks : ${incompleteTasksCount}`);
        }
        refreshTaskList();
    }
});

taskUL.addEventListener('click', (event) => {
    event.stopPropagation();
    if (event.target.innerText != "Delete" && event.target.innerText != "Edit") 
        return;
    // console.log(event.target.innerText);
    if (event.target.innerText == "Delete") {
        const li = event.target.closest("li");
        const checkbox = li.querySelector("input");
        const br = li.nextElementSibling;
        // console.log(br);

        if (checkbox.checked) {
            completedTasksCount--;
        } else {
            incompleteTasksCount--;
        }
        let index = tasks.findIndex(t => t.code == li.id);
        tasks.splice(index, 1);
        taskUL.removeChild(li);
        taskUL.removeChild(br);
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(taskDeletedSuceessToast)
        toastBootstrap.show();
        // console.log(`Completed Tasks : ${completedTasksCount}, Incomplete Tasks : ${incompleteTasksCount}`);
        refreshTaskList();
        
    }
    else if(event.target.innerText == "Edit"){
        const li = event.target.closest("li");
        const label = li.querySelector('label').textContent;
        const inputChange = document.getElementById("taskUpdate");
        inputChange.value = label;
        inputChange.setAttribute("tid",li.id);
    }
});

taskEditBtn.addEventListener("click", (event)=>{
    const inputTaskChanges = document.getElementById("taskUpdate");
    const updateModal = bootstrap.Modal.getOrCreateInstance("#staticBackdrop");
    const tskID = inputTaskChanges.getAttribute("tid");
    let taskIndex = tasks.findIndex(t => t.code == tskID);

    const inputLabelTask = document.getElementById(`label${tasks[taskIndex].id}`);
    if(inputTaskChanges.value == ""){
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(taskUpdateFailedToast)
        toastBootstrap.show();
    }else{
        // console.log(inputTaskChanges.getAttribute("tid"));

        if(taskIndex != -1){
            tasks[taskIndex].task = inputTaskChanges.value;
            refreshTaskList();
            inputLabelTask.textContent = inputTaskChanges.value;   
        }
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(taskUpdateSuccessToast)
        toastBootstrap.show();
        updateModal.hide();
    }
});

