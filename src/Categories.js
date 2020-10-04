import React, { useState, useRef } from "react";
import AddTaskModal from "./Modal";

import "./Board.css";

const Categories = ({
  categoryList,
  taskList,
  addTask,
  updateTaskCategory,
  updateTaskOrder,
  updateTask,
  deleteTask,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState(true);
  const [taskToBeUpdated, setTaskToBeUpdated] = useState();
  const dragItem = useRef();
  const dragNode = useRef();
  const [dragEnterId, setDragEnterId] = useState(-1);

  const [dragging, setDragging] = useState(false);

  const filterCategoryTasks = (category) => {
    let categoryTaskIds = categoryList.filter(
      (categoryFilter) => categoryFilter.name === category
    )[0].tasks;
    let orderedTaskIndices = categoryTaskIds.map((categoryTaskId) => {
      return taskList.findIndex((x) => x.id === categoryTaskId);
    });
    let orderedTasks = orderedTaskIndices.map((orderedTaskIndex) => {
      return taskList[orderedTaskIndex];
    });
    return orderedTasks;
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
    setDragEnterId(-1);
  };

  const dragEnterHandler = (e, params, source) => {
    if (source === "category") {
      if (params !== dragItem.current.category) {
        updateTaskCategory(
          dragItem.current.id,
          dragItem.current.category,
          params
        );
      }
    } else if (source === "task") {
      if (
        dragEnterId !== params.id &&
        params.id !== dragItem.current.id &&
        e.target !== dragNode.current
      ) {
        setDragEnterId(params.id);
        updateTaskOrder(params.category, dragItem.current.id, params.id);
      }
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
    setShowModal(true);
    setNewTask(false);
    setTaskToBeUpdated(updateTask);
  };

  const addTaskHandler = () => {
    setShowModal(true);
    setNewTask(true);
  };

  const CategoryCard = ({ title, setShowModal }) => {
    return (
      <div
        className={"Category"}
        onDragEnter={(e) => dragEnterHandler(e, title, "category")}
      >
        <div className={"CategoryTitle"}>{title}</div>
        {<TaskCards filteredTaskList={filterCategoryTasks(title)} />}
        <button className={"AddTask"} onClick={() => addTaskHandler()}>
          +
        </button>
      </div>
    );
  };

  const TaskCards = ({ filteredTaskList }) => {
    return filteredTaskList.map((task, index) => (
      <div
        draggable
        onDragStart={(e) => dragStartHandler(e, task)}
        onDragEnter={dragging ? (e) => dragEnterHandler(e, task, "task") : null}
        key={index}
        className={dragging ? getStyle(task) : "Task"}
      >
        <div className={"TaskTitle"} onClick={() => updateTaskHandler(task)}>
          {task.title}
        </div>

        <div className={"TaskDesc"}>{task.description}</div>
        <button
          className={"TaskClose"}
          onClick={() => taskDeleteHandler(task.id)}
        >
          x
        </button>
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
