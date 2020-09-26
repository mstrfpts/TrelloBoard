import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddTaskModal = ({ showModal, setShowModal, categoryList, addTask }) => {
  const [taskDetails, setTaskDetails] = useState({
    title: "Task Title",
    description: "Task Description",
    category: categoryList[0].name,
  });
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

  const handleClick = () => {
    addTask(taskDetails);
    handleClose();
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please enter you task details in the below fields
        </Modal.Body>
        <Form.Group controlId="formBasic1">
          <Form.Label>Task Title</Form.Label>
          <Form.Control
            type="text"
            placeholder={`Enter Task Title`}
            onChange={(e) => taskTitleChangeHandler(e)}
          />
        </Form.Group>
        <Form.Group controlId="formBasic2">
          <Form.Label>Task Description</Form.Label>
          <Form.Control
            type="text"
            placeholder={`Enter Task Description`}
            onChange={(e) => taskDescriptionChangeHandler(e)}
          />
        </Form.Group>
        <Form.Group controlId="ControlSelect1">
          <Form.Label>Category:</Form.Label>
          <Form.Control
            as="select"
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
          <Button variant="primary" onClick={handleClick}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddTaskModal;
