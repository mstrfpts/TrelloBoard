import React, { useEffect, useState } from "react";
import { useLocalStorage } from "./CustomHooks";
import Categories from "./Categories";
import "./Board.css";

const Board = () => {
  const [taskList, setTaskList] = useLocalStorage("taskList", [
    {
      title: "Sample Task one ToDo",
      description: "Sample Task one Description ToDo",
      id: 4,
      boardId: 1,
      orderNo: 1,
      category: "ToDo",
    },
    {
      title: "Sample Task one Ongoing",
      description: "Sample Task one Description Ongoing",
      id: 5,
      boardId: 1,
      orderNo: 1,
      category: "Ongoing",
    },
    {
      title: "Sample Task one Complete",
      description: "Sample Task one Description Complete",
      id: 6,
      boardId: 1,
      orderNo: 1,
      category: "Complete",
    },
  ]);

  const [searchString, setSearchString] = useState("");

  //Functions

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

  const findOrderNo = (category) => {
    let filteredCategoryTask = taskList.filter(
      (filteredTask) => filteredTask.category === category
    );
    if (filteredCategoryTask.length > 0) {
      let lastTask;
      lastTask = filteredCategoryTask.reduce((prev, current) => {
        return prev.orderNo > current.orderNo ? prev : current;
      }); //returns object
      return lastTask.orderNo;
    } else {
      return 0;
    }
  };

  const findCategoryTasks = (category) => {
    let filteredTasks = taskList.filter((task) => {
      return task.category === category;
    });

    //let filteredTaskIds = filteredTasks.map((filteredTask) => filteredTask.id);

    let filteredTaskIds1 = [];
    for (let i = 1; i <= findOrderNo(category); i++) {
      let index = filteredTasks.findIndex((x) => x.orderNo === i);
      if (index > -1 && filteredTasks[index])
        filteredTaskIds1.push(filteredTasks[index].id);
    }

    return filteredTaskIds1;
  };

  const updateCategoryTasks = () => {
    let newCategoryList = categoryList.map((categoryFilter) => {
      categoryFilter.tasks = findCategoryTasks(categoryFilter.name);
      return categoryFilter;
    });
    setCategoryList(newCategoryList);
  };

  const [categoryList, setCategoryList] = useLocalStorage("categoryList", [
    { name: "ToDo", id: 1, tasks: findCategoryTasks("ToDo") },
    { name: "Ongoing", id: 2, tasks: findCategoryTasks("Ongoing") },
    { name: "Complete", id: 3, tasks: findCategoryTasks("Complete") },
  ]);

  const [boards, setBoards] = useLocalStorage("boardList", [
    { name: "Board One", id: 1 },
  ]);
  const [boardSelected, setBoardSelected] = useState(boards[0]);

  useEffect(() => {
    updateCategoryTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskList]);

  // let categoryList = [
  //   { name: "ToDo", id: 1, tasks: findCategoryTasks("ToDo") },
  //   { name: "Ongoing", id: 2, tasks: findCategoryTasks("Ongoing") },
  //   { name: "Complete", id: 3, tasks: findCategoryTasks("Complete") },
  // ];

  const addTask = (task) => {
    let newTask = {
      ...task,
      id: findFreeId(taskList),
      orderNo: findOrderNo(task.category) + 1,
    };
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
          let targetCategoryTasksCount = taskList.filter(
            (filteredTask) => filteredTask.category === targetCategory
          ).length;
          task.orderNo = targetCategoryTasksCount; //findOrderNo(targetCategory) + 1;
        } else {
          /*
          movements of order within a category are taken care off by 
          task in dragenter action in categories file.
          */
        }
      }
      return task;
    });
    updateCategoryTasks();
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
    let updatedCategoryList = categoryList;

    //categoryList[categoryIndex].tasks = taskArray;
    updatedCategoryList[categoryIndex].tasks = taskArray;
    setCategoryList(updatedCategoryList);

    let newTaskListDrag = [...taskList];
    let draggedTaskIndex = taskList.findIndex((x) => x.id === draggedId);
    let droppedTaskIndex = taskList.findIndex((x) => x.id === droppedId);

    let currentDroppedTaskOrderNo = taskList[droppedTaskIndex].orderNo;
    let currentDraggedTaskOrderNo = taskList[draggedTaskIndex].orderNo;

    newTaskListDrag[draggedTaskIndex].orderNo = currentDroppedTaskOrderNo;
    newTaskListDrag[droppedTaskIndex].orderNo = currentDraggedTaskOrderNo;
    setTaskList(newTaskListDrag);
  };

  const deleteTask = (taskId) => {
    let newTaskList = taskList.filter((task) => task.id !== taskId);
    setTaskList(newTaskList);
  };

  const searchHandler = (event) => {
    setSearchString(event.target.value);
  };

  const boardSelectHandler = (event) => {
    if (event.target.value === "New Board") {
      let boardId = findFreeId(boards);
      setBoards([...boards, { name: "Board " + boardId, id: boardId }]);
      setBoardSelected({ name: "Board " + boardId, id: boardId });
    } else {
      boards.map((board) => {
        if (board.name === event.target.value) {
          setBoardSelected(board);
        }
        return board;
      });
    }
  };

  return (
    <div className={"BaseContainer"}>
      <div className={"FilterContainer"}>
        <div className={"Header"}>{boardSelected.name}</div>
        <select
          className={"BoardSelect"}
          value={boardSelected.name}
          onChange={boardSelectHandler}
          name={"boards"}
          id={"boards"}
        >
          {boards.map((board, index) => (
            <option key={index} value={board.name}>
              {board.name}
            </option>
          ))}
          <option>{"New Board"}</option>
        </select>
        <input
          className={"BoardInput"}
          onChange={searchHandler}
          value={searchString}
          placeholder={"Search Task"}
        ></input>
      </div>

      <Categories
        boardSelected={boardSelected}
        boards={boards}
        addTask={addTask}
        updateTaskCategory={updateTaskCategory}
        updateTaskOrder={updateTaskOrder}
        updateTask={updateTask}
        deleteTask={deleteTask}
        categoryList={categoryList}
        taskList={taskList}
        searchString={searchString}
      />
    </div>
  );
};

export default Board;
