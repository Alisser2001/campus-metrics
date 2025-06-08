import React from "react";
import { Button } from "@/components/ui/button";
import {
    User,
    Settings
} from "lucide-react";
import Image from "next/image";

const Header = () => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 w-full fixed top-0">
            <div className="text-xl font-semibold text-[#0A5C36] flex flex-row items-center gap-x-4">
                <Image src='/udea.png' width='30' height='40' alt="UdeA Logo" />
                Sistema de Gestión Documental
            </div>
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="hover:bg-gray-300 cursor-pointer">
                    <Settings className="h-5 w-5 text-gray-600" />
                </Button>
                <div className="h-8 w-8 bg-udea-secondary rounded-full flex items-center justify-center text-white bg-[#0A5C36] cursor-pointer">
                    <User className="h-5 w-5" />
                </div>
            </div>
        </header>
    );
};

export default Header;