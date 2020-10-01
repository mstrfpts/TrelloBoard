import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddTaskModal = ({
  showModal,
  setShowModal,
  categoryList,
  addTask,
  newTask,
  updateTask,
  taskToBeUpdated,
}) => {
  const [taskDetails, setTaskDetails] = useState({
    title: "Task Title",
    description: "Task Description",
    category: categoryList[0].name,
  });

  useEffect(() => {
    if (!newTask) {
      setTaskDetails({
        title: newTask ? "Task Title" : taskToBeUpdated.title,
        description: newTask ? "Task Description" : taskToBeUpdated.description,
        category: taskToBeUpdated.category,
        id: taskToBeUpdated.id,
      });
    }
  }, [taskToBeUpdated, newTask]);

  const handleClose = () => {
    setShowModal(false);
  };

  const taskTitleChangeHandler = (event) => {
    setTaskDetails({ ...taskDetails, title: event.target.value });
  };

  const taskDescriptionChangeHandler = (event) => {
    setTaskDetails({ ...taskDetails, description: event.target.value });
  };

  const taskCategoryChangeHandler = (event) => {
    setTaskDetails({ ...taskDetails, category: event.target.value });
  };

  const handleClick = (task) => {
    newTask ? addTask(taskDetails) : updateTask(task);
    handleClose();
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{newTask ? "New Task" : "Update Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please enter you task details in the below fields
        </Modal.Body>
        <Form.Group controlId="formBasic1">
          <Form.Label>Task Title</Form.Label>
          <Form.Control
            type="text"
            placeholder={`Enter Task Title pl`}
            value={newTask ? `` : taskDetails.title}
            onChange={(e) => taskTitleChangeHandler(e)}
          />
        </Form.Group>
        <Form.Group controlId="formBasic2">
          <Form.Label>Task Description</Form.Label>
          <Form.Control
            type="text"
            placeholder={`Enter Task Description`}
            value={newTask ? `` : taskDetails.description}
            onChange={(e) => taskDescriptionChangeHandler(e)}
          />
        </Form.Group>
        <Form.Group controlId="ControlSelect1">
          <Form.Label>Category:</Form.Label>
          <Form.Control
            as="select"
            defaultValue={newTask ? null : taskDetails.category}
            onChange={(e) => taskCategoryChangeHandler(e)}
          >
            {categoryList.map((category, index) => (
              <option key={index}>{category.name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleClick(taskDetails);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddTaskModal;
