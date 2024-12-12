import { IconButton } from "./button";
import { ErrorBoundary } from "./error";

import styles from "./mask.module.scss";

import { Copy, Download } from "lucide-react";
import EditIconDark from "../icons/edit-dark.svg";
import EditIcon from "../icons/edit.svg";
import AddIcon from "../icons/add-dark.svg";
import ChatIconDark from "../icons/hipchat-dark.svg";
import ChatIcon from "../icons/hipchat.svg";
import DeleteIcon from "../icons/delete.svg";
import DeleteIconDark from "../icons/delete-dark.svg";
import EyeIconDark from "../icons/eye-white.svg";
import EyeIcon from "../icons/eye.svg";
import SearchIcon from "../icons/search.svg";
import CirclePlus from "../icons/circle-plus.svg";

import { DEFAULT_MASK_AVATAR, Mask, useMaskStore } from "../store/mask";
import { ChatMessage, ModelConfig, useAppConfig, useChatStore } from "../store";
import { ROLES } from "../client/api";
import { Input, List, ListItem, Modal, Popover } from "./ui-lib";
import { Avatar, AvatarPicker } from "./emoji";
import Locale, { AllLangs, ALL_LANG_OPTIONS, Lang } from "../locales";
import { useNavigate } from "react-router-dom";

import chatStyle from "./chat.module.scss";
import { useEffect, useState } from "react";
import { downloadAs, readFromFile } from "../utils";
import { Updater } from "../typing";
import { ModelConfigList } from "./model-config";
import { FileName, Path } from "../constant";
import { BUILTIN_MASK_STORE } from "../masks";
import { SideBar } from "./sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";

export function MaskAvatar(props: { mask: Mask }) {
  return props.mask.avatar !== DEFAULT_MASK_AVATAR ? (
    <Avatar avatar={props.mask.avatar} />
  ) : (
    <Avatar model={props.mask.modelConfig.model} />
  );
}

