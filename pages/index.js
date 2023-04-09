import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
const G6component = dynamic(
  () => import('../components/G6component'),
  { ssr: false }
)

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState();
  const [collapsed, setSidebarCollapsed] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setUserInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <main className="flex min-h-screen flex-col gap-4 items-center justify-between">
      <G6component id="container"/>
      {/* <Sidebar className="absolute w-1/4 max-h-[640px] right-[4vw] top-1/2 -translate-y-1/2 h-full bg-slate-50" collapsed={collapsed} setCollapsed={()=> setSidebarCollapsed((prev)=>!prev)}/> */}
      {/* <div className="absolute w-1/4 max-h-[640px] right-[4vw] top-1/2 -translate-y-1/2 h-full bg-slate-50">detail area</div> */}
      <div className="w-full items-center justify-between font-mono text-sm flex">
        <p className="left-0 top-0 flex w-full justify-center border-gray-300 bg-gradient-to-b from-gray-200 to-white/10 backdrop-blur-sm border  p-5 font-mono font-bold">
          Copilot For X
        </p>

       
      </div>
      <div className="flex flex-row justify-center gap-4 w-full px-20 ">
        {/* <div id="map-container" className="bg-white h-[600px] w-full mt-5">
          map-container
        </div> */}
        <form
          onSubmit={onSubmit}
          className="flex p-4 rounded-full bg-white/20 w-full max-w-[800px] m-8 z-10"
        >
          <input
            type="text"
            name="user"
            placeholder="Enter your prompt"
            value={userInput}
            className="w-full text-xl rounded-l-full px-6 focus:outline-none"
            onChange={(e) => setUserInput(e.target.value)}
          />
          <input
            type="submit"
            value="→"
            className="text-xl rounded-r-full px-6 py-3 bg-white hover:cursor-pointer outline-none"
          />
        </form>
      </div>
      {/* <div id="doc-container" className="bg-white min-h-full w-1/3 mt-5">
          doc-container
        </div> */}
      <div className="absolute bottom-0 right-0 p-5">{result}</div>



      {/* <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p
            className={`${inter.className} m-0 max-w-[30ch] text-sm opacity-50`}
          >
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p
            className={`${inter.className} m-0 max-w-[30ch] text-sm opacity-50`}
          >
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p
            className={`${inter.className} m-0 max-w-[30ch] text-sm opacity-50`}
          >
            Discover and deploy boilerplate example Next.js&nbsp;projects.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p
            className={`${inter.className} m-0 max-w-[30ch] text-sm opacity-50`}
          >
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div> */}
    </main>
  );
}
