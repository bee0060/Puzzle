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
    imgSrc:"";
};


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