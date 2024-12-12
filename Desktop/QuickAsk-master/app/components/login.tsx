import { useState, useEffect } from "react";
import { useAccessStore, useAppConfig } from "../store";
import { useAuthStore } from "../store/auth";
import { useWebsiteConfigStore } from "../store/website";

import Locale from "../locales";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../components/ui-lib";
import { useMobileScreen } from "../utils";
import Image from "next/image";
import { useTheme } from "next-themes";

// TODO: need change currentUrl
// const currentUrl = "http://localhost:3000/#/login"
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

export function Login() {
  const config = useAppConfig();
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const accessStore = useAccessStore();
  const isMobileScreen = useMobileScreen();
  const { loginPageSubTitle } = useWebsiteConfigStore();

  const [loadingUsage, setLoadingUsage] = useState(false);
  const location = useLocation();
  useEffect(() => {
    // 微信、支付宝登录（wechat or alipay login）
    const params = new URLSearchParams(location.search);
    const authResultStatus = params.get("result_status");
    const authResultMessage = params.get("result_msg");
    if (authResultStatus) {
      if (authResultStatus != "ok") {
        // showToast(String(authResultMessage));
        alert(authResultMessage);
      } else {
        const authResult = params.get("result");
        if (authResult) {
          const loginUser = JSON.parse(authResult);
          // {
          //   "id": "19",
          //   "status": "1",
          //   "user_type": null,
          //   "username": "Alan",
          //   "password": "$2y$13$MAjJ9DOkTxctAGm1IXFwHe1zpNVAXga37fIVZGuftnhVvDMwXgXLK"
          // }
          if (loginUser.id) {
            localStorage.setItem("userId", loginUser.id);
            authStore.login(loginUser.username, loginUser.password);
            navigate(Path.Chat);
          }
        }
      }
    }

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalState, setModalState] = useState(false);

  const auth = useAuthStore().login;
  const authGoogle = useAuthStore().loginWithGoogle;

  async function login() {
    if (email === "") {
      showToast(Locale.LoginPage.Toast.EmptyUserName);
      return;
    }
    if (password === "") {
      showToast(Locale.LoginPage.Toast.EmptyPassword);
      return;
    }
    setLoadingUsage(true);
    showToast(Locale.LoginPage.Toast.Logining);

    const data = await auth(email, password);
    if (data.res) navigate(Path.Chat);
    else showToast(data.msg);
  }

  async function googleAuth() {
    const data = await authGoogle();
  }
  function logout() {
    setTimeout(() => authStore.logout(), 500);
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      color: "#000",
      transform: "translate(-50%, -50%)",
      padding: "30px 40px 50px 40px",
      width: "30%",
    },
    overlay: {
      backgroundColor: "rgba(0, 0,0, .5)",
    },
  };
  const { theme } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <ErrorBoundary>
      <div className="flex justify-center items-center bg-[url('/images/background.png')] w-full h-full min-h-screen bg-cover">
        <div className="bg-white dark:bg-[#303c4b30] dark:backdrop-blur-2xl w-full h-fit max-w-[690px] border-[2px] border-green-700 rounded-[30px] py-10 px-5">
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
            <div className="space-y-1">
              <div className="text-neutral-700 dark:text-white text-3xl font-semibold uppercase">
                LOGIN
              </div>
              <div className="opacity-80 text-neutral-700 dark:text-white dark:texase font-medium leading-relaxed">
                After Logging in, you can communicate with AI
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-700 dark:text-white leading-relaxed">
                Username / Email
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
                  placeholder="Sheraz Ahmed"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-700 dark:text-white leading-relaxed">
                Password
              </label>
              <div className="bg-[#c6c6c673] dark:bg-[#00000070] rounded-[10px] border border-[#ffffff3b] backdrop-blur-[20px] flex items-center px-4 h-[60px] gap-4">
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
                  className="flex-1 h-full outline-none bg-transparent font-normal dark:text-white text-[16px] tracking-[0] leading-[26px] whitespace-nowrap"
                  placeholder="************"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <img
                  onClick={togglePasswordVisibility}
                  className="w-[23px] h-[23px]"
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
            <div className="flex flex-wrap justify-between w-full !mt-5 gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="checkbox-1"
                  className="peer cursor-pointer relative h-5 w-5 shrink-0 appearance-none rounded-[4px] bg-transparent border border-[#a7a6a6] after:absolute after:left-0 after:top-0 after:h-full after:w-full checked:after:bg-[url('data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjZmZmZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4PSIwcHgiIHk9IjBweCI+PHRpdGxlPmljb25fYnlfUG9zaGx5YWtvdjEwPC90aXRsZT48ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz48ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjZmZmZmZmIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNi4wMDAwMDAsIDI2LjAwMDAwMCkiPjxwYXRoIGQ9Ik0xNy45OTk5ODc4LDMyLjQgTDEwLjk5OTk4NzgsMjUuNCBDMTAuMjI2Nzg5MSwyNC42MjY4MDE0IDguOTczMTg2NDQsMjQuNjI2ODAxNCA4LjE5OTk4Nzc5LDI1LjQgTDguMTk5OTg3NzksMjUuNCBDNy40MjY3ODkxNCwyNi4xNzMxOTg2IDcuNDI2Nzg5MTQsMjcuNDI2ODAxNCA4LjE5OTk4Nzc5LDI4LjIgTDE2LjU4NTc3NDIsMzYuNTg1Nzg2NCBDMTcuMzY2ODIyOCwzNy4zNjY4MzUgMTguNjMzMTUyOCwzNy4zNjY4MzUgMTkuNDE0MjAxNCwzNi41ODU3ODY0IEw0MC41OTk5ODc4LDE1LjQgQzQxLjM3MzE4NjQsMTQuNjI2ODAxNCA0MS4zNzMxODY0LDEzLjM3MzE5ODYgNDAuNTk5OTg3OCwxMi42IEw0MC41OTk5ODc4LDEyLjYgQzM5LjgyNjc4OTEsMTEuODI2ODAxNCAzOC41NzMxODY0LDExLjgyNjgwMTQgMzcuNzk5OTg3OCwxMi42IEwxNy45OTk5ODc4LDMyLjQgWiI+PC9wYXRoPjwvZz48L2c+PC9nPjwvc3ZnPg==')] after:bg-[length:40px] after:bg-center after:bg-no-repeat after:content-['']  hover:ring-1 hover:ring-[#2c2c2c69] transition duration-300 focus:outline-none"
                />
                <label
                  htmlFor="checkbox-1"
                  className="text-[#505050] dark:text-white"
                >
                  Remember me
                </label>
              </div>
              <span
                className="cursor-pointer text-[#505050] dark:text-white"
                onClick={() => {
                  navigate(Path.ForgetPassword);
                }}
              >
                Forgot password?
              </span>
            </div>
            <button
              className="h-[60px] w-full bg-[#69a506] rounded-[10px] text-white text-center tracking-[0] leading-[normal]"
              onClick={() => {
                if (authStore.session) logout();
                else login();
              }}
            >
              LOGIN
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
            <div className="text-center">
              <span className="text-sm dark:text-white text-center tracking-[0] leading-[26px] whitespace-nowrap">
                DON’T HAVE AN ACCOUNT?{" "}
              </span>
              <span
                className="text-sm font-medium text-[#69a506] cursor-pointer text-center tracking-[0] leading-[26px] whitespace-nowrap"
                onClick={() => navigate(Path.Register)}
              >
                REGISTER
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">
            {Locale.LoginPage.Title}
          </div>
          <div className="window-header-sub-title">
            {Locale.LoginPage.SubTitle}
          </div>
          <div className="window-header-sub-title">{loginPageSubTitle}</div>
        </div>
        <div className="window-actions">
          {/* <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
              title={Locale.LoginPage.Actions.Close}
            />
          </div> }
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
      <div className={styles["login"]}>
        <div className={styles["logo"] + " no-dark"}>
          <NextImage src={ChatGptIcon.src} alt="logo" width={50} height={50} />
          <h4 className={styles["logo-title"]}>AI Chat</h4>
        </div>

        <List>
          <ListItem
            title={Locale.LoginPage.Username.Title}
            subTitle={Locale.LoginPage.Username.SubTitle}
          >
            {authStore.token ? (
              <span>{authStore.username}</span>
            ) : (
              <SingleInput
                value={username}
                placeholder={Locale.LoginPage.Username.Placeholder}
                onChange={(e) => {
                  setUsername(e.currentTarget.value);
                  //console.log(e)
                  //accessStore.updateCode(e.currentTarget.value);
                }}
              />
            )}
          </ListItem>

          {authStore.token ? (
            <></>
          ) : (
            <ListItem
              title={Locale.LoginPage.Password.Title}
              subTitle={Locale.LoginPage.Password.SubTitle}
            >
              <PasswordInput
                value={password}
                type="text"
                placeholder={Locale.LoginPage.Password.Placeholder}
                onChange={(e) => {
                  // console.log(e)
                  setPassword(e.currentTarget.value);
                  // accessStore.updateCode(e.currentTarget.value);
                }}
              />
            </ListItem>
          )}

          <ListItem>
            <IconButton
              type="primary"
              block={true}
              text={
                authStore.token
                  ? Locale.LoginPage.Actions.Logout
                  : Locale.LoginPage.Actions.Login
              }
              onClick={() => {
                if (authStore.token) {
                  logout();
                } else {
                  // console.log(username, password);
                  login();
                }
              }}
            />
          </ListItem>

          {authStore.token ? (
            <></>
          ) : (
            <>
              <ListItem>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <IconButton
                    text={Locale.LoginPage.WechatLogin}
                    type="second"
                    onClick={() => {
                      window.location.href = wechatLoginUrl;
                    }}
                  />
                  <IconButton
                    text={Locale.LoginPage.AlipayLogin}
                    type="second"
                    onClick={() => {
                      window.location.href = alipayLoginUrl;
                    }}
                  />
                  <IconButton
                    text={Locale.LoginPage.ForgetPassword}
                    type="second"
                    onClick={() => {
                      navigate(Path.ForgetPassword);
                    }}
                  />
                </div>
              </ListItem>
              <ListItem>
                <IconButton
                  text={Locale.LoginPage.GoToRegister}
                  type="second"
                  onClick={() => {
                    navigate(Path.Register);
                  }}
                />
              </ListItem>
            </>
          )}
        </List>

        <SubAlertModal modalState={modalState} setModalState={setModalState} />
      </div> */}
    </ErrorBoundary>
  );
}
