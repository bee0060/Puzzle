/**
 * @author Stevn Weng
 * Created on 2012-12-14
 */

var puzzle = {};

puzzle.ctrls ={
	flImgSelector:$('#flImgSelector'),
	btnSelectImg:$('#btnSelectImg'),
	imgOrigin:$('#imgOrigin'),
	spnImgUrl:$('#spnImgUrl'),
	spnImgSize:$('#flImgSelector'),
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

function calValidCutModule(width, height)
{
	
    return {x:10,y:10};	
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

        ctrls.spnImgUrl.html(decodeURI(imgObj.src));
        ctrls.spnImgSize.html(imgObj.size);
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

function showDifficultLevel()
{
	var modes = CUT_MODES,
		ulModeList = $('#ulModeList'),
		frag = document.createDocumentFragment(),
		li,
		rad,
		lab;
		 
	for(var i =0;i<modes.length;i++)
	{
		li = document.createElement('li');
		rad = document.createElement('input');
		rad.type = 'radio';
		rad.name = 'mode';
		rad.VSplitCount = modes[i].VSplitCount;
		rad.HSplitCount = modes[i].HSplitCount;
		
		lab = document.createElement('label');
		lab.innerHTML = modes[i].Name;
		
			
		li.appendChild(rad);
		li.appendChild(lab);	
		
		frag.appendChild(li);
	}
	
	ulModeList.append(frag);
}


function isArray(obj)
{
	return Object.prototype.toString.call(obj).toLocaleLowerCase().indexOf("array")>-1;	
}
