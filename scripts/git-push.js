const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

async function main() {
  const repoUrl = process.argv[2];
  const token = process.argv[3] || process.env.GITHUB_TOKEN;

  if (!repoUrl) {
    console.log('Usage: node scripts/git-push.js <GITHUB_REPO_URL> [GITHUB_TOKEN]');
    console.log('Example: node scripts/git-push.js https://github.com/your-username/fixelora-studio.git ghp_xxxx');
    process.exit(1);
  }

  const dir = path.resolve(__dirname, '..');

  // Add remote origin
  try {
    await git.addRemote({ fs, dir, remote: 'origin', url: repoUrl, force: true });
    console.log(`Configured remote origin: ${repoUrl}`);
  } catch (e) {
    console.log('Remote configuration notice:', e.message);
  }

  if (!token) {
    console.log('\nRemote origin configured. To push using regular git, run:');
    console.log('  git push -u origin main');
    return;
  }

  console.log('Pushing to GitHub remote via secure token...');
  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({ username: token }),
  });

  console.log('Push completed successfully!', pushResult);
}

main().catch((err) => {
  console.error('Push error:', err.message);
  process.exit(1);
});
