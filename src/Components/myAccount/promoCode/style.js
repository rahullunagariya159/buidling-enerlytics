import styled from "styled-components";

export const CardWrp = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #f1f1f1;
  border-radius: 4px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px 0;
`;

export const FilterDropdown = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin: 0;
  span {
    font: normal normal 500 12px/12px Poppins;
    letter-spacing: 0px;
    color: #8d8d8d;
    margin-bottom: 2px;
  }
  button {
    font: normal normal 600 13px/16px Poppins;
    letter-spacing: 0px;
    color: #1c1c1c;
    background-color: transparent;
    cursor: pointer;
  }
`;
export const TabWrp = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  a.nav-link {
    display: flex;
    color: #1c1c1c;
    line-height: 1.5rem;
    text-decoration: none;
    padding: 0.8rem 0rem;
    font: normal normal 600 13px/18px Poppins;
    &.selected {
      border-bottom: 2px solid #f7931e;
      color: #f7931e;
    }
  }
`;
export const FilterWrp = styled.div`
  position: relative;
`;
export const VerticalLine = styled.div`
  width: 0px;
  height: 24px;
  border: 1px solid #f1f1f1;
`;
export const HorizontalLineDropdown = styled.div`
  width: 100%;
  height: 1px;
  border: 1px solid #f1f1f1;
`;
export const ContentCard = styled.div`
  display: flex;
  gap: 40px;
  width: 100%;
  flex-wrap: wrap;
  margin-top: 30px;
`;
export const ItemsCard = styled.div`
  padding: 9px 20px;
  min-width: 227px;
  min-height: 110px;
  background: transparent
    linear-gradient(
      245deg,
      ${(props) => props.color.c1} 0%,
      ${(props) => props.color.c2} 100%
    )
    0% 0% no-repeat padding-box;
  border-radius: 6px;
`;
export const PromoCard = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  img {
    margin-top: 10px;
    width: 37px;
    height: 37px;
  }
`;
export const PromoCardCredit = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    font: normal normal 400 13px/18px Poppins;
    letter-spacing: 0px;
    color: #ffffff;
  }
`;
export const PromoTitle = styled.div`
  display: flex;
  flex-direction: column;
  span {
    font: normal normal 600 26px/39px Poppins;
    letter-spacing: 0px;
    color: #ffffff;
  }
  p {
    font: normal normal 400 13px/18px Poppins;
    letter-spacing: 0px;
    color: #dcdcdc;
  }
`;
export const BottomWrp = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 6px #0000001a;
  border-radius: 6px;
  padding: 11px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 216px;
  font: normal normal 600 12px/16px Poppins;
  letter-spacing: 0px;
  color: #1c1c1c;
  cursor: pointer;
`;
export const BottomWrpTab = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 6px #0000001a;
  border-radius: 6px;
  padding: 11px 10px;
  display: flex;
  align-items: center;
  min-width: 216px;
  justify-content: space-between;
  span {
    color: #b9b9b9;
  }
  p {
    font: normal normal 600 12px/16px Poppins;
    letter-spacing: 0px;
    color: #1c1c1c;
    margin: 0;
  }
`;
export const CardInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
export const PlusCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 227px;
  height: 110px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 2px #00000029;
  border: 1px solid #f1f1f1;
  border-radius: 6px;
  cursor: pointer;
`;
