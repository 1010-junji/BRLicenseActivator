// c:\Users\oishi\Documents\sampleTool\license-window\prompt.js
document.addEventListener("DOMContentLoaded", () => {
  const { ipcRenderer } = require("electron");

  const input = document.getElementById("urlInput");
  const btnOpen = document.getElementById("open");
  const btnCancel = document.getElementById("cancel");

  // URL形式チェック
  function isValidURL(str) {
    try {
      // Ensure the input is not empty before trying to construct a URL
      if (!str || str.trim() === "") {
        return false;
      }
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  // 入力に応じて「開く」ボタンの有効/無効を切り替え
  function toggleOpenButtonState() {
    if (!input || !btnOpen) return; // 要素がない場合は何もしない
    const urlValue = input.value.trim();
    btnOpen.disabled = !(urlValue !== "" && isValidURL(urlValue));
  }

  // Event listeners
  if (input) {
    input.addEventListener("input", toggleOpenButtonState);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && btnOpen && !btnOpen.disabled) {
        btnOpen.click(); // clickイベントを発火させることで処理をまとめる
      }
    });
    // 初期フォーカスと選択
    input.focus();
    input.select();
  } else {
    console.error("URL input field (urlInput) not found.");
  }

  if (btnOpen) {
    btnOpen.addEventListener("click", () => {
      const urlValue = input.value.trim();
      // 送信する直前にも最終チェックを行うとより安全
      if (urlValue && isValidURL(urlValue)) {
        ipcRenderer.send("url-submitted", urlValue);
      }
    });
  } else {
    console.error("Open button (open) not found.");
  }

  if (btnCancel) {
    btnCancel.addEventListener("click", () => {
      ipcRenderer.send("url-cancelled");
    });
  } else {
    console.error("Cancel button (cancel) not found.");
  }

  // 初期状態チェック
  toggleOpenButtonState();
});
