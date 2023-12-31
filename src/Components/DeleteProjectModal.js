import React from "react";
import { Modal } from "react-bootstrap";
import LinkButton from "./LinkButton";
import CancelButton from "./CancelButton";

const DeleteProjectModal = ({
  isDelete,
  handleCloseModal,
  projectDetail,
  handleDelete,
}) => {
  return (
    <Modal
      show={isDelete}
      onHide={() => handleCloseModal()}
      centered
      className="permanent-delete"
    >
      <Modal.Body>
        <div className="close-btn">
          <button type="button" onClick={() => handleCloseModal()}>
            x
          </button>
        </div>
        <div className="main-content">
          <div className="left-content">
            <div className="cards">
              <img src={"assets/img/LoadExisting/3d Project page.png"} alt="" />
              <div className="title-txt">{projectDetail?.name}</div>
            </div>
          </div>
          <div className="v-border"></div>
          <div className="right-content">
            <div className="heading">YOU ARE ABOUT TO DELETE A PROJECT!</div>
            <p>This will delete your project permanently</p>
            <p>Are you sure?</p>
            <div className="footer">
              <LinkButton
                className={`signin-btn delete`}
                title="DELETE"
                onClick={() => handleDelete()}
              />
              <CancelButton
                className="cancel"
                title="CANCEL"
                onClick={() => handleCloseModal()}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteProjectModal;
