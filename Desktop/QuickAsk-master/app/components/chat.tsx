import { useDebouncedCallback } from "use-debounce";
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import toast, { Toaster } from "react-hot-toast";

import {
  speechRecognition,
  setSpeechRecognition,
} from "../speech-recognition-types";

import SendWhiteIcon from "../../public/images/send.svg";
import BrainIcon from "../icons/brain.svg";
import RenameIcon from "../icons/rename.svg";
import ExportIcon from "../icons/share.svg";
import ReturnIcon from "../icons/return.svg";
import CopyIcon from "../icons/copy.svg";
import LoadingIcon from "../icons/three-dots.svg";
import PromptIconDark from "../icons/prompt.svg";
import PromptIconLight from "../icons/prompt-light.svg";
import MaskIconDark from "../icons/mask.svg";
import MaskIconLight from "../icons/mask-light.svg";
import MaxIcon from "../icons/max.svg";
import MinIcon from "../icons/min.svg";
import ResetIcon from "../icons/reload.svg";
import BreakIconDark from "../icons/break.svg";
import BreakIconLight from "../icons/break-light.svg";
import SettingsIcon from "../icons/chat-settings.svg";
import MicrophoneIconDark from "../icons/microphone.svg";
import MicrophoneIconLight from "../icons/microphone-light.svg";
import MicrophoneOffIconDark from "../icons/microphone_off.svg";
import MicrophoneOffIconLight from "../icons/microphone_off-light.svg";
import GoogleBardIconDark from "../icons/google-bard-on.svg";
import GoogleBardOffIconDark from "../icons/google-bard-off.svg";
import GoogleBardIconLight from "../icons/google-bard-on-light.svg";
import GoogleBardOffIconLight from "../icons/google-bard-off-light.svg";
import ChineseIcon from "../icons/chinese.svg";
import EnglishIcon from "../icons/english.svg";
import PlayerIcon from "../icons/player-play.svg";
import PlayerStopIcon from "../icons/player-stop.svg";
import ClaudeIcon from "../icons/anthropic.svg";
import ClaudeOffIcon from "../icons/anthropic-disable.svg";
import DuckDuckGoIcon from "../icons/duckduckgo.svg";
import DuckDuckGoOffIcon from "../icons/duckduckgo-off.svg";
import LightIcon from "../icons/light.svg";
import DarkIcon from "../icons/dark.svg";
import AutoIcon from "../icons/auto.svg";
import BottomIcon from "../icons/bottom.svg";
import StopIcon from "../icons/pause.svg";
import {
  doSpeechSynthesis,
  stopSpeechSysthesis,
} from "../utils/speechSynthesis";
import { SideBar } from "./sidebar";
import { ModelConfigList } from "./model-config";

import {
  ChatMessage,
  SubmitKey,
  useChatStore,
  BOT_HELLO,
  createMessage,
  useAccessStore,
  Theme,
  useAppConfig,
  DEFAULT_TOPIC,
  DEFAULT_CONFIG,
  ModelConfig,
  ModalConfigValidator,
  ALL_MODELS,
} from "../store";

import {
  copyToClipboard,
  selectOrCopy,
  autoGrowTextArea,
  useMobileScreen,
} from "../utils";

import dynamic from "next/dynamic";

import { ChatControllerPool } from "../client/controller";
import { Prompt, usePromptStore } from "../store/prompt";
import Locale from "../locales";

import { IconButton } from "./button";
import styles from "./home.module.scss";
import chatStyle from "./chat.module.scss";

import { ListItem, Modal, showToast } from "./ui-lib";
import { useLocation, useNavigate } from "react-router-dom";
import { LAST_INPUT_KEY, Path, REQUEST_TIMEOUT_MS } from "../constant";
import { Avatar } from "./emoji";
import { MaskAvatar, MaskConfig } from "./mask";
import { useMaskStore } from "../store/mask";
import { useCommand } from "../command";
import { prettyObject } from "../utils/format";
import { ExportMessageModal } from "./exporter";
import SubAlertModal from "./subAlertModal";
import { BUILTIN_MASK_STORE } from "../masks";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
  loading: () => <LoadingIcon />,
});

export function SessionConfigModel(props: { onClose: () => void }) {
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const maskStore = useMaskStore();
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="fixed bg-white dark:bg-neutral-950 h-[800px] w-[800px] rounded-[10px]">
        <Modal
          title={Locale.Context.Edit}
          onClose={() => props.onClose()}
          actions={[
            <IconButton
              key="reset"
              icon={<ResetIcon />}
              bordered
              text={Locale.Chat.Config.Reset}
              onClick={() => {
                if (confirm(Locale.Memory.ResetConfirm)) {
                  chatStore.updateCurrentSession(
                    (session) => (session.memoryPrompt = ""),
                  );
                }
              }}
            />,
            <IconButton
              key="copy"
              icon={<CopyIcon />}
              bordered
              text={Locale.Chat.Config.SaveAs}
              onClick={() => {
                navigate(Path.Masks);
                setTimeout(() => {
                  maskStore.create(session.mask);
                }, 500);
              }}
            />,
          ]}
        >
          <MaskConfig
            mask={session.mask}
            updateMask={(updater) => {
              const mask = { ...session.mask };
              updater(mask);
              chatStore.updateCurrentSession(
                (session) => (session.mask = mask),
              );
            }}
            shouldSyncFromGlobal
            extraListItems={
              session.mask.modelConfig.sendMemory ? (
                <ListItem
                  title={`${Locale.Memory.Title} (${session.lastSummarizeIndex} of ${session.messages.length})`}
                  subTitle={session.memoryPrompt || Locale.Memory.EmptyContent}
                ></ListItem>
              ) : (
                <></>
              )
            }
          ></MaskConfig>
        </Modal>
      </div>
    </div>
  );
}

