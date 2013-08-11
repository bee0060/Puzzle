/**
 * @author Steven Weng
 * 存放公用方法
 */



function isArray(obj)
{
	return Object.prototype.toString.call(obj).toLocaleLowerCase().indexOf("array")>-1;	
}


function initialObjsByID(type)
{
	var objsWithID = $('[id]'),
		tempArr = null,
		getTagetObj = function(obj){
			if(type=='$' || type.toLocaleLowerCase()=='jquery'){ 
				return $(obj);
			}
			else{
				return obj;
			}

		}

	objsWithID.each(function(i,o){
		if(typeof window[o.id]=='undefined')
		{
			window[o.id] = getTagetObj(o);
		}
		else if(typeof window[o.id]=='object' && !isArray(window[o.id]))
		{
			tempArr=[];
			tempArr.push(window[o.id],getTagetObj(o));
			window[o.id]=tempArr;
			tempArr=null;
		}
		else if(typeof window[o.id]=='object' && isArray(window[o.id]))
		{
			window[o.id].push(getTagetObj(o));
		}
	});
}