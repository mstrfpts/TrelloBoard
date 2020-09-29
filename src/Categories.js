import React, { useState, useRef } from "react";
import AddTaskModal from "./Modal";

import "./Board.css";

const Categories = ({
  categoryList,
  taskList,
  addTask,
  updateTask,
  deleteTask,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState(true);
  const [taskToBeUpdated, setTaskToBeUpdated] = useState();
  const dragItem = useRef();
  const dragNode = useRef();

  const [dragging, setDragging] = useState(false);

  const filterCategoryTasks = (category) => {
    return taskList.filter((task) => {
      return task.category === category;
    });
  };

  const dragStartHandler = (e, params) => {
    dragItem.current = params;
    dragNode.current = e.target;
    dragNode.current.addEventListener("dragend", dragEndHandler);
    setTimeout(() => setDragging(true), 0);
  };

  const dragEndHandler = () => {
    setDragging(false);

    dragNode.current.removeEventListener("dragend", dragEndHandler);
    dragItem.current = null;
    dragNode.current = null;
  };

  const dragEnterHandler = (e, params) => {
    if (
      dragItem.current.category !== params.category &&
      e.target !== dragNode.current
    ) {
      updateTask(dragItem.current.id, params.category);
    }
  };

  const dragEnterHandler1 = (e, params) => {
    if (
      dragItem.current.category !==
      params.category /*&&
      e.target !== dragNode.current*/
    ) {
      updateTask(dragItem.current.id, params.category);
    }
  };

  const taskDeleteHandler = (taskId) => {
    deleteTask(taskId);
  };

  const getStyle = (task) => {
    const {
      current: { category: dragItemCategory, title: dragItemTitle },
    } = dragItem;
    const { title: taskTitle, category: taskCategory } = task;
    if (taskTitle === dragItemTitle && taskCategory === dragItemCategory) {
      return "Dnd Task";
    } else {
      return "Task";
    }
  };

  const updateTaskHandler = (updateTask) => {
    console.log("title clicked");
    setShowModal(true);
    setNewTask(false);
    setTaskToBeUpdated(updateTask);
  };

  const addTaskHandler = () => {
    setShowModal(true);
    setNewTask(true);
  };

  const CategoryCard = ({ title, setShowModal }) => {
    let categoryTaskIds = categoryList.filter(
      (category) => category.name === title
    )[0].tasks;
    let defaultCategoryTasks = taskList.filter((task) => {
      return task.id === categoryTaskIds[0];
    });
    return (
      <div
        className={"Category"}
        onDragEnter={
          /*categoryTaskIds.length === 1
            ? */ (e) =>
            dragEnterHandler1(e, defaultCategoryTasks[0])
          //  : null
        }
      >
        <div className={"CategoryTitle"}>{title}</div>
        {<TaskCards filteredTaskList={filterCategoryTasks(title)} />}
        <button className={"AddTask"} onClick={() => addTaskHandler}>
          +
        </button>
      </div>
    );
  };

  const TaskCards = ({ filteredTaskList }) => {
    return filteredTaskList.map((task, index) => (
      <div
        draggable={task.title !== "Drop Here" ? true : false}
        onDragStart={
          task.title !== "Drop Here" ? (e) => dragStartHandler(e, task) : null
        }
        onDragEnter={dragging ? (e) => dragEnterHandler(e, task) : null}
        key={index}
        className={dragging ? getStyle(task) : "Task"}
      >
        <div
          className={"TaskTitle"}
          style={
            task.title === "Drop Here"
              ? { color: "black", minWidth: "200px" }
              : {}
          }
          onClick={() => updateTaskHandler(task)}
        >
          {task.title}
        </div>

        <div className={"TaskDesc"}>{`${
          task.title !== "Drop Here" ? "-" : ""
        } ${task.description}`}</div>
        {task.title !== "Drop Here" ? (
          <button
            className={"TaskClose"}
            onClick={() => taskDeleteHandler(task.id)}
          >
            x
          </button>
        ) : null}
      </div>
    ));
  };

  return (
    <div className={"Board"}>
      {categoryList.map((category) => (
        <CategoryCard
          key={category.id}
          title={category.name}
          setShowModal={setShowModal}
        />
      ))}
      <AddTaskModal
        addTask={addTask}
        showModal={showModal}
        setShowModal={setShowModal}
        categoryList={categoryList}
        newTask={newTask}
        updateTask={updateTask}
        taskToBeUpdated={taskToBeUpdated}
      />
    </div>
  );
};

export default Categories;
