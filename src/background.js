'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog, Menu, MenuItem } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const path = require("path");
const fs = require("fs");

// global state
let current_file_path = '';
let target_dirs = [];
let files_in_source = [];

const isDevelopment = process.env.NODE_ENV !== 'production'

let win;
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
    win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,//process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: true,//!process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// access fs here
ipcMain.on("async-message", (event, arg) => {
  console.log('happens in another process')
  const res = fs.readdirSync('/Users/EyreCraggs/Documents/Coding/electron-test-folder')
  const data = res[0];
  event.reply('async-reply', data)
});
ipcMain.on("open-target-dialog", async (event) => {
  const res = await dialog.showOpenDialog( { properties: ['openDirectory']})
  if (res.cancelled){
    return
  }
  const selectedDir = res.filePaths[0];
  target_dirs.push(selectedDir);
  
  // addShortcut(selectedDir, move_file_callback)
  event.reply('open-target-dialog-reply', selectedDir)
})
ipcMain.on("open-source-dialog", async (event) => {
  const res = await dialog.showOpenDialog( { properties: ['openDirectory']})
  if (res.canceled){
    return
  }
  const selectedDir = res.filePaths[0];
  // get files in dir
  const all_files = fs.readdirSync(selectedDir);
  const filtered_files = all_files.filter(file => 
                                             path.extname(file).toLowerCase() === '.png'
                                          || path.extname(file).toLowerCase() === '.jpg')
  files_in_source = filtered_files;
  if (files_in_source.length > 0){
    current_file_path = `${selectedDir}/${files_in_source[0]}`
  }
  event.reply('open-source-dialog-reply', selectedDir, filtered_files)
})
ipcMain.on('move-file', (event, src, dest) => {
  fs.rename(src, dest, ()=> {})
  // event.reply('move-file-reply');
})
ipcMain.on('get-base64-img', async (event, path) => {
  const base64_img = fs.readFileSync(path, {encoding: 'base64'});
  event.reply('get-base64-img-reply', base64_img)
})

ipcMain.on('set-current-file-path', (event, file_path) => {
  console.log('was ' + current_file_path)
  current_file_path = file_path
})

ipcMain.on('remove-target-dir', (event, target_dir) => {
  target_dirs = target_dirs.filter(x => x !== target_dir);
})

ipcMain.on('trigger-shortcut', (event, shortcut) => {
  const shortcut_int = parseInt(shortcut);
  if (target_dirs.length < shortcut_int){
    return
  }
  if (current_file_path === ''){
    return
  }
  const idx = shortcut_int - 1;
  const target_dir = target_dirs[idx];
  const current_file_parts = current_file_path.split('/');
  const last_idx = current_file_parts.length - 1;
  const file_name = current_file_parts[last_idx];
  const dest_file = `${target_dir}/${file_name}`
  fs.rename(current_file_path, dest_file, () => {})
  console.log('triggerin shortcut')
  event.reply('trigger-shortcut-reply', current_file_path)
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
