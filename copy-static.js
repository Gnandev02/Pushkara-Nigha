import fs from 'fs';
import path from 'path';

const dirsToCopy = [
    'css',
    'js',
    'utils',
    'auth',
    'roles',
    'reporting',
    'users',
    'styles',
    'assets'
];

const destRoot = 'dist';

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        // Create directory path if missing
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.copyFileSync(src, dest);
    }
}

console.log('[Build] Copying static assets to dist...');
dirsToCopy.forEach((dir) => {
    if (fs.existsSync(dir)) {
        copyRecursiveSync(dir, path.join(destRoot, dir));
        console.log(`- Copied "${dir}" to "dist/${dir}"`);
    } else {
        console.warn(`- Directory "${dir}" not found, skipping.`);
    }
});
console.log('[Build] Static assets copy completed.');
