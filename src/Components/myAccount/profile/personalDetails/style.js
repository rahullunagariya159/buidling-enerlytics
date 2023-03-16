import styled from "styled-components";

export const Wrapper = styled.div`
  min-width: 501px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #f1f1f1;
  border-radius: 6px;
  padding: 25px;
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const HeaderTitle = styled.div`
  font: normal normal 600 14px/21px Poppins;
  letter-spacing: 0px;
  color: #00bec1;
  text-transform: uppercase;
`;
export const EditProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  img {
    width: 16px;
    height: 16px;
  }
`;
export const DecorationText = styled.div`
  text-decoration: underline;
  font: normal normal medium 12px/18px Poppins;
  letter-spacing: 0px;
  color: #1c1c1c;
`;
export const HorizontalLine = styled.div`
  width: auto;
  height: 0px;
  border: 1px solid #f1f1f1;
  margin-top: 20px;
`;
export const PersonalInfo = styled.div`
  display: flex;
  margin: 30px 0 40px 0;
  gap: 100px;
`;
export const ItemsWrp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
export const ValuesWrp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
export const GrayLabel = styled.div`
  font: normal normal normal 12px/18px Poppins;
  letter-spacing: 0px;
  color: #8d8d8d;
`;
export const ValueLabel = styled.div`
  font: normal normal medium 12px/18px Poppins;
  letter-spacing: 0px;
  color: #1c1c1c;
`;
export const UpgradeWrp = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  img {
    width: 9px;
    height: 9px;
  }
`;
export const UpgradeButton = styled.div`
  font: normal normal medium 10px/16px Poppins;
  letter-spacing: 0px;
  color: #00ade4;
  display: flex;
  gap: 5px;
  cursor: pointer;
  align-items: center;
`;
