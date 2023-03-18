import styled from "styled-components";
export const CardSection = styled.div`
  display: flex;
  margin: 30px 0 40px 0;
  gap: 28px;
  align-items: center;
  max-width: 508px;
  word-wrap: break-word;
`;
export const EmptyCard = styled.div`
  font: normal normal medium 16px/25px Poppins;
  letter-spacing: 0px;
  color: #dcdcdc;
`;
export const SmallText = styled.div`
  font: normal normal medium 10px/16px Poppins;
  letter-spacing: 0px;
  color: #1c1c1c;
`;
export const AddCard = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 7px;
  margin-left: 50px;
  img {
    width: 23px;
    height: 23px;
  }
`;
export const CardDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const CardTitle = styled.div`
  font: normal normal medium 12px/18px Poppins;
  letter-spacing: 0px;
  color: #8d8d8d;
`;
export const ActionWrp = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;
export const SmallVerticalLine = styled.div`
  width: 0px;
  height: 13px;
  border: 1px solid #dcdcdc;
`;
export const EditButton = styled.div`
  text-decoration: underline;
  font: normal normal medium 10px/16px Poppins;
  letter-spacing: 0px;
  color: #b9b9b9;
`;
export const EmptyCardWrp = styled.div`
  min-height: 111px;
  background: #f9f9f9 0% 0% no-repeat padding-box;
  border-radius: 4px;
  margin-top: 5px;
  padding-left: 30px;
  display: flex;
  align-items: center;
`;
export const CardWrp = styled.div`
  position: relative;
  img {
    width: 109px;
    height: 70px;
  }
`;
export const CheckBoxWrp = styled.div`
  width: 14px;
  height: 14px;
  /* background: #ffffff 0% 0% no-repeat padding-box;
  border: 2px solid #8d8d8d;
  border-radius: 4px; */
  position: absolute;
  right: -6px;
  top: -10px;
`;

export const CardDetailsContent = styled.div`
  padding: 15px;
  background: #f9f9f9 0% 0% no-repeat padding-box;
  border-radius: 4px;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 40px;
`;
export const SmallTextGray = styled.span`
  letter-spacing: 0px;
  color: #b9b9b9;
  font-size: 16px;
  font-weight: 500;
  font-family: poppins;
`;
export const SmallTextTopaz = styled.div`
  font: normal normal medium 10px/16px Poppins;
  letter-spacing: 0px;
  color: #00bec1;
`;
export const CardNumber = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;
