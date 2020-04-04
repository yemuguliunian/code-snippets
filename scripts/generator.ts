const path = require('path');
const fs = require('fs-extra');
import * as matter from 'gray-matter';
import { dedent } from 'vtils';

// 源文件目录
const SOURE_PATH = 'templates';
// 生成文件目录
const TARGET_PATH = 'snippent';
// vscode 代码片段后缀名
const VSCODE_SNIPPENT_SUFFIX = '.code-snippets';

/**
 * 获取 yaml 配置标题
 * @param readFilePath 文件路径
 */
const parseMD = (readFilePath: string) => {
    const {
        data: { title = '', prefix = '', scope = '', description = '' },
        content,
    } = matter(fs.readFileSync(readFilePath, 'utf8'));
    return {
        title: title || prefix,
        prefix,
        scope,
        description,
        content: content.replace(/^\n+|\n+$/g, ''),
    };
};

/**
 * vsocde 代码片段模板
 */
const renderSnippent = ({ title, prefix, scope, description, content }) => {
    return dedent`
    {
        "${title}": {
            "scope": "${scope}",
            "prefix": "${prefix}",
            "body": [
                ${content
                    .replace(/"/g, '\\"')
                    .split('\n')
                    .map((item) => `"${item}"`)
                    .join(',\n')}
            ],
            "description": "${description}"
        }
    }
    `;
};

/**
 * 写入
 */
const write = (sourcePath: string, { target, filename }: { target: string; filename: string }) => {
    renderSnippent(parseMD(sourcePath));
    fs.outputFile(
        path.join(target, filename.replace('.md', VSCODE_SNIPPENT_SUFFIX)),
        renderSnippent(parseMD(sourcePath)),
    );
};

/**
 * 读取代码片段源文件并生成
 */
const gengerator = () => {
    // 源文件目录路径
    const fromDir = path.resolve(SOURE_PATH);
    // 待生成的文件目录路径
    const toDir = path.resolve(TARGET_PATH);

    const readDir = (fromDir, toDir) => {
        const files = fs.readdirSync(fromDir);
        files.forEach(function (filename) {
            const fullPath = path.join(fromDir, filename);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                const toFullPath = path.join(toDir, filename);
                readDir(fullPath, toFullPath);
            }
            if (stat.isFile()) {
                write(fullPath, { target: toDir, filename });
                return;
            }
        });
    };
    readDir(fromDir, toDir);
};

gengerator();
