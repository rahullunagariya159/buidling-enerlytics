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
    max-width: 274px;
    height: 40px;
    background: #ffffff 0% 0% no-repeat padding-box;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
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
