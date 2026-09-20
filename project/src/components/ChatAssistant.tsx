import { useState, useRef, useEffect } from 'react';
import { X, Send, Trash2, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { sendMessageToAssistant } from '@/services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "How can I reduce food waste?",
  "Tips for saving electricity?",
  "How to travel more sustainably?",
];

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const { data, error } = await sendMessageToAssistant(text);
    
    setIsLoading(false);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: data ? data.reply : (error || "Sorry, I couldn't process that request."),
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="chat-fab-wrap">
          <div className="chat-fab-prompt">
            <div className="chat-fab-badges">
              <span className="chat-fab-status"><span /> AURA is here</span>
              <span className="chat-fab-role">AI Sustainability Assistant</span>
            </div>
            <strong>Have a sustainability question?</strong>
            <small>Tap to start a conversation</small>
          </div>
          <button
            className="chat-fab"
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant"
          >
            <img src="/aura-assistant.png" alt="AURA Sustainable AI Assistant" />
            <span className="chat-fab-spark chat-fab-spark-one" />
            <span className="chat-fab-spark chat-fab-spark-two" />
          </button>
        </div>
      )}

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'chat-window-open' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-title">
            <Bot size={20} />
            <span>AI Sustainability Assistant</span>
          </div>
          <div className="chat-header-actions">
            <button onClick={clearChat} aria-label="Clear chat" title="Clear chat" className="chat-icon-btn">
              <Trash2 size={16} />
            </button>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="chat-icon-btn">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="chat-body">
          {messages.length === 0 ? (
            <div className="chat-empty-state">
              <div className="chat-empty-icon">
                <Bot size={32} />
              </div>
              <p>Hi! I'm your AI Sustainability Assistant. Ask me anything about reducing your carbon footprint.</p>
              
              <div className="chat-suggestions">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    className="chat-suggestion-btn"
                    onClick={() => handleSend(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-message chat-message-${msg.role}`}>
                  <div className="chat-message-avatar">
                    {msg.role === 'assistant' ? <Bot size={16} /> : <UserIcon size={16} />}
                  </div>
                  <div className="chat-message-content">
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="chat-message chat-message-assistant">
                  <div className="chat-message-avatar">
                    <Bot size={16} />
                  </div>
                  <div className="chat-message-content chat-loading">
                    <Loader2 size={16} className="spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="chat-footer">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="chat-input-form"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
