"use client";
import { useState, useEffect } from "react";
import { useChat } from "@/app/hooks/useChat";
import Chat from "@/components/my_components/chat";
import ChatHistory from "@/components/my_components/ChatHistory";
import { getChatbotsInfor } from "@/app/utils/api";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const chatbotId = searchParams.get("chatbotId"); // Lấy chatbotId từ URL
  const dify_chatbot_id = searchParams.get("difyChatbotId"); // Lấy difyC_chatbot_id từ URL

  const {
    messages,
    chatSessions,
    selectedSession,
    isLoading,
    sendMessage,
    selectChatSession,
    deleteChatSession,
    addNewChatSession,
    resetMessages,
  } = useChat();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chatbotInfo, setChatbotInfo] = useState<any>(null);

  useEffect(() => {
    if (!selectedSession) {
      resetMessages(); // Reset tin nhắn khi không có phiên nào
    }
  }, [selectedSession, resetMessages]);

  useEffect(() => {
    async function fetchChatbotInfo() {
      if (!chatbotId) return;
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found");
          return;
        }
        const data = await getChatbotsInfor(token, parseInt(chatbotId));
        setChatbotInfo(data);
      } catch (error) {
        console.error("Error fetching chatbot info:", error);
      }
    }
    fetchChatbotInfo();
  }, [chatbotId]);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
      {/* Sidebar lịch sử chat (bên trái) */}
      <div className="w-1.5/5 bg-white border-r flex flex-col h-full p-4 shadow-lg overflow-y-auto">
        <ChatHistory
          chatSessions={chatSessions} // Chỉ lấy phiên chat của chatbot hiện tại
          selectChatSession={selectChatSession}
          selectedSession={selectedSession}
          addNewChatSession={addNewChatSession}
          deleteChatSession={deleteChatSession}
          chatbotInfo={chatbotInfo} // Truyền thông tin chatbot vào
        />
      </div>

      {/* Phần chat chính (bên phải) */}
      <div className="flex-grow flex flex-col p-6 bg-white shadow-lg rounded-lg">
        <Chat
          messages={messages}
          sendMessage={(message: string) =>
            sendMessage(message, dify_chatbot_id || undefined)
          } // ✅ Đảo lại thứ tự tham số
          isLoading={isLoading}
          dify_chatbot_id={dify_chatbot_id || ""}
        />
      </div>
    </div>
  );
}
