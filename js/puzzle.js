/**
 * @author Stevn Weng
 * Created on 2012-12-14
 */


/* 避免拖动效果失效， 禁用select事件 */
$(document).on('selectstart',function(){ return false; })

var puzzle = {};

// 页面控件缓存
puzzle.ctrls ={
	flImgSelector:$('#flImgSelector'),
	imgOrigin:$('#imgOrigin'),
	spnImgWidth:$('#spnImgWidth'),
	spnImgHeight:$('#spnImgHeight')
};

// 选择图片
function selectImg()
{
    var ctrls = puzzle.ctrls;

    ctrls.imgOrigin.on('load', function ()
    {
        loadOriginImg(this);
    }); 

    ctrls.imgOrigin.attr('src', getImgUrl());
    ctrls.imgOrigin.attr('alt', '');
}

// 加载原图
function loadOriginImg(imgObj)
{
    if (!!imgObj.complete)
    {
        var ctrls = puzzle.ctrls;
        ctrls.spnImgWidth.html(imgObj.width);
        ctrls.spnImgHeight.html(imgObj.height);
    }
}

// 获取图片路径
function getImgUrl()
{
    var ctrls = puzzle.ctrls,
        flImgSelector = ctrls.flImgSelector[0],
		imgUrl;
    
    if (flImgSelector.files && flImgSelector.files.length) // is firefox
    {
        imgUrl = window.URL.createObjectURL(flImgSelector.files[0]);
    }
    else
    {
		flImgSelector.select();
        imgUrl = document.selection.createRange().text;
    }
    return imgUrl;
}

// 开始游戏
function startGame()
{
	unbindFlagEvents();
	cutImg();	
	bindFlagEvents();
	puzzle.ctrls.imgOrigin.hide();
}

// 切割图片并加载到游戏区
function cutImg(){	
	var	imgOrigin = puzzle.ctrls.imgOrigin[0],
		imgWidth = imgOrigin.width,
		imgHeight = imgOrigin.height,
		playField = buildPlayField(imgWidth,imgHeight),
		originalCells = createFlags(puzzle.ctrls.imgOrigin[0],4,4),	
		mixedCells = mixUpCells(originalCells),
		ul = document.createElement("ul"); 
	fillUl(ul, mixedCells);
	playField.appendChild(ul);
	$('.content').append(playField);
}

// 创建游戏区
function buildPlayField( width, height )
{
	$('#divPlayField').remove();
	var playField = document.createElement("div");
	playField.id="divPlayField";
	playField.style.cssText = "border:1px solid #000;height:"+height+"px;width:"+width+"px;";
	return playField;
}

// 切割原图并创建拼图块
function createFlags(img,hozCount,verCount)
{
	var	imgOrigin = img,
		imgWidth = imgOrigin.width,
		imgHeight = imgOrigin.height,
		cellWidth = parseInt(imgWidth/hozCount),
		cellHeight = parseInt(imgHeight/verCount);

	var cells = [],
		li;

	for(var y=0; y<verCount; y++)
	{
		for(var x=0; x<hozCount; x++)
		{			
			key = +x+y*verCount;
			var li = createNewFlag(x, y, key, cellWidth, cellHeight, imgOrigin.src);
			cells.push(li);
		}		
	}
	return cells;
}

// 创建新的拼图块
function createNewFlag(x,y,key,width,height,backgroundSrc)
{
	position = '-'+x*width+'px -'+ y*height+'px';
	var li = document.createElement("li");
	const marginSpace = 2;
	$(li).attr({x:x,y:y,key:key})
				.css({
					'background-image':"url("+ backgroundSrc +")",
					'background-position':position,
					'display':'block',
					'float':'left',
					'height':(height - marginSpace)+"px",
					'overflow':'hidden',
					'width':(width - marginSpace)+"px"
				});
	return li;
}

/* 洗牌算法 */
function mixUpCells(cells)
{
	console.log('cells:', cells)
	return cells.sort(function(){ return Math.random()-0.5});
}

// 用li数组填充UL对象
function fillUl(ul, liArray)
{
	$(ul).append(liArray);
}

