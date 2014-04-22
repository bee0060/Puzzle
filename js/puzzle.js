/**
 * @author Stevn Weng
 * Created on 2012-12-14
 */
var puzzle = {};

puzzle.ctrls ={
	flImgSelector:$('#flImgSelector'),
	btnStartGame:$('#btnStartGame'),
	imgOrigin:$('#imgOrigin'),
	spnImgWidth:$('#spnImgWidth'),
	spnImgHeight:$('#spnImgHeight')
};

puzzle.variables = {
    imgSrc: ""
};

puzzle.modules = ["7*7","8*6","6*8"];

function selectImg()
{
    var ctrls = puzzle.ctrls,
		fileObj = ctrls.flImgSelector[0].files.item(0);


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

        puzzle.variables.src= imgObj.src;
    }
}

function getImgUrl()
{
    var ctrls = puzzle.ctrls,
        flImgSelector = ctrls.flImgSelector[0],
			imgUrl;
    
    if (window.getSelection) // is firefox
    {
        imgUrl = window.URL.createObjectURL(flImgSelector.files[0]);
    }
    else
    {
        imgUrl = flImgSelector.value;
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
		hozCount = 4, verCount = 4, 
		cellWidth = parseInt(imgWidth/hozCount),
		lastCellWidth = imgWidth- cellWidth*hozCount;
		cellHeight = parseInt(imgHeight/verCount),
		lastCellHeight = imgHeight-cellHeight*verCount;
	 
	hozCount += (lastCellWidth > 0 ? 1 : 0);
	verCount += (lastCellHeight > 0 ? 1 : 0);
	
	lastCellWidth = cellWidth;
	lastCellHeight = cellHeight;
	
	$('#divPlayField').remove();
	var playField = document.createElement("div");
	playField.id="divPlayField";
	playField.style.cssText = "border:1px solid #000;height:"+imgHeight+"px;width:"+imgWidth+"px;";
	
	var cells = [],
		mixedCells,
		ul = document.createElement("ul"),
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
	
	mixedCells = mixUpCells(cells);
 
	fillUl(ul, mixedCells);

	playField.appendChild(ul);
	$('.content').append(playField);
}

/* 洗牌算法 */
function mixUpCells(cells)
{
	return cells.sort(function(){ return Math.random()-0.5});
}

function fillUl(ul, liArray)
{
	for( var i =0;i<liArray.length;i++)
	{
		$(ul).append(liArray[i]);
	}	
}

function setFlagSelected(flag)
{
	var flag = $(flag),		
		sizeStyle = calculateUnSelectSizeStyleFromSelectedFlag(flag),
		currentPosition = calculateUnSelectedBackgroundPositionStyleFromSelectedFlag(flag);

	$(flag).attr('selected','selected')
			.css({
				'background-position':currentPosition,
				'border':'solid 1px #000',
				'width': sizeStyle.width,
				'height': sizeStyle.height
		});
}

function calculateUnSelectSizeStyleFromSelectedFlag(flag)
{
	var flag = $(flag),
		originalWidth = parseInt($(flag).css('width')),
		originalHeight = parseInt($(flag).css('height')),
		width = originalWidth-2,
		height = originalHeight-2;

	return {width: width, height:height};
}

function calculateUnSelectedBackgroundPositionStyleFromSelectedFlag(flag)
{
	var flag = $(flag),
		originalPositionInfo = getFlagBackgroundPosition(flag),
		originalPositionLeft = originalPositionInfo.left,
		originalPositionTop = originalPositionInfo.top,
		currentPosition = (originalPositionLeft-1)+'px '+(originalPositionTop-1)+'px';
	return currentPosition;
}

function cancelFlagSelected(flag)
{
	var flag = $(flag),
		sizeStyle = calculateSelectedSizeStyleFromUnSelectFlag(flag),
		currentPosition = calculateSelectedBackgroundPositionStyleFromUnSelectedFlag(flag);

	$('#divPlayField li[selected=selected]')
		.removeAttr('selected')
		.css({
			'background-position':currentPosition,
			'border':'none',
			'width':sizeStyle.width,
			'height':sizeStyle.height
	});
}

function calculateSelectedSizeStyleFromUnSelectFlag(flag)
{
	var flag = $(flag),
		originalWidth = parseInt($(flag).css('width')),
		originalHeight = parseInt($(flag).css('height')),
		width = originalWidth+2,
		height = originalHeight+2;

	return {width: width, height:height};
}

function calculateSelectedBackgroundPositionStyleFromUnSelectedFlag(flag)
{
	var flag = $(flag),
		originalPositionInfo = getFlagBackgroundPosition(flag),
		originalPositionLeft = originalPositionInfo.left,
		originalPositionTop = originalPositionInfo.top,
		currentPosition = (originalPositionLeft+1)+'px '+(originalPositionTop+1)+'px';
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
	var flagAHtml = $(flagA)[0].outerHTML;
	var flagBHtml = $(flagB)[0].outerHTML;

	$(flagA)[0].outerHTML = flagBHtml;
	$(flagB)[0].outerHTML = flagAHtml;
}

function checkPuzzleComplete()
{
	var prevKey = 0;
	var complete = true;

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
			prevKey = key;
		}
	});
	return complete;
}

function bindFlagEvents()
{
	$(document).on('mousedown','#divPlayField li',function(){
		setFlagSelected(this);
	}).on('mouseup','#divPlayField li',function(){
		var selectedFlag = getSelectedFlag();		
		cancelFlagSelected(selectedFlag);
		swap(this,selectedFlag);

		if(checkPuzzleComplete())
		{
			alert('Puzzle Complete. Game Over.');
			unbindFlagEvents();
		}
	});
}

function getSelectedFlag()
{
	return $('#divPlayField ul li[selected=selected]');
}

function unbindFlagEvents()
{
	$(document).off('mousedown','#divPlayField li').off('mouseup','#divPlayField li');
}
