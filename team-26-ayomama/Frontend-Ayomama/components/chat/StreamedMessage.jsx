import { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

export default function StreamedMessage({
  content,
  isUser,
  onStreamingChange,
  shouldStream = false, // Only stream if explicitly requested
}) {
  const [displayedText, setDisplayedText] = useState(
    shouldStream ? "" : content
  );
  const [isComplete, setIsComplete] = useState(!shouldStream);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // If not streaming, show content immediately
    if (!shouldStream) {
      setDisplayedText(content);
      setIsComplete(true);
      return;
    }

    // Notify parent that streaming has started
    if (!isUser && onStreamingChange) {
      onStreamingChange(true);
    }

    // Stream text character by character (faster streaming)
    let currentIndex = 0;
    const streamInterval = setInterval(() => {
      if (currentIndex < content.length) {
        // Stream 3 characters at a time for faster display
        const nextIndex = Math.min(currentIndex + 3, content.length);
        setDisplayedText(content.substring(0, nextIndex));
        currentIndex = nextIndex;
      } else {
        setIsComplete(true);
        clearInterval(streamInterval);
        // Notify parent that streaming has ended
        if (!isUser && onStreamingChange) {
          onStreamingChange(false);
        }
      }
    }, 12); // Faster interval for smoother streaming

    return () => {
      clearInterval(streamInterval);
      // Ensure we notify parent when component unmounts
      if (!isUser && onStreamingChange) {
        onStreamingChange(false);
      }
    };
  }, [content, shouldStream]);

  // Parse markdown-style formatting for Groq AI responses
  const renderFormattedText = (text, isHeading = false, isListItem = false) => {
    const parts = [];
    let currentText = text;
    let key = 0;

    // Handle code blocks `code`
    const codeRegex = /`([^`]+)`/g;
    // Handle bold text **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    // Handle italic text *text* or _text_
    const italicRegex = /\*([^*]+)\*|_([^_]+)_/g;

    // Combine all regex patterns
    const combinedRegex = /(`[^`]+`)|(\*\*.*?\*\*)|(\*[^*]+\*)|(_[^_]+_)/g;
    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(currentText)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        const beforeText = currentText.substring(lastIndex, match.index);
        parts.push(
          <Text
            key={`normal-${key++}`}
            className={`leading-6 ${
              isHeading
                ? "text-[17px] font-bold"
                : isListItem
                ? "text-[15px]"
                : "text-[15.5px]"
            } ${isUser ? "text-white" : "text-[#293231]"}`}
          >
            {beforeText}
          </Text>
        );
      }

      const matchedText = match[0];

      // Code block
      if (matchedText.startsWith("`") && matchedText.endsWith("`")) {
        const codeContent = matchedText.slice(1, -1);
        parts.push(
          <Text
            key={`code-${key++}`}
            className={`text-[14px] leading-6 font-mono ${
              isUser ? "bg-white/20 text-white" : "bg-[#F0F9FF] text-[#006D5B]"
            }`}
            style={{
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
            }}
          >
            {codeContent}
          </Text>
        );
      }
      // Bold text
      else if (matchedText.startsWith("**") && matchedText.endsWith("**")) {
        const boldContent = matchedText.slice(2, -2);
        parts.push(
          <Text
            key={`bold-${key++}`}
            className={`text-[15.5px] leading-6 font-bold ${
              isUser ? "text-white" : "text-[#006D5B]"
            }`}
          >
            {boldContent}
          </Text>
        );
      }
      // Italic text
      else if (
        (matchedText.startsWith("*") && matchedText.endsWith("*")) ||
        (matchedText.startsWith("_") && matchedText.endsWith("_"))
      ) {
        const italicContent = matchedText.slice(1, -1);
        parts.push(
          <Text
            key={`italic-${key++}`}
            className={`text-[15.5px] leading-6 italic ${
              isUser ? "text-white" : "text-[#293231]"
            }`}
          >
            {italicContent}
          </Text>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < currentText.length) {
      parts.push(
        <Text
          key={`normal-${key++}`}
          className={`leading-6 ${
            isHeading
              ? "text-[17px] font-bold"
              : isListItem
              ? "text-[15px]"
              : "text-[15.5px]"
          } ${isUser ? "text-white" : "text-[#293231]"}`}
        >
          {currentText.substring(lastIndex)}
        </Text>
      );
    }

    return parts.length > 0
      ? parts
      : [
          <Text
            key="default"
            className={`leading-6 ${
              isHeading
                ? "text-[17px] font-bold"
                : isListItem
                ? "text-[15px]"
                : "text-[15.5px]"
            } ${isUser ? "text-white" : "text-[#293231]"}`}
          >
            {currentText}
          </Text>,
        ];
  };

  // Enhanced content rendering for Groq AI responses
  const renderContent = () => {
    const lines = displayedText.split("\n");
    const elements = [];
    let currentParagraph = [];
    let currentList = [];
    let inCodeBlock = false;
    let codeBlockContent = [];
    let key = 0;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join("\n");
        elements.push(
          <View key={`para-${key++}`} className="mb-3">
            <Text style={{ lineHeight: 24 }}>
              {renderFormattedText(paragraphText)}
            </Text>
          </View>
        );
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <View key={`list-${key++}`} className="mb-3">
            {currentList.map((item, idx) => (
              <View key={idx} className="flex-row mb-2 pl-2">
                <Text
                  className={`mr-2 ${isUser ? "text-white" : "text-[#006D5B]"}`}
                  style={{ fontSize: 15 }}
                >
                  {item.bullet}
                </Text>
                <View className="flex-1">
                  <Text style={{ lineHeight: 22 }}>
                    {renderFormattedText(item.content, false, true)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        );
        currentList = [];
      }
    };

    const flushCodeBlock = () => {
      if (codeBlockContent.length > 0) {
        elements.push(
          <View
            key={`code-${key++}`}
            className={`mb-3 p-3 rounded-lg ${
              isUser ? "bg-white/10" : "bg-[#F5F5F5]"
            }`}
          >
            <Text
              className={`text-[13px] font-mono ${
                isUser ? "text-white" : "text-[#293231]"
              }`}
              style={{ lineHeight: 20 }}
            >
              {codeBlockContent.join("\n")}
            </Text>
          </View>
        );
        codeBlockContent = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle code blocks ```
      if (trimmedLine.startsWith("```")) {
        if (inCodeBlock) {
          flushCodeBlock();
          inCodeBlock = false;
        } else {
          flushParagraph();
          flushList();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Handle headings (### or ##)
      if (trimmedLine.match(/^#{1,3}\s+/)) {
        flushParagraph();
        flushList();
        const headingText = trimmedLine.replace(/^#{1,3}\s+/, "");
        const headingLevel = trimmedLine.match(/^#{1,3}/)[0].length;
        elements.push(
          <View
            key={`heading-${key++}`}
            className={`${index > 0 ? "mt-4" : ""} mb-2`}
          >
            <Text
              className={`font-bold ${
                headingLevel === 1
                  ? "text-[19px]"
                  : headingLevel === 2
                  ? "text-[17px]"
                  : "text-[16px]"
              } ${isUser ? "text-white" : "text-[#006D5B]"}`}
              style={{ lineHeight: 26 }}
            >
              {renderFormattedText(headingText, true)}
            </Text>
          </View>
        );
        return;
      }

      // Handle numbered lists (1. 2. etc)
      const numberedMatch = trimmedLine.match(/^(\d+\.)\s+(.+)/);
      if (numberedMatch) {
        flushParagraph();
        currentList.push({
          bullet: numberedMatch[1],
          content: numberedMatch[2],
        });
        return;
      }

      // Handle bullet lists (- * •)
      const bulletMatch = trimmedLine.match(/^([-*•])\s+(.+)/);
      if (bulletMatch) {
        flushParagraph();
        currentList.push({
          bullet: "•",
          content: bulletMatch[2],
        });
        return;
      }

      // Handle empty lines
      if (!trimmedLine) {
        flushParagraph();
        flushList();
        return;
      }

      // Regular text - accumulate into paragraph
      if (currentList.length > 0) {
        flushList();
      }
      currentParagraph.push(line);
    });

    // Flush any remaining content
    flushCodeBlock();
    flushParagraph();
    flushList();

    return elements;
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {renderContent()}
    </Animated.View>
  );
}
