'use strict';


// Things that have to be loaded at the end
window.addEventListener('load', (e) => {
    /* ================================================== */
    /*    Scroll to top
    /* ================================================== */

    // The scroll to top button will be shown once the page has already
    // been scrolled (either on load, or on scroll).
    const minScroll = 1000;
    const scrollBtn = document.getElementById('scroll-to-top');
    function toggleScrollToTop() {
        if (document.documentElement.scrollTop > minScroll
            || window.pageYOffset > minScroll
            || document.body.scrollTop > minScroll) {
            scrollBtn.style.display = "block";
        } else {
            scrollBtn.style.display = "none";
        }
    }
    window.onscroll = toggleScrollToTop;
    toggleScrollToTop();

    /* ================================================== */
    /*    Lazy Loading
    /* ================================================== */

    const observer = lozad();
    observer.observe();

    /* ================================================== */
    /*    Magnific popup
    /* ================================================== */

    console.log("INIT");
    function onOpenPopUp() {
        this.close();
        console.log("OPENED");
    }
    function onClosePopUp() {
        console.log("CLOSED");
    }
    // HTML pop-ups
    $('.open-popup-inline').magnificPopup({
        type: 'inline',
        midClick: true,
        fixedContentPos: false,
        fixedBgPos: true,
        callbacks: {
            open: onOpenPopUp,
            close: onClosePopUp,
        }
    });
    // Simple pop-ups
    $('.open-popup-standalone').magnificPopup({
        type: 'image',
        midClick: true,
        closeOnContentClick: true,
        fixedContentPos: false,
        fixedBgPos: true,
        callbacks: {
            open: onOpenPopUp,
            close: onClosePopUp,
        }
    });

    /* ================================================== */
    /*    Menu Filtering Hook
    /* ================================================== */

    const containerEl = document.querySelector('.shuffle-wrapper');

    // Initializing Shuffle
    var myShuffle = new window.Shuffle(containerEl, {
        itemSelector: '.shuffle-item',
        buffer: 1,
        useTransforms: false  // better performance
    });

    // Lazy loading also works with Shuffle js to refresh the layout when
    // the images are loaded to avoid them overlapping.
    Array.from(document.getElementsByClassName('lozad')).forEach(img =>
            img.addEventListener('load', () => myShuffle.layout()));

    // Maximum of three nested filters for the gallery.
    if (containerEl) {
        // Frequently used items.
        const allInputs = document.querySelectorAll('input[name="shuffle-filter"]');
        const toggableFilters = document.querySelectorAll('.menu-filter:not([filter-level="1"])');
        const noItemsMsg = document.getElementById('no-items-msg');
        const loadMoreBtn = document.getElementById('load-more-btn');

        // The initial number of items for a filter result.
        const INITIAL_NUM_ITEMS = parseInt(loadMoreBtn.getAttribute('load-max'));
        // The increment over the current number of items.
        const INCREMENT_LOAD = parseInt(loadMoreBtn.getAttribute('load-increment'));
        // The current number of items, after possibly loading more.
        let numItems = INITIAL_NUM_ITEMS;

        // The previously selected filter.
        let prevFilter = 'all';

        // Returns the bar inside a filter
        function getBar(filter) {
            return filter.children[1];
        }

        // Checks if a bar contains a child with the provided filter value.
        function barContains(bar, value) {
            return Array.from(bar.children).some(i =>
                i.children[0].getAttribute('filter-value') === value);
        }

        // Resets the status of the filter.
        function resetFilter(filter) {
            function deactivate(el) {
                el.classList.remove('active');
                el.classList.checked = false;
            }
            function activate(el) {
                el.classList.add('active');
                el.classList.checked = true;
            }

            let bar = getBar(filter);
            // Remove all active buttons. There should only be one of them
            // checked beforehand.
            deactivate(Array.from(bar.children).find(i => i.classList.contains('active')));
            // Default back to the first option (it's always going to be
            // the first child).
            activate(bar.children[0]);
        }

        function hideFilter(filter) {
            const filterJQ = $(filter);
            if (filterJQ.is(':hidden')) {
                return
            }

            resetFilter(filter);

            // Fade out with an animation
            filterJQ.css('opacity', 1);
            filterJQ.addClass('d-none');
            filterJQ.animate({opacity: 0}, 400);
        }

        function showFilter(filter) {
            const filterJQ = $(filter);
            if (!filterJQ.is(':hidden')) {
                return
            }

            // Fade in with an animation
            filterJQ.css('opacity', 0);
            filterJQ.removeClass('d-none');
            filterJQ.animate({opacity: 1}, 400);
        }

        function filterItems(filter) {
            // A new filter will reset the number of items to the initial
            // value.
            if (prevFilter !== filter) {
                numItems = INITIAL_NUM_ITEMS;
                prevFilter = filter;
            }

            // Filtering the items with the new selected button.
            let numMatches = 0;
            myShuffle.filter(item => {
                // If it matches any of the data groups, it's accepted.
                // But it will only be shown if the limit hasn't been reached.
                const dataGroups = JSON.parse(item.getAttribute('data-groups'));
                if (filter === 'all' || dataGroups.some(field => field === filter)) {
                    numMatches++;
                    if (numMatches <= numItems) {
                        // Some images start hidden for efficiency.
                        item.classList.remove('d-none');
                        return true;
                    }
                }

                return false;
            });

            // If the limit was reached, a button will let the user load more
            // items. If no items matched, a custom message is shown.
            if (numMatches === 0) {
                noItemsMsg.style.display = 'flex';
                loadMoreBtn.style.display = 'none';
            } else if (numMatches <= numItems) {
                noItemsMsg.style.display = 'none';
                loadMoreBtn.style.display = 'none';
            } else {
                noItemsMsg.style.display = 'none';
                loadMoreBtn.style.display = 'block';
            }
        }

        // The hidden levels will appear and disappear depending on its
        // parents.
        Array.from(allInputs).forEach(item =>
                item.addEventListener('click', e => {
            // The pressed button, and the bar it's in.
            const curInput = e.currentTarget;
            const curFilter = curInput.getAttribute('filter-value');
            const curBar = curInput.parentNode.parentNode;
            const curParent = curBar.parentNode.getAttribute('filter-parent');

            // Updating all the displayed rows.
            toggableFilters.forEach(filter => {
                const filterParent = filter.getAttribute('filter-parent');
                let bar = getBar(filter);

                // Every bar will be hidden except for itself, its first
                // child bar and its parents, respectively
                if (bar === curBar
                    || barContains(bar, curParent)
                    || filterParent === curFilter)
                {
                    showFilter(filter);

                    // The child will be resetted (this is important for
                    // whenever the same parent item is pressed).
                    if (filterParent === curFilter) {
                        resetFilter(filter);
                    }
                } else {
                    // The bar will fade out if it isn't already hidden.
                    hideFilter(filter);
                }
            });

            filterItems(curFilter);
        }));

        loadMoreBtn.addEventListener('click', e => {
            numItems += INCREMENT_LOAD;
            filterItems(prevFilter);
        });
    }

    /* ================================================== */
    /*    Animation scroll js
    /* ================================================== */

    let htmlAndBody = $('html, body');
    $('nav a, .page-scroll').on('click', function () {
        // Making sure the clicked hyperlink is inside this website
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            let target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                htmlAndBody.animate({
                    scrollTop: target.offset().top - 50
                }, 750);
                return false;
            }
        }
    });

    /* ================================================== */
    /*   Contact Form Validating
    /* ================================================== */

    document.getElementById('contact-submit').addEventListener('click', e => {
        // Stop the form from being submitted
        e.preventDefault();

        // Making sure the fields are somewhat correct.
        const errColor = "#b10b1f";
        const okColor = "rgba(236,239,241,.07)";
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        const helpMsg = document.getElementById('contact-help');

        if (subject.value.length == 0) {
            subject.style.borderColor = errColor;
            return;
        }
        subject.style.borderColor = okColor;

        if (message.value.length == 0) {
            message.style.borderColor = errColor;
            return;
        }
        message.style.borderColor = okColor;

        // Now opening their mail client with the provided data.
        let uri = 'mailto:maremotocafe@hotmail.com?subject='
            + encodeURIComponent(subject.value) + '&body='
            + encodeURIComponent(message.value);
        window.open(uri, '_blank');

        // Show a message with help in case it didn't work.
        helpMsg.style.display = 'block'
    });
});
