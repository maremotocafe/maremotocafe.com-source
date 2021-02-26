class Menu {
    constructor() {
        // Frequently used DOM items.
        this.container = document.querySelector('.shuffle-wrapper');
        this.allInputs = document.querySelectorAll(
            'input[name="shuffle-filter"]');
        this.toggableFilters = document.querySelectorAll(
            '.menu-filter:not([filter-level="1"])');
        this.noItemsMsg = document.getElementById('no-items-msg');
        this.loadMoreBtn = document.getElementById('load-more-btn');

        // The initial number of items for a filter result.
        this.initialNumItems = parseInt(
            this.loadMoreBtn.getAttribute('load-max'));
        // The increment over the current number of items.
        this.incrementLoad = parseInt(
            this.loadMoreBtn.getAttribute('load-increment'));
        // The current number of items, after possibly loading more.
        this.numItems = this.initialNumItems;

        // The previously selected filter.
        this.prevFilter = 'all';
    }

    setup(data) {
        this.setupShuffle();

        // The hidden levels will appear and disappear depending on its
        // parents.
        Array.from(this.allInputs).forEach(item =>
                item.addEventListener('click', e => {
            // The pressed button, and the bar it's in.
            const curInput = e.currentTarget;
            const curFilter = curInput.getAttribute('filter-value');
            const curBar = curInput.parentNode.parentNode;
            const curParent = curBar.parentNode.getAttribute('filter-parent');

            // Updating all the displayed rows.
            this.toggableFilters.forEach(filter => {
                const filterParent = filter.getAttribute('filter-parent');
                let bar = this.getBar(filter);

                // Every bar will be hidden except for itself, its first
                // child bar and its parents, respectively
                if (bar === curBar
                    || this.barContains(bar, curParent)
                    || filterParent === curFilter)
                {
                    this.showFilter(filter);

                    // The child will be resetted (this is important for
                    // whenever the same parent item is pressed).
                    if (filterParent === curFilter) {
                        this.resetFilter(filter);
                    }
                } else {
                    // The bar will fade out if it isn't already hidden.
                    this.hideFilter(filter);
                }
            });

            this.filterItems(curFilter);
        }));

        this.loadMoreBtn.addEventListener('click', e => {
            this.numItems += this.incrementLoad;
            this.filterItems(this.prevFilter);
        });
    }

    setupShuffle() {
        // Initializing Shuffle.js
        this.Shuffle = new window.Shuffle(this.container, {
            itemSelector: '.shuffle-item',
            buffer: 1,
            useTransforms: false  // better performance
        });

        // Lazy loading also works with Shuffle js to refresh the layout when
        // the images are loaded to avoid them overlapping.
        Array.from(document.getElementsByClassName('lozad')).forEach(img =>
                img.addEventListener('load', () => this.Shuffle.layout()));
    }

    // Returns the bar inside a filter
    getBar(filter) {
        return filter.children[1];
    }

    // Checks if a bar contains a child with the provided filter value.
    barContains(bar, value) {
        return Array.from(bar.children)
            .some(i => i.children[0].getAttribute('filter-value') === value);
    }

    // Resets the status of the filter.
    resetFilter(filter) {
        function deactivate(el) {
            el.classList.remove('active');
            el.classList.checked = false;
        }
        function activate(el) {
            el.classList.add('active');
            el.classList.checked = true;
        }

        // Remove all active buttons. There should only be one of them
        // checked beforehand.
        //
        // Also default back to the first option (it's always going to be
        // the first child).
        //
        let bar = this.getBar(filter);
        let active = Array.from(bar.children)
            .find(i => i.classList.contains('active'));
        let inactive = bar.children[0];
        deactivate(active);
        activate(inactive);
    }

    hideFilter(filter) {
        const filterJQ = $(filter);
        if (filterJQ.is(':hidden')) {
            return
        }

        this.resetFilter(filter);

        // Fade out with an animation
        filterJQ.css('opacity', 1);
        filterJQ.addClass('d-none');
        filterJQ.animate({opacity: 0}, 400);
    }

    // Requires JQuery for animations
    showFilter(filter) {
        const filterJQ = $(filter);
        if (!filterJQ.is(':hidden')) {
            return
        }

        // Fade in with an animation
        filterJQ.css('opacity', 0);
        filterJQ.removeClass('d-none');
        filterJQ.animate({opacity: 1}, 400);
    }

    filterItems(filter) {
        // A new filter will reset the number of items to the initial
        // value.
        if (this.prevFilter !== filter) {
            this.numItems = this.maxItems;
            this.prevFilter = filter;
        }

        // Filtering the items with the new selected button.
        let numMatches = 0;
        this.Shuffle.filter(item => {
            // If it matches any of the data groups, it's accepted.
            // But it will only be shown if the limit hasn't been reached.
            const dataGroups = JSON.parse(item.getAttribute('data-groups'));
            if (filter === 'all' || dataGroups.some(field => field === filter)) {
                numMatches++;
                if (numMatches <= this.numItems) {
                    item.classList.remove('d-none');
                    return true;
                }
            }

            return false;
        });

        // If no items matched, a custom message is shown.
        if (numMatches === 0) {
            this.noItemsMsg.classList.remove('d-none');
        } else {
            this.noItemsMsg.classList.add('d-none');
        }

        // If the limit was reached, a button will let the user load more items. 
        if (numMatches <= this.numItems) {
            this.loadMoreBtn.classList.add('d-none');
        } else {
            this.loadMoreBtn.classList.remove('d-none');
        }
    }
}

window.Menu = Menu;
