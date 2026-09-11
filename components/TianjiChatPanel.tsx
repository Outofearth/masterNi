'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  presetQuestionsFor,
  type TianjiContext,
} from '@/lib/nihai/chat';
import {
  contextToKey,
  loadHistory,
  saveHistory,
  clearHistory,
  loadPrefs,
  savePrefs,
  type StoredMessage,
  type UserPrefs,
} from '@/lib/nihai/chat-memory';

/**
 * 天纪 AI 解读面板 —— v2
 *
 * 升级：
 *  - localStorage 多轮对话记忆（自动恢复 / 自动保存）
 *  - 解读风格切换（classic 古朴 / clinical 临床 / poetic 诗意）
 *  - 多视角分析开关（一次给 2-3 种解读）
 *  - 对话历史摘要送入 system prompt（避免重复）
 *  - 清空历史 / 复制对话 快捷操作
 */

interface Message {
  role: 'user' | 'assistant';
  content: string;
  ts: number;
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
  const [prefs, setPrefs] = useState<UserPrefs>({
    style: 'classic',
    multiPerspective: false,
    focusAreas: [],
  });
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const key = useMemo(() => contextToKey(context as { type: string; data?: unknown }), [context]);
  const presets = useMemo(() => presetQuestionsFor(context), [context]);

  // 初次加载：读偏好 + 历史
  useEffect(() => {
    setPrefs(loadPrefs());
    setMessages(loadHistory(key));
  }, [key]);

  // 滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 保存偏好
  const updatePrefs = (patch: Partial<UserPrefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    savePrefs(next);
  };

  // 清空当前对话
  const handleClear = () => {
    if (!confirm('清空当前对话？')) return;
    setMessages([]);
    clearHistory(key);
  };

