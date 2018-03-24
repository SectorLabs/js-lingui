const fs = require('fs');

const version = process.argv[2];
const filename = process.argv[3];
if (!version || !filename) {
    console.error('usage: node patch.js [version] [package.json file]');
    process.exit(1);
}

console.log('version', version);
console.log('filename', filename);

const patchVersion = input => `${input}-sl.${version}`;
const patchDependencies = (dependencies) => {
    Object.keys(dependencies).forEach(depName => {
        if (depName.includes('@babel')) {
            dependencies[depName] = dependencies[depName]
                .replace(/beta.40/g, 'beta.38')
                .replace(/\^/g, '');

            return;
        }

        if (!depName.includes('@sector-labs') && !depName.includes('@lingui')) {
            return;
        }

        dependencies[depName] = patchVersion(dependencies[depName]);
    });
};

const package = JSON.parse(fs.readFileSync(filename, 'utf-8'));
patchDependencies(package.dependencies || {});
patchDependencies(package.devDependencies || {});
package.version = patchVersion(package.version);

fs.writeFileSync(filename, JSON.stringify(package, null, 4));
