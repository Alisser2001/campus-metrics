'use client';
import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatbotIcon } from './chatbot/ChatbotIcon';
import { ChatbotHead } from './chatbot/ChatbotHead';
import { ScrollAreaCont } from './chatbot/ChatbotScrollArea';
import { ChatbotTextArea } from './chatbot/ChatbotTextArea';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date;
}

export const Chatbot: FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (threadId) {
      localStorage.setItem('threadId', threadId);
      router.replace(`?threadId=${threadId}`);
    }
  }, [threadId, router]);

  useEffect(() => {
    const saved = localStorage.getItem('threadId');
    if (saved) setThreadId(saved);
  }, []);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentThreadId = threadId || null;
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        body: JSON.stringify({ threadId: currentThreadId, message: input }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let currentMessage = '';
      const assistantId = crypto.randomUUID();

      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', createdAt: new Date() }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);

        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
        for (const line of lines) {
          const text = line.replace('data: ', '');
          currentMessage += text;
          setMessages(prev => {
            const newMessages = [...prev];
            const lastIndex = newMessages.findIndex(msg => msg.id === assistantId);
            if (lastIndex !== -1) {
              newMessages[lastIndex].content = currentMessage;
            }
            return newMessages;
          });
        }
      }

      if (!threadId) {
        const saved = localStorage.getItem('threadId');
        if (saved) setThreadId(saved);
      }

      setInput('');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      if (err instanceof Error) setError(err);
    }
  };

  return (
    <>
      {isOpen 
        ? <section className="flex flex-col justify-between items-center absolute z-10 bottom-[10px] m-3 md:right-[20px] md:bottom-[20px] w-[90%] md:w-[450px] h-[600px] rounded-lg overflow-hidden border border-solid border-[rgba(0,0,0,0.16)] pb-4 bg-white animate-expand-bottom-left">
            <ChatbotHead isOpen={isOpen} setIsOpen={setIsOpen} />
            <ScrollAreaCont messages={messages} />
            <ChatbotTextArea
              handleSubmit={handleSubmit}
              input={input}
              handleInputChange={(e) => setInput(e.target.value)}
              status="awaiting_message"
            />
          </section>
        : <ChatbotIcon isOpen={isOpen} setIsOpen={setIsOpen} />}
    </>
  );
};