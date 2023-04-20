import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { ReactSession } from "react-client-session";
import CancelButton from "../CancelButton";
import LinkButton from "../LinkButton";
import { useAuth } from "../../Context/AuthProvider";
import { addProjectConfiguration } from "../Services/ProjectServices";
import { somethingWentWrongError } from "../../Constants";
import Text from "../Text";
import LoadingCover from "../LoadingCover";

const CreateConfigurationPopup = ({
  isShow,
  onCloseModalHandler,
  onCreateNewConfigModalHandler,
}) => {
  const [inputVal, setInputVal] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { userId, getUserInfo } = useAuth();

  const onChangeHandler = (evt) => {
    setError("");
    const value = evt.target.value;
    setInputVal({
      ...inputVal,
      [evt.target.name]: value,
    });
  };

  const onCloseHandler = () => {
    setInputVal("");
    setError("");
    onCloseModalHandler();
  };

  const handleCreateConfiguration = async () => {
    setError("");
    if (!inputVal?.configName) {
      setError("Please enter a number of credits");
      return false;
    }

    setLoading(true);

    const projectID = await ReactSession.get("project_id");

    const newConfigPayload = {
      userId: userId,
      projectId: projectID,
      configurationName: inputVal?.configName,
    };

    await addProjectConfiguration(newConfigPayload)
      .then(async (response) => {
        if (response?.status === 200 && response?.data?.msg) {
          await ReactSession.set(
            "configuration_id",
            response?.data?.configurationId,
          );
          onCreateNewConfigModalHandler();
          onCloseHandler();
          // toast.success("New configuration created successfully");
        }
      })
      .catch((error) => {
        setError(error?.response?.data?.msg || somethingWentWrongError);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Modal show={isShow} centered>
        <Modal.Header closeButton onClick={() => onCloseHandler()}>
          <Modal.Title>Create New Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="main-credits">
            <div className="items-title">
              <div>Configuration Name</div>
              <input
                type="text"
                placeholder="Enter name"
                onChange={onChangeHandler}
                name="configName"
                id="configName"
                value={inputVal?.configName}
              />
            </div>

            <Text type="error" text={error} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <LinkButton
            onClick={() => handleCreateConfiguration()}
            className={`signin-btn `}
            title="Create"
            isDisable={loading}
          />
          <CancelButton title="Cancel" onClick={() => onCloseHandler()} />
        </Modal.Footer>
        <LoadingCover show={loading} />
      </Modal>
    </>
  );
};
export default CreateConfigurationPopup;
