import styled from "styled-components";

export const HeaderWrapper = styled.div`
  min-height: 99px;
  margin: 0 36px;
  border-bottom: 1px solid #f1f1f1;
  position: sticky;
  top: 96px;
  z-index: 999;
  background-color: white;
`;

export const PathTitle = styled.div`
  font: normal normal 300 10px/16px Poppins;
  letter-spacing: 0px;
  color: #bfbfbf;
  padding-top: 1rem;
`;

export const Title = styled.div`
  font: normal normal bold 24px/23px Poppins;
  letter-spacing: 0.72px;
  color: #1c1c1c;
  margin-top: 27px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 0 36px;
  gap: 1rem;
`;

export const SidebarMenu = styled.div`
  min-width: 252px;
  border-right: 1px solid #f1f1f1;
  position: fixed;
  height: 100%;
`;

export const SettingTitle = styled.div`
  min-height: 81px;
  display: flex;
  align-items: center;
`;

export const MenuItems = styled.div`
  height: 36px;
  background: ${(props) => (props.active === "active" ? "#f1f1f1" : "#fff")};
  font-size: 14px;
  line-height: 21px;
  font-family: "Poppins";
  font-weight: ${(props) => (props.active === "active" ? "500" : "400")};
  letter-spacing: 0px;
  color: ${(props) => (props.active === "active" ? "#f15a24" : "#C2C2C2")};
  cursor: pointer;
  padding: 8px 13px;
  border-right: ${(props) =>
    props.active === "active" ? "3px solid #F15A24" : ""};
  display: flex;
  align-items: center;
`;

export const TextWrp = styled.div`
  font: normal normal bold 12px/18px Poppins;
  letter-spacing: 0px;
  color: #1c1c1c;
`;

export const RightContent = styled.div`
  padding: 40px 40px 40px 292px;
  width: 100%;
`;
