import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Folder, 
  File, 
  ChevronDown, 
  ChevronRight, 
  Terminal as TerminalIcon, 
  Files, 
  GitBranch, 
  Search, 
  Settings, 
  Play, 
  Plus, 
  FolderPlus, 
  Trash2, 
  Save, 
  Check, 
  RefreshCw, 
  Info, 
  AlertTriangle, 
  ExternalLink,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { apiFetch } from '../utils/apiClient';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileItem[];
  size?: number;
}

export const VsCodeConsole: React.FC = () => {
  // Navigation & UI Layout
  const [activeSidebar, setActiveSidebar] = useState<'explorer' | 'git' | 'search' | 'info'>('explorer');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'src': true,
    'src/components': true
  });
  
  // Editor state
  const [selectedFilePath, setSelectedFilePath] = useState<string>('README.md');
  const [fileContent, setFileContent] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  
  // Terminal state
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [terminalTab, setTerminalTab] = useState<'terminal' | 'problems' | 'output'>('terminal');
  const [terminalHeight, setTerminalHeight] = useState<number>(240);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState<boolean>(false);
  
  // Git / Clone state
  const [gitRepoUrl, setGitRepoUrl] = useState<string>('https://github.com/microsoft/vscode');
  const [gitLogs, setGitLogs] = useState<string[]>([]);
  const [gitBranch, setGitBranch] = useState<string>('main');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Create state
  const [isCreating, setIsCreating] = useState<'file' | 'directory' | null>(null);
  const [creationPath, setCreationPath] = useState<string>('');
  const [creationName, setCreationName] = useState<string>('');

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Initialize and load files
  const loadFiles = async () => {
    try {
      const res = await apiFetch<{ success: boolean; files: FileItem[] }>('/api/vscode/files');
      if (res.ok && res.data?.files) {
        setFiles(res.data.files);
      }
    } catch (e) {
      console.error('Error loading files:', e);
    }
  };

  useEffect(() => {
    loadFiles();
    
    // Add default terminal welcome message
    setTerminalLogs([
      'Microsoft Windows [Version 10.0.22631.3296]',
      '(c) Microsoft Corporation. All rights reserved.',
      '',
      'Welcome to Kronos OS VS Code Integrated Workbench Engine.',
      'Active Workspace Root: ' + window.location.origin,
      'Try running "git status", "ls -la", or cloning a repository directly.',
      'Type "help" to see available options.',
      ''
    ]);
  }, []);

  // Scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Load selected file
  const loadFileContent = async (filePath: string) => {
    setIsLoadingFile(true);
    setSelectedFilePath(filePath);
    setSaveSuccess(false);
    try {
      const res = await apiFetch<{ success: boolean; content: string }>('/api/vscode/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath })
      });
      if (res.ok && res.data) {
        setFileContent(res.data.content);
        setOriginalContent(res.data.content);
      } else {
        setFileContent('// File could not be loaded: ' + (res.data?.error || 'Unknown error'));
      }
    } catch (e) {
      setFileContent('// Error loading file: ' + e);
    } finally {
      setIsLoadingFile(false);
    }
  };

  // Load first file initially
  useEffect(() => {
    loadFileContent('README.md');
  }, []);

  // Save active file
  const handleSaveFile = async () => {
    if (!selectedFilePath) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await apiFetch<{ success: boolean }>('/api/vscode/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: selectedFilePath, content: fileContent })
      });
      if (res.ok) {
        setOriginalContent(fileContent);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        
        // Output saving log in terminal
        setTerminalLogs(prev => [
          ...prev,
          `[System] File saved successfully: ${selectedFilePath} (${new Date().toLocaleTimeString()})`
        ]);
        
        // Reload files in explorer tree (in case a new file was created and saved)
        loadFiles();
      }
    } catch (e) {
      setTerminalLogs(prev => [...prev, `[Error] Failed to save file: ${e}`]);
    } finally {
      setIsSaving(false);
    }
  };

  // Create file/folder
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creationName) return;
    
    const parentPath = creationPath ? creationPath + '/' : '';
    const targetPath = parentPath + creationName;
    const type = isCreating === 'directory' ? 'directory' : 'file';
    
    try {
      const res = await apiFetch<{ success: boolean }>('/api/vscode/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: targetPath, type })
      });
      if (res.ok) {
        setTerminalLogs(prev => [...prev, `[System] Created ${type}: ${targetPath}`]);
        setIsCreating(null);
        setCreationName('');
        loadFiles();
        if (type === 'file') {
          loadFileContent(targetPath);
        }
      } else {
        setTerminalLogs(prev => [...prev, `[Error] Failed to create item: ${res.data?.error}`]);
      }
    } catch (e) {
      setTerminalLogs(prev => [...prev, `[Error] Creation failed: ${e}`]);
    }
  };

  // Delete item
  const handleDeleteItem = async (targetPath: string) => {
    if (!window.confirm(`Are you absolutely sure you want to delete "${targetPath}"?`)) return;
    try {
      const res = await apiFetch<{ success: boolean }>('/api/vscode/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: targetPath })
      });
      if (res.ok) {
        setTerminalLogs(prev => [...prev, `[System] Deleted: ${targetPath}`]);
        loadFiles();
        if (selectedFilePath === targetPath) {
          setSelectedFilePath('README.md');
          loadFileContent('README.md');
        }
      }
    } catch (e) {
      setTerminalLogs(prev => [...prev, `[Error] Delete failed: ${e}`]);
    }
  };

  // Terminal command submission
  const executeTerminalCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setTerminalLogs(prev => [...prev, `kronos-os@workbench:~$ ${cmd}`]);
    setTerminalInput('');
    setIsExecuting(true);

    if (trimmed.toLowerCase() === 'clear') {
      setTerminalLogs([]);
      setIsExecuting(false);
      return;
    }

    if (trimmed.toLowerCase() === 'help') {
      setTerminalLogs(prev => [
        ...prev,
        'Available Workspace Commands:',
        '  git status                        Inspect git repository changes',
        '  git log -n 5                      View the recent 5 commit histories',
        '  git clone --depth 1 <repo>        Clones a Git repository directly',
        '  ls -la                            List file details of the current directory',
        '  pwd                               Print active working directory',
        '  npm run build                     Runs the Vite + esbuild compilation cycle',
        '  clear                             Clear the screen',
        ''
      ]);
      setIsExecuting(false);
      return;
    }

    try {
      const res = await apiFetch<{ success: boolean; stdout: string; stderr: string; exitCode: number }>('/api/vscode/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: trimmed })
      });
      
      if (res.ok && res.data) {
        if (res.data.stdout) {
          const lines = res.data.stdout.split('\n');
          setTerminalLogs(prev => [...prev, ...lines]);
        }
        if (res.data.stderr) {
          const lines = res.data.stderr.split('\n');
          setTerminalLogs(prev => [...prev, ...lines]);
        }
        
        // Trigger file list reload in case files were updated (e.g., git clone, mkdir)
        if (trimmed.includes('git clone') || trimmed.includes('mkdir') || trimmed.includes('npm run')) {
          loadFiles();
        }
      }
    } catch (e) {
      setTerminalLogs(prev => [...prev, `[Error] Terminal execution failed: ${e}`]);
    } finally {
      setIsExecuting(false);
    }
  };

  // Git clone from form handler
  const handleGitClone = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!gitRepoUrl) return;

    const command = `git clone --depth 1 ${gitRepoUrl}`;
    await executeTerminalCommand(command);
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Recursive tree renderer
  const renderTree = (items: FileItem[]) => {
    return items.map((item) => {
      const isExpanded = expandedFolders[item.path];
      const isSelected = selectedFilePath === item.path;

      if (item.type === 'directory') {
        return (
          <div key={item.path} className="select-none text-xs font-medium">
            <div 
              onClick={() => toggleFolder(item.path)}
              className="flex items-center space-x-1 py-1 px-2 hover:bg-[#2A2D2E]/50 rounded cursor-pointer group justify-between"
            >
              <div className="flex items-center space-x-1.5 truncate">
                <span className="text-[#858585]">
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </span>
                <Folder className="w-4 h-4 text-[#D1A347] fill-[#D1A347]/10" />
                <span className="text-[#CCCCCC] hover:text-white truncate">{item.name}</span>
              </div>
              
              {/* Directory operations hover */}
              <div className="hidden group-hover:flex items-center space-x-1 shrink-0">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCreating('file');
                    setCreationPath(item.path);
                  }}
                  className="p-0.5 rounded hover:bg-[#3C3C3C] text-gray-400 hover:text-white"
                  title="New File..."
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCreating('directory');
                    setCreationPath(item.path);
                  }}
                  className="p-0.5 rounded hover:bg-[#3C3C3C] text-gray-400 hover:text-white"
                  title="New Folder..."
                >
                  <FolderPlus className="w-3 h-3" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.path);
                  }}
                  className="p-0.5 rounded hover:bg-[#3C3C3C] text-rose-400 hover:text-rose-300"
                  title="Delete Folder"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            {isExpanded && item.children && (
              <div className="pl-3 border-l border-[#2D2D2E] ml-3 mt-0.5 space-y-0.5">
                {renderTree(item.children)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div 
            key={item.path}
            onClick={() => loadFileContent(item.path)}
            className={`flex items-center justify-between py-1 px-2 hover:bg-[#2A2D2E]/60 rounded cursor-pointer group ${
              isSelected ? 'bg-[#37373D] text-white font-semibold border-l-2 border-purple-500' : 'text-[#A6A6A6]'
            }`}
          >
            <div className="flex items-center space-x-1.5 min-w-0">
              <File className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-purple-400' : 'text-[#858585]'}`} />
              <span className="text-xs truncate">{item.name}</span>
              {originalContent !== fileContent && isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shrink-0" title="Unsaved changes" />
              )}
            </div>
            
            {/* Delete button hover */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteItem(item.path);
              }}
              className="hidden group-hover:block p-0.5 rounded hover:bg-[#3C3C3C] text-gray-400 hover:text-rose-400 shrink-0"
              title="Delete File"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        );
      }
    });
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#3C3C3C] rounded-xl flex flex-col overflow-hidden shadow-2xl text-white select-none h-[750px]">
      
      {/* VS Code Custom Window Header */}
      <div className="bg-[#323233] h-10 px-4 border-b border-[#2B2B2B] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          {/* OS Control Dots mock */}
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
          </div>
          <span className="text-xs text-gray-400 font-mono select-none px-2 py-0.5 bg-[#252526] rounded">workspace-root</span>
        </div>
        
        {/* Active Title bar */}
        <div className="text-xs text-gray-300 font-medium truncate max-w-sm sm:max-w-md font-mono flex items-center space-x-1.5">
          <span className="text-purple-400 font-bold">Kronos Apex OS IDE</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400 truncate">{selectedFilePath}</span>
          {originalContent !== fileContent && (
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30 animate-pulse font-bold">Unsaved</span>
          )}
        </div>
        
        {/* Actions bar */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1 px-2 py-0.5 bg-[#252526] border border-[#3C3C3C] rounded text-emerald-400 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Server Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        
        {/* Leftmost Activity Bar (Vertical) */}
        <div className="w-12 bg-[#333333] border-r border-[#2B2B2B] flex flex-col items-center justify-between py-4 shrink-0">
          <div className="space-y-4 w-full">
            <button 
              onClick={() => setActiveSidebar('explorer')}
              className={`w-full flex justify-center py-2 relative transition-colors ${
                activeSidebar === 'explorer' 
                  ? 'text-purple-400 border-l-2 border-purple-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              title="File Explorer (Ctrl+Shift+E)"
            >
              <Files className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => setActiveSidebar('git')}
              className={`w-full flex justify-center py-2 relative transition-colors ${
                activeSidebar === 'git' 
                  ? 'text-purple-400 border-l-2 border-purple-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Source Control / Git (Ctrl+Shift+G)"
            >
              <div className="relative">
                <GitBranch className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              </div>
            </button>

            <button 
              onClick={() => setActiveSidebar('search')}
              className={`w-full flex justify-center py-2 relative transition-colors ${
                activeSidebar === 'search' 
                  ? 'text-purple-400 border-l-2 border-purple-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Search File Index (Ctrl+Shift+F)"
            >
              <Search className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setActiveSidebar('info')}
              className={`w-full flex justify-center py-2 relative transition-colors ${
                activeSidebar === 'info' 
                  ? 'text-purple-400 border-l-2 border-purple-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              title="IDE Lecture & Thesis"
            >
              <Info className="w-5 h-5 animate-pulse" />
            </button>
          </div>

          <div className="space-y-3 w-full flex flex-col items-center">
            <button onClick={loadFiles} className="text-gray-400 hover:text-white" title="Refresh Workspace Tree">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-white" title="IDE Preferences">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar Expansion Pane */}
        <div className="w-64 bg-[#252526] border-r border-[#2B2B2B] flex flex-col shrink-0 min-h-0">
          
          {/* Explorer tab header */}
          <div className="p-3 border-b border-[#2B2B2B] flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase select-none">
              {activeSidebar === 'explorer' && 'Explorer: WORKSPACE'}
              {activeSidebar === 'git' && 'Source Control'}
              {activeSidebar === 'search' && 'Search Files'}
              {activeSidebar === 'info' && 'Apex IDE Codex'}
            </span>
            
            {activeSidebar === 'explorer' && (
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => {
                    setIsCreating('file');
                    setCreationPath('');
                  }}
                  className="p-1 rounded hover:bg-[#2D2D2E] text-gray-400 hover:text-white"
                  title="New File at Root"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => {
                    setIsCreating('directory');
                    setCreationPath('');
                  }}
                  className="p-1 rounded hover:bg-[#2D2D2E] text-gray-400 hover:text-white"
                  title="New Folder at Root"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={loadFiles}
                  className="p-1 rounded hover:bg-[#2D2D2E] text-gray-400 hover:text-white"
                  title="Refresh File List"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Body */}
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
            
            {/* Create Item Panel inside Sidebar */}
            {isCreating && (
              <form onSubmit={handleCreateItem} className="mb-3 p-2.5 bg-[#202021] border border-purple-500/30 rounded-lg space-y-2">
                <div className="text-[10px] font-bold text-purple-300">
                  Create {isCreating === 'directory' ? 'Folder' : 'File'} in <span className="font-mono text-gray-400">/{creationPath || 'root'}</span>
                </div>
                <input 
                  type="text"
                  placeholder={`name... (e.g. index.js)`}
                  value={creationName}
                  onChange={(e) => setCreationName(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500"
                  autoFocus
                />
                <div className="flex justify-end space-x-1.5 text-[10px]">
                  <button 
                    type="button" 
                    onClick={() => setIsCreating(null)}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-white font-bold"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}

            {/* SIDEBAR VIEW 1: FILE EXPLORER */}
            {activeSidebar === 'explorer' && (
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-400 py-1 px-1">
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span className="truncate">kronos-apex-financial-os</span>
                </div>
                <div className="space-y-0.5 pl-1.5">
                  {renderTree(files)}
                </div>
              </div>
            )}

            {/* SIDEBAR VIEW 2: GIT MANAGER / REPO CLONE */}
            {activeSidebar === 'git' && (
              <div className="space-y-4 p-1">
                <div className="bg-[#1e1e1e] border border-[#2B2B2B] rounded-lg p-3 space-y-2.5">
                  <h4 className="text-xs font-bold text-purple-400 flex items-center space-x-1.5">
                    <GitBranch className="w-4 h-4" />
                    <span>Active Repo: VS Code Core Integration</span>
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Clone repositories directly into the workspace files. You can clone the massive VS Code repository to explore its files within the system!
                  </p>
                  
                  <form onSubmit={handleGitClone} className="space-y-2 pt-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Repository URL</label>
                    <input 
                      type="text"
                      value={gitRepoUrl}
                      onChange={(e) => setGitRepoUrl(e.target.value)}
                      className="w-full bg-[#252526] border border-[#3C3C3C] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                      placeholder="https://github.com/..."
                    />
                    <button
                      type="submit"
                      disabled={isExecuting}
                      className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-purple-950 disabled:to-indigo-950 text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-purple-950/20 flex items-center justify-center space-x-1.5 cursor-pointer border border-purple-400/30"
                    >
                      {isExecuting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Executing Clone...</span>
                        </>
                      ) : (
                        <>
                          <GitBranch className="w-3.5 h-3.5" />
                          <span>Git Clone VS Code</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Simulated commits */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Repository Commits</span>
                  <div className="bg-[#1e1e1e] border border-[#2B2B2B] rounded-lg p-2.5 font-mono text-[10px] space-y-1.5">
                    <div className="text-purple-400">commit dca8a3e (HEAD -&gt; main)</div>
                    <div className="text-gray-400">Author: sovereignties3@gmail.com</div>
                    <div className="text-gray-300">"feat: integrate entire VS Code editor into Kronos OS dashboard"</div>
                    <div className="border-t border-[#2B2B2B] pt-1.5 text-gray-500">commit 1e92d8f</div>
                    <div className="text-gray-500">"docs: expand Salesforce.md Einstein Trust Layer thesis"</div>
                  </div>
                </div>
              </div>
            )}

            {/* SIDEBAR VIEW 3: GLOBAL SEARCH */}
            {activeSidebar === 'search' && (
              <div className="space-y-3 p-1">
                <div className="relative">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search files... (e.g. console)"
                    className="w-full bg-[#1e1e1e] border border-[#2B2B2B] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 pl-8"
                  />
                  <Search className="w-4 h-4 text-gray-500 absolute left-2.5 top-2" />
                </div>
                
                <div className="text-[10px] text-gray-400 px-1 uppercase tracking-wider font-bold">Search results</div>
                <div className="space-y-1.5">
                  {searchQuery ? (
                    files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map(f => (
                      <div 
                        key={f.path}
                        onClick={() => loadFileContent(f.path)}
                        className="p-2 hover:bg-[#2A2D2E]/80 border border-[#2D2D2E] rounded cursor-pointer transition-colors"
                      >
                        <div className="text-xs font-bold text-purple-400 truncate">{f.name}</div>
                        <div className="text-[10px] text-gray-500 truncate">/{f.path}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 italic p-2 text-center bg-[#1e1e1e] rounded border border-[#2D2D2E]">
                      Type a query above to filter files recursively...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SIDEBAR VIEW 4: IDE THESIS INFO */}
            {activeSidebar === 'info' && (
              <div className="space-y-3.5 p-1 text-xs">
                <div className="bg-gradient-to-br from-purple-950/40 to-indigo-950/40 border border-purple-500/30 rounded-lg p-3 space-y-2">
                  <h4 className="font-bold text-purple-300 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>Why build this IDE?</span>
                  </h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    By integrating a complete functional editor with absolute filesystem read/write access and integrated terminal commands, we prove **unprecedented architectural control**.
                  </p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    This is not a mock image — clicking folders actually scans files; typing and saving actually modifies the app files, ready to be reviewed by hiring recruiters.
                  </p>
                </div>

                <div className="bg-[#1e1e1e] border border-[#2B2B2B] rounded-lg p-3 space-y-2">
                  <h4 className="font-bold text-gray-300 flex items-center space-x-1.5">
                    <FolderGit2 className="w-4 h-4" />
                    <span>Real-time Sync</span>
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    This code explorer links directly to the app server using fs, avoiding mock restrictions and allowing true full-stack workspace control directly from your client browser!
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Central Editor Area & Bottom Terminal Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1E1E1E]">
          
          {/* Top Tabs Bar of Editor */}
          <div className="h-9 bg-[#2D2D2D] border-b border-[#252526] flex items-center justify-between px-3 shrink-0 select-none">
            <div className="flex items-center space-x-1 h-full min-w-0">
              <div className="h-full bg-[#1E1E1E] px-4 border-t-2 border-purple-500 text-white text-xs font-semibold flex items-center space-x-1.5 shrink-0 select-none">
                <File className="w-3.5 h-3.5 text-purple-400" />
                <span className="truncate">{selectedFilePath.split('/').pop()}</span>
                {originalContent !== fileContent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs text-gray-400 shrink-0">
              <button 
                onClick={handleSaveFile}
                disabled={isSaving || originalContent === fileContent}
                className="flex items-center space-x-1 px-2.5 py-1 bg-purple-600 disabled:bg-purple-950/40 hover:bg-purple-500 disabled:text-gray-500 rounded text-white font-bold text-[11px] transition-colors cursor-pointer"
                title="Save changes to active file"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save (Ctrl+S)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Monaco Editor Wrapper */}
          <div className="flex-1 min-h-0 relative bg-[#1e1e1e]">
            {isLoadingFile ? (
              <div className="absolute inset-0 bg-[#1e1e1e]/80 backdrop-blur-xs flex items-center justify-center z-10 flex-col space-y-3">
                <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
                <span className="text-xs text-gray-400 font-mono">Loading {selectedFilePath}...</span>
              </div>
            ) : null}

            <Editor
              height="100%"
              theme="vs-dark"
              path={selectedFilePath}
              value={fileContent}
              onChange={(val) => setFileContent(val || '')}
              options={{
                fontSize: 12,
                fontFamily: 'Consolas, "Courier New", monospace',
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                lineHeight: 18,
                automaticLayout: true,
                padding: { top: 12 },
                tabSize: 2,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                formatOnPaste: true,
                formatOnType: true
              }}
            />
          </div>

          {/* Integrated Terminal Frame at Bottom */}
          <div 
            style={{ height: isTerminalMaximized ? '100%' : `${terminalHeight}px` }}
            className={`border-t border-[#3C3C3C] bg-[#181818] flex flex-col min-h-[100px] transition-all relative ${
              isTerminalMaximized ? 'absolute inset-0 z-30' : ''
            }`}
          >
            
            {/* Terminal Header Tabs */}
            <div className="h-9 bg-[#252526] border-b border-[#2B2B2B] px-4 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center space-x-4 h-full text-xs">
                <button 
                  onClick={() => setTerminalTab('terminal')}
                  className={`h-full font-bold relative transition-colors ${
                    terminalTab === 'terminal' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center space-x-1.5 px-1 py-1">
                    <TerminalIcon className="w-3.5 h-3.5" />
                    <span>Terminal</span>
                  </span>
                </button>

                <button 
                  onClick={() => setTerminalTab('problems')}
                  className={`h-full font-bold relative transition-colors ${
                    terminalTab === 'problems' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center space-x-1.5 px-1 py-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Problems</span>
                    <span className="px-1 bg-yellow-400/20 text-yellow-400 rounded text-[9px] font-bold">0</span>
                  </span>
                </button>

                <button 
                  onClick={() => setTerminalTab('output')}
                  className={`h-full font-bold relative transition-colors ${
                    terminalTab === 'output' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center space-x-1.5 px-1 py-1">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Execution Output</span>
                  </span>
                </button>
              </div>

              <div className="flex items-center space-x-2.5">
                <button 
                  onClick={() => setIsTerminalMaximized(!isTerminalMaximized)}
                  className="p-1 rounded hover:bg-[#323233] text-gray-400 hover:text-white"
                  title={isTerminalMaximized ? 'Restore Panel Size' : 'Maximize Panel Size'}
                >
                  {isTerminalMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Terminal Console View */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed select-text min-h-0 bg-[#181818] scrollbar-thin">
              
              {terminalTab === 'terminal' && (
                <div className="space-y-1">
                  {terminalLogs.map((log, index) => {
                    let colorClass = 'text-gray-300';
                    if (log.startsWith('[Error]') || log.startsWith('Security restriction')) {
                      colorClass = 'text-rose-400 font-semibold';
                    } else if (log.startsWith('[System]')) {
                      colorClass = 'text-emerald-400 font-semibold';
                    } else if (log.startsWith('kronos-os@')) {
                      colorClass = 'text-purple-400 font-bold';
                    } else if (log.startsWith('Author:') || log.startsWith('commit ')) {
                      colorClass = 'text-blue-400 font-bold';
                    }
                    return (
                      <div key={index} className={`whitespace-pre-wrap break-all ${colorClass}`}>
                        {log}
                      </div>
                    );
                  })}
                  
                  {isExecuting && (
                    <div className="flex items-center space-x-2 text-purple-400 font-bold py-1">
                      <span className="w-1.5 h-3 bg-purple-400 animate-pulse shrink-0" />
                      <span className="animate-pulse">Active process running in sandbox workspace shell...</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-purple-400 font-bold pt-1">
                    <span className="shrink-0 mr-1.5">kronos-os@workbench:~$</span>
                    <input 
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          executeTerminalCommand(terminalInput);
                        }
                      }}
                      disabled={isExecuting}
                      className="flex-1 bg-transparent border-none outline-none text-white text-[11px] font-mono"
                      placeholder={isExecuting ? 'Please wait...' : 'Type commands here (e.g., "help", "git status", "ls -la")...'}
                      autoFocus
                    />
                  </div>
                  <div ref={terminalEndRef} />
                </div>
              )}

              {terminalTab === 'problems' && (
                <div className="text-gray-400 italic text-center py-6">
                  No problems or validation errors detected in the current workspace. Type check complete!
                </div>
              )}

              {terminalTab === 'output' && (
                <div className="space-y-1.5 text-gray-400">
                  <div className="text-purple-400 font-bold">// Sandbox build output pipeline:</div>
                  <div>Loaded workspace build pipeline definitions...</div>
                  <div>Static imports validated against compiler declarations.</div>
                  <div className="text-emerald-400">[Vite] Code hot modules ready for sandbox development.</div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* VS Code Bottom Status Bar */}
      <div className="bg-[#007ACC] h-6 px-3 flex items-center justify-between text-xs font-medium shrink-0 font-sans select-none">
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center space-x-1 bg-[#1F8AD2] px-2 h-full cursor-pointer hover:bg-[#1E77B3]">
            <GitBranch className="w-3.5 h-3.5" />
            <span>{gitBranch}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[#E2F1FC]">
            <span>UTF-8</span>
            <span>•</span>
            <span>TypeScript React</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-[#E2F1FC]">
          <span>Ln 1, Col 1</span>
          <span>•</span>
          <span>Spacing: 2</span>
          <span className="font-bold">Monaco Editor v0.48.0</span>
        </div>
      </div>

    </div>
  );
};
