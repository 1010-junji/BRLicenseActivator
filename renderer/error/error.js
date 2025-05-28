// c:\Users\oishi\Documents\sampleTool\license-window\error.js
document.addEventListener("DOMContentLoaded", () => {
  const codeElement = document.getElementById("code");
  const msgElement = document.getElementById("msg");
  const reloadButton = document.getElementById("reload");

  // クエリパラメータを取得
  const params = new URLSearchParams(window.location.search);
  const errorCode = params.get("errorCode") || "不明";
  const errorDescription = params.get("errorDescription") || "不明";

  if (codeElement) {
    codeElement.textContent = errorCode;
  } else {
    console.error('Element with ID "code" not found.');
  }

  if (msgElement) {
    msgElement.textContent = decodeURIComponent(errorDescription);
  } else {
    console.error('Element with ID "msg" not found.');
  }

  if (reloadButton) {
    reloadButton.addEventListener("click", () => {
      window.close(); // 現在のウィンドウを閉じる
    });
  } else {
    console.error('Element with ID "reload" not found.');
  }
});
