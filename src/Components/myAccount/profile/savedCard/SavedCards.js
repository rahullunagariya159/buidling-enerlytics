import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HeaderTitle, HorizontalLine, Wrapper } from "../personalDetails/style";
import {
  ActionWrp,
  AddCard,
  CardDetails,
  CardDetailsContent,
  CardNumber,
  CardNumberText,
  CardSection,
  CardTitle,
  CardWrp,
  CheckBoxWrp,
  CvvText,
  CvvWrp,
  EditButton,
  EmptyCard,
  EmptyCardWrp,
  SmallText,
  SmallTextGray,
  SmallTextGrayTitle,
  SmallTextTopaz,
  SmallVerticalLine,
  SmallRemoveText,
} from "./style";
import { useAuth } from "../../../../Context/AuthProvider";
import {
  makeDefaultCard,
  removeCard,
} from "../../../Services/UserProfileService";
import { somethingWentWrongError } from "../../../../Constants";
import LoadingCover from "../../../LoadingCover";

const SavedCards = () => {
  const [emptyCard, setEmptyCard] = useState(false);
  const [defaultCardId, setDefaultCardId] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const { creditCardList, setIsAddingCard, userId, getCreditCards } = useAuth();

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
    document.getElementById("addNewCardModal").click();
  };

  const handleMakeDefaultCard = async (id) => {
    setDefaultCardId(id);
    setShowLoader(true);
    let defaultCardPayload = {
      id: id,
      userId,
    };
    await makeDefaultCard(defaultCardPayload)
      .then((response) => {
        if (response?.status === 200 && response?.data?.msg) {
          getCreditCards(userId);
          // toast.success("Card made default successfully");
        }
      })
      .catch((error) => {
        console.log({ error });
        toast.error(error?.message || somethingWentWrongError);
      })
      .finally(() => {
        setShowLoader(false);
      });
  };

  const handleRemoveCard = async (id) => {
    setDefaultCardId(id);
    setShowLoader(true);
    let defaultCardPayload = {
      id: id,
      userId,
    };
    await removeCard(defaultCardPayload)
      .then((response) => {
        if (response?.status === 200 && response?.data?.msg) {
          getCreditCards(userId);
          toast.success("Card Removed successfully");
        }
      })
      .catch((error) => {
        toast.error(error?.message || somethingWentWrongError);
      })
      .finally(() => {
        setShowLoader(false);
      });
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
              <CardWrp
                onClick={() => {
                  !card?.isDefault && handleMakeDefaultCard(card.id);
                }}
              >
                <img src="assets/img/profile/visaCard.png" alt="" />
                <CheckBoxWrp className="checkBoxOutline">
                  <input
                    type="checkbox"
                    id="check1"
                    checked={defaultCardId === card.id}
                    // defaultChecked={card?.isDefault}
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
                  {!creditCard?.isDefault && (
                    <SmallRemoveText
                      onClick={() => handleRemoveCard(creditCard.id)}
                    >
                      Remove
                    </SmallRemoveText>
                  )}
                  {/* <SmallVerticalLine /> */}
                  {/* <EditButton>Edit</EditButton> */}
                </ActionWrp>
              </CardDetails>

              <CardDetailsContent>
                <CardDetails>
                  <ActionWrp>
                    <SmallText>{creditCard?.cardName}</SmallText>
                    <SmallVerticalLine />
                    <SmallTextGrayTitle>Credit card</SmallTextGrayTitle>
                  </ActionWrp>
                  {creditCard?.isDefault && (
                    <SmallTextTopaz>Default</SmallTextTopaz>
                  )}
                </CardDetails>
                <CardNumber>
                  <CardNumberText>
                    <SmallTextGray>****</SmallTextGray>
                  </CardNumberText>
                  <SmallTextGray>-</SmallTextGray>
                  <CardNumberText>
                    <SmallTextGray>****</SmallTextGray>
                  </CardNumberText>
                  <SmallTextGray>-</SmallTextGray>
                  <CardNumberText>
                    <SmallTextGray>****</SmallTextGray>
                  </CardNumberText>
                  <SmallTextGray>-</SmallTextGray>
                  <SmallTextGray>{creditCard?.last4}</SmallTextGray>
                </CardNumber>
                <CardDetails>
                  <ActionWrp>
                    <CvvWrp>
                      <SmallText>Expiry date:</SmallText>
                      <SmallTextGrayTitle>
                        {creditCard?.expiryDate || "-"}{" "}
                      </SmallTextGrayTitle>
                    </CvvWrp>
                    <CvvWrp>
                      <SmallText>CVV:</SmallText>
                      <CvvText>
                        <SmallTextGray>****</SmallTextGray>
                      </CvvText>
                    </CvvWrp>
                  </ActionWrp>
                  <img src="assets/img/profile/visa-credit-card.png" alt="" />
                </CardDetails>
              </CardDetailsContent>
            </>
          );
        })}

      <LoadingCover show={showLoader} />
    </Wrapper>
  );
};

export default SavedCards;