function PromptToast(props: {
  showToast?: boolean;
  showModal?: boolean;
  setShowModal: (_: boolean) => void;
}) {
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const context = session.mask.context;

  return (
    <div className={chatStyle["prompt-toast"]} key="prompt-toast">
      {props.showToast && (
        <div
          className={chatStyle["prompt-toast-inner"] + " clickable"}
          role="button"
          onClick={() => props.setShowModal(true)}
        >
          <BrainIcon />
          <span className={chatStyle["prompt-toast-content"]}>
            {Locale.Context.Toast(context.length)}
          </span>
        </div>
      )}
      {props.showModal && (
        <SessionConfigModel onClose={() => props.setShowModal(false)} />
      )}
    </div>
  );
}

function useSubmitHandler() {
  const config = useAppConfig();
  const submitKey = config.submitKey;

  const shouldSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return false;
    if (e.key === "Enter" && e.nativeEvent.isComposing) return false;
    return (
      (config.submitKey === SubmitKey.AltEnter && e.altKey) ||
      (config.submitKey === SubmitKey.CtrlEnter && e.ctrlKey) ||
      (config.submitKey === SubmitKey.ShiftEnter && e.shiftKey) ||
      (config.submitKey === SubmitKey.MetaEnter && e.metaKey) ||
      (config.submitKey === SubmitKey.Enter &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.metaKey)
    );
  };

  return {
    submitKey,
    shouldSubmit,
  };
}

export function PromptHints(props: {
  prompts: Prompt[];
  onPromptSelect: (prompt: Prompt) => void;
}) {
  const noPrompts = props.prompts.length === 0;
  const [selectIndex, setSelectIndex] = useState(0);
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectIndex(0);
  }, [props.prompts.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        return props.onPromptSelect(null as any);
      }
      if (noPrompts) return;
      if (e.metaKey || e.altKey || e.ctrlKey) {
        return;
      }
      // arrow up / down to select prompt
      const changeIndex = (delta: number) => {
        e.stopPropagation();
        e.preventDefault();
        const nextIndex = Math.max(
          0,
          Math.min(props.prompts.length - 1, selectIndex + delta),
        );
        setSelectIndex(nextIndex);
        selectedRef.current?.scrollIntoView({
          block: "center",
        });
      };

      if (e.key === "ArrowUp") {
        changeIndex(1);
      } else if (e.key === "ArrowDown") {
        changeIndex(-1);
      } else if (e.key === "Enter") {
        const selectedPrompt = props.prompts.at(selectIndex);
        if (selectedPrompt) {
          props.onPromptSelect(selectedPrompt);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.prompts.length, selectIndex]);

  if (noPrompts) return null;
  return (
    <div
      onClick={() => props.onPromptSelect(null as any)}
      className="fixed inset-0 z-[99999] bg-[#000000]/50 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[1520px] bg-[#ffffff] dark:bg-[#303C4B30] backdrop-blur-lg px-10 pt-10 rounded-2xl ring-1 ring-[#18BB4E] relative"
      >
        <div className={styles["prompt-hints"]}>
          {props.prompts.map((prompt, i) => (
            <div
              ref={i === selectIndex ? selectedRef : null}
              className={
                styles["prompt-hint"] +
                ` ${i === selectIndex ? styles["prompt-hint-selected"] : ""}` +
                "bg-[#7d7d7d30] hover:!bg-[#7d7d7d4d] !py-5 !px-8 !space-y-1"
              }
              key={prompt.title + i.toString()}
              onClick={() => props.onPromptSelect(prompt)}
              onMouseEnter={() => setSelectIndex(i)}
            >
              <div className={styles["hint-title"] + "text-[#fff]"}>
                {prompt.title}
              </div>
              <div className={styles["hint-content"] + "text-[#ffffffb3]"}>
                {prompt.content}
              </div>
            </div>
          ))}
        </div>
        <div className="h-14 absolute bottom-0 left-0 right-0 w-full bg-gradient-to-b from-transparent via-white/70 to-white dark:via-[#12171bf6] dark:to-[#12171b] z-[1] rounded-2xl"></div>
        <div className="h-20 absolute bottom-0 left-0 right-0 w-full bg-gradient-to-b from-transparent via-white/70 to-white dark:via-[#12171bf6] dark:to-[#12171b] z-[1] rounded-2xl"></div>
      </div>
    </div>
  );
}

function ClearContextDivider() {
  const chatStore = useChatStore();

  return (
    <div
      className={chatStyle["clear-context"]}
      onClick={() =>
        chatStore.updateCurrentSession(
          (session) => (session.clearContextIndex = -1),
        )
      }
    >
      <div className={chatStyle["clear-context-tips"]}>
        {Locale.Context.Clear}
      </div>
      <div className={chatStyle["clear-context-revert-btn"]}>
        {Locale.Context.Revert}
      </div>
    </div>
  );
}

function useScrollToBottom() {
  // for auto-scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollToBottom = () => {
    const dom = scrollRef.current;
    if (dom) {
      setTimeout(() => (dom.scrollTop = dom.scrollHeight), 1);
    }
  };

  // auto scroll
  useLayoutEffect(() => {
    autoScroll && scrollToBottom();
  });

  return {
    scrollRef,
    autoScroll,
    setAutoScroll,
    scrollToBottom,
  };
}

