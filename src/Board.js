import React from "react";
import { useLocalStorage } from "./CustomHooks";
import Categories from "./Categories";
import "./Board.css";

const Board = () => {
  const staticElements = [
    { title: "Drop Here", description: " ", id: 1, category: "ToDo" },
    { title: "Drop Here", description: " ", id: 2, category: "Ongoing" },
    { title: "Drop Here", description: " ", id: 3, category: "Complete" },
  ];
  const [taskList, setTaskList] = useLocalStorage("taskList", [
    ...staticElements,
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

  const updateTask = (taskId, targetCategory) => {
    let newTaskList = taskList.map((task, index) => {
      if (task.id === taskId) {
        task.category = targetCategory;
      }
      return task;
    });
    setTaskList(newTaskList);
  };

  const deleteTask = (taskId) => {
    let newTaskList = taskList.filter((task) => task.id !== taskId);
    setTaskList(newTaskList);
  };

  return (
    <div>
      <Categories
        addTask={addTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
        categoryList={categoryList}
        taskList={taskList}
      />
    </div>
  );
};

export default Board;
