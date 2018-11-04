//链表图形化类

/*****************************************************
				全局变量, 默认常量及工具函数
******************************************************/
const Two = require('two.js');
const MyTools = require('./MyTools.js');

const NODE_DEFAULT_VALUE = 0;
const NODE_DEFAULT_SHAPE_COLOR = '#FFE317';
const NODE_DEFAULT_TEXT_COLOR = '#023BA6';
const NODE_DEFAULT_CENTER = {
	x: 100,
	y: 100 
};
const NODE_DEFAULT_SHAPE = 'circle';
const NODE_DEFAULT_SIZE = {
	length: 80,
	width: 30,
	radius: 15
};

const LINE_DEFAULT_STARTPOINT = {
	x: 200,
	y: 100
};
const LINE_DEFAULT_ENDPOINT = {
	x: 400,
	y: 100
};
const LINE_DEFAULT_TYPE = {
	direction: 'single',
	curve: false
};
const LINE_DEFAULT_SIZE = {
	linewidth: 3,
	start: {
		radius: 7,
		linewidth: 2
	},
	end: {
		width: 14,
		height: 12
	}
};
const LINE_DEFAULT_COLOR = {
	line: '#4143CC',//'#FDDC42',
	start: '#FD8189',
	end: '#92CD33',
	startInside: '#FFFFFF'
};
const CURVE_DEFAULT_RATIO = {
	directRatio: 0.2,
	curveHeightRatio: 0.1,
	curveDepthRatio: 0.5
};
const LINE_DEFAULT_DIRECTION = {
	startFaceRight: true,
	endFaceRight: true
};

const DEFAULT_MAX_NODES_PERROW = 5;
const DEFAULT_MAX_NODES = 25;
const DEFAULT_ROW_SPACING = 60;
const DEFAULT_NODE_SPACING = 70;
const DEFAULT_MARGIN = {
	width: 110,
	height: 150
};


const DEFAULT_CANVAS_WIDTH = 1000;
const DEFAULT_CANVAS_HEIGHT = 700;
const DEFAULT_CANVAS_SIZE = {
	width: DEFAULT_CANVAS_WIDTH,
	height: DEFAULT_CANVAS_HEIGHT
};

const TEXT_OFFSET = 1; // 文本偏移量



/*****************************************************
						结点图形类
******************************************************/
/**
 * 结点图形类，表示某一个结点的图形

 * 在这个类的方法中进行输入正确性判断, 如果在 set 方法中传入变量类型等错误, 则自动赋值为默认值
 * @class
 */
class NodeGraph {
	/**
	 * 构造函数
	 * @param {int} value: 结点的值, 默认为0
	 * @param {string} shapeColor: 结点的形状颜色属性, 用 RGB 表示, 默认为 '#FFE317'
	 * @param {string} textColor: 结点的文字颜色属性, 用 RGB 表示, 默认为 '#30334A'
	 * @param {{x: xValue, y: yValue}} center: 结点的中心位置, 默认为 (100, 100)
	 * @param {{length: l, width: w, radius:r}}: 结点形状的大小, l for length; w for width;r for 圆角半径
	 * @return {NodeGraph}: 返回结点图形对象
	 */
	constructor(value, shapeColor, textColor, center, size) {
		/**
		 * 结点应当显示的值
		 * @type {int}
		 * @private
		 */
		this._value = null;
		this.setValue(value); 

		/**
		 * 结点形状应当显示的颜色 RGB 属性
		 * @type {string}
		 * @private
		 */
		this._shapeColor = null;
		this.setShapeColor(shapeColor);

		/**
		 * 结点文本应当显示的颜色 RGB 属性
		 * @type {string}
		 * @private
		 */
		this._textColor = null;
		this.setTextColor(textColor);

		/**
		 * 结点显示的中心坐标
		 * @type {{x: x, y: y}}
		 * @private
		 */
		this._center = null;
		this.setCenter(center);

		/**
		 * 结点的大小
		 * @type {double}
		 * @private
		 */
		this._size = null;
		this.setSize(size);

		/**
		 * 画布上的结点图形对象
		 * @type {Object}
		 * @private
		 */
		this._node = null;

		/**
		 * 画布上的结点值对象
		 * @type {Object}
		 * @private
		 */
		this._text = null;

		/**
		 * 结点的编号
		 * @type {Object}
		 * @private
		 */
		//this._number = null;
	}
}

NodeGraph.prototype.getValue = function() {
	return this._value;
};

NodeGraph.prototype.setValue = function(newValue) {
	if(!newValue) {
		this._value = MyTools.deepCopy(NODE_DEFAULT_VALUE);
		return;
	}
	if(!MyTools.isInteger(newValue)) {
		this._value = MyTools.deepCopy(NODE_DEFAULT_VALUE);
		return;
	}

	this._value = MyTools.deepCopy(newValue);
	if(this._text) {
		this._text.value = this._value;
	}
};

/**
 * getShapeColor 方法: 返回结点图形的 color
 * @public
 * @return {string}: RGB 值
 */
NodeGraph.prototype.getShapeColor = function() {
	return this._shapeColor;
};

/**
 * setShapeColor 方法: 设定当前结点图形的 color
 * @public
 * @param {string} newColor: 新的 RGB 值
 * @return {void}
 */
NodeGraph.prototype.setShapeColor = function(newShapeColor) {
	if(!newShapeColor) {
		this._shapeColor = MyTools.deepCopy(NODE_DEFAULT_SHAPE_COLOR);
		return;
	}
	if(!MyTools.isRGB(newShapeColor)) {
		this._shapeColor = MyTools.deepCopy(NODE_DEFAULT_SHAPE_COLOR);
		return;
	}

	this._shapeColor = MyTools.deepCopy(newShapeColor);
	if(this._node) {
		this._node.fill = this._shapeColor;
	}
};

/**
 * getTextColor 方法: 返回结点文本的 color
 * @public
 * @return {string}: RGB 值
 */
NodeGraph.prototype.getTextColor = function() {
	return this._textColor;
};

/**
 * setTextColor 方法: 设定当前结点文本的 color
 * @public
 * @param {string} newColor: 新的 RGB 值
 * @return {void}
 */
NodeGraph.prototype.setTextColor = function(newTextColor) {
	if(!newTextColor) {
		this._textColor = MyTools.deepCopy(NODE_DEFAULT_TEXT_COLOR);
		return;
	}
	if(!MyTools.isRGB(newTextColor)) {
		this._textColor = MyTools.deepCopy(NODE_DEFAULT_TEXT_COLOR);
		return;
	}

	this._textColor = MyTools.deepCopy(newTextColor);
	if(this._text) {
		this._text.fill = this._textColor;
	}
};

/**
 * getCenter 方法: 返回结点图形的中心位置
 * @public
 * @return {{x: xValue, y: yValue}}}
 */
NodeGraph.prototype.getCenter = function() {
	return this._center;
};

/**
 * setCenter 方法: 设定当前结点图形的中心位置
 * @public
 * @param {{x: newX, y: newY}} newPosition: 新的位置
 * @return {void}
 */
NodeGraph.prototype.setCenter = function(newCenter) {
	if(!newCenter || !newCenter.hasOwnProperty('x') || !newCenter.hasOwnProperty('y')) {
		this._center = MyTools.deepCopy(NODE_DEFAULT_CENTER);
	} else {
		if(!MyTools.isInteger(newCenter.x) || !MyTools.isInteger(newCenter.y)) {
			this._center = MyTools.deepCopy(NODE_DEFAULT_CENTER);
		} else {
			this._center = MyTools.deepCopy(newCenter);
		}
	}
};

NodeGraph.prototype.getSize = function() {
	return this._size;
};

NodeGraph.prototype.setSize = function(newSize) {
	if(!newSize || !newSize.hasOwnProperty('length') || !newSize.hasOwnProperty('width') || !newSize.hasOwnProperty('radius')) {
		this._size = MyTools.deepCopy(NODE_DEFAULT_SIZE);
	} else {
		if(!MyTools.isInteger(newSize.length) || !MyTools.isInteger(newSize.width) || !MyTools.isInteger(newSize.radius)) {
			this._size = MyTools.deepCopy(NODE_DEFAULT_SIZE);
		} else {
			newSize = MyTools.deepCopy(newSize);
			if(newSize.width < newSize.radius) {
				newSize.width = 2 * newSize.radius;
			}
			this._size = newSize;
		}
	}
};

/**
 * createGraph 方法: 在画布上创建图形对象
 * @public
 * @param {Object} canvas: two.js 的实例化对象, 为一个画布
 * @return {void}
 */
