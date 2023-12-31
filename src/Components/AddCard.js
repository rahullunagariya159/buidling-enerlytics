import React, { useState } from "react";
import { ReactSession } from "react-client-session";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { validateInput } from "../config";
import { useAuth } from "../Context/AuthProvider";
import LoadingCover from "./LoadingCover";
import Button from "./Button";

function AddCard(props) {
  const [selectedCard, setSelectedCard] = useState("credit");
  const [selectedCardName, setSelectedCardName] = useState("Credit Card");
  const [cardType, setCardType] = useState("");
  const [cardName, setCardName] = useState("");
  const { isAddingCard, setIsAddingCard } = useAuth();

  const { getPaymentData } = props;

  const inputStyle = {
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "0px",
    color: "#1C1C1C",
    border: "1px solid #DCDCDC",
    padding: "10px 20px",
    width: "274px",
    display: "inline-block",
    lineHeight: "18px",
  };

  const stripe = useStripe();
  const elements = useElements();

  const handleChange = async (e) => {
    let displayError = document.getElementById("card-errors");
    displayError.textContent = "";

    if (e.elementType === "cardNumber") {
      if (e.complete) {
        setCardType(e.brand);
      } else if (e.error) {
        setCardType("");

        if (e.error) {
          displayError.textContent = e.error.message;
        } else {
          displayError.textContent = "";
        }
      } else {
        setCardType("");
      }
    }

    // if (e.elementType === "cardExpiry") {}

    // if (e.elementType === "cardCvc") {}
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cardNumber = elements.getElement(CardNumberElement);
    const cardExpiry = elements.getElement(CardExpiryElement);
    const cardCvv = elements.getElement(CardCvcElement);

    const isInvalidCardNumber = cardNumber._invalid;
    const isEmptyCardNumber = cardNumber._empty;

    const isInvalidCardExpiry = cardExpiry._invalid;
    const isEmptyCardExpiry = cardExpiry._empty;

    const isInvalidCardCvv = cardCvv._invalid;
    const isEmptyCardCvv = cardCvv._empty;

    let cardNameElm = document.getElementById("cardName");
    let checkCName = validateInput(cardNameElm);

    const isValidCardNumber = !(isEmptyCardNumber || isInvalidCardNumber);
    const isValidCardExpiry = !(isEmptyCardExpiry || isInvalidCardExpiry);
    const isValidCardCvv = !(isEmptyCardCvv || isInvalidCardCvv);

    if (
      checkCName &&
      isValidCardNumber &&
      isValidCardExpiry &&
      isValidCardCvv
    ) {
      props.handleAddCardSpinner(true);

      const { token } = await stripe.createToken(cardNumber);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumber,
        card: cardExpiry,
        card: cardCvv,
      });

      await getPaymentData({
        selectedCard: selectedCard,
        cardType: cardType,
        name: cardName,
        error: error,
        paymentMethod: paymentMethod,
        token: token,
      });
    }
  };

  const selectedCardFn = (cardId, cardName) => {
    setSelectedCard(cardId);
    setSelectedCardName(cardName);
  };

  const handleCloseAddCard = () => {
    // document.getElementById("cardNumber").value = "";
    // document.getElementById("cardExpiry").value = "";
    // document.getElementById("cardCvv").value = "";
    // document.getElementById("cardName").value = "";
    setIsAddingCard(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="credit-card-detal">
          <div className="RELIABLE-grid">
            <h1 className="SECURE-tit">
              <span className="bord-SECUR">SECUR</span>E AND RELIABLE
            </h1>
            <p className="your-crediet">Add your credit card details</p>
          </div>
          <div className="Card-drid-24px">
            <div className="Card-type-grid">
              <div>
                <p className="Card-type-tit">Card type</p>
              </div>
              <label className="dropdown awdw">
                <div className="dd-button">{selectedCardName}</div>
                <input type="checkbox" className="dd-input" id="test" />
                <ul className="dd-menu ">
                  <li
                    className="card-bord-none"
                    onClick={() => selectedCardFn("credit", "Credit card")}
                  >
                    Credit card
                  </li>
                  {/* <li
                    className="card-bord-none"
                    onClick={() => selectedCardFn("debit", "Debit card")}
                  >
                    Debit card
                  </li> */}
                </ul>
              </label>
            </div>
            <div className="flex-card-24px">
              <div className="Card-type-grid card-number">
                <p className="Card-type-tit">Card number</p>
                {/* <input type="text" value="0000-0000-0000-0000" placeholder=""
                          className="Card-type-input" /> */}
                {cardType === "mastercard" && (
                  <img
                    src="assets/img/Add-credit-card-details/master-credit-card.png"
                    className="vicaa-ic"
                    alt=""
                  />
                )}
                {cardType === "visa" && (
                  <img
                    src="assets/img/Add-credit-card-details/visa-credit-card.png"
                    className="vicaa-ic"
                    alt=""
                  />
                )}
                {cardType !== "mastercard" && cardType !== "visa" && ""}
                <CardNumberElement
                  options={{
                    style: {
                      base: inputStyle,
                    },
                  }}
                  name="card_number"
                  onChange={handleChange}
                  id="cardNumber"
                />
              </div>
              <div className="Card-type-grid card-expiry">
                <p className="Card-type-tit">Expiry date</p>
                {/* <input type="text" value="MM-YY" placeholder="" className="Card-type-input w-s" /> */}
                <CardExpiryElement
                  /* Specify styles here */
                  options={{
                    style: {
                      base: inputStyle,
                    },
                  }}
                  name="card_expiry"
                  onChange={handleChange}
                  id="cardExpiry"
                />
              </div>
            </div>
            <div className="flex-card-24px">
              <div className="Card-type-grid">
                <p className="Card-type-tit">Name on card</p>
                <input
                  id="cardName"
                  type="text"
                  placeholder="Enter Name on the card"
                  onChange={(e) => setCardName(e.target.value)}
                  className="Card-type-input"
                />
              </div>
              <div className="Card-type-grid card-cvv">
                <p className="Card-type-tit">CVV code</p>
                {/* <input type="text" value="725" placeholder="" className="Card-type-input w-s" />
                        <img src="assets/img/Add-credit-card-details/qcstion.svg" className="vicaa-ic sss"
                          alt="" /> */}
                <CardCvcElement
                  /* Specify styles here */
                  options={{
                    placeholder: "CVV",
                    style: {
                      base: inputStyle,
                    },
                  }}
                  name="card_cvv"
                  onChange={handleChange}
                  id="cardCVV"
                />
                <img
                  src="assets/img/Add-credit-card-details/qcstion.svg"
                  className="vicaa-ic sss"
                  alt=""
                />
              </div>
            </div>
            <span id="card-errors"></span>
          </div>
          <div className="pay-back-flex p-0">
            <button
              className="Pay-btn"
              type="submit"
              disabled={props.addCardClicked}
            >
              Add
            </button>

            <a
              id="closeAddCardModal"
              className="Back-btn"
              data-bs-dismiss="modal"
              data-bs-toggle="modal"
              data-bs-target={isAddingCard ? "" : "#PROMOCODE"}
              onClick={() => handleCloseAddCard()}
            >
              Close
            </a>
          </div>
        </div>
      </form>
      <LoadingCover show={props.addCardClicked} />
    </div>
  );
}

export default AddCard;
