import React, { useState } from "react";
import AddTaskModal from "./Modal";
import { useLocalStorage } from "./CustomHooks";
import "./Board.css";

const Board = () => {
  const [showModal, setShowModal] = useState(false);
  const [taskList, setTaskList] = useLocalStorage("taskList", [
    { name: "Sample Task one", id: 1, category: "ToDo" },
  ]);

  const categoryList = [
    { name: "ToDo", id: 1 },
    { name: "Ongoing", id: 2 },
    { name: "Complete", id: 3 },
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

  const filterCategoryTasks = (category) => {
    return taskList.filter((task) => {
      return task.category === category;
    });
  };

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

  const TaskCards = ({ taskList }) => {
    return taskList.map((task, index) => (
      <div key={index} className={"Task"}>
        <div className={"TaskTitle"}>{task.title}</div>
        <div className={"TaskDesc"}>{`- ${task.description}`}</div>
      </div>
    ));
  };

  return (
    <div className={"Board"}>
      {categoryList.map((category) => (
        <CategoryCard key={category.id} title={category.name} />
      ))}
      <AddTaskModal
        addTask={addTask}
        showModal={showModal}
        setShowModal={setShowModal}
        categoryList={categoryList}
      />
    </div>
  );
};

export default Board;
