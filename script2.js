//Initial References
const newInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;

//Function on window load
window.onload = () => {
  count = Object.keys(localStorage).length;
  displayTasks();
 
};



//Function to Display The Tasks
const displayTasks = () => {
  if (Object.keys(localStorage).length > 0) {
    tasksDiv.style.display = "inline-block";
  } else {
    tasksDiv.style.display = "none";
  }

  //Clear the tasks
  tasksDiv.innerHTML = "";

  //Fetch All The Keys in local storage
  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();

  for (let key of tasks) {
    let classValue = "";

    //Get all values
    let value = localStorage.getItem(key);
    let taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("id", key);
    taskInnerDiv.innerHTML = `<span id="taskname">${key.split("_")[1]}</span>`;
    //localstorage would store boolean as string so we parse it to boolean back
    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    taskInnerDiv.appendChild(editButton);
    taskInnerDiv.innerHTML += `<button class="delete"><i class="fa-solid fa-trash"></i></button>`;
    tasksDiv.appendChild(taskInnerDiv);
  }

  //Edit Tasks
  editTasks = document.getElementsByClassName("edit");
  Array.from(editTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      //Stop propogation to outer elements (if removed when we click delete eventually rhw click will move to parent)
      e.stopPropagation();
      //disable other edit buttons when one task is being edited
      disableButtons(true);
      //update input value and remove div
      let parent = element.parentElement;
      newInput.value = parent.querySelector("#taskname").innerText;
      //set updateNote to the task that is being edited
      updateNote = parent.id;
      //remove task
      parent.remove();
    });
  });

  //Delete Tasks
  deleteTasks = document.getElementsByClassName("delete");
  Array.from(deleteTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      //Delete from local storage and remove div
      if(confirm("Are you sure to Delete?")==true){
        let parent = element.parentElement;
        removeTask(parent.id);
        parent.remove();
        count -= 1;
      }else{
        return false;
      }
     
    });
  });
};

//Disable Edit Button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

//Remove Task from local storage
const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue);
  displayTasks();
};

//Add tasks to local storage
const updateStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed);
  displayTasks();
};

const checkExistingTask = (taskValue) => {
    for (let key in localStorage) {
      if (key.includes(taskValue)) {
        return true; //task already exists
      }
    }
    return false; //task does not exist
  };
  

//Function To Add New Task

document.querySelector("#push").addEventListener("click", () => {
    //Enable the edit button
    disableButtons(false);
  
    if (newInput.value.length == 0) {
      alert("Please Enter A Task");
    } else if (checkExistingTask(newInput.value)) {
      alert("Task already exists!"); //alert if task already exists
    } else {
      //Store locally and display from local storage
      if (updateNote == "") {
        //new task
        updateStorage(count, newInput.value, false);
      } else {
        //update task
        let existingCount = updateNote.split("_")[0];
        removeTask(updateNote);
        updateStorage(existingCount, newInput.value, false);
        updateNote = "";
      }
      count += 1;
      newInput.value = "";
    }
  });
  