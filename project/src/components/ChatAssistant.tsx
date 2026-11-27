import { useState, useRef, useEffect } from 'react';
import { X, Send, Trash2, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { sendMessageToAssistant } from '@/services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  retryPrompt?: string;
}

const SUGGESTED_QUESTIONS = [
  "How can I reduce food waste?",
  "Tips for saving electricity?",
  "How to travel more sustainably?",
  "How can I save water at home?",
];

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const requestInFlightRef = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      const dialog = dialogRef.current as (HTMLDivElement & { inert: boolean }) | null;
      if (dialog) dialog.inert = false;
      inputRef.current?.focus();
    } else {
      const dialog = dialogRef.current as (HTMLDivElement & { inert: boolean }) | null;
      if (dialog) dialog.inert = true;
    }
  }, [isOpen]);

  const closeChat = () => {
    setIsOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeChat();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const controls = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled)',
      ));
      if (controls.length === 0) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const requestAnswer = async (text: string, responseId?: string) => {
    if (requestInFlightRef.current) return;
    requestInFlightRef.current = true;
    setIsLoading(true);
    if (responseId) {
      setMessages((prev) => prev.map((message) => message.id === responseId
        ? { ...message, content: 'Trying again…', retryPrompt: undefined }
        : message));
    }
    try {
      const { data, error } = await sendMessageToAssistant(text);
      const answer: Message = {
        id: responseId ?? `aura-${Date.now()}`,
        role: 'assistant',
        content: data?.reply ?? (error === 'Backend service unavailable'
          ? 'AURA could not reach EcoTrack. Check your connection and try again.'
          : 'AURA could not answer that right now. Please try again.'),
        ...(error ? { retryPrompt: text } : {}),
      };
      setMessages((previous) => responseId
        ? previous.map((message) => message.id === responseId ? answer : message)
        : [...previous, answer]);
    } catch {
      const answer: Message = {
        id: responseId ?? `aura-${Date.now()}`,
        role: 'assistant',
        content: 'AURA could not reach EcoTrack. Check your connection and try again.',
        retryPrompt: text,
      };
      setMessages((previous) => responseId
        ? previous.map((message) => message.id === responseId ? answer : message)
        : [...previous, answer]);
    } finally {
      requestInFlightRef.current = false;
      setIsLoading(false);
    }
  };

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || requestInFlightRef.current) return;
    setMessages((previous) => [...previous, {
      id: `user-${Date.now()}`, role: 'user', content: trimmed,
    }]);
    setInput('');
    void requestAnswer(trimmed);
  };

  const handleRetry = (message: Message) => {
    if (message.retryPrompt) void requestAnswer(message.retryPrompt, message.id);
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
              <span className="chat-fab-role">Rule-Based Sustainability Assistant</span>
            </div>
            <strong>Have a sustainability question?</strong>
            <small>Tap to start a conversation</small>
          </div>
          <button
            ref={launcherRef}
            className="chat-fab"
            onClick={() => setIsOpen(true)}
            aria-label="Open Sustainability Assistant"
          >
            <img src="/aura-assistant.png" alt="AURA sustainability guide" />
            <span className="chat-fab-spark chat-fab-spark-one" />
            <span className="chat-fab-spark chat-fab-spark-two" />
          </button>
        </div>
      )}

      {/* Chat Window */}
      <div
        ref={dialogRef}
        className={`chat-window ${isOpen ? 'chat-window-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-labelledby="aura-chat-title"
        tabIndex={-1}
      >
        <div className="chat-header">
          <div className="chat-header-title">
            <Bot size={20} />
            <span id="aura-chat-title">AURA · Rule-Based Assistant</span>
          </div>
          <div className="chat-header-actions">
            <button onClick={clearChat} aria-label="Clear chat" title="Clear chat" className="chat-icon-btn" disabled={isLoading}>
              <Trash2 size={16} />
            </button>
            <button onClick={closeChat} aria-label="Close chat" className="chat-icon-btn">
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
              <p>Hi! I can share practical tips about food, home energy, transport, waste, water, and your EcoTrack estimate.</p>
              <small className="chat-privacy-note">AURA is rule based and answers each message independently. When signed in, it may use your latest saved estimate and selected interests. Messages are not saved to your account.</small>
              
              <div className="chat-suggestions">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    className="chat-suggestion-btn"
                    onClick={() => handleSend(q)}
                    disabled={isLoading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-messages" role="log" aria-live="polite" aria-relevant="additions text" aria-label="AURA conversation">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-message chat-message-${msg.role}`}>
                  <div className="chat-message-avatar">
                    {msg.role === 'assistant' ? <Bot size={16} /> : <UserIcon size={16} />}
                  </div>
                  <div className="chat-message-content">
                    {msg.content}
                    {msg.retryPrompt && (
                      <button type="button" className="chat-retry-btn" onClick={() => handleRetry(msg)} disabled={isLoading}>
                        Retry response
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="chat-message chat-message-assistant">
                  <div className="chat-message-avatar">
                    <Bot size={16} />
                  </div>
                  <div className="chat-message-content chat-loading" role="status" aria-live="polite">
                    <Loader2 size={16} className="spin" />
                    <span>Finding a helpful tip…</span>
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
              ref={inputRef}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="chat-input"
              aria-label="Message AURA"
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
