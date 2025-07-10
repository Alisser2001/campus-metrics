'use client';
import { useEffect, useState } from "react";
import { Chatbot } from "./components/Chatbot";
import { Dashboard } from "./components/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { documentService } from "@/utils/services/documents";
import { toast } from "sonner";
import { LoadingSpinner } from "./components/Loading";
import { categoryService } from "@/utils/services/categories";

export default function Home() {
  const [sidebarVisible, setSidebaVisible] = useState(true);
  const [activeCategorie, setActiveCategorie] = useState('all_docs');
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  function getFilteredAndSortedDocuments() {
    return [...documents]
      .filter((doc) => {
        const matchesSearch =
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.doc_categorie.categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.updated_by_user.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType =
          selectedType === 'all' ||
          (selectedType === 'pdf' && doc.doc_type.type === 'PDF') ||
          (selectedType === 'word' && doc.doc_type.type === 'DOCX') ||
          (selectedType === 'excel' && doc.doc_type.type === 'XLSX');

        const matchesYear =
          selectedYear === 'all' ||
          new Date(doc.created_at).getFullYear().toString() === selectedYear;

        const matchesCategorie =
          activeCategorie === 'all_docs' ||
          doc.doc_categorie.folder_path === activeCategorie;

        return matchesSearch && matchesType && matchesYear && matchesCategorie;
      })
      .sort((a, b) => {
        const dateA = new Date(a.updated_at).getTime();
        const dateB = new Date(b.updated_at).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }

  const processedDocuments = getFilteredAndSortedDocuments();

  const toggleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  async function loadData() {
    try {
      const documentsData = await documentService.getDocuments();
      setDocuments(documentsData);
      const categoriesData = await categoryService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error al cargar datos:", error)
      toast("No se pudieron cargar los datos de los documentos");
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Header />
      {isLoading ?
        <div className="w-screen h-screen overflow-hidden m-0 p-0 flex justify-center items-center">
          <LoadingSpinner />
        </div> :
        <div className="w-full h-full m-0 p-0">
          {sidebarVisible && <Sidebar setActiveCategorie={setActiveCategorie} categories={categories} activeCategorie={activeCategorie} />}
          <section className={`w-full h-full overflow-y-auto overflow-x-hidden pt-16 ${sidebarVisible ? 'pl-96' : 'pl-0'} bg-gray-50`}>
            <Dashboard
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sidebarVisible={sidebarVisible}
              setSidebaVisible={setSidebaVisible}
              toggleSort={toggleSort}
              sortDirection={sortDirection}
              sortedDocuments={processedDocuments}
              loadData={loadData}
              selectedType={selectedType} 
              setSelectedType={setSelectedType}
              selectedYear={selectedYear} 
              setSelectedYear={setSelectedYear}
            />
          </section>
        </div>
      }
      <Chatbot />
    </div>
  );
}
