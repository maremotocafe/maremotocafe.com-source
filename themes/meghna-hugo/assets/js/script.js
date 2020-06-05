'use strict';

function barContains(bar, value) {
    for (let i = 0; i < bar.children.length; i++) {
        if (bar.children[i].children[0].value === value) {
            return true;
        }
    }

    return false;
}

function resetBar(bar) {
    // Remove all active buttons
    for (let i = 0; i < bar.children.length; i++) {
        if (bar.children[i].classList.contains('active')) {
            bar.children[i].classList.remove('active');
            bar.children[i].classList.checked = false;
            break;
        }
    }

    // Default back to the first option
    bar.children[0].classList.add('active');
    bar.children[0].classList.checked = true;
}

function hideBar(bar) {
    const bar_jq = $(bar);
    if (bar_jq.is(':hidden')) {
        return
    }

    resetBar(bar);

    // Fade out with an animation
    bar_jq.css('opacity', 1);
    bar_jq.removeClass('d-flex');
    bar_jq.addClass('d-none');
    bar_jq.animate({opacity: 0}, 400);
}

function showBar(bar) {
    const bar_jq = $(bar);
    if (!bar_jq.is(':hidden')) {
        return
    }

    // Fade in with an animation
    bar_jq.css('opacity', 0);
    bar_jq.removeClass('d-none');
    bar_jq.addClass('d-flex');
    bar_jq.animate({opacity: 1}, 400);
}


// Things that have to be loaded at the end
window.onload = (event) => {
    /* ================================================== */
    /*    Lazy Loading
    /* ================================================== */

    const observer = lozad();
    observer.observe();

    /* ================================================== */
    /*    Magnific popup
    /* ================================================== */

    $('.image-popup').magnificPopup({
        fixedContentPos: false,
        fixedBgPos: true
    });

    /* ================================================== */
    /*    Portfolio Filtering Hook
    /* ================================================== */
    // TODO CONSISTENT NAMING, CAMELCASE OR SNAKE CASE

    // Maximum of three nested filters for the gallery.
    const containerEl = document.querySelector('.shuffle-wrapper');
    if (containerEl) {
        let Shuffle = window.Shuffle;
        let myShuffle = new Shuffle(containerEl, {
            itemSelector: '.shuffle-item',
            buffer: 1
        });
        myShuffle.on(Shuffle.EventType.LAYOUT, function () {
            observer.observe();
        });

        // The main bar will never be selected, since it's always visible.
        const bars = document.querySelectorAll(
            '.portfolio-filter:not(.menu-level-one)');


        // The hidden levels will appear and disappear depending on the first
        // level.
        $('input[name="shuffle-filter"]').on('change', evt => {
            // The pressed button, and the bar it's in.
            const input = evt.currentTarget;
            const input_bar = input.parentNode.parentNode;
            if (!input.checked) {
                return
            }

            // Filtering the items with the new selected button.
            myShuffle.filter(input.value);

            // Updating the displayed rows.
            // TODO RESET ACTIVE TO "Todo"
            bars.forEach((bar) => {
                const bar_parent = bar.getAttribute('parent');
                // Every bar will be hidden except for itself, its first
                // child bar and its parents, respectively
                if (bar === input_bar
                        || barContains(bar, input_bar.getAttribute('parent'))
                        || bar_parent === input.value) {
                    // The bar will fade in if isn't already visible.
                    showBar(bar);

                    // The child will be resetted (this is important for
                    // whenever the same parent item is pressed).
                    if (bar_parent === input.value) {
                        resetBar(bar);
                    }
                } else {
                    // The bar will fade out if it isn't already hidden.
                    hideBar(bar);
                }
            });

            observer.observe();
        });
    }

    /* ================================================== */
    /*    Animation scroll js
    /* ================================================== */

    let html_body = $('html, body');
    $('nav a, .page-scroll').on('click', function () {
        // Making sure the clicked hyperlink is inside this website
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            let target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                html_body.animate({
                    scrollTop: target.offset().top - 50
                }, 750);
                return false;
            }
        }
    });

    /* ================================================== */
    /*   Contact Form Validating
    /* ================================================== */

    $('#contact-submit').click(function (e) {
        // Stop the form from being submitted
        e.preventDefault();

        // Making sure the fields are somewhat correct.
        var subject = $('#subject').val();
        var message = $('#message').val();
        if (subject.length == 0) {
            $('#subject').css("border-color", "#D8000C");
            return;
        } else {
            $('#subject').css("border-color", "rgba(236,239,241,.07)");
        }
        if (message.length == 0) {
            $('#message').css("border-color", "#D8000C");
            return;
        } else {
            $('#message').css("border-color", "rgba(236,239,241,.07)");
        }

        // Now opening their mail client with the provided data.
        let uri = 'mailto:yesus19@hotmail.es?subject='
            + encodeURIComponent(subject) + '&body='
            + encodeURIComponent(message);
        window.open(uri, '_blank');

        // Show a message with help in case it didn't work.
        $('#contact-help').show();
    });
}
