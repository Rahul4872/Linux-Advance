import React, { useState } from 'react';
import { linuxData } from './data/marathiLinuxData';
import { Sidebar } from './components/Sidebar';
import { ContentArea } from './components/ContentArea';
import { Menu } from 'lucide-react';

export default function App() {
  const [activeTopicId, setActiveTopicId] = useState(linuxData[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeTopic = linuxData.find(t => t.id === activeTopicId) || linuxData[0];

  return (
    <div className="flex h-screen bg-[#050505] text-gray-200 overflow-hidden relative font-sans">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <Sidebar 
        topics={linuxData} 
        activeTopicId={activeTopicId} 
        onSelectTopic={setActiveTopicId}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden glass-panel border-b border-white/5 p-4 flex items-center gap-4 sticky top-0 z-20 backdrop-blur-xl">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 truncate">Linux Mastery</h1>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          <ContentArea topic={activeTopic} />
        </div>
      </main>
    </div>
  );
}