export function ChatActions(props: {
  showPromptModal: () => void;
  scrollToBottom: () => void;
  showPromptHints: () => void;
  onSpeechStart: () => void;
  onBarding: () => void;
  onClauding: () => void;
  onChinese: () => void;
  setSpeaking: (param: boolean) => void;
  hitBottom: boolean;
  recording: boolean;
  barding: boolean;
  clauding: boolean;
  chinese: boolean;
  speaking: boolean;
}) {
  const config = useAppConfig();
  const navigate = useNavigate();
  const chatStore = useChatStore();

  // switch themes
  const theme = config.theme;
  function nextTheme() {
    const themes = [Theme.Auto, Theme.Light, Theme.Dark];
    const themeIndex = themes.indexOf(theme);
    const nextIndex = (themeIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    config.update((config) => (config.theme = nextTheme));
  }

  // stop all responses
  const couldStop = ChatControllerPool.hasPending();
  const stopAll = () => ChatControllerPool.stopAll();

  const playVoiceOfAnswer = () => {
    if ("speechSynthesis" in window) {
      props.setSpeaking(true);
      doSpeechSynthesis(
        chatStore.currentSession().messages[
          chatStore.currentSession().messages.length - 1
        ].content,
        () => {
          props.setSpeaking(false);
        },
      );
    } else {
      toast.error("Does not support speechSynthesis");
    }
  };

  const stopVoiceOfAnswer = () => {
    stopSpeechSysthesis();
    props.setSpeaking(false);
  };

  return (
    <div className={chatStyle["chat-input-actions"]}>
      <Toaster />
      {couldStop && (
        <div
          className={`${chatStyle["chat-input-action"]} clickable`}
          onClick={stopAll}
        >
          <StopIcon />
        </div>
      )}
      {!props.hitBottom && (
        <div
          className={`${chatStyle["chat-input-action"]} clickable`}
          onClick={props.scrollToBottom}
        >
          <BottomIcon />
        </div>
      )}
      {props.hitBottom && (
        <div
          className={`${chatStyle["chat-input-action"]} clickable`}
          onClick={props.showPromptModal}
        >
          <SettingsIcon />
        </div>
      )}

      <div
        className={`${chatStyle["chat-input-action"]} clickable`}
        onClick={nextTheme}
      >
        {theme === Theme.Auto ? (
          <AutoIcon />
        ) : theme === Theme.Light ? (
          <LightIcon />
        ) : theme === Theme.Dark ? (
          <DarkIcon />
        ) : null}
      </div>

      <div
        className={`${chatStyle["chat-input-action"]} clickable`}
        onClick={props.showPromptHints}
      >
        {/* <PromptIcon /> */}
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="magic-stick 1" opacity="0.7">
            <path
              id="Vector"
              d="M16.105 12.855C16.825 12.135 18 12.135 18.72 12.855C19.44 13.575 19.44 14.75 18.72 15.47L7.23005 26.96C6.87005 27.32 6.40005 27.5 5.92505 27.5C5.45005 27.5 4.97505 27.32 4.61505 26.96C3.89505 26.24 3.89505 25.065 4.61505 24.345L16.105 12.855ZM18.015 13.56C17.85 13.395 17.63 13.31 17.415 13.31C17.195 13.31 16.98 13.395 16.815 13.56L13.945 16.43L15.145 17.63L18.015 14.76C18.345 14.43 18.345 13.895 18.015 13.56ZM5.32505 26.25C5.65505 26.58 6.19505 26.58 6.52505 26.25L14.435 18.34L13.235 17.14L5.32505 25.05C4.99005 25.38 4.99005 25.92 5.32505 26.25ZM18.84 8.7C17.97 8.7 16.855 9.815 16.855 10.685C16.855 10.96 16.63 11.185 16.355 11.185C16.08 11.185 15.855 10.96 15.855 10.685C15.855 9.815 14.74 8.7 13.87 8.7C13.595 8.7 13.37 8.475 13.37 8.2C13.37 7.925 13.595 7.7 13.87 7.7C14.74 7.7 15.855 6.585 15.855 5.715C15.855 5.44 16.08 5.215 16.355 5.215C16.63 5.215 16.855 5.44 16.855 5.715C16.855 6.585 17.97 7.7 18.84 7.7C19.115 7.7 19.34 7.925 19.34 8.2C19.34 8.475 19.12 8.7 18.84 8.7ZM16.355 7.185C16.09 7.58 15.735 7.935 15.34 8.2C15.735 8.465 16.09 8.82 16.355 9.215C16.62 8.82 16.975 8.465 17.37 8.2C16.975 7.935 16.625 7.58 16.355 7.185ZM22.44 15.13C22.44 14.26 21.325 13.145 20.455 13.145C20.18 13.145 19.955 12.92 19.955 12.645C19.955 12.37 20.18 12.145 20.455 12.145C21.325 12.145 22.44 11.03 22.44 10.16C22.44 9.885 22.665 9.66 22.94 9.66C23.215 9.66 23.44 9.885 23.44 10.16C23.44 11.03 24.555 12.145 25.425 12.145C25.7 12.145 25.925 12.37 25.925 12.645C25.925 12.92 25.7 13.145 25.425 13.145C24.555 13.145 23.44 14.26 23.44 15.13C23.44 15.405 23.215 15.63 22.94 15.63C22.665 15.63 22.44 15.405 22.44 15.13ZM23.955 12.645C23.56 12.38 23.205 12.025 22.94 11.63C22.675 12.025 22.32 12.38 21.925 12.645C22.32 12.91 22.675 13.265 22.94 13.66C23.205 13.265 23.56 12.91 23.955 12.645ZM19.745 4.985C20.615 4.985 21.73 3.87 21.73 3C21.73 2.725 21.955 2.5 22.23 2.5C22.505 2.5 22.73 2.725 22.73 3C22.73 3.87 23.845 4.985 24.715 4.985C24.99 4.985 25.215 5.21 25.215 5.485C25.215 5.76 24.99 5.985 24.715 5.985C23.845 5.985 22.73 7.1 22.73 7.97C22.73 8.245 22.505 8.47 22.23 8.47C21.955 8.47 21.73 8.245 21.73 7.97C21.73 7.1 20.615 5.985 19.745 5.985C19.47 5.985 19.245 5.76 19.245 5.485C19.245 5.21 19.47 4.985 19.745 4.985ZM22.23 6.5C22.495 6.105 22.85 5.75 23.245 5.485C22.85 5.22 22.495 4.865 22.23 4.47C21.965 4.865 21.61 5.22 21.215 5.485C21.61 5.75 21.965 6.105 22.23 6.5Z"
              fill="black"
            />
          </g>
        </svg>
      </div>

      <div
        className={`${chatStyle["chat-input-action"]} clickable`}
        onClick={() => {
          navigate(Path.Masks);
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id="Vector"
            opacity="0.7"
            d="M2.41271 1.07607L2.41263 1.07624L2.42488 1.08195C5.02331 2.29456 10.5007 3.90376 18.0685 0.886179C18.4415 0.743628 18.8012 0.795384 19.1243 1.0263C19.3866 1.24124 19.5344 1.59879 19.4747 2.01648L18.0582 11.8902C17.4214 16.2682 14.0992 19.3789 10.178 19.3789C6.25706 19.3789 2.93506 16.2687 2.29792 11.8912C2.29787 11.8908 2.29783 11.8905 2.29778 11.8902L0.923047 2.18374L0.922962 2.18315C0.867167 1.79258 1.03066 1.43001 1.34707 1.1999L1.35859 1.19152L1.36961 1.18251C1.66516 0.940691 2.07671 0.908072 2.41271 1.07607ZM12.3518 11.6084L12.3518 11.6083L12.3409 11.6147C10.916 12.454 9.92846 12.4494 9.32348 12.2866C8.78292 12.1413 8.48148 11.854 8.39092 11.7608C7.97045 11.2324 7.1149 11.0978 6.55707 11.5859C6.06025 12.0206 5.88161 12.8642 6.3718 13.4428C6.97231 14.2332 8.24216 15.0455 10.0113 15.0455C11.0702 15.0455 12.3213 14.7239 13.6754 13.9384C14.2983 13.589 14.5329 12.784 14.1586 12.0978L14.148 12.0783L14.1357 12.0598C13.7479 11.4781 12.9649 11.2679 12.3518 11.6084ZM6.30299 5.67053C5.56851 5.67053 4.96965 6.26939 4.96965 7.00386C4.96965 7.73834 5.56851 8.33719 6.30299 8.33719H7.09465C7.82913 8.33719 8.42799 7.73834 8.42799 7.00386C8.42799 6.26939 7.82913 5.67053 7.09465 5.67053H6.30299ZM13.3447 8.33719H14.1363C14.8708 8.33719 15.4697 7.73834 15.4697 7.00386C15.4697 6.26939 14.8708 5.67053 14.1363 5.67053H13.3447C12.6102 5.67053 12.0113 6.26939 12.0113 7.00386C12.0113 7.73834 12.6102 8.33719 13.3447 8.33719Z"
            stroke="black"
          />
        </svg>

        {/* <MaskIcon /> */}
      </div>

      <div
        className={`${chatStyle["chat-input-action"]} clickable`}
        onClick={() => {
          chatStore.updateCurrentSession((session) => {
            if (session.clearContextIndex === session.messages.length) {
              session.clearContextIndex = -1;
            } else {
              session.clearContextIndex = session.messages.length;
              session.memoryPrompt = ""; // will clear memory
            }
          });
        }}
      >
        <svg
          width="29"
          height="28"
          viewBox="0 0 29 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="clear-all 1" opacity="0.7" clip-path="url(#clip0_25_3785)">
            <path
              id="Vector"
              d="M7.25 15.1667H21.75C22.4146 15.1667 22.9583 14.6417 22.9583 14C22.9583 13.3583 22.4146 12.8333 21.75 12.8333H7.25C6.58542 12.8333 6.04167 13.3583 6.04167 14C6.04167 14.6417 6.58542 15.1667 7.25 15.1667ZM4.83333 19.8333H19.3333C19.9979 19.8333 20.5417 19.3083 20.5417 18.6667C20.5417 18.025 19.9979 17.5 19.3333 17.5H4.83333C4.16875 17.5 3.625 18.025 3.625 18.6667C3.625 19.3083 4.16875 19.8333 4.83333 19.8333ZM8.45833 9.33332C8.45833 9.97499 9.00208 10.5 9.66667 10.5H24.1667C24.8313 10.5 25.375 9.97499 25.375 9.33332C25.375 8.69166 24.8313 8.16666 24.1667 8.16666H9.66667C9.00208 8.16666 8.45833 8.69166 8.45833 9.33332Z"
              fill="black"
            />
          </g>
          <defs>
            <clipPath id="clip0_25_3785">
              <rect width="29" height="28" fill="black" />
            </clipPath>
          </defs>
        </svg>

        {/* <BreakIcon /> */}
      </div>

      <div
        className={`${chatStyle["chat-input-action"]} clickable`}
        onClick={props.onSpeechStart}
      >
        {props.recording ? <MicrophoneIconDark /> : <MicrophoneOffIconDark />}
      </div>

      <div
        className={`${chatStyle["chat-input-action"]} clickable`}
        onClick={props.onBarding}
      >
        {props.barding ? <GoogleBardIconDark /> : <GoogleBardOffIconDark />}
      </div>

      <div
        className={`${chatStyle["chat-input-action"]} clickable`}
        onClick={props.onClauding}
      >
        {props.clauding ? <ClaudeIcon className="w-16" /> : <ClaudeOffIcon />}
      </div>

      <div
        className={`${chatStyle["chat-input-action"]} clickable`}
        onClick={props.onChinese}
      >
        {props.chinese ? <ChineseIcon /> : <EnglishIcon />}
      </div>

      <div className={`${chatStyle["chat-input-action"]} clickable`}>
        {props.speaking ? (
          <PlayerStopIcon onClick={stopVoiceOfAnswer} />
        ) : (
          <PlayerIcon onClick={playVoiceOfAnswer} />
        )}
      </div>
    </div>
  );
}

export function Chat() {
  type RenderMessage = ChatMessage & { preview?: boolean };

  const chatStore = useChatStore();
  const [session, sessionIndex] = useChatStore((state) => [
    state.currentSession(),
    state.currentSessionIndex,
  ]);
  const config = useAppConfig();
  const fontSize = config.fontSize;

  const [showExport, setShowExport] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState(false);
  const { submitKey, shouldSubmit } = useSubmitHandler();
  const { scrollRef, setAutoScroll, scrollToBottom } = useScrollToBottom();
  const [hitBottom, setHitBottom] = useState(true);
  const isMobileScreen = useMobileScreen();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") as string;

  const onChatBodyScroll = (e: HTMLElement) => {
    const isTouchBottom = e.scrollTop + e.clientHeight >= e.scrollHeight - 100;
    setHitBottom(isTouchBottom);
  };

  // prompt hints
  const promptStore = usePromptStore();
  const [promptHints, setPromptHints] = useState<Prompt[]>([]);
  const [remainingWords, setRemainingWords] = useState<any>({
    ai_words_limit: 0,
    used_words: "0",
  });
  const [showPromptModal, setShowPromptModal] = useState(false);
  const onSearch = useDebouncedCallback(
    (text: string) => {
      setPromptHints(promptStore.search(text));
    },
    100,
    { leading: true, trailing: true },
  );

  const onPromptSelect = (prompt: Prompt) => {
    setPromptHints([]);
    inputRef.current?.focus();
    setTimeout(() => setUserInput(prompt.content), 60);
  };

  useEffect(() => {
    const payload = new FormData();
    payload.append("user_id", userId);
    const subsOptions = {
      method: "POST",
      body: payload,
    };

    fetch("https://api.openai.com/v1/models", subsOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          setRemainingWords({
            ai_words_limit: result.data.ai_words_limit,
            used_words: result.data.used_words,
          });
        }
      });
  }, []);

  // auto grow input
  const [inputRows, setInputRows] = useState(1);
  const measure = useDebouncedCallback(
    () => {
      const rows = inputRef.current ? autoGrowTextArea(inputRef.current) : 1;
      const inputRows = Math.min(20, Math.max(Number(!isMobileScreen), rows));
      setInputRows(inputRows);
    },
    100,
    {
      leading: true,
      trailing: true,
    },
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(measure, [userInput]);

  // only search prompts when user input is short
  const SEARCH_TEXT_LIMIT = 30;
  const onInput = (text: string) => {
    setUserInput(text);
    const n = text.trim().length;

    // clear search results
    if (n === 0) {
      setPromptHints([]);
    } else if (!config.disablePromptHint && n < SEARCH_TEXT_LIMIT) {
      // check if need to trigger auto completion
      if (text.startsWith("/")) {
        let searchText = text.slice(1);
        onSearch(searchText);
      }
    }
  };

  const doSubmit = (userInput: string, voiceMode: boolean) => {
    if (userInput.trim() === "") return;
    setIsLoading(true);
    chatStore
      .onUserInput(userInput, voiceMode, barding, clauding, onSpeechStart)
      .then(() => {
        setIsLoading(false);
        if (speechRecognition) {
          setRecording(false);
          speechRecognition.stop();
        } else {
          setRecording(false);
          onSpeechError(new Error("not supported"));
        }
      });
    localStorage.setItem(LAST_INPUT_KEY, userInput);
    setUserInput("");
    setPromptHints([]);
    if (!isMobileScreen) inputRef.current?.focus();
    setAutoScroll(true);
  };

  // stop response
  const onUserStop = (messageId: number) => {
    ChatControllerPool.stop(sessionIndex, messageId);
  };

  useEffect(() => {
    chatStore.updateCurrentSession((session) => {
      const stopTiming = Date.now() - REQUEST_TIMEOUT_MS;
      session.messages.forEach((m) => {
        // check if should stop all stale messages
        if (m.isError || new Date(m.date).getTime() < stopTiming) {
          if (m.streaming) {
            m.streaming = false;
          }

          if (m.content.length === 0) {
            m.isError = true;
            m.content = prettyObject({
              error: true,
              message: "empty response",
            });
          }
        }
      });

      // auto sync mask config from global config
      if (session.mask.syncGlobalConfig) {
        session.mask.modelConfig = { ...config.modelConfig };
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // check if should send message
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if ArrowUp and no userInput, fill with last input
    if (
      e.key === "ArrowUp" &&
      userInput.length <= 0 &&
      !(e.metaKey || e.altKey || e.ctrlKey)
    ) {
      setUserInput(localStorage.getItem(LAST_INPUT_KEY) ?? "");
      e.preventDefault();
      return;
    }
    if (shouldSubmit(e) && promptHints.length === 0) {
      doSubmit(userInput, false);
      e.preventDefault();
    }
  };
  const onRightClick = (e: any, message: ChatMessage) => {
    // copy to clipboard
    if (selectOrCopy(e.currentTarget, message.content)) {
      e.preventDefault();
    }
  };

  //recording

  const [recording, setRecording] = useState(false);
  const [barding, setBarding] = useState(false);
  const [clauding, setClauding] = useState(false);
  const [chinese, setChinese] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [duckduckgo, setDuckDuckGo] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechLog, setSpeechLog] = useState<string | null>(null);

  const onSpeechError = useCallback((e: any) => {
    setSpeechError(e.message);
    try {
      speechRecognition?.stop();
    } catch (e) {}
    setRecording(false);
  }, []);

  const onSpeechStart = useCallback(async () => {
    let granted = false;
    let denied = false;

    try {
      const result = await navigator.permissions.query({
        name: "microphone" as any,
      });
      if (result.state == "granted") {
        granted = true;
      } else if (result.state == "denied") {
        denied = true;
      }
    } catch (e) {
      console.log(e);
    }

    if (!granted && !denied) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        granted = true;
      } catch (e) {
        denied = true;
      }
    }

    if (denied) {
      onSpeechError(new Error("speech permission was not granted"));
      return;
    }

    try {
      if (!recording) {
        setSpeechRecognition();
        if (speechRecognition) {
          speechRecognition.interimResults = false;
          speechRecognition.continuous = false;
          speechRecognition.maxAlternatives = 1;
          speechRecognition.lang = chinese ? "zh-CN" : "en-US";
          speechRecognition.onresult = (event) => {
            let transcript = "";
            if (
              event.results[event.results.length - 1].isFinal &&
              event.results[event.results.length - 1][0].confidence
            ) {
              transcript +=
                event.results[event.results.length - 1][0].transcript;
            }
            if (/*transcript != ""*/ 1) {
              doSubmit(transcript, true);
            }
          };
          speechRecognition.onstart = () => {
            setRecording(true);
          };
          speechRecognition.onend = () => {
            setRecording(false);
            if (speechRecognition) speechRecognition.stop();
          };
          speechRecognition.start();
        } else {
          onSpeechError(new Error("1not supported"));
        }
      } else {
        if (speechRecognition) {
          speechRecognition.stop();
          setRecording(false);
        } else {
          setRecording(false);
          onSpeechError(new Error("2not supported"));
        }
      }
    } catch (e) {
      setRecording(false);
      onSpeechError(e);
    }
  }, [recording, onSpeechError]);

  useEffect(() => {
    if (speechError) toast(speechError);
  }, [speechError]);
  useEffect(() => {
    if (speechLog) toast(speechLog);
  }, [speechLog]);

  const findLastUserIndex = (messageId: number) => {
    // find last user input message and resend
    let lastUserMessageIndex: number | null = null;
    for (let i = 0; i < session.messages.length; i += 1) {
      const message = session.messages[i];
      if (message.id === messageId) {
        break;
      }
      if (message.role === "user") {
        lastUserMessageIndex = i;
      }
    }

    return lastUserMessageIndex;
  };

  const deleteMessage = (userIndex: number) => {
    chatStore.updateCurrentSession((session) =>
      session.messages.splice(userIndex, 2),
    );
  };

  const onDelete = (botMessageId: number) => {
    const userIndex = findLastUserIndex(botMessageId);
    if (userIndex === null) return;
    deleteMessage(userIndex);
  };

  const onResend = (botMessageId: number) => {
    // find last user input message and resend
    const userIndex = findLastUserIndex(botMessageId);
    if (userIndex === null) return;

    setIsLoading(true);
    const content = session.messages[userIndex].content;
    deleteMessage(userIndex);
    chatStore
      .onUserInput(content, false, barding, clauding, onSpeechStart)
      .then(() => setIsLoading(false));
    inputRef.current?.focus();
  };

  const context: RenderMessage[] = session.mask.hideContext
    ? []
    : session.mask.context.slice();

  const accessStore = useAccessStore();

  if (
    context.length === 0 &&
    session.messages.at(0)?.content !== BOT_HELLO.content
  ) {
    const copiedHello = Object.assign({}, BOT_HELLO);
    if (!accessStore.isAuthorized()) {
      copiedHello.content = Locale.Error.Unauthorized;
    }
    context.push(copiedHello);
  }

  // clear context index = context length + index in messages
  const clearContextIndex =
    (session.clearContextIndex ?? -1) >= 0
      ? session.clearContextIndex! + context.length
      : -1;

  // preview messages
  const messages = context
    .concat(session.messages as RenderMessage[])
    .concat(
      isLoading
        ? [
            {
              ...createMessage({
                role: "assistant",
                content: "……",
              }),
              preview: true,
            },
          ]
        : [],
    )
    .concat(
      userInput.length > 0 && config.sendPreviewBubble
        ? [
            {
              ...createMessage({
                role: "user",
                content: userInput,
              }),
              preview: true,
            },
          ]
        : [],
    );

  const renameSession = () => {
    const newTopic = prompt(Locale.Chat.Rename, session.topic);
    if (newTopic && newTopic !== session.topic) {
      chatStore.updateCurrentSession((session) => (session.topic = newTopic!));
    }
  };

  const location = useLocation();
  const isChat = location.pathname === Path.Chat;
  const autoFocus = !isMobileScreen || isChat; // only focus in chat page

  useCommand({
    fill: setUserInput,
    submit: (text) => {
      doSubmit(text, false);
    },
  });

  return (
    <div className="bg-[#ebebeb] dark:bg-[#202227] flex justify-center w-full h-screen min-h-fit p-3 md:p-6 lg:gap-6">
      <SideBar />
      <div className="w-full flex-1 h-full">
        <div className="rounded-[10px] bg-white dark:bg-[#0E0F13] p-3 md:p-4 h-full flex flex-col overflow-auto">
          <SubAlertModal
            modalState={modalState}
            setModalState={setModalState}
          />
          <div className="pt-8 px-3 md:p-4">
            <div
              className="font-bold dark:text-white text-[28px] tracking-[0] leading-[normal]"
              onClickCapture={renameSession}
            >
              {!session.topic ? DEFAULT_TOPIC : session.topic}
            </div>
            <div className="left-0  font-medium text-[#808080] dark:text-white text-sm tracking-[0] leading-[26px] whitespace-nowrap">
              {Locale.Chat.SubTitle(session.messages.length)}
            </div>
          </div>
          {/* <div className="window-header">
            <div className="window-header-title">
              <div
                className={`window-header-main-title " ${styles["chat-body-title"]}`}
                onClickCapture={renameSession}
              >
                {!session.topic ? DEFAULT_TOPIC : session.topic}
              </div>
            </div>
            <div className="window-actions">
              <div className={"window-action-button" + " " + styles.mobile}>
                <IconButton
                  icon={<ReturnIcon />}
                  bordered
                  title={Locale.Chat.Actions.ChatList}
                  onClick={() => navigate(Path.Home)}
                />
              </div>
              <div className="window-action-button">
                <IconButton
                  icon={<RenameIcon />}
                  bordered
                  onClick={renameSession}
                />
              </div>
              <div className="window-action-button">
                <IconButton
                  icon={<ExportIcon />}
                  bordered
                  title={Locale.Chat.Actions.Export}
                  onClick={() => {
                    setShowExport(true);
                  }}
                />
              </div>
              {!isMobileScreen && (
                <div className="window-action-button">
                  <IconButton
                    icon={config.tightBorder ? <MinIcon /> : <MaxIcon />}
                    bordered
                    onClick={() => {
                      config.update(
                        (config) => (config.tightBorder = !config.tightBorder),
                      );
                    }}
                  />
                </div>
              )}
              <IconButton
                text={Locale.Chat.Actions.Logout}
                onClick={() => {
                  localStorage.clear();
                  navigate(Path.Login);
                }}
              />
            </div>

            <PromptToast
              showToast={!hitBottom}
              showModal={showPromptModal}
              setShowModal={setShowPromptModal}
            />
          </div> */}
          <div className="flex-1 w-full overflow-auto">
            <div
              className="h-full"
              ref={scrollRef}
              onScroll={(e) => onChatBodyScroll(e.currentTarget)}
              onMouseDown={() => inputRef.current?.blur()}
              onWheel={(e) => setAutoScroll(hitBottom && e.deltaY > 0)}
              onTouchStart={() => {
                inputRef.current?.blur();
                setAutoScroll(false);
              }}
            >
              {messages.map((message, i) => {
                const isUser = message.role === "user";
                const showActions =
                  !isUser &&
                  i > 0 &&
                  !(message.preview || message.content.length === 0);
                const showTyping = message.preview || message.streaming;

                const shouldShowClearContextDivider: boolean =
                  i === clearContextIndex - 1;

                return (
                  <>
                    <div key={i}>
                      <div className="flex items-start w-full mt-4 gap-4">
                        <div>
                          {message.role === "user" ? (
                            <Avatar avatar={config.avatar} />
                          ) : (
                            <MaskAvatar mask={session.mask} />
                          )}
                        </div>
                        {showTyping && (
                          <div className="font-[12px] mt-[5px]">
                            {Locale.Chat.Typing}
                          </div>
                        )}
                        <div
                          className={
                            message.role === "user"
                              ? "w-full max-w-6xl dark:text-white bg-[#EEEEEE] dark:bg-[#202227] py-3 px-4 rounded-lg"
                              : "w-full max-w-6xl dark:text-white bg-[#EEEEEE] dark:bg-[#1A1D15] py-3 px-4 rounded-lg"
                          }
                        >
                          {showActions && (
                            <div className="flex flex-row-reverse w-full pt-[5px] box-border">
                              {message.streaming ? (
                                <div
                                  className="flex flex-wrap mt-3 mb-0"
                                  onClick={() => onUserStop(message.id ?? i)}
                                >
                                  {Locale.Chat.Actions.Stop}
                                </div>
                              ) : (
                                <>
                                  {/* <div
                                  className=""
                                  onClick={() => onDelete(message.id ?? i)}
                                >
                                  {Locale.Chat.Actions.Delete}
                                </div> */}
                                  {/* <div
                                  className=""
                                  onClick={() => onResend(message.id ?? i)}
                                >
                                  {Locale.Chat.Actions.Retry}
                                </div> */}
                                </>
                              )}

                              <div
                                className=""
                                onClick={() => copyToClipboard(message.content)}
                              >
                                <img src="/images/copy.svg" />
                              </div>
                            </div>
                          )}
                          <Markdown
                            content={message.content}
                            loading={
                              (message.preview ||
                                message.content.length === 0) &&
                              !isUser
                            }
                            onContextMenu={(e: any) => onRightClick(e, message)}
                            onDoubleClickCapture={() => {
                              if (!isMobileScreen) return;
                              setUserInput(message.content);
                            }}
                            fontSize={fontSize}
                            parentRef={scrollRef}
                            color={"text-white"}
                            defaultShow={i >= messages.length - 10}
                          />
                        </div>
                      </div>
                      {!isUser && !message.preview && (
                        <div className="flex justify-end box-border font-[12px]">
                          <div className="text-[#aaa] text-sm">
                            {message.date.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                    {shouldShowClearContextDivider && <ClearContextDivider />}
                  </>
                );
              })}
            </div>
          </div>
          {/* <div className="border-t border-[#a1a1a1] dark:border-[#444444] rounded-2xl pt-4 px-2 md:p-4 ">
            <div>
              <PromptHints
                prompts={promptHints}
                onPromptSelect={onPromptSelect}
              />

              <ChatActions
                showPromptModal={() => setShowPromptModal(true)}
                scrollToBottom={scrollToBottom}
                hitBottom={hitBottom}
                recording={recording}
                barding={barding}
                clauding={clauding}
                chinese={chinese}
                speaking={speaking}
                duckduckgoing={duckduckgo}
                showPromptHints={() => {
                  // Click again to close
                  if (promptHints.length > 0) {
                    setPromptHints([]);
                    return;
                  }

                  inputRef.current?.focus();
                  setUserInput("/");
                  onSearch("");
                }}
                onSpeechStart={onSpeechStart}
                onBarding={() => {
                  setClauding(false);
                  setBarding(!barding);
                }}
                onChinese={() => setChinese(!chinese)}
                onClauding={() => {
                  setClauding(!clauding);
                  setBarding(false);
                }}
                onDuckDuckGo={() => setDuckDuckGo(!duckduckgo)}
                setSpeaking={setSpeaking}
              />
              <div className={styles["chat-input-panel-inner" + "w-full"]}>
                <div className="ring-1 ring-[#a1a1a1] dark:ring-[#33363E] flex items-start gap-3 p-2 rounded-xl">
                  <textarea
                    ref={inputRef}
                    className="h-full w-full  bg-white dark:bg-[#0E0F13] p-2 outline-none max-h-[200px] overflow-y-scroll resize-none"
                    placeholder={Locale.Chat.Input(submitKey)}
                    onInput={(e) => onInput(e.currentTarget.value)}
                    value={userInput}
                    onKeyDown={onInputKeyDown}
                    onFocus={() => setAutoScroll(true)}
                    onBlur={() => setAutoScroll(false)}
                    rows={inputRows}
                    autoFocus={autoFocus}
                  />
                  <button onClick={() => doSubmit(userInput, false)}>
                    <img
                      src="/images/send.svg"
                      className="m-2 w-[28px] h-[28px]"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div
            className={styles["chat-body"]}
            ref={scrollRef}
            onScroll={(e) => onChatBodyScroll(e.currentTarget)}
            onMouseDown={() => inputRef.current?.blur()}
            onWheel={(e) => setAutoScroll(hitBottom && e.deltaY > 0)}
            onTouchStart={() => {
              inputRef.current?.blur();
              setAutoScroll(false);
            }}
          >
            {messages.map((message, i) => {
              const isUser = message.role === "user";
              const showActions =
                !isUser &&
                i > 0 &&
                !(message.preview || message.content.length === 0);
              const showTyping = message.preview || message.streaming;

              const shouldShowClearContextDivider: boolean =
                i === clearContextIndex - 1;

              return (
                <>
                  <div
                    key={i}
                    className={
                      isUser
                        ? styles["chat-message-user"]
                        : styles["chat-message"]
                    }
                  >
                    <div className={styles["chat-message-container"]}>
                      <div className={styles["chat-message-avatar"]}>
                        {message.role === "user" ? (
                          <Avatar avatar={config.avatar} />
                        ) : (
                          <MaskAvatar mask={session.mask} />
                        )}
                      </div>
                      {showTyping && (
                        <div className={styles["chat-message-status"]}>
                          {Locale.Chat.Typing}
                        </div>
                      )}
                      <div className={styles["chat-message-item"]}>
                        {showActions && (
                          <div className={styles["chat-message-top-actions"]}>
                            {message.streaming ? (
                              <div
                                className={styles["chat-message-top-action"]}
                                onClick={() => onUserStop(message.id ?? i)}
                              >
                                {Locale.Chat.Actions.Stop}
                              </div>
                            ) : (
                              <>
                                <div
                                  className={styles["chat-message-top-action"]}
                                  onClick={() => onDelete(message.id ?? i)}
                                >
                                  {Locale.Chat.Actions.Delete}
                                </div>
                                <div
                                  className={styles["chat-message-top-action"]}
                                  onClick={() => onResend(message.id ?? i)}
                                >
                                  {Locale.Chat.Actions.Retry}
                                </div>
                              </>
                            )}

                            <div
                              className={styles["chat-message-top-action"]}
                              onClick={() => copyToClipboard(message.content)}
                            >
                              {Locale.Chat.Actions.Copy}
                            </div>
                          </div>
                        )}
                        <Markdown
                          content={message.content}
                          loading={
                            (message.preview || message.content.length === 0) &&
                            !isUser
                          }
                          onContextMenu={(e: any) => onRightClick(e, message)}
                          onDoubleClickCapture={() => {
                            if (!isMobileScreen) return;
                            setUserInput(message.content);
                          }}
                          fontSize={fontSize}
                          parentRef={scrollRef}
                          defaultShow={i >= messages.length - 10}
                        />
                      </div>
                      {!isUser && !message.preview && (
                        <div className={styles["chat-message-actions"]}>
                          <div className={styles["chat-message-action-date"]}>
                            {message.date.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {shouldShowClearContextDivider && <ClearContextDivider />}
                </>
              );
            })}
          </div> */}

          <div className={styles["chat-input-panel"]}>
            <PromptHints
              prompts={promptHints}
              onPromptSelect={onPromptSelect}
            />

            <ChatActions
              showPromptModal={() => setShowPromptModal(true)}
              scrollToBottom={scrollToBottom}
              hitBottom={hitBottom}
              recording={recording}
              barding={barding}
              clauding={clauding}
              chinese={chinese}
              speaking={speaking}
              showPromptHints={() => {
                // Click again to close
                if (promptHints.length > 0) {
                  setPromptHints([]);
                  return;
                }

                inputRef.current?.focus();
                setUserInput("/");
                onSearch("");
              }}
              onSpeechStart={onSpeechStart}
              onBarding={() => {
                setClauding(false);
                setBarding(!barding);
              }}
              onChinese={() => setChinese(!chinese)}
              onClauding={() => {
                setClauding(!clauding);
                setBarding(false);
              }}
              setSpeaking={setSpeaking}
            />
            <div className={styles["chat-input-panel-inner"]}>
              <textarea
                ref={inputRef}
                className={styles["chat-input"]}
                placeholder={Locale.Chat.Input(submitKey)}
                onInput={(e) => onInput(e.currentTarget.value)}
                value={userInput}
                onKeyDown={onInputKeyDown}
                onFocus={() => setAutoScroll(true)}
                onBlur={() => setAutoScroll(false)}
                rows={inputRows}
                autoFocus={autoFocus}
              />
              <IconButton
                icon={<SendWhiteIcon />}
                text={Locale.Chat.Send}
                className={styles["chat-input-send"]}
                type="primary"
                onClick={() => doSubmit(userInput, false)}
              />
            </div>
          </div>
          {showExport && (
            <ExportMessageModal onClose={() => setShowExport(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
