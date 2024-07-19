"use client";
import { useEffect, useState } from "react";
import Interview from "../Interview";
import Navbar from "../Navbar";
import Image from "next/image";
import HoverBorderGradient from "../ui/border-gradient";
import Particles from "../ui/particles";
import { FlipWords } from "../ui/flipwords";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [color, setColor] = useState("#ffffff");
  const words1 = [
    {
      text: "real-time",
      className: "text-xl font-medium",
    },
  ];

  const words2 = [
    {
      text: "personalized",
      className: "text-xl font-medium text-orange-500",
    },
  ];

  const router = useRouter();

  const [word, setWord] = useState(words1);
  const [key, setKey] = useState(0);
  const words = ["better", "cute", "beautiful", "modern"];

  useEffect(() => {
    const interval = setInterval(() => {
      setWord((prevWords) => (prevWords === words1 ? words2 : words1));
      setKey((prevKey) => prevKey + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex flex-col relative dark bg-custom-gradient bg-black   animate-gradient-pulse justify-center items-center">
        <div className="absolute top-0 left-0 mx-5">
          <Image
            src="/logo2.svg"
            width={50}
            height={50}
            className="h-[100%] w-[100px]"
          />
        </div>
        <Navbar className="top-2 dark border rounded-full border-gray-700/50" />

        <section className="relative border-b border-gray-500/20 text-white min-h-screen justify-center items-center flex w-full text-center flex-col  ">
          <Particles
            className="absolute  inset-0"
            quantity={80}
            ease={80}
            color={color}
            refresh
          />
          <div className="w-fit flex flex-col pointer-events-none justify-center mb-2">
            <div className="text-xl font-medium text-left leading-none tracking-tighter">
              Welcome to{" "}
            </div>

            <div className=" text-8xl font-medium leading-none tracking-tighter text-balance bg-gradient-to-b from-white  from-35% to-orange-500/10 text-transparent bg-clip-text">
              Interview Sensei
            </div>
          </div>
          <div className="flex z-30 gap-2 justify-center items-center">
            <button className=" border-2 hover:bg-black transition-all duration-200 text-sm border-orange-200/10 text-gray-200 rounded-full px-5 py-2 ">
              Learn More
            </button>
            <HoverBorderGradient
              onClick={() => router.push("/interview")}
              className="text-sm"
            >
              Get Started
            </HoverBorderGradient>
          </div>
          {/* <div className="text-xl mb-8 transition-all duration-200 flex items-center justify-center gap-0.5">
            <span>Interaction and training to ace your interviews with</span>{" "}
            <TypewriterEffectSmooth
              className="text-orange-600"
              key={key}
              words={word}
            />{" "}
          </div> */}
        </section>
      </div>
      {/* Features Section */}
      <section id="features" className="py-20 bg-black h-screen text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-6xl font-medium tracking-tighter leading-none text-balance text-center mb-12 bg-gradient-to-br from-white  from-35% to-black/10 text-transparent bg-clip-text">
            Be 10x more successful in interviews
          </h2>
          <div className="">
            <div className="text-xl mb-8 transition-all duration-200 flex items-center justify-center gap-0.5">
              <span>Interaction and training to ace your interviews with</span>{" "}
              {/* <TypewriterEffectSmooth
                className="text-orange-600"
                key={key}
                words={word}
              />{" "} */}
              <FlipWords words={words} className="dark text-orange-500" />
            </div>
          </div>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="p-6 bg-gray-700 rounded-lg shadow-lg text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Real-Time Interaction
                </h3>
                <p>Engage in live mock interviews with experts.</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="p-6 bg-gray-700 rounded-lg shadow-lg text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Personalized Training
                </h3>
                <p>
                  Receive feedback and tailored advice based on your
                  performance.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="p-6 bg-gray-700 rounded-lg shadow-lg text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Comprehensive Resources
                </h3>
                <p>
                  Access a wide range of interview questions and industry
                  insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <Interview /> */}
    </>
  );
}
