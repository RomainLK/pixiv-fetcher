// ==UserScript==
// @name           Reverse Pixiv
// @version 1.0.1
// @namespace      http://e-shuushuu.net
// @description    Add romanized artist name to Pixiv pages
// @include        http://e-shuushuu.net*
// @updateURL      https://github.com/RomainLK/pixiv-fetcher/raw/master/build/reverse-pixiv.min.user.js
// @grant GM_xmlhttpRequest
// @require       http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @licence       MIT http://opensource.org/licenses/MIT
// ==/UserScript==
/*global GM_xmlhttpRequest: true*/



var filename = $('dt:contains(Original Filename:)').next();
filename.each(function(index, item){
    var node = $(item);
    var imageId = node.text().match(/^\d+(_big)?(_p\d+)?(\.jpg|\.png|\.gif)$/);
    if( imageId !== null ) {
        imageId = imageId[0].match(/\d+/);
        var link = $('<a>').attr('href','http://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + imageId[0]).text(node.text());
        node.text('').append(link);
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + imageId[0] ,
            onload: function(result) {
                var href = result.responseText.match(/href="\/member\.php\?id=[0-9]+/);
                var id = href[0].match(/\d+$/);                    
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'http://pixivfetcher-claritism.rhcloud.com/artist/' + id[0] ,
                        onload: function(result) {
                            var artist = JSON.parse(result.responseText);
                            if(artist.romanji !== null){
                                var span = $('<span>').text(artist.romanji).css({
                                    'margin-left' : '10px',
                                    'font-style' : 'italic'
                                });
                                node.append(span);
                            }
                        }
                    });
            }
        });
        
    }
});