
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

            $('#finderInput').on('input', function () {
                finder.findTerm($(this).val());
            });

            // 🔧 Start scroll-based "fixed" behavior
            finder.trackPosition();
        }, 50);
    },


    closeFinder: () => {
        $('#finderInput').attr("aria-hidden", "true");
        $('#finderInput').attr("tabindex", "-1");
        $('#finderPrev').attr("aria-hidden", "true");
        $('#finderPrev').attr("tabindex", "-1");
        $('#finderNext').attr("aria-hidden", "true");
        $('#finderNext').attr("tabindex", "-1");
        $('#finderClose').attr("aria-hidden", "true");
        $('#finderClose').attr("tabindex", "-1");

        $('#finder').removeClass('findon');
        $(finder.content).unhighlight();
        $('#finderInput').val('').removeClass('not-found');
        $('.searchResult.visuallyhidden').remove();
        $('#finderCount').remove();

        finder.resultsCount = 0;
        finder.currentResult = 0;
        $(finder.wrapper).scrollTop(0);

        // 🔧 Remove scroll behavior
        finder.untrackPosition();
    },


    resultsCount: 0,

    currentResult: 0,

    findTerm: (term) => {
        // highlight results
        $(finder.content).unhighlight();
        // Highlight only visible elements containing the term
        $(finder.content).find(':visible').highlight(term);

        // Count only visible results
        finder.resultsCount = $('.findhighlight:visible').length;

        if (finder.resultsCount) {
            // there are results, scroll to first one
            finder.currentResult = 1;
            finder.scrollToCurrent();
        } else {
            // no results
            finder.currentResult = 0;
        }

        // term not found
        if (!finder.resultsCount && term) {
            $('#finderInput').addClass('not-found');
        } else {
            $('#finderInput').removeClass('not-found');
        }

        finder.updateCurrent();
    },

    scrollToCurrent: () => {
        let scrollingElement;

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
            if (finder.currentResult > 1) {
                finder.currentResult--;
            } else {
                finder.currentResult = finder.resultsCount;
            }
            finder.scrollToCurrent();
        }
        finder.updateCurrent();
    },

    nextResult: () => {
        if (finder.resultsCount) {
            if (finder.currentResult < finder.resultsCount) {
                finder.currentResult++;
            } else {
                finder.currentResult = 1;
            }
            finder.scrollToCurrent();
        }
        finder.updateCurrent();
    },

    updateCurrent: () => {
        if ($('#finderInput').val()) {
            if (!$('#finderCount').length) {
                const countElem = $('<span />')
                    .attr({
                        'id': 'finderCount',
                        'class': 'finder-count',
                    })
                    .insertAfter('#finderInput');
                // create element with that will read search result
                $('#finderCount').after("<span class='searchResult visuallyhidden' aria-live='polite'></span>");

            }
            setTimeout(function () {
                $('#finderCount').text(finder.currentResult + ' / ' + finder.resultsCount);
                // new for A11Y
                $('.searchResult').text("Search Result " + finder.currentResult + ' of ' + finder.resultsCount); // say the result term
                $('.findhighlight.findon').attr({ 'aria-live': 'polite' }); // say the paragraph that contain the search term
            }, 500);
        } else {
            $('.searchResult.visuallyhidden').remove();
            $('#finderCount').remove();
        }
    },
    updatePosition: null,
    trackPosition: () => {
        const el = document.getElementById('finder');
        const input = document.getElementById('finderInput');
        if (!el || !input) return;

        el.style.position = 'absolute';

        finder.updatePosition = () => {
            // Don't reposition while typing
            if (document.activeElement === input) return;
            el.style.top = window.scrollY + 'px';
        };

        finder.updatePosition(); // initial
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


}

