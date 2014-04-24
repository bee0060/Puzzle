/**
 * @author Stevn Weng
 * Created on 2012-12-14
 */
var puzzle = {};

puzzle.ctrls ={
	flImgSelector:$('#flImgSelector'),
	imgOrigin:$('#imgOrigin'),
	spnImgWidth:$('#spnImgWidth'),
	spnImgHeight:$('#spnImgHeight')
};

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

function loadOriginImg(imgObj)
{
    if (!!imgObj.complete)
    {
        var ctrls = puzzle.ctrls;
        ctrls.spnImgWidth.html(imgObj.width);
        ctrls.spnImgHeight.html(imgObj.height);
    }
}

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

function startGame()
{
	unbindFlagEvents();
	cutImg();	
	bindFlagEvents();
}

function cutImg(){	
	var	imgOrigin = puzzle.ctrls.imgOrigin[0],
		imgWidth = imgOrigin.width,
		imgHeight = imgOrigin.height,
		playField = getPlayField(imgWidth,imgHeight),
		originalCells = createFlags(puzzle.ctrls.imgOrigin[0],4,4),	
		mixedCells = mixUpCells(originalCells),
		ul = document.createElement("ul"); 
	fillUl(ul, mixedCells);
	playField.appendChild(ul);
	$('.content').append(playField);
}

function getPlayField( width, height )
{
	$('#divPlayField').remove();
	var playField = document.createElement("div");
	playField.id="divPlayField";
	playField.style.cssText = "border:1px solid #000;height:"+height+"px;width:"+width+"px;";
	return playField;
}

function createFlags(img,hozCount,verCount)
{
	var	imgOrigin = img,
		imgWidth = imgOrigin.width,
		imgHeight = imgOrigin.height,
		cellWidth = parseInt(imgWidth/hozCount),
		lastCellWidth = imgWidth- cellWidth*hozCount;
		cellHeight = parseInt(imgHeight/verCount),
		lastCellHeight = imgHeight-cellHeight*verCount;
	 
	hozCount += (lastCellWidth > 0 ? 1 : 0);
	verCount += (lastCellHeight > 0 ? 1 : 0);
	
	lastCellWidth = cellWidth;
	lastCellHeight = cellHeight;
	
	var cells = [],
		li,
		currentCellWidth, currentCellHeight,
		currentPosition;

	for(var y=0; y<verCount; y++)
	{
		for(var x=0; x<hozCount; x++)
		{			
			li = document.createElement("li");
			$(li).attr({x:x,y:y,key:+x+y*verCount});

			currentCellWidth = (x==hozCount-1 ? lastCellWidth : cellWidth);
			currentCellHeight = (y==verCount-1 ? lastCellHeight : cellHeight);
			currentPosition = '-'+x*currentCellWidth+'px -'+y*currentCellHeight+'px'
			
			$(li).css({
				'background-image':"url("+imgOrigin.src+")",
				'background-position':currentPosition,
				'display':'block',
				'float':'left',
				'height':(currentCellHeight-2)+"px",
				'overflow':'hidden',
				'width':(currentCellWidth-2)+"px"});
			cells.push(li);
		}		
	}
	return cells;
}

function createNewFlag(x,y,key,width,height,backgroundSrc)
{
	//TODO 看能否把创建单个flag的逻辑抽离出来
}

/* 洗牌算法 */
function mixUpCells(cells)
{
	return cells.sort(function(){ return Math.random()-0.5});
}

function fillUl(ul, liArray)
{
	$(ul).append(liArray);
}

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

function gameOver()
{
	alert('Puzzle Complete. Game Over.');
	unbindFlagEvents();
}

function getSelectedFlag()
{
	return $('#divPlayField ul li[selected=selected]');
}

function unbindFlagEvents()
{
	$(document).off('mousedown','#divPlayField li').off('mouseup','#divPlayField li');
}