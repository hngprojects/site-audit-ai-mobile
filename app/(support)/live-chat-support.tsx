import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, TouchableOpacity, ScrollView, View, Text, TextInput, KeyboardAvoidingView, Platform, Image, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../../stylesheets/live-chat-support-stylesheet';
import { emojis, initialMessages, Message } from '../../constants/live-chat';

const LiveChatSupportContent = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSend = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'You',
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true,
      };
      setMessages([...messages, message]);
      setNewMessage('');
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      // Navigate to confirmation screen
      setTimeout(() => {
        router.push('/(support)/message-sent-confirmation');
      }, 500);
    }
  };

  const handleAttachLink = () => {
    Alert.prompt(
      'Attach Link',
      'Enter the URL you want to share:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Attach',
          onPress: (url?: string) => {
            if (url && url.trim()) {
              const message: Message = {
                id: Date.now().toString(),
                sender: 'You',
                text: `🔗 ${url.trim()}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isUser: true,
              };
              setMessages([...messages, message]);
              // Scroll to bottom
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }
          },
        },
      ],
      'plain-text',
      '',
      'url'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1A2373" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Live Chat</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((message) => (
            <View key={message.id} style={styles.messageContainer}>
              {message.isUser ? (
                <View style={[styles.senderContainer, styles.userSenderContainer]}>
                  <Text style={styles.senderName}>{message.sender}</Text>
                  <Image source={require('../../assets/images/damian_amadi.jpg')} style={[styles.senderAvatar, styles.userSenderAvatar]} />
                </View>
              ) : (
                <View style={styles.senderContainer}>
                  <Image source={require('../../assets/images/avatar_thumbnail.png')} style={styles.senderAvatar} />
                  <Text style={styles.senderName}>{message.sender}</Text>
                </View>
              )}
              {message.isUser ? (
                <View style={styles.userMessage}>
                  <Text style={[styles.messageText, styles.userMessageText]}>
                    {message.text}
                  </Text>
                  <Text style={[styles.messageTimestamp, styles.userMessageTimestamp]}>{message.timestamp}</Text>
                </View>
              ) : (
                <View style={styles.supportMessage}>
                  <Text style={styles.messageText}>
                    {message.text}
                  </Text>
                  <Text style={[styles.messageTimestamp, styles.supportMessageTimestamp]}>{message.timestamp}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainerBox}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor="#676767"
              multiline
            />
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.iconButton} onPress={handleAttachLink}>
                <Feather name="link" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={() => setShowEmojiPicker(true)}>
                <Feather name="smile" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Feather name="send" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </KeyboardAvoidingView>
      <Modal visible={showEmojiPicker} animationType="slide" transparent>
        <View style={styles.emojiPickerContainer}>
          <View style={styles.emojiPickerHeader}>
            <Text style={styles.emojiPickerTitle}>Select Emoji</Text>
            <TouchableOpacity onPress={() => setShowEmojiPicker(false)} style={styles.closeButton}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.emojiScrollView}>
            <View style={styles.emojiGrid}>
              {emojis.map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setNewMessage(prev => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  style={styles.emojiButton}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default function LiveChatSupport() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return <LiveChatSupportContent />;
}
