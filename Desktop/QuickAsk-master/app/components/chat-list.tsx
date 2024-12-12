import DeleteIcon from "../icons/delete.svg";
import BotIcon from "../icons/bot.svg";

import styles from "./home.module.scss";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

import { useChatStore } from "../store";

import Locale from "../locales";
import { Link, useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { MaskAvatar } from "./mask";
import { Mask } from "../store/mask";
import { useRef, useEffect } from "react";
import { useTheme } from "next-themes";

export function ChatItem(props: {
  onClick?: () => void;
  onDelete?: () => void;
  title: string;
  count: number;
  time: string;
  selected: boolean;
  id: number;
  index: number;
  narrow?: boolean;
  mask: Mask;
}) {
  const draggableRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (props.selected && draggableRef.current) {
      draggableRef.current?.scrollIntoView({
        block: "center",
      });
    }
  }, [props.selected]);

  const { theme } = useTheme();
  return (
    <Draggable draggableId={`${props.id}`} index={props.index}>
      {(provided) => (
        <div
          className={`!h-[48px] px-3 flex items-center justify-center mb-2 ${
            props.selected &&
            "bg-white dark:bg-[#0E0F13] dark:neutral-950 rounded-md"
          }`}
          onClick={props.onClick}
          ref={(ele) => {
            draggableRef.current = ele;
            provided.innerRef(ele);
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          title={`${props.title}\n${Locale.ChatItem.ChatItemCount(
            props.count,
          )}`}
        >
          {props.narrow ? (
            <div className={styles["chat-item-narrow"]}>
              <div className={styles["chat-item-avatar"] + " no-dark"}>
                <MaskAvatar mask={props.mask} />
              </div>
              <div className={styles["chat-item-narrow-count"]}>
                {props.count}
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex gap-2.5 items-center relative">
                <img
                  className="w-[30px] h-[30px]"
                  alt="Frame"
                  src={
                    theme === "dark"
                      ? "/images/message-dark.svg"
                      : "/images/message.svg"
                  }
                />
                <span
                  className="dark:text-white text-[12.8px] tracking-[0] leading-[normal] w-full overflow-hidden text-ellipsis whitespace-nowrap"
                  title={props.title}
                >
                  {props.title}
                </span>
              </div>
            </div>
          )}

          <div
            className={styles["chat-item-delete"]}
            onClickCapture={props.onDelete}
          >
            <DeleteIcon />
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function ChatList(props: { narrow?: boolean; today?: boolean }) {
  const [sessions, selectedIndex, selectSession, moveSession] = useChatStore(
    (state) => [
      state.sessions,
      state.currentSessionIndex,
      state.selectSession,
      state.moveSession,
    ],
  );
  const chatStore = useChatStore();
  const navigate = useNavigate();

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveSession(source.index, destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chat-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {sessions
              .filter((item, i) => {
                const currentDate = new Date();
                const lastUpdateDate = new Date(item.lastUpdate);
                const isToday =
                  currentDate.getFullYear() === lastUpdateDate.getFullYear() &&
                  currentDate.getMonth() === lastUpdateDate.getMonth() &&
                  currentDate.getDay() === lastUpdateDate.getDay();
                return props.today
                  ? isToday || i === selectedIndex
                  : !isToday && i !== selectedIndex;
              })
              .map((item, i) => (
                <ChatItem
                  title={item.topic}
                  time={new Date(item.lastUpdate).toLocaleString()}
                  count={item.messages.length}
                  key={item.id}
                  id={item.id}
                  index={i}
                  selected={i === selectedIndex}
                  onClick={() => {
                    navigate(Path.Chat);
                    selectSession(i);
                  }}
                  onDelete={() => {
                    if (!props.narrow || confirm(Locale.Home.DeleteChat)) {
                      chatStore.deleteSession(i);
                    }
                  }}
                  narrow={props.narrow}
                  mask={item.mask}
                />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
