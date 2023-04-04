import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { orderBy } from "lodash";
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
import LoadingCover from "../../LoadingCover";
import { FilterWrp } from "../promoCode/style.js";

const SubscriptionContent = () => {
  const { userId, userProfileDetails } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [subscription, setSubscription] = useState({});
  const [isAscOrder, setIsAscOrder] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const ref = useRef();
  const [toggleDropdown, setToggleDropdown] = useState(false);
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (toggleDropdown && ref.current && !ref.current.contains(e.target)) {
        setToggleDropdown(false);
      }
    };
    document.addEventListener("click", checkIfClickedOutside, true);
    return () => {
      document.removeEventListener("click", checkIfClickedOutside, true);
    };
  }, [toggleDropdown]);
  const handleGetSubscriptionsAndHistory = () => {
    setShowLoading(true);
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
      .finally(() => {
        setShowLoading(false);
      });
  };

  const handleChoosePlan = () => {
    document.getElementById("enablePlans").click();
  };

  const handleSorting = (isAscOrderType) => {
    const orderedInvoices = orderBy(
      invoices,
      ["created_at"],
      [isAscOrderType ? "asc" : "desc"],
    );
    setIsAscOrder(!isAscOrder);
    setInvoices(orderedInvoices);
  };

  useEffect(() => {
    if (userId) {
      handleGetSubscriptionsAndHistory();
    }
  }, [userId, userProfileDetails]);

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
              <YellowLargeLabel>{userProfileDetails?.plan}</YellowLargeLabel>
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
          <FilterWrp ref={ref}>
            <TitleWrp onClick={() => setToggleDropdown(!toggleDropdown)}>
              <img src="assets/img/profile/filter.png" alt="" />
            </TitleWrp>
            {toggleDropdown && (
              <div className="dropdown-content-filter">
                <button
                  onClick={() => handleSorting(!isAscOrder)}
                  className={isAscOrder ? "asc-order" : ""}
                >
                  Date
                  <img src="assets/img/profile/rightArrow.png" alt="" />
                </button>
              </div>
            )}
          </FilterWrp>
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
      <LoadingCover show={showLoading} />
    </>
  );
};

export default SubscriptionContent;
