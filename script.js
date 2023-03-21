// Initialization
const newInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;

// Window onload
window.onload = () => {
  count = Object.keys(localStorage).length;
  displayTasks();
 
};
//Display the tasks
const displayTasks = () => {
  if (Object.keys(localStorage).length > 0) {
    tasksDiv.style.display = "inline-block";
  } else {
    tasksDiv.style.display = "none";
  }
// clear the tasks
  tasksDiv.innerHTML = "";
// Fetching values in localstorage
  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();

  for (let key of tasks) {
    let classValue = "";
9// Get all values
    let value = localStorage.getItem(key);
    let taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("id", key);
    // there is no elements thats why put 1. invase we put 0 means index values only printed.it is using key
    taskInnerDiv.innerHTML = `<span id="taskname">${key.split("_")[1]}</span>`;
    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    taskInnerDiv.appendChild(editButton);
    taskInnerDiv.innerHTML += `<button class="delete"><i class="fa-solid fa-trash"></i></button>`;
    tasksDiv.appendChild(taskInnerDiv);
  }
// Edit tasks
  editTasks = document.getElementsByClassName("edit");
  Array.from(editTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
// When you have js running on the same event of nested elements to stop being called.
      e.stopPropagation();
      //update input value and remove div
      let parent = element.parentElement;
      newInput.value = parent.querySelector("#taskname").innerText;
      //set updateNote to the task that is being edited
      updateNote = parent.id;
      // Remove task
      parent.remove();
    });
  });

  //Delete tasks
  deleteTasks = document.getElementsByClassName("delete");
  Array.from(deleteTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      if(confirm("Are you sure to Delete?")==true){
        let parent = element.parentElement;
        removeTask(parent.id);
        parent.remove();
        count -= 1;
        toastDeleted();

      }else{
        return false;
      }
     
    });
  });
};

// Remove the task from localstorage
const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue);
  displayTasks();
};

//add the task to localstorage
const updateStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed);
  displayTasks();
};

//check an existing task
const checkExistingTask = (taskValue) => {
  for (let key in localStorage) {
    if (key.endsWith(`_${taskValue}`)) {
      return true;
    }
  }
  return false;
};

// Add a new task
  
  document.querySelector("#push").addEventListener("click", () => {
    if (newInput.value.length == 0) {
      alert("Please Enter A Task");
    } else if (checkExistingTask(newInput.value, updateNote)) {
      alert("Task Already Exists!");
    } else {
      //Store locally and display from local storage
      if (updateNote == "") {
         //new task
        updateStorage(count, newInput.value, true);
      } else {
         //update task
         // index 0 is st from first. it is using updating field
        let existingCount = updateNote.split("_")[0];
        removeTask(updateNote);
        updateStorage(existingCount, newInput.value, true);
        updateNote = "";
      }
      count += 1;
      newInput.value = "";
        toastAdded()
    }
  });
  

  function toastAdded() {
    var tAdd = document.getElementById("added");
    tAdd.className = "show";
    setTimeout(function(){ tAdd.className = tAdd.className.replace("show", ""); }, 3000);
  }


  function toastDeleted() {
    var tDelete = document.getElementById("deleted");
    tDelete.className = "show";
    setTimeout(function(){ tDelete.className = tDelete.className.replace("show", ""); }, 3000);
  }
  
  