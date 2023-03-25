import React, { useEffect, useState } from "react";
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
import { useAuth } from "../../../../Context/AuthProvider";

const SavedCards = () => {
  const [emptyCard, setEmptyCard] = useState(false);
  const [defaultCardId, setDefaultCardId] = useState("");
  const { creditCardList, setIsAddingCard } = useAuth();

  useEffect(() => {
    if (creditCardList?.length === 0) {
      setEmptyCard(true);
    } else {
      setEmptyCard(false);
      creditCardList.filter((c) => c.isDefault && setDefaultCardId(c.id));
    }
  }, [creditCardList]);

  const handleAddCard = () => {
    setIsAddingCard(true);
    document.getElementById("addNewCard").click();
  };

  return (
    <Wrapper>
      <HeaderTitle>SAVED CARDS</HeaderTitle>
      <HorizontalLine />
      <CardSection>
        {emptyCard && <EmptyCard>No saved card</EmptyCard>}
        {!emptyCard &&
          creditCardList?.length > 0 &&
          creditCardList.map((card) => {
            return (
              <CardWrp>
                <img src="assets/img/profile/visaCard.png" alt="" />
                <CheckBoxWrp>
                  <input
                    type="checkbox"
                    id="check1"
                    checked={defaultCardId === card.id}
                    defaultChecked={card?.isDefault}
                    onChange={() => setDefaultCardId(card.id)}
                  />
                </CheckBoxWrp>
              </CardWrp>
            );
          })}
        <AddCard onClick={() => handleAddCard()}>
          <img src="assets/img/profile/plus.png" alt="" />
          <SmallText>Add new</SmallText>
        </AddCard>
      </CardSection>

      {emptyCard && (
        <EmptyCardWrp>
          <EmptyCard>No card details</EmptyCard>
        </EmptyCardWrp>
      )}
      {!emptyCard &&
        creditCardList?.length > 0 &&
        creditCardList.map((creditCard) => {
          return (
            <>
              <CardDetails>
                <CardTitle>Card details</CardTitle>
                <ActionWrp>
                  <CardTitle>Remove</CardTitle>
                  <SmallVerticalLine />
                  <EditButton>Edit</EditButton>
                </ActionWrp>
              </CardDetails>

              <CardDetailsContent>
                <CardDetails>
                  <ActionWrp>
                    <SmallText>{creditCard?.cardName}</SmallText>
                    <SmallVerticalLine />
                    <SmallTextGray>Credit card</SmallTextGray>
                  </ActionWrp>
                  {creditCard?.isDefault && (
                    <SmallTextTopaz>Default</SmallTextTopaz>
                  )}
                </CardDetails>
                <CardNumber>
                  <SmallTextGray>****</SmallTextGray>
                  <SmallTextGray>-</SmallTextGray>
                  <SmallTextGray>****</SmallTextGray>
                  <SmallTextGray>-</SmallTextGray>
                  <SmallTextGray>****</SmallTextGray>
                  <SmallTextGray>-</SmallTextGray>
                  <SmallTextGray>{creditCard?.last4}</SmallTextGray>
                </CardNumber>
                <CardDetails>
                  <ActionWrp>
                    <SmallText>Expiry date:</SmallText>
                    <SmallTextGray>
                      {creditCard?.expiryDate || "-"}{" "}
                    </SmallTextGray>
                    <SmallVerticalLine />
                    <SmallText>CVV:</SmallText>
                    <SmallTextGray>***</SmallTextGray>
                  </ActionWrp>
                  <img src="assets/img/profile/visa-credit-card.png" alt="" />
                </CardDetails>
              </CardDetailsContent>
            </>
          );
        })}
    </Wrapper>
  );
};

export default SavedCards;
