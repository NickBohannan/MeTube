// ==UserScript==
// @name         YouTube Home - Block Shorts
// @namespace    metube
// @version      1.0.0
// @description  Hides Shorts content on the YouTube home page.
// @author       you
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
	'use strict';

	let updateScheduled = false;

	const observer = new MutationObserver(() => {
		scheduleUpdate();
	});

	function isHomePage() {
		const path = window.location.pathname;
		return path === '/';
	}

	function removeShortsFromHome() {
		if (!isHomePage()) {
			return;
		}

		// Removes shelves titled "Shorts" from the home feed.
		document.querySelectorAll('ytd-rich-shelf-renderer').forEach((shelf) => {
			const titleEl = shelf.querySelector('#title');
			const titleText = (titleEl?.textContent || '').trim().toLowerCase();
			if (titleText === 'shorts') {
				shelf.remove();
			}
		});

		// Removes dedicated reel shelf blocks if present.
		document.querySelectorAll('ytd-reel-shelf-renderer').forEach((reelShelf) => {
			reelShelf.remove();
		});

		// Removes any individual video cards that directly point to /shorts/.
		document.querySelectorAll('a[href*="/shorts/"]').forEach((link) => {
			const card = link.closest(
				'ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer'
			);
			if (card) {
				card.remove();
			}
		});
	}

	function applyChanges() {
		observer.disconnect();
		removeShortsFromHome();

		if (document.body) {
			observer.observe(document.body, { childList: true, subtree: true });
		}
	}

	function scheduleUpdate() {
		if (updateScheduled) {
			return;
		}

		updateScheduled = true;
		requestAnimationFrame(() => {
			updateScheduled = false;
			applyChanges();
		});
	}

	function start() {
		applyChanges();

		// YouTube is an SPA; re-run after in-app navigation.
		window.addEventListener('yt-navigate-finish', scheduleUpdate);
		window.addEventListener('popstate', scheduleUpdate);
	}

	if (document.readyState === 'loading') {
		window.addEventListener('DOMContentLoaded', start, { once: true });
	} else {
		start();
	}
})();
