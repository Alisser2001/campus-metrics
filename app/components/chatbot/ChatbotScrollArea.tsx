'use client';
import React, { FC } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from '@ai-sdk/react';
import { ChatBotIcon } from "../icons/ChatbotIcon";
import { ChatUserIcon } from "../icons/ChatuserIcon";
import { CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

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
                            <div className={`flex gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                                {message.role !== 'user' && <ChatBotIcon />}
                                <div
                                    className={`rounded-lg p-3 text-md font-semibold ${message.role === "user" ? "bg-green-700 text-white" : "bg-gray-100 dark:bg-gray-800"
                                        }`}
                                >
                                    <p>{message.content}</p>
                                    {message.createdAt ?
                                        <p className="text-xs opacity-70 mt-1 text-right">
                                            {message.createdAt instanceof Date
                                                ? message.createdAt.toLocaleString()
                                                : message.createdAt}
                                        </p> : null}
                                </div>
                                {message.role === 'user' && <ChatUserIcon />}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </ScrollArea>
    )
}