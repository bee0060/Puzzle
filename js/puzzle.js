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

function loadValidCutModule(moduleArr)
{
	var ulModuleList = $('#ulModuleList');
	if(isArray(moduleArr)&&moduleArr.length>0)
	{
		for(var i =0;i<moduleArr.length;i++)
		{
			
		}	
	}
	
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
	var cellCount = cells.length,
		seed = cellCount,
		randomNum,
		pointInt,
		pointCell,
		outputCells =[];

	while(seed>0){
		pointInt = Math.round(Math.random()*seed-0.5);
		pointCell = cells.splice(pointInt,1);

		outputCells.push(pointCell);
		
		seed--;
	} 
	return outputCells;
}

function fillUl(ul, liArray)
{
	for( var i =0;i<liArray.length;i++)
	{
		$(ul).append(liArray[i]);
	}	
}


function clickFlag(flagObj)
{
	var flag = $(flagObj);
	var otherHasSelectedFlag = flag.parent().find('[selected=selected]').not(flag);
	
	if(flag.attr('selected')=='selected')
	{
		cancelFlagSelectedStyle(flag);
		return false;
	}
	if(flag.attr('selected')!='selected' && otherHasSelectedFlag.length == 0)
	{
		setFlagSelectedStyle(flag);
		return false;
	}
	if(flag.attr('selected')!='selected' && otherHasSelectedFlag.length > 0)
	{
		change(flag,otherHasSelectedFlag);
		cancelFlagSelectedStyle(otherHasSelectedFlag);
		if(checkPuzzleComplete())
		{
			alert('Puzzle Complete. Game Over.');
			unbindFlagEvents();
		}
		return false;
	}
}

function setFlagSelectedStyle(flag)
{
	var flag = $(flag),
		x = flag[0].x,
		y = flag[0].y,
		originalPosition = flag.css('background-position'),
		originalWidth = parseInt($(flag).css('width')),
		originalHeight = parseInt($(flag).css('height')),
		reg = /([^ ]+px)/g,
		positions = originalPosition.match(reg);
		originalPositionLeft = parseInt(positions[0]),
		originalPositionTop = parseInt(positions[1]),
		currentPosition = (originalPositionLeft-1)+'px '+(originalPositionTop-1)+'px',

		width = originalWidth-2,
		height = originalHeight-2;
			
	$(flag).attr('selected','selected')
			.css({
				'background-position':currentPosition,
				'border':'solid 1px #000',
				'width':width,
				'height':height
		});
}

function getSelectedFlag()
{
	return $('#divPlayField ul li[selected=selected]');
}

function cancelFlagSelectedStyle(flag)
{
	var flag = $(flag),
		x = flag.attr('x'),
		y = flag.attr('y'),
		originalPosition = flag.css('background-position'),
		originalWidth = parseInt($(flag).css('width')),
		originalHeight = parseInt($(flag).css('height')),
		reg = /([^ ]+px)/g,
		positions = originalPosition.match(reg);
		originalPositionLeft = parseInt(positions[0]),
		originalPositionTop = parseInt(positions[1]),
		currentPosition = (originalPositionLeft+1)+'px '+(originalPositionTop+1)+'px',

		width = originalWidth+2,
		height = originalHeight+2;
	$('#divPlayField li[selected=selected]')
		.removeAttr('selected')
		.css({
			'background-position':currentPosition,
			'border':'none',
			'width':width,
			'height':height
	});
}


function change(flagA, flagB)
{
	var flagAHtml = $(flagA)[0].outerHTML;
	var flagBHtml = $(flagB)[0].outerHTML;

	$(flagA)[0].outerHTML = flagBHtml;
	$(flagB)[0].outerHTML = flagAHtml;
}

function checkPuzzleComplete()
{
	var prevKey = -1;
	var complete = true;

	$('#divPlayField ul li').each(function(i, li){
		var me = $(li),
			key = me.attr('key')
		if(key!=+prevKey+1)
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
		setFlagSelectedStyle(this);
	}).on('mouseup','#divPlayField li',function(){
		var selectedFlag = getSelectedFlag();		
		cancelFlagSelectedStyle(selectedFlag);
		change(this,selectedFlag);

		if(checkPuzzleComplete())
		{
			alert('Puzzle Complete. Game Over.');
			unbindFlagEvents();
		}
	});
}

function unbindFlagEvents()
{
	$(document).off('mousedown','#divPlayField li').off('mouseup','#divPlayField li');
}
