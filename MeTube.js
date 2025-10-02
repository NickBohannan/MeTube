// ==UserScript==
// @name     MeTube
// @version  1
// @grant    none
// @match    https://www.youtube.com/*
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        removeShorts();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function removeShorts() {
        // remove shorts on homepage
        document.querySelectorAll('ytd-rich-shelf-renderer').forEach(shelf => {
            if (shelf.innerText.includes('Shorts')) {
                shelf.remove();
            }
        });

        // remove shorts from search and sidebar
        document.querySelectorAll('a[href*="/shorts/"]').forEach(el => {
            let container = el.closest('ytd-grid-video-renderer,ytd-video-renderer,ytd-reel-item-renderer,ytd-compact-video-renderer');
            if (container) container.remove();
        });

        // remove shorts from the sidebar shelf
        document.querySelectorAll('ytd-reel-shelf-renderer').forEach(el => el.remove());
    }
})();

