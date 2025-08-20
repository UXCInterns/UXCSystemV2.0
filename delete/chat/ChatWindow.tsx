"use client";

import { useState } from "react";
import MessageBubble from "./MessageBubble";
import { Paperclip, Mic } from "lucide-react";

const initialMessages = [
  {
    id: 1,
    text: "I want to make an appointment tomorrow from 2:00 to 5:00pm?",
    sender: "them",
    time: "3:13 pm",
    senderName: "Lindsey",
    avatarUrl: "/images/user/user-02.jpg",
  },
  {
    id: 2,
    text: "If don’t like something, I’ll stay away from it.",
    sender: "me",
    time: "3:15 pm",
  },
  {
    id: 3,
    text: "They got there early, and got really good seats.",
    sender: "me",
    time: "3:16 pm",
  },
];

const ChatWindow = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleSend = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newMessage = {
      id: messages.length + 1,
      text: trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
      sender: "me",
      time: new Date()
        .toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
        .toLowerCase(),

    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  };


  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:w-3/4">
      {/* Top Bar */}
      <div className="sticky flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800 xl:px-6">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-full max-w-[48px] rounded-full">
            <img src="/images/user/user-02.jpg" alt="profile" className="h-full w-full overflow-hidden rounded-full object-cover object-center" />
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
          </div>
          <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Lindsey Curtis</h5>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">    
            <button className="text-gray-700 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
              <svg className="stroke-current" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5.54488 11.7254L8.80112 10.056C8.94007 9.98476 9.071 9.89524 9.16639 9.77162C9.57731 9.23912 9.66722 8.51628 9.38366 7.89244L7.76239 4.32564C7.23243 3.15974 5.7011 2.88206 4.79552 3.78764L3.72733 4.85577C3.36125 5.22182 3.18191 5.73847 3.27376 6.24794C3.9012 9.72846 5.56003 13.0595 8.25026 15.7497C10.9405 18.44 14.2716 20.0988 17.7521 20.7262C18.2615 20.8181 18.7782 20.6388 19.1442 20.2727L20.2124 19.2045C21.118 18.2989 20.8403 16.7676 19.6744 16.2377L16.1076 14.6164C15.4838 14.3328 14.7609 14.4227 14.2284 14.8336C14.1048 14.929 14.0153 15.06 13.944 15.1989L12.2747 18.4552"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div> 

          <div className="relative">
            <button className="text-gray-700 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
              <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.25 5.25C3.00736 5.25 2 6.25736 2 7.5V16.5C2 17.7426 3.00736 18.75 4.25 18.75H15.25C16.4926 18.75 17.5 17.7426 17.5 16.5V15.3957L20.1118 16.9465C20.9451 17.4412 22 16.8407 22 15.8716V8.12838C22 7.15933 20.9451 6.55882 20.1118 7.05356L17.5 8.60433V7.5C17.5 6.25736 16.4926 5.25 15.25 5.25H4.25ZM17.5 10.3488V13.6512L20.5 15.4325V8.56756L17.5 10.3488ZM3.5 7.5C3.5 7.08579 3.83579 6.75 4.25 6.75H15.25C15.6642 6.75 16 7.08579 16 7.5V16.5C16 16.9142 15.6642 17.25 15.25 17.25H4.25C3.83579 17.25 3.5 16.9142 3.5 16.5V7.5Z"
                  />
              </svg>
            </button>
          </div>

          <div className="relative">
            <button onClick={() => setOpenDropdown(!openDropdown)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
              <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z"
                />
              </svg>
            </button>

            {openDropdown && (
                <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-800 z-50 p-2">
                <button className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">
                    View More
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">
                    Clear Chat
                </button>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Body */}
      <div className="custom-scrollbar max-h-full flex-1 space-y-6 overflow-auto p-5 xl:space-y-8 xl:p-6 bg-gray-100 dark:bg-[#0f172a]">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            isSender={msg.sender === "me"}
            time={msg.time}
            senderName={msg.senderName}
            avatarUrl={msg.avatarUrl}
          />
        ))}
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-gray-200 p-3 dark:border-gray-800">
        <form className="flex items-center justify-between" onSubmit={handleSend}>
          <div className="relative w-full">
            <button className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 sm:left-3">
              <svg
                className="fill-current"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12ZM10.0001 9.23256C10.0001 8.5422 9.44042 7.98256 8.75007 7.98256C8.05971 7.98256 7.50007 8.5422 7.50007 9.23256V9.23266C7.50007 9.92301 8.05971 10.4827 8.75007 10.4827C9.44042 10.4827 10.0001 9.92301 10.0001 9.23266V9.23256ZM15.2499 7.98256C15.9403 7.98256 16.4999 8.5422 16.4999 9.23256V9.23266C16.4999 9.92301 15.9403 10.4827 15.2499 10.4827C14.5596 10.4827 13.9999 9.92301 13.9999 9.23266V9.23256C13.9999 8.5422 14.5596 7.98256 15.2499 7.98256ZM9.23014 13.7116C8.97215 13.3876 8.5003 13.334 8.17625 13.592C7.8522 13.85 7.79865 14.3219 8.05665 14.6459C8.97846 15.8037 10.4026 16.5481 12 16.5481C13.5975 16.5481 15.0216 15.8037 15.9434 14.6459C16.2014 14.3219 16.1479 13.85 15.8238 13.592C15.4998 13.334 15.0279 13.3876 14.7699 13.7116C14.1205 14.5274 13.1213 15.0481 12 15.0481C10.8788 15.0481 9.87961 14.5274 9.23014 13.7116Z"
                fill=""
                />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Type a message"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-9 w-full border-none bg-transparent pl-12 pr-5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-0 focus:ring-0 dark:text-white/90"
            />
          </div>

          <div className="flex items-center">
            <button className="mr-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="mr-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
              <Mic className="w-5 h-5" />
            </button>
            <button type="submit" className="ml-2 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white hover:bg-brand-600">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.98481 2.44399C3.11333 1.57147 1.15325 3.46979 1.96543 5.36824L3.82086 9.70527C3.90146 9.89367 3.90146 10.1069 3.82086 10.2953L1.96543 14.6323C1.15326 16.5307 3.11332 18.4291 4.98481 17.5565L16.8184 12.0395C18.5508 11.2319 18.5508 8.76865 16.8184 7.961L4.98481 2.44399ZM3.34453 4.77824C3.0738 4.14543 3.72716 3.51266 4.35099 3.80349L16.1846 9.32051C16.762 9.58973 16.762 10.4108 16.1846 10.68L4.35098 16.197C3.72716 16.4879 3.0738 15.8551 3.34453 15.2223L5.19996 10.8853C5.21944 10.8397 5.23735 10.7937 5.2537 10.7473L9.11784 10.7473C9.53206 10.7473 9.86784 10.4115 9.86784 9.99726C9.86784 9.58304 9.53206 9.24726 9.11784 9.24726L5.25157 9.24726C5.2358 9.20287 5.2186 9.15885 5.19996 9.11528L3.34453 4.77824Z"
                fill="white"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
