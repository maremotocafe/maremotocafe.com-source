'use strict';


// Things that have to be loaded at the end
window.onload = (e) => {
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

    $('.image-popup').magnificPopup({
        fixedContentPos: false,
        fixedBgPos: true
    });

    /* ================================================== */
    /*    Portfolio Filtering Hook
    /* ================================================== */

    // Maximum of three nested filters for the gallery.
    const containerEl = document.querySelector('.shuffle-wrapper');
    if (containerEl) {
        function barContains(bar, value) {
            for (let i = 0; i < bar.children.length; i++) {
                const input = bar.children[i].children[0];
                if (input.getAttribute('filter-value') === value) {
                    return true;
                }
            }

            return false;
        }

        function resetBar(bar) {
            // Remove all active buttons. There should only be one of them
            // checked beforehand.
            for (let i = 0; i < bar.children.length; i++) {
                const btn = bar.children[i];
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    btn.classList.checked = false;
                    break;
                }
            }

            // Default back to the first option (it's always going to be
            // the first child).
            bar.children[0].classList.add('active');
            bar.children[0].classList.checked = true;
        }

        function hideBar(bar) {
            const barJQ = $(bar);
            if (barJQ.is(':hidden')) {
                return
            }

            resetBar(bar);

            // Fade out with an animation
            barJQ.css('opacity', 1);
            barJQ.removeClass('d-flex');
            barJQ.addClass('d-none');
            barJQ.animate({opacity: 0}, 400);
        }

        function showBar(bar) {
            const barJQ = $(bar);
            if (!barJQ.is(':hidden')) {
                return
            }

            // Fade in with an animation
            barJQ.css('opacity', 0);
            barJQ.removeClass('d-none');
            barJQ.addClass('d-flex');
            barJQ.animate({opacity: 1}, 400);
        }

        // Initializing Shuffle
        var Shuffle = window.Shuffle;
        let myShuffle = new Shuffle(containerEl, {
            itemSelector: '.shuffle-item',
            buffer: 1,
            useTransforms: false  // better performance
        });

        // The hidden levels will appear and disappear depending on its
        // parents.
        const toggable = document.querySelectorAll(
            '.portfolio-filter:not([filter-level="1"])');
        $('input[name="shuffle-filter"]').on('click', evt => {
            // The pressed button, and the bar it's in.
            const curInput = evt.currentTarget;
            const curValue = curInput.getAttribute('filter-value');
            const curBar = curInput.parentNode.parentNode;

            // Updating all the displayed rows.
            toggable.forEach(iter => {
                const iterParent = iter.getAttribute('filter-parent');

                // Every bar will be hidden except for itself, its first
                // child bar and its parents, respectively
                console.log(iter, curBar.getAttribute('filter-parent'));
                if (iter === curBar
                        || barContains(iter, curBar.getAttribute('filter-parent'))
                        || iterParent === curValue) {
                    // The bar will fade in if isn't already visible.
                    showBar(iter);

                    // The child will be resetted (this is important for
                    // whenever the same parent item is pressed).
                    if (iterParent === curValue) {
                        resetBar(iter);
                    }
                } else {
                    // The bar will fade out if it isn't already hidden.
                    hideBar(iter);
                }
            });

            // Filtering the items with the new selected button.
            myShuffle.filter(curValue);
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

    $('#contact-submit').click(function (e) {
        // Stop the form from being submitted
        e.preventDefault();

        // Making sure the fields are somewhat correct.
        var subject = $('#subject').val();
        var message = $('#message').val();
        if (subject.length == 0) {
            $('#subject').css("border-color", "#b10b1f");
            return;
        } else {
            $('#subject').css("border-color", "rgba(236,239,241,.07)");
        }
        if (message.length == 0) {
            $('#message').css("border-color", "#b10b1f");
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
