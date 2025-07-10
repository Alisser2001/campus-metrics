'use client';
import React, { FC } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from '@ai-sdk/react';
import { ChatBotIcon } from "../icons/ChatbotIcon";
import { ChatUserIcon } from "../icons/ChatuserIcon";
import { CardContent } from "@/components/ui/card";

interface ScrollAreaProps {
    messages: Message[]
}

export const ScrollAreaCont: FC<ScrollAreaProps> = ({ messages }) => {
    return (
        <ScrollArea className="h-[480px] w-[450px]">
            <CardContent className="p-4">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`flex gap-2 max-w-[90%] m-0 p-0 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                                {message.role !== 'user' && <div className="w-[40px]">
                                    <ChatBotIcon />
                                </div>}
                                <div
                                    className={`rounded-lg p-3 text-md font-semibold bg-[#33691e] text-white max-w-[80%]`}
                                >
                                    <p>{message.content}</p>
                                    {message.createdAt ?
                                        <p className="text-xs opacity-70 mt-1 text-right">
                                            {message.createdAt instanceof Date
                                                ? message.createdAt.toLocaleString()
                                                : message.createdAt}
                                        </p> : null}
                                </div>
                                {message.role === 'user' && <div className="w-[40px]">
                                    <ChatUserIcon />
                                </div>}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </ScrollArea>
    )
}