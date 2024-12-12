import { useEffect, useRef, useState } from "react";

import styles from "./home.module.scss";

import { IconButton } from "./button";
import SettingsIcon from "../icons/settings.svg";
import GithubIcon from "../icons/github.svg";
import ChatGptIcon from "../icons/chatgpt.svg";
import AddIcon from "../icons/add.svg";
import CloseIcon from "../icons/close.svg";
import MaskIcon from "../icons/mask.svg";
import PluginIcon from "../icons/plugin.svg";
import ChevronLight from "../icons/chevron-light.svg";
import ChevronDark from "../icons/chevron-dark.svg";

import Locale from "../locales";

import { useAppConfig, useChatStore } from "../store";

import {
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  NARROW_SIDEBAR_WIDTH,
  Path,
  REPO_URL,
} from "../constant";

import { Link, useNavigate } from "react-router-dom";
import { useMobileScreen } from "../utils";
import dynamic from "next/dynamic";
import { showToast } from "./ui-lib";
import { useAuthStore } from "../store/auth";
import { useTheme } from "next-themes";
import Image from "next/image";

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => null,
});

function useHotKey() {
  const chatStore = useChatStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.altKey || e.ctrlKey) {
        const n = chatStore.sessions.length;
        const limit = (x: number) => (x + n) % n;
        const i = chatStore.currentSessionIndex;
        if (e.key === "ArrowUp") {
          chatStore.selectSession(limit(i - 1));
        } else if (e.key === "ArrowDown") {
          chatStore.selectSession(limit(i + 1));
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
}

function useDragSideBar() {
  const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);

  const config = useAppConfig();
  const startX = useRef(0);
  const startDragWidth = useRef(config.sidebarWidth ?? 300);
  const lastUpdateTime = useRef(Date.now());

  const handleMouseMove = useRef((e: MouseEvent) => {
    if (Date.now() < lastUpdateTime.current + 50) {
      return;
    }
    lastUpdateTime.current = Date.now();
    const d = e.clientX - startX.current;
    const nextWidth = limit(startDragWidth.current + d);
    config.update((config) => (config.sidebarWidth = nextWidth));
  });

  const handleMouseUp = useRef(() => {
    startDragWidth.current = config.sidebarWidth ?? 300;
    window.removeEventListener("mousemove", handleMouseMove.current);
    window.removeEventListener("mouseup", handleMouseUp.current);
  });

  const onDragMouseDown = (e: MouseEvent) => {
    startX.current = e.clientX;

    window.addEventListener("mousemove", handleMouseMove.current);
    window.addEventListener("mouseup", handleMouseUp.current);
  };
  const isMobileScreen = useMobileScreen();
  const shouldNarrow =
    !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;

  useEffect(() => {
    const barWidth = shouldNarrow
      ? NARROW_SIDEBAR_WIDTH
      : limit(config.sidebarWidth ?? 300);
    const sideBarWidth = isMobileScreen ? "100vw" : `${barWidth}px`;
    document.documentElement.style.setProperty("--sidebar-width", sideBarWidth);
  }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

  return {
    onDragMouseDown,
    shouldNarrow,
  };
}

export function SideBar() {
  const chatStore = useChatStore();

  // drag side bar
  const { onDragMouseDown, shouldNarrow } = useDragSideBar();
  const navigate = useNavigate();
  const config = useAppConfig();
  const authStore = useAuthStore();
  const { systemTheme, theme, setTheme } = useTheme();

  useHotKey();

  const initializeState = () => {
    if (window.innerWidth < 1024) {
      return false;
    } else {
      return true;
    }
  };

  const [isExpanded, setIsExpanded] = useState(initializeState());

  const resizeListener = () => {
    if (window.innerWidth < 1024) {
      return setIsExpanded(false);
    }
    return setIsExpanded(true);
  };

  // Add a resize event listener
  useEffect(() => {
    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);
  return (
    <div className="h-full">
      <div
        onClick={() => {
          if (isExpanded) {
            return setIsExpanded(false);
          }
          return setIsExpanded(true);
        }}
        className="absolute left-0 h-[50px] w-[40px] bg-white dark:bg-[#202227] border dark:border-white/10 border-black/20 rounded-r-full grid lg:hidden place-content-center cursor-pointer"
      >
        {theme === "dark" ? <ChevronDark /> : <ChevronLight />}
      </div>
      <div
        className={`w-[300px] absolute top-0 left-0 shadow-2xl lg:shadow-none bg-white dark:bg-[#202227] lg:bg-transparent lg:relative z-[999] h-full flex flex-col transition-[width] duration-300 ${
          !isExpanded && "!w-[0px] !overflow-hidden"
        }`}
      >
        <div className="relative p-4 lg:p-0 flex-1 h-full flex flex-col">
          <div
            onClick={() => {
              if (isExpanded) {
                return setIsExpanded(false);
              }
              return setIsExpanded(true);
            }}
            className="absolute right-[-40px] h-[50px] w-[40px] bg-white border-[1px] dark:border-l-transparent border-l-transparent dark:border-t-white/10 border-t-black/20 dark:border-b-white/10 border-b-black/20 dark:border-r-white/10 border-r-black/20 dark:bg-[#202227] rounded-r-full grid lg:hidden place-content-center cursor-pointer"
          >
            {theme === "dark" ? <ChevronDark /> : <ChevronLight />}
          </div>
          <div className="flex-1 space-y-4 !overflow-hidden">
            <Image
              src="/logo.svg"
              alt="logo"
              width={120}
              height={50}
              draggable={false}
              className="select-none min-w-[120px]"
            />
            <div className="w-full !mt-6">
              <div className="items-center p-3 bg-[#69a506] rounded-lg overflow-hidden">
                <button
                  className="relative w-full font-semibold text-white tracking-[0] leading-[normal] flex gap-3"
                  onClick={() => {
                    if (config.dontShowMaskSplashScreen) {
                      chatStore.newSession();
                      navigate(Path.Chat);
                    } else {
                      navigate(Path.NewChat);
                    }
                  }}
                >
                  <img
                    src="/images/add-icon.svg"
                    className="h-[22px] w-[19px]"
                  />
                  <span className="text-sm whitespace-nowrap">New Chat</span>
                </button>
              </div>
            </div>
            <div className="w-full">
              <span className="text-[#9A9A9A] dark:text-[14.4px]">Today</span>
              <div className="w-full pt-3">
                <ChatList narrow={shouldNarrow} today={true} />
              </div>
            </div>
            <div className="h-[1px] w-full bg-[#b3b3b3] dark:bg-neutral-700" />
            <div className="w-full">
              <span className="text-[#9A9A9A] dark:text-[14.4px] whitespace-nowrap">
                Chat List
              </span>
              <div className="w-full pt-3">
                <ChatList narrow={shouldNarrow} today={false} />
              </div>
            </div>
            <div className="h-[1px] bg-[#b3b3b3] dark:bg-neutral-700" />
            <div className="w-full px-4 space-y-6 mt-6 flex flex-col">
              <div className="inline-flex items-center gap-[7.21px] relative mt-2">
                <img
                  className="relative w-[28.86px] h-[28.86px]"
                  alt="warning"
                  src="/images/warning-circle.svg"
                />
                <button
                  className="relative w-fit font-normal dark:text-white tracking-[0] leading-[normal] text-sm whitespace-nowrap"
                  onClick={() => {
                    if (confirm(Locale.Home.DeleteChat)) {
                      chatStore.deleteSession(chatStore.currentSessionIndex);
                    }
                  }}
                >
                  guide
                </button>
              </div>
              <div className="inline-flex items-center gap-[7.21px] relative">
                <img
                  className="relative w-[28.86px] h-[28.86px]"
                  alt="Trash"
                  src="/images/trash.svg"
                />
                <button
                  className="relative w-fit font-normal dark:text-white tracking-[0] leading-[normal] text-sm whitespace-nowrap"
                  onClick={() => {
                    if (confirm(Locale.Home.DeleteChat)) {
                      chatStore.deleteSession(chatStore.currentSessionIndex);
                    }
                  }}
                >
                  Clear Conversation
                </button>
              </div>
              <div className="flex items-center gap-[7.21px] relative">
                <img
                  className="relative w-[28.86px] h-[28.86px]"
                  alt="Trash"
                  src="/images/settings.svg"
                />
                <Link
                  to={Path.Settings}
                  className="relative w-fit font-normal dark:text-white tracking-[0] leading-[normal] text-sm whitespace-nowrap"
                >
                  Settings
                </Link>
              </div>
              <div className="flex items-center gap-[7.21px] relative">
                <img
                  className="relative w-[28.86px] h-[28.86px]"
                  alt="Trash"
                  src="/images/logout.svg"
                />
                <button
                  className="relative w-fit font-normal dark:text-white tracking-[0] leading-[normal] text-sm whitespace-nowrap"
                  onClick={() => {
                    localStorage.clear();
                    navigate(Path.Home);
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
          <div className="w-full space-y-3">
            <div className="w-full">
              <button
                className="bg-[#d3d3d3] dark:bg-[#0E0F13] rounded-[10px] w-full h-[48px] flex items-center justify-center font-semibold whitespace-nowrap min-w-[200px]"
                onClick={() =>
                  navigate(Path.NewChat, { state: { fromHome: true } })
                }
              >
                <img
                  className="w-[20px] h-[20px] mr-2"
                  alt="Mask"
                  src="/images/mask.svg"
                />
                Mask
              </button>
            </div>
            <div className="w-full">
              <div className="bg-[#d3d3d3] dark:bg-[#0E0F13] rounded-[10px] flex items-center p-1">
                <button
                  className="bg-[#69A606] dark:bg-[#0E0F13] text-white dark:text-white rounded-[10px] w-full h-[43px] flex items-center justify-center mr-2"
                  onClick={() => setTheme("light")}
                >
                  <img
                    className="w-[20px] h-[20px] mr-2"
                    alt="Mask"
                    src="/images/light.svg"
                  />
                  Light
                </button>

                <button
                  className="bg-[#d3d3d3] @apply dark:bg-neutral-800 dark:text-white rounded-[10px] w-full h-[43px] flex items-center justify-center"
                  onClick={() => setTheme("dark")}
                >
                  <img
                    className="w-[20px] h-[20px] mr-2"
                    alt="Mask"
                    src="/images/dark.svg"
                  />
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
