const fs = require('fs');

const version = process.argv[2];
const filename = process.argv[3];
if (!version || !filename) {
    console.error('usage: node patch.js [version] [package.json file]');
    process.exit(1);
}

const rootPackage = JSON.parse(fs.readFileSync(__dirname + '/../package.json'));
const rootVersion = rootPackage.version;
const patchedVersion = `${rootVersion}-sl.${version}`;

const patchDependencies = (dependencies) => {
    Object.keys(dependencies).forEach(depName => {
        if (!depName.includes('@sector-labs') && !depName.includes('@lingui')) {
            return;
        }

        dependencies[depName] = patchedVersion;
    });
};

const package = JSON.parse(fs.readFileSync(filename, 'utf-8'));
patchDependencies(package.dependencies || {});
patchDependencies(package.devDependencies || {});
package.version = patchedVersion;

console.log('version: ', rootVersion, ' -> ', package.version);
console.log('filename', filename);

fs.writeFileSync(filename, JSON.stringify(package, null, 4));
