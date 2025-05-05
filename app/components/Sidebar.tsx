'use client';
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
    const [activeCategorie, setActiveCategorie] = useState('Todos los Documentos');

    const categories = [
        { name: "Todos los Documentos", count: 22 },
        { name: "Presupuesto Anual", count: 3 },
        { name: "Ejecución Presupuestal", count: 5 },
        { name: "Auditoría y Control", count: 2 },
        { name: "Informes Financieros", count: 4 },
        { name: "Contratación", count: 2 },
        { name: "Resoluciones", count: 6 },
    ];

    return (
        <>
            <div className={cn("w-96 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-16")}>
                <div className="flex-1 overflow-auto p-4">
                    <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-3">
                        Categorías
                    </h3>
                    <nav>
                        <ul>
                            {categories.map((category) => (
                                <li key={category.name} className="mb-1">
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-between text-gray-700 hover:text-[#0A5C36] hover:bg-[#E8F5E9] cursor-pointer ${activeCategorie === category.name && 'text-[#0A5C36] bg-[#E8F5E9]'}`}
                                        onClick={() => setActiveCategorie(category.name)}
                                    >
                                        <span>{category.name}</span>
                                        <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
                                            {category.count}
                                        </span>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
            {/*<SidebarProvider className={cn("w-96 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-16")}>
                <UISidebar>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel className="h-14 text-black">
                                <SidebarInset>
                                    <SidebarTrigger className="-ml-1" />
                                </SidebarInset>
                            </SidebarGroupLabel>
                            <SidebarGroupContent className="mt-4">
                                <SidebarMenu className="gap-y-4 px-2">
                                    {categories.map((category) => (
                                        <SidebarMenuItem key={category.name}>
                                            <SidebarMenuButton asChild>
                                                <Button
                                                    variant="ghost"
                                                    className={`w-full justify-between text-gray-700 hover:text-[#0A5C36] hover:bg-[#E8F5E9] cursor-pointer ${activeCategorie === category.name && 'text-[#0A5C36] bg-[#E8F5E9]'}`}
                                                    onClick={() => setActiveCategorie(category.name)}
                                                >
                                                    <span>{category.name}</span>
                                                    <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
                                                        {category.count}
                                                    </span>
                                                </Button>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </UISidebar>
            </SidebarProvider >*/}
        </>
    );
};

export default Sidebar;