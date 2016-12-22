const electron = require('electron');
const {BrowserWindow, app} = electron;

let mainWindow = null;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600
	});
	mainWindow.loadURL(`file://${__dirname}/dst/index.html`);
	mainWindow.webContents.openDevTools();
	mainWindow.on('closed', () => mainWindow = null);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') { app.quit(); }
});

app.on('activate', () => {
	if (mainWindow === null) { createWindow(); }
});