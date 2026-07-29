import React, { useState } from 'react';
import {
  Code,
  FileCode,
  Copy,
  Check,
  Download,
  Terminal,
  Play,
  Folder,
  FileText,
  Sparkles,
  Layers,
} from 'lucide-react';
import { PYTHON_PROJECT_FILES } from '../data/pythonProjectFiles';
import { PythonFileItem } from '../types';

export const PythonCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<PythonFileItem>(PYTHON_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [testQuery, setTestQuery] = useState('What is the weather in Tokyo?');
  const [testResult, setTestResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePythonRun = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const q = testQuery.toLowerCase();
      let intent = 'general_qa';
      let entity = {};

      if (q.includes('weather')) {
        intent = 'weather';
        entity = { city: 'Tokyo' };
      } else if (q.includes('remind') || q.includes('alarm')) {
        intent = 'reminder';
        entity = { title: testQuery, duration: '10 minutes' };
      } else if (q.includes('open') || q.includes('launch')) {
        intent = 'open_app';
        entity = { app_name: 'YouTube' };
      } else if (q.includes('news')) {
        intent = 'news';
        entity = { category: 'tech' };
      }

      setTestResult({
        query: testQuery,
        intent,
        entity,
        classUsed: 'VoiceMateAssistant -> NLPIntentEngine',
        speakResponse: `[Python Engine Result] Processed intent '${intent}' successfully.`,
        executionTimeMs: 14,
      });
      setIsSimulating(false);
    }, 400);
  };

  const handleDownloadZip = () => {
    // Generate combined text bundle for easy copy or file export
    const fullText = PYTHON_PROJECT_FILES.map(
      (f) => `========================================\n# FILE: ${f.path}\n========================================\n${f.content}\n\n`
    ).join('');

    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voicemate_python_desktop_architecture.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-[#08080a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex flex-col h-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-100">Python Modular OOP Desktop Architecture</h3>
            <p className="text-[11px] text-gray-400">Clean, scalable Python backend code engine</p>
          </div>
        </div>

        <button
          onClick={handleDownloadZip}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-all shadow-[0_0_10px_rgba(59,130,246,0.4)]"
        >
          <Download className="w-4 h-4" />
          <span>Export Python Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* File Explorer Sidebar */}
        <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
            <Folder className="w-3.5 h-3.5 text-blue-400" />
            <span>Modular Project Files</span>
          </div>

          <div className="space-y-1 overflow-y-auto flex-1 pr-1 scrollbar-thin scrollbar-thumb-white/10">
            {PYTHON_PROJECT_FILES.map((f) => {
              const isSelected = selectedFile.path === f.path;
              return (
                <button
                  key={f.path}
                  onClick={() => setSelectedFile(f)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-400' : 'text-gray-500'}`} />
                    <span className="truncate">{f.path}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Python NLP Simulator Bench */}
          <div className="mt-4 pt-3 border-t border-white/5 text-xs">
            <h5 className="font-semibold text-gray-200 mb-2 flex items-center space-x-1">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>Simulate Python NLP Engine</span>
            </h5>
            <div className="space-y-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Test query..."
                className="w-full bg-black/40 border border-white/10 text-[11px] text-gray-200 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-blue-500/50"
              />
              <button
                onClick={handleSimulatePythonRun}
                disabled={isSimulating}
                className="w-full py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 font-semibold rounded-lg text-[11px] flex items-center justify-center space-x-1"
              >
                <Play className="w-3 h-3" />
                <span>Run Classify Intent</span>
              </button>

              {testResult && (
                <div className="p-2.5 bg-black/50 rounded-lg border border-blue-500/30 font-mono text-[10px] space-y-1">
                  <p className="text-blue-400 font-bold">Class: {testResult.classUsed}</p>
                  <p className="text-gray-300">Intent: <span className="text-emerald-400">{testResult.intent}</span></p>
                  <p className="text-gray-400 truncate">Entities: {JSON.stringify(testResult.entity)}</p>
                  <p className="text-gray-500">{testResult.executionTimeMs}ms execution</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Code Content Viewer */}
        <div className="lg:col-span-8 bg-black/40 border border-white/10 rounded-xl flex flex-col overflow-hidden">
          {/* File Header */}
          <div className="px-4 py-2.5 bg-black/30 border-b border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-blue-300">{selectedFile.path}</span>
              <p className="text-[10px] text-gray-400">{selectedFile.description}</p>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] rounded-lg transition-colors border border-white/10"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-gray-400" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          </div>

          {/* Code Text Area */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-gray-200 bg-transparent leading-relaxed scrollbar-thin scrollbar-thumb-white/10 max-h-[440px]">
            <pre className="whitespace-pre-wrap">{selectedFile.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
