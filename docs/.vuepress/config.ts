import { defineHopeConfig }  from "vuepress-theme-hope";
import themeConfig from "./themeConfig";
import { createMarkdown } from '@vuepress/markdown';

module.exports = defineHopeConfig({
  port: 8080,
  title: "JavaGuide",
  description: "Java学习&&面试指南",
  //指定 vuepress build 的输出目录
  dest: "./dist",
  // 是否开启默认预加载 js
  shouldPrefetch: (file, type) => false,
  head: [
    // 添加百度统计
    [
      "script", {},
      `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?5dd2e8c97962d57b7b8fea1737c01743";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "//at.alicdn.com/t/font_2922463_99aa80ii7cf.css",
      },
    ],
  ],
  locales: {
    "/": {
      lang: "zh-CN"
    }
  },
  markdown: {
    anchor: {
      level: [1,2,3,4,5,6]
    },
    toc: {
      level: [1,2,3,4,5,6],
    },
    extractHeaders: {
      level: [1,2,3,4,5,6],
    },
    
  },
  themeConfig,
});

