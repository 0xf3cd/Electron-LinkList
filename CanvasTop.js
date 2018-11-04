const ipcRenderer = require('electron').ipcRenderer;
const LinkListGraph = require('./Graph.js');
const CLL = require('./CircularLinkList.js');
const DLL = require('./DualLinkList.js');
const SLL = require('./SingleLinkList.js');
const dialog = require('art-dialog');
const MyTools = require('./MyTools.js');

let nowMode = 'single'; // 当前链表类型，默认为单链表
let linklist = null; // 记录链表对象
let graph = null; // 记录画布对象

// 为主面板上的设置按钮绑定点击事件
const settingButton = document.getElementById('setting');
settingButton.addEventListener('click', (event) => {
	ipcRenderer.send('setting-open');
});

/** getLinkList 函数: 根据 nowNode 的取值，返回一个链表对象
 */
const getLinkList = function() {
	switch(nowMode) {
		case('single'): {
			return new SLL();
			break;
		}
		case('dual'): {
			return new DLL();
			break;
		}
		case('circular'): {
			return new CLL();
			break;
		}
	}
};

/** getGraph 函数: 返回一个已经进行了初始化的画布对象
 */
const getGraph = function() {
	let g = new LinkListGraph();
	g.createCanvas();
	g.setLinkListType(nowMode);
	return g;
};

/** bindEvents 函数: 为画布上的点绑定鼠标移入移出事件
 */
const bindEvents = function() {
	function animateButton(ob, op) {
	  ob.setAttribute('fill-opacity', op);
	  ob.setAttribute('stroke-opacity', op);
	}
	const enterButton = function(e) { 
		animateButton(e.target, 0.4);
	};
	const leaveButton = function(e) { 
		animateButton(e.target, 1) ;
	};

	graph.bindNodeWithFunction('mouseenter', enterButton);
	graph.bindNodeWithFunction('mouseleave', leaveButton);
};

/** setColors 函数: 为画布上的各个对象设定颜色
 */
const COLOR_KINDS = 5;
const NODE_COLOR = [
	'#F27A7B',
	'#FDD244',
	'#E2B3FD',
	'#4091E1',
	'#9CFDE2',
];
const TEXT_COLOR = [
	'#AE1955',
	'#225BC3',
	'#6C2FB9',
	'#FD9BD0',
	'#417DA1',
];

const setColors = function() {
	const nodesCount = graph.getNodesCount();
	if(nowMode === 'circular') {
		for(let i = 0; i < nodesCount; i++) {
			graph.setNodeShapeColor(i + 1, NODE_COLOR[i % COLOR_KINDS]);
			graph.setNodeTextColor(i + 1, TEXT_COLOR[i % COLOR_KINDS]);
			graph.setLineColor(i + 1, {
				start: TEXT_COLOR[i % COLOR_KINDS],
				startInside: '#FFFFFF',
				end: TEXT_COLOR[i % COLOR_KINDS],
				line: TEXT_COLOR[i % COLOR_KINDS]
			});
		}
	} else {
		// 调整除最后一个结点外其他节点的颜色
		for(let i = 0; i < nodesCount - 1; i++) {
			graph.setNodeShapeColor(i + 1, NODE_COLOR[i % COLOR_KINDS]);
			graph.setNodeTextColor(i + 1, TEXT_COLOR[i % COLOR_KINDS]);
			graph.setLineColor(i + 1, {
				start: TEXT_COLOR[i % COLOR_KINDS],
				startInside: '#FFFFFF',
				end: TEXT_COLOR[i % COLOR_KINDS],
				line: TEXT_COLOR[i % COLOR_KINDS]
			});
		}
		graph.setNodeShapeColor(nodesCount, NODE_COLOR[(nodesCount - 1) % COLOR_KINDS]);
		graph.setNodeTextColor(nodesCount, TEXT_COLOR[(nodesCount - 1) % COLOR_KINDS]);
		graph.setLineColor(nodesCount, {
			start: TEXT_COLOR[(nodesCount - 1) % COLOR_KINDS],
			startInside: '#FFFFFF',
			end: TEXT_COLOR[(nodesCount - 1) % COLOR_KINDS],
			line: TEXT_COLOR[(nodesCount - 1) % COLOR_KINDS]
		});
	}
};

/** initial 函数: 将画布显示的过程打包
 */
const initial = function() {
	graph.destroy();
	linklist = getLinkList();
	if(nowMode === 'single') {
		linklist.createSingleLinkList();
	} else if(nowMode === 'dual') {
		linklist.createDualLinkList();
	} else {
		linklist.createCircularLinkList();
	}
	
	graph.setLinkListType(nowMode);
	graph.drawNodesAndLines(linklist.getAllElements());
	setColors();
	graph.hideGraph();
	graph.update();
	graph.showGraphWithAnimation(() => {});
	bindEvents();
};



