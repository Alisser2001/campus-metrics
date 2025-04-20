'use client';
import { FC, useState, useEffect } from "react";
import { useAssistant } from '@ai-sdk/react';
import { ChatbotIcon } from "./chatbot/ChatbotIcon";
import { useRouter } from "next/navigation";
import { ChatbotHead } from "./chatbot/ChatbotHead";
import { ScrollAreaCont } from "./chatbot/ChatbotScrollArea";
import { ChatbotTextArea } from "./chatbot/ChatbotTextArea";

export const Chatbot: FC = () => {
    const {
        status,
        error,
        messages,
        input,
        submitMessage,
        handleInputChange,
        threadId,
        setThreadId
    } = useAssistant({ api: '/api/assistant' });

    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (threadId) {
            localStorage.setItem("threadId", threadId);
            router.replace(`?threadId=${threadId}`);
        }
    }, [threadId, router]);

    useEffect(() => {
        const savedThreadId = localStorage.getItem("threadId");
        if (savedThreadId) {
            setThreadId(savedThreadId);
        }
    }, []);

    useEffect(() => {
        if (error) console.log(error.message);
    }, [error]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submitMessage(event, { data: { action: 'loadPreviousMessages' } });
        return;
    };

    return (
        <>
            {isOpen ?
                <section className="flex flex-col justify-between items-center absolute z-10 bottom-[10px] m-3 md:right-[20px] md:bottom-[20px] w-[90%] md:w-[450px] h-[600px] rounded-lg overflow-hidden border border-solid border-[rgba(0,0,0,0.16)] pb-4 bg-white animate-expand-bottom-left">
                    <ChatbotHead isOpen={isOpen} setIsOpen={setIsOpen} />
                    <ScrollAreaCont messages={messages} />
                    <ChatbotTextArea handleSubmit={(e) => handleSubmit(e)} status={status} input={input} handleInputChange={handleInputChange} />
                </section> :
                <ChatbotIcon isOpen={isOpen} setIsOpen={setIsOpen} />}
        </>
    )
}