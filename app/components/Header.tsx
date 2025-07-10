import React, { useEffect, useRef, useState } from "react";
import {
    LogOut,
    User
} from "lucide-react";
import Image from "next/image";
import { logout } from "@/utils/auth/helper";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 w-full fixed top-0 z-50">
            <div className="text-xl font-semibold text-[#33691e] flex flex-row items-center gap-x-4">
                <Image src='/udea.png' width='30' height='40' alt="UdeA Logo" />
                Sistema de Gestión Documental
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={handleMenuClick}
                        className="h-8 w-8 bg-[#33691e] rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-[#2e5d1a] transition-colors duration-200"
                    >
                        <User className="h-5 w-5" />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            <div className="py-1">
                                <button
                                    onClick={() => {}}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                                >
                                    <User className="h-4 w-4" />
                                    Perfil
                                </button>
                                <button
                                    onClick={logout}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Salir
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;