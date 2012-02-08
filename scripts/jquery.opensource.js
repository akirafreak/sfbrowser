
(function(obj,fns){
	var p = obj.prototype;
	for (var s in fns) if (!obj[s]) p[s] = fns[s];
})(Number,{
    secondsToMinutesString: function(f){
        return (''+parseInt(f/60)).pad(2,0,true)+':'+(''+parseInt(f)%60).pad(2,0,true);
    }
	,formatSize: function(round) {
		var i, size = this;
		if (round===undefined) round = 0;
		var aSizes = ['B','kB','MB','GB','TB','PB','EB','ZB','YB'];
		for (i=0; size>1024&&(aSizes.length>=(i+2));i++) size /= 1024;
		return Math.round(size,round)+aSizes[i];
	}
});

if (OPENSOURCE===undefined) {
var OPENSOURCE = (function($){
	var oProject, fnCallback;
	function init(project,fnc){
		$(function(){
			oProject = project;
			fnCallback = fnc;
			setHeader();
			setMenu();
			setLatestDownloads();
			calculateFileSizes();
			setFooter();
			addFlattr();
			//testForErrors();
			fnCallback();
		});
	}
	function setHeader(){
		var sTitle = oProject.id+' '+oProject.version;
		document.title = sTitle;
		$('h1').html(sTitle.replace(/(\d+\.\d+\.)(\d+)/g,'$1<small>$2</small>'));
	}
	function setMenu(){
		var $Menu = $('<ul/>').appendTo('header>div>nav');
		$('<li><a href="#"></a></li>').appendTo($Menu).click(function(){$(document).scrollTop(0)});
		var $Li,$SubMenu;
		$('body h2,body h3').each(function(i,el){
			var sNode = el.nodeName.toLowerCase();
			var $Elm = $(el);
			var sTitle = $Elm.attr('title')||$Elm.text();
			var sId = sTitle.replace(/[^a-z0-9]/gi,'');
			$('<a id="'+sId+'" class="hiddenAnchor"/>').prependTo($Elm);
			var bH2 = sNode=='h2';
			var $H = $('<li><a href="#'+sId+'">'+sTitle+'</a></li>').appendTo(bH2?$Menu:$SubMenu);
			if (bH2) {
				$Li = $H;
				$SubMenu = $('<ul></ul>');
			}
			if ($SubMenu&&$SubMenu.find('li').length) $SubMenu.appendTo($Li);
		});
	}
	function setFooter(){
		$('#footer>div').html(
			oProject.copyright
				.replace('Ron Valstar','<a href="http://www.sjeiti.com/">Ron Valstar</a>')
				.replace(/-[0-9]{4}/g,'-'+(new Date()).getFullYear())
		);
	}
	function setLatestDownloads(){
		$('a.download[href*=".zip"]').each(function(i,el){
			var $A = $(el);
			$A.attr('href',$A.attr('href').replace(/\d+\.\d+\.\d+/g,oProject.version));
		});
	}
	function calculateFileSizes(){
		var oSizeLib = {};
		$('.filesize').each(function(i,el){
			var $Size = $(el);
			var sFile = $Size.data('file')||$Size.parents('[href]:first').attr('href');
			function setSizes(load){
				$.each(load.targets,function(i,$El){
					setSize($El,load.size);
				});
			}
			function setSize($El,size){
				$El.text(size.formatSize());
			}
			var oLoad = oSizeLib[sFile]||null;
			if (oLoad&&oLoad.loaded) { // size was calculated
				setSize($El,oLoad.size);
			} else if (oLoad) { // file is loading
				oLoad.targets.push($Size);
			} else { // new file
				oLoad = {loaded:false,targets:[$Size]};
				oSizeLib[sFile] = oLoad;
				$.get(sFile,function(data){
					oLoad.loaded = true;
					oLoad.size = data.length;
					setSizes(oLoad);
				});
			}
		});
	}
	function testForErrors(){
		var aFiles = [
			'scripts/jquery.'+oProject.id+'.js'
			,'scripts/jquery.opensource.js'
			,'index.html'
			,'text.html'
			,'foo.bar'
		];
		var iFiles = aFiles.length;
		var bOk = true;
		$.each(aFiles,function(i,sFile){
			$.get(sFile,function(data){
				if (!!data.match(/console.log\(/g)) {
					$('header').css({border:'2px solid red'});
				}
			});
		});
	}
	function addFlattr(){
		$('<span class="flattrBox"><a class="FlattrButton" href="http://'+oProject.id+'.sjeiti.com/"></a></span>').appendTo('#intro>div');
		// flattr code
		var s = document.createElement('script'), t = document.getElementsByTagName('script')[0];
		s.type = 'text/javascript';
		s.async = true;
		s.src = 'http://api.flattr.com/js/0.6/load.js?mode=auto';
		t.parentNode.insertBefore(s, t);
	}
	function copyCode(){ // pre // todo: make it so
			/*var oKeys = [];
			$(window).keydown(function(e){
				oKeys[e.keyCode] = true;
				var CTRL = oKeys[17];

                var txt = '';
				if (window.getSelection) txt = window.getSelection();
				else if (document.getSelection) txt = document.getSelection();
				else if (document.selection) txt = document.selection.createRange().text;

				if (CTRL&&e.keyCode===65) {
					return false;
				}
			}).keyup(function(e){
				oKeys[e.keyCode] = false;
			});*/
	}
	return {
		init:init
	};
})(jQuery);
}