/*****************************************************
				以下为实现插入功能的函数
******************************************************/
let insertIndex = null; //用于记录带插入结点的位置
let insertValue = null; //用于记录带插入结点的值

/** isValidInsert 函数
 * @return {bool} 检查插入位置及插入值是否合法
 */
const isValidInsert = function() {
	const nodesCount = graph.getNodesCount();
	if(!MyTools.isInteger(insertIndex)) {
		return false;
	}
	if(insertIndex < 0 || insertIndex > nodesCount) {
		return false;
	}

	if(!MyTools.isInteger(insertValue)) {
		return false;
	}
	if(insertValue < 1 || insertValue > 100) {
		return false;
	}

	return true;
};

/**
 * addNode 函数: 增加一个结点
 * @param {int} index: 待增加结点编号
 * @param {int} value: 增加的新值
 * @return {void}
 */
const addNode = function(index, value) {
	linklist.insertElement(index, value);
	graph.hideGraphWithAnimation(() => {
		graph.destroy();
		let elements = linklist.getAllElements();
		graph.drawNodesAndLines(elements);
		setColors();
		graph.update();
		graph.showGraphWithAnimation(() => {});
		bindEvents();
	});
};

const getInsertInfo = function() {
	let index = dialog({
		title: '插入',
		content: '<p>插入在第几个结点之后？（如果想插在最开始，则输入0）</p> <input id="insert-index"/>',
		ok: () => {
			insertIndex = document.getElementById('insert-index').value;
			insertIndex = parseInt(insertIndex);
			return true;
		},
		cancel: () => {
			insertIndex = null;
			return true;
		}
	});
	index.addEventListener('close', function() {
		let value = dialog({
		title: '插入',
			content: '<p>插入结点的值（1-100之间的整数）</p> <input id="insert-index"/>',
			ok: () => {
				insertValue = document.getElementById('insert-index').value;
				insertValue = parseInt(insertValue);
				return true;
			},
			cancel: () => {
				insertValue = null;
				return true;
			}
		});
		value.addEventListener('close', () => {
			if(isValidInsert()) {
				if(graph.getNodesCount() >= graph._maxNodes) {
					let notice = dialog({
						title: 'Error',
						content: '不能再添加新的结点啦！'
					});
					notice.show();
				} else {
					addNode(insertIndex, insertValue);
				}
			} else {
				let notice = dialog({
					title: 'Error',
					content: '输入有误呀！'
				});
				notice.show();
			}
		});
		// if(insertIndex) {
		// 	value.show();
		// }
		value.show();
	});
	index.show();
};


/*****************************************************
				以下为实现搜索功能的函数
******************************************************/
let searchValue = null; //用于记录待搜索的值

/** isValidSearch 函数
 * @return {bool} 检查待查找的值是否合法
 */
const isValidSearch = function() {
	const nodesCount = graph.getNodesCount();

	if(!MyTools.isInteger(searchValue)) {
		return false;
	}
	if(searchValue < 1 || searchValue > 100) {
		return false;
	}

	return true;
};

/**
 * searchNode 函数: 查找结点
 * @param {int} value: 结点的值
 * @return {String}: 符合要求的结点index的集合
 */
const searchNode = function(value) {
	const result = linklist.findElement(value);
	if(!result) {
		return '';
	}

	if(result.length === 0) {
		return '';
	}

	let toReturn = '第' + result[0].toString() + '个结点';
	for(let i = 1; i < result.length; i++) {
		toReturn += ', 第';
		toReturn += result[i].toString();
		toReturn += '个结点';
	}

	return toReturn;
};

const getSearchInfo = function() {
	let value = dialog({
		title: '查找',
		content: '<p>请输入待查找的结点的值（1-100之间的整数）</p> <input id="search-value"/>',
		ok: () => {
			searchValue = document.getElementById('search-value').value;
			searchValue = parseInt(searchValue);
			return true;
		},
		cancel: () => {
			searchValue = null;
			return true;
		}
	});
	value.addEventListener('close', () => {
		if(isValidSearch()) {
			let toShow = searchNode(searchValue);
			if(toShow === '') {
				toShow = '没有符合要求的结点呢～';
			} else {
				toShow = '这些结点符合要求：' + toShow;
			}

			let result = dialog({
				title: 'Result',
				content: toShow
			});
			result.show();
		} else {
			let notice = dialog({
				title: 'Error',
				content: '输入有误呀！'
			});
			notice.show();
		}
	});
	value.show();
};


/*****************************************************
				以下为实现删除功能的函数
******************************************************/
let deleteIndex = null; //用于记录待删除结点的次序

