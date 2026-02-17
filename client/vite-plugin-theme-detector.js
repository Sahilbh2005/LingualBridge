import fs from 'fs';
import path from 'path';

export default function themeDetector() {
    const virtualModuleId = 'virtual:themes';
    const resolvedVirtualModuleId = '\0' + virtualModuleId;

    return {
        name: 'vite-plugin-theme-detector',

        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },

        load(id) {
            if (id === resolvedVirtualModuleId) {
                const packageJsonPath = path.resolve(process.cwd(), 'package.json');
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
                const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

                const themePackages = Object.keys(dependencies).filter(dep =>
                    dep.startsWith('linguasetu-theme-')
                );

                const imports = themePackages.map((pkg, index) =>
                    `import * as theme${index} from '${pkg}';`
                ).join('\n');

                const exports = `export const themes = [
          ${themePackages.map((pkg, index) => `{
            id: '${pkg}',
            ...theme${index}
          }`).join(',\n')}
        ];`;

                return `
          ${imports}
          ${exports}
        `;
            }
        }
    };
}
