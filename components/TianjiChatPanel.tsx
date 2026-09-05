'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  presetQuestionsFor,
  type TianjiContext,
} from '@/lib/nihai/chat';

/**
 * 天纪 AI 解读面板
 *
 * 与命盘页 ChatPanel 同款视觉（--t-* CSS 变量，主题感知），
 * 但走独立的 /api/tianji-chat 路由 + 倪师《天纪》体系 system prompt。
 *
 * props:
 *   context  —— 卦象 / 模块 / 通用，决定 system prompt 与预设问题
 *   title    —— 面板标题（默认「AI 天纪解读」）
 *   subtitle —— 面板副标题
 */

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  context: TianjiContext;
  title?: string;
  subtitle?: string;
  height?: number;
}

export default function TianjiChatPanel({
  context,
  title = 'AI 天纪解读',
  subtitle = '倪海厦《天纪》体系 · 象数派口径',
  height = 520,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const presets = useMemo(() => presetQuestionsFor(context), [context]);

  // context 变化（切换卦象 / 模块）时清空对话，避免串味
  useEffect(() => {
    setMessages([]);
    setInput('');
  }, [context]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/tianji-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, messages: [...messages, userMsg] }),
      });

      if (!res.ok) throw new Error('请求失败');
      if (!res.body) throw new Error('无响应流');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.delta?.text ?? '';
            if (delta) {
              assistantText += delta;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantText };
                return updated;
              });
            }
          } catch { /* skip 非 JSON 行 */ }
        }
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '解读失败，请检查 API 配置或稍后重试。',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden card-glass"
      style={{ height }}
    >
      {/* 标题 */}
      <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--t-border)' }}>
        <h3 className="text-xs font-medium tracking-widest" style={{ color: 'var(--t-gold)' }}>
          {title}
        </h3>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--t-faint)' }}>{subtitle}</p>
      </div>

      {/* 消息列表 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <div className="text-4xl mb-3" style={{ color: 'var(--t-gold)', opacity: 0.15 }}>✦</div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--t-faint)' }}>
              可直接提问，或从下方选择常见问题
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed"
                style={msg.role === 'user' ? {
                  background: 'rgba(212,168,67,0.1)',
                  border: '1px solid rgba(212,168,67,0.2)',
                  color: 'var(--t-gold)',
                } : {
                  background: 'var(--t-card)',
                  border: '1px solid var(--t-border)',
                  color: 'var(--t-text)',
                }}
              >
                {msg.role === 'assistant' && (
                  <div className="text-[10px] mb-1" style={{ color: 'var(--t-faint)' }}>术数讲师 ·</div>
                )}
                <div className="whitespace-pre-wrap text-xs leading-relaxed">
                  {msg.content}
                  {loading && i === messages.length - 1 && msg.role === 'assistant' && (
                    <span
                      className="inline-block w-1.5 h-3 ml-0.5 animate-pulse"
                      style={{ background: 'var(--t-gold)', opacity: 0.6 }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 预设问题 */}
      {messages.length === 0 && (
        <div className="px-3 pb-2 flex-shrink-0">
          <div className="grid grid-cols-2 gap-1.5">
            {presets.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="text-left text-[10px] rounded-lg px-2.5 py-2 transition-all line-clamp-2"
                style={{
                  color: 'var(--t-text2)',
                  border: '1px solid var(--t-border)',
                  background: 'transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(212,168,67,0.3)';
                  e.currentTarget.style.color = 'var(--t-gold)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--t-border)';
                  e.currentTarget.style.color = 'var(--t-text2)';
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 输入框 */}
      <div className="px-3 pb-3 pt-2 flex-shrink-0" style={{ borderTop: '1px solid var(--t-border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder={
              context.type === 'hexagram'
                ? `问这一卦，如：用第 ${context.data.number} 卦问事业？`
                : '输入问题，如：这一模块主要讲什么？'
            }
            disabled={loading}
            aria-label="提问输入框"
            className="flex-1 rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors"
            style={{
              background: 'var(--t-card)',
              border: '1px solid var(--t-border)',
              color: 'var(--t-text)',
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(212,168,67,0.15)',
              border: '1px solid rgba(212,168,67,0.25)',
              color: 'var(--t-gold)',
            }}
          >
            {loading ? '解读中' : '解读'}
          </button>
        </div>
      </div>
    </div>
  );
}