/** isValidDelete 函数
 * @return {bool} 检查待删除结点的次序是否合法
 */
const isValidDelete = function() {
	const nodesCount = graph.getNodesCount();

	if(!MyTools.isInteger(deleteIndex)) {
		return false;
	}
	if(deleteIndex <= 0 || deleteIndex > nodesCount) {
		return false;
	}

	return true;
};

/**
 * deleteNode 函数: 删除某个结点
 * @param {int} index: 待删除结点的编号
 * @return {void}
 */
const deleteNode = function(index) {
	linklist.deleteElement(index);
	graph.hideGraphWithAnimation(() => {
		graph.destroy();
		let elements = linklist.getAllElements();
		graph.drawNodesAndLines(elements);
		setColors();
		graph.update();
		graph.showGraphWithAnimation(() => {});
		bindEvents();
	});
};

const getDeleteInfo = function() {
	let index = dialog({
		title: '删除',
		content: '<p>删除第几个结点？</p> <input id="delete-index"/>',
		ok: () => {
			deleteIndex = document.getElementById('delete-index').value;
			deleteIndex = parseInt(deleteIndex);
			return true;
		},
		cancel: () => {
			deleteIndex = null;
			return true;
		}
	});
	index.addEventListener('close', () => {
		if(isValidDelete()) {
			if(graph.getNodesCount() <= 0) {
				let notice = dialog({
					title: 'Error',
					content: '已经没有结点了呢～'
				});
				notice.show();
			} else {
				deleteNode(deleteIndex);
			}	
		} else {
			let notice = dialog({
				title: 'Error',
				content: '输入有误呀！'
			});
			notice.show();
		}
	});
	index.show();
};


/*****************************************************
				以下为实现修改功能的函数
******************************************************/
let modifyIndex = null; // 用于记录待修改的结点次序
let modifyValue = null; // 用于记录修改的值

/** isValidModify 函数
 * @return {bool} 检查这一次删除是否合法
 */
const isValidModify = function() {
	const nodesCount = graph.getNodesCount();

	if(!MyTools.isInteger(modifyIndex)) {
		return false;
	}
	if(modifyIndex <= 0 || modifyIndex > nodesCount) {
		return false;
	}

	if(!MyTools.isInteger(modifyValue)) {
		return false;
	}
	if(modifyValue < 1 || modifyValue > 100) {
		return false;
	}

	return true;
};

/**
 * modifyNode 函数: 修改某个结点的值
 * @param {int} index: 待修改结点的编号
 * @param {int} newValue
 * @return {void}
 */
const modifyNode = function(index, newValue) {
	linklist.setElementValue(index, newValue);
	graph.hideGraphWithAnimation(() => {
		graph.destroy();
		let elements = linklist.getAllElements();
		graph.drawNodesAndLines(elements);
		setColors();
		graph.update();
		graph.showGraphWithAnimation(() => {});
		bindEvents();
	});
};

const getModifyInfo = function() {
	let index = dialog({
		title: '修改',
		content: '<p>修改第几个结点的值？</p> <input id="modify-index"/>',
		ok: () => {
			modifyIndex = document.getElementById('modify-index').value;
			modifyIndex = parseInt(modifyIndex);
			return true;
		},
		cancel: () => {
			modifyIndex = null;
			return true;
		}
	});
	index.addEventListener('close', function() {
		let value = dialog({
		title: '修改',
			content: '<p>将结点的值修改为（1-100之间的整数）</p> <input id="modify-value"/>',
			ok: () => {
				modifyValue = document.getElementById('modify-value').value;
				modifyValue = parseInt(modifyValue);
				return true;
			},
			cancel: () => {
				modifyValue = null;
				return true;
			}
		});
		value.addEventListener('close', () => {
			if(isValidModify()) {
				modifyNode(modifyIndex, modifyValue);
			} else {
				let notice = dialog({
					title: 'Error',
					content: '输入有误呀！'
				});
				notice.show();
			}
		});
		value.show();
	});
	index.show();
};

graph = getGraph();
initial();

ipcRenderer.on('linklist-type-change', (event, arg) => {
	nowMode = arg;
	initial();
});

ipcRenderer.on('search-button-click', (event) => {
	searchValue = null;
	getSearchInfo();
});


ipcRenderer.on('add-button-click', (event) => {
	insertIndex = null;
	insertValue = null;
	getInsertInfo();
});

ipcRenderer.on('delete-button-click', (event) => {
	deleteIndex = null;
	getDeleteInfo();
});

ipcRenderer.on('modify-button-click', (event) => {
	modifyIndex = null;
	modifyValue = null;
	getModifyInfo();
});