  // 复制最后一条 AI 回答
  const handleCopy = () => {
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAssistant) return;
    navigator.clipboard?.writeText(lastAssistant.content).catch(() => {});
  };

  const sendMessage = async (text: string, forceMulti = false) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text, ts: Date.now() };
    const useMulti = forceMulti || prefs.multiPerspective;
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/tianji-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          messages: updated.map(m => ({ role: m.role, content: m.content })),
          style: prefs.style,
          multiPerspective: useMulti,
        }),
      });

      if (!res.ok) throw new Error('请求失败');
      if (!res.body) throw new Error('无响应流');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '', ts: Date.now() }]);

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
                const next = [...prev];
                next[next.length - 1] = { role: 'assistant', content: assistantText, ts: Date.now() };
                return next;
              });
            }
          } catch { /* skip 非 JSON 行 */ }
        }
      }
      // 持久化
      setMessages(prev => {
        saveHistory(key, prev as unknown as StoredMessage[]);
        return prev;
      });
    } catch {
      setMessages(prev => {
        const next = [...prev, {
          role: 'assistant' as const,
          content: '解读失败，请检查 API 配置或稍后重试。',
          ts: Date.now(),
        }];
        saveHistory(key, next as unknown as StoredMessage[]);
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden card-glass"
      style={{ height }}
    >
      {/* 标题栏 */}
      <div
        className="px-4 py-3 flex-shrink-0 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--t-border)' }}
      >
        <div>
          <h3 className="text-xs font-medium tracking-widest" style={{ color: 'var(--t-gold)' }}>
            {title}
          </h3>
          <p className="text-[12px] mt-0.5" style={{ color: 'var(--t-faint)' }}>
            {subtitle} · {prefs.style === 'clinical' ? '临床' : prefs.style === 'poetic' ? '诗意' : '古朴'}
            {prefs.multiPerspective && ' · 多视角'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowSettings(s => !s)}
            className="text-[12px] px-2 py-1 rounded transition-colors"
            style={{
              color: showSettings ? 'var(--t-gold)' : 'var(--t-faint)',
              border: `1px solid ${showSettings ? 'rgba(212,168,67,0.3)' : 'var(--t-border)'}`,
            }}
            aria-label="设置"
            title="设置"
          >
            ⚙
          </button>
          {messages.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[12px] px-2 py-1 rounded transition-colors"
                style={{ color: 'var(--t-faint)', border: '1px solid var(--t-border)' }}
                aria-label="复制最后一条回答"
                title="复制回答"
              >
                复制
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-[12px] px-2 py-1 rounded transition-colors"
                style={{ color: 'var(--t-faint)', border: '1px solid var(--t-border)' }}
                aria-label="清空对话"
                title="清空对话"
              >
                清空
              </button>
            </>
          )}
        </div>
      </div>

      {/* 设置面板 */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-shrink-0 overflow-hidden"
            style={{ borderBottom: '1px solid var(--t-border)' }}
          >
            <div className="px-4 py-3 space-y-3" style={{ background: 'var(--t-bg-soft)' }}>
              {/* 风格选择 */}
              <div>
                <div className="text-[12px] tracking-widest mb-1.5" style={{ color: 'var(--t-faint)' }}>
                  解读风格
                </div>
                <div className="flex gap-1.5">
                  {(['classic', 'clinical', 'poetic'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updatePrefs({ style: s })}
                      className="text-[12px] px-3 py-1 rounded-full transition-colors"
                      style={{
                        background: prefs.style === s ? 'rgba(212,168,67,0.15)' : 'transparent',
                        color: prefs.style === s ? 'var(--t-gold)' : 'var(--t-faint)',
                        border: `1px solid ${prefs.style === s ? 'rgba(212,168,67,0.3)' : 'var(--t-border)'}`,
                      }}
                    >
                      {s === 'classic' ? '古朴' : s === 'clinical' ? '临床' : '诗意'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 多视角开关 */}
              <div className="flex items-center justify-between">
                <div className="text-[12px] tracking-widest" style={{ color: 'var(--t-faint)' }}>
                  多视角分析（一次给 2-3 种解读）
                </div>
                <button
                  type="button"
                  onClick={() => updatePrefs({ multiPerspective: !prefs.multiPerspective })}
                  className="relative w-9 h-5 rounded-full transition-colors"
                  style={{
                    background: prefs.multiPerspective ? 'rgba(212,168,67,0.5)' : 'var(--t-border)',
                  }}
                  aria-pressed={prefs.multiPerspective}
                  aria-label="多视角开关"
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
                    style={{
                      background: prefs.multiPerspective ? 'var(--t-gold)' : 'var(--t-faint)',
                      left: prefs.multiPerspective ? '18px' : '2px',
                    }}
                  />
                </button>
              </div>

              {/* 当前 context key */}
              <div className="text-[12px] tracking-widest flex items-center gap-2" style={{ color: 'var(--t-faint)' }}>
                <span>对话存档：{key}</span>
                <span>·</span>
                <span>{messages.length} 条</span>
                <span>·</span>
                <span>本地存储</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 消息列表 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <div className="text-4xl mb-3" style={{ color: 'var(--t-gold)', opacity: 0.15 }}>✦</div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--t-faint)' }}>
              可直接提问，或从下方选择常见问题
            </p>
            <p className="text-[12px] mt-2" style={{ color: 'var(--t-faint)', opacity: 0.6 }}>
              对话将保留在本机浏览器（{messages.length}/30 条）
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
                  <div className="text-[12px] mb-1 flex items-center gap-2" style={{ color: 'var(--t-faint)' }}>
                    <span>术数讲师 ·</span>
                    {msg.content.includes('视角') && (msg.content.match(/视角/g) ?? []).length >= 3 && (
                      <span style={{ color: 'var(--t-gold)' }}>多视角模式</span>
                    )}
                  </div>
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
                className="text-left text-[12px] rounded-lg px-2.5 py-2 transition-all line-clamp-2"
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
            aria-label="发送问题"
          >
            {loading ? '解读中' : '解读'}
          </button>
        </div>
      </div>
    </div>
  );
}