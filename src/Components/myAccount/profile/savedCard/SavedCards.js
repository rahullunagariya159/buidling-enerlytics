import React from "react";
import { HeaderTitle, HorizontalLine, Wrapper } from "../personalDetails/style";
import {
  ActionWrp,
  AddCard,
  CardDetails,
  CardDetailsContent,
  CardSection,
  CardTitle,
  EditButton,
  EmptyCard,
  SmallText,
  SmallVerticalLine,
} from "./style";

const SavedCards = () => {
  return (
    <Wrapper>
      <HeaderTitle>SAVED CARDS</HeaderTitle>
      <HorizontalLine />
      <CardSection>
        <EmptyCard>No saved card</EmptyCard>
        <AddCard>
          <img src="assets/img/profile/plus.png" alt="" />
          <SmallText>Add new</SmallText>
        </AddCard>
      </CardSection>
      <CardDetails>
        <CardTitle>Card details</CardTitle>
        <ActionWrp>
          <CardTitle>Remove</CardTitle>
          <SmallVerticalLine />
          <EditButton>Edit</EditButton>
        </ActionWrp>
      </CardDetails>
      <CardDetailsContent>
        <EmptyCard>No card details</EmptyCard>
      </CardDetailsContent>
    </Wrapper>
  );
};

export default SavedCards;
