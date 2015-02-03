$(document).bind("mobileinit", function(ev) {
  console.log("mobile init!");
  //here.. general configuration for jquery mobile, like apply themes
  //$.mobile.defaultPageTransition= "slide";
  //$.mobile.toolbar.prototype.options.addBackBtn = true;
  //$.mobile.toolbar.prototype.options.backBtnText = "Back";


  $("#goto_page_books").on("click", function(ev){
    app.page_books.enter();

  });

  $( "#page_books" ).pagecontainer({
    load: function( event, ui ) {
      console.log(" books loaded!" );
    }
  });


});