NodeGraph.prototype.createGraph = function(canvas) {
	//创建结点图形对象
	this._node = canvas.makeRoundedRectangle(this._center.x, this._center.y, this._size.length, this._size.width, this._size.radius);
	this._node.fill = this._shapeColor;
	this._node.noStroke(); //设定不存在描边

	//创建图形上现实的文字对象
	this._text = new Two.Text(this._value, this._center.x, this._center.y + TEXT_OFFSET, 'normal');
	this._text.fill = this._textColor;
	canvas.add(this._text);
};

/**
 * showGraph 方法: 显示出画布上的结点图形
 * @public
 * @return {void}
 */
NodeGraph.prototype.showGraph = function() {
	if(this._node !== null) {
		this._node.opacity = 1;
		this._text.opacity = 1;
	}
};

/**
 * hideGraph 方法: 隐藏画布上的结点图形
 * @public
 * @return {void}
 */
NodeGraph.prototype.hideGraph = function() {
	if(this._node !== null) {
		this._node.opacity = 0;
		this._text.opacity = 0;
	}
};

/**
 * getNodeObject 方法: 得到 canvas 上的 node 对象
 * @public
 * @return {Object}
 */
NodeGraph.prototype.getNodeObject = function() {
	return this._node;
};

/**
 * getTextObject 方法: 得到 canvas 上的 text 对象
 * @public
 * @return {Object}
 */
NodeGraph.prototype.getTextObject = function() {
	return this._text;
};



/*****************************************************
						连线图形类
******************************************************/
/**
 * 连线图形类，表示链表中两个结点之间的连线的图形
 * 在这个类的方法中进行输入正确性判断, 如果 set 方法中类型等出错, 则赋值为默认值
 * @class
 */
class LineGraph {
	/**
	 * 构造函数
	 * @param {{line, start, end}} color: 连线的颜色的 RGB 值
	 * @param {{x: xStart, y: yStart}} startPoint: 连线的起始点
	 * @param {{x: xEnd, y: yEnd}} endPoint: 连线的结束点
	 * @param {{direction, curve}} type: 连线的种类, 分单向线和双向线, 'single' or 'dual'
	 * @param {{line, start, end}} size: 线宽、圆圈、三角形的尺寸
	 * @param {{directRatio, curveDepthRatio, curveHeightRatio}} curveInfo: 曲线的大小属性
	 * @param {{startFaceRight, endFaceRight}} direction: 线条起始是否向右延伸
	 * @return {LineGraph}: 返回的连线图形对象
	 */
	constructor(color, startPoint, endPoint, type, size, curveInfo, direction) {
		/**
		 * 连线断点应当显示的颜色 RGB 属性
		 * @type {Object}
		 * @private
		 */
		this._color = null;
		this.setColor(color);

		/**
		 * 起始点的坐标
		 * @type {{x: x, y: y}}
		 * @private
		 */
		this._startPoint = null;
		this.setStartPoint(startPoint);

		/**
		 * 结束点的坐标
		 * @type {{x: x, y: y}}
		 * @private
		 */
		this._endPoint = null;
		this.setEndPoint(endPoint);

		/**
		 * 连线的类型
		 * @type {Object}
		 * @private
		 */
		this._type = null;
		this.setType(type);


		/**
		 * 连线的尺寸
		 * line 为线宽
		 * end 为三角形, 包含 width 及 height, 即底和高
		 * start 如为圆形, 则为半径, 否则与 end 三角形一样
		 * 圆形以起始点为圆心
		 * 三角形的高的中点为线的端点
		 * @type {{line, start, end}}
		 * @private
		 */
		this._size = null;
		this.setSize(size);

		/**
		 * 画布上的连线图形对象
		 * 如果为直线, 则 this._line 为直线对象
		 * 如果为曲线, 则 this._line 中有三个属性: direct1, direct2, curve
		 * @type {Object}
		 * @private
		 */
		this._line = null;

		/**
		 * 画布上的曲线图形对象的长宽等比例
		 * @type {{directRatio, curveDepthRatio, curveHeightRatio}}
		 * @private
		 */
		this._curveRatio = null;
		this.setCurveRatio(curveInfo);

		/**
		 * 画布上的连线端点的圆和三角形对象
		 * @type {Object}
		 * @private
		 */
		this._startSide = null;
		this._endSide = null;

		/**
		 * 画布上的连线的起止点延伸方向
		 * @type {Object}
		 * @private
		 */
		this._direction = null;
		this.setDirection(direction);
	}
}

/**
 * getColor 方法: 返回连线和端点的 color
 * @public
 * @return {{line, start, end}}: RGB 值
 */
LineGraph.prototype.getColor = function() {
	return this._color;
};

/**
 * setColor 方法: 设定当前连线和端点的 color
 * @public
 * @param {{line, start, end, startInside}} newColor: 新的 RGB 值
 * @return {void}
 */
LineGraph.prototype.setColor = function(newColor) {
	if(!newColor || !newColor.hasOwnProperty('start') || !newColor.hasOwnProperty('end') 
		|| !newColor.hasOwnProperty('line')  || !newColor.hasOwnProperty('startInside')) {
		this._color = MyTools.deepCopy(LINE_DEFAULT_COLOR);
	} else {
		if(!MyTools.isRGB(newColor.start) || !MyTools.isRGB(newColor.end) 
			|| !MyTools.isRGB(newColor.line) || !MyTools.isRGB(newColor.startInside)) {
			this._color = MyTools.deepCopy(LINE_DEFAULT_COLOR);
		} else {
			this._color = MyTools.deepCopy(newColor);

			if(this._startSide) {
				if(this._type.direction === 'single' || this._type.direction === 'circularFinal') {
					this._startSide.fill = this._color.startInside;
					this._startSide.stroke = this._color.start;
				} else {
					this._startSide.fill = this._color.start;
				}
			}

			if(this._endSide) {
				this._endSide.fill = this._color.end;
			}

			if(this._line) {
				if(this._type.curve) {
					this._line.curve.stroke = this._color.line;
					this._line.direct1.stroke = this._color.line;
					this._line.direct2.stroke = this._color.line;
				} else {
					this._line.stroke = this._color.line;
				}
			}	
		}
	}
};

LineGraph.prototype.getStartPoint = function() {
	return this._startPoint;
};

LineGraph.prototype.setStartPoint = function(newStartPoint) {
	if(!newStartPoint || !newStartPoint.hasOwnProperty('x') || !newStartPoint.hasOwnProperty('y')) {
		this._startPoint = MyTools.deepCopy(LINE_DEFAULT_STARTPOINT);
	} else {
		if(!MyTools.isInteger(newStartPoint.x) || !MyTools.isInteger(newStartPoint.y)) {
			this._startPoint = MyTools.deepCopy(LINE_DEFAULT_STARTPOINT);
		} else {
			this._startPoint = MyTools.deepCopy(newStartPoint);
		}
	}
};

LineGraph.prototype.getEndPoint = function() {
	return this._endPoint;
};

LineGraph.prototype.setEndPoint = function(newEndPoint) {
	if(!newEndPoint || !newEndPoint.hasOwnProperty('x') || !newEndPoint.hasOwnProperty('y')) {
		this._endPoint = MyTools.deepCopy(LINE_DEFAULT_ENDPOINT);
	} else {
		if(!MyTools.isInteger(newEndPoint.x) || !MyTools.isInteger(newEndPoint.y)) {
			this._endPoint = MyTools.deepCopy(LINE_DEFAULT_ENDPOINT);
		} else {
			this._endPoint = MyTools.deepCopy(newEndPoint);
		}
	}
};

/**
 * getType 方法: 返回连线的类型
 * @public
 * @return {string}: 类型, 'single' or 'dual'
 */
LineGraph.prototype.getType = function() {
	return this._type;
};

/**
 * setType 方法: 设定当前连线的类型
 * @public
 * @param {string} newType: 新的连线类型, 'single' or 'dual'
 * @return {void}
 */
LineGraph.prototype.setType = function(newType) {
	if(!newType || !newType.hasOwnProperty('direction') || !newType.hasOwnProperty('curve')) {
		this._type = MyTools.deepCopy(LINE_DEFAULT_TYPE);
	} else {
		if(!MyTools.isValidLineDirection(newType.direction) || !MyTools.isBoolean(newType.curve)) {
			this._type = MyTools.deepCopy(LINE_DEFAULT_TYPE);
		} else {
			this._type = MyTools.deepCopy(newType);
		}
	}
};

