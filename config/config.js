// 选择框架
const chalk = require("chalk")
const green = chalk.green
module.exports = {
  selectProject: [
    {
      type: "list",
      name: "project",
      message: "请选择创建的项目：",
      choices: [
        {
          name: `${green("vue")}`,
          value: "vue",
        },
        {
          name: `${green("react")}`,
          value: "react",
        },
      ],
    },
  ],
  vueConfig: [
    {
      type: "list",
      name: "preset",
      message: "请选择你的模版预设：",
      choices: [
        {
          name: `模版一 ${green("([Vue 3] babel, eslint)")}`,
          value: "vue3",
        },
        {
          name: `模版二 ${green("([Vue 2] babel, eslint)")}`,
          value: "vue2",
        },
        {
          name: "自定义模版",
          value: "custom-vue",
        },
      ],
    },
  ],
  vueCustomConfig: [
    {
      type: "checkbox",
      name: "custom",
      message: "请选择你的自定义配置：",
      choices: [
        "Babel",
        "Eslint",
        "Router",
        "Vuex",
        "Unit Testing",
        "browsersList" // 浏览器适配程度
      ],
      validate: function (answer) {
        if (answer.length < 1) {
          return "至少选择一项！"
        }
        return true
      },
    },
  ],
  reactConfig: [
    {
      type: "list",
      name: "preset",
      message: "请选择你的模版预设：",
      choices: [
        {
          name: `模版一 ${green("React")}`,
          value: "react-hooks",
        },
        // {
        //   name: "自定义模版",
        //   value: "custom-react",
        // },
      ],
    },
  ],
}
