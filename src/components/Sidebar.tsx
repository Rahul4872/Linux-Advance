import React, { useState } from 'react';
import { TopicDef } from '../types';
import { 
  Terminal, 
  Shield, 
  Activity, 
  Network, 
  HardDrive, 
  Server, 
  Cpu,
  Menu,
  X,
  Users,
  Search,
  Package,
  Archive,
  Monitor,
  Key,
  Code,
  GitBranch,
  Container,
  Clock,
  Settings,
  Globe,
  Database,
  ShieldAlert,
  Gauge,
  Cloud,
  Wrench,
  ChevronRight
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Terminal,
  Shield,
  Activity,
  Network,
  HardDrive,
  Server,
  Cpu,
  Users,
  Search,
  Package,
  Archive,
  Monitor,
  Key,
  Code,
  GitBranch,
  Container,
  Clock,
  Settings,
  Globe,
  Database,
  ShieldAlert,
  Gauge,
  Cloud,
  Wrench
};

interface SidebarProps {
  topics: TopicDef[];
  activeTopicId: string;
  onSelectTopic: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function HighlightedText({ text, highlight }: { text: string, highlight: string }) {
  const tokens = highlight.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return <span>{text}</span>;
  }
  
  // Escape special characters in highlight string
  const escapedTokens = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');
  const parts = text.split(regex);
  
  const matchRegex = new RegExp(`^(${escapedTokens.join('|')})$`, 'i');

  return (
    <span>
      {parts.map((part, i) => 
        matchRegex.test(part) ? <mark key={i} className="bg-emerald-500/40 text-emerald-100 rounded-sm px-0.5 bg-transparent">{part}</mark> : <span key={i}>{part}</span>
      )}
    </span>
  );
}

export function Sidebar({ topics, activeTopicId, onSelectTopic, isOpen, setIsOpen }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const tokens = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);

  const filteredTopics = topics.map(topic => {
    if (tokens.length === 0) {
      return { ...topic, topicMatch: true, matchingCommands: [] };
    }

    const topicTitleLower = topic.title.toLowerCase();
    const topicMatch = tokens.every(token => topicTitleLower.includes(token));
    
    const matchingCommands: { cmd: string, desc: string }[] = [];
    topic.sections.forEach(section => {
      section.commands?.forEach(command => {
        const cmdLower = command.cmd.toLowerCase();
        const descLower = command.desc.toLowerCase();
        // A command matches if every token is found in either the command or its description
        const commandMatch = tokens.every(token => cmdLower.includes(token) || descLower.includes(token));
        
        if (commandMatch) {
          matchingCommands.push(command);
        }
      });
    });

    return {
      ...topic,
      topicMatch,
      matchingCommands
    };
  }).filter(topic => tokens.length === 0 || topic.topicMatch || topic.matchingCommands.length > 0);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-80 bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-white/5
        transform transition-transform duration-300 ease-out
        flex flex-col shadow-2xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Terminal className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-100 tracking-tight">Linux Mastery</h1>
              <p className="text-[10px] uppercase tracking-widest text-emerald-500/80 font-mono mt-0.5">Advanced Guide</p>
            </div>
          </div>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-300 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-white/5 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search topics or commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No results found for "{searchQuery}"
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const Icon = iconMap[topic.icon] || Terminal;
              const isActive = activeTopicId === topic.id;
              const isExpanded = searchQuery && topic.matchingCommands.length > 0;
              
              return (
                <div key={topic.id} className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      onSelectTopic(topic.id);
                      if (window.innerWidth < 768) setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group
                      ${isActive 
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'}
                    `}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-colors duration-200 ${isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-400'}`} />
                    <span className={`text-sm tracking-wide truncate ${isActive ? 'font-medium' : 'font-normal'}`}>
                      <HighlightedText text={topic.title} highlight={searchQuery} />
                    </span>
                    {isExpanded && (
                      <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">
                        {topic.matchingCommands.length}
                      </span>
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="pl-9 pr-2 pb-2 space-y-1">
                      {topic.matchingCommands.slice(0, 3).map((cmd, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            onSelectTopic(topic.id);
                            if (window.innerWidth < 768) setIsOpen(false);
                          }}
                          className="w-full text-left group/cmd flex items-start gap-2 py-1.5 px-2 rounded-md hover:bg-white/5 transition-colors"
                        >
                          <ChevronRight className="w-3 h-3 text-gray-600 mt-0.5 shrink-0 group-hover/cmd:text-emerald-500 transition-colors" />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-mono text-gray-300 truncate">
                              <HighlightedText text={cmd.cmd} highlight={searchQuery} />
                            </span>
                            <span className="text-[10px] text-gray-500 truncate">
                              <HighlightedText text={cmd.desc} highlight={searchQuery} />
                            </span>
                          </div>
                        </button>
                      ))}
                      {topic.matchingCommands.length > 3 && (
                        <div className="pl-4 text-[10px] text-gray-600 italic">
                          + {topic.matchingCommands.length - 3} more matches
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>
        
        <div className="p-5 border-t border-white/5 bg-black/20 shrink-0">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#050505] border border-white/5 shadow-inner">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-xs font-mono text-gray-500">root@system:~#</span>
          </div>
        </div>
      </aside>
    </>
  );
}
