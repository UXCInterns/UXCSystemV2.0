interface Props {
  text: string;
  isSender: boolean;
  time: string;
  senderName?: string;
  avatarUrl?: string;
}

const MessageBubble = ({ text, isSender, time, senderName, avatarUrl }: Props) => {
  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-4`}>
      {!isSender && (
        <div className="max-w-[450px]">
          <div className="flex items-start gap-4">
            <div className="h-10 w-full max-w-10 rounded-full">
              <img
                src={avatarUrl || "/images/default-avatar.jpg"}
                alt="profile"
                className="h-full w-full overflow-hidden rounded-full object-cover object-center"
              />
            </div>

            <div>
            <div className="rounded-lg rounded-tr-sm bg-gray-200 px-3 py-2 dark:bg-white/5">
                <div className="flex items-end justify-between gap-2">
                    <p className="text-start text-sm text-gray-800 dark:text-white/90">{text}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap -mb-1">{time}</span>
                </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {isSender && (
        <div className="flex flex-col items-end max-w-[450px] text-right">
         <div className="rounded-lg rounded-tr-sm bg-brand-500 px-3 py-2 dark:bg-brand-500 text-white dark:text-white/90">
            <div className="flex items-end justify-between gap-2">
                <p className="text-sm text-start">{text}</p>
                <span className="text-xs text-white/70 whitespace-nowrap -mb-1">{time}</span>
            </div>
         </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