/**
 * getCurveRatio 方法: 返回曲线的比例设定
 * @public
 * @return {{directRatio, curveDepthRatio, curveHeightRatio}}
 */
LineGraph.prototype.getCurveRatio = function() {
	return this._curveRatio;
};

/**
 * setCurveRatio 方法: 设定曲线的比例
 * @public
 * @param {{directRatio, curveDepthRatio, curveHeightRatio}}
 * @return {void}
 */
LineGraph.prototype.setCurveRatio = function(newCurveRatio) {
	if(!newCurveRatio || !newCurveRatio.hasOwnProperty('directRatio') 
		|| !newCurveRatio.hasOwnProperty('curveDepthRatio') || !newCurveRatio.hasOwnProperty('curveHeightRatio')) {
		this._curveRatio = MyTools.deepCopy(CURVE_DEFAULT_RATIO);
	} else {
		if(!MyTools.isNumeric(newCurveRatio.directRatio) || !MyTools.isNumeric(newCurveRatio.curveDepthRatio) 
			|| !MyTools.isNumeric(newCurveRatio.curveHeightRatio)) {
			this._curveRatio = MyTools.deepCopy(CURVE_DEFAULT_RATIO);
		} else {
			this._curveRatio = MyTools.deepCopy(newCurveRatio);
		}
	}
};

LineGraph.prototype.getSize = function() {
	return this._size;
};

LineGraph.prototype.setSize = function(newSize) {
	if(!newSize || !newSize.hasOwnProperty('linewidth') || !newSize.hasOwnProperty('start') || !newSize.hasOwnProperty('end')) {
		this._size = MyTools.deepCopy(LINE_DEFAULT_SIZE);
	} else {
		if(!MyTools.isInteger(newSize.linewidth)) {
			this._size = MyTools.deepCopy(LINE_DEFAULT_SIZE);
			return;
		}

		//结束点检查, 应为三角形
		if(!newSize.end || !newSize.end.hasOwnProperty('width') || !newSize.end.hasOwnProperty('height')) {
			this._size = MyTools.deepCopy(LINE_DEFAULT_SIZE);
			return;
		}

		//开始点检查
		if(this._type.direction === 'dual') { // 三角形
			if(!newSize.start || !newSize.start.hasOwnProperty('width') || !newSize.start.hasOwnProperty('height')) {
				this._size = MyTools.deepCopy(LINE_DEFAULT_SIZE);
				this._size.start = MyTools.deepCopy(LINE_DEFAULT_SIZE.end); // 注意是三角形, 默认参数适应情况为圆形, 故需要修改
				return;
			}
		} else if(this._type.direction === 'single') { // 圆形
			if(!newSize.start || !newSize.start.hasOwnProperty('radius') || !newSize.start.hasOwnProperty('linewidth')) {
				this._size = MyTools.deepCopy(LINE_DEFAULT_SIZE);
				return;
			}
		}
		this._size = MyTools.deepCopy(newSize);
	}
};

LineGraph.prototype.setDirection = function(newDirection) {
	if(!newDirection || !newDirection.hasOwnProperty('startFaceRight') || !newDirection.hasOwnProperty('endFaceRight')) {
		this._direction = MyTools.deepCopy(LINE_DEFAULT_DIRECTION);
	} else {
		if(MyTools.isBoolean(newDirection.startFaceRight) && MyTools.isBoolean(newDirection.endFaceRight)) {
			this._direction = MyTools.deepCopy(newDirection);
		} else {
			this._direction = MyTools.deepCopy(LINE_DEFAULT_DIRECTION);
		}
	}
};

/**
 * _createGraph 方法: 在画布上创建直线
 * @private
 * @param {Object} canvas: two.js 的实例化对象, 为一个画布
 * @return {void}
 */
LineGraph.prototype._createDirectLine = function(canvas) {
	//单向箭头: startSide o--> endSide
	//双向箭头: startSide <--> endSide
	this._line = canvas.makeLine(this._startPoint.x, this._startPoint.y, this._endPoint.x, this._endPoint.y);
	this._line.linewidth = this._size.linewidth;
	this._line.stroke = this._color.line;
};

/**
 * _createCurvetLine 方法: 在画布上创建曲线
 * @private
 * @param {Object} canvas: two.js 的实例化对象, 为一个画布
 * @param {bool} faceLeft: 是否向左拱
 * @return {void}
 */
LineGraph.prototype._createCurveLine = function(canvas, faceLeft) {
	//      --o startSide o--
	//	    | faceLeft      | 
	//      -->  endSide  <--
	this._line = new Object();
	const directRatio = this._curveRatio.directRatio;
	const curveDepthRatio = this._curveRatio.curveDepthRatio;
	const curveHeightRatio = this._curveRatio.curveHeightRatio;
	const height = this._endPoint.y - this._startPoint.y;
	const radius = height * 0.5;

	let curveStart = new Object();
	let curveEnd = new Object();
	let curveMiddle = new Object();

	if(faceLeft) {
		curveStart = {
		x: this._startPoint.x - directRatio * height,
		y: this._startPoint.y
		};
		curveEnd = {
			x: this._endPoint.x - directRatio * height,
			y: this._endPoint.y
		};
		curveMiddle = {
			x: curveStart.x - radius,
			y: (curveStart.y + curveEnd.y) / 2
		};
	} else {
		curveStart = {
		x: this._startPoint.x + directRatio * height,
		y: this._startPoint.y
		};
		curveEnd = {
			x: this._endPoint.x + directRatio * height,
			y: this._endPoint.y
		};
		curveMiddle = {
			x: curveStart.x + radius,
			y: (curveStart.y + curveEnd.y) / 2
		};
	}

	//画直线部分
	this._line.direct1 = canvas.makeLine(this._startPoint.x, this._startPoint.y, curveStart.x, curveStart.y);
	this._line.direct2 = canvas.makeLine(curveEnd.x, curveEnd.y, this._endPoint.x, this._endPoint.y);
	this._line.direct1.stroke = this._color.line;
	this._line.direct2.stroke = this._color.line;
	this._line.direct1.linewidth = this._size.linewidth;
	this._line.direct2.linewidth = this._size.linewidth;


	let vertices = new Object();
	if(faceLeft) {
		vertices = [
			new Two.Anchor(curveStart.x, curveStart.y, 0.7 * radius, 0, -0.7 * radius, 0, Two.Commands.curve),
			new Two.Anchor(curveMiddle.x, curveMiddle.y, 0, -0.5 * radius, 0, 0.5 * radius, Two.Commands.curve),
			new Two.Anchor(curveEnd.x, curveEnd.y, -0.7 * radius, 0, 0.7 * radius, 0, Two.Commands.curve)
		];
	} else {
		vertices = [
			new Two.Anchor(curveStart.x, curveStart.y, -0.7 * radius, 0, 0.7 * radius, 0, Two.Commands.curve),
			new Two.Anchor(curveMiddle.x, curveMiddle.y, 0, -0.5 * radius, 0, 0.5 * radius, Two.Commands.curve),
			new Two.Anchor(curveEnd.x, curveEnd.y, 0.7 * radius, 0, -0.7 * radius, 0, Two.Commands.curve)
		];
	}

	this._line.curve = canvas.makeCurve(vertices, true);
	this._line.curve.stroke = this._color.line;
	this._line.curve.linewidth = this._size.linewidth;
	this._line.curve.noFill();
};

/**
 * _createCircle 方法: 在画布上创建圆, 以 startPoint 为圆心
 * @private
 * @param {Object} canvas: two.js 的实例化对象, 为一个画布
 * @return {void}
 */
LineGraph.prototype._createCircle = function(canvas) {
	//以 startPoint 为圆心, this._size.start 为半径
	this._startSide = canvas.makeCircle(this._startPoint.x, this._startPoint.y, this._size.start.radius);
	this._startSide.fill = this._color.startInside;
	this._startSide.stroke = this._color.start;
	this._startSide.linewidth = this._size.start.linewidth;
};

/**
 * _getTriangleVertices 方法: 得到三角形的三个顶点
 * @private
 * @param {{x: x, y: y}} center: 三角形的中心点
 * @param {{width, height}} size: 三角形的底和高
 * @param {bool} faceLeft: 三角形是否朝左
 * @return {Array}: two 中的 Anchor 对象数组, 用于之后画出三角形
 */
