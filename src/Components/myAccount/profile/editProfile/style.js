import styled from "styled-components";

export const MainWrapper = styled.div``;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HorizontalLine = styled.div`
  width: auto;
  height: 0px;
  border: 1px solid #f1f1f1;
  margin-top: 20px;
`;

export const UpdateWrp = styled.div`
  padding-left: 25px;
`;
export const Title = styled.div`
  font: normal normal bold 26px/39px Poppins;
  letter-spacing: 0px;
  color: #00bec1;
  padding: 50px 0 0 0;
`;
export const FormSection = styled.div``;

export const RowWrp = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 20px;
`;
export const Items = styled.div`
  position: relative;
  display: flex;
  gap: 7px;
  flex-direction: column;
  Label {
    font: normal normal 300 12px/18px Poppins;
    letter-spacing: 0px;
    color: #8d8d8d;
  }
  input {
    font: normal normal 600 12px/18px Poppins;
    letter-spacing: 0px;
    color: #1c1c1c;
    padding: 12px 20px;
    min-width: 274px;
    height: 40px;
    background: #ffffff 0% 0% no-repeat padding-box;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
  }
  select {
    font: normal normal 600 12px/18px Poppins;
    letter-spacing: 0px;
    color: #1c1c1c;
    padding: 5px 20px;
    min-width: 274px;
    height: 40px;
    background: #ffffff 0% 0% no-repeat padding-box;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    -webkit-appearance: none;
    -moz-appearance: none;
    display: inline-block;
    background-image: url("assets/img/profile/dropDownArrow.svg");
    background-position: calc(100% - 20px) calc(1em + 2px),
      calc(100% - 15px) calc(1em + 2px), 100% 0;
    background-size: 11px 8px;
  }
`;
export const SectionTitle = styled.div`
  font: normal normal 700 14px/21px Poppins;
  letter-spacing: 0px;
  color: #1c1c1c;
  text-transform: uppercase;
  padding: 50px 0 15px 0;
`;
export const DecoratedLabel = styled.div`
  text-decoration: underline;
  font: normal normal medium 12px/18px Poppins;
  letter-spacing: 0px;
  color: #1c1c1c;
  margin-top: 10px;
`;
