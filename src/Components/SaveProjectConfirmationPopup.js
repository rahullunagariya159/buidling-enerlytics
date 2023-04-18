import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import CancelButton from "./CancelButton";
import LinkButton from "./LinkButton";
import { useAuth } from "../Context/AuthProvider";

import Text from "./Text";
import LoadingCover from "../Components/LoadingCover";

const SaveProjectConfirmationPopup = ({
  isShow,
  onCloseModalHandler,
  handleSaveConfig,
  handleAddNewConfig,
}) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onCloseHandler = () => {
    setError("");
    onCloseModalHandler(!isShow);
  };

  return (
    <>
      {/* <LinkButton
        onClick={() => onCloseHandler()}
        className={`signin-btn sub-plan`}
        title="Save Project Confirmation"
      /> */}
      <Modal show={isShow}>
        <Modal.Header closeButton onClick={() => onCloseHandler()}>
          <Modal.Title>Please confirm are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="confrim-popup-container">
            {/* <Text type="error" text={error} /> */}
            <LinkButton
              onClick={() => handleAddNewConfig()}
              className={`signin-btn`}
              title="Save as new configuration"
              isDisable={loading}
            />
            <LinkButton
              onClick={() => handleSaveConfig()}
              className={`signin-btn`}
              title="Update existing configuration "
              isDisable={loading}
            />

            <CancelButton title="Cancel" onClick={() => onCloseHandler()} />
          </div>
        </Modal.Body>

        <LoadingCover show={loading} />
      </Modal>
    </>
  );
};
export default SaveProjectConfirmationPopup;