LineGraph.prototype._getTriangleVertices = function(center, size, faceLeft) {
	//以 startPoint 为圆心, this._size.start 为半径
	let p1 = new Object();
	let p2 = new Object();
	let p3 = new Object();	
	if(faceLeft === true) {
		p2.y = center.y;
		p2.x = center.x - 2 * size.height / 3;
		p1.x = center.x + size.height / 3;
		p1.y = center.y + size.width / 2;
		p3.x = p1.x;
		p3.y = center.y - size.width / 2;
	} else {
		p2.y = center.y;
		p2.x = center.x + 2 * size.height / 3;
		p1.x = center.x - size.height / 3;
		p1.y = center.y + size.width / 2;
		p3.x = p1.x;
		p3.y = center.y - size.width / 2;
	}

	return [new Two.Anchor(p1.x, p1.y), new Two.Anchor(p2.x, p2.y), new Two.Anchor(p3.x, p3.y)];
};

/**
 * _createCircle 方法: 在画布上创建三角形, 以 startPoint 或 endPoint 为圆心
 * @private
 * @param {Object} canvas: two.js 的实例化对象, 为一个画布
 * @param {bool} faceLeft: 三角形的尖是否向左
 * @param {bool} isStart: 三角形是否以 startPoint 为中心
 * @return {void}
 */
LineGraph.prototype._createTriangle = function(canvas, faceLeft, isStart) {
	//以 startPoint 为圆心, this._size.start 为半径
	const center = isStart? this._startPoint: this._endPoint;
	const size = {
		width: isStart? this._size.start.width: this._size.end.width,
		height: isStart? this._size.start.height: this._size.end.height
	};
	const vertices = this._getTriangleVertices(center, size, faceLeft);
	
	if(isStart === true) {
		this._startSide = new Two.Path(vertices, false, false, false);
		this._startSide.fill = this._color.start;
		this._startSide.noStroke();
		canvas.add(this._startSide);
	} else {
		this._endSide = new Two.Path(vertices, false, false, false);
		this._endSide.fill = this._color.end;
		this._endSide.noStroke();
		canvas.add(this._endSide);
	}
}

LineGraph.prototype._createCircularFinalLine = function(canvas, faceLeft) {
	const start = MyTools.deepCopy(this._startPoint);
	const offset = 30;
	const end = MyTools.deepCopy(this._endPoint);

	let curveStart = new Object();
	let curveEnd = new Object();
	let curveMiddle = new Object();


	this._line = new Object();
	if(faceLeft) {
		this._line.direct1 = canvas.makeLine(start.x, start.y, start.x - offset, start.y);
		this._line.curve = canvas.makeLine(start.x - offset, start.y, end.x - offset, end.y);
		this._line.direct2 = canvas.makeLine(end.x - offset, end.y, end.x, end.y);
	} else {
		this._line.direct1 = canvas.makeLine(start.x, start.y, start.x + offset, start.y);
		this._line.curve = canvas.makeLine(start.x + offset, start.y, end.x - offset, end.y);
		this._line.direct2 = canvas.makeLine(end.x - offset, end.y, end.x, end.y);
	}

	this._line.direct1.stroke = this._color.line;
	this._line.direct2.stroke = this._color.line;
	this._line.direct1.linewidth = this._size.linewidth;
	this._line.direct2.linewidth = this._size.linewidth;
	this._line.curve.stroke = this._color.line;
	this._line.curve.linewidth = this._size.linewidth;
	this._line.curve.noFill();
};

/**
 * createGraph 方法: 在画布上创建图形对象
 * @public
 * @param {Object} canvas: two.js 的实例化对象, 为一个画布
 * @param {bool} startRight: 线开始是否向右延伸
 * @param {bool} endRight: 线结束是否向右延伸
 * @return {void}
 */
LineGraph.prototype.createGraph = function(canvas) {
	//单向箭头: startSide o--> endSide
	//双向箭头: startSide <--> endSide
	const startRight = this._direction.startFaceRight;
	const endRight = this._direction.endFaceRight;

	if(this._type.curve === false) {
		this._createDirectLine(canvas);
	} else {
		if(this._type.direction === 'circularFinal') {
			this._createCircularFinalLine(canvas, !startRight);
		} else {
			this._createCurveLine(canvas, !startRight);
		}
	}

	//开始点的图形
	if(this._type.direction === 'single' || this._type.direction === 'circularFinal') {
		this._createCircle(canvas);
	} else if(this._type.direction === 'dual') {
		this._createTriangle(canvas, startRight, true);//开始时线条向右延伸, 则三角形指向左
	}

	//结束时三角形
	this._createTriangle(canvas, !endRight, false);//结束时线条向右延伸, 则三角形指向右
};

// LineGraph.prototype.createCircularFinal = function(canvas) {
// 	//单向箭头: startSide o--> endSide
// 	//双向箭头: startSide <--> endSide
// 	const  startRight = this._direction.startFaceRight;
// 	const endRight = this._direction.endFaceRight;

// 	if(this._type.curve === false) {
// 		this._createDirectLine(canvas);
// 	} else {
// 		this._createCurveLine(canvas, !startRight);
// 	}

// 	this._createCircularFinal();

// 	//开始点的图形
// 	if(this._type.direction === 'single') {
// 		this._createCircle(canvas);
// 	} else if(this._type.direction === 'dual') {
// 		this._createTriangle(canvas, startRight, true);//开始时线条向右延伸, 则三角形指向左
// 	}

// 	//结束时三角形
// 	this._createTriangle(canvas, !endRight, false);//结束时线条向右延伸, 则三角形指向右
// };

/**
 * showGraph 方法: 显示出画布上的连线图形
 * @public
 * @return {void}
 */
LineGraph.prototype.showGraph = function() {
	if(this._line !== null) {
		if(this._type.curve === true) {
			this._line.direct1.opacity = 1;
			this._line.direct2.opacity = 1;
			this._line.curve.opacity = 1;
		} else {
			this._line.opacity = 1;
		}
	}
	if(this._startSide !== null) {
		this._startSide.opacity = 1;
	}
	if(this._endSide !== null) {
		this._endSide.opacity = 1;
	}
};

/**
 * hideGraph 方法: 隐藏画布上的连线图形
 * @public
 * @return {void}
 */
LineGraph.prototype.hideGraph = function() {
	if(this._line !== null) {
		if(this._type.curve === true) {
			this._line.direct1.opacity = 0;
			this._line.direct2.opacity = 0;
			this._line.curve.opacity = 0;
		} else {
			this._line.opacity = 0;
		}
	}
	if(this._startSide !== null) {
		this._startSide.opacity = 0;
	}
	if(this._endSide !== null) {
		this._endSide.opacity = 0;
	}
};

/**
 * getLineObject 方法: 返回连线对象
 * @public
 * @return {Object}
 */
LineGraph.prototype.getLineObject = function() {
	return this._line;
};

/**
 * getStartSideObject 方法: 返回连线起始端对象
 * @public
 * @return {Object}
 */
LineGraph.prototype.getStartSideObject = function() {
	return this._startSide;
};

/**
 * getEndSideObject 方法: 返回连线结束端对象
 * @public
 * @return {Object}
 */
LineGraph.prototype.getEndSideObject = function() {
	return this._endSide;
};





/*****************************************************
						链表图形类
******************************************************/
/**
 * 链表图形类，用以图形化表示链表
 * 在类的各方法中, 需要对输入进行类型和正确性判断, 以保证鲁棒性
 * @class
 */
