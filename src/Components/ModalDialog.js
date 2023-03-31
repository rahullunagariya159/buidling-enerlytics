import React from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import CancelButton from "./CancelButton";
import LinkButton from "./LinkButton";
function ModalDialog() {
  const [inputVal, setInputVal] = useState("");
  const [isShow, invokeModal] = useState(false);
  const onChangeHandler = (evt) => {
    const value = evt.target.value;
    setInputVal({
      ...inputVal,
      [evt.target.name]: value,
    });
  };
  return (
    <>
      <LinkButton
        onClick={() => invokeModal(!isShow)}
        className={`signin-btn sub-plan`}
        title="Buy Credits"
      />
      <Modal show={isShow}>
        <Modal.Header closeButton onClick={() => invokeModal(!isShow)}>
          <Modal.Title>Buy Credits</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="main-credits">
            <div className="items-title">
              <div>Number of credits</div>
              <input
                type="text"
                placeholder="Enter credit"
                onChange={onChangeHandler}
                name="credits"
                id="credits"
                value={inputVal?.credits}
              />
            </div>
            <div className="cost-title">
              <div>Cost </div>
              <div>€{inputVal?.credits}</div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <LinkButton
            onClick={() => invokeModal(!isShow)}
            className={`signin-btn `}
            title="Pay"
          />
          <CancelButton title="Cancel" onClick={() => invokeModal(!isShow)} />
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ModalDialog;
