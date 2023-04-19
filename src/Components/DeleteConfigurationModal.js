import React from "react";
import { Modal } from "react-bootstrap";
import LinkButton from "./LinkButton";
import CancelButton from "./CancelButton";

const DeleteConfigurationModal = ({
  isDelete,
  handleCloseModal,
  configurationDetails,
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
            <div className="heading">Configuration</div>
            <p>Wall Improved</p>
            <p>Solar Heater</p>
            <p>Optimized</p>
          </div>
          <div className="v-border"></div>
          <div className="right-content">
            <div className="heading">
              YOU ARE ABOUT TO DELETE 3 CONFIGURATIONS!
            </div>
            <p>This will delete your project permanently</p>
            <p>Are you sure?</p>
            <div className="footer">
              <LinkButton className={`signin-btn delete`} title="DELETE" />
              <CancelButton
                className="cancel"
                title="CANCEL"
                onClick={() => handleDelete()}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteConfigurationModal;
