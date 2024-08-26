# panz-cli
react-vue-cli
基于webpack、commander命令行开发配置的react-vue脚手架。

安装： `npm i panz-cli -g`

## 命令
- 创建一个项目 `panz create projectName` (可选参数：-v表示vue项目；-r表示react项目)
- 自动安装依赖：`-i`
- 支持react、vue2、vue3、vue自定义模板创建项目。

## webpack构建项目
- 命令行配置：node命令行开发，支持参数配置构建，支持多模板构建和自定义构建。
- 基础配置：loader、plugin配置，静态资源、JS/HTML/CSS分别处理，prod、dev环境单独配置。
- 高级优化：利用sourceMap、Cache缓存、分包、多进程打包、图片压缩优化整个打包构建过程。
- 合并配置：生产、开发环境配置合并，vue和react单独配置其loader或plugin。