// ==UserScript==
// @name           Reverse Pixiv
// @version 1.0.0
// @namespace      http://e-shuushuu.net
// @description    Add romanized artist name to Pixiv pages
// @include        http://e-shuushuu.net*
// @updateURL      http://claritism.com/pixivf/reverse-pixiv.user.js
// @grant GM_xmlhttpRequest
// @require       http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @licence       MIT http://opensource.org/licenses/MIT
// ==/UserScript==
/*global GM_xmlhttpRequest: true*/
var filename=$("dt:contains(Original Filename:)").next();filename.each(function(a,b){var c=$(b),d=c.text().match(/^\d+(_big)?(_p\d+)?(\.jpg|\.png|\.gif)$/);if(null!==d){d=d[0].match(/\d+/);var e=$("<a>").attr("href","http://www.pixiv.net/member_illust.php?mode=medium&illust_id="+d[0]).text(c.text());c.text("").append(e),GM_xmlhttpRequest({method:"GET",url:"http://www.pixiv.net/member_illust.php?mode=medium&illust_id="+d[0],onload:function(a){var b=a.responseText.match(/href="\/member\.php\?id=[0-9]+/),d=b[0].match(/\d+$/);GM_xmlhttpRequest({method:"GET",url:"http://pixivfetcher-claritism.rhcloud.com/artist/"+d[0],onload:function(a){var b=JSON.parse(a.response);if(null!==b.romanji){var d=$("<span>").text(b.romanji).css({"margin-left":"10px","font-style":"italic"});c.append(d)}}})}})}});