import { useEffect } from "react";

const useEnterKeyListener = ({ querySelectorToExecuteClick }) => {
  useEffect(() => {
    const handlePressEnter = () => {
      const mouseClickEvents = ["mousedown", "click", "mouseup"];
      function simulateMouseClick(element) {
        mouseClickEvents?.forEach((mouseEventType) =>
          element?.dispatchEvent(
            new MouseEvent(mouseEventType, {
              view: window,
              bubbles: true,
              cancelable: true,
              buttons: 1,
            })
          )
        );
      }

      var element = document?.querySelector(querySelectorToExecuteClick);
      if (element) simulateMouseClick(element);
    };

    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        handlePressEnter();
      }
    };

    document?.addEventListener("keydown", listener);

    return () => {
      document?.removeEventListener("keydown", listener);
    };
  }, [querySelectorToExecuteClick]);
};

export default useEnterKeyListener;
