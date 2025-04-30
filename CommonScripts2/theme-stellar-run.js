$(document).ready(function() {

  $( "html" ).addClass( "stellar-run" );

  if ($("body").hasClass("body-login")) {
    $( "div.page-middle" ).addClass( "sprite-pic" );
  }

  var SetNavUiType = function() {
    //compare nav are available space with size of links list
    var navboxwidth = $("#MainNav").width();
    var navlistwidth = $("#NavMenu").width();

    if (navboxwidth <= navlistwidth) {
      //Show Burger nav if all links can't show in viewport
      $('#NavMenu').addClass("nav-hide");
      $('#NavBurger').addClass("nav-burger-show");
      //$('#NavBurger').focus;
    }

    else if (navboxwidth > navlistwidth) {
      //Remove Burger nav - show normal big screen menu
      $('#NavMenu').removeClass("nav-hide");
      $('#NavBurger').removeClass("nav-burger-show");
      //$('#NavBurger').focus;
    }
  };

  $(window).resize(function(){
    $('#NavBurger').removeClass("nav-burger-show");
    $('#NavMenu').removeClass("nav-hide");
    SetNavUiType();
  });

  //Fire it when the page first loads:
  SetNavUiType();

    $("#NavBurger").off("click").click(function(){
      //$("#NavMenu").toggle();
  });

});