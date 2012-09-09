/**
	Kickstart-Lite

	This is a library without using jQuery (use intead of Sizzle),
	layout feature was limited to only remove the action method.

	@author Yoshiaki Sugimoto <neo.yoshiaki.sugimoto@gmail.com>
/*
	Original:
	99Lime.com HTML KickStart by Joshua Gatcke
	kickstart.js
*/

(function() {
	
	if ( ! window.KL ) {
		window.KL = {};
	}
	
	// Some utility functions
	function hasClass(node, klass) {
		return ( (' ' + node.className + ' ').indexOf(' ' + klass + ' ') !== -1 ) ? true : false;
	}
	function addClass(node, klass) {
		if ( hasClass(node, klass) ) {
			return;
		}
		if ( node.className === '' ) {
			node.className = klass;
		} else {
			node.className += ' ' + klass;
		}
	}

	function removeClass(node, klass) {
		var ary = node.className.split(' '),
			length = ary.length,
			i  = 0;
			removed = [],
			ind = -1;

		for (; i < length; ++i ) {
			if ( ary[i] !== klass ) {
				removed[++ind] = ary[i];
			}
		}
		node.className = removed.join(' ');
	}

	function addEvent(node, type, callback) {
		if ( node.addEventListener ) {
			node.addEventListener(type, callback, false);
		} else if ( node.attachEvent ) {
			node.attachEvent('on' + type, callback);
		}
	}
	function preventDefault(e) {
		if ( e.preventDefault ) {
			e.preventDefault();
		} else if ( e.returnValue ) {
			e.returnValue = false;
		}
	}
	function stopPropagation(e) {
		if ( e.stopPropagation ) {
			e.stopPropagation();
		} else if ( e.cancelBubble ) {
			e.cancelBubble = true;
		}
	}
	
	function getHref(node) {
		var href = ( document.uniqueID )
			         ? node.getAttribute('href', 2)
			         : node.getAttribute('href');

		return href.slice(href.indexOf('#') + 1);
	}

	function wrapElement(node, tag) {
		var e = document.createElement(tag),
			r;

		if ( node.applyElement ) {
			node.applyElement(e, 'outside');
		} else if ( document.createRange ) {
			r = document.createRange();
			r.selectNode(node);
			r.surroundContents(e);
			r.detach();
		}
		return e;
	}

	function fadeIn(node, duration) {
		if ( node.__animate ) {
			return;
		}
		var op = ( "opacity" in node.style ) ? true : false,
			begin,
			timer,
			duration = duration || 200;

		if ( op ) {
			node.style.opacity = 0;
		} else {
			node.style.filter = 'alpha(opacity=0)';
		}

		begin = +new Date;
		node.__animate = true;
		timer = setInterval(function() {
			var time = +new Date - begin,
				point;

			if ( time < duration ) {
				point = 1 * time / duration + 0; // linear easing inline
				if ( op ) {
					node.style.opacity = point;
				} else {
					node.style.filter = 'alpha(opacity=' + point*100 + ')';
				}
			} else {
				node.__animate = false;
				clearInterval(timer);
				if ( op ) {
					node.style.opacity = 1;
				} else {
					node.style.filter = 'alpha(opacity=100)';
				}
			}
		}, 60 / 1000);
	}

	function fadeOut(node, duration) {
		if ( node.__animate ) {
			return;
		}
		var op = ( "opacity" in node.style ) ? true : false,
			begin,
			timer,
			duration = duration || 200;

		if ( op ) {
			node.style.opacity = 1;
		} else {
			node.style.filter = 'alpha(opacity=100)';
		}

		begin = +new Date;
		node.__animate = true;
		timer = setInterval(function() {
			var time = +new Date - begin,
				point;

			if ( time < duration ) {
				point = -1 * time / duration + 1; // linear easing inline
				if ( op ) {
					node.style.opacity = point;
				} else {
					node.style.filter = 'alpha(opacity=' + point*100 + ')';
				}
			} else {
				if ( op ) {
					node.style.opacity = 0;
				} else {
					node.style.filter = 'alpha(opacity=0)';
				}
				node.style.display = 'none';
				node.__animate = false;
				clearInterval(timer);
			}
		}, 60 / 1000);
	}
	
	KL.addClass = addClass;
	KL.removeClass = removeClass;
	KL.hasClass = hasClass;
	KL.addEvent = addEvent;
	
	// main function
	function init() {
	
	/*---------------------------------
		MENU Dropdowns
	-----------------------------------*/
	(function() {
		var nodes = Sizzle('ul.menu');
		var length = nodes.length;
		var node;
		var subNodes;
		var i = 0;
		var j = 0;
		var tmp;

		for ( i = 0; i  < length; ++i ) {
			node     = nodes[i];
			subNodes = node.getElementsByTagName('li');
			subLength = subNodes.length;
			for ( j = 0; j < subLength; ++j ) {
				if ( subNodes[j].getElementsByTagName('ul').length > 0 ) {
					addClass(subNodes[j], 'has-menu');
					tmp = document.createElement('span');
					tmp.className = 'arrow';
					subNodes[j].appendChild(tmp);
					tmp.innerHTML = '&nbsp;';
					// Emurate mouseenter
					addEvent(subNodes[j], 'mouseover', function(evt) {
						var target = this.getElementsByTagName('ul')[0],
							related = evt.relatedTarget || evt.fromElement || null;

						if ( related && true === (function(node) {
							var html = document.documentElement,
								flag = true;

							while( related && related !== html ) {
								if ( related === node ) {
									flag = false;
									break;
								}
								related = related.parentNode;
							}
							return flag;
						})(this)) {
							target.style.display = 'block';
							fadeIn(target);
							addClass(this, 'hover');
						}
					});
					// Emurate mouseleave
					addEvent(subNodes[j], 'mouseout', function(evt) {
						var target = this.getElementsByTagName('ul')[0],
							related = evt.relatedTarget || evt.toElement || null;

						if ( related && true === (function(node) {
							var html = document.documentElement,
								flag = true;

							while( related  && related !== html ) {
								if ( related === node ) {
									flag = false;
									break;
								}
								related = related.parentNode;
							}
							return flag;
						})(this)) {
							fadeOut(target);
							removeClass(this, 'hover');
						}
					});
				}
			}
		}
	})();
	
	/*---------------------------------
		HTML5 Placeholder Support
	-----------------------------------*/
	(function() {
		var nodes = Sizzle('input[placeholder], textarea[placeholder]');

		new KL.PlaceHolder(nodes);
	})();
	
	/*---------------------------------
		MEDIA
	-----------------------------------*/
	// video placeholder
	(function() {
		var nodes = Sizzle('a.video-placeholder'),
			length = nodes.length,
			i = 0,
			tmp;

		for ( ; i < length; ++i ) {
			tmp = document.createElement('span');
			tmp.className = 'icon x-large white';
			tmp.setAttribute('data-icon', ' ');
			nodes[i].appendChild(tmp);
		}
	})();
	
	// calendar
	(function() {
		var nodes = Sizzle('.calendar'),
			length = nodes.length,
			i = 0,
			node;

		for ( ; i < length; ++i ) {
			node = nodes[i];
			KL.Calendar(node, { month: node.getAttribute('data-month'), year: node.getAttribute('data-year')});
		}
	})();
	
	/*---------------------------------
		Tabs
	-----------------------------------*/
	(function() {
		var tabContents = Sizzle('.tab-content'),
			tabs = Sizzle('ul.tabs'),
			i = 0,
			tcLength = tabContents.length,
			tbLength = tabs.length,
			tc, t;

		for ( ; i < tcLength; ++i ) {
			tc = tabContents[i];
			addClass(tc, 'clearfix');
			if ( (function(node) {
				while ( node && node.nodeType !== 1 ) {
					node = node.previousSibling;
				}
				return hasClass(node, 'tab-content');
			})(tc.previousSibling) ) {
				tc.style.display = 'none';
			}
		}
		for ( i = 0; i < tbLength; ++i ) {
			(function(t) {
				var current = Sizzle('li.current', t),
					lis = Sizzle('li', t),
					lisLength = lis.length,
					as,
					a,
					asLength,
					i = 0;

				if ( current.length === 0 ) {
					current = lis[0];
					addClass(current, 'current');
				} else {
					current = current[0];
				}
				current = Sizzle('li.current a', t);
				current[0].style.display = 'block';
				
				as = Sizzle('a[href^="#"]', t);
				asLength = as.length;
				for ( i = 0 ; i < asLength; ++i ) {
					a = as[i];
					addEvent(a, 'click', function(e) {
						preventDefault(e);
						var target = document.getElementById(getHref(this)),
							tabLink,
							k = 0;
						
						for ( ; k < lisLength; ++k ) {
							if ( hasClass(lis[k], 'current') ) {
								tabLink = lis[k].getElementsByTagName('a')[0];
								document.getElementById(getHref(tabLink)).style.display = 'none';
								removeClass(lis[k], 'current');
								break;
							}
						}
						
						target.style.display = 'block';
						addClass(this.parentNode, 'current');
					});
				} 
			})(tabs[i]);
		}

	})();
	
	/*---------------------------------
		Image Style Helpers
	-----------------------------------*/
	(function() {
		var nodes = Sizzle('img.style1, img.style2, img.style3'),
			length = nodes.length,
			i = 0,
			node,
			wrap;
			
		for ( ; i < length; ++i ) {
			node = nodes[i];
			wrap = wrapElement(node, 'span');
			wrap.className = 'img-wrap ' + node.className;
			wrap.style.backgroundImage = 'url(' + node.src + ')';
			wrap.style.backgroundPosition = 'center center';
			wrap.style.backgroundRepeat = 'no-repeat';
			wrap.style.height = node.offsetHeight + 'px';
			wrap.style.width = wrap.offsetWidth + 'px';
			node.className = '';
			node.style.display = 'none';
		}
	})();	
	/*---------------------------------
		Image Caption
	-----------------------------------*/
	(function() {
		var nodes = Sizzle('img.caption'),
			length = nodes.length,
			node,
			wrap,
			tmp,
			i = 0;
			
		for ( ; i < length; ++i ) {
			node = nodes[i];
			wrap = wrapElement(node, 'div');
			wrap.className = 'caption ' + node.className;
			wrap.style.width = node.offsetWidth + 'px';
			if ( node.getAttribute('title') ) {
				tmp = document.createElement('span');
				tmp.appendChild(document.createTextNode(node.getAttribute('title')));
				wrap.appendChild(tmp);
			}
		}
	})();
	
	/*---------------------------------
		Notice
	-----------------------------------*/
	addEvent(document, 'click', function(evt) {
		var list = Sizzle('.notice a.close'),
			length = list.length,
			i = 0;
			
		for ( ; i < length; ++i ) {
			if ( evt.target === list[i] ) {
				list[i].style.display = 'none';
				list[i].parentNode.style.display = 'none';
			}
		}
	});
	
	/*---------------------------------
		ToolTip - TipTip
	-----------------------------------*/
	(function() {
		var nodes = Sizzle('.tooltip, .tooltip-top, .tooltip-bottom, .tooltip-right, .tooltip-left'),
			length = nodes.length,
			i = 0;
			
		for ( ; i < length; ++i ) {
			(function(node) {
				var tpos = 'top',
					content = node.getAttribute('title'),
					dataContent = node.getAttribute('data-content'),
					keepAlive = false,
					action = node.getAttribute('data-action') || 'hover';
					
				if ( hasClass(node, 'tooltip-top') ) {
					tpos = 'top';
				}
				if ( hasClass(node, 'tooltip-right') ) {
					tpos = 'right';
				}
				if ( hasClass(node, 'tooltip-bottom') ) {
					tpos = 'bottom';
				}
				if ( hasClass(node, 'tooltip-left') ) {
					tpos = 'left';
				}
				
				if ( dataContent ) {
					dataContent = Sizzle(dataContent);
					content = dataContent[0].innerHTML;
					keepAlive = true;
				}
				
				
				node.setAttribute('title', '');
				new KL.Tooltip(node, {
					defaultPosition: tpos, content: content, keepAlive: keepAlive, activation: action, delay: 1000
				});
			})(nodes[i]);
		}
	})();

	/*---------------------------------
		Icons
	-----------------------------------*/
	(function() {
		var nodes = Sizzle('.icon'),
			length = nodes.length,
			i = 0,
			tmp;
			
		for ( ; i < length; ++i ) {
			tmp = document.createElement('span');
			tmp.setAttribute('aria-hidden', 'true');
			tmp.appendChild(document.createTextNode(nodes[i].getAttribute('data-icon')));
			nodes[i].appendChild(tmp);
			nodes[i].style.display = 'inline-block';
		}
	})();
	
	/*---------------------------------
		CSS Helpers
	-----------------------------------*/
	if ( document.uniqueID ) {
		addClass(document.body, 'msie');
	}
	(function() {
		var types = ['checkbox', 'radio', 'file'],
			length,
			i = 0,
			nodes,
			tmp,
			j = 0;
			
		for ( ; i < 3; ++i ) {
			nodes = Sizzle('input[type=' + types[i] + ']');
			length = nodes.length;
			for ( j = 0; j < length; ++j ) {
				addClass(nodes[j], types[i]);
			}
		}
		
		nodes = Sizzle('[disabled=disabled]');
		length = nodes.length;
		for ( i = 0; i < length; ++i ) {
			addClass(nodes[i], 'disabled');
		}
		
		nodes = document.getElementsByTagName('table');
		length = nodes.length;
		for ( i = 0; i < length; ++i ) {
			(function(table) {
				var trs, length, i = 0;
				
				trs = Sizzle('tr:even', table);
				length = trs.length;
				for ( i = 0; i < length; ++i ) {
					addClass(trs[i], 'alt');
				}
				trs = Sizzle('tr:first-child', table);
				length = trs.length;
				for ( i = 0; i < length; ++i ) {
					addClass(trs[i], 'first');
				}
				trs = Sizzle('tr:last-child', table);
				length = trs.length;
				for ( i = 0 ; i < length; ++i ) {
					addClass(trs[i], 'last');
				}
			})(nodes[i]);
		}
		
		nodes = document.getElementsByTagName('ul');
		length = nodes.length;
		for ( i = 0; i < length; i++ ) {
			(function(ul) {
				var nodes = Sizzle('li:first-child', ul),
					length = nodes.length,
					i = 0;
					
				for ( ; i < length; ++i ) {
					addClass(nodes[i], 'first');
				}
				
				nodes = Sizzle('li:last-child', ul);
				length = nodes.length;
				for ( i = 0; i < length; ++i ) {
					addClass(nodes[i], 'last');
				}
			})(nodes[i]);
		}
		
		nodes = document.getElementsByTagName('hr');
		length = nodes.length;
		for ( i = 0; i < length; ++i ) {
			tmp = document.createElement('div');
			tmp.className = 'clear';
			nodes[i].parentNode.insertBefore(tmp, nodes[i]);
		}
		
		nodes = Sizzle('[class*=col_]');
		length = nodes.length;
		for ( i = 0; i < length; ++i ) {
			if ( nodes[i].tagName === 'INPUT' || nodes[i].tagName === 'LABEL' ) {
				continue;
			}
			addClass(nodes[i], 'column');
			tmp = document.createElement('div');
			tmp.className = 'inner';
			while ( nodes[i].firstChild ) {
				tmp.appendChild(nodes[i].firstChild);
			}
			nodes[i].appendChild(tmp);
		}
		
		nodes = document.getElementsByTagName('pre');
		length = nodes.length;
		for ( i = 0; i < length; ++i ) {
			addClass(nodes[i], 'prettyprint');
		}
		prettyPrint && prettyPrint();
	})();
	
	} // init
	
	
// DOMRady
(function(){var a=document;KL.domReady=function(b){if(a.body)b();else if(a.addEventListener)a.addEventListener("DOMContentLoaded",b,!1);else if(a.attachEvent){var c=function(){"complete"===a.readyState&&(b(),a.detachEvent("onreadystatechange",c))};a.attachEvent("onreadystatechange",c)}else if(a.readyState){var d=function(){"loaded"==a.readyState||"complete"==a.readyState?b():setTimeout(d,0)};d()}}})();


/*
 * TipTip
 * Copyright 2010 Drew Wilson
 * www.drewwilson.com
 * code.drewwilson.com/entry/tiptip-jquery-plugin
 *
 * Version 1.3   -   Updated: Mar. 23, 2010
 *
 * This Plug-In will create a custom tooltip to replace the default
 * browser tooltip. It is extremely lightweight and very smart in
 * that it detects the edges of the browser window and will make sure
 * the tooltip stays within the current window size. As a result the
 * tooltip will adjust itself to be displayed above, below, to the left 
 * or to the right depending on what is necessary to stay within the
 * browser window. It is completely customizable as well via CSS.
 *
 * This TipTip jQuery plug-in is dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Rewrited without jQuery by Yoshiaki Sugimoto
 */
(function(){function l(c,f,a){a.enter.call(c);r.innerHTML=f;d.style.display="none";d.className="";d.style.margin="0";k.removeAttribute("style");var g=c.getBoundingClientRect();d.style.display="block";var e=d.getBoundingClientRect();d.style.display="none";var f=parseInt(c.offsetTop,10),h=parseInt(c.offsetLeft,10),m=g.right-g.left,g=g.bottom-g.top,n=e.right-e.left,e=e.bottom-e.top,i=Math.round((m-n)/2),l=Math.round((g-e)/2),p=Math.round(h+i),j=Math.round(f+g+a.edgeOffset),b="",q="",s=Math.round(n-12)/
2,o=document.body,t=document.documentElement;"bottom"==a.defaultPosition?b="_bottom":"top"==a.defaultPosition?b="_top":"left"==a.defaultPosition?b="_left":"right"==a.defaultPosition&&(b="_right");var u=i+h<parseInt(o.scrollLeft||o.scrollLeft||0,10),v=n+h>parseInt(document.body.clientWidth||0,10);if(u&&0>i||"_right"==b&&!v||"_left"==b&&h<n+a.edgeOffset+5)b="_right",q=Math.round(e-13)/2,s=-12,p=Math.round(h+m+a.edgeOffset),j=Math.round(f+l);else if(v&&0>i||"_left"==b&&!u)b="_left",q=Math.round(e-13)/
2,s=Math.round(n),p=Math.round(h-(n+a.edgeOffset+5)),j=Math.round(f+l);h=f+g+a.edgeOffset+e+8>parseInt(Math.max(o.innerHeight||0,o.clientHeight||0,o.scrollHeight||0,t.clinetHeight||0,t.scrollHeight||0)+o.scrollTop||t.scrollTop||0);m=0>f+g-(a.edgeOffset+e+8);if(h||"_bottom"==b&&h||"_top"==b&&!m)b="_top"==b||"_bottom"==b?"_top":b+"_top",q=e,j=Math.round(f-(e+5+a.edgeOffset));else if(m|("_top"==b&&m)||"_bottom"==b&&!h)b="_top"==b||"_bottom"==b?"_bottom":b+"_bottom",q=-12,j=Math.round(f+g+a.edgeOffset);
if("_right_top"==b||"_left_top"==b)j+=5;else if("_right_bottom"==b||"_left_bottom"==b)j-=5;if("_left_top"==b||"_left_bottom"==b)p+=5;k.style.marginLeft=s+"px";k.style.marginTop=q+"px";d.style.marginLeft=p+"px";d.style.marginTop=j+"px";d.className="tip"+b;c.__timeout&&clearTimeout(c.__timeout);c.__timeout=setTimeout(function(){d.style.display="block";fadeIn(d,100);},a.delay)}function i(c,f){f.exit.call(c);c.__timeout&&clearTimeout(c.__timeout);fadeOut(d,100);}var d,r,k;KL.Tooltip=function(c,f){var a={activation:"hover",
keepAlive:!1,maxWidth:"200px",edgeOffset:3,defaultPosition:"bottom",delay:400,fadeIn:200,fadeOut:200,attribute:"title",content:!1,enter:function(){},exit:function(){}},g;for(g in f)a[g]=f[g];var e=a.content||c.getAttribute(a.attribute);c.__timeout=!1;0>=Sizzle("#tiptip_holder").length&&(d=document.createElement("div"),d.id="tiptip_holder",d.style.maxWidth=a.maxWidth,r=document.createElement("div"),r.id="tiptip_content",k=document.createElement("div"),k.id="tiptip_arrow",k.innerHTML='<div id="tiptip_arrow_inner"></div>',
d.appendChild(k),d.appendChild(r),document.body.appendChild(d));if(""!=e)switch(a.content||c.removeAttribute(a.attribute),a.activation){case "hover":addEvent(c,"mouseover",function(){l(this,e,a)});addEvent(c,"mouseout",function(){a.keepAlive||i(this,a)});a.keepAlive&&addEvent(d,"mouseout",function(){i(this,a)});break;case "focus":addEvent(c,"focus",function(){l(c,e,a)});addEvent("blur",function(){a.keepAlive||i(this,a)});break;case "click":addEvent(c,"click",function(){l(c,e,a);return false}),addEvent(c,
"mouseout",function(){a.keepAlive||i(this,a)}),a.keepAlive&&addEvent(d,"mouseout",function(){i(this,a)})}}})();

/*
* Placeholder plugin for jQuery
* ---
* Copyright 2010, Daniel Stocks (http://webcloud.se)
* Released under the MIT, BSD, and GPL Licenses.
*
* Rewrited without jQuery by Yoshiaki Sugimoto
*/
(function(){function e(a){this.input=a;"password"==a.getAttribute("type")&&this.handlePassword();addEvent(a.form,"submit",function(){hasClass(a,"placeholder")&&a.value==a.getAttribute("placeholder")&&(a.value="")})}e.prototype={show:function(a){if(""===this.input.value||a&&this.valueIsPlaceholder()){if(this.isPassword)try{this.input.setAttribute("type","text")}catch(c){this.fakePassword.style.display="inline-block",this.input.parentNode.insertBefore(this.fakePassword,this.input),this.input.style.display=
"none"}addClass(this.input,"placeholder");this.input.value=this.input.getAttribute("placeholder")}},hide:function(){if(this.valueIsPlaceholder()&&hasClass(this.input,"placeholder")&&(removeClass(this.input,"placeholder"),this.input.value="",this.isPassword)){try{this.input.setAttribute("type","password")}catch(a){}this.input.style.display="inline-block";this.input.focus()}},valueIsPlaceholder:function(){return this.input.value==this.input.getAttribute("placeholder")},handlePassword:function(){var a=
this.inpu,c,b;a.setAttribute("realType","password");this.isPassword=!0;document.uniqueID&&a.outerHTML&&(c=document.createElement("div"),c.innerHTML=a.outerHTML.replace(/type=(['"])?password\1/gi,"type=$1text$1"),b=c.firstChild,b.value=a.getAttribute("placeholder"),addClass(b,"placeholder"),addEvent(b,"focus",function(){a.focus();b.style.display="none"}),this.fakePassword=b,addEvent(a.form,"submit",function(){b.parentNode.removeChild(b);a.style.display="inline-block"}))}};var f=!!("placeholder"in document.createElement("input"));
KL.PlaceHolder=function(a){if(!f)for(var c=a.length,b=0,d;b<c;++b)d=new e(a[b]),d.show(!0),addEvent(a[b],"focus",function(){d.hide()}),addEvent(a[b],"blur",function(){d.show(!1)}),document.uniqueID&&(addEvent(window,"load",function(){a[b].value&&removeClass(a[b],"placeholder");d.show(!0)}),addEvent(a[b],"focus",function(){if(""==this.value){var a=this.createTextRange();a.collapse(!0);a.moveStart("character",0);a.select()}}))}})();


/*
	jQuery Calendar
	http://eisabainyo.net/demo/jquery.calendar-widget.php

	Rewrited without jQuery by Yoshiaki Sugimoto
*/
(function(){function e(e,g){var a=[31,28,31,30,31,30,31,31,30,31,30,31];return 1==e&&0==g%4&&(0!=g%100||0==g%400)?29:a[e]}KL.Calendar=function(h,g){var a=new Date,c=a.getMonth(),a=a.getYear()+1900,c={month:c,year:a},a=g||{},b;for(b in a)c[b]=a[b];var f="SUN MON TUE WED THU FRI SAT".split(" ");month=a=parseInt(c.month);year=parseInt(c.year);b=""+('<h4 id="current-month">'+"January February March April May June July August September October November December".split(" ")[month]+" "+year+"</h4>");b=b+
('<table class="calendar-month " id="calendar-month'+a+' " cellspacing="0">')+"<tr>";for(d=0;7>d;d++)b+='<th class="weekday">'+f[d]+"</th>";b+="</tr>";e(month,year);a=new Date(year,month,1);c=a.getDay();f=e(month,year);a=new Date(year,month,1);c=a.getDay();f=0==month?11:month-1;f=e(f,11==f?year-1:year);c=0==c&&a?7:c;for(j=a=0;42>j;j++)j<c?b+='<td class="other-month"><span class="day">'+(f-c+j+1)+"</span></td>":j>=c+e(month,year)?(a+=1,b+='<td class="other-month"><span class="day">'+a+"</span></td>"):
b+='<td class="current-month day'+(j-c+1)+'"><span class="day">'+(j-c+1)+"</span></td>",6==j%7&&(b+="</tr>");h.innerHTML=b+"</table>"}})();

KL.domReady(init);

})();

/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2012 jQuery Foundation and other contributors
 *  Released under the MIT license
 *  http://sizzlejs.com/
 */
(function(R,L){function j(a,b,c,d){var c=c||[],b=b||t,e,f,g,k,h=b.nodeType;if(1!==h&&9!==h)return[];if(!a||"string"!==typeof a)return c;g=D(b);if(!g&&!d&&(e=da.exec(a)))if(k=e[1])if(9===h)if((f=b.getElementById(k))&&f.parentNode){if(f.id===k)return c.push(f),c}else return c;else{if(b.ownerDocument&&(f=b.ownerDocument.getElementById(k))&&S(b,f)&&f.id===k)return c.push(f),c}else{if(e[2])return E.apply(c,v.call(b.getElementsByTagName(a),0)),c;if((k=e[3])&&T&&b.getElementsByClassName)return E.apply(c,
v.call(b.getElementsByClassName(k),0)),c}return M(a,b,c,d,g)}function w(a){return function(b){return"input"===b.nodeName.toLowerCase()&&b.type===a}}function U(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function x(a,b,c){if(a===b)return c;for(a=a.nextSibling;a;){if(a===b)return-1;a=a.nextSibling}return 1}function F(a,b,c,d){var e,f,g,k,h,p,q,l,n,i=!c&&b!==t,u=(i?"<s>":"")+a.replace(G,"$1<s>");if(h=V[m][u])return d?0:v.call(h,0);h=a;p=[];l=o.preFilter;
for(n=o.filter;h;){if(!e||(f=ea.exec(h)))f&&(h=h.slice(f[0].length),g.selector=q),p.push(g=[]),q="",i&&(h=" "+h);e=!1;if(f=H.exec(h))q+=f[0],h=h.slice(f[0].length),e=g.push({part:f.pop().replace(G," "),string:f[0],captures:f});for(k in n)if((f=y[k].exec(h))&&(!l[k]||(f=l[k](f,b,c))))q+=f[0],h=h.slice(f[0].length),e=g.push({part:k,string:f.shift(),captures:f});if(!e)break}q&&(g.selector=q);return d?h.length:h?j.error(a):v.call(V(u,p),0)}function fa(a,b,c,d){var e=b.dir,f=W++;a||(a=function(a){return a===
c});return b.first?function(b){for(;b=b[e];)if(1===b.nodeType)return a(b)&&b}:d?function(b){for(;b=b[e];)if(1===b.nodeType&&a(b))return b}:function(b){for(var c,d=f+"."+X,p=d+"."+Y;b=b[e];)if(1===b.nodeType){if((c=b[m])===p)return b.sizset;if("string"===typeof c&&0===c.indexOf(d)){if(b.sizset)return b}else{b[m]=p;if(a(b))return b.sizset=!0,b;b.sizset=!1}}}}function ga(a,b){return a?function(c){var d=b(c);return d&&a(!0===d?c:d)}:b}function Z(a,b,c,d){for(var e=0,f=b.length;e<f;e++)j(a,b[e],c,d)}function M(a,
b,c,d,e){var a=a.replace(G,"$1"),f,g,k,h,p,q;p=F(a,b,e);q=b.nodeType;if(y.POS.test(a)){f=p;var l,i,m,u,r,s,t;p=0;q=f.length;for(var w=y.POS,B=RegExp("^"+w.source+"(?!"+n+")","i"),C=function(){for(var a=1,b=arguments.length-2;a<b;a++)arguments[a]===L&&(u[a]=L)};p<q;p++){a=f[p];l="";m=d;e=0;for(k=a.length;e<k;e++){i=a[e];h=i.string;if("PSEUDO"===i.part){w.exec("");for(i=0;u=w.exec(h);){g=!0;r=w.lastIndex=u.index+u[0].length;if(r>i){l+=h.slice(i,u.index);i=r;s=[b];H.test(l)&&(m&&(s=m),m=d);if(t=ha.test(l))l=
l.slice(0,-5).replace(H,"$&*"),i++;1<u.length&&u[0].replace(B,C);r=u[1];var D=u[2],x=void 0,A=o.setFilters[r.toLowerCase()];A||j.error(r);if(l||!(x=m))Z(l||"*",s,x=[],m);m=0<x.length?A(x,D,t):[]}l=""}}g||(l+=h);g=!1}l?H.test(l)?Z(l,m||[b],c,d):j(l,b,c,d?d.concat(m):m):E.apply(c,m)}return 1===q?c:j.uniqueSort(c)}if(d)f=v.call(d,0);else if(1===p.length){if(2<(k=v.call(p[0],0)).length&&"ID"===(h=k[0]).part&&9===q&&!e&&o.relative[k[1].part]){b=o.find.ID(h.captures[0].replace(z,""),b,e)[0];if(!b)return c;
a=a.slice(k.shift().string.length)}g=(p=N.exec(k[0].string))&&!p.index&&b.parentNode||b;p="";for(d=k.length-1;0<=d;d--){h=k[d];q=h.part;p=h.string+p;if(o.relative[q])break;if(o.order.test(q)&&(f=o.find[q](h.captures[0].replace(z,""),g,e),null!=f)){(a=a.slice(0,a.length-p.length)+p.replace(y[q],""))||E.apply(c,v.call(f,0));break}}}if(a){g=O(a,b,e);X=g.dirruns++;null==f&&(f=o.find.TAG("*",N.test(a)&&b.parentNode||b));for(d=0;b=f[d];d++)Y=g.runs++,g(b)&&c.push(b)}return c}var X,Y,P,o,A,D,S,O,Q,B,$=!0,
m=("sizcache"+Math.random()).replace(".",""),t=R.document,r=t.documentElement,W=0,v=[].slice,E=[].push,C=function(a,b){a[m]=b||!0;return a},i=function(){var a={},b=[];return C(function(c,d){b.push(c)>o.cacheLength&&delete a[b.shift()];return a[c]=d},a)},aa=i(),V=i(),ba=i(),n="[\\x20\\t\\r\\n\\f]",i="(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+".replace("w","w#"),i="\\["+n+"*((?:\\\\.|[-\\w]|[^\\x00-\\xa0])+)"+n+"*(?:([*^$|!~]?=)"+n+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+i+")|)|)"+n+"*\\]",I=":((?:\\\\.|[-\\w]|[^\\x00-\\xa0])+)(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:"+
i+")|[^:]|\\\\.)*|.*))\\)|)",G=RegExp("^"+n+"+|((?:^|[^\\\\])(?:\\\\.)*)"+n+"+$","g"),ea=RegExp("^"+n+"*,"+n+"*"),H=RegExp("^"+n+"*([\\x20\\t\\r\\n\\f>+~])"+n+"*"),ia=RegExp(I),da=/^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,N=/[\x20\t\r\n\f]*[+~]/,ha=/:not\($/,ja=/h\d/i,ka=/input|select|textarea|button/i,z=/\\(?!\\)/g,y={ID:/^#((?:\\.|[-\w]|[^\x00-\xa0])+)/,CLASS:/^\.((?:\\.|[-\w]|[^\x00-\xa0])+)/,NAME:/^\[name=['"]?((?:\\.|[-\w]|[^\x00-\xa0])+)['"]?\]/,TAG:RegExp("^("+"(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+".replace("w",
"w*")+")"),ATTR:RegExp("^"+i),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|nth|last|first)-child(?:\\("+n+"*(even|odd|(([+-]|)(\\d*)n|)"+n+"*(?:([+-]|)"+n+"*(\\d+)|))"+n+"*\\)|)","i"),POS:RegExp(":(nth|eq|gt|lt|first|last|even|odd)(?:\\(((?:-\\d)?\\d*)\\)|)(?=[^-]|$)","ig"),needsContext:RegExp("^"+n+"*[>+~]|:(nth|eq|gt|lt|first|last|even|odd)(?:\\(((?:-\\d)?\\d*)\\)|)(?=[^-]|$)","i")},i=function(a){var b=t.createElement("div");try{return a(b)}catch(c){return!1}finally{}},I=i(function(a){a.appendChild(t.createComment(""));
return!a.getElementsByTagName("*").length}),la=i(function(a){a.innerHTML="<a href='#'></a>";return a.firstChild&&"undefined"!==typeof a.firstChild.getAttribute&&"#"===a.firstChild.getAttribute("href")}),ma=i(function(a){a.innerHTML="<select></select>";a=typeof a.lastChild.getAttribute("multiple");return"boolean"!==a&&"string"!==a}),T=i(function(a){a.innerHTML="<div class='hidden e'></div><div class='hidden'></div>";if(!a.getElementsByClassName||!a.getElementsByClassName("e").length)return!1;a.lastChild.className=
"e";return 2===a.getElementsByClassName("e").length}),na=i(function(a){a.id=m+0;a.innerHTML="<a name='"+m+"'></a><div name='"+m+"'></div>";r.insertBefore(a,r.firstChild);var b=t.getElementsByName&&t.getElementsByName(m).length===2+t.getElementsByName(m+0).length;P=!t.getElementById(m);r.removeChild(a);return b});try{v.call(r.childNodes,0)[0].nodeType}catch(ra){v=function(a){for(var b,c=[];b=this[a];a++)c.push(b);return c}}j.matches=function(a,b){return j(a,null,null,b)};j.matchesSelector=function(a,
b){return 0<j(b,null,null,[a]).length};A=j.getText=function(a){var b,c="",d=0;if(b=a.nodeType)if(1===b||9===b||11===b){if("string"===typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=A(a)}else{if(3===b||4===b)return a.nodeValue}else for(;b=a[d];d++)c+=A(b);return c};D=j.isXML=function(a){return(a=a&&(a.ownerDocument||a).documentElement)?"HTML"!==a.nodeName:!1};S=j.contains=r.contains?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===
d||!(!d||!(1===d.nodeType&&c.contains&&c.contains(d)))}:r.compareDocumentPosition?function(a,b){return b&&!!(a.compareDocumentPosition(b)&16)}:function(a,b){for(;b=b.parentNode;)if(b===a)return!0;return!1};j.attr=function(a,b){var c;(c=D(a))||(b=b.toLowerCase());return o.attrHandle[b]?o.attrHandle[b](a):ma||c?a.getAttribute(b):(c=a.getAttributeNode(b))?"boolean"===typeof a[b]?a[b]?b:null:c.specified?c.value:null:null};o=j.selectors={cacheLength:50,createPseudo:C,match:y,order:RegExp("ID|TAG"+(na?
"|NAME":"")+(T?"|CLASS":"")),attrHandle:la?{}:{href:function(a){return a.getAttribute("href",2)},type:function(a){return a.getAttribute("type")}},find:{ID:P?function(a,b,c){if("undefined"!==typeof b.getElementById&&!c)return(a=b.getElementById(a))&&a.parentNode?[a]:[]}:function(a,b,c){if("undefined"!==typeof b.getElementById&&!c)return(b=b.getElementById(a))?b.id===a||"undefined"!==typeof b.getAttributeNode&&b.getAttributeNode("id").value===a?[b]:L:[]},TAG:I?function(a,b){if("undefined"!==typeof b.getElementsByTagName)return b.getElementsByTagName(a)}:
function(a,b){var c=b.getElementsByTagName(a);if("*"===a){for(var d,e=[],f=0;d=c[f];f++)1===d.nodeType&&e.push(d);return e}return c},NAME:function(a,b){if("undefined"!==typeof b.getElementsByName)return b.getElementsByName(name)},CLASS:function(a,b,c){if("undefined"!==typeof b.getElementsByClassName&&!c)return b.getElementsByClassName(a)}},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){a[1]=
a[1].replace(z,"");a[3]=(a[4]||a[5]||"").replace(z,"");"~="===a[2]&&(a[3]=" "+a[3]+" ");return a.slice(0,4)},CHILD:function(a){a[1]=a[1].toLowerCase();"nth"===a[1]?(a[2]||j.error(a[0]),a[3]=+(a[3]?a[4]+(a[5]||1):2*("even"===a[2]||"odd"===a[2])),a[4]=+(a[6]+a[7]||"odd"===a[2])):a[2]&&j.error(a[0]);return a},PSEUDO:function(a,b,c){var d,e;if(y.CHILD.test(a[0]))return null;if(a[3])a[2]=a[3];else if(d=a[4]){if(ia.test(d)&&(e=F(d,b,c,!0))&&(e=d.indexOf(")",d.length-e)-d.length))d=d.slice(0,e),a[0]=a[0].slice(0,
e);a[2]=d}return a.slice(0,3)}},filter:{ID:P?function(a){a=a.replace(z,"");return function(b){return b.getAttribute("id")===a}}:function(a){a=a.replace(z,"");return function(b){return(b="undefined"!==typeof b.getAttributeNode&&b.getAttributeNode("id"))&&b.value===a}},TAG:function(a){if("*"===a)return function(){return!0};a=a.replace(z,"").toLowerCase();return function(b){return b.nodeName&&b.nodeName.toLowerCase()===a}},CLASS:function(a){var b=aa[m][a];b||(b=aa(a,RegExp("(^|"+n+")"+a+"("+n+"|$)")));
return function(a){return b.test(a.className||"undefined"!==typeof a.getAttribute&&a.getAttribute("class")||"")}},ATTR:function(a,b,c){return!b?function(b){return null!=j.attr(b,a)}:function(d){var d=j.attr(d,a),e=d+"";if(null==d)return"!="===b;switch(b){case "=":return e===c;case "!=":return e!==c;case "^=":return c&&0===e.indexOf(c);case "*=":return c&&-1<e.indexOf(c);case "$=":return c&&e.substr(e.length-c.length)===c;case "~=":return-1<(" "+e+" ").indexOf(c);case "|=":return e===c||e.substr(0,
c.length+1)===c+"-"}}},CHILD:function(a,b,c,d){if("nth"===a){var e=W++;return function(a){var b,k=0,h=a;if(1===c&&0===d)return!0;if((b=a.parentNode)&&(b[m]!==e||!a.sizset)){for(h=b.firstChild;h&&!(1===h.nodeType&&(h.sizset=++k,h===a));h=h.nextSibling);b[m]=e}a=a.sizset-d;return 0===c?0===a:0===a%c&&0<=a/c}}return function(b){var c=b;switch(a){case "only":case "first":for(;c=c.previousSibling;)if(1===c.nodeType)return!1;if("first"===a)return!0;c=b;case "last":for(;c=c.nextSibling;)if(1===c.nodeType)return!1;
return!0}}},PSEUDO:function(a,b,c,d){var e,f=o.pseudos[a]||o.pseudos[a.toLowerCase()];f||j.error("unsupported pseudo: "+a);return!f[m]?1<f.length?(e=[a,a,"",b],function(a){return f(a,0,e)}):f:f(b,c,d)}},pseudos:{not:C(function(a,b,c){var d=O(a.replace(G,"$1"),b,c);return function(a){return!d(a)}}),enabled:function(a){return!1===a.disabled},disabled:function(a){return!0===a.disabled},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){a.parentNode&&
a.parentNode.selectedIndex;return!0===a.selected},parent:function(a){return!o.pseudos.empty(a)},empty:function(a){for(var b,a=a.firstChild;a;){if("@"<a.nodeName||3===(b=a.nodeType)||4===b)return!1;a=a.nextSibling}return!0},contains:C(function(a){return function(b){return-1<(b.textContent||b.innerText||A(b)).indexOf(a)}}),has:C(function(a){return function(b){return 0<j(a,b).length}}),header:function(a){return ja.test(a.nodeName)},text:function(a){var b,c;return"input"===a.nodeName.toLowerCase()&&"text"===
(b=a.type)&&(null==(c=a.getAttribute("type"))||c.toLowerCase()===b)},radio:w("radio"),checkbox:w("checkbox"),file:w("file"),password:w("password"),image:w("image"),submit:U("submit"),reset:U("reset"),button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},input:function(a){return ka.test(a.nodeName)},focus:function(a){var b=a.ownerDocument;return a===b.activeElement&&(!b.hasFocus||b.hasFocus())&&!(!a.type&&!a.href)},active:function(a){return a===a.ownerDocument.activeElement}},
setFilters:{first:function(a,b,c){return c?a.slice(1):[a[0]]},last:function(a,b,c){b=a.pop();return c?a:[b]},even:function(a,b,c){for(var b=[],c=c?1:0,d=a.length;c<d;c+=2)b.push(a[c]);return b},odd:function(a,b,c){for(var b=[],c=c?0:1,d=a.length;c<d;c+=2)b.push(a[c]);return b},lt:function(a,b,c){return c?a.slice(+b):a.slice(0,+b)},gt:function(a,b,c){return c?a.slice(0,+b+1):a.slice(+b+1)},eq:function(a,b,c){b=a.splice(+b,1);return c?a:b}}};Q=r.compareDocumentPosition?function(a,b){return a===b?(B=
!0,0):(!a.compareDocumentPosition||!b.compareDocumentPosition?a.compareDocumentPosition:a.compareDocumentPosition(b)&4)?-1:1}:function(a,b){if(a===b)return B=!0,0;if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[];c=a.parentNode;d=b.parentNode;var g=c;if(c===d)return x(a,b);if(c){if(!d)return 1}else return-1;for(;g;)e.unshift(g),g=g.parentNode;for(g=d;g;)f.unshift(g),g=g.parentNode;c=e.length;d=f.length;for(g=0;g<c&&g<d;g++)if(e[g]!==f[g])return x(e[g],f[g]);return g===
c?x(a,f[g],-1):x(e[g],b,1)};[0,0].sort(Q);$=!B;j.uniqueSort=function(a){var b,c=1;B=$;a.sort(Q);if(B)for(;b=a[c];c++)b===a[c-1]&&a.splice(c--,1);return a};j.error=function(a){throw Error("Syntax error, unrecognized expression: "+a);};O=j.compile=function(a,b,c){var d,e,f;if((e=ba[m][a])&&e.context===b)return e;d=F(a,b,c);e=0;for(f=d.length;e<f;e++){for(var g=d,k=e,h=d[e],i=b,q=c,l=void 0,j=void 0,n=0;l=h[n];n++)j=o.relative[l.part]?fa(j,o.relative[l.part],i,q):ga(j,o.filter[l.part].apply(null,l.captures.concat(i,
q)));g[k]=j}e=ba(a,function(a){for(var b,c=0;b=d[c];c++)if(b(a))return!0;return!1});e.context=b;e.runs=e.dirruns=0;return e};if(t.querySelectorAll){var ca,oa=M,pa=/'|\\/g,qa=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,s=[],J=[":active"],K=r.matchesSelector||r.mozMatchesSelector||r.webkitMatchesSelector||r.oMatchesSelector||r.msMatchesSelector;i(function(a){a.innerHTML="<select><option selected=''></option></select>";a.querySelectorAll("[selected]").length||s.push("\\["+n+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)");
a.querySelectorAll(":checked").length||s.push(":checked")});i(function(a){a.innerHTML="<p test=''></p>";a.querySelectorAll("[test^='']").length&&s.push("[*^$]="+n+"*(?:\"\"|'')");a.innerHTML="<input type='hidden'/>";a.querySelectorAll(":enabled").length||s.push(":enabled",":disabled")});s=s.length&&RegExp(s.join("|"));M=function(a,b,c,d,e){if(!d&&!e&&(!s||!s.test(a)))if(9===b.nodeType)try{return E.apply(c,v.call(b.querySelectorAll(a),0)),c}catch(f){}else if(1===b.nodeType&&"object"!==b.nodeName.toLowerCase()){var g,
k,h,j=b.getAttribute("id"),i=j||m,l=N.test(a)&&b.parentNode||b;j?i=i.replace(pa,"\\$&"):b.setAttribute("id",i);g=F(a,b,e);i="[id='"+i+"']";k=0;for(h=g.length;k<h;k++)g[k]=i+g[k].selector;try{return E.apply(c,v.call(l.querySelectorAll(g.join(",")),0)),c}catch(n){}finally{j||b.removeAttribute("id")}}return oa(a,b,c,d,e)};K&&(i(function(a){ca=K.call(a,"div");try{K.call(a,"[test!='']:sizzle"),J.push(y.PSEUDO.source,y.POS.source,"!=")}catch(b){}}),J=RegExp(J.join("|")),j.matchesSelector=function(a,b){b=
b.replace(qa,"='$1']");if(!D(a)&&!J.test(b)&&(!s||!s.test(b)))try{var c=K.call(a,b);if(c||ca||a.document&&11!==a.document.nodeType)return c}catch(d){}return 0<j(b,null,null,[a]).length})}o.setFilters.nth=o.setFilters.eq;o.filters=o.pseudos;"function"===typeof define&&define.amd?define(function(){return j}):R.Sizzle=j})(window);

