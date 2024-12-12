import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { useEffect, useState } from "react";
import Image from "next/image";

export function FirstPage() {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const authSign = () => {
    authStore.session ? authStore.logout() : navigate("login");
  };
  const nextTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  const { systemTheme, theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        return setIsScrolled(true);
      }
      return setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.addEventListener("scroll", handleScroll);
    };
  }, []);

  const [hoverCard, setHoverCard] = useState<string | null>(null);

  const handleCardHover = (card: string) => {
    return setHoverCard(card);
  };

  return (
    <>
      <main className="overflow-hidden relative">
        <div className="w-[1320px] h-[1320px] absolute top-[-1000px] left-[-200px] border-[2px] border-[#8dbbff1a] rounded-full" />
        <div className="w-[740px] h-[740px] absolute top-[200px] left-[40px] border-[2px] border-[#8dbbff1a] rounded-full z-[0]" />
        <div className="w-[640px] h-[640px] absolute top-[-800px] left-[40px] bg-gradient-to-br from-teal-600 to-blue-600/50 blur-[500px] z-[0]" />
        <div className="w-[840px] h-[840px] absolute top-[-800px] right-1/4 bg-gradient-to-br from-teal-600/70 to-yellow-600/30 blur-[400px] z-[0]" />
        <nav
          className={`fixed h-20 flex items-center w-full justify-between z-10 top-0  ${
            isScrolled
              ? "bg-white/60 dark:bg-black/30 backdrop-blur-sm"
              : "bg-transparent"
          }`}
        >
          <div className="w-full max-w-[1520px] mx-auto flex justify-between px-2">
            <Image
              src="/logo.svg"
              alt="logo"
              width={120}
              height={50}
              draggable={false}
              className="select-none"
            />
            <div className="flex items-center justify-between gap-4 sm:gap-10">
              <div className="relative">
                <div className=" text-neutral-700 w-full text-center cursor-pointer dark:text-white">
                  Home
                </div>
                <div className="flex justify-center relative">
                  <div className="w-2 h-2 absolute translate-y-1 bg-neutral-700 rounded-full dark:bg-white"></div>
                </div>
              </div>
              <div className="">
                <div
                  className="opacity-70  text-neutral-70 w-full text-center cursor-pointer dark:text-[#858585]"
                  onClick={() => navigate("chat")}
                >
                  Chat
                </div>
              </div>
              <div className="h-full max-h-[30px] w-[2px] bg-gradient-to-b from-transparent via-[#6b6b6b] dark:via-white/50 to-transparent" />
              <div className="">
                <div
                  className=" text-lime-600 font-semibol w-full text-center cursor-pointer"
                  onClick={authSign}
                >
                  {authStore.session ? "Sign Out" : "Sign In"}
                </div>
              </div>
              <div className="">
                <div
                  className=" text-neutral-700 text-l font-bol w-full text-center cursor-pointer"
                  onClick={nextTheme}
                >
                  <img
                    src={
                      theme === "dark"
                        ? "images/dark-white.svg"
                        : "images/light-green.svg"
                    }
                    draggable={false}
                    className="w-6 h-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>
        <section className="w-full mt-40 relative z-[1]">
          <div className="relative">
            <div className="h-fit w-full mx-auto">
              <div className="flex flex-col lg:flex-row justify-between w-full gap-10">
                <div className="w-full flex lg:justify-end">
                  <div className="w-full max-w-[732px] px-2 xl:px-0">
                    <h1 className="w-full max-w-2xl md:max-w-5xl pt-14 text-5xl md:text-7xl capitalize leading-normal md:leading-[1.5] font-black">
                      <span className="text-neutral-700 dark:text-white">
                        Use QuikAsk to
                        <br />
                      </span>
                      <p className="inline relative">
                        <span className="text-lime-600 ring-2 ring-green-500/10 rounded-sm p-3 relative">
                          <span>Simplify</span>
                          <span className="bg-green-600 bg-opacity-5 absolute inset-0 backdrop-blur-[1.5px] z-[1]" />
                        </span>
                        <img
                          src="/images/curved-dash.png"
                          className="absolute translate-y-4 translate-x-6 object-cover w-4/5 "
                          draggable={false}
                        />
                      </p>
                      <span className="text-zinc-300 "> </span>
                      <span className="text-neutral-700  dark:text-white ">
                        Your Life
                      </span>
                    </h1>
                    <div className="flex justify-between mt-24">
                      <div className="w-full max-w-[540px]">
                        <span className="text-lime-600 text-[18px] leading-8">
                          QuikAsk
                        </span>
                        <span className="text-[#858585] text-[18px] leading-8 dark:text-neutral-300">
                          , have a natural conversation with AI that feels
                          surprisingly human. Interacting with artificial
                          intelligence used to feel difficult, overwhelming, and
                          a bit robotic.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:mt-20 h-fit w-full sm:min-w-[512px] flex flex-col items-center">
                  <div className="bg-[#B8F68F] w-[170px] h-[170px] rounded-full p-1 grid place-content-center shadow-5xl shadow-[#B8F68F]/60 s">
                    <div className="bg-[#B8F68F] w-[164px] h-[164px] rounded-full grid place-content-center border border-black">
                      <div className="text-center text-neutral-900 text-xl font-sans leading-7 font-bold">
                        Explore
                        <br />
                        Our Chat
                      </div>
                    </div>
                  </div>
                  <Image
                    src="/images/robot-hand.png"
                    alt="robot-hand"
                    width={800}
                    height={300}
                    className=" object-cover self-end"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-5 xl:gap-10 md:items-end justify-between mt-10 px-3 md:px-0">
            <div className="w-full p-3 md:max-w-[352px] grid place-content-center rounded-t-2xl bg-gradient-to-b dark:from-[#242424] from-[#F3F3F3] to-transparent min-h-[80px] md:min-h-[160px]">
              <div className="text-neutral-700 capitalize flex justify-between dark:text-white">
                <span className="items-center flex gap-4 text-lg xl:text-2xl">
                  Chat GPT
                </span>
                <img src="/images/down-arrow.svg" className="w-8" />
              </div>
            </div>
            <div className="w-full p-3 md:max-w-[352px] grid place-content-center rounded-t-2xl bg-gradient-to-b dark:from-[#242424] from-[#F3F3F3] to-transparent min-h-[80px] md:min-h-[120px]">
              <div className="text-neutral-700 capitalize flex justify-between dark:text-white">
                <span className="items-center flex gap-4 text-lg xl:text-2xl">
                  Google Bard
                </span>
                <img src="/images/down-arrow.svg" className="w-8" />
              </div>
            </div>
            <div className="w-full p-3 md:max-w-[352px] grid place-content-center rounded-t-2xl bg-gradient-to-b from-[#69A606] to-transparent min-h-[80px] md:min-h-[80px]">
              <div className="text-neutral-700 capitalize flex justify-between dark:text-white">
                <span className="items-center flex gap-4 text-lg xl:text-2xl">
                  QuikAsk Chat
                </span>
                <img src="/images/down-arrow.svg" className="w-8" />
              </div>
            </div>
            <div className="w-full p-3 md:max-w-[352px] grid place-content-center rounded-t-2xl bg-gradient-to-b dark:from-[#242424] from-[#F3F3F3] to-transparent min-h-[80px] md:min-h-[120px]">
              <div className="text-neutral-700 capitalize flex justify-between dark:text-white">
                <span className="items-center flex gap-4 text-lg xl:text-2xl">
                  Duck Duck Go
                </span>
                <img src="/images/down-arrow.svg" className="w-8" />
              </div>
            </div>
            <div className="w-full p-3 md:max-w-[352px] grid place-content-center rounded-t-2xl bg-gradient-to-b dark:from-[#242424] from-[#F3F3F3] to-transparent min-h-[80px] md:min-h-[160px]">
              <div className="text-neutral-700 capitalize flex justify-between dark:text-white">
                <span className="items-center flex gap-4 text-lg xl:text-2xl">
                  Anthropic Ai
                </span>
                <img src="/images/down-arrow.svg" className="w-8" />
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-40 px-2">
            <div className="w-full max-w-5xl mx-auto space-y-4">
              <div className="w-full flex justify-center text-center text-neutral-700 md:text-3xl text-2xl font-bol capitalize leading-10 dark:text-white gap-2 sm:gap-4">
                <img
                  src="/images/spiral-arrow-left.svg"
                  className="w-32 hidden sm:block"
                />
                For All Kind of Creators
                <img
                  src="/images/spiral-arrow-right.svg"
                  className="w-32 hidden sm:block"
                />
              </div>
              <div className="w-full left-0 text-center text-neutral-700 leading-7 dark:text-[#858585]">
                Introducing a revolutionary AI partner for creators across the
                globe—a groundbreaking tool designed to transform the way we
                bring our creative ideas to life. Unleash your artistic
                abilities as you explore a world of limitless possibilities. Say
                goodbye to obstacles and let this remarkable AI companion pave
                the way to a new era of boundless creation.
              </div>
            </div>
          </div>
          <div className="w-[740px] h-[740px] absolute right-[-480px] border-[2px] border-[#8dbbff1a] rounded-full z-[0]" />
          <div className="w-[640px] h-[640px] absolute bg-gradient-to-br from-teal-600/80 via-lime-700/50 to-blue-600/80 blur-[500px] z-[0]" />
          <div className="grid mt-28 md:grid-cols-2 gap-x-4 gap-y-20 grid-cols-1 w-full max-w-[1520px] mx-auto px-2">
            <div
              onMouseOver={() => handleCardHover("chatgpt-4")}
              onMouseLeave={() => setHoverCard(null)}
              className="cursor-default bg-gradient-to-b from-gray-200 to-gray-50 rounded-2xl dark:from-[#2F3128] dark:to-[#2f3128]/[0.05] group hover:ring-1 hover:ring-[#18BB4E] p-10 relative transition duration-100"
            >
              <div className="space-y-6 flex flex-col items-center">
                <div className="w-20 h-20  bg-[#DADADA] dark:bg-[#3E3F3E] group-hover:bg-lime-600 rounded-2xl shadow grid place-content-center absolute -top-12 left-[45%] transition duration-100">
                  <img src="/images/chat-gpt.svg" className="w-11" />
                </div>
                <h1 className="text-center text-neutral-700 text-2xl font-semibol capitalize leading-9 dark:text-white">
                  ChatGPT - 4
                </h1>
                <div className="max-w-[410px] mx-auto text-center leading-relaxed text-[#858585] dark:text-[#B1B2B1] group-hover:text-[#353535] dark:group-hover:text-white transition duration-300">
                  The next-generation AI language model with even deeper
                  understanding and more human-like conversations.
                </div>
                <img
                  src={
                    hoverCard === "chatgpt-4"
                      ? "/images/down-arrow-green.svg"
                      : theme === "dark"
                      ? "/images/down-arrow.svg"
                      : "/images/down-arrow-light.svg"
                  }
                  className="w-8 cursor-pointer"
                />
              </div>
            </div>
            <div
              onMouseOver={() => handleCardHover("google-bard")}
              onMouseLeave={() => setHoverCard(null)}
              className="cursor-default bg-gradient-to-b from-gray-200 to-gray-50 rounded-2xl dark:from-[#2F3128] dark:to-[#2f3128]/[0.05] group hover:ring-1 hover:ring-[#18BB4E] p-10 relative transition duration-100"
            >
              <div className="space-y-6 flex flex-col items-center">
                <div className="w-20 h-20  bg-[#DADADA] dark:bg-[#3E3F3E] group-hover:bg-lime-600 rounded-2xl shadow grid place-content-center absolute -top-12 left-[45%] transition duration-100">
                  <img src="/images/google-white.svg" className="w-11" />
                </div>
                <h1 className="text-center text-neutral-700 text-2xl font-semibol capitalize leading-9 dark:text-white">
                  Google Bard
                </h1>
                <div className="max-w-[410px] mx-auto text-center leading-relaxed text-[#858585] dark:text-[#B1B2B1] group-hover:text-[#353535] dark:group-hover:text-white transition duration-300">
                  AI-powered chatbot tool designed by Google to simulate human
                  conversations using natural language processing and machine
                  learning.
                </div>
                <img
                  src={
                    hoverCard === "google-bard"
                      ? "/images/down-arrow-green.svg"
                      : theme === "dark"
                      ? "/images/down-arrow.svg"
                      : "/images/down-arrow-light.svg"
                  }
                  className="w-8 cursor-pointer"
                />
              </div>
            </div>
            <div
              onMouseOver={() => handleCardHover("anthropic-claude")}
              onMouseLeave={() => setHoverCard(null)}
              className="cursor-default bg-gradient-to-b from-gray-200 to-gray-50 rounded-2xl dark:from-[#2F3128] dark:to-[#2f3128]/[0.05] group hover:ring-1 hover:ring-[#18BB4E] p-10 relative transition duration-100"
            >
              <div className="space-y-6 flex flex-col items-center">
                <div className="w-20 h-20  bg-[#DADADA] dark:bg-[#3E3F3E] group-hover:bg-lime-600 rounded-2xl shadow grid place-content-center absolute -top-12 left-[45%] transition duration-100">
                  <img
                    src="/images/anthopic-white.svg"
                    className="w-11 translate-x-2"
                  />
                </div>
                <h1 className="text-center text-neutral-700 text-2xl font-semibol capitalize leading-9 dark:text-white">
                  Anthropic Claude 2.0
                </h1>
                <div className="max-w-[410px] mx-auto text-center leading-relaxed text-[#858585] dark:text-[#B1B2B1] group-hover:text-[#353535] dark:group-hover:text-white transition duration-300">
                  QuikAsk have integrated with claude it can do things like
                  create summaries, write code, translate text, and more.
                </div>
                <img
                  src={
                    hoverCard === "anthropic-claude"
                      ? "/images/down-arrow-green.svg"
                      : theme === "dark"
                      ? "/images/down-arrow.svg"
                      : "/images/down-arrow-light.svg"
                  }
                  className="w-8 cursor-pointer"
                />
              </div>
            </div>
            <div
              onMouseOver={() => handleCardHover("duck-duck-go")}
              onMouseLeave={() => setHoverCard(null)}
              className="cursor-default bg-gradient-to-b from-gray-200 to-gray-50 rounded-2xl dark:from-[#2F3128] dark:to-[#2f3128]/[0.05] group hover:ring-1 hover:ring-[#18BB4E] p-10 relative transition duration-100"
            >
              <div className="space-y-6 flex flex-col items-center">
                <div className="w-20 h-20  bg-[#DADADA] dark:bg-[#3E3F3E] group-hover:bg-lime-600 rounded-2xl shadow grid place-content-center absolute -top-12 left-[45%] transition duration-100">
                  <img src="/images/duckduckgo-white.svg" className="w-11" />
                </div>
                <h1 className="text-center text-neutral-700 text-2xl font-semibol capitalize leading-9 dark:text-white">
                  Duck Duck Go
                </h1>
                <div className="max-w-[410px] mx-auto text-center leading-relaxed text-[#858585] dark:text-[#B1B2B1] group-hover:text-[#353535] dark:group-hover:text-white transition duration-300">
                  A privacy-focused search engine that prioritizes user
                  anonymity by not tracking or storing personal information.
                </div>
                <img
                  src={
                    hoverCard === "duck-duck-go"
                      ? "/images/down-arrow-green.svg"
                      : theme === "dark"
                      ? "/images/down-arrow.svg"
                      : "/images/down-arrow-light.svg"
                  }
                  className="w-8 cursor-pointer"
                />
              </div>
            </div>
            <div className="w-[440px] h-[440px] absolute right-[-520px] bg-gradient-to-br from-teal-600/80 via-blue-500/50 to-green-600/80 blur-[500px] z-[0]" />
          </div>
          <div className="max-w-[1520px] w-full mx-auto px-2">
            <img
              src="/images/path.svg"
              className="absolute -translate-x-44 -translate-y-20 object-cover z-[0]"
            />
            <div className="flex flex-col md:flex-row justify-between gap-20 w-full mt-28 z-[1]">
              <div className="space-y-6">
                <div className="text-neutral-700 text-3xl font-bol capitalize leading-10 dark:text-white">
                  AI&apos;s Innovative Potential for
                  <br />
                  One-Click Content Generation
                </div>
                <div className="w-full pt-4 text-[#353535] font-normal leading-7 dark:text-[#B1B2B1]">
                  Crafting influential content requires a deep understanding of
                  your target audience. Pinpoint your ideal demographic and
                  familiarise yourself with their needs, passions, and sources
                  of concern.
                </div>
                <div className="space-y-5">
                  <div className="w-full flex items-start gap-4">
                    <div className="w-5 h-5">
                      <div className="w-5 h-5 border border-green-500 grid place-content-center">
                        <div className="w-2.5 h-2.5 bg-green-500"></div>
                      </div>
                    </div>
                    <p className="w-full text-[#353535] -mt-1 font-normal leading-7 dark:text-neutral-200">
                      Attract your audience with captivating facts in your
                      commercials
                    </p>
                  </div>
                  <div className="w-full flex items-start gap-4">
                    <div className="w-5 h-5">
                      <div className="w-5 h-5 border border-green-500 grid place-content-center">
                        <div className="w-2.5 h-2.5 bg-green-500"></div>
                      </div>
                    </div>
                    <p className="w-full text-[#353535] -mt-1 font-normal leading-7 dark:text-neutral-200">
                      Let&apos;s engage with the customers effectively
                    </p>
                  </div>
                  <div className="w-full flex items-start gap-4">
                    <div className="w-5 h-5">
                      <div className="w-5 h-5 border border-green-500 grid place-content-center">
                        <div className="w-2.5 h-2.5 bg-green-500"></div>
                      </div>
                    </div>
                    <p className="w-full text-[#353535] -mt-1 font-normal leading-7 dark:text-neutral-200">
                      Brighten up your content with appealing graphics:
                      pictures, clips, and graphs that will fascinate your
                      users!
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full grid content-center justify-center">
                <img src="/images/chatbot.png" className="w-96" />
              </div>
            </div>
            <div className="flex  flex-col-reverse md:flex-row justify-between gap-20 w-full mt-28 z-[1]">
              <div className="w-full grid content-center justify-center">
                <img src="/images/computerbot.png" className="w-96" />
              </div>
              <div className="w-full space-y-6">
                <div className="text-neutral-700 text-3xl font-bol capitalize leading-10 dark:text-white">
                  The key resource for First <br />
                  Page Content Optimization
                </div>
                <div className="w-full pt-4 text-[#353535] font-normal leading-7 dark:text-[#B1B2B1]">
                  &quot;Unlock Content Magic: Tailor Your Message to Win Hearts!
                  Discover Your Ideal Audience, Understand Their Desires,
                  Tastes, and Challenges!&quot;
                </div>
                <div className="space-y-5">
                  <div className="w-full flex items-start gap-4">
                    <div className="w-5 h-5">
                      <div className="w-5 h-5 border border-green-500 grid place-content-center">
                        <div className="w-2.5 h-2.5 bg-green-500"></div>
                      </div>
                    </div>
                    <p className="w-full text-[#353535] -mt-1 font-normal leading-7 dark:text-neutral-200">
                      Gain valuable insights into their expectations,
                      preferences, and aspirations.
                    </p>
                  </div>
                  <div className="w-full flex items-start gap-4">
                    <div className="w-5 h-5">
                      <div className="w-5 h-5 border border-green-500 grid place-content-center">
                        <div className="w-2.5 h-2.5 bg-green-500"></div>
                      </div>
                    </div>
                    <p className="w-full text-[#353535] -mt-1 font-normal leading-7 dark:text-neutral-200">
                      Create captivating content that speaks directly to their
                      hearts and minds.
                    </p>
                  </div>
                  <div className="w-full flex items-start gap-4">
                    <div className="w-5 h-5">
                      <div className="w-5 h-5 border border-green-500 grid place-content-center">
                        <div className="w-2.5 h-2.5 bg-green-500"></div>
                      </div>
                    </div>
                    <p className="text-[#353535] -mt-1 font-normal leading-7 dark:text-neutral-200">
                      Identify the precise pain points and challenges your
                      audience faces, and provide solutions through your
                      content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex  flex-col md:flex-row justify-between gap-20 mt-28 z-[1]">
              <div className="w-full space-y-6">
                <div className="text-neutral-700 text-3xl font-bol capitalize leading-10 dark:text-white">
                  QuikAsk: Your Companion for
                  <br />
                  Hashtags, Captions, and More!
                </div>
                <p className="w-full pt-4 text-[#353535] font-normal leading-7 dark:text-[#B1B2B1]">
                  Experience the power of QUIKASK AI and revolutionise your
                  social media presence. Say goodbye to writer&apos;s block and
                  hello to compelling hashtags, captivating captions, and
                  endless content possibilities.
                </p>
                <div className="space-y-5">
                  <div className="w-full flex items-start gap-4">
                    <div className="w-5 h-5">
                      <div className="w-5 h-5 border border-green-500 grid place-content-center">
                        <div className="w-2.5 h-2.5 bg-green-500"></div>
                      </div>
                    </div>
                    <p className="w-full text-[#353535] -mt-1 font-normal leading-7 dark:text-neutral-200">
                      Curate endless content possibilities that make your
                      website shine.
                    </p>
                  </div>
                  <div className="w-full flex items-start gap-4">
                    <div className="w-5 h-5">
                      <div className="w-5 h-5 border border-green-500 grid place-content-center">
                        <div className="w-2.5 h-2.5 bg-green-500"></div>
                      </div>
                    </div>
                    <p className="w-full text-[#353535] -mt-1 font-normal leading-7 dark:text-neutral-200">
                      Generates compelling hashtags that skyrocket your reach
                    </p>
                  </div>
                  <div className="w-full flex items-start gap-4">
                    <div className="w-5 h-5">
                      <div className="w-5 h-5 border border-green-500 grid place-content-center">
                        <div className="w-2.5 h-2.5 bg-green-500"></div>
                      </div>
                    </div>
                    <p className="w-full text-[#353535] -mt-1 font-normal leading-7 dark:text-neutral-200">
                      Unlock a world of unlimited content ideas that keep your
                      followers hooked.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full grid content-center justify-center">
                <img src="/images/littlebot.png" className="w-96" />
              </div>
            </div>
          </div>
          <div className="mt-40">
            <div className="w-[340px] h-[340px] absolute left-1/3 bg-gradient-to-br from-blue-600 via-teal-500/60 to-green-500 blur-[360px] z-[0]" />
            <div className="w-[440px] h-[440px] absolute right-40 bg-gradient-to-br from-blue-600 via-lime-500/60 to-orange-500 blur-[360px] z-[0]" />
            <div className="w-full flex justify-center text-center text-neutral-700 md:text-3xl text-xl font-bol capitalize leading-10 dark:text-white relative z-[1]">
              <div className="w-full flex justify-center text-center text-neutral-700 md:text-3xl text-2xl font-bol capitalize leading-10 dark:text-white gap-2 md:gap-4">
                <img
                  src="/images/spiral-arrow-left.svg"
                  className="w-32 hidden sm:block"
                />
                <h1 className="max-w-lg w-full">
                  Check out how much{" "}
                  <span className="text-[#69A606]">QuikAsk</span> is loved by
                  our users!
                </h1>
                <img
                  src="/images/spiral-arrow-right.svg"
                  className="w-32 hidden sm:block"
                />
              </div>
            </div>
            <div className="mt-14 w-full flex justify-center items-center relative z-[1]">
              <div className="flex flex-col md:flex-row items-center p-2">
                <img
                  src="/images/testimonial.jpg"
                  className="w-full max-w-[384px] md:w-80"
                />
                <div className="flex flex-col gap-8 md:mt-10">
                  <div className="ml-7">
                    <h1 className="text-2xl dark:text-white">
                      Cameron Williamson
                    </h1>
                    <p className="text-neutral-700 text-opacity-60 text-sm dark:text-neutral-400">
                      CEO & Owner, Vision Trust
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-end md:relative">
                    <div className="bg-[#0e3a1e] w-full md:w-[1180px] h-[140px] md:absolute -right-[24%] mix-blend-multiply flex justify-between items-center">
                      <div className="w-full flex justify-start h-full cursor-pointer max-w-[200px] pl-10">
                        <img
                          src={
                            theme === "dark"
                              ? "/images/Frame-Left-dark.svg"
                              : "/images/Frame-Left.svg"
                          }
                          alt="left"
                          className="w-[45px]"
                        />
                      </div>
                      <div className="w-full flex justify-end h-full cursor-pointer max-w-[200px] pr-10">
                        <img
                          src={
                            theme === "dark"
                              ? "/images/Frame-Right-dark.svg"
                              : "/images/Frame-Right.svg"
                          }
                          alt="left"
                          className="w-[45px]"
                        />
                      </div>
                    </div>
                    <div className="w-full max-w-xl bg-gradient-to-b from-[#DADADA] to-[#A1A1A1] relative z-[1]">
                      <img
                        src="/images/quote.svg"
                        className="absolute w-6 m-6"
                      />
                      <div className="text-white/90 dark:bg-black p-12 leading-loose">
                        It&apos;s like having a 24/7 virtual assistant that can
                        engage with our customers intelligently and provide
                        instant support. The chatbot&apos;s natural language
                        understanding and quick responses have improved our
                        efficiency. It&apos;s truly a valuable addition to our
                        team!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-[1520px] mx-auto mt-28">
            <div className="flex justify-center px-2">
              <div className="w-full space-y-3">
                <div className="w-full flex justify-center text-center text-neutral-700 md:text-3xl text-2xl font-bold capitalize leading-10 dark:text-white gap-4">
                  <img
                    src="/images/spiral-arrow-left.svg"
                    className="w-32 hidden sm:block"
                  />
                  <h1 className="max-w-lg w-full">
                    frequently asked questions
                  </h1>
                  <img
                    src="/images/spiral-arrow-right.svg"
                    className="w-32 hidden sm:block"
                  />
                </div>
                <div className="text-center text-neutral-700 leading-7 dark:text-neutral-400">
                  Here, you can find some useful information about QuikAsk
                </div>
              </div>
            </div>
            <div className="mt-20">
              <div className="flex border-t border-[#b4b4b433] dark:border-neutral-700  items-center justify-between px-4 sm:px-8">
                <div className="flex items-center py-4 sm:py-6 gap-3 sm:gap-6">
                  <div className="text-outline font-sans font-bold text-center align-middle text-3xl sm:text-5xl capitalize leading-10 text-transparent bg-clip-text">
                    01
                  </div>
                  <div className="text-neutral-700 text-md sm:text-2xl capitalize sm:leading-10 dark:text-white">
                    Is the content unique?
                  </div>
                </div>
                <img
                  src="/images/plus-green.svg"
                  className="w-6 cursor-pointer"
                />
              </div>
            </div>

            <div className="">
              <div className="flex border-t border-[#b4b4b433] dark:border-neutral-700 items-center justify-between px-4 sm:px-8">
                <div className="flex items-center py-4 sm:py-6 gap-3 sm:sm:gap-6">
                  <div className="text-outline font-sans font-bold text-center align-middle text-3xl sm:text-5xl capitalize leading-10 text-transparent bg-clip-text">
                    02
                  </div>
                  <div className="text-neutral-700 text-md sm:text-2xl capitalize sm:leading-10 dark:text-white">
                    How can I boost traffic with Quik ASk?
                  </div>
                </div>
                <img
                  src="/images/plus-green.svg"
                  className="w-6 cursor-pointer"
                />
              </div>
            </div>
            <div className="w-[440px] h-[440px] absolute right-1/3 bg-gradient-to-br from-orange-400/40 via-lime-500/40 to-green-600/40 blur-[380px] z-[0]" />

            <div className="">
              <div className="flex border-t border-[#b4b4b433] dark:border-neutral-700 items-center justify-between px-4 sm:px-8">
                <div className="flex items-center py-4 sm:py-6 gap-3 sm:sm:gap-6">
                  <div className="text-outline font-sans font-bold text-center align-middle text-3xl sm:text-5xl capitalize leading-10 text-transparent bg-clip-text">
                    03
                  </div>
                  <div className="text-neutral-700 text-md sm:text-2xl capitalize sm:leading-10 dark:text-white">
                    How long will it take to write an article with AI?
                  </div>
                </div>
                <img
                  src="/images/plus-green.svg"
                  className="w-6 cursor-pointer"
                />
              </div>
            </div>
            <div className="">
              <div className="flex border-t border-[#b4b4b433] dark:border-neutral-700 items-center justify-between px-4 sm:px-8">
                <div className="flex items-center py-4 sm:py-6 gap-3 sm:gap-6">
                  <div className="text-outline font-sans font-bold text-center align-middle text-3xl sm:text-5xl capitalize leading-10 text-transparent bg-clip-text">
                    04
                  </div>
                  <div className="text-neutral-700 text-md sm:text-2xl capitalize sm:leading-10 dark:text-white">
                    Is there a limit to the amount of stuff that I can create?
                  </div>
                </div>
                <img
                  src="/images/plus-green.svg"
                  className="w-6 cursor-pointer"
                />
              </div>
            </div>
            <div className="">
              <div className="flex border-t border-[#b4b4b433] dark:border-neutral-700 items-center justify-between px-4 sm:px-8">
                <div className="flex items-center py-4 sm:py-6 gap-3 sm:gap-6">
                  <div className="text-outline font-sans font-bold text-center align-middle text-3xl sm:text-5xl capitalize leading-10 text-transparent bg-clip-text">
                    05
                  </div>
                  <div className="text-neutral-700 text-md sm:text-2xl capitalize sm:leading-10 dark:text-white">
                    What languages do you support?
                  </div>
                </div>
                <img
                  src="/images/plus-green.svg"
                  className="w-6 cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="w-full max-w-[1520px] mx-auto mt-28">
            <div className="w-[340px] h-[340px] absolute bg-gradient-to-br from-blue-600 via-teal-500/50 to-green-600 blur-[420px] z-[0]" />
            <div className="text-neutral-700 text-3xl font-bold capitalize pb-12 leading-10 dark:text-white px-4 relative z-[1]">
              Trusted By
            </div>
            <div className="border-y border-[#b4b4b433] dark:border-white/10 bg-transparent relative z-[1] py-4">
              <div className="p-3 flex items-center gap-2 flex-wrap justify-between ">
                <div className="w-32">
                  <img
                    src={
                      theme === "dark"
                        ? "/images/paypal-logo-dark.png"
                        : "/images/paypal-logo-light.png"
                    }
                  />
                </div>
                <div className="w-20">
                  <img
                    src={
                      theme === "dark"
                        ? "/images/visa-logo-dark.png"
                        : "/images/visa-logo-light.png"
                    }
                  />
                </div>
                <div className="w-28">
                  <img
                    src={
                      theme === "dark"
                        ? "/images/amazon-logo-dark.png"
                        : "/images/amazon-logo-light.png"
                    }
                  />
                </div>
                <div className="w-28">
                  <img
                    src={
                      theme === "dark"
                        ? "/images/citibank-logo-dark.png"
                        : "/images/citibank-logo-light.png"
                    }
                  />
                </div>
                <div className="w-16">
                  <img
                    src={
                      theme === "dark"
                        ? "/images/w.png"
                        : "/images/w-logo-light.png"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-28 max-w-[1520px] mx-auto p-3 space-y-4">
            <div className="w-[340px] h-[340px] absolute right-96 bg-gradient-to-br from-lime-600 via-teal-500/50 to-green-600 blur-[360px] z-[0]" />
            <div className="text-4xl md:text-5xl font-semibold text-center capitalize leading-10 text-neutral-700 dark:text-white">
              Trade With Anyone
            </div>
            <div className="text-neutral-700 justify-center flex pt-3 dark:text-neutral-400">
              <p className="max-w-[700px] text-sm sm:text-base w-full text-center">
                Lorem ipsum dolor sit amet consectetur. Nisi risus at ac
                vestibulum ut. Amet bibendum mi eu leo. Ut odio ipsum et quis id
                ridiculus commodo tincidunt ridiculus. Lacus ut sit vestibulum
                at.
              </p>
            </div>
            <div className="flex flex-wrap justify-center pt-3 gap-3">
              <div className="bg-[#314331] p-2.5 rounded-full hover:bg-[#69A606] transition duration-300 cursor-pointer">
                <img src="/images/discord.png" className="w-5" />
              </div>
              <div className="bg-[#314331] p-2.5 rounded-full hover:bg-[#69A606] transition duration-300 cursor-pointer">
                <img src="/images/telegram.png" className="w-5" />
              </div>
              <div className="bg-[#314331] p-2.5 rounded-full hover:bg-[#69A606] transition duration-300 cursor-pointer">
                <img src="/images/twitter.png" className="w-5" />
              </div>
              <div className="bg-[#314331] p-2.5 rounded-full hover:bg-[#69A606] transition duration-300 cursor-pointer">
                <img src="/images/linkedin.png" className="w-5" />
              </div>
              <div className="bg-[#314331] p-2.5 rounded-full hover:bg-[#69A606] transition duration-300 cursor-pointer">
                <img src="/images/facebook.png" className="w-5" />
              </div>
              <div className="bg-[#314331] p-2.5 rounded-full hover:bg-[#69A606] transition duration-300 cursor-pointer">
                <img src="/images/instagram.png" className="w-5" />
              </div>
              <div className="bg-[#314331] p-2.5 rounded-full hover:bg-[#69A606] transition duration-300 cursor-pointer">
                <img src="/images/reddit.png" className="w-5" />
              </div>
            </div>
          </div>
          <div className="mt-28 border-t border-white/10 py-10">
            <div className="max-w-[1520px] mx-auto h-8 flex justify-between flex-col sm:flex-row px-4">
              <div className="text-neutral-700  font-normal leading-loose dark:text-[#858585]">
                Contact Us: support@quikask.com
              </div>
              <div className="text-neutral-700  font-normal leading-loose dark:text-[#858585]">
                © 2023 QuikAsk
              </div>
              <div className="text-neutral-700  font-normal leading-loose dark:text-[#858585]">
                Privacy Policy
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