class LinkListGraph {
	/**
	 * 构造函数
	 * @return {LinkListGraph}: 返回的连线图形对象
	 */
	constructor() {
		/**
		 * 记录结点的数组
		 * @type {Array}
		 * @private
		 */
		this._nodes = new Array();

		/**
		 * 记录连线的数组
		 * @type {Array}
		 * @private
		 */
		this._lines = new Array();

		/**
		 * canvas
		 * @type {Object}
		 * @private
		 */
		this._canvas = null;

		/**
		 * 记录 canvas 大小
		 * @type {Object{width, height}}
		 * @private
		 */
		this._canvasSize = MyTools.deepCopy(DEFAULT_CANVAS_SIZE);

		/**
		 * 结点数
		 * @type {int}
		 * @private
		 */
		this._nodesCount = 0;

		/**
		 * 每一层最大结点数
		 * @type {int}
		 * @private
		 */
		this._maxNodesPerRow = MyTools.deepCopy(DEFAULT_MAX_NODES_PERROW);

		/**
		 * 每一层最大结点数
		 * @type {int}
		 * @private
		 */
		this._maxNodes = MyTools.deepCopy(DEFAULT_MAX_NODES);

		/**
		 * 链表情况, 单向双向或是循环
		 * @type {string}: 'single', 'dual' or 'circular'
		 * @private
		 */
		this._linklistType = 'dual';

		/**
		 * 结点的大小情况
		 * @type {Object}
		 * @private
		 */
		this._defaultNodeSize = MyTools.deepCopy(NODE_DEFAULT_SIZE);

		/**
		 * 线的大小情况
		 * @type {Object}
		 * @private
		 */
		this._defaultLineSize = MyTools.deepCopy(LINE_DEFAULT_SIZE);

		/**
		 * 曲线的大小情况
		 * @type {Object}
		 * @private
		 */
		this._defaultCurveRatio = MyTools.deepCopy(CURVE_DEFAULT_RATIO);

		/**
		 * 行与行之间的间距
		 * @type {int}
		 * @private
		 */
		this._rowSpacing = MyTools.deepCopy(DEFAULT_ROW_SPACING);

		/**
		 * 结点之间的间距
		 * @type {int}
		 * @private
		 */
		this._nodeSpacing = MyTools.deepCopy(DEFAULT_NODE_SPACING);

		/**
		 * 设定边距
		 * @type {Object{width, height}}
		 * @private
		 */
		this._margin = MyTools.deepCopy(DEFAULT_MARGIN);

		/**
		 * 连线组
		 * @type {Set{Set{Object}}}
		 * @private
		 */
		this._lineGroup = null;
	}
}

LinkListGraph.prototype.setLinkListType = function(newType) {
	if(newType === 'single' || newType === 'dual' || newType === 'circular') {
		this._linklistType = MyTools.deepCopy(newType);
	}
};

LinkListGraph.prototype.getNodesCount = function() {
	return this._nodesCount;
};

/**
 * setMaxNodesPerRow 方法: 设定新的每一行最多可放置结点数
 * @public
 * @param {int} newLimit
 * @return {void}
 */
LinkListGraph.prototype.setMaxNodesPerRow = function(newLimit) {
	if(MyTools.isInteger(newLimit)) {
		this._maxNodesPerRow = MyTools.deepCopy(newLimit);
	}
};

/**
 * setMaxNodes 方法: 设定整个图像中最多可放置结点数
 * @public
 * @param {int} newLimit
 * @return {void}
 */
LinkListGraph.prototype.setMaxNodes = function(newLimit) {
	if(MyTools.isInteger(newLimit)) {
		this._maxNodes = MyTools.deepCopy(newLimit);
	}
};

/**
 * setDefaultNodeSize 方法: 设定新的默认结点大小信息, 包含 length, width and radius
 * @public
 * @param {Object{length, width, radius}} newSize
 * @return {void}
 */
LinkListGraph.prototype.setDefaultNodeSize = function(newSize) {
	if(newSize && newSize.hasOwnProperty('length') && newSize.hasOwnProperty('width') 
		&& newSize.hasOwnProperty('radius')) {
		this._nodeSize = MyTools.deepCopy(newSize);
	}
};

/**
 * setDefaultLineSize 方法: 设定新的默认线条大小信息, 包含 linewidth, start and end
 * @public
 * @param {Object{linewidth, start, end}} newSize
 * @return {void}
 */
LinkListGraph.prototype.setDefaultLineSize = function(newSize) {
	if(newSize && newSize.hasOwnProperty('linewidth') 
		&& newSize.hasOwnProperty('width') && newSize.hasOwnProperty('radius')) {
		// 若是圆形, 则有 radius, linewidth 属性; 若是三角形, 则有 width, height 属性
		// newSize.end 必定是三角形
		if(!newSize.end.hasOwnProperty('width') || !newSize.end.hasOwnProperty('height')) {
			return; // 如果三角形属性不完整, 则退出
		}
		
		if(this._linklistType === 'dual') {
			// newSize.start 为三角形
			if(!newSize.start.hasOwnProperty('width') || !newSize.start.hasOwnProperty('height')) {
				return;
			} else {
				this._lineSize = MyTools.deepCopy(newSize);
			}
		} else {
			// newSize.start 为圆形
			if(!newSize.start.hasOwnProperty('radius') || !newSize.start.hasOwnProperty('linewidth')) {
				return;
			} else {
				this._lineSize = MyTools.deepCopy(newSize);
			}
		}
	}
};

/**
 * setDefaultCurveRatio 方法: 设定新的曲线长度信息, 包含 directRatio, curveDepthRatio and curveHeightRatio
 * @public
 * @param {Object{directRatio, curveDepthRatio, curveHeightRatio}} newSize
 * @return {void}
 */
LinkListGraph.prototype.setDefaultCurveRatio = function(newRatio) {
	if(newRatio && newRatio.hasOwnProperty('directRatio') && newRatio.hasOwnProperty('curveDepthRatio') 
		&& newRatio.hasOwnProperty('curveHeightRatio')) {
		this._curveRatio = MyTools.deepCopy(newRatio);
	}
};

LinkListGraph.prototype.setRowSpacing = function(newSpacing) {
	if(MyTools.isInteger(newSpacing)) {
		if(newSpacing > 0) {
			this._rowSpacing = MyTools.deepCopy(newSpacing);
		}
	}
};

LinkListGraph.prototype.setNodeSpacing = function(newSpacing) {
	if(MyTools.isInteger(newSpacing)) {
		if(newSpacing > 0) {
			this._nodeSpacing = MyTools.deepCopy(newSpacing);
		}
	}
};

LinkListGraph.prototype.setMargin = function(newMargin) {
	if(!newMarigin || !newMargin.hasOwnProperty('heightMargin') || !newMarigin.hasOwnProperty('widthMargin')) {
		return;
	}

	if(MyTools.isInteger(newMargin.heightMargin) && MyTools.isInteger(newMargin.widthMargin)) {
		this._margin = MyTools.deepCopy(newMargin);
	}
};

/** _setCanvasSize 方法: 设定 canvasSize 的大小
 * @private
 */
LinkListGraph.prototype._setCanvasSize = function(newSize) {
	if(newSize && newSize.hasOwnProperty('width') && newSize.hasOwnProperty('height')) {
		this._canvasSize = MyTools.deepCopy(newSize);
	}
};

/**
 * checkValid 方法: 检查现在配置的参数是否正确
 * @public
 * @return {bool}
 */
LinkListGraph.prototype.checkValid = function() {
	// 根据链表类型检查是否 size、color 等配置正确
	// 根据 canvas 大小检查每一层的结点个数及高度差是否正确
	const canvasWidth = this._canvasSize.width;
	const canvasHeight = this._canvasSize.height;
	const rowSpacing = this._rowSpacing;
	const nodeWidth = this._nodeSize.width;
	const nodeLength = this._nodeSize.length;
	const nodeSpacing = this._nodeSpacing;
	const curveDepth = (rowSpacing + nodeWidth) * (this._curveRatio.directRatio + this._curveRatio.curveDepthRatio) - this._nodeSize.radius;
	const rowCount = Math.ceil(this._maxNodes / this._maxNodesPerRow);
	const widthMargin = this._margin.widthMargin;
	const heightMargin = this._margin.heightMargin;


	// 进行曲线深度检查
	if(curveDepth > widthMargin) {
		return false;
	}

	// 进行高度检查
	if(rowCount * nodeWidth + (rowCount - 1) * rowSpacing + 2 * heightMargin > canvasHeight) {
		return false;
	}

	// 进行宽度检查
	const actualWidth = this._maxNodesPerRow * nodeLength + (this._maxNodesPerRow - 1) * nodeSpacing + 2 * widthMargin;
	if(canvasWidth - actualWidth <= 5) {
		return false;
	}

	return true;
};

/**
 * _isValidNodeIndex 方法: 检查 node index 是否合法
 * @private
 * @param {int} index
 * @return {bool}
 */
LinkListGraph.prototype._isValidNodeIndex = function(index) {
	if(!MyTools.isInteger(index)) {
		return false;
	}
	if(index > this._nodesCount || index < 1) {
		return false;
	}
	return true;
};

/**
 * _setNodeCenter 方法: 设定某个结点的中心点
 * @param {int} index: 选定结点的位置, 取值范围为 [1, n]
 * @param {Object{x, y}} point: 点
 * @private
 * @return {void}
 */
LinkListGraph.prototype._setNodeCenter = function(index, point) {
	if(!this._isValidNodeIndex(index)) {
		return;
	}

	const node = this._nodes[index - 1]; //本质为引用
	node.setCenter(point);
};

