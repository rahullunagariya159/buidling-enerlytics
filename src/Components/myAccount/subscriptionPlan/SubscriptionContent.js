import React, { useState, useEffect } from "react";
import { format } from "date-fns";
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
import { CardNumberText } from "../profile/savedCard/style.js";
import { useAuth } from "../../../Context/AuthProvider";
import { getSubscriptionAndHistory } from "../../../Components/Services/UserProfileService";

const SubscriptionContent = () => {
  const { userId } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [subscription, setSubscription] = useState({});

  const toggleDropdown = () => {
    document.getElementById("myDropdownFilter").classList.toggle("show");
  };

  const handleGetSubscriptionsAndHistory = () => {
    getSubscriptionAndHistory({ userId })
      .then((response) => {
        if (response?.status === 200 && response?.data) {
          setInvoices(response?.data?.invoices);
          setSubscription(response?.data?.subscription);
        }
      })
      .catch((error) => {
        console.log({ error });
      })
      .finally(() => {});
  };

  const handleChoosePlan = () => {
    document.getElementById("enablePlans").click();
  };

  useEffect(() => {
    if (userId) {
      handleGetSubscriptionsAndHistory();
    }
  }, [userId]);

  return (
    <>
      <FormSection>
        <Title>MY SUBSCRIPTION PLAN</Title>
      </FormSection>
      {Object.keys(subscription)?.length === 0 ? (
        <div>
          <SmallLabel>
            You Currently don't have any subscription plan.
          </SmallLabel>
          <LinkButton
            onClick={() => handleChoosePlan()}
            className={`signin-btn sub-plan`}
            title="Choose now"
          />
        </div>
      ) : (
        <CardWrp>
          <ActiveCard>
            <ActivePlanContent>
              <YellowLabel>Active plan</YellowLabel>
              <YellowLargeLabel>{subscription?.plan}</YellowLargeLabel>
            </ActivePlanContent>
            <PlanLogo>
              <img src="assets/img/profile/premium.png" alt="" />
            </PlanLogo>
          </ActiveCard>
          <InfoCard>
            <Items>
              <GrayLabel>Activated on</GrayLabel>
              <SmallTextBlack>
                {subscription?.activatedOn
                  ? format(
                      new Date(parseInt(subscription?.activatedOn)),
                      "MMMM d, yyyy",
                    )
                  : "-"}
              </SmallTextBlack>
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
                <SmallTextBlack>{subscription?.last4}</SmallTextBlack>
              </CardNumber>
            </Items>
          </InfoCard>
          <LinkButton
            className={`upgrade-now-btn`}
            title="Upgrade now"
            icon={true}
            onClick={() => handleChoosePlan()}
          />
        </CardWrp>
      )}

      <TableWrapper>
        <TableHeader>
          <TitleWrp>
            <label>Payment history ({invoices?.length})</label>
            <SmallGrayLabel>Find all your payment plan invoices</SmallGrayLabel>
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
        <div className="table-responsive">
          <table className="table">
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
              {invoices?.length > 0 ? (
                invoices?.map((invoice) => {
                  return (
                    <tr>
                      <td>
                        <span>{invoice?.id}</span>
                      </td>
                      <td>
                        {invoice?.created_at
                          ? format(
                              new Date(parseInt(invoice?.created_at)),
                              "MMMM d, yyyy",
                            )
                          : "-"}
                      </td>
                      <td>{invoice?.paidAmount}$ CAD</td>
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
                  );
                })
              ) : (
                <tr>
                  <td>Payment History Not Found!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TableWrapper>
    </>
  );
};

export default SubscriptionContent;
