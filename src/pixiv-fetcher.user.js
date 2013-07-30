// ==UserScript==
// @name           Pixiv Fetcher
// @version 1.1.2
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
	if (username === null || password === null) {
		dialog = $.parseHTML(templateLogin);
		jDialog = $(dialog)
		jDialog.find('#pform').submit(function(event) {
			var name = jDialog.find('input[name="username"]').val();
			var pass = jDialog.find('input[name="password"]').val();

			GM_xmlhttpRequest({
				method: 'POST',
				url: 'http://pixivfetcher-claritism.rhcloud.com/user/session',
				headers: {
					"Content-type": "application/x-www-form-urlencoded"
				},
				data: 'username=' + name + '&password=' + pass,
				onload: function(result) {
					if (result.status !== 200) {
						jDialog.find('#pnotif').text(result.responseText);
					}
					else {
						GM_setValue('pUsername', name);
						GM_setValue('pPassword', pass);
						render(true);
					}
				}
			});
			return false;


		});
	}
	else {
		dialog = $.parseHTML(templateEdit);
		jDialog = $(dialog);
		romanji = romanji || '';
		jDialog.find('input[name="romanji"]').val(romanji);
		jDialog.find('#pform').submit(function(event) {
			var value = jDialog.find('input[name="romanji"]').val();

			GM_xmlhttpRequest({
				method: 'POST',
				url: 'http://pixivfetcher-claritism.rhcloud.com/artist',
				headers: {
					"Content-type": "application/x-www-form-urlencoded"
				},
				data: 'username=' + username + '&password=' + password + '&pixivId=' + id + '&romanji=' + value,
				onload: function(result) {
					if (result.status !== 200) {
						jDialog.find('#pnotif').text(result.responseText);
					}
					else {
						romanji = value;
						jDialog.find('#pnotif').text(result.responseText);
						render(false);
					}
				}
			});

			return false;



		});
	}
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
	p = $('<div>').css({
		'font-style': 'italic',
		'font-size': '13px',
		'cursor': 'pointer'
	});
	if (romanji === '') {
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

if (user.length > 0) {
	id = user.attr('href').match(/\d/g).join('');

	var request = 'http://pixivfetcher-claritism.rhcloud.com/artist/' + id;

	GM_xmlhttpRequest({
		method: 'GET',
		headers: {
			"Referer": document.URL
		},
		url: request,
		onload: function(result) {
			var artist = JSON.parse(result.responseText);
			if (artist.romanji !== null) {
				romanji = artist.romanji;
			}
			else {
				romanji = '';
			}
			render();
		}
	});
}