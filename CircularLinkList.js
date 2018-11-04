//循环链表

/*****************************************************
					默认常量及工具函数
******************************************************/
const CIRCULAR_LINKLIST_LENGTH = 10;
const MyTools = require('./MyTools.js');



/*****************************************************
						结点类
******************************************************/
/**
 * 结点类，表示链表中某一个结点
 * 不在这个类的方法中进行输入正确性判断, 在 CircularLinkList 类中进行判断
 * @class
 */
class Node {
	/**
	 * 构造函数
	 * @param {int} value: 结点的值
	 * @return {Node}: 返回的结点对象
	 */
	constructor(value) {
		/**
		 * 结点的值
		 * @type {int}
		 * @private
		 */
		this._value = value;

		/**
		 * 相当于是 next 指针，指向下一个结点
		 * 为 null 则代表不存在下一个结点
		 * @type {Node}
		 * @private
		 */
		this._next = null;
	}
}

/**
 * getValue 方法: 返回结点储存的 value
 * @public
 * @return {int}
 */
Node.prototype.getValue = function() {
	return this._value;
};

/**
 * setValue 方法: 设定当前结点的 value
 * @public
 * @param {int} newValue
 * @return {void}
 */
Node.prototype.setValue = function(newValue) {
	this._value = newValue;
};

/**
 * getNext 方法: 返回当前结点下一个结点的指针
 * @public
 * @return {Node}
 */
Node.prototype.getNext = function() {
	return this._next;
};

/**
 * setNext 方法: 设定当前结点所指向的下一个结点
 * @public
 * @param {Node} newNext
 * @return {void}
 */
Node.prototype.setNext = function(newNext) {
	this._next = newNext;
};



/*****************************************************
						循环链表类
******************************************************/
/**
 * 单链表类
 * 在这个类的方法中, 进行输入的类型和正确性检查
 * @class
 */
class CircularLinkList {
	/**
	 * 构造函数
	 * @param {int} value: 头结点的值
	 * @return {CircularLinkList}: 返回的链表对象
	 */
	constructor(value) {
		const headValue = value || 'head';

		/**
		 * 头结点
		 * @type {int}
		 * @private
		 */
		this._head = new Node(headValue);
		this._head.setNext(this._head);

		/**
		 * 链表长度
		 * @type {int}
		 * @private
		 */
		this._length = 0;
	}
}

/**
 * createCircularLinkList 方法: 创建一个链表
 * @public
 * @param {int=} length: 可选参数, 链表的长度, 默认为 CIRCULAR_LINKLIST_LENGTH
 * @param {bool=} random: 可选参数, 是否随机生成, 为 true 表示随机生成, 默认为 true
 * @param {array=} values: 可选参数, 若不随机生成, 则需要以数组形式输入各结点的值
 * @return {void}
 */
CircularLinkList.prototype.createCircularLinkList = function(length, random, values) {
	if(this._length !== 0) {
		return;//如果链表非空, 则不需要创建链表
	}

	if(MyTools.isInteger(length) !== true) {
		length = CIRCULAR_LINKLIST_LENGTH;//如果参数 length 不为整数, 则重置为默认值
	}
	this._length = length;

	if(MyTools.isArray(values) !== true) {
		values = [];//如果values不为数组, 则此时将其置为数组, 保证之后的代码正常运行
	}

	let lastNode = this._head;
	if(random === true) {
		for(let i = 0; i < length; i++) {
			newNode = new Node(MyTools.getRandomInt());
			lastNode.setNext(newNode);
			lastNode = newNode;
		}
	} else {
		const arrayLength = values.length;
		for(let i = 0; i < arrayLength && i < length; i++) {
			newNode = new Node(values[i]);
			lastNode.setNext(newNode);
			lastNode = newNode;
		}

		for(let i = 0; i < length - arrayLength; i++) {
			newNode = new Node(MyTools.getRandomInt());
			lastNode.setNext(newNode);
			lastNode = newNode;
		}
	}
	lastNode.setNext(this._head);	
};

/**
 * insertElement 方法: 向链表中插入一个新结点
 * @public
 * @param {int} value: 新结点的值
 * @param {int=} index: 可选参数, 插入在原有第 index 结点之后, 默认为插入在最后一个结点之后, index 为 0 表示将新结点作为首元结点
 * @return {void}
 */
