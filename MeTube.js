// ==UserScript==
// @name     MeTube
// @version  1
// @grant    none
// @match    https://www.youtube.com/
// ==/UserScript==

(function() {
    'use strict';

    let updateScheduled = false;

    const observer = new MutationObserver(() => {
        scheduleUpdate();
    });

    function applyChanges() {
        observer.disconnect();

        removeShorts();
        renameThumbnails();
        removeThumbnailImages();

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function scheduleUpdate() {
        if (updateScheduled || !document.body) {
            return;
        }

        updateScheduled = true;
        requestAnimationFrame(() => {
            updateScheduled = false;
            applyChanges();
        });
    }

    function startObserver() {
        applyChanges();
    }

    if (document.body) {
        startObserver();
    } else {
        window.addEventListener('DOMContentLoaded', startObserver, { once: true });
    }

    // YouTube is an SPA, so re-apply after internal navigation events.
    window.addEventListener('yt-navigate-finish', () => {
        scheduleUpdate();
    });


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

    function renameThumbnails() {
        document.querySelectorAll('.yt-core-attributed-string').forEach(el => {
            const title = 'lol pwn3d';
            if (el && el.textContent !== title) {
                el.textContent = title;
            }
        });
    }
    

    function removeThumbnailImages() {
        document.querySelectorAll('.yt-lockup-view-model__content-image').forEach(node => {
            node.remove();;
        });    
    }
})();
