'use client';
import { FC } from "react";

interface Props {
    isOpen: boolean,
    setIsOpen: (option: boolean) => void
}

export const CloseIcon: FC<Props> = ({ setIsOpen, isOpen }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
        >
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </svg>
    )
}