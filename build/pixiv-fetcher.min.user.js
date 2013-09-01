// ==UserScript==
// @name           Pixiv Fetcher
// @version 1.2.0
// @copyright     Copyright (c) <2011-2013> Merun
// @license       MIT http://opensource.org/licenses/MIT
// @namespace     http://e-shuushuu.net
// @description   Add romanized artist name to Pixiv pages
// @include       http://www.pixiv.net/*
// @updateURL     https://github.com/RomainLK/pixiv-fetcher/raw/master/build/pixiv-fetcher.min.user.js
// @grant         GM_xmlhttpRequest 
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @require       http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// ==/UserScript==
/*global GM_xmlhttpRequest: true, GM_getValue: true, GM_setValue: true, GM_deleteValue: true*/
/**
 * #getRomanji
 * Fetch the romanji from the database
 * @param {Number} id id of the Pixiv artist
 * @param {Function} callback callback(result)
 * */
function getRomanji(a,b){var c=dburl+"artist/"+a;GM_xmlhttpRequest({method:"GET",headers:{Referer:document.URL},url:c,onload:function(a){var c=JSON.parse(a.responseText);null!==c.romanji?b(c.romanji):b(null)}})}/**
 * #postLogin
 * Login into the database
 * @param {String} name username
 * @param {String} pass password
 * @param {Function} callback callback(err,isLogged)
 * */
function postLogin(a,b,c){GM_xmlhttpRequest({method:"POST",url:"http://pixivfetcher-claritism.rhcloud.com/user/session",headers:{"Content-type":"application/x-www-form-urlencoded"},data:"username="+a+"&password="+b,onload:function(a){200!==a.status?c(a.responseText,!1):c(null,!0)}})}/**
 * #postRomanji
 * Update the artist
 * @param {String} value the romanized name
 * @param {Function} callback callback(err,isSuccess)
 * */
function postRomanji(a,b){GM_xmlhttpRequest({method:"POST",url:"http://pixivfetcher-claritism.rhcloud.com/artist",headers:{"Content-type":"application/x-www-form-urlencoded"},data:"username="+username+"&password="+password+"&pixivId="+id+"&romanji="+a,onload:function(a){200!==a.status?b(a.responseText,!1):b(null,!0)}})}/**
 * #Render
 * Render the interface on the left
 * below the avatar
 * @param {Boolean} show By default, false to hide the popup
 * */
function render(a){"undefined"!=typeof jDialog&&jDialog.remove(),"undefined"!=typeof p&&p.remove();var b=a||!1,c='<div class="dialog" style="display: none;"><p><strong>Pixiv Fetcher</strong></p><div  id="pclose" class="close"></div><form id="pform"><input type="text" name="username" placeholder="Username" style="width:128px;"><br/><br/> <input type="password" name="password" placeholder="Password"> <div id="pnotif"></div><div class="action"><input id="psubmit" type="submit" name="left_column" value="Login" class="button"><input id="pcancel" value="Cancel" class="button remove"></div></form></div>',d='<div class="dialog" style="display: none;"><p><strong>Pixiv Fetcher</strong></p><div id="pclose" class="close"></div><form id="pform"><label for="romanji">Romanji:</label> <input type="text" name="romanji" placeholder="Romanji" style="width:128px;"><div id="pnotif"></div><div class="action"><input id="psubmit"  type="submit" name="left_column" value="Submit" class="button"><input id="pcancel" value="Cancel" class="button remove"></div></form><br><br><a href="javascript:void(0)" id="plogout" >Logout</a> </div>';username=GM_getValue("pUsername",null),password=GM_getValue("pPassword",null),// #Rendering when we are not logged
null===username||null===password?(dialog=$.parseHTML(c),jDialog=$(dialog),jDialog.find("#pform").submit(function(){var a=jDialog.find('input[name="username"]').val(),b=jDialog.find('input[name="password"]').val();return postLogin(a,b,function(c,d){d?(GM_setValue("pUsername",a),GM_setValue("pPassword",b),render(!0)):jDialog.find("#pnotif").text(c)}),!1})):(dialog=$.parseHTML(d),jDialog=$(dialog),romanji=romanji||"",jDialog.find('input[name="romanji"]').val(romanji),jDialog.find("#pform").submit(function(){var a=jDialog.find('input[name="romanji"]').val();return postRomanji(a,function(b,c){c?(romanji=a,render(!1)):jDialog.find("#pnotif").text(b)}),!1})),// #Common button binding
jDialog.find("#plogout").click(function(){GM_deleteValue("pUsername"),GM_deleteValue("pPassword"),render(!0)}),jDialog.find(".close").click(function(){jDialog.hide()}),jDialog.find("#pcancel").click(function(){jDialog.hide()}),// #Adding the name under the avatar
p=$("<div>").css({"font-style":"italic","font-size":"13px",cursor:"pointer"}),""===romanji||null===romanji?p.text("No romanji"):p.text(romanji),p.click(function(){jDialog.show()}),user.after(p),p.after(dialog),b&&jDialog.show()}// # Handler for thumbnails view 
function getUsers(a){return"http://www.pixiv.net/mypage.php"===document.URL?$(a).find("#item-container .user"):document.URL.indexOf("http://www.pixiv.net/bookmark.php?type=user")>-1?$(a).find(".userdata a"):document.URL.indexOf("http://www.pixiv.net/bookmark_new_illust.php")>-1?$(a).find(".user"):document.URL.indexOf("http://www.pixiv.net/bookmark.php")>-1?$(a).find(".f10").children():[]}function addRomanjiForEach(a){a.each(function(a,b){b=$(b);var c=b.attr("href").match(/\d+$/g);getRomanji(c,function(a){if(a){var c=$("<div>").text(a).css({"font-style":"italic","font-size":"12px"});b.after(c)}})})}var user=$(".user-link"),id,p,dialog,jDialog,username,password,romanji,dburl="http://pixivfetcher-claritism.rhcloud.com/";// Here we do the first request and first render
user.length>0&&"http://www.pixiv.net/mypage.php"!==document.URL&&(id=user.attr("href").match(/\d+$/g),getRomanji(id,function(a){romanji=a,render(!1)})),//var users;
//users = getUsers(document);
addRomanjiForEach(getUsers(document)),$(document).bind("DOMNodeInserted",function(a){addRomanjiForEach(getUsers(a.target))});