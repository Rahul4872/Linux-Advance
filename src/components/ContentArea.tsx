import React, { useState } from 'react';
import { TopicDef } from '../types';
import { Copy, Check, Terminal as TerminalIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface ContentAreaProps {
  topic: TopicDef;
}

export function ContentArea({ topic }: ContentAreaProps) {
  return (
    <motion.div 
      key={topic.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-4xl mx-auto w-full pb-24"
    >
      <header className="mb-12">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-4 tracking-tight"
        >
          {topic.title}
        </motion.h2>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "4rem" }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" 
        />
      </header>

      <div className="space-y-10">
        {topic.sections.map((section, idx) => (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (idx * 0.1), duration: 0.5 }}
            key={idx} 
            className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden group"
          >
            {/* Subtle gradient hover effect on card */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <h3 className="text-xl md:text-2xl font-semibold text-gray-100 flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-emerald-400 text-sm font-mono">
                {idx + 1}
              </span>
              {section.title}
            </h3>
            
            <p className="text-gray-400 leading-relaxed text-base md:text-lg mb-8 font-light">
              {section.content}
            </p>

            {section.commands && section.commands.length > 0 && (
              <div className="bg-[#050505] rounded-xl border border-white/10 overflow-hidden shadow-2xl relative">
                {/* Mac-like Terminal Header */}
                <div className="bg-[#0f0f0f] px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 flex justify-center items-center gap-2 opacity-50">
                    <TerminalIcon className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-mono uppercase tracking-widest">bash</span>
                  </div>
                </div>
                
                <div className="divide-y divide-white/5">
                  {section.commands.map((cmd, cmdIdx) => (
                    <CommandRow key={cmdIdx} cmd={cmd.cmd} desc={cmd.desc} />
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
}

function CommandRow({ cmd, desc }: { cmd: string; desc: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-5 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-start gap-4 group/cmd">
      <div className="flex-1 space-y-2.5">
        <div className="flex items-start gap-3">
          <span className="text-emerald-500 font-mono select-none mt-0.5 opacity-70">$</span>
          <code className="font-mono text-sm md:text-base text-emerald-100 break-all leading-relaxed">{cmd}</code>
        </div>
        <p className="text-sm text-gray-500 pl-5 font-sans leading-relaxed">{desc}</p>
      </div>
      <button 
        onClick={handleCopy}
        className="self-start md:self-center p-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-gray-400 hover:text-emerald-400 transition-all flex-shrink-0 opacity-100 md:opacity-0 group-hover/cmd:opacity-100 focus:opacity-100"
        title="Copy command"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}
