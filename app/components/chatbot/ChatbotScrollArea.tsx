'use client';
import React, { FC } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from '@ai-sdk/react';
import { ChatBotIcon } from "../icons/ChatbotIcon";
import { ChatUserIcon } from "../icons/ChatuserIcon";

interface ScrollAreaProps {
    messages: Message[]
}

export const ScrollAreaCont: FC<ScrollAreaProps> = ({ messages }) => {
    return (
        <ScrollArea className="h-[480px] w-[450px]">
            <div className="p-4 w-[450px]">
                {messages.map((m: Message) => (
                    <div key={m.id} className={`w-full flex flex-row ${m.role === 'user' ? 'justify-end' : 'justify-start'} my-4 items-start`}>
                        {m.role !== 'user' && <ChatBotIcon />}
                        {m.role !== 'data' && (
                            <span className="bg-[#035f2e] text-white px-4 py-2 rounded-lg max-w-[50%] inline-block break-words whitespace-pre-wrap">
                                {m.content}
                            </span>
                        )}
                        {m.role === 'user' && <ChatUserIcon />}
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}