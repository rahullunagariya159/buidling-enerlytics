import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { format } from "date-fns";
import { orderBy } from "lodash";
import { toast } from "react-toastify";
import {
  EditProfileHeaderLabel,
  FormSection,
  HeaderWrapper,
  HorizontalLine,
} from "../profile/editProfile/style";
import {
  ContactHeader,
  ImageWrp,
  ProfileInfo,
  ProfileWrp,
  UserName,
} from "../profile/style";
import { TitleWrp } from "../subscriptionPlan/style";
import {
  BottomWrp,
  BottomWrpTab,
  CardInfo,
  CardWrp,
  ContentCard,
  FilterDropdown,
  FilterWrp,
  HorizontalLineDropdown,
  ItemsCard,
  PlusCard,
  PromoCard,
  PromoCardCredit,
  PromoTitle,
  TabWrp,
  TitleBold,
  VerticalLine,
} from "./style";
import { useAuth } from "../../../Context/AuthProvider";
import {
  getPromoCodesList,
  activatePromocode,
} from "../../Services/UserProfileService";
import Button from "../../Button";
import { somethingWentWrongError } from "../../../Constants";
import LoadingCover from "../../LoadingCover";

const PromoCode = () => {
  const { userProfileDetails, userId } = useAuth();
  const [availablePromoCodes, setAvailablePromoCodes] = useState([]);
  const [usedPromoCodes, setUsedPromoCodes] = useState([]);
  const [selected, setSelected] = useState(0);
  const [isCreditsAsc, setIsCredAsc] = useState(false);
  const [isActivatedAsc, setIsActivatedAsc] = useState(false);
  const [isDiscountAsc, setIsDiscountAsc] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [activeNowLoading, setActiveNowLoading] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const handleActivePromoCode = (promoCodeDetail) => {
    const payload = {
      promoCode: promoCodeDetail?.promo_code,
      userId: userId,
      credits: promoCodeDetail?.credits,
    };
    setActiveNowLoading(promoCodeDetail?.id);
    activatePromocode(payload)
      .then((response) => {
        if (response?.status === 200 && response?.data?.msg) {
          toast.success("Promo code activated successfully");
        }
      })
      .catch((error) => {
        toast.error(error?.message || somethingWentWrongError);
      })
      .finally(() => {
        setActiveNowLoading("");
      });
  };

  const handleGetPromoCodeList = (type, selectionTab) => {
    const promoCodePayload = {
      userId: userId,
      type: type,
    };
    setShowLoading(true);
    getPromoCodesList(promoCodePayload)
      .then((response) => {
        if (response?.status === 200 && response?.data?.data) {
          if (selectionTab === 0) {
            setAvailablePromoCodes(response?.data?.data);
          } else {
            setUsedPromoCodes(response?.data?.data);
          }
        }
      })
      .catch((error) => {
        console.log({ error });
      })
      .finally(() => {
        setShowLoading(false);
      });
  };

  useEffect(() => {
    if (userId) {
      handleGetPromoCodeList("AVAILABLE", 0);
    }
  }, [userId]);

  const toggleDropdown = () => {
    document.getElementById("myDropdownFilter").classList.toggle("show");
  };

  const colors = [
    { c1: "#da64c8", c2: "#4436e2" },
    { c1: "#51f2f1", c2: "#04c5b5" },
    { c1: "#ffa967", c2: "#ff4f96" },
    { c1: "#fed672", c2: "#fe8a00" },
  ];

  const handleSorting = (isAscOrderType, orderFieldName) => {
    setSelectedSortOption(orderFieldName);
    if (selected === 0) {
      const orderedPromocodes = orderBy(
        availablePromoCodes,
        [orderFieldName],
        [isAscOrderType ? "asc" : "desc"],
      );
      setAvailablePromoCodes(orderedPromocodes);
    } else {
      const orderedPromocodes = orderBy(
        usedPromoCodes,
        [orderFieldName],
        [isAscOrderType ? "asc" : "desc"],
      );
      setUsedPromoCodes(orderedPromocodes);
    }
  };

  return (
    <div>
      <HeaderWrapper>
        <ProfileWrp>
          <ImageWrp>
            <img
              src={
                userProfileDetails?.profile_pic ||
                "assets/img/profile/default-user-avatar.jpeg"
              }
              alt=""
            />
          </ImageWrp>
          <ProfileInfo>
            <ContactHeader>
              <div>
                <UserName>
                  {" "}
                  {(userProfileDetails?.first_name || "") +
                    " " +
                    (userProfileDetails?.last_name || "")}
                </UserName>
                <EditProfileHeaderLabel>
                  Manage your personal information, Password and more
                </EditProfileHeaderLabel>
              </div>
            </ContactHeader>
          </ProfileInfo>
        </ProfileWrp>
      </HeaderWrapper>
      <HorizontalLine />
      <FormSection>
        <TitleBold>PROMO CODE</TitleBold>
      </FormSection>
      <CardWrp>
        <TabWrp>
          <NavLink
            to="#"
            selected={selected === 0 ? "selected" : ""}
            onClick={() => {
              setSelected(0);
              handleGetPromoCodeList("AVAILABLE", 0);
            }}
            className={() => "nav-link " + (selected === 0 ? "selected" : "")}
          >
            Available
          </NavLink>
          <VerticalLine />
          <NavLink
            to="#"
            selected={selected === 1 ? "selected" : ""}
            onClick={() => {
              setSelected(1);
              handleGetPromoCodeList("USED", 1);
            }}
            className={() => "nav-link " + (selected === 1 ? "selected" : "")}
          >
            Used
          </NavLink>
        </TabWrp>
        <FilterWrp>
          <TitleWrp onClick={toggleDropdown}>
            <img src="assets/img/profile/filter.png" alt="" />
          </TitleWrp>
          <div id="myDropdownFilter" className="dropdown-promoCode-filter">
            <FilterDropdown>
              {/* <span>Sort by date</span> */}
              {/* <button>Date</button> */}
              {/* <HorizontalLineDropdown /> */}
              <button
                onClick={() => {
                  handleSorting(!isCreditsAsc, "credits");
                  setIsCredAsc(!isCreditsAsc);
                }}
                className={
                  selectedSortOption === "credits" && isCreditsAsc
                    ? "selected-promocode-sort"
                    : ""
                }
              >
                Credits
              </button>
              {/* <HorizontalLineDropdown />
              <button>Expiring on</button> */}
              {selected === 1 && (
                <>
                  <HorizontalLineDropdown />
                  <button
                    onClick={() => {
                      handleSorting(!isActivatedAsc, "appliedOn");
                      setIsActivatedAsc(!isActivatedAsc);
                    }}
                    className={
                      selectedSortOption === "appliedOn" && isActivatedAsc
                        ? "selected-promocode-sort"
                        : ""
                    }
                  >
                    Activated on
                  </button>
                </>
              )}
              <HorizontalLineDropdown />
              <button
                onClick={() => {
                  handleSorting(!isDiscountAsc, "discount");
                  setIsDiscountAsc(!isDiscountAsc);
                }}
                className={
                  selectedSortOption === "discount" && isDiscountAsc
                    ? "selected-promocode-sort"
                    : ""
                }
              >
                Discount
              </button>
            </FilterDropdown>
          </div>
        </FilterWrp>
      </CardWrp>
      {selected === 0 && (
        <ContentCard>
          {availablePromoCodes?.length > 0 &&
            availablePromoCodes?.map((items, index) => (
              <CardInfo key={index}>
                <ItemsCard
                  color={colors[Math.round((index + 1) % colors.length)]}
                >
                  <PromoCard>
                    <PromoTitle>
                      <span>{items?.discount}% off</span>
                      <p>Promo code</p>
                    </PromoTitle>
                    <img src="assets/img/profile/promoItems.png" alt="" />
                  </PromoCard>
                  <PromoCardCredit>
                    <span>20 Credits</span>
                    <span>{items?.promo_code}</span>
                  </PromoCardCredit>
                </ItemsCard>
                <BottomWrp>
                  <Button
                    isLoading={activeNowLoading === items?.id}
                    isDisable={activeNowLoading === items?.id}
                    className="btn-active-now"
                    title="Activate now"
                    onClick={() => handleActivePromoCode(items)}
                  />
                </BottomWrp>
              </CardInfo>
            ))}
        </ContentCard>
      )}
      {selected === 1 && (
        <ContentCard>
          {usedPromoCodes?.length > 0 &&
            usedPromoCodes.map((items, index) => (
              <CardInfo>
                <ItemsCard
                  color={colors[Math.round((index + 1) % colors.length)]}
                >
                  <PromoCard>
                    <PromoTitle>
                      <span>{items?.discount}% off</span>
                      <p>Promo code</p>
                    </PromoTitle>
                    <img src="assets/img/profile/promoItems.png" alt="" />
                  </PromoCard>
                  <PromoCardCredit>
                    <span>{items?.credits} Credits</span>
                    <span>{items?.promo_code}</span>
                  </PromoCardCredit>
                </ItemsCard>
                <BottomWrpTab>
                  <span>Activate on</span>
                  <p>
                    {items?.appliedOn
                      ? format(
                          new Date(parseInt(items?.appliedOn)),
                          "dd-MM-yyyy",
                        )
                      : "-"}
                  </p>
                </BottomWrpTab>
              </CardInfo>
            ))}
          <PlusCard>
            <img src="assets/img/profile/plus.png" alt="" />
          </PlusCard>
        </ContentCard>
      )}
      <LoadingCover show={showLoading} />
    </div>
  );
};

export default PromoCode;
