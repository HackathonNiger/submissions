import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Send, Bot } from 'lucide-react-native';
import Header from '../components/molecules/Header';
import theme from '../utils/theme';

const AIChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Welcome to your financial assistant! Based on your recent transactions, your spending on dining increased by 20% this month. Would you like tips to manage your budget?',
      sender: 'ai',
      timestamp: '12:45 PM, Oct 5, 2025',
    },
    {
      id: '2',
      text: 'Yes, please share some budgeting tips!',
      sender: 'user',
      timestamp: '12:46 PM, Oct 5, 2025',
    },
    {
      id: '3',
      text: 'Here are some tips: 1) Set a monthly dining budget of ₦50,000. 2) Use GestPay’s geo-verification to limit impulse purchases. 3) Track expenses weekly. Want a detailed savings plan?',
      sender: 'ai',
      timestamp: '12:47 PM, Oct 5, 2025',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: inputText,
        sender: 'user',
        timestamp: new Date().toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      // Simulate AI response (replace with actual API call)
      setTimeout(() => {
        const aiResponse = {
          id: (messages.length + 2).toString(),
          text: 'Got it! Analyzing your query... For now, consider setting aside 20% of your income for savings. Want me to analyze your recent transactions for more insights?',
          sender: 'ai',
          timestamp: new Date().toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
      <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
        {item.sender === 'ai' && (
          <Bot color={theme.colors.text.muted} size={20} style={styles.messageIcon} />
        )}
        <Text style={[styles.messageText, item.sender === 'user' ? styles.userMessageText : styles.aiMessageText]}>
          {item.text}
        </Text>
        <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header variant="logo-actions" />
      <View style={styles.chatContainer}>
        <View style={styles.finTechPattern} />
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatContent}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.inputContainer}>
          <View style={styles.finTechPatternSmall} />
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about your finances..."
            placeholderTextColor={theme.colors.text.muted}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Send color={theme.colors.surface} size={24} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    position: 'relative',
  },
  finTechPattern: {
    ...StyleSheet.absoluteFill,
    opacity: 0.05,
    backgroundColor: theme.colors.gray,
    backgroundImage: `linear-gradient(45deg, ${theme.colors.text.muted} 25%, transparent 25%, transparent 50%, ${theme.colors.text.muted} 50%, ${theme.colors.text.muted} 75%, transparent 75%, transparent)`,
    backgroundSize: 20,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    shadowColor: theme.colors.gray,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
  },
  aiBubble: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  messageIcon: {
    marginBottom: 8,
  },
  messageText: {
    ...theme.typography.body,
    fontSize: 16,
  },
  userMessageText: {
    color: theme.colors.surface,
  },
  aiMessageText: {
    color: theme.colors.text.primary,
  },
  messageTimestamp: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.text.muted,
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray,
    shadowColor: theme.colors.gray,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  finTechPatternSmall: {
    ...StyleSheet.absoluteFill,
    opacity: 0.05,
    backgroundColor: theme.colors.gray,
    backgroundImage: `linear-gradient(45deg, ${theme.colors.text.muted} 25%, transparent 25%, transparent 50%, ${theme.colors.text.muted} 50%, ${theme.colors.text.muted} 75%, transparent 75%, transparent)`,
    backgroundSize: 10,
  },
  input: {
    flex: 1,
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 24,
    padding: 12,
  },
});

export default AIChatScreen;