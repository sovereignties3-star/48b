import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Calendar,
  Clock,
  Tag,
  Share2,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Type,
  FileText,
  Filter,
  RefreshCw,
  Hash,
} from 'lucide-react';

export interface ArticleSummary {
  id: string;
  filename: string;
  relativePath: string;
  title: string;
  dateStr: string;
  date: string;
  hasCoverImage: boolean;
  coverImageUrl?: string;
  wordCount: number;
  characterCount: number;
  excerpt: string;
  tags: string[];
}

export const ArticlesVaultHub: React.FC = () => {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'words-desc' | 'title'>('date-desc');

  // Reader State
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [articleDetail, setArticleDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [readingTheme, setReadingTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [fontSize, setFontSize] = useState<number>(18);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch articles index
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/articles/all');
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles);
        if (data.articles.length > 0 && !selectedArticleId) {
          setSelectedArticleId(data.articles[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Fetch individual article content
  useEffect(() => {
    if (!selectedArticleId) return;
    const loadContent = async () => {
      setDetailLoading(true);
      try {
        const res = await fetch(`/api/articles/content?id=${encodeURIComponent(selectedArticleId)}`);
        const data = await res.json();
        if (data.success) {
          setArticleDetail(data);
        }
      } catch (err) {
        console.error('Error loading article content:', err);
      } finally {
        setDetailLoading(false);
      }
    };
    loadContent();
  }, [selectedArticleId]);

  // Aggregate all tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach(a => {
      a.tags.forEach(t => tagSet.add(t));
    });
    return ['All', ...Array.from(tagSet)];
  }, [articles]);

  // Filtered & Sorted Articles
  const filteredArticles = useMemo(() => {
    let result = articles.filter(a => {
      const matchTag = selectedTag === 'All' || a.tags.includes(selectedTag);
      const matchSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.filename.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTag && matchSearch;
    });

    result.sort((a, b) => {
      if (sortBy === 'date-desc') return b.filename.localeCompare(a.filename);
      if (sortBy === 'date-asc') return a.filename.localeCompare(b.filename);
      if (sortBy === 'words-desc') return b.wordCount - a.wordCount;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [articles, searchQuery, selectedTag, sortBy]);

  const handleCopyText = () => {
    if (!articleDetail?.plainText) return;
    navigator.clipboard.writeText(
      `# ${articleDetail.title}\nDate: ${articleDetail.createdDate}\n\n${articleDetail.plainText}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    if (!articleDetail?.htmlContent) return;
    const blob = new Blob([articleDetail.htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = articleDetail.filename || 'article.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border-b border-purple-800/40 px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600/20 border border-purple-500/40 rounded-xl text-purple-400 shadow-inner">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Knowledge, Manifestos & Articles Vault
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 font-medium">
                  {articles.length} Thought Pieces
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete archive of architectural breakthroughs, cryptographic philosophies, and industry analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchArticles}
              className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Vault
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Article Index */}
        <div className="w-full lg:w-96 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0">
          {/* Search and Tags */}
          <div className="p-3 border-b border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 169+ articles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-purple-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="words-desc">Longest Articles</option>
                <option value="title">Alphabetical</option>
              </select>

              <span className="text-[11px] text-slate-400">
                {filteredArticles.length} / {articles.length} shown
              </span>
            </div>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pt-1">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2 py-0.5 text-[10px] rounded-md font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Article List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No articles match your query.
              </div>
            ) : (
              filteredArticles.map(art => {
                const isSelected = art.id === selectedArticleId;
                return (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-purple-950/70 border-purple-500/80 text-white shadow-md'
                        : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold leading-snug line-clamp-2">
                        {art.title}
                      </h4>
                      {art.hasCoverImage && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                          Image
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {art.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {art.dateStr || art.filename.slice(0, 10)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {art.wordCount} words
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Area: Article Reader & Typography Experience */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          {/* Reader Controls Toolbar */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setReadingTheme('dark')}
                  className={`px-2.5 py-1 text-xs rounded flex items-center gap-1 ${
                    readingTheme === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                  title="Dark Theme"
                >
                  <Moon className="w-3.5 h-3.5" />
                  Dark
                </button>
                <button
                  onClick={() => setReadingTheme('sepia')}
                  className={`px-2.5 py-1 text-xs rounded flex items-center gap-1 ${
                    readingTheme === 'sepia' ? 'bg-amber-900/60 text-amber-200' : 'text-slate-400'
                  }`}
                  title="Sepia Theme"
                >
                  <Sun className="w-3.5 h-3.5" />
                  Sepia
                </button>
                <button
                  onClick={() => setReadingTheme('light')}
                  className={`px-2.5 py-1 text-xs rounded flex items-center gap-1 ${
                    readingTheme === 'light' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-400'
                  }`}
                  title="Light Theme"
                >
                  <Sun className="w-3.5 h-3.5" />
                  Light
                </button>
              </div>

              {/* Font Family */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setFontFamily('serif')}
                  className={`px-2 py-1 text-xs font-serif rounded ${
                    fontFamily === 'serif' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  Serif
                </button>
                <button
                  onClick={() => setFontFamily('sans')}
                  className={`px-2 py-1 text-xs font-sans rounded ${
                    fontFamily === 'sans' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  Sans
                </button>
                <button
                  onClick={() => setFontFamily('mono')}
                  className={`px-2 py-1 text-xs font-mono rounded ${
                    fontFamily === 'mono' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  Mono
                </button>
              </div>

              {/* Font Size */}
              <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setFontSize(s => Math.max(14, s - 2))}
                  className="px-1.5 py-0.5 hover:text-white"
                >
                  A-
                </button>
                <span className="font-mono text-slate-200 px-1">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(s => Math.min(26, s + 2))}
                  className="px-1.5 py-0.5 hover:text-white"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
              <button
                onClick={handleDownloadHtml}
                className="px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Download HTML
              </button>
            </div>
          </div>

          {/* Reader Body */}
          <div
            className={`flex-1 overflow-y-auto p-6 md:p-12 transition-colors ${
              readingTheme === 'dark'
                ? 'bg-slate-950 text-slate-200'
                : readingTheme === 'sepia'
                ? 'bg-[#fbf0d9] text-[#433422]'
                : 'bg-white text-slate-900'
            }`}
          >
            {detailLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-slate-500">
                <RefreshCw className="w-8 h-8 animate-spin mb-3 text-purple-500" />
                <p className="text-sm">Loading article...</p>
              </div>
            ) : !articleDetail ? (
              <div className="text-center py-20 text-slate-500 text-sm">
                Select an article from the left sidebar to start reading.
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Header Metadata */}
                <div className="space-y-3 pb-6 border-b border-slate-700/40">
                  <h1
                    className={`font-bold leading-tight ${
                      readingTheme === 'light' ? 'text-slate-950' : 'text-white'
                    }`}
                    style={{ fontSize: `${fontSize + 10}px` }}
                  >
                    {articleDetail.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 text-xs opacity-75">
                    {articleDetail.createdDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Created: {articleDetail.createdDate}
                      </span>
                    )}
                    {articleDetail.publishedDate && (
                      <span>• Published: {articleDetail.publishedDate}</span>
                    )}
                    <span>• {articleDetail.wordCount} words</span>
                    <span>• ~{Math.ceil(articleDetail.wordCount / 200)} min read</span>
                  </div>

                  {articleDetail.tags && articleDetail.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {articleDetail.tags.map((t: string) => (
                        <span
                          key={t}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            readingTheme === 'dark'
                              ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cover Image */}
                {articleDetail.coverImage && (
                  <div className="my-6 rounded-2xl overflow-hidden border border-slate-700/50 shadow-lg max-h-96">
                    <img
                      src={articleDetail.coverImage}
                      alt={articleDetail.title}
                      className="w-full object-cover"
                    />
                  </div>
                )}

                {/* Article Content Render */}
                <div
                  className={`leading-relaxed space-y-4 ${
                    fontFamily === 'serif'
                      ? 'font-serif'
                      : fontFamily === 'mono'
                      ? 'font-mono'
                      : 'font-sans'
                  }`}
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{
                    __html: articleDetail.htmlContent
                      ? articleDetail.htmlContent
                          .replace(/<html>[\s\S]*?<body[^>]*>/i, '')
                          .replace(/<\/body>[\s\S]*?<\/html>/i, '')
                          .replace(/<style[\s\S]*?<\/style>/gi, '')
                      : articleDetail.plainText,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