CircularLinkList.prototype.insertElement = function(index, value) {
	if(MyTools.isInteger(index) !== true) {
		index = this._length;
	}
	index = (index > this._length || index < 0)? this._length: index;//保证 index 小于等于链表中元素个数且大于等于 0

	if(MyTools.isInteger(value) !== true) {
		value = MyTools.getRandomInt();//确认 value 的类型
	}

	let selectedNode = this._head;
	for(let i = 0; i < index; i++) {
		selectedNode = selectedNode.getNext();
	}

	let newNode = new Node(value);
	newNode.setNext(selectedNode.getNext()); 
	selectedNode.setNext(newNode);

	this._length++;
};

/**
 * deleteElement 方法: 删除链表中的一个结点
 * @public
 * @param {int} index: 删除第 index 个结点
 * @return {void}
 */
CircularLinkList.prototype.deleteElement = function(index) {
	if(MyTools.isInteger(index) !== true) {
		return;//如果 index 为非整数则结束
	}

	if(this._length === 0 || index > this._length || index <= 0) {
		//如果链表为空或是 index 指向不存在的结点, 则结束运行
		return;
	}

	let current = this._head;
	let next = current.getNext();
	for(let i = 0; i < index - 1; i++) {
		current = next;
		next = current.getNext();
	}

	current.setNext(next.getNext());
	next = null;
	this._length--;
};

/**
 * findElement 方法: 查找链表中储存某个值的所有结点
 * @public
 * @param {int} value: 目标结点的值
 * @return {array}: 符合要求的所有结点的 index 值, 为空则说明不存在待查找结点
 */
CircularLinkList.prototype.findElement = function(value) {
	if(MyTools.isInteger(value) !== true) {
		return;//value 不为整数则结束
	}

	let index = 1;
	let result = new Array();
	let current = this._head.getNext();

	while(current !== this._head) { //注意循环连表末尾结点的 next 为头结点
		if(current.getValue() === value) {
			result.push(index);
		}
		index++;
		current = current.getNext();
	}

	return result;
};

/**
 * getElementValue 方法: 得到链表中某结点的值
 * @public
 * @param {int} index: 目标结点的 index 值
 * @return {int}: 该结点的值
 */
CircularLinkList.prototype.getElementValue = function(index) {
	if(MyTools.isInteger(index) !== true) {
		return;//如果 index 为非整数则结束
	}

	if(this._length === 0 || index > this._length || index <= 0) {
		//如果链表为空或是 index 指向不存在的结点, 则结束运行
		return;
	}

	let current = this._head;
	for(let i = 0; i < index; i++) {
		current = current.getNext();
	}

	return current.getValue();
};

/**
 * setElementValue 方法: 修改链表中某结点的值
 * @public
 * @param {int} value: 结点的新值
 * @param {int} index: 目标结点的 index 值
 * @return {void}
 */
CircularLinkList.prototype.setElementValue = function(index, value) {
	if(MyTools.isInteger(index) !== true) {
		return;//如果 index 为非整数则结束
	}

	if(this._length === 0 || index > this._length || index <= 0) {
		//如果链表为空或是 index 指向不存在的结点, 则结束运行
		return;
	}

	let current = this._head;
	for(let i = 0; i < index; i++) {
		current = current.getNext();
	}

	current.setValue(value);
};

/**
 * destroyCircularLinkList 方法: 销毁链表
 * @public
 * @return {void}
 */
CircularLinkList.prototype.destroyCircularLinkList = function() {
	if(this._length === 0) {
		return;//为空则不需要退出
	}

	let current = this._head;
	let next = current.getNext();

	while(current !== null) {
		current.setNext(null);
		current = next;
		if(next !== this._head) {
			next = current.getNext();
		}
	}

	this._length = 0;
};

/**
 * showAllElementsInConsole 方法: 在控制台中输出所有结点的值
 * @public
 * @return {void}
 */
CircularLinkList.prototype.showAllElementsInConsole = function() {
	let current = this._head.getNext();
	while(current !== this._head) {
		console.log(current.getValue());
		//console.log(current);
		current = current.getNext();
	}
};

/**
 * getAllElements 方法: 得到储存所有结点值的数组
 * @public
 * @return {array}: 依次储存所有结点的值
 */
CircularLinkList.prototype.getAllElements = function() {
	let current = this._head.getNext();

	let allElements = new Array();
	while(current !== this._head) {
		allElements.push(current.getValue());
		current = current.getNext();
	}

	return allElements;
};

/**
 * getLength 方法: 得到结点个数
 * @public
 * @return {int}: 结点数
 */
CircularLinkList.prototype.getLength = function() {
	return this._length;
};

module.exports = CircularLinkList;