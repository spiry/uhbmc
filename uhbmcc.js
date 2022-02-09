
// Called to read the contents of a cookie. Cookies are stores as key-value pairs, several cookies for one document are seperated by a ';'.
function _getCookie(_key)
{
	var _value="";
	if(document.cookie)
	{
		var _ckon=true;
		if(navigator.cookieEnabled)
		{
			_ckon=navigator.cookieEnabled;
		}
		if(_ckon)
		{
			var _cka=document.cookie.split("; ")
			for(var _i=0;_i<_cka.length;_i++)
			{
				var _cko=_cka[_i];
				var _sep=_cko.indexOf("=");
				if(_cko.substring(0,_sep)==_key)
				{
					_value=_cko.substring(_sep+1,_cko.length);
					break;
				}
			}
		}
	}
	return _value;
}

// Called to store a cookie.
function _setCookie(_key,_value)
{
	var _ckon=true;
	if(navigator.cookieEnabled)
	{
		_ckon=navigator.cookieEnabled;
	}
	if(_ckon)
	{
		var _expTime=1000*60*60*24*365;
		var _now=new Date();
		var _timeOut=new Date(_now.getTime()+_expTime);
		document.cookie=_key+"="+_value+";expires="+_timeOut.toGMTString()+";samesite=strict;";
	}
}

// Called within the onLoad() chain to restore the skin of a loaded page
// The change is done by replacing the CSS node with the id "cst".
function _restoreSkinColor(_useLower)
{
	if(document.getElementById)
	{
		var _aLink=document.getElementById("cst");
		if(_aLink)
		{
			var _color=_getCookie("UHBMCC");
			if(_color&&_color.length<=10)
			{
			}
			else
			{
				_color="bk";
			}

			var _cst=_aLink.href;
			var _i=_cst.lastIndexOf(".");
			var _j=_cst.lastIndexOf("/");
			var _css=_cst.substring(_j+1,_i-2)+_color+".css";
			if(_useLower)
				_css=_css.toLowerCase();
			else
				_css=_css.toUpperCase();
			_aLink.href=_cst.substring(0,_j+1)+_css;
		}
	}
}

// This is the common function for loading a page. It must be called either in the onLoad() of that page or by another function that is called in the onLoad() chain.
// For now it does not do more than restoring the skin color.
function loadPage(_useLower)
{
	//alert("P="+window.location.href);
	_restoreSkinColor(_useLower);

	var _show=false;
	var _hash=document.location.hash;
	var _hashLen=_hash.length;
	if(_hashLen>0)
	{
		if(_hash.substr(_hashLen-2)=="FT")
		{
			_show=true;
		}
	}
	
	showAll(_show);
}

// Called by the user when s/he presses a button to save the actual skin color.
function setSkinColor(_useLower,_color)
{
	_setCookie("UHBMCC",_color);
	_restoreSkinColor(_useLower);
}



// Called by onLoad() of the search file for series, step 2
// This part performs the actual search.
function searchSeries(_useLower)
{
	loadPage(_useLower);

	// Remove children of result node
	var _resNode=document.getElementById("resnod");
	while(_chldNode=_resNode.firstChild)
	{
		_resNode.removeChild(_chldNode);
	}

	var _params=location.search;
	if(_params.length>0)
	{
		var _paramList=_params.substring(1).split('&');
		var _wrdList=new Array();
		var _op=0;
		for(var _i=0;_i<_paramList.length;_i++)
		{
			var _par=_paramList[_i];
			if(_par=="o=o")
			{
				_op=1;
			}
			else if(_par.substr(0,2)=="t=")
			{
				var _txt=_par.substr(2).toLowerCase();
				if(_txt.length>0)
				{
					_wrdList=_txt.split("+");
				}
			}
		}
		if(_wrdList.length>0)
		{
			var _filterText=document.getElementById("filtxt");
			var _rbtAll=document.getElementById("rbtall");
			var _rbtAny=document.getElementById("rbtany");
			var _text = "";
			var _aList=document.getElementById("Data").getElementsByTagName("a");
			for(var _i=0;_i<_aList.length;_i++)
			{
				var _aNode=_aList[_i];
				var _fnd=0;
				var _ndText=_aNode.innerHTML.toLowerCase();
				if(_op==0) _fnd=1;
				for(var _j=0;_j<_wrdList.length;_j++)
				{
					var _inx=_ndText.indexOf(_wrdList[_j]);
					if(_inx>=0)
					{
						if(_op==1)
						{
							_fnd=1;
							break;
						}
					}
					else
					{
						if(_op==0)
						{
							_fnd=0;
							break;
						}
					}
				}
				if(_fnd==1)
				{
					var _imgNode=_aNode.nextSibling;
					var _brNode=_imgNode.nextSibling;
					if(_imgNode.nodeName.toLowerCase()!="img")
					{
						_brNode=_imgNode;
						_imgNode=null;
					}
					_resNode.appendChild(_aNode.cloneNode(true));
					if(_imgNode) _resNode.appendChild(_imgNode.cloneNode(true));
					_resNode.appendChild(_brNode.cloneNode(true));
				}
			}

			for(var _j=0;_j<_wrdList.length;_j++)
			{
				if(_j>0) _text=_text+" ";
				_text = _text+_wrdList[_j];
			}
			_filterText.value=_text;
			if(_op==0) _rbtAll.checked=true;
			if(_op==1) _rbtAny.checked=true;
		}
	}
}

