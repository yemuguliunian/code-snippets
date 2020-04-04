# code-snippets

此工程旨在记录个人常用的代码片段，解决工作环境更换时代码片段的迁移工作

## 本人的一些代码风格和习惯

-   编译器选择的是 vscode
-   代码缩进习惯使用 4

## 代码片段文件示例，这边产用的是 markdown 文本保存

html.md

```md
---
title: html template
prefix: html
scope: html,vue
description: '!DOCTYPE html template'
---

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>${1:DEMO}</title>
    </head>
    <body>
        $2
    </body>
</html>
```

转换

html.code-snippets

```js
`
{
    "${title}": {
        "scope": "${scope}",
        "prefix": "${prefix}",
        "body": [
            ${content
                .replace(/"/g, '\\"')
                .split('\n')
                .map(item => `"${item}"`)
                .join(',\n')}
        ],
        "description": "${description}"
    }
}
`;
```
