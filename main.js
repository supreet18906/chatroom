const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('./src/database');
const Auth = require('./src/auth');
const Rooms = require('./src/rooms');
const Messages = require('./src/messages');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  db = new Database();
  const auth = new Auth(db);
  const rooms = new Rooms(db);
  const messages = new Messages(db);

  createWindow();

  // Set up IPC listeners
  ipcMain.handle('register', (event, username, password) => auth.register(username, password));
  ipcMain.handle('login', (event, username, password) => auth.login(username, password));
  ipcMain.handle('create-room', (event, roomName, userId) => rooms.createRoom(roomName, userId));
  ipcMain.handle('join-room', (event, roomId, userId) => rooms.joinRoom(roomId, userId));
  ipcMain.handle('send-message', (event, roomId, userId, content) => messages.sendMessage(roomId, userId, content));
  ipcMain.handle('get-messages', (event, roomId) => messages.getMessages(roomId));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
