import styled from "styled-components";
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-bottom: 40px;
`;
export const FormSection = styled.div``;
export const Title = styled.div`
  font: normal normal bold 26px/39px Poppins;
  letter-spacing: 0px;
  color: #00bec1;
`;
export const SmallLabel = styled.div`
  font: normal 500 18px/32px Poppins;
  letter-spacing: 0px;
  color: #1c1c1c;
`;
export const CardWrp = styled.div`
  min-width: 1024px;
  min-height: 144px;
  background: #f1f1f1 0% 0% no-repeat padding-box;
  border-radius: 6px;
  display: flex;
  padding: 24px;
  gap: 50px;
  align-items: center;
  justify-content: space-between;
`;
export const InfoCard = styled.div`
  display: flex;
  gap: 70px;
`;
export const UpgradeBtn = styled.div`
  width: 155px;
  height: 44px;
  background: transparent linear-gradient(90deg, #f7931e 0%, #f15a24 100%) 0% 0%
    no-repeat padding-box;
  border-radius: 4px;
`;
export const ActiveCard = styled.div`
  display: flex;
  justify-content: space-between;
  width: 246px;
  height: 95px;
  background: transparent linear-gradient(111deg, #f7931e 0%, #f15a24 100%) 0%
    0% no-repeat padding-box;
  border-radius: 6px;
  padding: 5px 0 5px 25px;
  color: "#ffffff";
`;
export const ActivePlanContent = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  justify-content: center;
`;
export const YellowLabel = styled.div`
  font: normal normal 400 12px/18px Poppins;
`;
export const YellowLargeLabel = styled.div`
  font: normal normal 600 28px/42px Poppins;
`;
export const PlanLogo = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 68px;
    height: 68px;
  }
`;
export const GrayLabel = styled.div`
  font: normal normal normal 12px/18px Poppins;
  letter-spacing: 0px;
  color: #8d8d8d;
`;
export const CardNumber = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;
export const Items = styled.div`
  display: flex;
  gap: 2px;
  flex-direction: column;
`;
export const SmallTextBlack = styled.span`
  letter-spacing: 0px;
  color: #1c1c1c;
  font-size: 16px;
  font-weight: 500;
  font-family: poppins;
`;
export const TableWrapper = styled.span`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
export const TableHeader = styled.span`
  display: flex;
  justify-content: space-between;
  position: relative;
`;
export const SmallGrayLabel = styled.span`
  font: normal normal 400 14px/21px Poppins;
  letter-spacing: 0px;
  color: #c2c2c2;
`;
export const TitleWrp = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: end;
  img {
    cursor: pointer;
  }
  label {
    font: normal normal 600 18px/27px Poppins;
    letter-spacing: 0px;
    color: #1c1c1c;
  }
`;
