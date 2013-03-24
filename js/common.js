/**
 * @author Steven Weng
 * 存放公用方法
 */



function isArray(obj)
{
	return Object.prototype.toString.call(obj).toLocaleLowerCase().indexOf("array")>-1;	
}

