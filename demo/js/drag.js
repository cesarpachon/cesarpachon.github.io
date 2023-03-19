var Drag = (function($){
  "use strict";
  var drag = {};

  var _dropped_total = 0;
  var _dropped_counter = 0;

	var _svg_container = null;


	drag.init = function(){
		$('button.falsetrue_validate').on('click', function(){ drag.validate();});
    $('button.falsetrue_reset').on('click', function(){ drag.reset();});
	};


  drag.initSVG = function(svgpath, cb){

    $.ajax({
      type:"GET",
      url: svgpath,
      dataType: "html",
      success: function( svg ) {
				_svg_container=$("#svg_container");
         _svg_container.html(svg);
				drag.init();
        cb();
      }
    });

  };


	/**
	* insert a new Dropable div trying to match the position of the given svg element
	*/
	drag.add_droppableSVG = function(svg_item_id){
		var svg_item = $("#"+svg_item_id)[0];

		//get the height of the document
		var docheight = parseInt($("svg").attr("height"));

		//get the global offset of inkscape
		var transformstr = $("#layer1").attr("transform");
		transformstr  = transformstr.replace("translate(", "");
		transformstr  = transformstr.replace(")", "");
		var tokens = transformstr.split(",");
		var offx = parseInt(tokens[0]);
		var offy = parseInt(tokens[1]);

		function getAttribPx(item, attr){
			var val = item.getAttribute(attr);
			return Math.floor(val);
		}

		var x = getAttribPx(svg_item, "x");
		var y = getAttribPx(svg_item, "y");

		var left = (x + offx) + "px";
				var top =  (y/*- docheight*/ + offy ) + "px";

		var div = "<div id='"+svg_item_id+"' class='drop_item_svg' style=' ";
		div += "left: "+ left + "; ";
		div += "top: "+ top+ "; ";
		div += "'>"+"</div>";

    var $div = $(div);
    _svg_container.append($div);

    drag.add_droppable($div);
	};


	/**
	*/
	drag.add_droppable = function($droppable){

    $droppable.droppable({
      drop: function( event, ui ) {
        if(this.id === ui.draggable.attr("id")){
          _dropped_counter++;
        }
						console.log("drop: droppable.id:",this.id, "draggable.id:",ui.draggable.attr("id"),_dropped_counter,_dropped_total);

      }
    });

    _dropped_total++;

	};




  drag.validate = function(){

    var valid = _dropped_total === _dropped_counter;

    if(valid){
      $('.feedback_bad').hide(100);
      $('.feedback_ok').show(200);
    }else{
      $('.feedback_ok').hide(100);
      $('.feedback_bad').show(200);
    }

  };

  drag.reset = function(){
    $('.feedback_ok').hide(100);
    $('.feedback_bad').hide(100);
    _dropped_counter = 0;

    //in order to reset the draggables, lets remove the left and top attributes
     $( ".drag_item" ).css("left", "");
     $( ".drag_item" ).css("top", "");

  };

	/**
	* ugly hack for some special cases (see p2)
	*/
	drag.override_dropped_total = function(val){
		_dropped_total = val;
	};

  return drag;

})($);
