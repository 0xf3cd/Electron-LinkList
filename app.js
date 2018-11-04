const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const dialog = electron.dialog;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;
let controlWindow = null;

let isRegularClose = true;

const createMainWindow = function() {
	mainWindow = new BrowserWindow({
		width: 1000,//1200,
		height: 700,
		resizable: false,
		//maximizable: false,
		fullscreen: false,
		useContentSize: true,
		titleBarStyle: 'hiddenInset',
		backgroundColor: '#292B31'
	});

	//加载应用的界面文件
	mainWindow.loadURL(`file://${__dirname}/canvas.html`);
	//console.log(`file://${__dirname}/index.html`);

	//打开开发者工具，方便调试
	//mainWindow.webContents.openDevTools();

	mainWindow.on('close', (event) => {
		isRegularClose = false;
		app.exit();
	});

	mainWindow.on('closed', function(event) {
		//event.preventDefault()
		mainWindow = null;
		// app.exit();
		//controlWindow = null;
	});

	// mainWindow.on('close', function(event) {
	// 	mainWindow = null;
	// });

	//mainWindow.setSize(800, 800);
};

const createControlWindow = function() {
	controlWindow = new BrowserWindow({
		width: 350, 
		height: 220, 
		titleBarStyle: 'hiddenInset',
		//minimizable: false,
		//maximizable: false,
		resizable: false,
		fullscreenable: false,
		alwaysOnTop: true,
		useContentSize: true,
		backgroundColor: '#494B51',
		show: false
	});

	

	//加载应用的界面文件
	controlWindow.loadURL(`file://${__dirname}/control.html`);
	//console.log(`file://${__dirname}/index.html`);

	//打开开发者工具，方便调试
	//controlWindow.webContents.openDevTools();

	controlWindow.on('closed', function(event) {
		if(isRegularClose) {
			event.preventDefault();
		}
	});

	controlWindow.on('close', function(event) {
		event.preventDefault();
		isRegularClose = true;
		controlWindow.hide();
	});
};

const createWindow = function() {
	createMainWindow();
	createControlWindow();
};

app.on('ready', createWindow);

app.on('window-all-closed', function() {
	// if (process.platform !== 'darwin') {
	// 	app.quit();
	// }
	isRegularClose = false;
	app.exit();
});

app.on('activate', function() {
	if (mainWindow === null) {
		createWindow();
	}
});

// app.on('will-quit', (event) => {
// 	isRegularClose = false;
// });

//app.on('before-quit', () => app.quitting = true);

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const waitTime = 500;
// 控制面板的链表种类更改
ipcMain.on('linklist-type-change', (event, arg) => {
	setTimeout(() => {
		controlWindow.hide();
	}, waitTime); 
	console.log('change to ' + arg);
	mainWindow.webContents.send('linklist-type-change', arg);
});

// 控制面板的查找按钮按下
ipcMain.on('search-button-click', (event) => {
	setTimeout(() => {
		controlWindow.hide();
	}, waitTime); 
	console.log('search button clicked.');
	mainWindow.webContents.send('search-button-click');
});

ipcMain.on('add-button-click', (event) => {
	setTimeout(() => {
		controlWindow.hide();
	}, waitTime); 
	console.log('add button clicked.');
	mainWindow.webContents.send('add-button-click');
});

ipcMain.on('delete-button-click', (event) => {
	setTimeout(() => {
		controlWindow.hide();
	}, waitTime); 
	console.log('delete button clicked.');
	mainWindow.webContents.send('delete-button-click');
});

ipcMain.on('modify-button-click', (event) => {
	setTimeout(() => {
		controlWindow.hide();
	}, waitTime); 
	console.log('modify button clicked.');
	mainWindow.webContents.send('modify-button-click');
});

// 主面板设置界面打开按钮
ipcMain.on('setting-open', (event) => {
	controlWindow.show();
});