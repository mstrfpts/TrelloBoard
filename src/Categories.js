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
  const dragItem = useRef();
  const dragNode = useRef();

  const [dragging, setDragging] = useState(false);

  const filterCategoryTasks = (category) => {
    return taskList.filter((task) => {
      return task.category === category;
    });
  };

  const dragStartHandler = (e, params) => {
    console.log("drag start e", e.target);
    console.log("drag start task", params);
    //console.log("drag start task", task.title);
    //console.log("drag start task", task.category);
    dragItem.current = params;
    dragNode.current = e.target;
    dragNode.current.addEventListener("dragend", dragEndHandler);
    setTimeout(() => setDragging(true), 0);
    console.log("drag start dragItem", dragItem.current);
  };

  const dragEndHandler = () => {
    console.log("derd, drag ending");
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

  const CategoryCard = ({ title, setShowModal }) => {
    let categoryTasks = categoryList.filter(
      (category) => category.name === title
    )[0].tasks.length;
    return (
      <div
        className={"Category"}
        onDragEnter={
          dragging && !categoryTasks.length
            ? (e) => dragEnterHandler(e, dragItem.current)
            : null
        }
      >
        <div className={"CategoryTitle"}>{title}</div>
        {<TaskCards filteredTaskList={filterCategoryTasks(title)} />}
        <button className={"AddTask"} onClick={() => setShowModal(true)}>
          +
        </button>
      </div>
    );
  };

  const TaskCards = ({ filteredTaskList }) => {
    return filteredTaskList.map((task, index) => (
      <div
        draggable
        onDragStart={
          task.title !== "Tasks" ? (e) => dragStartHandler(e, task) : null
        }
        onDragEnter={dragging ? (e) => dragEnterHandler(e, task) : null}
        key={index}
        className={dragging ? getStyle(task) : "Task"}
      >
        <div
          className={"TaskTitle"}
          style={task.title === "Drop Here" ? { minWidth: "200px" } : {}}
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
      />
    </div>
  );
};

export default Categories;