function clearSearch(_srchFile)
{
	window.location.href=_srchFile;
}

// Called when the user presses the show/hide button for a single hidden table.
function show(_elem,_state)
{
	if(document.getElementById)
	{
		var obj = document.getElementById(_elem);
		if (obj)
			if(_state)
				obj.style.display='';
			else
				obj.style.display='none';
	}
}

// Called when the user presses the show/hide button for all hidden tables of one document.
function showAll(_state)
{
	if(document.getElementsByTagName)
	{
		var _aDivs=document.getElementsByTagName("div")
		for(var _i=0;_i<_aDivs.length;_i++)
		{
			var _aDiv=_aDivs[_i];
			if(_aDiv.id.length>0&&_aDiv.id.substr(0,4)=="togg")
			{
				_aDiv.style.display=_state?"inline":"none";
			}
		}
	}
}

// Called by onKeyPress() of the filter/search text input field. Needed to catch the ENTER key.
function onEnter(_e)
{
	var _key;
	if(window.event)
		_key=window.event.keyCode; //IE
	else
		_key=_e.which; //firefox

	if(_key==13)
	{
		applyFilter();
		return false;
	}
	else
		return true;
}

// Called when the user presses the "Apply" button of the filter/search form.
// It splits the given search text into words.
// It loops through all links of the document and checks whether any or all search words are part of the link's text.
function applyFilter()
{
	removeFilterResults();

	var _txt=document.getElementById("filtxt").value.toLowerCase();
	if(_txt.length>0)
	{
		document.getElementById("restab").style.display="block";

		var _resNode=document.getElementById("resnod");
		var _op=0;
		if(document.getElementById("rbtany").checked==true)
			_op=1;

		var _wrdList=_txt.split(' ');
		if(_wrdList.length>0)
		{
			var _aList=document.getElementsByTagName("a");
			for(_i=0;_i<_aList.length;_i++)
			{
				_aNode=_aList[_i];
				if(_aNode.className==""&&_aNode.firstChild&&_aNode.firstChild.data)
				{
					var _fnd=0;
					var _ndText=_aNode.firstChild.data.toLowerCase();
					if(_op==0) _fnd=1;
					for(var _j=0;_j<_wrdList.length;_j++)
					{
						var _inx=_ndText.indexOf(_wrdList[_j]);
						if(_inx>=0)
						{
							if(_op==1)
							{
								_fnd=1;
								break;
							}
						}
						else
						{
							if(_op==0)
							{
								_fnd=0;
								break;
							}
						}
					}
					if(_fnd==1)
					{
						_resNode.appendChild(_aNode.cloneNode(true));
						var _brNode=document.createElement("br");
						_resNode.appendChild(_brNode);
						_i++;
					}
				}
			}
		}
	}
}

// Called when the user presses the "Reset" button in the filter/search form or when a new search is begun.
function removeFilterResults()
{
	document.getElementById("restab").style.display="none";

	var _resNode=document.getElementById("resnod");
	while(_chldNode=_resNode.firstChild)
	{
		_resNode.removeChild(_chldNode);
	}
}