/**
 * setNodeShapeColor 方法: 设定某个结点的颜色
 * @param {int} index: 选定结点的位置, 取值范围为 [1, n]
 * @param {string} color: 图形的 RGB 值
 * @public
 * @return {void}
 */
LinkListGraph.prototype.setNodeShapeColor = function(index, color) {
	if(!this._isValidNodeIndex(index)) {
		return;
	}

	const node = this._nodes[index - 1]; //本质为引用
	node.setShapeColor(color);
};

/**
 * setNodeTextColor 方法: 设定某个结点的文本颜色
 * @param {int} index: 选定结点的位置, 取值范围为 [1, n]
 * @param {string} color: 文本的 RGB 值
 * @public
 * @return {void}
 */
LinkListGraph.prototype.setNodeTextColor = function(index, color) {
	if(!this._isValidNodeIndex(index)) {
		return;
	}

	const node = this._nodes[index - 1]; //本质为引用
	node.setTextColor(color);
};

LinkListGraph.prototype.setNodeValue = function(index, value) {
	if(!this._isValidNodeIndex(index)) {
		return;
	}

	const node = this._nodes[index - 1]; //本质为引用
	node.setValue(value);
};

/**
 * _isValidLineIndex 方法: 检查 line index 是否合法
 * @private
 * @param {int} index
 * @return {bool}
 */
LinkListGraph.prototype._isValidLineIndex = function(index) {
	if(!MyTools.isInteger(index)) {
		return false;
	}

	if(this._linklistType === 'circular') {
		if(index > this._nodesCount || index < 1) {
			return false;
		}
	} else {
		if(index > this._nodesCount - 1 || index < 1) {
			return false;
		}
	}
	
	return true;
};

/**
 * _setLineType 方法: 设定某个连线的类型
 * @param {int} index: 选定连线的位置
 * @param {Object} type
 * @private
 * @return {void}
 */
LinkListGraph.prototype._setLineType = function(index, type) {
	if(!this._isValidLineIndex(index)) {
		return;
	}

	const line = this._lines[index - 1]; //本质为引用
	line.setType(type);
};

/**
 * _setLineDirection 方法: 设定某个连线的起始点延伸方向
 * @param {int} index: 选定连线的位置
 * @param {Object} direction
 * @private
 * @return {void}
 */
LinkListGraph.prototype._setLineDirection = function(index, direction) {
	if(!this._isValidLineIndex(index)) {
		return;
	}

	const line = this._lines[index - 1]; //本质为引用
	line.setDirection(direction);
};

/**
 * _setLineStartPoint 方法: 设定某个连线的起始点
 * @param {int} index: 选定连线的位置
 * @param {{x, y}} point
 * @private
 * @return {void}
 */
LinkListGraph.prototype._setLineStartPoint = function(index, point) {
	if(!this._isValidLineIndex(index)) {
		return;
	}

	const line = this._lines[index - 1]; //本质为引用
	line.setStartPoint(point);
};

/**
 * _setLineEndPoint 方法: 设定某个连线的结束点
 * @param {int} index: 选定连线的位置
 * @param {{x, y}} point
 * @private
 * @return {void}
 */
LinkListGraph.prototype._setLineEndPoint = function(index, point) {
	if(!this._isValidLineIndex(index)) {
		return;
	}

	const line = this._lines[index - 1]; //本质为引用
	line.setEndPoint(point);
};

/**
 * setLineColor 方法: 设定某个连线的颜色
 * @param {int} index: 选定连线的位置
 * @param {Object} color
 * @public
 * @return {void}
 */
LinkListGraph.prototype.setLineColor = function(index, color) {
	if(!this._isValidLineIndex(index)) {
		return;
	}

	const line = this._lines[index - 1]; //本质为引用
	line.setColor(color);
	//console.log(line)
};

/**
 * _generateNewNodes 方法: 读入新的结点, 并按照预设好的结点大小生成结点对象
 * 使用前需要确定结点的形状大小, 或不设定, 采用默认值
 * 在函数中设定结点的 value
 * @private
 * @param {Array} nodes: nodes 为传入的数组, 每个成员都是 int 型数
 * @return {void}
 */
LinkListGraph.prototype._generateNewNodes = function(nodes) {
	if(nodes.length <= this._maxNodes) {
		this._nodesCount = nodes.length;
	} else {
		return;
	}
	this._nodes = new Array();// 先清除所有已有结点
	/**
	 * 构造函数
	 * @param {int} value: 结点的值, 默认为0  ---from parameter
	 * @param {string} shapeColor: 结点的形状颜色属性, 用 RGB 表示, 默认为 '#FFE317'  ---user
	 * @param {string} textColor: 结点的文字颜色属性, 用 RGB 表示, 默认为 '#30334A'  ---user
	 * @param {{x: xValue, y: yValue}} center: 结点的中心位置, 默认为 (100, 100) ---auto calculate
	 * @param {{length: l, width: w, radius:r}}: 结点形状的大小, l for length; w for width;r for 圆角半径  ---setted before construct
	 * @return {NodeGraph}: 返回的结点图形对象
	 * constructor(value, shapeColor, textColor, center, size)
	 */
	let newNode;
	for(nodeValue of nodes) {
		newNode = new NodeGraph(nodeValue, null, null, null, this._defaultNodeSize);
		this._nodes.push(newNode);
	}
};

/**
 * _calculateNodesPosition 方法: 根据用户设置, 自动计算结点位置, 既定下 center 位置
 * @private
 * @return {void}
 */
LinkListGraph.prototype._calculateNodesPosition = function() {
	const rowCount = Math.ceil(this._nodesCount / this._maxNodesPerRow);
	const nodesPerRow = this._maxNodesPerRow;
	const nodesCount = this._nodesCount;
	const totalHeight = rowCount * this._defaultNodeSize.width + (rowCount - 1) * this._rowSpacing;
	let faceRight = true;

	let initialX = this._margin.width + this._defaultNodeSize.length / 2
				+ this._defaultNodeSize.length * (this._defaultCurveRatio.curveDepthRatio + this._defaultCurveRatio.directRatio)
				- this._defaultNodeSize.radius;

	let center = {
		x: initialX,
		y: (this._canvasSize.height - totalHeight) / 2 + this._defaultNodeSize.width / 2
	};

	for(let i = 1; i <= nodesCount; i++) {
		if(i % nodesPerRow === 0) { //如果是某行最后一个结点
			this._setNodeCenter(i, center);
			center.y += this._defaultNodeSize.width + this._rowSpacing;
			faceRight = !faceRight;
		} else {
			this._setNodeCenter(i, center);
			if(faceRight) {
				center.x += this._defaultNodeSize.length + this._nodeSpacing;
			} else {
				center.x -= this._defaultNodeSize.length + this._nodeSpacing;
			}
		}
	}
};

/**
 * _generateNewLines 方法: 根据设定好的结点信息(每行个数及间距等)生成 this._lines 数组
 * @private
 * @return {void}
 */
LinkListGraph.prototype._generateNewLines = function() {
	this._lines = new Array();
	/**
	 * 构造函数
	 * @param {{line, start, end}} color: 连线的颜色的 RGB 值  ---user
	 * @param {{x: xStart, y: yStart}} startPoint: 连线的起始点  ---auto calculate
	 * @param {{x: xEnd, y: yEnd}} endPoint: 连线的结束点  ---auto calculate
	 * @param {{direction, curve}} type: 连线的种类, 分单向线和双向线, 'single' or 'dual' ---auto calculate
	 * @param {{line, start, end}} size: 线宽、圆圈、三角形的尺寸  ---setted before construct
	 * @param {{directRatio, curveDepthRatio, curveHeightRatio}} curveInfo: 曲线的大小属性  ---setted before construct
	 * @param {{startFaceRight, endFaceRight}} direction: 线条起始是否向右延伸   ---auto calculate
	 * @return {LineGraph}: 返回的连线图形对象
	 
	constructor(color, startPoint, endPoint, type, size)
	*/
	//linklistType 'single', 'dual' or 'circular'
	let newLine;

	if(this._linklistType === 'circular') {
		for(let i = 0; i < this._nodesCount; i++) {
			newLine = new LineGraph(null, null, null, {
				direction: 'single', 
				curve: false
			}, this._defaultLineSize, this._defaultCurveRatio, null);
			this._lines.push(newLine);
		}
	} else if (this._linklistType === 'single') {
		for(let i = 1; i < this._nodesCount; i++) {
			newLine = new LineGraph(null, null, null, {
				direction: 'single', 
				curve: false
			}, this._defaultLineSize, this._defaultCurveRatio, null);
			this._lines.push(newLine);
		}
	} else {
		for(let i = 1; i < this._nodesCount; i++) {
			newLine = new LineGraph(null, null, null, {
				direction: 'dual', 
				curve: false
			}, this._defaultLineSize, this._defaultCurveRatio, null);
			this._lines.push(newLine);
		}
	}
};

