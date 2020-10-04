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
  const initialTaskDetails = {
    title: "",
    description: "",
    category: categoryList[0].name,
  };
  const [taskDetails, setTaskDetails] = useState(initialTaskDetails);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (!newTask) {
      setTaskDetails({
        title: newTask ? "Task Title" : taskToBeUpdated.title,
        description: newTask ? "Task Description" : taskToBeUpdated.description,
        category: taskToBeUpdated.category,
        id: taskToBeUpdated.id,
      });
    } else {
      setTaskDetails(initialTaskDetails);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskToBeUpdated, newTask, showModal]);

  const handleClose = () => {
    setTaskDetails(initialTaskDetails);
    setShowModal(false);
    setValidated(false);
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

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      newTask ? addTask(taskDetails) : updateTask(taskDetails);
      setTaskDetails(initialTaskDetails);
      handleClose();
    }
    setValidated(true);
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

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="formBasic1">
            <Form.Label>Task Title</Form.Label>
            <Form.Control
              type="text"
              placeholder={`Enter Task Title`}
              value={taskDetails.title}
              onChange={(e) => taskTitleChangeHandler(e)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid task title.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formBasic2">
            <Form.Label>Task Description</Form.Label>
            <Form.Control
              type="text"
              placeholder={`Enter Task Description`}
              value={taskDetails.description}
              onChange={(e) => taskDescriptionChangeHandler(e)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid task description.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="ControlSelect1">
            <Form.Label>Category:</Form.Label>
            <Form.Control
              as="select"
              defaultValue={newTask ? null : taskDetails.category}
              onChange={(e) => taskCategoryChangeHandler(e)}
              required={false}
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
            <Button type="submit">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddTaskModal;