// HTML5 Shiv v3 | @jon_neal @afarkas @rem | MIT/GPL2 Licensed
// Uncompressed source: https://github.com/aFarkas/html5shiv
(function(a,b){function f(a){var c,d,e,f;b.documentMode>7?(c=b.createElement("font"),c.setAttribute("data-html5shiv",a.nodeName.toLowerCase())):c=b.createElement("shiv:"+a.nodeName);while(a.firstChild)c.appendChild(a.childNodes[0]);for(d=a.attributes,e=d.length,f=0;f<e;++f)d[f].specified&&c.setAttribute(d[f].nodeName,d[f].nodeValue);c.style.cssText=a.style.cssText,a.parentNode.replaceChild(c,a),c.originalElement=a}function g(a){var b=a.originalElement;while(a.childNodes.length)b.appendChild(a.childNodes[0]);a.parentNode.replaceChild(b,a)}function h(a,b){b=b||"all";var c=-1,d=[],e=a.length,f,g;while(++c<e){f=a[c],g=f.media||b;if(f.disabled||!/print|all/.test(g))continue;d.push(h(f.imports,g),f.cssText)}return d.join("")}function i(c){var d=new RegExp("(^|[\\s,{}])("+a.html5.elements.join("|")+")","gi"),e=c.split("{"),f=e.length,g=-1;while(++g<f)e[g]=e[g].split("}"),b.documentMode>7?e[g][e[g].length-1]=e[g][e[g].length-1].replace(d,'$1font[data-html5shiv="$2"]'):e[g][e[g].length-1]=e[g][e[g].length-1].replace(d,"$1shiv\\:$2"),e[g]=e[g].join("}");return e.join("{")}var c=function(a){return a.innerHTML="<x-element></x-element>",a.childNodes.length===1}(b.createElement("a")),d=function(a,b,c){return b.appendChild(a),(c=(c?c(a):a.currentStyle).display)&&b.removeChild(a)&&c==="block"}(b.createElement("nav"),b.documentElement,a.getComputedStyle),e={elements:"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video".split(" "),shivDocument:function(a){a=a||b;if(a.documentShived)return;a.documentShived=!0;var f=a.createElement,g=a.createDocumentFragment,h=a.getElementsByTagName("head")[0],i=function(a){f(a)};c||(e.elements.join(" ").replace(/\w+/g,i),a.createElement=function(a){var b=f(a);return b.canHaveChildren&&e.shivDocument(b.document),b},a.createDocumentFragment=function(){return e.shivDocument(g())});if(!d&&h){var j=f("div");j.innerHTML=["x<style>","article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}","audio{display:none}","canvas,video{display:inline-block;*display:inline;*zoom:1}","[hidden]{display:none}audio[controls]{display:inline-block;*display:inline;*zoom:1}","mark{background:#FF0;color:#000}","</style>"].join(""),h.insertBefore(j.lastChild,h.firstChild)}return a}};e.shivDocument(b),a.html5=e;if(c||!a.attachEvent)return;a.attachEvent("onbeforeprint",function(){if(a.html5.supportsXElement||!b.namespaces)return;b.namespaces.shiv||b.namespaces.add("shiv");var c=-1,d=new RegExp("^("+a.html5.elements.join("|")+")$","i"),e=b.getElementsByTagName("*"),g=e.length,j,k=i(h(function(a,b){var c=[],d=a.length;while(d)c.unshift(a[--d]);d=b.length;while(d)c.unshift(b[--d]);c.sort(function(a,b){return a.sourceIndex-b.sourceIndex}),d=c.length;while(d)c[--d]=c[d].styleSheet;return c}(b.getElementsByTagName("style"),b.getElementsByTagName("link"))));while(++c<g)j=e[c],d.test(j.nodeName)&&f(j);b.appendChild(b._shivedStyleSheet=b.createElement("style")).styleSheet.cssText=k}),a.attachEvent("onafterprint",function(){if(a.html5.supportsXElement||!b.namespaces)return;var c=-1,d=b.getElementsByTagName("*"),e=d.length,f;while(++c<e)f=d[c],f.originalElement&&g(f);b._shivedStyleSheet&&b._shivedStyleSheet.parentNode.removeChild(b._shivedStyleSheet)})})(this,document);