// 设置拼图块选中状态
function setFlagSelected(flag)
{
	var flag = $(flag);
	if(flag.length==0)
	{
		return false;
	}
	var sizeStyle = calculateFlagTargetSize(flag),
		currentPosition = calculateFlagTargetBackgrounPosition(flag);

	$(flag).attr('selected','selected')
			.css({
				'background-position':currentPosition,
				'border':'solid 1px #000',
				'width': sizeStyle.width,
				'height': sizeStyle.height
		});
}

// 取消拼图块选中状态
function cancelFlagSelected(flag)
{
	var flag = $(flag);
	if(flag.length==0)
	{
		return false;
	}
	var sizeStyle = calculateFlagTargetSize(flag),
		currentPosition = calculateFlagTargetBackgrounPosition(flag);

	$('#divPlayField li[selected=selected]')
		.removeAttr('selected')
		.css({
			'background-position':currentPosition,
			'border':'none',
			'width':sizeStyle.width,
			'height':sizeStyle.height
	});
}

// 计算拼图块目标尺寸
function calculateFlagTargetSize(flag)
{
	var flag = $(flag),
		selected = flag.attr('selected'),
		originalWidth = parseInt($(flag).css('width')),
		originalHeight = parseInt($(flag).css('height')),
		interval =  selected==='selected'? 2:-2,
		width = +originalWidth+interval,
		height =  +originalHeight+interval
	return {width: width, height:height};
}

// 计算拼图块目标背景坐标
function calculateFlagTargetBackgrounPosition(flag)
{
	var flag = $(flag),
		selected = flag.attr('selected'),
		originalPositionInfo = getFlagBackgroundPosition(flag),
		originalPositionLeft = originalPositionInfo.left,
		originalPositionTop = originalPositionInfo.top,
		interval =  selected==='selected'? 1:-1,
		currentPosition =  (originalPositionLeft+interval)+'px '+(originalPositionTop+interval)+'px';
	return currentPosition;
}

// 获取拼图块背景坐标
function getFlagBackgroundPosition(flag)
{
	var flag = $(flag),
		position = flag.css('background-position'),		
		reg = /([^ ]+px)/g,
		positions = position.match(reg);
		positionLeft = parseInt(positions[0]),
		positionTop = parseInt(positions[1]),
		positionInfo = { left: positionLeft, top: positionTop};
	return positionInfo;
}

// 调换拼图块位置
function swap(flagA, flagB)
{
	var flagA = $(flagA)[0],
		flagB = $(flagB)[0];

	if(!flagA || !flagB || flagA == flagB)
	{
		return false;
	}

	var flagAHtml =  flagA.outerHTML,
		flagBHtml =  flagB.outerHTML;

	flagA.outerHTML = flagBHtml;
	flagB.outerHTML = flagAHtml;
}

// 绑定拼图块事件
function bindFlagEvents()
{
	$(document).on('mousedown','#divPlayField li',function(){
		var selectedFlag = getSelectedFlag();		
		if(selectedFlag.length==0)
		{		
			setFlagSelected(this);
		}
		else
		{
			swap(this,selectedFlag);
			cancelFlagSelected(selectedFlag);
		}
	}).on('mouseup','#divPlayField li',function(){
		var selectedFlag = getSelectedFlag();	
		if(selectedFlag[0] == this)
		{
			return false;
		}

		cancelFlagSelected(selectedFlag);
		swap(this,selectedFlag);

		if(checkPuzzleComplete())
		{
			gameOver();
		}
	});
}

// 获取被选中的拼图块
function getSelectedFlag()
{
	return $('#divPlayField ul li[selected=selected]');
}

// 判断拼图是否完成
function checkPuzzleComplete()
{
	var prevKey = 0,
		complete = true;

	$('#divPlayField ul li').each(function(i, li){
		var me = $(li),
			key = me.attr('key')
			 
		if(key != prevKey)
		{	
			complete = false;
			return false;
		}
		else
		{
			prevKey = +key+1;
		}
	});
	return complete;
}

// 游戏结束，取消事件绑定
function gameOver()
{
	alert('Puzzle Complete. Game Over.');
	unbindFlagEvents();
}

//　取消事件绑定
function unbindFlagEvents()
{
	$(document).off('mousedown','#divPlayField li').off('mouseup','#divPlayField li');
}