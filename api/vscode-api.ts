import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export const vscodeRouter = express.Router();

const WORKSPACE_ROOT = process.cwd();

// Helper to check if file is within workspace
const safePath = (targetPath: string) => {
  const absolute = path.resolve(WORKSPACE_ROOT, targetPath);
  if (!absolute.startsWith(WORKSPACE_ROOT)) {
    throw new Error('Access denied: Out of workspace bounds');
  }
  return absolute;
};

// Helper to recursively list files, ignoring node_modules, dist, and .git
const scanDirectory = (dir: string, relativeDir: string = ''): any[] => {
  const absoluteDir = path.join(dir, relativeDir);
  let results: any[] = [];
  try {
    const list = fs.readdirSync(absoluteDir, { withFileTypes: true });
    for (const item of list) {
      const relPath = path.join(relativeDir, item.name);
      
      // Skip heavy or system folders
      if (['node_modules', '.git', 'dist', '.cache', 'tmp'].includes(item.name)) {
        continue;
      }

      if (item.isDirectory()) {
        results.push({
          name: item.name,
          path: relPath,
          type: 'directory',
          children: scanDirectory(dir, relPath),
        });
      } else {
        results.push({
          name: item.name,
          path: relPath,
          type: 'file',
          size: fs.statSync(path.join(dir, relPath)).size,
        });
      }
    }
  } catch (err) {
    // Silently ignore permission or missing folder errors
  }
  return results.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
};

// 1. List directory structure
vscodeRouter.get('/files', (req, res) => {
  try {
    const files = scanDirectory(WORKSPACE_ROOT);
    res.json({ success: true, files });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Read file content
vscodeRouter.post('/read', (req, res) => {
  const { filePath } = req.body;
  if (!filePath) {
    return res.status(400).json({ success: false, error: 'filePath parameter is required' });
  }
  try {
    const absolute = safePath(filePath);
    if (!fs.existsSync(absolute) || fs.statSync(absolute).isDirectory()) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    const content = fs.readFileSync(absolute, 'utf-8');
    res.json({ success: true, content, filePath });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Write file content
vscodeRouter.post('/write', (req, res) => {
  const { filePath, content } = req.body;
  if (!filePath || content === undefined) {
    return res.status(400).json({ success: false, error: 'filePath and content are required' });
  }
  try {
    const absolute = safePath(filePath);
    
    // Create folder structure if not exists
    const dir = path.dirname(absolute);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(absolute, content, 'utf-8');
    res.json({ success: true, message: 'File written successfully', filePath });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Create directory or empty file
vscodeRouter.post('/create', (req, res) => {
  const { path: targetPath, type } = req.body;
  if (!targetPath || !type) {
    return res.status(400).json({ success: false, error: 'path and type are required' });
  }
  try {
    const absolute = safePath(targetPath);
    if (type === 'directory') {
      if (!fs.existsSync(absolute)) {
        fs.mkdirSync(absolute, { recursive: true });
      }
    } else {
      const dir = path.dirname(absolute);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(absolute, '', 'utf-8');
    }
    res.json({ success: true, message: `${type} created successfully` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Delete file/directory
vscodeRouter.post('/delete', (req, res) => {
  const { path: targetPath } = req.body;
  if (!targetPath) {
    return res.status(400).json({ success: false, error: 'path is required' });
  }
  try {
    const absolute = safePath(targetPath);
    if (fs.existsSync(absolute)) {
      const stat = fs.statSync(absolute);
      if (stat.isDirectory()) {
        fs.rmSync(absolute, { recursive: true, force: true });
      } else {
        fs.unlinkSync(absolute);
      }
      res.json({ success: true, message: 'Deleted successfully' });
    } else {
      res.status(404).json({ success: false, error: 'Target not found' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Terminal command execution proxy (supporting git clone, ls, pwd, etc.)
vscodeRouter.post('/terminal', (req, res) => {
  const { command } = req.body;
  if (!command) {
    return res.status(400).json({ success: false, error: 'command is required' });
  }

  // Prevent dangerous terminal injections while enabling rich safe operations
  const sanitized = command.trim();
  const lower = sanitized.toLowerCase();
  
  // Safe command check
  const isSafeCommand = 
    lower.startsWith('git ') || 
    lower.startsWith('npm ') || 
    lower.startsWith('ls') || 
    lower.startsWith('pwd') || 
    lower.startsWith('mkdir ') || 
    lower.startsWith('cat ') || 
    lower.startsWith('echo ') || 
    lower.startsWith('find ');

  if (!isSafeCommand) {
    return res.json({
      success: true,
      stdout: '',
      stderr: `Security restriction: Command "${command.split(' ')[0]}" is blocked in the web console for safety. Try "git status", "git log", "git clone --depth 1 https://github.com/microsoft/vscode", "ls -la", "pwd", or "npm run build".`,
      exitCode: 127
    });
  }

  // Execute terminal commands natively
  exec(sanitized, { cwd: WORKSPACE_ROOT }, (error, stdout, stderr) => {
    res.json({
      success: true,
      stdout: stdout || '',
      stderr: stderr || (error ? error.message : ''),
      exitCode: error ? error.code || 1 : 0
    });
  });
});