/**
 * _calculateLinesType 方法: 根据用户设置, 自动计算连线的类型, 即定下 @param {{direction, curve}} type
 * @private
 * @return {void}
 */
LinkListGraph.prototype._calculateLinesType = function() {
	// type.direction: 'single' 'dual'
	// type.curve: true false
	const nodesPerRow = this._maxNodesPerRow;
	const nodesCount = this._nodesCount;

	if(this._linklistType === 'circular') {
		for(let i = 1; i < this._nodesCount; i++) {
			if(i % nodesPerRow === 0) { // 某一行最后一个结点
				this._setLineType(i, {
					direction: 'single',
					curve: true
				});
			} else {
				this._setLineType(i, {
					direction: 'single',
					curve: false
				});
			}
		}

		this._setLineType(this._nodesCount, {
			direction: 'circularFinal',
			curve: true
		});
	} else {
		for(let i = 1; i < this._nodesCount; i++) {
			if(i % nodesPerRow === 0) { // 某一行最后一个结点
				this._setLineType(i, {
					direction: this._linklistType,
					curve: true
				});
			} else {
				this._setLineType(i, {
					direction: this._linklistType,
					curve: false
				});
			}
		}
	}
};

/**
 * _calculateLinesPosition 方法: 根据用户设置, 自动计算连线的位置, 即定下起止点及延伸方向(startPoint endPoint direction)
 * @private
 * @return {void}
 */
LinkListGraph.prototype._calculateLinesPosition = function() {
	const rowCount = Math.ceil(this._nodesCount / this._maxNodesPerRow);
	const nodesPerRow = this._maxNodesPerRow;
	const nodesCount = this._nodesCount;
	let faceRight = true; // 结点在向右延伸(第一排所有结点都为 true, 第二排都为 false)
	const offset = this._defaultNodeSize.length / 2 - this._defaultNodeSize.radius; // 结点中心点到端点的距离

	let startNode, endNode;
	if(this._linklistType === 'circular') {
		//暂时还没考虑
		//'circularFinal'
		for(let i = 1; i < this._nodesCount; i++) {
			startNode = this._nodes[i - 1];
			endNode = this._nodes[i];

			if(i % nodesPerRow === 0) { // 某一行最后一个结点
				if(faceRight) { // 曲线右拱
					this._setLineStartPoint(i, {
						x: startNode.getCenter().x + offset,
						y: startNode.getCenter().y
					});

					this._setLineEndPoint(i, {
						x: endNode.getCenter().x + offset,
						y: endNode.getCenter().y
					});
				} else { // 曲线左拱
					this._setLineStartPoint(i, {
						x: startNode.getCenter().x - offset,
						y: startNode.getCenter().y
					});

					this._setLineEndPoint(i, {
						x: endNode.getCenter().x - offset,
						y: endNode.getCenter().y
					});
				}

				this._setLineDirection(i, {
					startFaceRight: faceRight,
					endFaceRight: !faceRight
				});

				faceRight = !faceRight; // 下一行线条延伸方向转向
			} else {
				if(faceRight) { // 直线向右
					this._setLineStartPoint(i, {
						x: startNode.getCenter().x + offset,
						y: startNode.getCenter().y
					});

					this._setLineEndPoint(i, {
						x: endNode.getCenter().x - offset,
						y: endNode.getCenter().y
					});
				} else { // 直线向左
					this._setLineStartPoint(i, {
						x: startNode.getCenter().x - offset,
						y: startNode.getCenter().y
					});

					this._setLineEndPoint(i, {
						x: endNode.getCenter().x + offset,
						y: endNode.getCenter().y
					});
				}

				this._setLineDirection(i, {
					startFaceRight: faceRight,
					endFaceRight: faceRight
				});
			}
		}

		startNode = this._nodes[this._nodesCount - 1];
		endNode = this._nodes[0];
		//最后一条, 即回头结点的线
		if(faceRight) { // 向右
			this._setLineStartPoint(this._nodesCount, {
				x: startNode.getCenter().x + offset,
				y: startNode.getCenter().y
			});
		} else { // 向左
			this._setLineStartPoint(this._nodesCount, {
				x: startNode.getCenter().x - offset,
				y: startNode.getCenter().y
			});
		}

		this._setLineEndPoint(this._nodesCount, {
			x: endNode.getCenter().x - offset,
			y: endNode.getCenter().y
		});

		this._setLineDirection(this._nodesCount, {
			startFaceRight: faceRight,
			endFaceRight: true
		});
	} else { //'single' or 'dual'
		for(let i = 1; i < this._nodesCount; i++) {
			startNode = this._nodes[i - 1];
			endNode = this._nodes[i];

			if(i % nodesPerRow === 0) { // 某一行最后一个结点
				if(faceRight) { // 曲线右拱
					this._setLineStartPoint(i, {
						x: startNode.getCenter().x + offset,
						y: startNode.getCenter().y
					});

					this._setLineEndPoint(i, {
						x: endNode.getCenter().x + offset,
						y: endNode.getCenter().y
					});
				} else { // 曲线左拱
					this._setLineStartPoint(i, {
						x: startNode.getCenter().x - offset,
						y: startNode.getCenter().y
					});

					this._setLineEndPoint(i, {
						x: endNode.getCenter().x - offset,
						y: endNode.getCenter().y
					});
				}

				this._setLineDirection(i, {
					startFaceRight: faceRight,
					endFaceRight: !faceRight
				});

				faceRight = !faceRight; // 下一行线条延伸方向转向
			} else {
				if(faceRight) { // 直线向右
					this._setLineStartPoint(i, {
						x: startNode.getCenter().x + offset,
						y: startNode.getCenter().y
					});

					this._setLineEndPoint(i, {
						x: endNode.getCenter().x - offset,
						y: endNode.getCenter().y
					});
				} else { // 直线向左
					this._setLineStartPoint(i, {
						x: startNode.getCenter().x - offset,
						y: startNode.getCenter().y
					});

					this._setLineEndPoint(i, {
						x: endNode.getCenter().x + offset,
						y: endNode.getCenter().y
					});
				}

				this._setLineDirection(i, {
					startFaceRight: faceRight,
					endFaceRight: faceRight
				});
			}
		}
	}
};

LinkListGraph.prototype.drawNode = function() {
	for(eachNode of this._nodes) {
		eachNode.createGraph(this._canvas);
	}
};

LinkListGraph.prototype.drawLine = function() {
	for(eachLine of this._lines) {
		eachLine.createGraph(this._canvas);
	}
};

/**
 * createCanvas 方法: 创建 two 对象, 用于绘制图像
 * @param {DOM} elem: HTML 中用于绘制链表图像的 DOM 对象
 * @param {Object{width, height}} size: 描述 canvas 的大小
 * @return {void}
 */
LinkListGraph.prototype.createCanvas = function(elemName, size) {
	elemName = MyTools.deepCopy(elemName || 'draw-shapes');
	size = MyTools.deepCopy(size || DEFAULT_CANVAS_SIZE);
	let elem = document.getElementById(elemName);//原生的JS代码, 取到创建的Div
	let params = size;
	this._canvas = new Two(params).appendTo(elem); //新建一个在div中的二维空间
	this._setCanvasSize(size);
};

/**
 * drawNodesAndLines 方法: 根据用户设置, 生成点和线的图形对象
 * 需要提前设定好 linklistType, maxNodes, maxNodesPerRow, nodeSize,
 * lineSize, curveRatio, margin, nodeSpacing, rowSpacing
 * 使用前须先执行 createCanvas
 * @public
 * @param {Array} nodes: nodes 为传入的数组, 每个成员都是 int 型数
 * @return {void}
 */
LinkListGraph.prototype.drawNodesAndLines = function(nodes) {
	this._generateNewNodes(nodes);
	this._calculateNodesPosition();
	this._generateNewLines();
	this._calculateLinesType();
	this._calculateLinesPosition();
	this.drawNode(this._canvas);
	this.drawLine(this._canvas);
};

