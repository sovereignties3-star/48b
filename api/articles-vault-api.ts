import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const articlesVaultRouter = Router();

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

function scanArticleFiles(): string[] {
  const possibleRoots = [
    path.join(process.cwd(), 'Articles', 'Articles'),
    path.join(process.cwd(), 'Articles'),
    '/Articles/Articles',
    '/Articles',
  ];

  const filesFound = new Set<string>();

  for (const root of possibleRoots) {
    if (fs.existsSync(root)) {
      try {
        const entries = fs.readdirSync(root, { withFileTypes: true });
        for (const e of entries) {
          if (e.isFile() && (e.name.endsWith('.html') || e.name.endsWith('.htm') || e.name.startsWith('202'))) {
            filesFound.add(path.join(root, e.name));
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }

  return Array.from(filesFound);
}

function parseArticleHtml(filePath: string): {
  title: string;
  createdDate: string;
  publishedDate: string;
  htmlContent: string;
  plainText: string;
  coverImage?: string;
  tags: string[];
} {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');

    // Extract Title
    let title = '';
    const titleMatch = raw.match(/<title>([^<]*)<\/title>/i);
    if (titleMatch && titleMatch[1].trim()) {
      title = titleMatch[1].trim();
    } else {
      const h1Match = raw.match(/<h1>([^<]*)<\/h1>/i);
      if (h1Match && h1Match[1].trim()) {
        title = h1Match[1].trim();
      } else {
        const base = path.basename(filePath);
        title = base.replace(/^\d{4}-\d{2}-\d{2}[^a-zA-Z0-9]*/, '').replace(/\.html?$/i, '').trim();
        if (!title) {
          title = base.replace(/\.html?$/i, '');
        }
      }
    }

    // Extract Dates
    let createdDate = '';
    const createdMatch = raw.match(/class=["']created["'][^>]*>Created on ([^<]+)<\/p>/i);
    if (createdMatch) {
      createdDate = createdMatch[1].trim();
    } else {
      const base = path.basename(filePath);
      const dateMatch = base.match(/^(\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2}(?::\d{2})?)?)/);
      if (dateMatch) {
        createdDate = dateMatch[1];
      }
    }

    let publishedDate = '';
    const pubMatch = raw.match(/class=["']published["'][^>]*>Published on ([^<]+)<\/p>/i);
    if (pubMatch) {
      publishedDate = pubMatch[1].trim();
    }

    // Extract Cover Image
    let coverImage: string | undefined;
    const imgMatch = raw.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch) {
      coverImage = imgMatch[1];
    }

    // Extract text content from <body> or <div>
    let plainText = raw
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract tags
    const hashtagMatches = (raw.match(/#[a-zA-Z0-9_]+/g) || []).map(t => t.slice(1));
    const defaultTags: string[] = [];
    const lower = plainText.toLowerCase();
    if (lower.includes('crypto') || lower.includes('token') || lower.includes('ledger') || lower.includes('web3')) defaultTags.push('Web3 & Crypto');
    if (lower.includes('ai') || lower.includes('gemini') || lower.includes('chatgpt') || lower.includes('model')) defaultTags.push('Artificial Intelligence');
    if (lower.includes('bank') || lower.includes('settlement') || lower.includes('clearing') || lower.includes('fapi')) defaultTags.push('Fintech & Banking');
    if (lower.includes('architecture') || lower.includes('system') || lower.includes('protocol')) defaultTags.push('Systems Architecture');
    if (lower.includes('sovereignty') || lower.includes('admin') || lower.includes('constitution')) defaultTags.push('Sovereignty & Governance');

    const combinedTags = Array.from(new Set([...hashtagMatches, ...defaultTags]));

    return {
      title: title || 'Untitled Article',
      createdDate,
      publishedDate,
      htmlContent: raw,
      plainText,
      coverImage,
      tags: combinedTags.slice(0, 8),
    };
  } catch (err: any) {
    return {
      title: path.basename(filePath),
      createdDate: '',
      publishedDate: '',
      htmlContent: '',
      plainText: '',
      tags: [],
    };
  }
}

/**
 * GET /api/articles/all
 * Returns list of all articles with previews, metadata, word counts
 */
articlesVaultRouter.get('/all', (req: Request, res: Response) => {
  try {
    const files = scanArticleFiles();
    const articles: ArticleSummary[] = [];

    for (const fullPath of files) {
      const filename = path.basename(fullPath);
      const id = Buffer.from(filename).toString('base64url');
      const { title, createdDate, plainText, coverImage, tags } = parseArticleHtml(fullPath);
      const words = plainText.split(/\s+/).filter(Boolean);

      articles.push({
        id,
        filename,
        relativePath: path.relative(process.cwd(), fullPath),
        title,
        dateStr: createdDate,
        date: createdDate || '2026-01-01',
        hasCoverImage: Boolean(coverImage),
        coverImageUrl: coverImage,
        wordCount: words.length,
        characterCount: plainText.length,
        excerpt: plainText.slice(0, 240) + (plainText.length > 240 ? '...' : ''),
        tags,
      });
    }

    // Sort chronologically descending
    articles.sort((a, b) => b.filename.localeCompare(a.filename));

    const totalWords = articles.reduce((sum, a) => sum + a.wordCount, 0);

    res.json({
      success: true,
      totalCount: articles.length,
      totalWords,
      articles,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/articles/content
 * Returns full content and rendered view of a specific article
 */
articlesVaultRouter.get('/content', (req: Request, res: Response) => {
  try {
    const { id, filename, path: queryPath } = req.query;

    const files = scanArticleFiles();
    let targetPath: string | null = null;

    if (queryPath && typeof queryPath === 'string') {
      targetPath = path.resolve(process.cwd(), queryPath);
    } else if (filename && typeof filename === 'string') {
      targetPath = files.find(f => path.basename(f) === filename) || null;
    } else if (id && typeof id === 'string') {
      try {
        const decoded = Buffer.from(id, 'base64url').toString('utf8');
        targetPath = files.find(f => path.basename(f) === decoded) || null;
      } catch (e) {
        // fallback
      }
    }

    if (!targetPath || !fs.existsSync(targetPath)) {
      return res.status(404).json({ success: false, error: 'Article file not found' });
    }

    const { title, createdDate, publishedDate, htmlContent, plainText, coverImage, tags } = parseArticleHtml(targetPath);

    res.json({
      success: true,
      filename: path.basename(targetPath),
      relativePath: path.relative(process.cwd(), targetPath),
      title,
      createdDate,
      publishedDate,
      htmlContent,
      plainText,
      coverImage,
      tags,
      wordCount: plainText.split(/\s+/).filter(Boolean).length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
