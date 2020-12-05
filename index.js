// events does't work in edge-js so we use electron-edge-js with electron
const edge = require('electron-edge-js')
const config = require('./config.json')
var axios = require('axios')
const {
    app,
    globalShortcut
} = require('electron')

let last_title
let spotify_window
let play = true

const ignoreTitle = ['Spotify', 'Spotify Free', 'Advertisement']

// send message api
function send_message(msg) {
    const url = `https://discord.com/api/v8/channels/${config.text_channel}/messages`
    axios({ method: 'POST', url: url, data: { content: msg }, headers: { 'authorization': config.token } })
}

// get spotify window and a events for title change
const taskbar = edge.func({
    assemblyFile: "taskbar\\Taskbar.dll",
    typeName: 'Taskbar.Main',
    methodName: 'init'
})
taskbar(windows => {
    if (spotify_window && windows[1] == spotify_window.handle && last_title !== windows[2] && !ignoreTitle.includes(windows[2])) {
        last_title = windows[2]
        console.log(last_title)
        send_message(config.skip)
        send_message(config.play_music + last_title)
    } else {
        windows.forEach(window => {
            if (window.path.includes("Spotify.exe")) {
                spotify_window = window
            }
        })
    }
})

// play, pause event
app.whenReady().then(() => {
    globalShortcut.register('f2', () => {
        if (play) {
            send_message(config.pause)
            console.log('pause')
            play = false
        } else {
            send_message(config.resume)
            console.log('resume')
            play = true
        }
    })
})