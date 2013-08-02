// ==UserScript==
// @name           Reverse Pixiv
// @version 1.1.0
// @namespace      http://e-shuushuu.net
// @description    Add romanized artist name to Pixiv pages
// @include        http://e-shuushuu.net*
// @updateURL      https://github.com/RomainLK/pixiv-fetcher/raw/master/build/reverse-pixiv.min.user.js
// @grant GM_xmlhttpRequest
// @require       http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @licence       MIT http://opensource.org/licenses/MIT
// ==/UserScript==
/*global GM_xmlhttpRequest: true*/
function process(a){var b=$(a),c=b.text().match(/^\d+((_big)|(_m))?(_p\d+)?(\.jpg|\.png|\.gif)$/);if(null!==c){c=c[0].match(/\d+/);var d=$("<a>").attr("href","http://www.pixiv.net/member_illust.php?mode=medium&illust_id="+c[0]).text(b.text());b.text("").append(d),GM_xmlhttpRequest({method:"GET",url:"http://www.pixiv.net/member_illust.php?mode=medium&illust_id="+c[0],onload:function(a){var c=a.responseText.match(/href="\/member\.php\?id=[0-9]+/),d=c[0].match(/\d+$/);GM_xmlhttpRequest({method:"GET",url:"http://pixivfetcher-claritism.rhcloud.com/artist/"+d[0],onload:function(a){var c=JSON.parse(a.responseText);if(null!==c.romanji){var d=$("<span>").text(c.romanji).css({"margin-left":"10px","font-style":"italic"});b.append(d)}}})}})}}var filename=$("dt:contains(Original Filename:)").next();filename.each(function(a,b){process(b)}),$(document).bind("DOMNodeInserted",function(a){console.log(a.target," was inserted");var b=$(a.target).find("dt:contains(Original Filename:)").next();b.each(function(a,b){process(b)})});