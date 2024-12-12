import { useState, useEffect } from "react";
import { IconButton } from "./button";
import MaxIcon from "../icons/max.svg";
import MinIcon from "../icons/min.svg";
import NextImage from "next/image";
import { useAccessStore, useAppConfig } from "../store";
import ChatGptIcon from "../icons/chatgpt.png";
import { SingleInput, List, ListItem, PasswordInput } from "./ui-lib";

import Locale from "../locales";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../components/ui-lib";
import { useMobileScreen } from "../utils";
import { useAuthStore } from "../store/auth";
import Image from "next/image";

export function ForgetPassword() {
  const config = useAppConfig();
  const navigate = useNavigate();
  const isMobileScreen = useMobileScreen();

  const [loadingUsage, setLoadingUsage] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneCodeCountDown, setPhoneCodeCountDown] = useState(60);
  const [phoneCodeBtnText, setPhoneCodeBtnText] = useState("发送验证码");
  const [emailCodeSending, setEmailCodeSending] = useState(false);
  const [email, setEmail] = useState("");
  const authStore = useAuthStore();
  function handleClickSendEmailCode() {
    if (email === null || email == "") {
      showToast(Locale.RegisterPage.Toast.EmailIsEmpty);
      return;
    }
    setEmailCodeSending(true);
    authStore
      .sendEmailCodeForResetPassword(email)
      .then((resp) => {
        if (resp.code == 0) {
          showToast(Locale.RegisterPage.Toast.EmailCodeSent);
          return;
        }
        if (resp.code == 10121) {
          showToast(Locale.RegisterPage.Toast.EmailFormatError);
          return;
        } else if (resp.code == 10122) {
          showToast(Locale.RegisterPage.Toast.EmailCodeSentFrequently);
          return;
        }
        showToast(resp.message);
      })
      .finally(() => {
        setEmailCodeSending(false);
      });
  }

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
    data.append("type", "2");
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

  function submit() {
    if (phone === null || phone == "") {
      showToast("请输入手机号");
      return;
    }
    const pattern = /^1[3-9]\d{9}$/;
    if (!pattern.test(phone)) {
      showToast("手机号格式不正确");
      return;
    }
    if (captchaInput === null || captchaInput == "") {
      showToast("请输入验证码");
      return;
    }
    if (password === "") {
      showToast(Locale.LoginPage.Toast.EmptyPassword);
      return;
    }
    setLoadingUsage(true);
    showToast("修改中");

    const data = new FormData();
    data.append("phone", phone);
    data.append("captcha", captchaInput);
    data.append("password", password);
    const requestOptions = {
      method: "POST",
      body: data,
    };
    fetch("//my.dogai.com/api/reset-phone-password", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          showToast("修改成功");
          navigate(Path.Login);
        } else if (result && result.message) {
          showToast(result.message);
        }
      })
      .finally(() => {
        setLoadingUsage(false);
      });
  }

  return (
    <ErrorBoundary>
      <div className="flex justify-center items-center bg-[url('/images/background.png')] w-full h-full min-h-screen bg-cover">
        <div className="bg-white dark:bg-[#303c4b30] dark:backdrop-blur-2xl w-full h-fit max-w-[690px] border-[2px] border-green-700 rounded-[30px] pt-10 pb-20 px-5">
          <div className="w-full max-w-[500px] mx-auto space-y-7">
            <div className="flex justify-center">
              <Image
                src="/logo.svg"
                alt="logo"
                width={150}
                height={50}
                draggable={false}
              />
            </div>
            <div className="text-neutral-700 dark:text-white text-3xl font-black font-['Mulish'] uppercase">
              Forgot Password
            </div>

            <div className="space-y-1">
              <label className="text-neutral-700 dark:text-white font-['Mulish'] leading-relaxed">
                Username / Email
              </label>
              <div className="bg-[#c6c6c673] dark:bg-[#00000070] rounded-[10px] border border-[#ffffff3b] backdrop-blur-[20px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(20px)_brightness(100%)] flex items-center pl-6 h-[60px] gap-4">
                <img
                  className="w-[20px] h-[20px]"
                  alt="Group"
                  src="/images/email.svg"
                />
                <input
                  className="flex-1 h-full outline-none bg-transparent font-normal dark:text-white text-[16px] tracking-[0] leading-[26px] whitespace-nowrap"
                  placeholder="sherazahmedoffcial@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              </div>
            </div>
            <button
              className="h-[60px] w-full bg-[#69a506] rounded-[10px] [font-family:'Mulish-Bold',Helvetica] font-bold text-white text-center tracking-[0] leading-[normal]"
              onClick={() => {
                handleClickSendEmailCode();
              }}
            >
              FORGOT PASSWORD
            </button>
          </div>
        </div>
        <div className="window-header" data-tauri-drag-region>
          <div className="window-header-title">
            <div className="window-header-main-title">
              {Locale.ForgetPasswordPage.Title}
            </div>
            <div className="window-header-sub-title">
              {Locale.ForgetPasswordPage.SubTitle}
            </div>
          </div>
          <div className="window-actions">
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
        <div>
          <div>
            <NextImage
              src={ChatGptIcon.src}
              alt="logo"
              width={50}
              height={50}
            />
            <h4>AI Chat</h4>
          </div>

          <List>
            <ListItem title="手机号">
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <SingleInput
                  value={phone}
                  placeholder="请输入中国手机号"
                  onChange={(e) => {
                    setEmail(e.currentTarget.value);
                  }}
                />
                <IconButton
                  disabled={emailCodeSending}
                  text={phoneCodeBtnText}
                  onClick={() => {
                    handleClickSendEmailCode();
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
                block={true}
                text="重置"
                onClick={() => {
                  submit();
                }}
              />
            </ListItem>
          </List>
        </div>
      </div>
    </ErrorBoundary>
  );
}
