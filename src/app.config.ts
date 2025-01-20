export default defineAppConfig({
  pages: ["pages/index/index", "pages/dashboard/index"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    color: "#999999",
    selectedColor: "#ef3500",
    backgroundColor: "#ffffff",
    list: [
      { pagePath: "pages/index/index", text: "首页" },
      { pagePath: "pages/dashboard/index", text: "分析" },
    ],
  },
});
