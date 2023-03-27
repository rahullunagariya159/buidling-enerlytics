import React, { useState } from "react";
import {
  ActiveCard,
  ActivePlanContent,
  CardNumber,
  CardWrp,
  FormSection,
  GrayLabel,
  InfoCard,
  Items,
  PlanLogo,
  SmallGrayLabel,
  SmallLabel,
  SmallText,
  SmallTextBlack,
  TableHeader,
  TableWrapper,
  Title,
  TitleWrp,
  YellowLabel,
  YellowLargeLabel,
} from "./style.js";
import LinkButton from "../../LinkButton";
import { CardNumberText, SmallTextGray } from "../profile/savedCard/style.js";

const SubscriptionContent = () => {
  const toggleDropdown = () => {
    document.getElementById("myDropdownFilter").classList.toggle("show");
  };
  const [show, setShow] = useState(true);
  return (
    <>
      <FormSection>
        <Title>MY SUBSCRIPTION PLAN</Title>
      </FormSection>
      {show ? (
        <div>
          <SmallLabel>
            You Currently don't have any subscription plan.
          </SmallLabel>
          <LinkButton
            onClick={() => setShow(false)}
            className={`signin-btn sub-plan`}
            title="Choose now"
          />
        </div>
      ) : (
        <>
          <CardWrp>
            <ActiveCard>
              <ActivePlanContent>
                <YellowLabel>Active plan</YellowLabel>
                <YellowLargeLabel>Home</YellowLargeLabel>
              </ActivePlanContent>
              <PlanLogo>
                <img src="assets/img/profile/premium.png" alt="" />
              </PlanLogo>
            </ActiveCard>
            <InfoCard>
              <Items>
                <GrayLabel>Activated on</GrayLabel>
                <SmallTextBlack>November 22, 2022</SmallTextBlack>
              </Items>
              <Items>
                <GrayLabel>Payment method</GrayLabel>
                <CardNumber>
                  <CardNumberText>
                    <SmallText>****</SmallText>
                  </CardNumberText>
                  <SmallText>-</SmallText>
                  <CardNumberText>
                    <SmallText>****</SmallText>
                  </CardNumberText>
                  <SmallText>-</SmallText>
                  <CardNumberText>
                    <SmallText>****</SmallText>
                  </CardNumberText>
                  <SmallText>-</SmallText>
                  <SmallTextBlack>0000</SmallTextBlack>
                </CardNumber>
              </Items>
            </InfoCard>
            <LinkButton
              className={`upgrade-now-btn`}
              title="Upgrade now"
              icon={true}
            />
          </CardWrp>
          <TableWrapper>
            <TableHeader>
              <TitleWrp>
                <label>Payment history (5)</label>
                <SmallGrayLabel>
                  Find all your payment plan invoices
                </SmallGrayLabel>
              </TitleWrp>
              <TitleWrp onClick={toggleDropdown}>
                <img src="assets/img/profile/filter.png" alt="" />
              </TitleWrp>
              <div id="myDropdownFilter" className="dropdown-content-filter">
                <button>
                  Date
                  <img src="assets/img/profile/rightArrow.png" alt="" />
                </button>
              </div>
            </TableHeader>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Invoice number</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span>Invoice234</span>
                    </td>
                    <td>November 22, 2022</td>
                    <td>35$ CAD</td>
                    <td>Success</td>
                    <td>
                      <div>
                        <img
                          src="assets/img/profile/download.png"
                          alt=""
                          height={15}
                          width={15}
                        />
                        Download
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Invoice234</span>
                    </td>
                    <td>November 22, 2022</td>
                    <td>35$ CAD</td>
                    <td>Success</td>
                    <td>
                      <div>
                        <img
                          src="assets/img/profile/download.png"
                          alt=""
                          height={15}
                          width={15}
                        />
                        Download
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Invoice234</span>
                    </td>
                    <td>November 22, 2022</td>
                    <td>35$ CAD</td>
                    <td>Success</td>
                    <td>
                      <div>
                        <img
                          src="assets/img/profile/download.png"
                          alt=""
                          height={15}
                          width={15}
                        />
                        Download
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TableWrapper>
        </>
      )}
    </>
  );
};

export default SubscriptionContent;
