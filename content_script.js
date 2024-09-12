window.addEventListener("load", function() {
    const customIconURL = browser.runtime.getURL("icons/bird.png");

    const observer = new MutationObserver(() => {
        let targetIcon = document.querySelector('svg');

        if (targetIcon) {
            let newIcon = document.createElement("img");
            newIcon.src = customIconURL;
            newIcon.style.width = "38px";
            newIcon.style.height = "32px";

            targetIcon.replaceWith(newIcon);
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});