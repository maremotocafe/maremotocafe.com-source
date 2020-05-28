'use strict';

jQuery(function ($) {
	/* ================================================== */
	/*	Lazy load initialize
	/* ================================================== */

    // Lazy loads elements with default selector as ".lozad"
	const observer = lozad();
	observer.observe();

	/* ================================================== */
	/*	Magnific popup
	/* ================================================== */

	$('.image-popup').magnificPopup({
		type: 'image',
		removalDelay: 160, //delay removal by X to allow out-animation
		callbacks: {
			beforeOpen: function () {
				// just a hack that adds mfp-anim class to markup
				this.st.image.markup = this.st.image.markup.replace(
                    'mfp-figure', 'mfp-figure mfp-with-anim');
				this.st.mainClass = this.st.el.attr('data-effect');
			}
		},
		closeOnContentClick: true,
		midClick: true,
		fixedContentPos: false,
		fixedBgPos: true
	});

	/* ================================================== */
	/*	Portfolio Filtering Hook
	/* ================================================== */

    const observer = lozad();
    observer.observe();
    // TODO CONSISTENT NAMING, CAMELCASE OR SNAKE CASE

    // Maximum of three nested filters for the gallery.
	const containerEl = document.querySelector('.shuffle-wrapper');
	if (containerEl) {
		let Shuffle = window.Shuffle;
		let myShuffle = new Shuffle(containerEl, {
			itemSelector: '.shuffle-item',
			buffer: 1
		});

        // The main bar will never be selected, since it's always visible.
		const bars = document.querySelectorAll(
            '.portfolio-filter:not(.menu-level-one)');

        // Checking if a single bar contains an input element with some value.
        function contains(bar, value) {
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
                        || contains(bar, input_bar.getAttribute('parent'))
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
		});
	}
    observer.observe();

	/* ================================================== */
	/*	Animation scroll js
	/* ================================================== */

	let html_body = $('html, body');
    // use page-scroll class in any HTML tag for scrolling
	$('nav a, .page-scroll').on('click', function () {
		if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
			let target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				html_body.animate({
					scrollTop: target.offset().top - 50
				}, 1500, 'easeInOutExpo');
				return false;
			}
		}
	});

	// easeInOutExpo Declaration
	jQuery.extend(jQuery.easing, {
		easeInOutExpo: function (x, t, b, c, d) {
			if (t === 0) {
				return b;
			}
			if (t === d) {
				return b + c;
			}
			if ((t /= d / 2) < 1) {
				return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			}
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		}
	});

	/* ================================================== */
	/*	Counter up
	/* ================================================== */

	function counter() {
		let oTop;
		if ($('.count').length !== 0) {
			oTop = $('.count').offset().top - window.innerHeight;
		}
		if ($(window).scrollTop() > oTop) {
			$('.count').each(function () {
				let $this = $(this),
					countTo = $this.attr('data-count');
				$({
					countNum: $this.text()
				}).animate({
					countNum: countTo
				}, {
					duration: 1000,
					easing: 'swing',
					step: function () {
						$this.text(Math.floor(this.countNum));
					},
					complete: function () {
						$this.text(this.countNum);
					}
				});
			});
		}
	}
	$(window).on('scroll', function () {
		counter();
	});
});
