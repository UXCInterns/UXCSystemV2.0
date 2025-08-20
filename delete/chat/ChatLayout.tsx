import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const ChatLayout = () => {
  return (
    <div className="h-[calc(100vh-186px)] overflow-hidden sm:h-[calc(100vh-125px)]">
        <div className="flex h-full flex-col gap-6 xl:flex-row xl:gap-5">
        <ChatSidebar />
        <ChatWindow />
        </div>
    </div>
  );
};

export default ChatLayout;
