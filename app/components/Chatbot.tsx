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
  const router = useRouter();

  useEffect(() => {
    const savedThreadId = localStorage.getItem('threadId');
    if (savedThreadId) {
      setThreadId(savedThreadId);
    }
  }, []);

  useEffect(() => {
    if (threadId) {
      localStorage.setItem('threadId', threadId);
      router.replace(`?threadId=${threadId}`);
    }
  }, [threadId, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentThreadId = threadId || crypto.randomUUID();
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch('https://emmanuelbustamante.app.n8n.cloud/webhook/9de68c11-fb69-4bfa-b2e5-8ae99fb55042', {
        method: 'POST',
        body: JSON.stringify({ message: input, sessionId: currentThreadId }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Error en la respuesta del servidor');

      const data = await res.json();
      const output = data[0]?.output || 'Sin respuesta del asistente';
      const assistantId = crypto.randomUUID();

      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: output,
        createdAt: new Date()
      }]);

      if (!threadId) {
        setThreadId(currentThreadId);
        localStorage.setItem('threadId', currentThreadId);
      }

      setInput('');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
    }
  };

  return (
    <>
      {isOpen ? (
        <section className="flex flex-col justify-between items-center absolute z-10 bottom-[10px] m-3 md:right-[20px] md:bottom-[20px] w-[90%] md:w-[450px] h-[600px] rounded-lg overflow-hidden border border-solid border-[rgba(0,0,0,0.16)] pb-4 bg-white animate-expand-bottom-left">
          <ChatbotHead isOpen={isOpen} setIsOpen={setIsOpen} />
          <ScrollAreaCont messages={messages} />
          <ChatbotTextArea
            handleSubmit={handleSubmit}
            input={input}
            handleInputChange={(e) => setInput(e.target.value)}
            status="awaiting_message"
          />
        </section>
      ) : (
        <ChatbotIcon isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </>
  );
};
