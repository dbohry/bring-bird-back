// Cross-browser compatibility for Chrome and Firefox
const runtime = (typeof browser !== 'undefined') ? browser : chrome;
const customIconURL = runtime.runtime.getURL("icons/bird.png");

function replaceMainLogo() {
    const mainLogoSelectors = [
        'header h1 a svg',
        'header a[aria-label="X"] svg',
        'header [role="banner"] a svg',
        'h1[role="heading"] a svg',
        'header a[href="/"] svg',
        '[data-testid="SideNav_AccountSwitcher_Button"] ~ * h1 a svg'
    ];

    for (const selector of mainLogoSelectors) {
        const targetIcon = document.querySelector(selector);
        if (targetIcon && !targetIcon.hasAttribute('data-bird-replaced')) {
            const parentLink = targetIcon.closest('a');
            const isInSidebar = targetIcon.closest('[data-testid*="SideNav"]') ||
                               targetIcon.closest('nav[role="navigation"]');
            const hasHomeIcon = targetIcon.querySelector('path[d*="22.46 12"]');

            if (parentLink && !isInSidebar && !hasHomeIcon &&
                (parentLink.getAttribute('href') === '/' ||
                 parentLink.getAttribute('aria-label') === 'X' ||
                 parentLink.closest('h1'))) {

                let newIcon = document.createElement("img");
                newIcon.src = customIconURL;
                const originalWidth = targetIcon.getAttribute('width') || "24";
                const originalHeight = targetIcon.getAttribute('height') || "24";
                const scaleFactor = 1.3; // 30% bigger
                newIcon.style.width = Math.round(parseInt(originalWidth) * scaleFactor) + "px";
                newIcon.style.height = Math.round(parseInt(originalHeight) * scaleFactor) + "px";
                newIcon.setAttribute('data-bird-replaced', 'true');
                newIcon.style.verticalAlign = "middle";

                targetIcon.replaceWith(newIcon);
                return;
            }
        }
    }
}

function replaceFavicon() {
    // Find and replace the favicon in the document head
    const faviconSelectors = [
        'link[rel="icon"]',
        'link[rel="shortcut icon"]',
        'link[rel*="icon"]'
    ];

    for (const selector of faviconSelectors) {
        const faviconLink = document.querySelector(selector);
        if (faviconLink && !faviconLink.hasAttribute('data-bird-favicon-replaced')) {
            faviconLink.href = customIconURL;
            faviconLink.setAttribute('data-bird-favicon-replaced', 'true');
            break; // Only replace the first favicon found
        }
    }
}

function replaceBirdElements() {
    replaceMainLogo();
    replaceFavicon();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceBirdElements);
} else {
    replaceBirdElements();
}

const observer = new MutationObserver(() => {
    replaceBirdElements();
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
});

window.addEventListener('popstate', () => {
    setTimeout(replaceBirdElements, 100);
});

(function() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
        originalPushState.apply(history, arguments);
        setTimeout(replaceBirdElements, 100);
    };

    history.replaceState = function() {
        originalReplaceState.apply(history, arguments);
        setTimeout(replaceBirdElements, 100);
    };
})();