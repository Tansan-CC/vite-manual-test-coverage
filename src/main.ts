import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

createApp(App).mount("#app");

// 每10秒更新一次覆盖率
setInterval(() => {
  const coverage = (window as any).__coverage__;
  fetch("http://localhost:3000/report/", {
    method: "POST",
    body: JSON.stringify(coverage),
    headers: {
      "Content-Type": "application/json",
    },
  });
}, 10000);
