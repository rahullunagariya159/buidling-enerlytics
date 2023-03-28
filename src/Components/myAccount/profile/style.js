import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`;
export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;
export const ProfileWrp = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
`;
export const UserLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const BlueLabel = styled.div`
  font: normal normal medium 12px/18px Poppins;
  letter-spacing: 0px;
  color: #00ade4;
  cursor: pointer;
  margin-top: 11px;
`;
export const Label = styled.div`
  font: normal normal 500 13px/18px Poppins;
  letter-spacing: 0px;
  color: #a2a2a2;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 180px;
`;
export const ImageWrp = styled.div`
  img {
    width: 106px;
    height: 106px;
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #0000001a;
    border: 2px solid #f1f1f1;
    border-radius: 100%;
  }
`;
export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
export const UserName = styled.div`
  font: normal normal 600 26px/39px Poppins;
  letter-spacing: 0px;
  color: #1c1c1c;
`;
export const Role = styled.div`
  font: normal normal 500 14px/18px Poppins;
  letter-spacing: 0px;
  color: #1c1c1c;
`;
export const VerticalLine = styled.div`
  width: 0px;
  height: 59px;
  border: 1px solid #f1f1f1;
`;
export const PlanVerticalLine = styled.div`
  width: 0px;
  height: 144px;
  border: 1px solid #f1f1f1;
`;
export const SmallLabel = styled.div`
  font: normal normal 500 13px/18px Poppins;
  letter-spacing: 0.24px;
  color: #1c1c1c;
`;
export const CreditMainWrp = styled.div`
  display: flex;
  gap: 20px;
`;
export const CreditWrp = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
export const ContactHeader = styled.div`
  display: flex;
  gap: 75px;
  align-items: center;
`;
export const CreditLabel = styled.div`
  font: normal normal 600 18px/27px Poppins;
  letter-spacing: 0px;
  color: #ffbb1c;
`;
export const ContactWrp = styled.div`
  display: flex;
  gap: 25px;
`;
export const LocationWrp = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  img {
    width: 11px;
    height: 12px;
  }
`;
export const PhoneWrp = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  img {
    width: 13px;
    height: 12px;
  }
`;
export const EmailWrp = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  img {
    width: 12px;
    height: 8px;
  }
`;
export const PlanInfo = styled.div`
  display: flex;
  gap: 28px;
  align-items: center;
`;
export const PlanLogo = styled.div`
  img {
    width: 126px;
    height: 126px;
  }
`;
export const ActiveCard = styled.div`
  background: ${(props) =>
    props.plan
      ? "#ffffff 0% 0% no-repeat padding-box;"
      : "transparent linear-gradient(117deg, #f7931e 0%, #f15a24 100%) 0% 0% no-repeat padding-box"};
  border: 1px solid #f15a24;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  width: 246px;
  height: 128px;
`;
export const ActivePlanContent = styled.div`
  padding: 21px 0 18px 13px;
`;
export const YellowLabel = styled.div`
  font: normal normal 500 12px/18px Poppins;
  letter-spacing: 0.24px;
  color: ${(props) => (props.plan ? "#f15a24" : "#ffffff")};
`;
export const YellowLargeLabel = styled.div`
  font: normal normal 600 28px/42px Poppins;
  letter-spacing: 0px;
  color: ${(props) => (props.plan ? "#f15a24" : "#ffffff")};
`;
export const UnderlineText = styled.div`
  text-decoration: underline;
  font: normal normal normal 10px/16px Poppins;
  letter-spacing: 0.2px;
  color: #1c1c1c;
  margin-top: 15px;
  cursor: pointer;
`;
export const ProfileContent = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
`;
