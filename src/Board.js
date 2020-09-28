import React, { useState, useRef } from "react";
import AddTaskModal from "./Modal";
import { useLocalStorage } from "./CustomHooks";
import TaskCards from "./TaskCards";
import Categories from "./Categories";
import "./Board.css";

const Board = () => {
  const [showModal, setShowModal] = useState(false);
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
    console.log("derd filter sorted", sortedArray);
    let previousId = 0;
    for (let element of sortedArray) {
      console.log("derd sorted array elemnet", element);
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
        console.log("derd, found taskId", task);
        task.category = targetCategory;
      }
      return task;
    });
    console.log("derd updated new task", newTaskList);
    setTaskList(newTaskList);
  };

  const filterCategoryTasks = (category) => {
    return taskList.filter((task) => {
      return task.category === category;
    });
  };

  //Components
  const CategoryCard = ({ title }) => {
    return (
      <div className={"Category"}>
        <div className={"CategoryTitle"}>{title}</div>
        {<TaskCards taskList={filterCategoryTasks(title)} />}
        <button className={"AddTask"} onClick={() => setShowModal(true)}>
          +
        </button>
      </div>
    );
  };

  return (
    <div>
      {/*categoryList.map((category) => (
        <CategoryCard key={category.id} title={category.name} />
      ))*/}
      <Categories
        addTask={addTask}
        updateTask={updateTask}
        categoryList={categoryList}
        taskList={taskList}
      />
      {/*<AddTaskModal
        addTask={addTask}
        showModal={showModal}
        setShowModal={setShowModal}
        categoryList={categoryList}
      />*/}
    </div>
  );
};

export default Board;
