const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        open_source_dialog: (channel, data) => {
            ipcRenderer.send('open-source-dialog')
        },
        open_target_dialog: (channel) => {
            ipcRenderer.send('open-target-dialog')
        },
        save_target_dir: (channel, save_target_dir_func) => {
            ipcRenderer.on('open-target-dialog-reply', (event, selected_dir) => {
                save_target_dir_func(selected_dir)
            })
        },
        save_source_dir: (channel, func, func2) => {
            ipcRenderer.on('open-source-dialog-reply', (event, arg, arg2) => {
                func(arg)
                func2(arg2)
                if (arg2 !== undefined && arg2 !== null && arg2.length > 0){
                    ipcRenderer.send('get-base64-img',arg + '/' + arg2[0])
                }
            })
        },
        move_file: (channel, src, dest) => {
            ipcRenderer.send('move-file', src, dest)
        },
        get_base64_img: (channel, path) => {
            ipcRenderer.send('get-base64-img', path)
        },
        set_base64_img: (channel, func) => {
            ipcRenderer.on('get-base64-img-reply', (event, arg) => {
                func(arg)
            })
        },
        
        set_current_file_path: (channel, file_path) => {
            ipcRenderer.send('set-current-file-path', file_path);
        },
        remove_target_dir: (channel, target_dir) => {
            ipcRenderer.send('remove-target-dir', target_dir);
        },
        trigger_shortcut: (channel, shortcut_num) => {
            ipcRenderer.send('trigger-shortcut', shortcut_num);
        },
        trigger_shortcut_reply: (channel, func) => {
            ipcRenderer.on('trigger-shortcut-reply', (event) => {
                func()
            })
        },
        get_trash_location:(channel) => {
            ipcRenderer.send('get-trash-location')
        },
        get_trash_location_reply: (channel, set_trash_func) => {
            ipcRenderer.on('get-trash-location-reply', (event, path) => {
                set_trash_func(path)
            })
            ipcRenderer.send('get-trash-location')
        }
    
    }
);