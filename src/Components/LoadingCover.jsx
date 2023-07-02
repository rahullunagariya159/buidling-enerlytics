import React from "react";
import styled from "styled-components";
import { rgba } from "polished";

const LoadingFadedDiv = styled.div`
  position: ${(props) => (props.isfull ? "fixed" : "absolute")};
  width: 100%;
  height: 100%;
  z-index: 2080;
  left: 0;
  top: 0;
  display: ${(props) => (props.show ? "block" : "none")};

  background: ${rgba("#fff", 0.3)};
  opacity: 1;
  visibility: visible;
  transition: 0.3s linear;
  img {
    width: 30px;
    height: 30px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 50%) scale(2);
  }
`;

const LoadingCover = ({ show, isFullScreen = true }) => (
  <LoadingFadedDiv show={show} isfull={isFullScreen}>
    <img src="assets/img/icon-loading-primary.gif" alt="" />
  </LoadingFadedDiv>
);

export default LoadingCover;
