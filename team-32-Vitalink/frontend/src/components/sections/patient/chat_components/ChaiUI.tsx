import { useState, useEffect, useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import { useLocation } from "react-router-dom";
import { PatientSidebar } from "../../../sidebars/PatientSidebar";
import { SidebarProvider, SidebarTrigger } from "../../../ui/sidebar";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { RiRobot2Fill } from "react-icons/ri";
import { SiGoogledisplayandvideo360 } from "react-icons/si";

import { getGeminiResponse } from "../../../../services/gemini";
import { useUser } from "../../../../contexts/UserContext";

import speaker from "../../../../assets/images/volume_up.svg";

interface Message {
  id: string;
  sender: "bot" | "patient";
  content: string;
  timestamp: string;
  type: "text" | "file";
}

const ChatUI = () => {
  const { user } = useUser();
  const location = useLocation();
  const isBot = location.pathname.includes("/bot/");
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem("chatMessages");
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        // Validate that parsedMessages is an array
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          return parsedMessages;
        }
      }
    } catch (error) {
      console.error("Error loading messages from localStorage:", error);
      // If there's an error, clear the corrupted data
      localStorage.removeItem("chatMessages");
    }

    // Return default initial message if no valid messages found
    return [
      {
        id: "1",
        sender: "bot",
        content: `Hello, ${
          user?.username || "there"
        }, How are you feeling today?`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
      },
    ];
  });

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving messages to localStorage:", error);
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const patientMessage: Message = {
        id: Date.now().toString(),
        sender: "patient",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
      };

      setMessages((prev) => [...prev, patientMessage]);
      setNewMessage("");
      setLoading(true);

      try {
        const botReply = await getGeminiResponse(newMessage);

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          content: botReply,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: "text",
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Error fetching bot response:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNewConversation = () => {
    const newInitialMessage: Message = {
      id: "1",
      sender: "bot",
      content: `Hello, ${
        user?.username || "there"
      }, How are you feeling today?`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
    };

    setMessages([newInitialMessage]);
    try {
      localStorage.removeItem("chatMessages");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  const handleReadAloud = (messageId: string, text: string) => {
    // If the clicked message is already speaking, stop it
    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    // Stop any ongoing speech before starting new one
    window.speechSynthesis.cancel();

    // Detect language
    const isHausa = /(?:\b(?:ina|ka|ki|zaka|zaki|yaya|gani|akwai)\b)/i.test(
      text
    );
    const isPigin = /(?:\b(?:dey|abeg|na|wahala|omo|wetin|no vex|sha)\b)/i.test(
      text
    );

    const utterance = new SpeechSynthesisUtterance(text);

    if (isHausa) {
      utterance.lang = "ha-NG";
    } else if (isPigin) {
      utterance.lang = "en-NG";
    } else {
      utterance.lang = "en-US";
    }

    utterance.onend = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const SidebarComponent = PatientSidebar;

  // Ensure messages is always an array before rendering
  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full m-auto absolute top-0 bg-background">
        <SidebarComponent />
        <div className="flex flex-col w-full h-screen">
          {/* Fixed Header */}
          <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-6 flex-shrink-0">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Chat</h1>
              <p className="text-sm text-muted-foreground hidden md:flex">
                Secure messaging with your mental health chatbot
              </p>
            </div>
          </header>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Fixed Chat Header */}
            <div className="p-4 border-b bg-card flex items-center justify-between flex-shrink-0">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <RiRobot2Fill size={20} className="text-blue-600" />
                  <span className="text-sm">Health Bot</span>
                </div>
                <div>
                  <p className="text-sm text-success">online</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleNewConversation}>
                  New Conversation
                </Button>
                <Button
                  variant="secondary"
                  className="bg-green-600 text-white hover:bg-green-700 hidden md:block"
                >
                  Update Vitals
                </Button>
              </div>
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar"
            >
              {safeMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-1 ${
                    (isBot && message.sender === "bot") ||
                    (!isBot && message.sender === "patient")
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="hidden md:block">
                      <SiGoogledisplayandvideo360
                        size={20}
                        className="text-blue-600 mt-1"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-2 items-start">
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        (isBot && message.sender === "bot") ||
                        (!isBot && message.sender === "patient")
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          (isBot && message.sender === "bot") ||
                          (!isBot && message.sender === "patient")
                            ? "text-primary-foreground/70"
                            : "text-accent-foreground/70"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>

                    {message.sender === "bot" && (
                      <button
                        onClick={() =>
                          handleReadAloud(message.id, message.content)
                        }
                        className={`px-2 py-1 border-none rounded-md flex items-center gap-1 transition-all 
    focus:outline-none focus:ring-0
    ${
      speakingMessageId === message.id
        ? "bg-red-100 hover:bg-red-200"
        : "bg-gray-100 hover:bg-gray-200"
    }`}
                      >
                        <img
                          src={speaker}
                          alt="Speak out"
                          className="w-4 h-4"
                        />
                        <span className="text-xs text-gray-700">
                          {speakingMessageId === message.id && "Stop"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    <SiGoogledisplayandvideo360
                      size={20}
                      className="text-blue-600 mt-1"
                    />
                  </span>
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-card border-border/50 backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-center md:text-left text-muted-foreground mt-2 px-2">
                All messages are encrypted and HIPAA compliant
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ChatUI;
