const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');

async function main() {
  const dir = path.resolve(__dirname, '..');
  console.log('Project root:', dir);

  // 1. Initialize Git repository
  await git.init({ fs, dir, defaultBranch: 'main' });
  console.log('Initialized Git repository on branch main.');

  // 2. Discover files to stage (respecting .gitignore)
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

  const filesToAdd = getFiles(dir);
  console.log(`Found ${filesToAdd.length} files to stage.`);

  // 3. Stage each file
  for (const filepath of filesToAdd) {
    await git.add({ fs, dir, filepath });
  }
  console.log('Staged all files.');

  // 4. Commit
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Fixelora Studio',
      email: 'production@fixelorastudio.com',
    },
    message: 'feat: complete phase 1 frontend and admin UI',
  });

  console.log('Successfully created initial commit!');
  console.log('Commit SHA:', sha);

  // 5. Verify log
  const commits = await git.log({ fs, dir, depth: 1 });
  console.log('HEAD commit message:', commits[0].commit.message);
  console.log('HEAD author:', commits[0].commit.author.name);
}

main().catch((err) => {
  console.error('Git initialization error:', err);
  process.exit(1);
});
