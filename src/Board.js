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
      category: "ToDo",
    },
    {
      title: "Sample Task one Ongoing",
      description: "Sample Task one Description Ongoing",
      id: 5,
      boardId: 1,
      category: "Ongoing",
    },
    {
      title: "Sample Task one Complete",
      description: "Sample Task one Description Complete",
      id: 6,
      boardId: 1,
      category: "Complete",
    },
  ]);

  const [searchString, setSearchString] = useState("");

  //Functions
  const findCategoryTasks = (category) => {
    let filteredTasks = taskList.filter((task) => {
      return task.category === category;
    });

    return filteredTasks.map((filteredTask) => filteredTask.id);
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
  const [boardSelected, setBoardSelected] = useState(1);

  useEffect(() => {
    updateCategoryTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskList]);

  // let categoryList = [
  //   { name: "ToDo", id: 1, tasks: findCategoryTasks("ToDo") },
  //   { name: "Ongoing", id: 2, tasks: findCategoryTasks("Ongoing") },
  //   { name: "Complete", id: 3, tasks: findCategoryTasks("Complete") },
  // ];

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
          /*
          console.log(
            "derd, moving in same category with params",
            sourceTaskId
          );
          console.log(
            "derd, moving in same category with params",
            targetCategory
          );*/
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
    categoryList[categoryIndex].tasks = taskArray;
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
      console.log("create Board");
      let boardId = findFreeId(boards);
      setBoards([...boards, { name: "Board " + boardId, id: boardId }]);
    } else {
      console.log("chosen board is ", event.target.value);
      boards.map((board) => {
        if (board.name === event.target.value) {
          setBoardSelected(board.id);
        }
      });
    }
  };

  return (
    <div>
      <div style={{ backgroundColor: "rgb(19, 141, 241)", padding: "5px" }}>
        <input
          style={{ margin: "5px" }}
          onChange={searchHandler}
          value={searchString}
          placeholder={"Search Task"}
        ></input>
        <select onChange={boardSelectHandler}>
          {boards.map((board, index) => (
            <option key={index}>{board.name}</option>
          ))}
          <option>{"New Board"}</option>
        </select>
      </div>

      <Categories
        board={boardSelected}
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
