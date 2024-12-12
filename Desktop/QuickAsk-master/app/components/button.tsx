import * as React from "react";

import styles from "./button.module.scss";

export type ButtonType = "primary" | "second" | "danger" | null;

export function IconButton(props: {
  onClick?: () => void;
  icon?: JSX.Element;
  type?: ButtonType;
  text?: string;
  bordered?: boolean;
  shadow?: boolean;
  className?: string;
  title?: string;
  disabled?: boolean;
  block?: boolean;
}) {
  return (
    <button
      className={
        styles["icon-button"] +
        ` ${props.bordered && styles.border} ${props.shadow && styles.shadow} ${
          props.block && styles.block
        } ${props.className ?? ""} clickable ${styles[props.type ?? ""]}`
      }
      onClick={props.onClick}
      title={props.title}
      disabled={props.disabled}
      role="button"
      //@ts-ignore
      style={{
        background: props.icon === undefined ? "rgb(29, 147, 171)" : undefined,
        color: props.icon === undefined ? "white" : undefined,
        marginLeft: props.icon === undefined ? "10px" : undefined,
      }}
    >
      {props.icon && (
        <div
          className={
            styles["icon-button-icon"] +
            ` ${props.type === "primary" && "no-dark"}`
          }
        >
          {props.icon}
        </div>
      )}

      {props.text && props.text}
    </button>
  );
}
