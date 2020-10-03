import React from "react";
import { useLocalStorage } from "./CustomHooks";
import Categories from "./Categories";
import "./Board.css";

const Board = () => {
  const [taskList, setTaskList] = useLocalStorage("taskList", [
    {
      title: "Sample Task one ToDo",
      description: "Sample Task one Description ToDo",
      id: 4,
      category: "ToDo",
    },
    {
      title: "Sample Task one Ongoing",
      description: "Sample Task one Description Ongoing",
      id: 5,
      category: "Ongoing",
    },
    {
      title: "Sample Task one Complete",
      description: "Sample Task one Description Complete",
      id: 6,
      category: "Complete",
    },
  ]);

  //Functions
  const findCategoryTasks = (category) => {
    let filteredTasks = taskList.filter((task) => task.category === category);
    return filteredTasks.map((filteredTask) => filteredTask.id);
  };

  let categoryList = [
    { name: "ToDo", id: 1, tasks: findCategoryTasks("ToDo") },
    { name: "Ongoing", id: 2, tasks: findCategoryTasks("Ongoing") },
    { name: "Complete", id: 3, tasks: findCategoryTasks("Complete") },
  ];

  const findFreeId = (array) => {
    const sortedArray = array.slice().sort(function (a, b) {
      return a.id - b.id;
    });
    let previousId = 0;
    for (let element of sortedArray) {
      if (element.id !== previousId + 1) {
        return previousId + 1;
      }
      previousId = element.id;
    }
    return previousId + 1;
  };

  const addTask = (task) => {
    let newTask = { ...task, id: findFreeId(taskList) };
    setTaskList([...taskList, newTask]);
  };

  const updateTask = (task) => {
    let updatedTaskList = taskList.map((taskCheck) => {
      if (task.id === taskCheck.id) {
        return task;
      }
      return taskCheck;
    });
    setTaskList(updatedTaskList);
  };

  const updateTaskCategory = (sourceTaskId, sourceCategory, targetCategory) => {
    let newTaskList = taskList.map((task, index) => {
      if (task.id === sourceTaskId) {
        if (task.category !== targetCategory) {
          task.category = targetCategory;
        } else {
          console.log(
            "derd, moving in same category with params",
            sourceTaskId
          );
          console.log(
            "derd, moving in same category with params",
            targetCategory
          );
        }
      }
      return task;
    });
    setTaskList(newTaskList);
  };

  const updateTaskOrder = (category, draggedId, droppedId) => {
    let categoryIndex;
    let filteredCategory = categoryList.filter((categoryFilter, index) => {
      if (categoryFilter.name === category) {
        categoryIndex = index;
      }
      return categoryFilter.name === category;
    });
    let taskArray = filteredCategory[0].tasks;
    let i = taskArray.indexOf(draggedId);
    let j = taskArray.indexOf(droppedId);
    [taskArray[i], taskArray[j]] = [taskArray[j], taskArray[i]];
    //console.log("derd after interchange", taskArray);
    //console.log("derd after interchange", categoryIndex);
    //let categoryIndex = categoryList.findIndex((x) => x.name === category);
    categoryList[categoryIndex].tasks = taskArray;
    console.log("derd after interchange", categoryList);
  };

  const deleteTask = (taskId) => {
    let newTaskList = taskList.filter((task) => task.id !== taskId);
    setTaskList(newTaskList);
  };

  return (
    <div>
      <Categories
        addTask={addTask}
        updateTaskCategory={updateTaskCategory}
        updateTaskOrder={updateTaskOrder}
        updateTask={updateTask}
        deleteTask={deleteTask}
        categoryList={categoryList}
        taskList={taskList}
      />
    </div>
  );
};

export default Board;
