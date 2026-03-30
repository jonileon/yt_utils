// ------------------  focus search input when pressing '/'  ---------------------

document.addEventListener("keydown", (event) => {
    if (event.key === "/"){
        const active = document.activeElement;
        if (
            active &&
            (active.tagName === "INPUT" ||
                active.tagName === "TEXTAREA" ||
                active.isContentEditable)
        ) {
            return;
        }
        console.log("Focused Search Bar");
        const searchInput = document.querySelector('input[name="search_query"]');
        if (searchInput) {
            event.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    }
    if (event.key === "Escape") {
        const searchInput = document.querySelector('input[name="search_query"]');
        console.log("Defocused Search Bar");
        if (active === searchInput) {
            searchInput.blur();
            event.preventDefault();
        }
        return;
    }
    return;
});

// -------------  delete any elements associated to youtube shorts  ----------------
let path = window.location.pathname;

history.replaceState = function(...args) {
    originalReplace.apply(this, args);
    window.dispatchEvent(new Event('yt-navigate'));
};

// removes the shorts tab on the sidebar
function remove_shorts_tab() {
    const interval = setInterval(() => {
        const shorts_tab = document.querySelector('a[title="Shorts"]');
        if (shorts_tab) {
            shorts_tab.remove();
            clearInterval(interval);
        }
    }, 50);
}

// remove shorts on the homepage
function remove_shorts_suggestions() {
    const interval = setInterval(() => {
        const shorts_content_cards = document.querySelectorAll('ytd-rich-shelf-renderer[is-shorts]');
        if (shorts_content_cards.length != 0) {
            shorts_content_cards.forEach(e => e.parentNode.parentNode.remove());
        }
    }, 50)
}

// remove shorts from query page
function remove_shorts_cards() {
    setInterval(() => {
        const shorts = document.querySelectorAll('grid-shelf-view-model');
        if (shorts.length != 0) {
            shorts.forEach(e => e.remove());
        }
    }, 150);
}

let filter_removed = false;
function remove_shorts_filter() {
    if (!filter_removed){
        const interval = setInterval(() => {
            const filter = Array.from(document.querySelectorAll('button.ytChipShapeButtonReset'))
                .find(btn => btn.textContent.includes('Shorts'));
            console.log(filter);
            if (filter) {
                filter.remove();
                filter_removed = true;
                clearInterval(interval);
            }
        }, 50)
    }
}

function remove_shorts_on_reload() {
    path = location.pathname;
    console.log(path);
    if (path === '/results') {
        remove_shorts_cards();
        remove_shorts_filter();
    }
    if (path === '/') {
        remove_shorts_suggestions();
    }
    remove_shorts_tab();
    let timeout
    window.addEventListener('resize', () => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            console.log('resized');
            remove_shorts_tab();
        }, 200);
    })
}

remove_shorts_on_reload();
window.addEventListener('yt-navigate', () => {
    console.log('navigated to:')
    remove_shorts_on_reload();
})

//[TODO] add automatic switching to ov audio track
