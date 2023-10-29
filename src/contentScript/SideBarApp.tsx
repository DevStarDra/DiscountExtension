import React, { useEffect } from "react";
import { useState } from "react";
import { assetsConstant, pageData, RouterConfig } from "../core/helper";
import { getURL } from "../core/common"
import { DraggableComponent, Footer, Header, } from "../pages/components/components";
import Popup from "../pages/Popup";
import SignIn from "../pages/SignIn";
import { AuthDrawer } from "../pages/components/Drawers";
import { ProvideAuth, useAuth } from "../store/use-auth";
import AccountPage from "../pages/Acccount";
import HomeScreen from "../pages/HomeScreen";
import CouponScreen from "../pages/CouponScreen";
import ComparisonScreen from "../pages/ComparisonScreen";
import { ProvideMemoryRouter, useMemoryRouter } from "../store/memory-router";
import AppContent from "./AppContent";
import { ProvideMultiLanguage } from "../store/multi-language";

export default function SideBarApp() {
  return (
    <ProvideMultiLanguage>
      <ProvideMemoryRouter>
        <ProvideAuth>
          <AppContent />
        </ProvideAuth>
      </ProvideMemoryRouter>
    </ProvideMultiLanguage>
  )
}
