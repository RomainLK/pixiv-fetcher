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

var user = $('.user-link');
var id;
var p;
var dialog;
var jDialog;
var username;
var password;
var romanji;
var dburl = 'http://pixivfetcher-claritism.rhcloud.com/';
/**
 * #getRomanji
 * Fetch the romanji from the database
 * @param {Number} id id of the Pixiv artist
 * @param {Function} callback callback(result)
 * */
function getRomanji(id, callback) {
	var request = dburl + 'artist/' + id;
	GM_xmlhttpRequest({
		method: 'GET',
		headers: {
			"Referer": document.URL
		},
		url: request,
		onload: function(result) {
			var artist = JSON.parse(result.responseText);
			if (artist.romanji !== null) {
				callback(artist.romanji);
			}
			else {
				callback(null);
			}
		}
	});
}

/**
 * #postLogin
 * Login into the database
 * @param {String} name username
 * @param {String} pass password
 * @param {Function} callback callback(err,isLogged)
 * */
function postLogin(name, pass, callback) {
	GM_xmlhttpRequest({
		method: 'POST',
		url: 'http://pixivfetcher-claritism.rhcloud.com/user/session',
		headers: {
			"Content-type": "application/x-www-form-urlencoded"
		},
		data: 'username=' + name + '&password=' + pass,
		onload: function(result) {
			if (result.status !== 200) {
				callback(result.responseText, false );
			}
			else {
				callback(null, true);
			}
		}
	});
}

/**
 * #postRomanji
 * Update the artist
 * @param {String} value the romanized name
 * @param {Function} callback callback(err,isSuccess)
 * */
 
function postRomanji(value,callback){
				GM_xmlhttpRequest({
				method: 'POST',
				url: 'http://pixivfetcher-claritism.rhcloud.com/artist',
				headers: {
					"Content-type": "application/x-www-form-urlencoded"
				},
				data: 'username=' + username + '&password=' + password + '&pixivId=' + id + '&romanji=' + value,
				onload: function(result) {
					if (result.status !== 200) {
						callback(result.responseText,false);
					}
					else {
						callback(null, true);
					
					}
				}
			});
}

/**
 * #Render
 * Render the interface on the left
 * below the avatar
 * @param {Boolean} show By default, false to hide the popup
 * */
function render(show) {
	if (typeof jDialog !== 'undefined') {
		jDialog.remove();
	}
	if (typeof p !== 'undefined') {
		p.remove();
	}
	var _show = show || false;
	var templateLogin = '<div class="dialog" style="display: none;"><p><strong>Pixiv Fetcher</strong></p><div  id="pclose" class="close"></div><form id="pform">' + '<input type="text" name="username" placeholder="Username" style="width:128px;"><br/><br/> <input type="password" name="password" placeholder="Password"> ' + '<div id="pnotif"></div>' + '<div class="action"><input id="psubmit" type="submit" name="left_column" value="Login" class="button">' + '<input id="pcancel" value="Cancel" class="button remove"></div></form></div>';
	var templateEdit = '<div class="dialog" style="display: none;"><p><strong>Pixiv Fetcher</strong></p><div id="pclose" class="close"></div><form id="pform">' + '<label for="romanji">Romanji:</label> <input type="text" name="romanji" placeholder="Romanji" style="width:128px;">' + '<div id="pnotif"></div>' + '<div class="action"><input id="psubmit"  type="submit" name="left_column" value="Submit" class="button">' + '<input id="pcancel" value="Cancel" class="button remove"></div></form>' + '<br><br><a href="javascript:void(0)" id="plogout" >Logout</a> </div>';

	username = GM_getValue('pUsername', null);
	password = GM_getValue('pPassword', null);
	
	// #Rendering when we are not logged
	if (username === null || password === null) {
		dialog = $.parseHTML(templateLogin);
		jDialog = $(dialog);
		jDialog.find('#pform').submit(function(event) {
			var name = jDialog.find('input[name="username"]').val();
			var pass = jDialog.find('input[name="password"]').val();
			postLogin(name, pass, function(err, isLogged) {
				if (isLogged) {
					GM_setValue('pUsername', name);
					GM_setValue('pPassword', pass);
					render(true);
				}
				else {
					jDialog.find('#pnotif').text(err);
				}
			});
			return false;
		});
	}
	// #Rendering when we are logged
	else {
		dialog = $.parseHTML(templateEdit);
		jDialog = $(dialog);
		romanji = romanji || '';
		jDialog.find('input[name="romanji"]').val(romanji);
		jDialog.find('#pform').submit(function(event) {
			var value = jDialog.find('input[name="romanji"]').val();
			postRomanji(value,function(err,isSuccess){
				if(isSuccess){
						romanji = value;
						render(false);
				}else {
					jDialog.find('#pnotif').text(err);
				}
			});

			return false;
		});
	}
	
	// #Common button binding
	jDialog.find('#plogout').click(function(event) {
		GM_deleteValue('pUsername');
		GM_deleteValue('pPassword');
		render(true);
	});
	jDialog.find('.close').click(function(event) {
		jDialog.hide();
	});
	jDialog.find('#pcancel').click(function(event) {
		jDialog.hide();
	});
	
	// #Adding the name under the avatar
	p = $('<div>').css({
		'font-style': 'italic',
		'font-size': '13px',
		'cursor': 'pointer'
	});
	if (romanji === '' || romanji === null) {
		p.text('No romanji');
	}
	else {
		p.text(romanji);
	}
	p.click(function(event) {
		jDialog.show();
	});
	user.after(p);
	p.after(dialog);
	if (_show) {
		jDialog.show();
	}
}

// Here we do the first request and first render
if (user.length > 0 && document.URL !== 'http://www.pixiv.net/mypage.php') {
	id = user.attr('href').match(/\d+$/g);
	getRomanji(id, function(result){
		romanji = result;
		render(false);
	});
}

// # Handler for thumbnails view 

function getUsers(element){
		if(document.URL === 'http://www.pixiv.net/mypage.php'){
		return $(element).find('#item-container .user');
		}
		else if (document.URL.indexOf('http://www.pixiv.net/bookmark.php?type=user') > -1){
		return $(element).find('.userdata a');
		}
		else if ( document.URL.indexOf('http://www.pixiv.net/bookmark_new_illust.php') > -1){
		return $(element).find('.user');
		}
		else if (document.URL.indexOf('http://www.pixiv.net/bookmark.php') > -1){
		return $(element).find('.f10').children();
		}
		return [];
}

function addRomanjiForEach(users){
	users.each(function(index,item){
		item = $(item);
		var id = item.attr('href').match(/\d+$/g);
		getRomanji(id,function(result){
			if(result){
				var caption = $('<div>').text(result).css({
					'font-style': 'italic',
					'font-size': '12px',
				});
				
				item.after(caption);
			}
		});
	});
}

//var users;
//users = getUsers(document);

addRomanjiForEach(getUsers(document));

$(document).bind('DOMNodeInserted', function(e) {
	addRomanjiForEach(getUsers(e.target));
});


