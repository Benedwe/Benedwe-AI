import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { sendChat, resetMemory } from '../api/chat';

function MessageItem({ item }) {
  const align = item.sender === 'user' ? { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' } : { alignSelf: 'flex-start', backgroundColor: '#EEE' };
  return (
    <View style={{ margin: 6, padding: 10, borderRadius: 8, maxWidth: '80%', ...align }}>
      <Text>{item.content}</Text>
    </View>
  );
}

export default function ChatScreen({ auth, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Optionally load recent conversation from backend (not implemented here)
  }, []);

  const onSend = async () => {
    if (!text.trim()) return;
    const content = text.trim();
    setText('');
    const userMsg = { sender: 'user', content };
    setMessages((m) => [...m, userMsg]);

    try {
      setSending(true);
      const idToken = await auth.currentUser.getIdToken();
      const res = await sendChat(idToken, user.uid, content);
      const assistantMsg = { sender: 'assistant', content: res.message };
      setMessages((m) => [...m, assistantMsg]);
    } catch (e) {
      console.error(e);
      setMessages((m) => [...m, { sender: 'assistant', content: "Sorry — there was an error sending your message." }]);
    } finally {
      setSending(false);
    }
  };

  const onReset = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      await resetMemory(idToken, user.uid);
      setMessages([]);
      alert('Memory reset');
    } catch (e) {
      console.error(e);
      alert('Reset failed');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1, padding: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18 }}>Chat with Benedwe AI</Text>
          <Button title="Reset" onPress={onReset} />
        </View>

        <FlatList
          data={messages}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => <MessageItem item={item} />}
          contentContainerStyle={{ paddingVertical: 12 }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Say something kind..."
            style={{ flex: 1, borderWidth: 1, padding: 8, borderRadius: 6 }}
          />
          <Button title={sending ? '...' : 'Send'} onPress={onSend} disabled={sending} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