LinkListGraph.prototype.destroy = function() {
	for(node of this._nodes) {
		this._canvas.remove(node.getNodeObject());
		this._canvas.remove(node.getTextObject());
	}
	for(line of this._lines) {
		if(line.getType().curve) {
			this._canvas.remove(line.getLineObject().curve);
			this._canvas.remove(line.getLineObject().direct1);
			this._canvas.remove(line.getLineObject().direct2);
		} else {
			this._canvas.remove(line.getLineObject());
		}
		this._canvas.remove(line.getStartSideObject());
		this._canvas.remove(line.getEndSideObject());
	}
};

LinkListGraph.prototype.hideGraph = function() {
	for(node of this._nodes) {
		node.hideGraph();
	}
	for(line of this._lines) {
		line.hideGraph();
	}
};

LinkListGraph.prototype.showGraph = function() {
	for(node of this._nodes) {
		node.showGraph();
	}
	for(line of this._lines) {
		line.showGraph();
	}
};

LinkListGraph.prototype.update = function() {
	this._canvas.update();
};

/**
 * hideGraphWithAnimation 方法: 根据用户设置, 生成图形消失的动画效果
 * @public
 * @param {Function} callback: 结束时的回调函数
 * @return {void}
 */
LinkListGraph.prototype.hideGraphWithAnimation = function(callback) {
	let allObject = new Array();
	let allSide = new Array();

	for(node of this._nodes) {
		allObject.push(node.getNodeObject());
		allObject.push(node.getTextObject());
	}

	for(line of this._lines) {
		if(line.getType().curve) {
			allObject.push(line.getLineObject().curve);
			allObject.push(line.getLineObject().direct1);
			allObject.push(line.getLineObject().direct2);
		} else {
			allObject.push(line.getLineObject());
		}
		allSide.push(line.getStartSideObject());
		allSide.push(line.getEndSideObject());
	}

	for(each of allObject) {
		each.opacity = 1;
		each.rotation = 0;
		each.scale = 1;
	}

	for(each of allSide) {
		each.opacity = 1;
		each.rotation = 0;
		each.scale = 1;
	}

	const flagObject = this._nodes[0].getNodeObject();

	nodeFunction = (frameCount) => {
		if(flagObject.scale < 0.005) {
			for(each of allObject) {
				each.scale = 0;
			}

			for(each of allSide) {
				each.opacity = 0;
			}

			this._canvas.unbind('update', nodeFunction);
			callback();
		} else {
			for(each of allObject) {
				let t = each.scale * 0.25;
				each.scale -= t;
			}

			for(each of allSide) {
				let t = each.opacity * 0.25;
				each.opacity -= t;
			}
		}
	};
	this._canvas.bind('update', nodeFunction).play();
};

/**
 * showGraphWithAnimation 方法: 根据用户设置, 生成图形出现的动画效果
 * @public
 * @param {Function} callback: 结束时的回调函数
 * @return {void}
 */
LinkListGraph.prototype.showGraphWithAnimation = function(callback) {
	let allObject = new Array();
	let allSide = new Array();

	for(node of this._nodes) {
		allObject.push(node.getNodeObject());
		allObject.push(node.getTextObject());
	}

	for(line of this._lines) {
		if(line.getType().curve) {
			allObject.push(line.getLineObject().curve);
			allObject.push(line.getLineObject().direct1);
			allObject.push(line.getLineObject().direct2);
		} else {
			allObject.push(line.getLineObject());
		}
		allSide.push(line.getStartSideObject());
		allSide.push(line.getEndSideObject());
	}

	for(each of allObject) {
		each.opacity = 1;
		each.rotation = 0;
		each.scale = 0;
	}

	for(each of allSide) {
		each.opacity = 0;
		each.rotation = 0;
		each.scale = 1;
	}

	const flagObject = this._nodes[0].getNodeObject();

	nodeFunction = (frameCount) => {
		if(flagObject.scale > 0.999) {
			for(each of allObject) {
				each.scale = 1;
			}

			for(each of allSide) {
				each.opaicty = 1;
			}

			this._canvas.unbind('update', nodeFunction);
			callback();
		} else {
			for(each of allObject) {
				let t = (1 - each.scale) * 0.25;
				each.scale += t;
			}

			for(each of allSide) {
				let t = (1 - each.opacity) * 0.25;
				each.opacity += t;
			}
		}
	};
	this._canvas.bind('update', nodeFunction).play();
};

LinkListGraph.prototype.bindNodeWithFunction = function(event, func) {
	let nodeObject = new Array();
	for(each of this._nodes) {
		nodeObject.push(each.getNodeObject()._renderer.elem);
	}

	for(elem of nodeObject) {
		elem.addEventListener(event, func, false);
	}
};

LinkListGraph.prototype._generateLineGroup = function() {
	let s = new Array();
	let tempSet;
	for(each of this._lines) {
		tempSet = new Set();
		if(each._type.curve) {
			tempSet.add(each.getLineObject().curve._renderer.elem);
			tempSet.add(each.getLineObject().direct1._renderer.elem);
			tempSet.add(each.getLineObject().direct2._renderer.elem);
			tempSet.add(each.getStartSideObject()._renderer.elem);
			tempSet.add(each.getEndSideObject()._renderer.elem);
		} else {
			tempSet.add(each.getLineObject()._renderer.elem);
			tempSet.add(each.getStartSideObject()._renderer.elem);
			tempSet.add(each.getEndSideObject()._renderer.elem);
		}
		s.push(tempSet);
	}
	this._lineGroup = s;
};

LinkListGraph.prototype.getRelatedLineSet = function(obj) {
	for(eachSet of this._lineGroup) {
		if(eachSet.has(obj)) {
			return eachSet;
		}
	}
	return null;
};

LinkListGraph.prototype.bindLineWithFunction = function(event, func) {
	if(this._lineGroup === null) {
		this._generateLineGroup();
	}
	//let i = 1;
	for(eachSet of this._lineGroup) {
		//console.log(i++);
		for(each of eachSet) {
			each.addEventListener(event, func, false);
		}
	}
};

LinkListGraph.prototype.getNodeIndex = function(node) {
	for(let i = 0; i < this._nodesCount; i++) {
		if(this._nodes[i].getNodeObject()._renderer.elem === node) {
			return i + 1;
		}
	}
};

LinkListGraph.prototype.getLineIndex = function(line) {
	let i = 0;
	for(eachSet of this._lineGroup) {
		i++;
		if(eachSet.has(line)) {
			return i;
		}
	}
};



// example
 
// const ll = new LinkListGraph();
// ll.createCanvas();
// ll.drawNodesAndLines([1, 3, 10, 12, -35, 24, 13, 0, 5, 4, 12, 54, 66, 88]);
// ll.update();
// let f = () => {
// 	console.log('f ran');
// 	ll.setNodeValue(3, -88);
// 	ll.setNodeShapeColor(5, '#FFFFFF');
// 	ll.setNodeTextColor(5, '#ABCDEF');
// 	ll.setLineColor(6, {
// 		line: '#9ADC12',
// 		start: '#AAAAAA',
// 		end: '#CCCC33',
// 		startInside: '#FFFFFF'
// 	});
// 	ll.setLineColor(8, {
// 		line: '#FD7712',
// 		start: '#123456',
// 		end: '#CCCC33',
// 		startInside: '#FFFFFF'
// 	});
// 	ll.update();
// 	ll.showGraphWithAnimation(() => {});
// };
// ll.hideGraphWithAnimation(f);
// // let elem = ll._nodes[0].getNodeObject()._renderer.elem;
// // console.log(elem);

// const anime = require('animejs');
// function animateButton(ob, op) {
//   ob.setAttribute('fill-opacity', op);
//   ob.setAttribute('stroke-opacity', op);
// }
// const enterButton = function(e) { 
// 	animateButton(e.target, 0.4);
// };
// const leaveButton = function(e) { 
// 	animateButton(e.target, 1) ;
// };

// ll.bindNodeWithFunction('mouseenter', enterButton);
// ll.bindNodeWithFunction('mouseleave', leaveButton);

// const enterLine = function(e) {
// 	const set = ll.getRelatedLineSet(e.target);
// 	for(each of set) {
// 		animateButton(each, 0.4);
// 	}
// };

// const leaveLine = function(e) {
// 	const set = ll.getRelatedLineSet(e.target);
// 	for(each of set) {
// 		animateButton(each, 1);
// 	}
// };

// ll.bindLineWithFunction('mouseenter', enterLine);
// ll.bindLineWithFunction('mouseleave', leaveLine);


// end of example

module.exports = LinkListGraph;