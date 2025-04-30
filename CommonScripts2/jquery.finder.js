
/* jQuery Finder Plugin * @author Danny McGee * @version 1.0
* github.com/dannymcgee * Copyright 2018 Danny McGee * Released under the MIT License
* https://opensource.org/licenses/MIT */

$(document).ready(function () {

    $(finder.activator).click(function () {
        $('.accord').addClass('open');
        $('.accord-panel').slideDown();
        $('#ExpandAllAccrds').addClass('hidden');
        $('#CollapseAllAccrds').removeClass('hidden');
        $('#CollapseAllAccrds').addClass('shown');
        $('.accord').attr("aria-selected", "true");

        $('#finderInput').removeAttr("aria-hidden");
        $('#finderInput').attr("tabindex", "0");
        $('#finderPrev').removeAttr("aria-hidden");
        $('#finderPrev').attr("tabindex", "0");
        $('#finderNext').removeAttr("aria-hidden");
        $('#finderNext').attr("tabindex", "0");
        $('#finderClose').removeAttr("aria-hidden");
        $('#finderClose').attr("tabindex", "0");
        finder.activate();
    });


    // $(document).mousedown(function (event) {  // old code
    $(document).on("mousedown, mouseup, click", function (event) { //added click for a11y
        if (event.which === 1) {
            switch ($(event.target).attr('id') || $(event.target).parents().attr('id')) {
                case 'finderClose':
                    finder.closeFinder();
                    // focus goes back to search button for a11y
                    $('#OpenFinderSearcher').focus();
                    break;
                case 'finderPrev':
                    finder.prevResult();
                    break;
                case 'finderNext':
                    finder.nextResult();
                    break;

                default:
                    return true;
            }
        }
    });

});

const finder = {
    activator: '[data-finder-activator]',
    content: '[data-finder-content]',
    wrapper: '[data-finder-wrapper]',
    scrollOffset: () => $(finder.wrapper).data('finderScrollOffset'),

    updatePosition: null,
    isTyping: false,

    trackPosition: () => {
        const el = document.getElementById('finder');
        if (!el) return;

        el.style.position = 'absolute';

        finder.updatePosition = () => {
            // Only skip repositioning during typing to prevent blinking
            if (finder.isTyping) return;
            el.style.top = window.scrollY + 'px';
        };

        finder.updatePosition(); // initial position
        window.addEventListener('scroll', finder.updatePosition);
        window.addEventListener('resize', finder.updatePosition);
    },

    untrackPosition: () => {
        if (finder.updatePosition) {
            window.removeEventListener('scroll', finder.updatePosition);
            window.removeEventListener('resize', finder.updatePosition);
            finder.updatePosition = null;
        }
    },

    activate: () => {
        if (!$('#finder').length) {
            finder.createFinder();
        }

        setTimeout(function () {
            $('#finder').addClass('findon');
            $('#finderInput').focus();

            if ($('#finderInput').val()) {
                finder.findTerm($('#finderInput').val());
            }

            let typingTimer;
            $('#finderInput').on('input', function () {
                finder.isTyping = true;
                clearTimeout(typingTimer);
                typingTimer = setTimeout(() => {
                    finder.isTyping = false;
                }, 250);
                finder.findTerm($(this).val());
            });

            finder.trackPosition(); // 👈 start fixed-position simulation
        }, 50);
    },

    closeFinder: () => {
        $('#finderInput').attr("aria-hidden", "true").attr("tabindex", "-1");
        $('#finderPrev').attr("aria-hidden", "true").attr("tabindex", "-1");
        $('#finderNext').attr("aria-hidden", "true").attr("tabindex", "-1");
        $('#finderClose').attr("aria-hidden", "true").attr("tabindex", "-1");

        $('#finder').removeClass('findon');
        $(finder.content).unhighlight();
        $('#finderInput').val('').removeClass('not-found');
        $('.searchResult.visuallyhidden').remove();
        $('#finderCount').remove();

        finder.resultsCount = 0;
        finder.currentResult = 0;
        $(finder.wrapper).scrollTop(0);

        finder.untrackPosition(); // 👈 clean up scroll tracking
    },

    resultsCount: 0,
    currentResult: 0,

    findTerm: (term) => {
        $(finder.content).unhighlight();
        $(finder.content).find(':visible').highlight(term);

        finder.resultsCount = $('.findhighlight:visible').length;

        if (finder.resultsCount) {
            finder.currentResult = 1;
            finder.scrollToCurrent();
        } else {
            finder.currentResult = 0;
        }

        if (!finder.resultsCount && term) {
            $('#finderInput').addClass('not-found');
        } else {
            $('#finderInput').removeClass('not-found');
        }

        finder.updateCurrent();
    },

    scrollToCurrent: () => {
        let i = finder.currentResult - 1;
        $('.findhighlight').removeClass('findon');
        const currentElement = $(`.findhighlight:eq(${i})`);
        currentElement.addClass('findon');

        let offsetTop = -100;
        if (finder.scrollOffset() !== null) {
            offsetTop = finder.scrollOffset() * -1;
        }

        $(finder.wrapper).scrollTo('.findhighlight.findon', {
            offset: {
                left: 0,
                top: offsetTop,
            },
        });
    },

    prevResult: () => {
        if (finder.resultsCount) {
            finder.currentResult = finder.currentResult > 1 ? finder.currentResult - 1 : finder.resultsCount;
            finder.scrollToCurrent();
        }
        finder.updateCurrent();
    },

    nextResult: () => {
        if (finder.resultsCount) {
            finder.currentResult = finder.currentResult < finder.resultsCount ? finder.currentResult + 1 : 1;
            finder.scrollToCurrent();
        }
        finder.updateCurrent();
    },

    updateCurrent: () => {
        if ($('#finderInput').val()) {
            if (!$('#finderCount').length) {
                $('<span />', { id: 'finderCount', class: 'finder-count' }).insertAfter('#finderInput');
                $('#finderCount').after("<span class='searchResult visuallyhidden' aria-live='polite'></span>");
            }

            setTimeout(() => {
                $('#finderCount').text(finder.currentResult + ' / ' + finder.resultsCount);
                $('.searchResult').text("Search Result " + finder.currentResult + ' of ' + finder.resultsCount);
                $('.findhighlight.findon').attr({ 'aria-live': 'polite' });
            }, 500);
        } else {
            $('.searchResult.visuallyhidden').remove();
            $('#finderCount').remove();
        }
    },
};

