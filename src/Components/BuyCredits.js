import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import CancelButton from "./CancelButton";
import LinkButton from "./LinkButton";
import { useAuth } from "../Context/AuthProvider";
import { buyCredits } from "./Services/UserProfileService";
import { somethingWentWrongError } from "../Constants";
import Text from "./Text";
import LoadingCover from "../Components/LoadingCover";
import { validateNumber } from "../utils";

function BuyCredits() {
  const [inputVal, setInputVal] = useState("");
  const [isShow, invokeModal] = useState(false);
  const [cost, setCost] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { creditCardList, userId, getUserInfo } = useAuth();

  const onChangeHandler = (evt) => {
    setError("");
    const value = evt.target.value;
    if (!validateNumber(value)) {
      setInputVal({
        ...inputVal,
        [evt.target.name]: "",
      });
      return false;
    }
    setInputVal({
      ...inputVal,
      [evt.target.name]: value,
    });
  };

  const handlePayForCredits = async () => {
    setError("");
    if (!inputVal?.credits) {
      setError("Please enter a number of credits");
      return false;
    } else if (
      Math.sign(inputVal?.credits) === -1 ||
      Number(inputVal?.credits) <= 0
    ) {
      setError("Please enter valid number");
      return false;
    } else if (creditCardList?.length === 0) {
      setError("Please add your credit card");
      return false;
    }

    setLoading(true);
    const creditPayload = {
      userId: userId,
      credits: inputVal?.credits,
      amount: cost,
    };

    await buyCredits(creditPayload)
      .then(async (response) => {
        if (response?.status === 200 && response?.data?.msg) {
          await getUserInfo(userId);
          // toast.success("Credits purchased successfully");
          invokeModal(!isShow);
        }
      })
      .catch((error) => {
        setError(error?.message || somethingWentWrongError);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onCloseHandler = () => {
    setInputVal("");
    setError("");
    invokeModal(!isShow);
  };

  useEffect(() => {
    if (inputVal?.credits) {
      const calcCost = (inputVal?.credits * 15) / 100;

      setCost(calcCost);
    } else {
      setCost(0);
    }
  }, [inputVal?.credits]);

  return (
    <>
      <LinkButton
        onClick={() => onCloseHandler()}
        className={`signin-btn sub-plan`}
        title="Buy Credits"
      />
      <Modal show={isShow} centered>
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
                pattern="[1-9]"
              />
            </div>
            <div className="cost-title">
              <div>Cost </div>
              <div>€{cost.toFixed(2)}</div>
            </div>

            <Text type="error" text={error} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <LinkButton
            onClick={() => handlePayForCredits()}
            className={`signin-btn `}
            title="Pay"
            isDisable={loading}
          />
          <CancelButton title="Cancel" onClick={() => onCloseHandler()} />
        </Modal.Footer>
        <LoadingCover show={loading} />
      </Modal>
    </>
  );
}
export default BuyCredits;
