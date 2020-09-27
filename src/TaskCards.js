import React, { useState, useRef, useEffect } from "react";

const TaskCards = ({ taskList }) => {
  const dragItem = useRef();
  const dragNode = useRef();
  const [dragSource, setDragSource] = useState();

  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    console.log("derd useEffect dragItem update", dragItem);
  }, [dragItem]);

  const dragStartHandler = (e, params) => {
    console.log("drag start e", e.target);
    console.log("drag start task", params);
    //console.log("drag start task", task.title);
    //console.log("drag start task", task.category);
    dragItem.current = params;
    setDragSource(params);
    dragNode.current = e.target;
    dragNode.current.addEventListener("dragend", dragEndHandler);
    setTimeout(() => setDragging(true), 0);
    console.log("drag start dragItem", dragItem.current);
    console.log("drag start dragSource", dragSource);
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
    console.log("drag enter e", params);
    console.log("drag enter e", params);
    console.log("drag enter dragItem", dragItem);
    console.log("drag enter dragSource", dragSource);
    if (typeof dragItem.current === "undefined") {
      console.log("not the same");
      console.log("derd target task category", params.category);
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
    }
  };

  return taskList.map((task, index) => (
    <div
      draggable
      onDragStart={(e) => dragStartHandler(e, task)}
      onDragEnter={(e) => dragEnterHandler(e, task)}
      key={index}
      className={dragging ? getStyle(task) : "Task"}
    >
      <div className={"TaskTitle"}>{task.title}</div>
      <div className={"TaskDesc"}>{`- ${task.description}`}</div>
    </div>
  ));
};

export default TaskCards;
