import React, { useState, useRef, useEffect } from "react";
import AddTaskModal from "./Modal";

import "./Board.css";

const Categories = ({ categoryList, taskList, addTask, updateTask }) => {
  const [showModal, setShowModal] = useState(false);
  const dragItem = useRef();
  const dragNode = useRef();

  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    console.log("derd useEffect dragItem update", dragItem);
  }, [dragItem]);

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
    //console.log("drag enter task", task.title);
    //console.log("drag enter dragNode", dragNode.current);
    // console.log("drag enter e", e.target);
    // console.log("drag enter dragNode", dragNode.current);
    console.log("drag enter dragitem category ", dragItem.current.category);
    console.log("drag enter params.category", params.category);
    console.log("drag enter e target", e.target);
    console.log("drag enter dragNode.current", dragNode.current);

    if (
      dragItem.current.category !== params.category &&
      e.target !== dragNode.current
    ) {
      console.log("derd drag enter not the same");
      console.log("derd drag enter task id", dragItem.current.id);
      console.log("derd drag enter target task category", params.category);
      updateTask(dragItem.current.id, params.category);
      //console.log("drag enter task", task.title);
      //console.log("drag enter task", task.category);
    }
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
