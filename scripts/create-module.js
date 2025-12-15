#!/usr/bin/env node
/** @author aaron-iz */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get module name from command line arguments
const moduleName = process.argv[2];

if (!moduleName) {
    console.error('Error: Module name is required');
    console.log('Usage: node scripts/create-module.js <module-name>');
    process.exit(1);
}

// Convert module name to kebab-case for basePath
function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

const kebabCaseName = toKebabCase(moduleName);
const moduleDir = path.join(__dirname, '..', 'src', 'modules', kebabCaseName);

// Check if module already exists
if (fs.existsSync(moduleDir)) {
    console.error(`Error: Module "${kebabCaseName}" already exists at ${moduleDir}`);
    process.exit(1);
}

console.log(`Creating module: ${moduleName}`);
console.log(`Module directory: ${moduleDir}`);

// Create directory structure
const directories = [
    moduleDir,
    path.join(moduleDir, '.mock'),
    path.join(moduleDir, 'src')
];

directories.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
});

// Create empty index.ts files
const emptyIndexFiles = [
    path.join(moduleDir, '.mock', 'index.ts'),
    path.join(moduleDir, 'src', 'index.ts')
];

emptyIndexFiles.forEach(file => {
    fs.writeFileSync(file, '', 'utf8');
    console.log(`Created empty file: ${file}`);
});

// Create directory in root public folder and resources.json file
const publicModuleDir = path.join(__dirname, '..', 'public', kebabCaseName);
fs.mkdirSync(publicModuleDir, { recursive: true });
console.log(`Created directory: ${publicModuleDir}`);

const resourcesJsonPath = path.join(publicModuleDir, 'resources.json');
fs.writeFileSync(resourcesJsonPath, '', 'utf8');
console.log(`Created empty file: ${resourcesJsonPath}`);

// Create root index.ts
const rootIndexContent = `export * from "./module.config";
`;

fs.writeFileSync(path.join(moduleDir, 'index.ts'), rootIndexContent, 'utf8');
console.log(`Created file: ${path.join(moduleDir, 'index.ts')}`);

// Create module.config.ts
const moduleConfigContent = `import type { ModuleConfig } from "@/infra";
import React from "react";

export const moduleConfig: ModuleConfig = {
    name: "${moduleName}",
    owner: "",
    basePath: "/${kebabCaseName}",
    routes: [],
    navigationItems: [],
};
`;

fs.writeFileSync(path.join(moduleDir, 'module.config.ts'), moduleConfigContent, 'utf8');
console.log(`Created file: ${path.join(moduleDir, 'module.config.ts')}`);

console.log(`\n✅ Module "${moduleName}" created successfully!`);
console.log(`\nModule structure:`);
console.log(`src/modules/${kebabCaseName}/`);
console.log(`├── .mock/`);
console.log(`│   └── index.ts`);
console.log(`├── src/`);
console.log(`│   └── index.ts`);
console.log(`├── index.ts`);
console.log(`└── module.config.ts`);
console.log(`\npublic/${kebabCaseName}/`);
console.log(`└── resources.json`);