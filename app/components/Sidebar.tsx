'use client';
import { Button } from "@/components/ui/button";

const Sidebar = ({ setActiveCategorie, categories, activeCategorie }: any) => {
    return (
        <div className="w-96 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-16">
            <div className="flex-1 overflow-auto p-4">
                <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-3">
                    Categorías
                </h3>
                <nav>
                    <ul>
                        <li key='all_docs' className="mb-1">
                            <Button
                                variant="ghost"
                                className={`w-full justify-between text-gray-700 hover:text-[#0A5C36] hover:bg-[#E8F5E9] cursor-pointer ${activeCategorie === 'all_docs' && 'text-[#0A5C36] bg-[#E8F5E9]'}`}
                                onClick={() => setActiveCategorie('all_docs')}
                            >
                                <span>Todos los Documentos</span>
                                <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
                                    {categories.reduce((sum: any, item: any) => sum + item.quantity, 0)}
                                </span>
                            </Button>
                        </li>
                        {categories.map((category: any) => (
                            <li key={category.folder_path} className="mb-1">
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-between text-gray-700 hover:text-[#0A5C36] hover:bg-[#E8F5E9] cursor-pointer ${activeCategorie === category.folder_path && 'text-[#0A5C36] bg-[#E8F5E9]'}`}
                                    onClick={() => setActiveCategorie(category.folder_path)}
                                >
                                    <span>{category.categorie}</span>
                                    <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
                                        {category.quantity}
                                    </span>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;