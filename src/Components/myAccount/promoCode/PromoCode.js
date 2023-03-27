import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
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

const PromoCode = () => {
  const toggleDropdown = () => {
    document.getElementById("myDropdownFilter").classList.toggle("show");
  };
  const [selected, setSelected] = useState(0);
  return (
    <div>
      <HeaderWrapper>
        <ProfileWrp>
          <ImageWrp>
            <img src="assets/img/profile/userLogo.png" alt="" />
          </ImageWrp>
          <ProfileInfo>
            <ContactHeader>
              <div>
                <UserName>Golden Designs</UserName>
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
            onClick={() => setSelected(0)}
            className={() => "nav-link " + (selected === 0 ? "selected" : "")}
          >
            Available
          </NavLink>
          <VerticalLine />
          <NavLink
            to="#"
            selected={selected === 1 ? "selected" : ""}
            onClick={() => setSelected(1)}
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
          <CardInfo>
            <ItemsCard>
              <PromoCard>
                <PromoTitle>
                  <span>10% off</span>
                  <p>Promo code</p>
                </PromoTitle>
                <img src="assets/img/profile/promoItems.png" alt="" />
              </PromoCard>
              <PromoCardCredit>
                <span>20 Credits</span>
                <span>YYKK234YP8</span>
              </PromoCardCredit>
            </ItemsCard>
            <BottomWrp>Activate now</BottomWrp>
          </CardInfo>
          <CardInfo>
            <ItemsCard>
              <PromoCard>
                <PromoTitle>
                  <span>10% off</span>
                  <p>Promo code</p>
                </PromoTitle>
                <img src="assets/img/profile/promoItems.png" alt="" />
              </PromoCard>
              <PromoCardCredit>
                <span>20 Credits</span>
                <span>YYKK234YP8</span>
              </PromoCardCredit>
            </ItemsCard>
            <BottomWrp>Activate now</BottomWrp>
          </CardInfo>
          <CardInfo>
            <ItemsCard>
              <PromoCard>
                <PromoTitle>
                  <span>10% off</span>
                  <p>Promo code</p>
                </PromoTitle>
                <img src="assets/img/profile/promoItems.png" alt="" />
              </PromoCard>
              <PromoCardCredit>
                <span>20 Credits</span>
                <span>YYKK234YP8</span>
              </PromoCardCredit>
            </ItemsCard>
            <BottomWrp>Activate now</BottomWrp>
          </CardInfo>
        </ContentCard>
      )}
      {selected === 1 && (
        <ContentCard>
          <CardInfo>
            <ItemsCard>
              <PromoCard>
                <PromoTitle>
                  <span>10% off</span>
                  <p>Promo code</p>
                </PromoTitle>
                <img src="assets/img/profile/promoItems.png" alt="" />
              </PromoCard>
              <PromoCardCredit>
                <span>20 Credits</span>
                <span>YYKK234YP8</span>
              </PromoCardCredit>
            </ItemsCard>
            <BottomWrpTab>
              <span>Activate on</span>
              <p>22-01-2022</p>
            </BottomWrpTab>
          </CardInfo>
          <CardInfo>
            <ItemsCard>
              <PromoCard>
                <PromoTitle>
                  <span>10% off</span>
                  <p>Promo code</p>
                </PromoTitle>
                <img src="assets/img/profile/promoItems.png" alt="" />
              </PromoCard>
              <PromoCardCredit>
                <span>20 Credits</span>
                <span>YYKK234YP8</span>
              </PromoCardCredit>
            </ItemsCard>
            <BottomWrpTab>
              <span>Activate on</span>
              <p>22-01-2022</p>
            </BottomWrpTab>
          </CardInfo>
          <CardInfo>
            <ItemsCard>
              <PromoCard>
                <PromoTitle>
                  <span>10% off</span>
                  <p>Promo code</p>
                </PromoTitle>
                <img src="assets/img/profile/promoItems.png" alt="" />
              </PromoCard>
              <PromoCardCredit>
                <span>20 Credits</span>
                <span>YYKK234YP8</span>
              </PromoCardCredit>
            </ItemsCard>
            <BottomWrpTab>
              <span>Activate on</span>
              <p>22-01-2022</p>
            </BottomWrpTab>
          </CardInfo>
          <CardInfo>
            <ItemsCard>
              <PromoCard>
                <PromoTitle>
                  <span>10% off</span>
                  <p>Promo code</p>
                </PromoTitle>
                <img src="assets/img/profile/promoItems.png" alt="" />
              </PromoCard>
              <PromoCardCredit>
                <span>20 Credits</span>
                <span>YYKK234YP8</span>
              </PromoCardCredit>
            </ItemsCard>
            <BottomWrpTab>
              <span>Activate on</span>
              <p>22-01-2022</p>
            </BottomWrpTab>
          </CardInfo>
          <CardInfo>
            <ItemsCard>
              <PromoCard>
                <PromoTitle>
                  <span>10% off</span>
                  <p>Promo code</p>
                </PromoTitle>
                <img src="assets/img/profile/promoItems.png" alt="" />
              </PromoCard>
              <PromoCardCredit>
                <span>20 Credits</span>
                <span>YYKK234YP8</span>
              </PromoCardCredit>
            </ItemsCard>
            <BottomWrpTab>
              <span>Activate on</span>
              <p>22-01-2022</p>
            </BottomWrpTab>
          </CardInfo>
          <PlusCard>
            <img src="assets/img/profile/plus.png" alt="" />
          </PlusCard>
        </ContentCard>
      )}
    </div>
  );
};

export default PromoCode;
