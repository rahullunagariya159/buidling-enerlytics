import React, { useState } from "react";
import { HeaderTitle, HorizontalLine, Wrapper } from "../personalDetails/style";
import {
  ActionWrp,
  AddCard,
  CardDetails,
  CardDetailsContent,
  CardNumber,
  CardSection,
  CardTitle,
  CardWrp,
  CheckBoxWrp,
  EditButton,
  EmptyCard,
  EmptyCardWrp,
  SmallText,
  SmallTextGray,
  SmallTextTopaz,
  SmallVerticalLine,
} from "./style";

const SavedCards = () => {
  const [newCard, setNewCard] = useState(false);
  const [emptyCard, setEmptyCard] = useState(false);
  return (
    <Wrapper>
      <HeaderTitle>SAVED CARDS</HeaderTitle>
      <HorizontalLine />
      <CardSection>
        {newCard && <EmptyCard>No saved card</EmptyCard>}
        {!newCard && (
          <CardWrp>
            <img src="assets/img/profile/visaCard.png" alt="" />
            <CheckBoxWrp>
              <input type="checkbox" id="check1" />
            </CheckBoxWrp>
          </CardWrp>
        )}
        <AddCard onClick={() => setNewCard(!newCard)}>
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
      {emptyCard && (
        <EmptyCardWrp>
          <EmptyCard>No card details</EmptyCard>
        </EmptyCardWrp>
      )}
      {!emptyCard && (
        <CardDetailsContent>
          <CardDetails>
            <ActionWrp>
              <SmallText>Harry James Potter</SmallText>
              <SmallVerticalLine />
              <SmallTextGray>Credit card</SmallTextGray>
            </ActionWrp>
            <SmallTextTopaz>Default</SmallTextTopaz>
          </CardDetails>
          <CardNumber>
            <SmallTextGray>****</SmallTextGray>
            <SmallTextGray>-</SmallTextGray>
            <SmallTextGray>****</SmallTextGray>
            <SmallTextGray>-</SmallTextGray>
            <SmallTextGray>****</SmallTextGray>
            <SmallTextGray>-</SmallTextGray>
            <SmallTextGray>0000</SmallTextGray>
          </CardNumber>
          <CardDetails>
            <ActionWrp>
              <SmallText>Expiry date:</SmallText>
              <SmallTextGray>01/25</SmallTextGray>
              <SmallVerticalLine />
              <SmallText>CVV:</SmallText>
              <SmallTextGray>***</SmallTextGray>
            </ActionWrp>
            <img src="assets/img/profile/visa-credit-card.png" alt="" />
          </CardDetails>
        </CardDetailsContent>
      )}
      {!emptyCard && (
        <CardDetailsContent>
          <CardDetails>
            <ActionWrp>
              <SmallText>Harry James Potter</SmallText>
              <SmallVerticalLine />
              <SmallTextGray>Credit card</SmallTextGray>
            </ActionWrp>
            <SmallTextTopaz>Default</SmallTextTopaz>
          </CardDetails>
          <CardNumber>
            <SmallTextGray>****</SmallTextGray>
            <SmallTextGray>-</SmallTextGray>
            <SmallTextGray>****</SmallTextGray>
            <SmallTextGray>-</SmallTextGray>
            <SmallTextGray>****</SmallTextGray>
            <SmallTextGray>-</SmallTextGray>
            <SmallTextGray>0000</SmallTextGray>
          </CardNumber>
          <CardDetails>
            <ActionWrp>
              <SmallText>Expiry date:</SmallText>
              <SmallTextGray>01/25</SmallTextGray>
              <SmallVerticalLine />
              <SmallText>CVV:</SmallText>
              <SmallTextGray>***</SmallTextGray>
            </ActionWrp>
            <img src="assets/img/profile/visa-credit-card.png" alt="" />
          </CardDetails>
        </CardDetailsContent>
      )}
    </Wrapper>
  );
};

export default SavedCards;
