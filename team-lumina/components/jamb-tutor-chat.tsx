"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UserProfile } from "@/types/user-profile";
import { Brain, Send, User, Bot, Loader2, BookCheck } from "lucide-react";

interface JambTutorChatProps {
  userProfile: UserProfile;
}

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export function JambTutorChat({ userProfile }: JambTutorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: `Hi ${userProfile.name}! I'm your AI JAMB tutor. Ask me to explain a past question like "chemistry 2017 question 35" and I'll do my best to explain it.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("div");
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/jamb-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile,
          question: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          data.response ||
          "I'm sorry, I couldn't process that request. Could you try rephrasing your question?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="border-0 shadow-xl h-[700px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/50 dark:to-teal-900/50">
        <CardTitle className="flex items-center gap-2">
          <BookCheck className="h-6 w-6 text-green-600" />
          AI JAMB Past Question Tutor
        </CardTitle>
        <CardDescription>
          Get instant, detailed explanations for JAMB past questions.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.type === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    message.type === "user"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                <div
                  className={`max-w-[85%] p-3 rounded-lg prose dark:prose-invert prose-sm ${
                    message.type === "user"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  }`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: message.content.replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg dark:bg-gray-800 dark:text-gray-100">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Tutor is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-white dark:bg-gray-900">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about a past question..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
