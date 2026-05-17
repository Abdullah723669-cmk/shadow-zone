'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am Shadow, your personal shopping assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: text }] }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Oops! Something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const quickQuestions = [
    'What is your return policy?',
    'Any discount offers today?',
    'What products do you have?'
  ];

  return (
    <div className={styles.container}>
      {/* Floating Toggle Button */}
      <button 
        className={styles.toggleBtn} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.avatarWrap}>
              <span className={styles.avatar}>🕶️</span>
              <span className={styles.statusDot}></span>
            </div>
            <div>
              <h3 className={styles.title}>Shadow</h3>
              <p className={styles.subtitle}>AI Shop Assistant • Online</p>
            </div>
          </div>

          {/* Messages Container */}
          <div className={styles.messagesBox}>
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`${styles.messageRow} ${m.role === 'user' ? styles.userRow : styles.assistantRow}`}
              >
                {m.role === 'assistant' && <span className={styles.msgAvatar}>🕶️</span>}
                <div className={styles.bubble}>
                  <p>{m.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className={`${styles.messageRow} ${styles.assistantRow}`}>
                <span className={styles.msgAvatar}>🕶️</span>
                <div className={`${styles.bubble} ${styles.loadingBubble}`}>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length === 1 && (
            <div className={styles.quickSuggestions}>
              {quickQuestions.map((q, idx) => (
                <button key={idx} className={styles.suggestBtn} onClick={() => handleSend(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className={styles.inputArea}>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Ask anything..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />
            <button className={styles.sendBtn} onClick={() => handleSend()} disabled={loading || !input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
