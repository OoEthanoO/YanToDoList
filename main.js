const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
const todoFilePath = path.join(app.getPath("userData"), "todos.json");

function ensureTodoFileExists() {
  if (!fs.existsSync(todoFilePath)) {
    fs.writeFileSync(todoFilePath, JSON.stringify([]));
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // mainWindow.webContents.openDevTools();
  mainWindow.loadFile("index.html");
  mainWindow.on("closed", () => (mainWindow = null));
}

app.whenReady().then(() => {
  ensureTodoFileExists();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("get-todos", async () => {
  const data = fs.readFileSync(todoFilePath, "utf-8");
  return JSON.parse(data);
});

ipcMain.handle("save-todos", async (event, todos) => {
  fs.writeFileSync(todoFilePath, JSON.stringify(todos, null, 2));
  return { success: true };
});
