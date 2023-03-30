import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { format } from "date-fns";
import {
  EditProfileHeaderLabel,
  FormSection,
  HeaderWrapper,
  HorizontalLine,
  Title,
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
  VerticalLine,
} from "./style";
import { useAuth } from "../../../Context/AuthProvider";
import { getPromoCodesList } from "../../Services/UserProfileService";

const PromoCode = () => {
  const { userProfileDetails, userId } = useAuth();
  const [availablePromoCodes, setAvailablePromoCodes] = useState([]);
  const [usedPromoCodes, setUsedPromoCodes] = useState([]);
  const [selected, setSelected] = useState(0);

  const handleGetPromoCodeList = (type, selectionTab) => {
    const promoCodePayload = {
      userId: userId,
      type: type,
    };
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
        <Title>PROMO CODE</Title>
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
              <span>Sort by date</span>
              <button>Date</button>
              <HorizontalLineDropdown />
              <button>Credits</button>
              <HorizontalLineDropdown />
              <button>Expiring on</button>
              <HorizontalLineDropdown />
              <button>Activated on</button>
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
                <BottomWrp>Activate now</BottomWrp>
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
                    <span>200 Credits</span>
                    <span>{items?.promo_code}</span>
                  </PromoCardCredit>
                </ItemsCard>
                <BottomWrpTab>
                  <span>Activate on</span>
                  <p>
                    {items?.created_at
                      ? format(
                          new Date(parseInt(items?.created_at)),
                          "dd-MM-yyyy",
                        )
                      : "-"}
                  </p>
                </BottomWrpTab>
              </CardInfo>
            ))}

          {/* {data.map((items, index) => (
            <CardInfo>
              <ItemsCard
                color={colors[Math.round((index + 1) % colors.length)]}
              >
                <PromoCard>
                  <PromoTitle>
                    <span>{items.percentage}% off</span>
                    <p>Promo code</p>
                  </PromoTitle>
                  <img src="assets/img/profile/promoItems.png" alt="" />
                </PromoCard>
                <PromoCardCredit>
                  <span>{items.credits} Credits</span>
                  <span>{items.code}</span>
                </PromoCardCredit>
              </ItemsCard>
              <BottomWrpTab>
                <span>Activate on</span>
                <p>22-01-2022</p>
              </BottomWrpTab>
            </CardInfo>
          ))} */}
          <PlusCard>
            <img src="assets/img/profile/plus.png" alt="" />
          </PlusCard>
        </ContentCard>
      )}
    </div>
  );
};

export default PromoCode;
