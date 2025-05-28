// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");

let mainWin, promptWin;

function createMainWindow(targetURL) {
  mainWin = new BrowserWindow({
    width: 1024,
    height: 768,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mainWin.removeMenu();
  mainWin.loadURL(targetURL);

  mainWin.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      if (isMainFrame && !validatedURL.endsWith("error.html")) {
        const errorPage = url.format({
          // エラーページのパスを更新
          pathname: path.join(__dirname, "renderer", "error", "error.html"),
          protocol: "file:",
          slashes: true,
          query: {
            errorCode,
            errorDescription,
          },
        });
        mainWin.loadURL(errorPage);
      }
    }
  );

  mainWin.on("closed", () => {
    mainWin = null;
  });
}

function showPrompt() {
  promptWin = new BrowserWindow({
    width: 520,
    height: 190,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  promptWin.removeMenu();
  promptWin.loadFile(path.join(__dirname, "renderer", "prompt", "prompt.html")); // プロンプトページのパスを更新
}

// 起動完了後にプロンプトを表示
app.whenReady().then(showPrompt);

// プロンプトからの入力を受け取る
ipcMain.on("url-submitted", (event, url) => {
  if (promptWin) promptWin.close();
  createMainWindow(url);
});
ipcMain.on("url-cancelled", () => {
  if (promptWin) promptWin.close();
  app.quit();
});

// 全てのウィンドウが閉じられた時にアプリケーションを終了します。
app.on("window-all-closed", () => {
  // Windowsでは、全てのウィンドウを閉じたらアプリケーションを終了するのが一般的です。
  app.quit();
});
