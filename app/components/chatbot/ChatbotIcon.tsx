'use client';
import { BotIcon } from "../icons/BotIcon";
import { FC } from "react";

interface Props {
    isOpen: boolean,
    setIsOpen: (option: boolean) => void
}

export const ChatbotIcon: FC<Props> = ({ isOpen, setIsOpen }) => {
    return (
        <span className="fixed right-[20px] bottom-[20px] flex justify-center items-center rounded-full bg-[#035f2e] w-12 h-12 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <BotIcon />
        </span>
    )
}