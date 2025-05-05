import { Chatbot } from "./components/Chatbot";
import { Dashboard } from "./components/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function Home() {
  return (
    <main className="w-full h-full flex justify-center items-center">
      <Header />
      <div className="w-full h-full overflow-hidden m-0 p-0">
        <Sidebar />
        <section className="w-full h-full overflow-y-auto overflow-x-hidden pt-16 pl-96 bg-gray-50">
          <Dashboard />
        </section>
      </div>
      <Chatbot />
    </main>
  );
}
