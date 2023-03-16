import styled from "styled-components";
export const CardSection = styled.div`
  display: flex;
  margin: 30px 0 40px 0;
  gap: 100px;
  align-items: center;
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
export const CardDetailsContent = styled.div`
  height: 111px;
  background: #f9f9f9 0% 0% no-repeat padding-box;
  border-radius: 4px;
  margin-top: 5px;
  padding-left: 30px;
  display: flex;
  align-items: center;
`;
