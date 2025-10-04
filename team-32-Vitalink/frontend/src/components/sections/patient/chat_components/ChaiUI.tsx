import { useState } from "react";
import { Send, Paperclip, User, User2Icon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { PatientSidebar } from "../../../sidebars/PatientSidebar";
import { SidebarProvider, SidebarTrigger } from "../../../ui/sidebar";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { RiRobot2Fill } from "react-icons/ri";

interface Message {
  id: string;
  sender: "bot" | "patient";
  content: string;
  timestamp: string;
  type: "text" | "file";
}

const ChatUI = () => {
  const location = useLocation();
  const isBot = location.pathname.includes("/bot/");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      content: "Hello John! How are you feeling today? I've reviewed your latest vitals and they look good.",
      timestamp: "10:30 AM",
      type: "text",
    },
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: isBot ? "bot" : "patient",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const SidebarComponent = PatientSidebar;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full m-auto absolute top-0 bg-background">
        <SidebarComponent />
        <div className="flex flex-col w-full">
          {/* Header */}
          <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-6">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Chat</h1>
              <p className="text-sm text-muted-foreground">Secure messaging with your mental health chatbot</p>
            </div>
          </header>

          {/* Chat Interface */}
          <div className="flex-1 max-w-[100vw] h-screen flex">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b bg-card flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <RiRobot2Fill size={20} className="text-blue-600" />
                    <span className="text-sm">Health Bot</span>
                  </div>
                  <div>
                    <p className="text-sm text-success">online</p>
                  </div>
                </div>
                <Button variant="outline">New Conversation</Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-1 ${
                      (isBot && message.sender === "bot") || (!isBot && message.sender === "patient") ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender === "bot" ? (
                      <>
                        <RiRobot2Fill size={20} className="text-blue-600" />
                      </>
                    ) : (
                      <></>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        (isBot && message.sender === "bot") || (!isBot && message.sender === "patient")
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          (isBot && message.sender === "bot") || (!isBot && message.sender === "patient")
                            ? "text-primary-foreground/70"
                            : "text-accent-foreground/70"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-card">
                <div className="flex items-center space-x-2">
                  <Button variant="secondary" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 px-2">All messages are encrypted and HIPAA compliant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ChatUI;
