#!/usr/bin/env node
// '#!/usr/bin/env node' : 用来告诉脚本工具(bash/zsh)，下面的内容是要在node环境中运行的代码
// const commander = require("commander")
const commander = require("commander")
const pkg = require("./package.json")
// 拉取代码的工具：download-git-repo
const download = require("download-git-repo")
// 用于在命令行中与用户交互
const inquirer = require("inquirer")
const program = new commander.Command()
const path = require("path")
const fs = require("fs-extra")
const ora = require("ora")
const chalk = require("chalk")

const { exec } = require("child_process") // exec 函数用于执行一个 shell 命令，并将命令的输出（标准输出和标准错误）传递给一个回调函数。它的用法非常简单，适合执行短命令和处理简单的命令输出。
const {
  selectProject,
  vueConfig,
  vueCustomConfig,
  reactConfig,
} = require("./config/config")
program.usage("<command> [options]")
program.version(pkg.version)

// <>表示必填，[]表示可选, 第三个参数是默认值
// 命令输入并开始执行走的链路
program
  .command("create <name>")
  .description("创建项目")
  .option("-i, --isInstall [type]", "是否自动按照依赖", false)
  .option("-v, --vue [type]", "拉取vue项目", false)
  .option("-r, --react [type]", "拉取react项目", false)
  .action(async (name, opts) => {
    const blue = chalk.blue
    const { isInstall, vue, react } = opts
    const projectPath = path.resolve(process.cwd(), name)

    if (vue) {
      const vueRes = await inquirer.prompt(vueConfig)
      vueRes.preset === "custom-vue"
        ? await inquirer.prompt(vueCustomConfig)
        : templateDownload(vueRes.preset, projectPath, name, isInstall)
    } else if (react) {
      const reactRes = await inquirer.prompt(reactConfig)
      templateDownload(reactRes.preset, projectPath, name, isInstall)
    } else {
      const selectRes = await inquirer.prompt(selectProject)
    }
    // 模版下载
    function templateDownload(param, projectPath, name, isInstall) {
      console.log(`✨ 你的项目在： ${projectPath}.`)
      // 创建项目目录
      if (fs.existsSync(projectPath)) fs.removeSync(projectPath) // 删除已存在的目录
      fs.mkdirSync(projectPath)
      // 下载模板
      const templateSpinner = ora({
        text: "模版下载中...",
        spinner: "earth",
      }).start()
      let repo = ""
      switch (param) {
        // direct: 前缀告诉 download-git-repo 库直接使用提供的 URL 下载仓库，而不是通过托管服务的 API。
        case "vue3":
          repo = "direct:https://github.com/coderPanz/vue3-cli.git#main"
          break
        case "vue2":
          repo = "direct:https://github.com/coderPanz/vue2-cli.git#main"
          break
        case "custom-vue":
          repo = "direct:https://github.com/your-custom-repo.git#main"
          break
        case "react-hooks":
          repo = "direct:https://github.com/coderPanz/react-cli.git#main"
          break
        case "react-class":
          repo = "direct:https://github.com/vuejs/vue-cli.git#vue2"
          break
        default:
          templateSpinner.fail("未知模版⚠️")
          return
      }
      console.log('first', repo)
      download(repo, projectPath, { clone: true }, err => {
        if (err) {
          templateSpinner.fail("模版下载失败☹️")
          console.error(err)
          return
        }
        const gitSpinner = ora({
          text: "本地仓库初始化中...",
          spinner: "earth",
        }).start()
        exec("git init", { cwd: projectPath }, err => {
          if (err) {
            gitSpinner.fail("本地仓库创建失败!☹️")
            console.error(err)
            return
          }
          templateSpinner.succeed("模版下载成功🏅")
          gitSpinner.succeed("本地仓库初始化成功!✨✨✨")
          if (!isInstall) {
            console.log("请按照以下步骤依次执行以启动开发服务：")
            const cd = `cd ${name}`
            console.log(`${blue(cd)}`)
            console.log(`${blue("npm i")}`)
            console.log(`${blue("npm run start")}`)
          }
        })
        if (isInstall) {
          // 安装依赖
          const installSpinner = ora({
            text: "依赖安装中...",
            spinner: "earth",
          }).start()
          exec("npm install", { cwd: projectPath }, err => {
            if (err) {
              installSpinner.fail("依赖安装失败☹️")
              console.error(err)
              return
            }
            installSpinner.succeed("依赖安装成功🏅🎉")
            console.log("请按照以下步骤依次执行：")
            const cd = `cd ${name}`
            console.log(`${blue(cd)}`)
            console.log(`${blue("npm i")}`)
            console.log(`${blue("npm run server")}`)
          })
        }
      })
    }
  })
// 解析命令行参数: 确保 program.parse() 在所有命令和选项定义之后调用，要放在最后
program.parse()