// prettify.js
var q=null;window.PR_SHOULD_USE_CONTINUATION=!0;
(function(){function L(a){function m(a){var f=a.charCodeAt(0);if(f!==92)return f;var b=a.charAt(1);return(f=r[b])?f:"0"<=b&&b<="7"?parseInt(a.substring(1),8):b==="u"||b==="x"?parseInt(a.substring(2),16):a.charCodeAt(1)}function e(a){if(a<32)return(a<16?"\\x0":"\\x")+a.toString(16);a=String.fromCharCode(a);if(a==="\\"||a==="-"||a==="["||a==="]")a="\\"+a;return a}function h(a){for(var f=a.substring(1,a.length-1).match(/\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\[0-3][0-7]{0,2}|\\[0-7]{1,2}|\\[\S\s]|[^\\]/g),a=
[],b=[],o=f[0]==="^",c=o?1:0,i=f.length;c<i;++c){var j=f[c];if(/\\[bdsw]/i.test(j))a.push(j);else{var j=m(j),d;c+2<i&&"-"===f[c+1]?(d=m(f[c+2]),c+=2):d=j;b.push([j,d]);d<65||j>122||(d<65||j>90||b.push([Math.max(65,j)|32,Math.min(d,90)|32]),d<97||j>122||b.push([Math.max(97,j)&-33,Math.min(d,122)&-33]))}}b.sort(function(a,f){return a[0]-f[0]||f[1]-a[1]});f=[];j=[NaN,NaN];for(c=0;c<b.length;++c)i=b[c],i[0]<=j[1]+1?j[1]=Math.max(j[1],i[1]):f.push(j=i);b=["["];o&&b.push("^");b.push.apply(b,a);for(c=0;c<
f.length;++c)i=f[c],b.push(e(i[0])),i[1]>i[0]&&(i[1]+1>i[0]&&b.push("-"),b.push(e(i[1])));b.push("]");return b.join("")}function y(a){for(var f=a.source.match(/\[(?:[^\\\]]|\\[\S\s])*]|\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\\d+|\\[^\dux]|\(\?[!:=]|[()^]|[^()[\\^]+/g),b=f.length,d=[],c=0,i=0;c<b;++c){var j=f[c];j==="("?++i:"\\"===j.charAt(0)&&(j=+j.substring(1))&&j<=i&&(d[j]=-1)}for(c=1;c<d.length;++c)-1===d[c]&&(d[c]=++t);for(i=c=0;c<b;++c)j=f[c],j==="("?(++i,d[i]===void 0&&(f[c]="(?:")):"\\"===j.charAt(0)&&
(j=+j.substring(1))&&j<=i&&(f[c]="\\"+d[i]);for(i=c=0;c<b;++c)"^"===f[c]&&"^"!==f[c+1]&&(f[c]="");if(a.ignoreCase&&s)for(c=0;c<b;++c)j=f[c],a=j.charAt(0),j.length>=2&&a==="["?f[c]=h(j):a!=="\\"&&(f[c]=j.replace(/[A-Za-z]/g,function(a){a=a.charCodeAt(0);return"["+String.fromCharCode(a&-33,a|32)+"]"}));return f.join("")}for(var t=0,s=!1,l=!1,p=0,d=a.length;p<d;++p){var g=a[p];if(g.ignoreCase)l=!0;else if(/[a-z]/i.test(g.source.replace(/\\u[\da-f]{4}|\\x[\da-f]{2}|\\[^UXux]/gi,""))){s=!0;l=!1;break}}for(var r=
{b:8,t:9,n:10,v:11,f:12,r:13},n=[],p=0,d=a.length;p<d;++p){g=a[p];if(g.global||g.multiline)throw Error(""+g);n.push("(?:"+y(g)+")")}return RegExp(n.join("|"),l?"gi":"g")}function M(a){function m(a){switch(a.nodeType){case 1:if(e.test(a.className))break;for(var g=a.firstChild;g;g=g.nextSibling)m(g);g=a.nodeName;if("BR"===g||"LI"===g)h[s]="\n",t[s<<1]=y++,t[s++<<1|1]=a;break;case 3:case 4:g=a.nodeValue,g.length&&(g=p?g.replace(/\r\n?/g,"\n"):g.replace(/[\t\n\r ]+/g," "),h[s]=g,t[s<<1]=y,y+=g.length,
t[s++<<1|1]=a)}}var e=/(?:^|\s)nocode(?:\s|$)/,h=[],y=0,t=[],s=0,l;a.currentStyle?l=a.currentStyle.whiteSpace:window.getComputedStyle&&(l=document.defaultView.getComputedStyle(a,q).getPropertyValue("white-space"));var p=l&&"pre"===l.substring(0,3);m(a);return{a:h.join("").replace(/\n$/,""),c:t}}function B(a,m,e,h){m&&(a={a:m,d:a},e(a),h.push.apply(h,a.e))}function x(a,m){function e(a){for(var l=a.d,p=[l,"pln"],d=0,g=a.a.match(y)||[],r={},n=0,z=g.length;n<z;++n){var f=g[n],b=r[f],o=void 0,c;if(typeof b===
"string")c=!1;else{var i=h[f.charAt(0)];if(i)o=f.match(i[1]),b=i[0];else{for(c=0;c<t;++c)if(i=m[c],o=f.match(i[1])){b=i[0];break}o||(b="pln")}if((c=b.length>=5&&"lang-"===b.substring(0,5))&&!(o&&typeof o[1]==="string"))c=!1,b="src";c||(r[f]=b)}i=d;d+=f.length;if(c){c=o[1];var j=f.indexOf(c),k=j+c.length;o[2]&&(k=f.length-o[2].length,j=k-c.length);b=b.substring(5);B(l+i,f.substring(0,j),e,p);B(l+i+j,c,C(b,c),p);B(l+i+k,f.substring(k),e,p)}else p.push(l+i,b)}a.e=p}var h={},y;(function(){for(var e=a.concat(m),
l=[],p={},d=0,g=e.length;d<g;++d){var r=e[d],n=r[3];if(n)for(var k=n.length;--k>=0;)h[n.charAt(k)]=r;r=r[1];n=""+r;p.hasOwnProperty(n)||(l.push(r),p[n]=q)}l.push(/[\S\s]/);y=L(l)})();var t=m.length;return e}function u(a){var m=[],e=[];a.tripleQuotedStrings?m.push(["str",/^(?:'''(?:[^'\\]|\\[\S\s]|''?(?=[^']))*(?:'''|$)|"""(?:[^"\\]|\\[\S\s]|""?(?=[^"]))*(?:"""|$)|'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$))/,q,"'\""]):a.multiLineStrings?m.push(["str",/^(?:'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$)|`(?:[^\\`]|\\[\S\s])*(?:`|$))/,
q,"'\"`"]):m.push(["str",/^(?:'(?:[^\n\r'\\]|\\.)*(?:'|$)|"(?:[^\n\r"\\]|\\.)*(?:"|$))/,q,"\"'"]);a.verbatimStrings&&e.push(["str",/^@"(?:[^"]|"")*(?:"|$)/,q]);var h=a.hashComments;h&&(a.cStyleComments?(h>1?m.push(["com",/^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/,q,"#"]):m.push(["com",/^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\n\r]*)/,q,"#"]),e.push(["str",/^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h|[a-z]\w*)>/,q])):m.push(["com",/^#[^\n\r]*/,
q,"#"]));a.cStyleComments&&(e.push(["com",/^\/\/[^\n\r]*/,q]),e.push(["com",/^\/\*[\S\s]*?(?:\*\/|$)/,q]));a.regexLiterals&&e.push(["lang-regex",/^(?:^^\.?|[!+-]|!=|!==|#|%|%=|&|&&|&&=|&=|\(|\*|\*=|\+=|,|-=|->|\/|\/=|:|::|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|[?@[^]|\^=|\^\^|\^\^=|{|\||\|=|\|\||\|\|=|~|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\s*(\/(?=[^*/])(?:[^/[\\]|\\[\S\s]|\[(?:[^\\\]]|\\[\S\s])*(?:]|$))+\/)/]);(h=a.types)&&e.push(["typ",h]);a=(""+a.keywords).replace(/^ | $/g,
"");a.length&&e.push(["kwd",RegExp("^(?:"+a.replace(/[\s,]+/g,"|")+")\\b"),q]);m.push(["pln",/^\s+/,q," \r\n\t\xa0"]);e.push(["lit",/^@[$_a-z][\w$@]*/i,q],["typ",/^(?:[@_]?[A-Z]+[a-z][\w$@]*|\w+_t\b)/,q],["pln",/^[$_a-z][\w$@]*/i,q],["lit",/^(?:0x[\da-f]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+-]?\d+)?)[a-z]*/i,q,"0123456789"],["pln",/^\\[\S\s]?/,q],["pun",/^.[^\s\w"-$'./@\\`]*/,q]);return x(m,e)}function D(a,m){function e(a){switch(a.nodeType){case 1:if(k.test(a.className))break;if("BR"===a.nodeName)h(a),
a.parentNode&&a.parentNode.removeChild(a);else for(a=a.firstChild;a;a=a.nextSibling)e(a);break;case 3:case 4:if(p){var b=a.nodeValue,d=b.match(t);if(d){var c=b.substring(0,d.index);a.nodeValue=c;(b=b.substring(d.index+d[0].length))&&a.parentNode.insertBefore(s.createTextNode(b),a.nextSibling);h(a);c||a.parentNode.removeChild(a)}}}}function h(a){function b(a,d){var e=d?a.cloneNode(!1):a,f=a.parentNode;if(f){var f=b(f,1),g=a.nextSibling;f.appendChild(e);for(var h=g;h;h=g)g=h.nextSibling,f.appendChild(h)}return e}
for(;!a.nextSibling;)if(a=a.parentNode,!a)return;for(var a=b(a.nextSibling,0),e;(e=a.parentNode)&&e.nodeType===1;)a=e;d.push(a)}var k=/(?:^|\s)nocode(?:\s|$)/,t=/\r\n?|\n/,s=a.ownerDocument,l;a.currentStyle?l=a.currentStyle.whiteSpace:window.getComputedStyle&&(l=s.defaultView.getComputedStyle(a,q).getPropertyValue("white-space"));var p=l&&"pre"===l.substring(0,3);for(l=s.createElement("LI");a.firstChild;)l.appendChild(a.firstChild);for(var d=[l],g=0;g<d.length;++g)e(d[g]);m===(m|0)&&d[0].setAttribute("value",
m);var r=s.createElement("OL");r.className="linenums";for(var n=Math.max(0,m-1|0)||0,g=0,z=d.length;g<z;++g)l=d[g],l.className="L"+(g+n)%10,l.firstChild||l.appendChild(s.createTextNode("\xa0")),r.appendChild(l);a.appendChild(r)}function k(a,m){for(var e=m.length;--e>=0;){var h=m[e];A.hasOwnProperty(h)?window.console&&console.warn("cannot override language handler %s",h):A[h]=a}}function C(a,m){if(!a||!A.hasOwnProperty(a))a=/^\s*</.test(m)?"default-markup":"default-code";return A[a]}function E(a){var m=
a.g;try{var e=M(a.h),h=e.a;a.a=h;a.c=e.c;a.d=0;C(m,h)(a);var k=/\bMSIE\b/.test(navigator.userAgent),m=/\n/g,t=a.a,s=t.length,e=0,l=a.c,p=l.length,h=0,d=a.e,g=d.length,a=0;d[g]=s;var r,n;for(n=r=0;n<g;)d[n]!==d[n+2]?(d[r++]=d[n++],d[r++]=d[n++]):n+=2;g=r;for(n=r=0;n<g;){for(var z=d[n],f=d[n+1],b=n+2;b+2<=g&&d[b+1]===f;)b+=2;d[r++]=z;d[r++]=f;n=b}for(d.length=r;h<p;){var o=l[h+2]||s,c=d[a+2]||s,b=Math.min(o,c),i=l[h+1],j;if(i.nodeType!==1&&(j=t.substring(e,b))){k&&(j=j.replace(m,"\r"));i.nodeValue=
j;var u=i.ownerDocument,v=u.createElement("SPAN");v.className=d[a+1];var x=i.parentNode;x.replaceChild(v,i);v.appendChild(i);e<o&&(l[h+1]=i=u.createTextNode(t.substring(b,o)),x.insertBefore(i,v.nextSibling))}e=b;e>=o&&(h+=2);e>=c&&(a+=2)}}catch(w){"console"in window&&console.log(w&&w.stack?w.stack:w)}}var v=["break,continue,do,else,for,if,return,while"],w=[[v,"auto,case,char,const,default,double,enum,extern,float,goto,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"],
"catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"],F=[w,"alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,dynamic_cast,explicit,export,friend,inline,late_check,mutable,namespace,nullptr,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"],G=[w,"abstract,boolean,byte,extends,final,finally,implements,import,instanceof,null,native,package,strictfp,super,synchronized,throws,transient"],
H=[G,"as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,interface,internal,into,is,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var"],w=[w,"debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN"],I=[v,"and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],
J=[v,"alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"],v=[v,"case,done,elif,esac,eval,fi,function,in,local,set,then,until"],K=/^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)/,N=/\S/,O=u({keywords:[F,H,w,"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END"+
I,J,v],hashComments:!0,cStyleComments:!0,multiLineStrings:!0,regexLiterals:!0}),A={};k(O,["default-code"]);k(x([],[["pln",/^[^<?]+/],["dec",/^<!\w[^>]*(?:>|$)/],["com",/^<\!--[\S\s]*?(?:--\>|$)/],["lang-",/^<\?([\S\s]+?)(?:\?>|$)/],["lang-",/^<%([\S\s]+?)(?:%>|$)/],["pun",/^(?:<[%?]|[%?]>)/],["lang-",/^<xmp\b[^>]*>([\S\s]+?)<\/xmp\b[^>]*>/i],["lang-js",/^<script\b[^>]*>([\S\s]*?)(<\/script\b[^>]*>)/i],["lang-css",/^<style\b[^>]*>([\S\s]*?)(<\/style\b[^>]*>)/i],["lang-in.tag",/^(<\/?[a-z][^<>]*>)/i]]),
["default-markup","htm","html","mxml","xhtml","xml","xsl"]);k(x([["pln",/^\s+/,q," \t\r\n"],["atv",/^(?:"[^"]*"?|'[^']*'?)/,q,"\"'"]],[["tag",/^^<\/?[a-z](?:[\w-.:]*\w)?|\/?>$/i],["atn",/^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],["lang-uq.val",/^=\s*([^\s"'>]*(?:[^\s"'/>]|\/(?=\s)))/],["pun",/^[/<->]+/],["lang-js",/^on\w+\s*=\s*"([^"]+)"/i],["lang-js",/^on\w+\s*=\s*'([^']+)'/i],["lang-js",/^on\w+\s*=\s*([^\s"'>]+)/i],["lang-css",/^style\s*=\s*"([^"]+)"/i],["lang-css",/^style\s*=\s*'([^']+)'/i],["lang-css",
/^style\s*=\s*([^\s"'>]+)/i]]),["in.tag"]);k(x([],[["atv",/^[\S\s]+/]]),["uq.val"]);k(u({keywords:F,hashComments:!0,cStyleComments:!0,types:K}),["c","cc","cpp","cxx","cyc","m"]);k(u({keywords:"null,true,false"}),["json"]);k(u({keywords:H,hashComments:!0,cStyleComments:!0,verbatimStrings:!0,types:K}),["cs"]);k(u({keywords:G,cStyleComments:!0}),["java"]);k(u({keywords:v,hashComments:!0,multiLineStrings:!0}),["bsh","csh","sh"]);k(u({keywords:I,hashComments:!0,multiLineStrings:!0,tripleQuotedStrings:!0}),
["cv","py"]);k(u({keywords:"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["perl","pl","pm"]);k(u({keywords:J,hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["rb"]);k(u({keywords:w,cStyleComments:!0,regexLiterals:!0}),["js"]);k(u({keywords:"all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,true,try,unless,until,when,while,yes",
hashComments:3,cStyleComments:!0,multilineStrings:!0,tripleQuotedStrings:!0,regexLiterals:!0}),["coffee"]);k(x([],[["str",/^[\S\s]+/]]),["regex"]);window.prettyPrintOne=function(a,m,e){var h=document.createElement("PRE");h.innerHTML=a;e&&D(h,e);E({g:m,i:e,h:h});return h.innerHTML};window.prettyPrint=function(a){function m(){for(var e=window.PR_SHOULD_USE_CONTINUATION?l.now()+250:Infinity;p<h.length&&l.now()<e;p++){var n=h[p],k=n.className;if(k.indexOf("prettyprint")>=0){var k=k.match(g),f,b;if(b=
!k){b=n;for(var o=void 0,c=b.firstChild;c;c=c.nextSibling)var i=c.nodeType,o=i===1?o?b:c:i===3?N.test(c.nodeValue)?b:o:o;b=(f=o===b?void 0:o)&&"CODE"===f.tagName}b&&(k=f.className.match(g));k&&(k=k[1]);b=!1;for(o=n.parentNode;o;o=o.parentNode)if((o.tagName==="pre"||o.tagName==="code"||o.tagName==="xmp")&&o.className&&o.className.indexOf("prettyprint")>=0){b=!0;break}b||((b=(b=n.className.match(/\blinenums\b(?::(\d+))?/))?b[1]&&b[1].length?+b[1]:!0:!1)&&D(n,b),d={g:k,h:n,i:b},E(d))}}p<h.length?setTimeout(m,
250):a&&a()}for(var e=[document.getElementsByTagName("pre"),document.getElementsByTagName("code"),document.getElementsByTagName("xmp")],h=[],k=0;k<e.length;++k)for(var t=0,s=e[k].length;t<s;++t)h.push(e[k][t]);var e=q,l=Date;l.now||(l={now:function(){return+new Date}});var p=0,d,g=/\blang(?:uage)?-([\w.]+)(?!\S)/;m()};window.PR={createSimpleLexer:x,registerLangHandler:k,sourceDecorator:u,PR_ATTRIB_NAME:"atn",PR_ATTRIB_VALUE:"atv",PR_COMMENT:"com",PR_DECLARATION:"dec",PR_KEYWORD:"kwd",PR_LITERAL:"lit",
PR_NOCODE:"nocode",PR_PLAIN:"pln",PR_PUNCTUATION:"pun",PR_SOURCE:"src",PR_STRING:"str",PR_TAG:"tag",PR_TYPE:"typ"}})();

