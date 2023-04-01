import React from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import CancelButton from "./CancelButton";
import LinkButton from "./LinkButton";
import { useAuth } from "../Context/AuthProvider";
import Text from "./Text";

function BuyCredits() {
  const [inputVal, setInputVal] = useState("");
  const [isShow, invokeModal] = useState(false);
  const [error, setError] = useState("");
  const { creditCardList } = useAuth();

  const onChangeHandler = (evt) => {
    setError("");
    const value = evt.target.value;
    setInputVal({
      ...inputVal,
      [evt.target.name]: value,
    });
  };

  const handlePayForCredits = () => {
    setError("");
    if (!inputVal?.credits) {
      setError("Please enter a number of credits");
      return false;
    } else if (creditCardList?.length === 0) {
      setError("Please add your credit card");
      return false;
    }
    invokeModal(!isShow);
  };

  const onCloseHandler = () => {
    setInputVal("");
    setError("");
    invokeModal(!isShow);
  };

  return (
    <>
      <LinkButton
        onClick={() => onCloseHandler()}
        className={`signin-btn sub-plan`}
        title="Buy Credits"
      />
      <Modal show={isShow}>
        <Modal.Header closeButton onClick={() => onCloseHandler()}>
          <Modal.Title>Buy Credits</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="main-credits">
            <div className="items-title">
              <div>Number of credits</div>
              <input
                type="number"
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

            <Text type="error" text={error} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <LinkButton
            onClick={() => handlePayForCredits()}
            className={`signin-btn `}
            title="Pay"
          />
          <CancelButton title="Cancel" onClick={() => onCloseHandler()} />
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default BuyCredits;
