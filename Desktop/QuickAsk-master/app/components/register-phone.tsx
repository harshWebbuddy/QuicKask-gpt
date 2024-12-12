import { useState, useEffect } from "react";
import styles from "./register.module.scss";
import { IconButton } from "./button";
import NextImage from "next/image";
import MaxIcon from "../icons/max.svg";
import MinIcon from "../icons/min.svg";
import { useAccessStore, useAppConfig } from "../store";
import { useAuthStore } from "../store/auth";
import ChatGptIcon from "../icons/chatgpt.png";
import { useWebsiteConfigStore } from "../store/website";
import { SingleInput, Input, List, ListItem, PasswordInput } from "./ui-lib";

import Locale from "../locales";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { useNavigate } from "react-router-dom";
import { showToast } from "../components/ui-lib";
import { useMobileScreen } from "../utils";

export function RegisterPhone() {
  const config = useAppConfig();
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const accessStore = useAccessStore();
  const isMobileScreen = useMobileScreen();
  const { registerPageSubTitle, registerTypes } = useWebsiteConfigStore();
  const registerType = registerTypes[0];
  const REG_TYPE_ONLY_USERNAME = "OnlyUsername";
  const REG_TYPE_USERNAME_WITH_CAPTCHA = "OnlyUsernameWithCaptcha";
  const REG_TYPE_USERNAME_AND_EMAIL_WITH_CAPTCHA_AND_CODE =
    "UsernameAndEmailWithCaptchaAndCode";

  const [loadingUsage, setLoadingUsage] = useState(false);
  const [captcha, setCaptcha] = useState("");

  useEffect(() => {
    const keydownEvent = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(Path.Home);
      }
    };
    document.addEventListener("keydown", keydownEvent);
    return () => {
      document.removeEventListener("keydown", keydownEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function generateUUID() {
    var d = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      },
    );
    return uuid;
  }

  const [captchaId] = useState("register-" + generateUUID());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCodeCountDown, setPhoneCodeCountDown] = useState(60);
  const [phoneCodeBtnText, setPhoneCodeBtnText] = useState("发送验证码");
  const [emailCodeSending, setEmailCodeSending] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [comfirmedPassword, setComfirmedPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  // 发送验证码
  function handleClickSendPhoneCode() {
    if (phone === null || phone == "") {
      showToast("请输入手机号");
      return;
    }
    const pattern = /^1[3-9]\d{9}$/;
    if (!pattern.test(phone)) {
      showToast("手机号格式不正确");
      return;
    }

    setEmailCodeSending(true);

    // 发送请求
    const data = new FormData();
    data.append("mobile", phone);
    data.append("type", "1");
    const requestOptions = {
      method: "POST",
      body: data,
    };
    fetch("//my.dogai.com/api/sendSms", requestOptions)
      .then((response) => response.json())
      .then((result: any) => {
        if (result.code != 200) {
          showToast(result.msg);
          setEmailCodeSending(false);
        } else {
          let _phoneCodeCountDown = 60;
          var codeSendTimer = setInterval(() => {
            if (_phoneCodeCountDown > 1) {
              _phoneCodeCountDown -= 1;
              console.log("减", _phoneCodeCountDown);
              setPhoneCodeBtnText(_phoneCodeCountDown + "秒后重试");
            } else {
              setEmailCodeSending(false);
              setPhoneCodeBtnText("发送验证码");
              clearInterval(codeSendTimer);
            }
            setPhoneCodeCountDown(_phoneCodeCountDown);
          }, 1000);
        }
      })
      .catch(() => {
        showToast("发送失败");
        setEmailCodeSending(false);
      });
  }

  function register() {
    if (name === null || name === "") {
      showToast(Locale.RegisterPage.Toast.NameEmpty);
      return;
    }
    if (username === null || username === "") {
      showToast(Locale.RegisterPage.Toast.UsernameEmpty);
      return;
    }
    if (phone === null || phone == "") {
      showToast("请输入手机号");
      return;
    }
    if (captchaInput === null || captchaInput == "") {
      showToast("请输入验证码");
      return;
    }
    if (password == null || password.length == 0) {
      showToast(Locale.RegisterPage.Toast.PasswordEmpty);
      return;
    }

    setLoadingUsage(true);
    showToast(Locale.RegisterPage.Toast.Registering);
    // authStore
    //   .register(
    //     name,
    //     username,
    //     email,
    //     password,
    //   )
    const data = new FormData();
    data.append("name", name);
    data.append("username", username);
    data.append("phone", phone);
    data.append("captcha", captchaInput);
    data.append("password", password);
    const requestOptions = {
      method: "POST",
      body: data,
    };

    fetch("//my.dogai.com/api/signup-phone", requestOptions)
      .then((response) => response.json())
      .then((result: any) => {
        console.log("result", result);
        if (!result) {
          showToast(Locale.RegisterPage.Toast.Failed);
          return;
        }
        if (result.status) {
          showToast(Locale.RegisterPage.Toast.Success);
          localStorage.setItem("userId", result.data.id);
          navigate(Path.Chat);
        } else {
          showToast(Locale.RegisterPage.Toast.Failed + " " + result.message);
        }
      })
      .finally(() => {
        setLoadingUsage(false);
      });
  }
  function getRegisterCaptcha(captchaId: string) {
    // console.log('getRegisterCaptcha', captchaId)
    fetch("/api/getRegisterCaptcha?captchaId=" + captchaId, {
      method: "get",
    }).then(async (resp) => {
      const result = await resp.json();
      if (result.code != 0) {
        showToast(result.message);
      } else {
        setCaptcha("data:image/jpg;base64," + result.data);
      }
    });
  }
  useEffect(() => {
    getRegisterCaptcha(captchaId);
  }, [captchaId]);

  return (
    <ErrorBoundary>
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">
            {Locale.RegisterPage.Title}
          </div>
          <div className="window-header-sub-title">
            {Locale.RegisterPage.SubTitle}
          </div>
          <div className="window-header-sub-title">{registerPageSubTitle}</div>
        </div>
        <div className="window-actions">
          {/* <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
              title={Locale.RegisterPage.Actions.Close}
            />
          </div> */}
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
        </div>
      </div>
      <div className={styles["register"]}>
        <div className={styles["logo"] + " no-dark"}>
          <NextImage src={ChatGptIcon.src} alt="logo" width={50} height={50} />
          <h4 className={styles["logo-title"]}>AI Chat</h4>
        </div>

        <List>
          <ListItem
            title={Locale.RegisterPage.FullName.Title}
            subTitle={Locale.RegisterPage.FullName.SubTitle}
          >
            <SingleInput
              value={name}
              placeholder={Locale.RegisterPage.FullName.Placeholder}
              onChange={(e) => {
                setName(e.currentTarget.value);
              }}
            />
          </ListItem>

          <ListItem
            title={Locale.RegisterPage.Username.Title}
            subTitle={Locale.RegisterPage.Username.SubTitle}
          >
            <SingleInput
              value={username}
              placeholder={Locale.RegisterPage.Username.Placeholder}
              onChange={(e) => {
                setUsername(e.currentTarget.value);
              }}
            />
          </ListItem>

          <ListItem title="手机号">
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <SingleInput
                value={phone}
                placeholder="请输入中国手机号"
                onChange={(e) => {
                  setPhone(e.currentTarget.value);
                }}
              />
              <IconButton
                disabled={emailCodeSending}
                text={phoneCodeBtnText}
                onClick={() => {
                  handleClickSendPhoneCode();
                }}
              />
            </div>
          </ListItem>

          <ListItem title="验证码">
            <SingleInput
              value={captchaInput}
              placeholder="请输入短信验证码"
              onChange={(e) => {
                setCaptchaInput(e.currentTarget.value);
              }}
            />
          </ListItem>

          <ListItem
            title={Locale.RegisterPage.Password.Title}
            subTitle={Locale.RegisterPage.Password.SubTitle}
          >
            <PasswordInput
              value={password}
              type="text"
              placeholder={Locale.RegisterPage.Password.Placeholder}
              onChange={(e) => {
                setPassword(e.currentTarget.value);
              }}
            />
          </ListItem>

          <ListItem>
            <IconButton
              type="primary"
              text={Locale.RegisterPage.Title}
              block={true}
              disabled={loadingUsage}
              onClick={() => {
                console.log(username, password);
                register();
              }}
            />
          </ListItem>

          <ListItem>
            <IconButton
              text={Locale.RegisterPage.GoToLogin}
              type="second"
              onClick={() => {
                navigate(Path.Login);
              }}
            />
          </ListItem>
        </List>
      </div>
    </ErrorBoundary>
  );
}
