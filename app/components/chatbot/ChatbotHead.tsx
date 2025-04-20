'use client';
import { FC } from "react";
import { CloseIcon } from "../icons/CloseIcon";

interface Props {
    isOpen: boolean,
    setIsOpen: (option: boolean) => void
}

export const ChatbotHead: FC<Props> = ({ isOpen, setIsOpen }) => {
    return (
        <div className="w-full flex flex-row justify-between items-center h-[60px] bg-[#035f2e] text-xl px-5 font-bold text-white">
            <h1>Chat Assistant</h1>
            <section className="flex flex-row justify-between items-center">
                <CloseIcon setIsOpen={setIsOpen} isOpen={isOpen} />
            </section>
        </div>
    )
}