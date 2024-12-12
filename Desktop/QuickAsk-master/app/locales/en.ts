import { SubmitKey } from "../store/config";
import { RequiredLocaleType } from "./index";

const en: RequiredLocaleType = {
  WIP: "Coming Soon...",
  Error: {
    Unauthorized:
      "Unauthorized access, please enter access code in settings page.",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} messages`,
  },
  Chat: {
    SubTitle: (count: number) => `${count} messages with ChatGPT`,
    Actions: {
      ChatList: "Go To Chat List",
      Logout: "Logout",
      CompressedHistory: "Compressed History Memory Prompt",
      Export: "Export All Messages as Markdown",
      Copy: "Copy",
      Stop: "Stop",
      Retry: "Retry",
      Delete: "Delete",
    },
    Rename: "Rename Chat",
    Typing: "Typing…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} to send`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += ", Shift + Enter to wrap";
      }
      return inputHints + ", / to search prompts";
    },
    Send: "Send",
    Config: {
      Reset: "Reset to Default",
      SaveAs: "Save as Mask",
    },
  },
  Export: {
    Title: "Export Messages",
    Copy: "Copy All",
    Download: "Download",
    MessageFromYou: "Message From You",
    MessageFromChatGPT: "Message From ChatGPT",
    Share: "Share to ShareGPT",
    Format: {
      Title: "Export Format",
      SubTitle: "Markdown or PNG Image",
    },
    IncludeContext: {
      Title: "Including Context",
      SubTitle: "Export context prompts in mask or not",
    },
    Steps: {
      Select: "Select",
      Preview: "Preview",
    },
  },
  Select: {
    Search: "Search",
    All: "Select All",
    Latest: "Select Latest",
    Clear: "Clear",
  },
  Memory: {
    Title: "Memory Prompt",
    EmptyContent: "Nothing yet.",
    Send: "Send Memory",
    Copy: "Copy Memory",
    Reset: "Reset Session",
    ResetConfirm:
      "Resetting will clear the current conversation history and historical memory. Are you sure you want to reset?",
  },
  Home: {
    NewChat: "New Chat",
    Guide: "Guide",
    DeleteChat: "Confirm to delete the selected conversation?",
    DeleteToast: "Chat Deleted",
    Revert: "Revert",
    ClickHere: "Click Here",
  },
  Settings: {
    Title: "Settings",
    SubTitle: "All Settings",
    Actions: {
      ClearAll: "Clear All Data",
      ResetAll: "Reset All Settings",
      Close: "Close",
      ConfirmResetAll: "Are you sure you want to reset all configurations?",
      ConfirmClearAll: "Are you sure you want to reset all data?",
    },
    Lang: {
      Name: "Language", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: "All Languages",
    },
    Avatar: "Avatar",
    FontSize: {
      Title: "Font Size",
      SubTitle: "Adjust font size of chat content",
    },
    Update: {
      Version: (x: string) => `Version: ${x}`,
      IsLatest: "Latest version",
      CheckUpdate: "Check Update",
      IsChecking: "Checking update...",
      FoundUpdate: (x: string) => `Found new version: ${x}`,
      GoToUpdate: "Update",
    },
    SendKey: "Send Key",
    Theme: "Theme",
    TightBorder: "Tight Border",
    SendPreviewBubble: {
      Title: "Send Preview Bubble",
      SubTitle: "Preview markdown in bubble",
    },
    Mask: {
      Title: "Mask Splash Screen",
      SubTitle: "Show a mask splash screen before starting new chat",
    },
    Prompt: {
      Disable: {
        Title: "Disable auto-completion",
        SubTitle: "Input / to trigger auto-completion",
      },
      List: "Prompt List",
      ListCount: (builtin: number, custom: number) =>
        `${builtin} built-in, ${custom} user-defined`,
      Edit: "Edit",
      Modal: {
        Title: "Prompt List",
        Add: "Add One",
        Search: "Search Prompts",
      },
      EditModal: {
        Title: "Edit Prompt",
      },
    },
    HistoryCount: {
      Title: "Attached Messages Count",
      SubTitle: "Number of sent messages attached per request",
    },
    CompressThreshold: {
      Title: "History Compression Threshold",
      SubTitle:
        "Will compress if uncompressed messages length exceeds the value",
    },
    Token: {
      Title: "API Key",
      SubTitle: "Use your key to ignore access code limit",
      Placeholder: "OpenAI API Key",
    },
    Usage: {
      Title: "Account Balance",
      SubTitle(used: any, total: any) {
        return `Used this month $${used}, subscription $${total}`;
      },
      IsChecking: "Checking...",
      Check: "Check",
      NoAccess: "Enter API Key to check balance",
    },
    AccessCode: {
      Title: "Access Code",
      SubTitle: "Access control enabled",
      Placeholder: "Need Access Code",
    },
    Model: "Model",
    Temperature: {
      Title: "Temperature",
      SubTitle: "A larger value makes the more random output",
    },
    MaxTokens: {
      Title: "Max Tokens",
      SubTitle: "Maximum length of input tokens and generated tokens",
    },
    PresencePenalty: {
      Title: "Presence Penalty",
      SubTitle:
        "A larger value increases the likelihood to talk about new topics",
    },
  },
  Store: {
    DefaultTopic: "New Conversation",
    BotHello: "Hello! How can I assist you today?",
    Error: "Something went wrong, please try again later.",
    Prompt: {
      History: (content: string) =>
        "This is a summary of the chat history as a recap: " + content,
      Topic:
        "Please generate a four to five word title summarizing our conversation without any lead-in, punctuation, quotation marks, periods, symbols, or additional text. Remove enclosing quotation marks.",
      Summarize:
        "Summarize the discussion briefly in 200 words or less to use as a prompt for future context.",
    },
  },
  Copy: {
    Success: "Copied to clipboard",
    Failed: "Copy failed, please grant permission to access clipboard",
  },
  Context: {
    Toast: (x: any) => `With ${x} contextual prompts`,
    Edit: "Contextual and Memory Prompts",
    Add: "Add a Prompt",
    Clear: "Context Cleared",
    Revert: "Revert",
  },
  Plugin: {
    Name: "Plugin",
  },
  Mask: {
    Name: "Mask",
    Page: {
      Title: "Prompt Template",
      SubTitle: (count: number) => `${count} prompt templates`,
      Search: "Search Templates",
      Create: "Create",
    },
    Item: {
      Info: (count: number) => `${count} prompts`,
      Chat: "Chat",
      View: "View",
      Edit: "Edit",
      Delete: "Delete",
      DeleteConfirm: "Confirm to delete?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `Edit Prompt Template ${readonly ? "(readonly)" : ""}`,
      Download: "Download",
      Clone: "Clone",
    },
    Config: {
      Avatar: "Bot Avatar",
      Name: "Bot Name",
      Sync: {
        Title: "Use Global Config",
        SubTitle: "Use global config in this chat",
        Confirm: "Confirm to override custom config with global config?",
      },
      HideContext: {
        Title: "Hide Context Prompts",
        SubTitle: "Do not show in-context prompts in chat",
      },
    },
  },
  NewChat: {
    Return: "Return",
    Skip: "Just Start",
    Title: "Pick a Mask",
    SubTitle: "Chat with the Soul behind the Mask",
    More: "Find More",
    NotShow: "Never Show Again",
    ConfirmNoShow: "Confirm to disable？You can enable it in settings later.",
  },
  UI: {
    Confirm: "Confirm",
    Cancel: "Cancel",
    Close: "Close",
    Create: "Create",
    Edit: "Edit",
  },
  LoginPage: {
    Title: "Log in",
    SubTitle: "After logging in, you can communicate with AI",
    Username: {
      Title: "Username or Email",
      SubTitle: "",
      Placeholder: "Please enter your username or email",
    },
    Modal: {
      title: "Whoops!",
      description:
        "Looks like your trial-period/subscription has expired. Please upgrade it to be able to login again.",
      limitExceed: "Words limit exceeded, Upgrade your membership plan.",
      buttonText: "Select your plan now",
    },
    Password: {
      Title: "Password",
      SubTitle: "",
      Placeholder: "Please enter your password",
    },
    Actions: {
      Close: "Close",
      Login: "Login",
      Logout: "Logout",
    },
    Toast: {
      Success: "Login successful",
      Logining: "Logging in...",
      EmptyUserName: "Username or email cannot be empty",
      EmptyPassword: "Password cannot be empty!",
    },
    GoToRegister: "Go to Register",
    ForgetPassword: "Forgot/Reset Password",
    WechatLogin: "Wechat Login",
    AlipayLogin: "Alipay Login",
    PhoneLogin: "Mobile Login",
  },
  RegisterPage: {
    Title: "Register",
    SubTitle: "Free quota after registration",
    Name: {
      Title: "Nickname",
      SubTitle: "",
      Placeholder: "Please enter your nickname (optional)",
    },
    FullName: {
      Title: "Full Name",
      SubTitle: "",
      Placeholder: "Please enter your fullname",
    },
    Email: {
      Title: "Email Address",
      SubTitle: "",
      Placeholder: "Please enter your email",
    },
    EmailCode: {
      Title: "Verification Code",
      SubTitle: "A verification code will be sent to your email",
      Placeholder: "Please enter the verification code",
    },
    Username: {
      Title: "Username",
      SubTitle: "",
      Placeholder: "Please enter your username",
    },
    Password: {
      Title: "Password",
      SubTitle: "",
      Placeholder: "Please enter your password",
    },
    ConfirmedPassword: {
      Title: "Confirm Password",
      SubTitle: "",
      Placeholder: "Please enter your password again",
    },
    Actions: {
      Close: "Close",
    },
    Toast: {
      Success: "Registration successful, redirecting to chat...",
      Redirect: "Kindly check your email for verification",
      Registering: "Registering...",
      Failed: "Registration failed!",
      FailedWithReason: "Registration failed! Reason:",
      PasswordNotTheSame: "The passwords entered do not match!",
      PasswordEmpty: "Password cannot be empty!",
      SendEmailCode: "Send Verification Code",
      EmailCodeSending: "Sending verification code...",
      EmailCodeSent: "Verification code has been sent, please check your email",
      EmailIsEmpty: "Please enter your email",
      EmailCodeSentFrequently:
        "Verification code sending too frequently, please try again later",
      EmailFormatError: "Invalid email format",
      EmailCodeEmpty: "Please enter the email verification code",
      NameEmpty: "Please enter your full name",
      UsernameEmpty: "Please enter your username",
      EmailExistsError: "This email is already registered",
    },
    GoToLogin: "Go to Login",
    Captcha: "",
    CaptchaTitle: "Click to refresh the captcha",
    CaptchaIsEmpty: "Please enter the captcha",
    CaptchaLengthError: "Invalid captcha length",
    CaptchaInput: {
      Title: "Captcha",
      SubTitle: "",
      Placeholder: "Please enter the captcha from the image",
    },
  },
  ForgetPasswordPage: {
    Title: "Reset Password",
    SubTitle: "",
    Toast: {
      PasswordResetting: "Resetting password...",
      PasswordResetFailed: "Password reset failed!",
      PasswordResetSuccess: "Reset successful, redirecting to chat...",
      PasswordResetFailedWithReason: "Reset failed! Reason:",
    },
    Actions: {
      Close: "Close",
    },
  },
};

export default en;
