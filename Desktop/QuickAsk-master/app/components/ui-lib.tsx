import styles from "./ui-lib.module.scss";
import LoadingIcon from "../icons/three-dots.svg";
import CloseIcon from "../icons/circle-x.svg";
import EyeIcon from "../icons/eye.svg";
import EyeOffIcon from "../icons/eye-off.svg";
import DownIcon from "../icons/down.svg";

import { createRoot } from "react-dom/client";
import React, { HTMLProps, useEffect, useState } from "react";
import { IconButton } from "./button";
import { useTheme } from "next-themes";

export function Popover(props: {
  children: JSX.Element;
  content: JSX.Element;
  open?: boolean;
  onClose?: () => void;
}) {
  return (
    <div className={styles.popover}>
      {props.children}
      {props.open && (
        <div className={styles["popover-content"]}>
          <div className={styles["popover-mask"]} onClick={props.onClose}></div>
          {props.content}
        </div>
      )}
    </div>
  );
}

export function Card(props: { children: JSX.Element[]; className?: string }) {
  return (
    <div className={styles.card + " " + props.className}>{props.children}</div>
  );
}

export function ListItem(props: {
  title?: string;
  subTitle?: string;
  children?: JSX.Element | JSX.Element[];
  icon?: JSX.Element;
  className?: string;
}) {
  return (
    <div className={styles["list-item"] + ` ${props.className || ""}`}>
      <div className={styles["list-header"]}>
        {props.icon && <div className={styles["list-icon"]}>{props.icon}</div>}
        <div className={styles["list-item-title"]}>
          <div className="!font-normal">{props.title}</div>
          {props.subTitle && (
            <div className={styles["list-item-sub-title"]}>
              {props.subTitle}
            </div>
          )}
        </div>
      </div>
      {props.children}
    </div>
  );
}

export function List(props: {
  children:
    | Array<JSX.Element | null | undefined>
    | JSX.Element
    | null
    | undefined;
}) {
  return <div className={styles.list}>{props.children}</div>;
}

export function Loading() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingIcon />
    </div>
  );
}

interface ModalProps {
  title: string;
  children?: JSX.Element | JSX.Element[];
  actions?: JSX.Element[];
  onClose?: () => void;
}
export function Modal(props: ModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        props.onClose?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles["modal-container"] + " py-4"}>
      <div className={styles["modal-header"]}>
        <div className={styles["modal-title"]}>{props.title}</div>

        <div
          className={
            styles["modal-close-btn"] +
            " bg-[#EDEDED] dark:bg-[#1C1C1C] ring-1 ring-[#ececec] dark:ring-[#585858] rounded-xl p-3 "
          }
          onClick={props.onClose}
        >
          <CloseIcon />
        </div>
      </div>

      <div className={styles["modal-content"]}>{props.children}</div>

      <div className={styles["modal-footer"]}>
        <div className={styles["modal-actions"]}>
          {props.actions?.map((action, i) => (
            <div key={i} className={styles["modal-action"]}>
              {action}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function showModal(props: ModalProps) {
  const div = document.createElement("div");
  div.className =
    "fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 flex items-center justify-center z-50";
  document.body.appendChild(div);

  const root = createRoot(div);
  const closeModal = () => {
    props.onClose?.();
    root.unmount();
    div.remove();
  };

  div.onclick = (e) => {
    if (e.target === div) {
      closeModal();
    }
  };

  root.render(<Modal {...props} onClose={closeModal}></Modal>);
}

export type ToastProps = {
  content: string;
  action?: {
    text: string;
    onClick: () => void;
    redirectUrl?: string;
  };
  onClose?: () => void;
};

export function Toast(props: ToastProps) {
  console.log("props", props);
  return (
    <div className={styles["toast-container"]}>
      <div className={styles["toast-content"]}>
        <span>{props.content}</span>
        {props.action && (
          <button
            onClick={() => {
              props.action?.onClick?.();
              if (props?.action?.redirectUrl) {
                window.location.href = props?.action?.redirectUrl;
              } else {
                props.onClose?.();
              }
            }}
            className={styles["toast-action"]}
          >
            {props.action.text}
          </button>
        )}
      </div>
    </div>
  );
}

export function showToast(
  content: string,
  action?: ToastProps["action"],
  delay = 3000,
) {
  const div = document.createElement("div");
  div.className = styles.show;
  document.body.appendChild(div);

  const root = createRoot(div);
  let closeTimeout: ReturnType<typeof setTimeout>;

  const close = () => {
    div.classList.add(styles.hide);

    setTimeout(() => {
      root.unmount();
      div.remove();
    }, 300);
  };

  const handleClick = () => {
    clearTimeout(closeTimeout); // Clear the automatic close timeout
    close();
  };

  root.render(
    <Toast content={content} action={action} onClose={handleClick} />,
  );

  if (delay !== 0) {
    closeTimeout = setTimeout(() => {
      close();
    }, delay);
  }
}

export type InputProps = React.HTMLProps<HTMLTextAreaElement> & {
  autoHeight?: boolean;
  rows?: number;
};

export function SingleInput(props: React.HTMLProps<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="text"
      className={`${styles["input"]} ${styles["input-left"]} ${props.className}`}
    />
  );
}

export function Input(props: InputProps) {
  return (
    <textarea
      {...props}
      className={`${styles["input"]} ${props.className}`}
    ></textarea>
  );
}

export function PasswordInput(props: HTMLProps<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  function changeVisibility() {
    setVisible(!visible);
  }

  const { theme } = useTheme();

  return (
    <div
      className={
        "flex gap-2 ring-1 ring-[#69A606] rounded-lg w-full max-w-[348px] py-2.5 px-3 items-center"
      }
    >
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={"outline-none bg-transparent h-full w-full"}
      />
      <img
        onClick={changeVisibility}
        className="w-[23px] h-[23px]"
        alt="Eye-Off"
        draggable={false}
        src={
          theme === "dark"
            ? visible
              ? "/images/eye-off-dark.svg"
              : "/images/eye-dark.svg"
            : !visible
            ? "/images/eye.svg"
            : "/images/eye-off.svg"
        }
      />
    </div>
  );
}

export function Select(
  props: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >,
) {
  const { className, children, ...otherProps } = props;
  return (
    <div className={`${styles["select-with-icon"]} ${className}`}>
      <select className={styles["select-with-icon-select"]} {...otherProps}>
        {children}
      </select>
      <DownIcon className={styles["select-with-icon-icon"]} />
    </div>
  );
}
