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
import Image from "next/image";
import { useTheme } from "next-themes";

export function Register() {
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
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeSending, setEmailCodeSending] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [comfirmedPassword, setComfirmedPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const authRegister = useAuthStore().register;
  const authGoogle = useAuthStore().loginWithGoogle;
  const currentUrl = "http://chat.dogai.com/#/login";
  const serverUrl = "http://my.dogai.com";
  const wechatRedirectUrl = encodeURIComponent(
    serverUrl + "/3rd-login?client_url=" + encodeURIComponent(currentUrl),
  );
  const alipayRedirectUrl = encodeURIComponent(
    serverUrl +
      "/login?login_mode=alipay_client_login&client_url=" +
      encodeURIComponent(currentUrl),
  );
  // 微信登录页面定义
  const wechatLoginUrl =
    "https://open.weixin.qq.com/connect/qrconnect?appid=wxdb863356ad5f645e&redirect_uri=" +
    wechatRedirectUrl +
    "&response_type=code&scope=snsapi_login&state=wechat|chat";
  // 支付宝登录页面定义
  const alipayLoginUrl =
    "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021003197615228&scope=auth_user&redirect_uri=" +
    alipayRedirectUrl +
    "&state=alipay|chat";
  function handleClickSendEmailCode() {
    if (email === null || email == "") {
      showToast(Locale.RegisterPage.Toast.EmailIsEmpty);
      return;
    }
    setEmailCodeSending(true);
    authStore
      .sendEmailCode(email)
      .then((resp: any) => {
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

  async function googleAuth() {
    const data = await authGoogle();
  }
  async function register() {
    if (name === null || name === "") {
      showToast(Locale.RegisterPage.Toast.NameEmpty);
      return;
    }
    if (email === null || email == "") {
      showToast(Locale.RegisterPage.Toast.EmailIsEmpty);
      return;
    }
    if (password == null || password.length == 0) {
      showToast(Locale.RegisterPage.Toast.PasswordEmpty);
      return;
    }
    const data = await authRegister(name, email, password);
    if (data.res) navigate(Path.Login);
    else showToast(data.msg);
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

  const { theme } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <ErrorBoundary>
      <div className="flex justify-center items-center bg-[url('/images/background.png')] w-full h-full min-h-screen bg-cover">
        <div className="bg-white dark:bg-[#303c4b30] dark:backdrop-blur-2xl w-full h-fit max-w-[690px] border-[2px] border-green-700 rounded-[30px] py-10 px-5">
          <div className="w-full max-w-[500px] mx-auto space-y-4">
            <div className="flex justify-center">
              <Image
                src="/logo.svg"
                alt="logo"
                width={150}
                height={50}
                draggable={false}
              />
            </div>
            <div className="space-y-1">
              <div className="text-neutral-700 dark:text-white text-3xl font-semibold uppercase">
                REGISTER
              </div>
              <div className="opacity-80 text-neutral-700 dark:text-white dark:texase font-medium leading-relaxed">
                Free quota after registeration
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-neutral-700 dark:text-white leading-relaxed">
                Full Name
              </label>
              <div className="bg-[#c6c6c673] dark:bg-[#00000070] rounded-[10px] border border-[#ffffff3b] backdrop-blur-[20px] flex items-center pl-4 h-[60px] gap-3">
                <img
                  className="w-[20px] h-[20px]"
                  alt="Group"
                  draggable={false}
                  src={
                    theme === "dark"
                      ? "/images/user-dark.svg"
                      : "/images/user.svg"
                  }
                />
                <input
                  className="flex-1 h-full outline-none bg-transparent [font-family:'Mulish-Regular',Helvetica] font-normal dark:text-white text-[16px] tracking-[0] leading-[26px] whitespace-nowrap"
                  placeholder="Please enter your full name"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-neutral-700 dark:text-white leading-relaxed">
                User Name
              </label>
              <div className="bg-[#c6c6c673] dark:bg-[#00000070] rounded-[10px] border border-[#ffffff3b] backdrop-blur-[20px] flex items-center pl-4 h-[60px] gap-3">
                <img
                  className="w-[20px] h-[20px]"
                  alt="Group"
                  draggable={false}
                  src={
                    theme === "dark"
                      ? "/images/user-dark.svg"
                      : "/images/user.svg"
                  }
                />
                <input
                  className="flex-1 h-full outline-none bg-transparent font-normal dark:text-white text-[16px] tracking-[0] leading-[26px] whitespace-nowrap"
                  placeholder="Please enter your user name"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-neutral-700 dark:text-white leading-relaxed">
                Email Address
              </label>
              <div className="bg-[#c6c6c673] dark:bg-[#00000070] rounded-[10px] border border-[#ffffff3b] backdrop-blur-[20px] flex items-center pl-4 h-[60px] gap-3">
                <img
                  className="w-[20px] h-[20px]"
                  alt="Group"
                  draggable={false}
                  src={
                    theme === "dark"
                      ? "/images/email-dark.svg"
                      : "/images/email.svg"
                  }
                />
                <input
                  className="flex-1 h-full outline-none bg-transparent font-family:'Mulish-Regular',Helvetica] font-normal dark:text-white text-[16px] tracking-[0] leading-[26px] whitespace-nowrap"
                  placeholder="Please enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-700 dark:text-white font-['Mulish'] leading-relaxed">
                Password
              </label>
              <div className="bg-[#c6c6c673] dark:bg-[#00000070] rounded-[10px] border border-[#ffffff3b] backdrop-blur-[20px] flex items-center px-6 h-[60px] gap-4">
                <img
                  className="w-[20px] h-[20px]"
                  alt="Group"
                  draggable={false}
                  src={
                    theme === "dark"
                      ? "/images/lock-dark.svg"
                      : "/images/lock.svg"
                  }
                />
                <input
                  className="flex-1 h-full outline-none bg-transparent font-family:'Mulish-Regular',Helvetica] font-normal dark:text-white text-[16px] tracking-[0] leading-[26px] whitespace-nowrap"
                  placeholder="Please enter your password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <img
                  onClick={togglePasswordVisibility}
                  className="w-[22px] h-[22px]"
                  alt="Eye-Off"
                  draggable={false}
                  src={
                    theme === "dark"
                      ? isPasswordVisible
                        ? "/images/eye-off-dark.svg"
                        : "/images/eye-dark.svg"
                      : !isPasswordVisible
                      ? "/images/eye.svg"
                      : "/images/eye-off.svg"
                  }
                />
              </div>
            </div>
            <div className="space-y-6 !mt-7">
              <button
                className="h-[60px] w-full bg-[#69a506] rounded-[10px] text-white text-center tracking-[0] leading-[normal]"
                onClick={() => register()}
              >
                REGISTER
              </button>
              <div className="flex gap-3 !mt-4">
                <button
                  className="h-[60px] w-full rounded-[10px] border border-solid border-[#353535] dark:border-white hover:bg-[#303c4b30] transition duration-300 uppercase dark:text-white text-center tracking-[0] leading-[normal]"
                  onClick={() => {
                    googleAuth();
                  }}
                >
                  Wechat Login
                </button>
                <button
                  className="h-[60px] w-full rounded-[10px] border border-solid border-[#353535] dark:border-white hover:bg-[#303c4b30] transition duration-300 uppercase dark:text-white text-center tracking-[0] leading-[normal]"
                  onClick={() => {
                    googleAuth();
                  }}
                >
                  Alipay login
                </button>
              </div>
            </div>
            <div
              className="text-center !mt-8"
              // onClick={() => {
              //   window.location.href = alipayLoginUrl;
              // }}
            >
              <span className="text-sm dark:text-white text-center tracking-[0] leading-[26px] whitespace-nowrap">
                ALREADY HAVE AN ACCOUNT?{" "}
              </span>
              <span
                className="text-sm text-[#69a506] text-center tracking-[0] leading-[26px] whitespace-nowrap cursor-pointer"
                onClick={() => navigate(Path.Login)}
              >
                LOGIN
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="window-header" data-tauri-drag-region>
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
        </div>
      </div>
      <div className={styles["register"]}>
        <div className={styles["logo"] + " no-dark"}>
          <NextImage src={ChatGptIcon.src} alt="logo" width={50} height={50} />
          <h4 className={styles["logo-title"]}>AI Chat</h4>
        </div>

        <List>
          {/* <ListItem
            title={Locale.RegisterPage.Name.Title}
            subTitle={Locale.RegisterPage.Name.SubTitle}
          >
            <SingleInput
              value={name}
              placeholder={Locale.RegisterPage.Name.Placeholder}
              onChange={(e) => {
                setName(e.currentTarget.value);
              }}
            />
          </ListItem> 

          {registerType ===
          REG_TYPE_USERNAME_AND_EMAIL_WITH_CAPTCHA_AND_CODE ? (
            <>
              <ListItem
                title={Locale.RegisterPage.Username.Title}
                subTitle={Locale.RegisterPage.Username.SubTitle}
              >
                <SingleInput
                  value={email}
                  placeholder={Locale.RegisterPage.Username.Placeholder}
                  onChange={(e) => {
                    setEmail(e.currentTarget.value);
                  }}
                />
              </ListItem>

              <ListItem>
                <IconButton
                  text={
                    emailCodeSending
                      ? Locale.RegisterPage.Toast.EmailCodeSending
                      : Locale.RegisterPage.Toast.SendEmailCode
                  }
                  disabled={emailCodeSending}
                  onClick={() => {
                    handleClickSendEmailCode();
                  }}
                />
              </ListItem>

              <ListItem
                title={Locale.RegisterPage.EmailCode.Title}
                subTitle={Locale.RegisterPage.EmailCode.SubTitle}
              >
                <SingleInput
                  value={emailCode}
                  placeholder={Locale.RegisterPage.EmailCode.Placeholder}
                  onChange={(e) => {
                    setEmailCode(e.currentTarget.value);
                  }}
                />
              </ListItem>
            </>
          ) : (
            <></>
          )}

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

          <ListItem
            title={Locale.RegisterPage.Email.Title}
            subTitle={Locale.RegisterPage.Email.SubTitle}
          >
            <SingleInput
              value={email}
              placeholder={Locale.RegisterPage.Email.Placeholder}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
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

          {registerType == REG_TYPE_ONLY_USERNAME ||
          registerType == REG_TYPE_USERNAME_WITH_CAPTCHA ? (
            <>
              <ListItem
                title={Locale.RegisterPage.ConfirmedPassword.Title}
                subTitle={Locale.RegisterPage.ConfirmedPassword.SubTitle}
              >
                <PasswordInput
                  value={comfirmedPassword}
                  type="text"
                  placeholder={
                    Locale.RegisterPage.ConfirmedPassword.Placeholder
                  }
                  onChange={(e) => {
                    setComfirmedPassword(e.currentTarget.value);
                  }}
                />
              </ListItem>
            </>
          ) : (
            <></>
          )}

          {registerType == REG_TYPE_USERNAME_WITH_CAPTCHA ? (
            <>
              <ListItem title={Locale.RegisterPage.Captcha}>
                <div>
                  {captcha ? (
                    <img
                      alt={Locale.RegisterPage.Captcha}
                      src={captcha}
                      width="100"
                      height="40"
                      title={Locale.RegisterPage.CaptchaTitle}
                      style={{ cursor: "pointer" }}
                      onClick={(e) => getRegisterCaptcha(captchaId)}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </ListItem>
              <ListItem
                title={Locale.RegisterPage.CaptchaInput.Title}
                subTitle={Locale.RegisterPage.CaptchaInput.SubTitle}
              >
                <SingleInput
                  value={captchaInput}
                  placeholder={Locale.RegisterPage.CaptchaInput.Placeholder}
                  onChange={(e) => {
                    setCaptchaInput(e.currentTarget.value);
                  }}
                />
              </ListItem>
            </>
          ) : (
            <></>
          )}

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
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <IconButton
                text="手机号注册"
                type="second"
                onClick={() => {
                  navigate(Path.RegisterPhone);
                }}
              />
              <IconButton
                text={Locale.RegisterPage.GoToLogin}
                type="second"
                onClick={() => {
                  navigate(Path.Login);
                }}
              />
            </div>
          </ListItem>
        </List>
      </div> */}
    </ErrorBoundary>
  );
}
