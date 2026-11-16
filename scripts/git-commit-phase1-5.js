const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');

async function main() {
  const dir = path.resolve(__dirname, '..');

  const ignoredPatterns = [
    'node_modules',
    '.next',
    '.git',
    'out',
    'build',
    '.vercel',
    '.env',
    '.DS_Store'
  ];

  function getFiles(currentDir, relativeBase = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    let files = [];
    for (const entry of entries) {
      if (ignoredPatterns.includes(entry.name)) continue;
      const fullPath = path.join(currentDir, entry.name);
      const relPath = relativeBase ? `${relativeBase}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        files = files.concat(getFiles(fullPath, relPath));
      } else {
        files.push(relPath);
      }
    }
    return files;
  }

  const allFiles = getFiles(dir);

  for (const filepath of allFiles) {
    await git.add({ fs, dir, filepath });
  }

  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Fixelora Studio',
      email: 'production@fixelorastudio.com',
    },
    message: 'fix: ui refinements, interim admin security, and full services overhaul',
  });

  console.log('Phase 1.5 commit created successfully!');
  console.log('Commit SHA:', sha);
}

main().catch((err) => {
  console.error('Commit error:', err);
  process.exit(1);
});
