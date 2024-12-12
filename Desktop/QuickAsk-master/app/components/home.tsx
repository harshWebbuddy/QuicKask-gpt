"use client";

require("../polyfill");

import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAppConfig } from "../store/config";
import { Path, SlotID } from "../constant";
import { ErrorBoundary } from "./error";
import { SideBar } from "./sidebar";
import { Login } from "./login";
import { Register } from "./register";
import { RegisterPhone } from "./register-phone";
import { ForgetPassword } from "./forget-password";

import BotIcon from "../icons/bot.svg";
import LoadingIcon from "../icons/three-dots.svg";
import { getCSSVar, useMobileScreen } from "../utils";
import dynamic from "next/dynamic";

import styles from "./home.module.scss";
import { ThemeProvider } from "next-themes";
import { FirstPage } from "./first-page";
import { useAuthStore } from "../store/auth";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"] + " no-dark"}>
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}

const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo />,
});

const Chat = dynamic(async () => (await import("./chat")).Chat, {
  loading: () => <Loading noLogo />,
});

const NewChat = dynamic(async () => (await import("./new-chat")).NewChat, {
  loading: () => <Loading noLogo />,
});

const Guide = dynamic(async () => (await import("./guide")).Guide, {
  loading: () => <Loading noLogo />,
});

const MaskPage = dynamic(async () => (await import("./mask")).MaskPage, {
  loading: () => <Loading noLogo />,
});

export function useSwitchTheme() {
  const config = useAppConfig();

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const metaDescriptionDark = document.querySelector(
      'meta[name="theme-color"][media*="dark"]',
    );
    const metaDescriptionLight = document.querySelector(
      'meta[name="theme-color"][media*="light"]',
    );

    if (config.theme === "auto") {
      metaDescriptionDark?.setAttribute("content", "#151515");
      metaDescriptionLight?.setAttribute("content", "#fafafa");
    } else {
      const themeColor = getCSSVar("--theme-color");
      metaDescriptionDark?.setAttribute("content", themeColor);
      metaDescriptionLight?.setAttribute("content", themeColor);
    }
  }, [config.theme]);
}

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

const loadAsyncGoogleFont = () => {
  const linkEl = document.createElement("link");
  linkEl.rel = "stylesheet";
  linkEl.href =
    "/google-fonts/css2?family=Noto+Sans+SC:wght@300;400;700;900&display=swap";
  document.head.appendChild(linkEl);
};

function Screen() {
  const config = useAppConfig();
  const location = useLocation();
  const isHome = location.pathname === Path.Home;
  const isMobileScreen = useMobileScreen();
  const session = useAuthStore().session;
  // const session = true;

  useEffect(() => {
    loadAsyncGoogleFont();
  }, []);

  return (
    <ThemeProvider attribute="class">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-phone" element={<RegisterPhone />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/" element={<FirstPage />} />

        {/* Private Routes */}
        {session ? (
          <>
            <Route path={Path.Home} element={<Chat />} />
            <Route path={Path.NewChat} element={<NewChat />} />
            <Route path={Path.Guide} element={<Guide />} />
            <Route path={Path.Masks} element={<MaskPage />} />
            <Route path={Path.Chat} element={<Chat />} />
            <Route path={Path.Settings} element={<Settings />} />
          </>
        ) : (
          <>
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </ThemeProvider>
    // <div
    //   className={
    //     styles.container +
    //     ` ${
    //       config.tightBorder && !isMobileScreen
    //         ? styles["tight-container"]
    //         : styles.container
    //     }`
    //   }
    // >
    //   {userId && <SideBar className={isHome ? styles["sidebar-show"] : ""} />}

    //   <div className={styles["window-content"]} id={SlotID.AppBody}>
    //   </div>
    // </div>
  );
}

export function Home() {
  useSwitchTheme();

  if (!useHasHydrated()) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Screen />
      </Router>
    </ErrorBoundary>
  );
}