export function MaskConfig(props: {
  mask: Mask;
  updateMask: Updater<Mask>;
  extraListItems?: JSX.Element;
  readonly?: boolean;
  shouldSyncFromGlobal?: boolean;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const updateConfig = (updater: (config: ModelConfig) => void) => {
    if (props.readonly) return;

    const config = { ...props.mask.modelConfig };
    updater(config);
    props.updateMask((mask) => {
      mask.modelConfig = config;
      // if user changed current session mask, it will disable auto sync
      mask.syncGlobalConfig = false;
    });
  };

  const globalConfig = useAppConfig();

  return (
    <>
      <ContextPrompts
        context={props.mask.context}
        updateContext={(updater) => {
          const context = props.mask.context.slice();
          updater(context);
          props.updateMask((mask) => (mask.context = context));
        }}
      />
      <div className="md:px-2 lg:px-7">
        <div className="mt-10 border-t pt-3 px-2 md:px-5 border-[#D2D2D2] dark:border-[#474747] rounded-2xl space-y-3">
          <List>
            <ListItem
              title={Locale.Mask.Config.Avatar}
              className="bg-[#7D7D7D30] !px-10 !py-5 rounded-[10px] mt-2"
            >
              <Popover
                content={
                  <AvatarPicker
                    onEmojiClick={(emoji) => {
                      props.updateMask((mask) => (mask.avatar = emoji));
                      setShowPicker(false);
                    }}
                  ></AvatarPicker>
                }
                open={showPicker}
                onClose={() => setShowPicker(false)}
              >
                <div
                  onClick={() => setShowPicker(true)}
                  style={{ cursor: "pointer" }}
                >
                  <MaskAvatar mask={props.mask} />
                </div>
              </Popover>
            </ListItem>
            <ListItem
              title={Locale.Mask.Config.Name}
              className="bg-[#7D7D7D30] !px-10 !py-5 rounded-[10px] mt-2"
            >
              <input
                type="text"
                className="ring-1 ring-[#69A606] w-full max-w-[228px] py-2 px-3 outline-none rounded-lg bg-transparent"
                value={props.mask.name}
                onInput={(e) =>
                  props.updateMask((mask) => {
                    mask.name = e.currentTarget.value;
                  })
                }
              ></input>
            </ListItem>
            <ListItem
              className="bg-[#7D7D7D30] !px-10 !py-5 rounded-[10px] mt-2"
              title={Locale.Mask.Config.HideContext.Title}
              subTitle={Locale.Mask.Config.HideContext.SubTitle}
            >
              <input
                type="checkbox"
                className="peer cursor-pointer relative h-10 w-10 p-4 shrink-0 appearance-none rounded-lg bg-transparent border border-[#69A606] after:absolute after:left-0 after:top-0 after:h-full after:w-full checked:after:bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAETSURBVHgB7ZU9TsNAEIXfW8s/0GBu4HR0NByAG0RIFJFpkgpT4SNwA0IRAVVEQaiQyAkQPQU3AE6A6cJa9rBrIcSfUH6czl8xmllpn0ZTvEf8QTpEmHvBGqbA1ZPXfg/Zz3d+HfYv3UNFpqaNMAMCPBFydBrnF7+Ek5F7S3AbC1ACN+ex3rG9Y8vByD02oh0siNlyY2uXuL8u75gMEdH3HlEXIpmv85ZyVrxN1AkZvvluWxWFrGMJKCyJRrgRboT/Eyad+gzoA6E8V35sbPPFuEeIGrCmfxbrVnUKpdhFTTiCtNK0ZdDRY4qNJMkwN/avdAd7emynb5mXXAWRsGir0kQUpzyNMXYhHoLJ6km/l30u9g5sm0xb/aISiAAAAABJRU5ErkJggg==')] after:bg-[length:19px] after:bg-center after:bg-no-repeat after:content-[''] focus:outline-none"
                checked={props.mask.hideContext}
                onChange={(e) => {
                  props.updateMask((mask) => {
                    mask.hideContext = e.currentTarget.checked;
                  });
                }}
              ></input>
            </ListItem>
            {props.shouldSyncFromGlobal ? (
              <ListItem
                title={Locale.Mask.Config.Sync.Title}
                subTitle={Locale.Mask.Config.Sync.SubTitle}
              >
                <input
                  type="checkbox"
                  className="peer cursor-pointer relative h-10 w-10 p-4 shrink-0 appearance-none rounded-lg bg-transparent border border-[#69A606] after:absolute after:left-0 after:top-0 after:h-full after:w-full checked:after:bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAETSURBVHgB7ZU9TsNAEIXfW8s/0GBu4HR0NByAG0RIFJFpkgpT4SNwA0IRAVVEQaiQyAkQPQU3AE6A6cJa9rBrIcSfUH6czl8xmllpn0ZTvEf8QTpEmHvBGqbA1ZPXfg/Zz3d+HfYv3UNFpqaNMAMCPBFydBrnF7+Ek5F7S3AbC1ACN+ex3rG9Y8vByD02oh0siNlyY2uXuL8u75gMEdH3HlEXIpmv85ZyVrxN1AkZvvluWxWFrGMJKCyJRrgRboT/Eyad+gzoA6E8V35sbPPFuEeIGrCmfxbrVnUKpdhFTTiCtNK0ZdDRY4qNJMkwN/avdAd7emynb5mXXAWRsGir0kQUpzyNMXYhHoLJ6km/l30u9g5sm0xb/aISiAAAAABJRU5ErkJggg==')] after:bg-[length:19px] after:bg-center after:bg-no-repeat after:content-[''] focus:outline-none"
                  checked={props.mask.syncGlobalConfig}
                  onChange={(e) => {
                    if (
                      e.currentTarget.checked &&
                      confirm(Locale.Mask.Config.Sync.Confirm)
                    ) {
                      props.updateMask((mask) => {
                        mask.syncGlobalConfig = e.currentTarget.checked;
                        mask.modelConfig = { ...globalConfig.modelConfig };
                      });
                    }
                  }}
                ></input>
              </ListItem>
            ) : null}
          </List>
        </div>
        <div className="mt-10 border-t pt-3 px-2 md:px-5  border-[#D2D2D2] dark:border-[#474747] rounded-2xl space-y-3">
          <List>
            <ModelConfigList
              isColorInverted={true}
              modelConfig={{ ...props.mask.modelConfig }}
              updateConfig={updateConfig}
            />
            {props.extraListItems}
          </List>
        </div>
      </div>
    </>
  );
}

function ContextPromptItem(props: {
  prompt: ChatMessage;
  update: (prompt: ChatMessage) => void;
  remove: () => void;
}) {
  const [focusingInput, setFocusingInput] = useState(false);
  const { theme } = useTheme();
  return (
    <div className={chatStyle["context-prompt-row"] + " flex-col sm:flex-row"}>
      <Select
        value={props.prompt.role}
        onValueChange={(e) =>
          props.update({
            ...props.prompt,
            role: e as any,
          })
        }
      >
        <SelectTrigger className="w-[180px] h-[50px]">
          <SelectValue placeholder="Submit Key" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="all" value={Locale.Settings.Lang.All}>
            {Locale.Settings.Lang.All}
          </SelectItem>
          {ROLES.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative bg-[#7D7D7D30] backdrop-blur-lg rounded-xl focus-within:ring-[1px] transition-all duration-300 w-full flex items-start py-3 pl-3 pr-10 min-h-[140px] max-h-[155px] h-fit">
        <Input
          value={props.prompt.content}
          type="text"
          rows={5}
          className={chatStyle["context-content"]}
          onFocus={() => setFocusingInput(true)}
          onBlur={() => setFocusingInput(false)}
          onInput={(e) =>
            props.update({
              ...props.prompt,
              content: e.currentTarget.value as any,
            })
          }
        />
        {!focusingInput && (
          <div className="absolute top-0 right-0">
            <IconButton
              icon={theme === "dark" ? <DeleteIconDark /> : <DeleteIcon />}
              className={chatStyle["context-delete-button"]}
              onClick={() => props.remove()}
              bordered
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function ContextPrompts(props: {
  context: ChatMessage[];
  updateContext: (updater: (context: ChatMessage[]) => void) => void;
}) {
  const context = props.context;

  const addContextPrompt = (prompt: ChatMessage) => {
    props.updateContext((context) => context.push(prompt));
  };

  const removeContextPrompt = (i: number) => {
    props.updateContext((context) => context.splice(i, 1));
  };

  const updateContextPrompt = (i: number, prompt: ChatMessage) => {
    props.updateContext((context) => (context[i] = prompt));
  };

  return (
    <>
      <div
        className={
          chatStyle["context-prompt"] +
          " min-[600px]:px-2 md:px-6 lg:px-10 mt-5 md:mt-10"
        }
        style={{ marginBottom: 20 }}
      >
        {context.map((c, i) => (
          <ContextPromptItem
            key={i}
            prompt={c}
            update={(prompt) => updateContextPrompt(i, prompt)}
            remove={() => removeContextPrompt(i)}
          />
        ))}
        <div className={chatStyle["context-prompt-row"]}>
          <IconButton
            icon={<AddIcon />}
            text={Locale.Context.Add}
            bordered
            className={chatStyle["context-prompt-button"]}
            onClick={() =>
              addContextPrompt({
                role: "user",
                content: "",
                date: "",
              })
            }
          />
        </div>
      </div>
    </>
  );
}

export function MaskPage() {
  const navigate = useNavigate();

  const maskStore = useMaskStore();
  const chatStore = useChatStore();

  const [filterLang, setFilterLang] = useState<Lang>();

  const allMasks = maskStore
    .getAll()
    .filter((m) => !filterLang || m.lang === filterLang);

  const [searchMasks, setSearchMasks] = useState<Mask[]>([]);
  const [searchText, setSearchText] = useState("");
  const masks = searchText.length > 0 ? searchMasks : allMasks;

  // simple search, will refactor later
  const onSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 0) {
      const result = allMasks.filter((m) => m.name.includes(text));
      setSearchMasks(result);
    } else {
      setSearchMasks(allMasks);
    }
  };

  const [editingMaskId, setEditingMaskId] = useState<number | undefined>();
  const editingMask =
    maskStore.get(editingMaskId) ?? BUILTIN_MASK_STORE.get(editingMaskId);
  const closeMaskModal = () => setEditingMaskId(undefined);

  const downloadAll = () => {
    downloadAs(JSON.stringify(masks), FileName.Masks);
  };

  const importFromFile = () => {
    readFromFile().then((content) => {
      try {
        const importMasks = JSON.parse(content);
        if (Array.isArray(importMasks)) {
          for (const mask of importMasks) {
            if (mask.name) {
              maskStore.create(mask);
            }
          }
          return;
        }
        //if the content is a single mask.
        if (importMasks.name) {
          maskStore.create(importMasks);
        }
      } catch {}
    });
  };

  const { theme } = useTheme();

  return (
    <ErrorBoundary>
      <div className="bg-[#ebebeb] dark:bg-[#202227] flex flex-row items-start justify-center w-full p-2 md:p-5 lg:gap-6 h-screen">
        <SideBar />
        <div className="w-full">
          <div className="rounded-[10px] bg-white dark:bg-[#0E0F13] pt-14 p-3 xl:p-8 height-container overflow-y-auto">
            <div className="window-header">
              <div className="window-header-title">
                <div className="text-[#353535] dark:text-white text-[28px] font-extrabold font-['Mulish']">
                  {Locale.Mask.Page.Title}
                </div>
                <div className="text-[#a3a3a3] text-base font-medium font-['Mulish'] leading-relaxed">
                  {Locale.Mask.Page.SubTitle(allMasks.length)}
                </div>
              </div>

              {/* <div className="window-actions">
                <div className="window-action-button">
                  <IconButton
                    icon={<DownloadIcon />}
                    bordered
                    onClick={downloadAll}
                  />
                </div>
                <div className="window-action-button">
                  <IconButton
                    icon={<UploadIcon />}
                    bordered
                    onClick={() => importFromFile()}
                  />
                </div>
                <div className="window-action-button">
                  <IconButton
                    icon={<CloseIcon />}
                    bordered
                    onClick={() => navigate(-1)}
                  />
                </div>
              </div> */}
            </div>

            <div className="mt-4">
              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-full bg-[#7d7d7d30] rounded-[10px] pl-4 h-[50px] flex gap-3 items-center">
                  <SearchIcon />
                  <input
                    type="text"
                    className="w-full h-full outline-none bg-transparent"
                    placeholder={Locale.Mask.Page.Search}
                    autoFocus
                    onInput={(e) => onSearch(e.currentTarget.value)}
                  />
                </div>
                <div className="flex gap-5">
                  <Select
                    value={filterLang ?? Locale.Settings.Lang.All}
                    onValueChange={(e) => {
                      const value = e;
                      if (value === Locale.Settings.Lang.All) {
                        setFilterLang(undefined);
                      } else {
                        setFilterLang(value as Lang);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full h-[50px]">
                      <SelectValue placeholder="Submit Key" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="all" value={Locale.Settings.Lang.All}>
                        {Locale.Settings.Lang.All}
                      </SelectItem>
                      {AllLangs.map((lang) => (
                        <SelectItem value={lang} key={lang}>
                          {ALL_LANG_OPTIONS[lang]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <button
                    className="bg-lime-600 flex p-3 justify-center items-center gap-2 rounded-[10px] px-10 text-white"
                    onClick={() => {
                      const createdMask = maskStore.create();
                      setEditingMaskId(createdMask.id);
                    }}
                  >
                    <CirclePlus />
                    {Locale.Mask.Page.Create}
                  </button>
                </div>
              </div>

              <div className="mt-10 border-t pt-5 px-2 xl:px-5 border-[#D2D2D2] dark:border-[#474747] rounded-2xl space-y-3">
                {masks.map((m) => (
                  <div className="flex w-full rounded-[10px]" key={m.id}>
                    <div className="bg-[#7d7d7d30] flex-col md:flex-row flex items-end md:items-center gap-5 justify-between w-full rounded-[10px] px-5 py-3">
                      <div className="flex w-full rounded-[10px]">
                        <div className="items-center content-center grid pr-3 pl-3">
                          <div className="items-center justify-center bg-zinc-500 bg-opacity-20 rounded-[8px] w-[50px] h-[50px] grid place-content-center">
                            <MaskAvatar mask={m} />
                          </div>
                        </div>
                        <div className="p-3">
                          <div className={styles["mask-name"]}>{m.name}</div>
                          <div className="text-[#353535] dark:!text-[#FFFFFF90] !text-[14px] one-line">
                            {`${Locale.Mask.Item.Info(m.context.length)} / ${
                              ALL_LANG_OPTIONS[m.lang]
                            } / ${m.modelConfig.model}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="border-lime-600 border rounded-[10px] grid content-center h-[45px] w-[100px]">
                          <IconButton
                            icon={
                              theme === "dark" ? <ChatIconDark /> : <ChatIcon />
                            }
                            text={Locale.Mask.Item.Chat}
                            onClick={() => {
                              chatStore.newSession(m);
                              navigate(Path.Chat);
                            }}
                          />
                        </div>
                        <div className="border-lime-600 border rounded-[10px] grid content-center h-[45px] w-[100px]">
                          {m.builtin ? (
                            <IconButton
                              icon={
                                theme === "dark" ? <EyeIconDark /> : <EyeIcon />
                              }
                              text={Locale.Mask.Item.View}
                              onClick={() => setEditingMaskId(m.id)}
                            />
                          ) : (
                            <IconButton
                              icon={
                                theme === "dark" ? (
                                  <EditIconDark />
                                ) : (
                                  <EditIcon />
                                )
                              }
                              text={Locale.Mask.Item.Edit}
                              onClick={() => setEditingMaskId(m.id)}
                            />
                          )}
                        </div>
                        {!m.builtin && (
                          <div className="border-lime-600 border rounded-[10px] grid content-center h-[45px] w-[100px]">
                            <IconButton
                              icon={
                                theme === "dark" ? (
                                  <DeleteIconDark />
                                ) : (
                                  <DeleteIcon />
                                )
                              }
                              text={Locale.Mask.Item.Delete}
                              onClick={() => {
                                if (confirm(Locale.Mask.Item.DeleteConfirm)) {
                                  maskStore.delete(m.id);
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {editingMask && (
        <div
          onClick={closeMaskModal}
          className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-80 flex items-center justify-center z-[99999]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[1520px] bg-white dark:bg-[#303C4B30] backdrop-blur-2xl py-5 md:py-10 rounded-2xl ring-1 ring-[#18BB4E] relative overflow-y-auto h-full max-h-[90vh]"
          >
            <Modal
              title={Locale.Mask.EditModal.Title(editingMask?.builtin)}
              onClose={closeMaskModal}
              actions={[
                <IconButton
                  className="mt-5 ring-1 ring-[#69A606] h-[50px] !px-4"
                  icon={
                    <Download
                      color={theme === "dark" ? "white" : "#353535"}
                      size={20}
                    />
                  }
                  text={Locale.Mask.EditModal.Download}
                  key="export"
                  bordered
                  onClick={() =>
                    downloadAs(
                      JSON.stringify(editingMask),
                      `${editingMask.name}.json`,
                    )
                  }
                />,
                <IconButton
                  key="copy"
                  className="mr-10 mt-5 !bg-[#69A606] h-[50px] !px-7 !text-white"
                  icon={<Copy color={"white"} size={20} />}
                  bordered
                  text={Locale.Mask.EditModal.Clone}
                  onClick={() => {
                    navigate(Path.Masks);
                    maskStore.create(editingMask);
                    setEditingMaskId(undefined);
                  }}
                />,
              ]}
            >
              <MaskConfig
                mask={editingMask}
                updateMask={(updater) =>
                  maskStore.update(editingMaskId!, updater)
                }
                readonly={editingMask.builtin}
              />
            </Modal>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}
