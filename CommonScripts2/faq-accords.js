// Expand All Accordions
$("#ExpandAllAccrds").click(function () {
  console.log("Expand All Accordions clicked");
  $(this).removeClass('shown').addClass('hidden');
  $('#CollapseAllAccrds').removeClass('hidden').addClass('shown');

  // Add the class to indicate all are expanded
  $('.accordians').addClass('all-expanded');

  // Add the 'open' class to all accordions and expand all panels
  $('.accord').addClass('open').attr("aria-selected", "true");
  $('.accord-panel').slideDown();
  $('#CollapseAllAccrds').focus();
});

// Collapse All Accordions
$("#CollapseAllAccrds").click(function () {
  $(this).removeClass('shown').addClass('hidden');
  $('#ExpandAllAccrds').removeClass('hidden').addClass('shown');

  // Remove the class indicating all are expanded
  $('.accordians').removeClass('all-expanded');

  // Remove the 'open' class from all accordions and collapse all panels
  $('.accord').removeClass('open').attr("aria-selected", "false");
  $('.accord-panel').slideUp();
  $('#ExpandAllAccrds').focus();

  // expand all accordions for finder to search
  $('#finder').removeClass('active');
  $(finder.content).unhighlight();
});

// Individual Accordion Click
$(".accord").on('click', function () {
  // if accordion was open by #ExpandAllAccrds
  if ($(".accordians").hasClass('all-expanded')) {
    if ($(this).hasClass('open')) {
      $(this).removeClass('open').attr("aria-selected", "false");
      $(this).next('.accord-panel').slideUp();
    } else {
      $(this).addClass('open').attr("aria-selected", "true");
      $(this).next('.accord-panel').slideDown();
    }
  } else {
    // normal behavior. only one accordion can be open at a time
    if ($(this).hasClass('open')) {
      $(this).removeClass('open').attr("aria-selected", "false");
      $(this).next('.accord-panel').slideUp();
    } else {
      $('.accord').removeClass('open').attr("aria-selected", "false");
      $('.accord-panel').slideUp();

      $(this).addClass('open').attr("aria-selected", "true");
      $(this).next('.accord-panel').slideDown();
    }
  }

  // Check if all accordions are closed after this action
  if ($('.accord.open').length === 0) {
    $('#CollapseAllAccrds').removeClass('shown').addClass('hidden');
    $('#ExpandAllAccrds').removeClass('hidden').addClass('shown');
    $('.accordians').removeClass('all-expanded');
  } else {
    $('#ExpandAllAccrds').removeClass('shown').addClass('hidden');
    $('#CollapseAllAccrds').removeClass('hidden').addClass('shown');
    $('.accordians').removeClass('all-expanded');
  }


});

// Handle keyboard interactions
$(".accord").on('keydown', function (e) {
  if ((e.key === "Enter" || e.key === " ") && $(this).is(":focus")) {
    e.preventDefault(); // Prevent default spacebar scrolling
    $(this).trigger('click');
  }
});
