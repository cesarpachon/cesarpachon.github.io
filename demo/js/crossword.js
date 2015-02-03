var Crossword = (function($){
  "use strict";
  var crossword = {};

  var _rows = 0;
  var _columns = 0;

  var _container = null;

  var _$currcell = null;

  var _vertical_words = [];
  var _horizontal_words = [];

  crossword.init = function(rows, columns){

    _container = $('#crossword_container');

    for(var i=0; i<rows; ++i){
      for(var j=0; j<columns; ++j){
        var _cell = $("<div class='cell' id='"+i+"-"+ j+"'></div>");
        _container.append(_cell);


      }
      _container.append("<div class='row_end'><div>");
    }

    _container.on("click", ".cell_focusable", function(ev){
      crossword.on_clicked_cell(ev.currentTarget);
    });


    $(document).keypress(function(ev){crossword.keypress(ev.which);});

    $('button.falsetrue_validate').on('click', function(){ crossword.validate();});
    $('button.falsetrue_reset').on('click', function(){ crossword.reset();});

  };


  crossword.keypress = function(keycode){
    var _character = String.fromCharCode(keycode);
    _character = _character.toUpperCase();
    if(_$currcell){
      _$currcell.data("typed_character", _character);
      _$currcell.html(_character);
    }
  };


  /**
  *
  */
  crossword.on_clicked_cell = function(cell){

    if(_$currcell){
      _$currcell.removeClass("cell_focused");
    }

    _$currcell = $(cell);
    _$currcell.addClass("cell_focused");

  };


  /**
  * add a word to the crossword. take care,
  * no validation of overriden characters implemented.
  */
  crossword.add_word = function(word, mode, row, col, label){
    var cell;
    var row1 = (mode === "horizontal")?row:row+word.length-1;
    var col1 = (mode === "vertical")?col:col+word.length-1;
    var i = 0;
    console.log(word, mode, row, col, row1, col1);
    for(var r = row; r <= row1; ++r){
      for(var c = col; c <= col1; ++c){
        cell = _container.find("#"+r+"-"+c);
        cell.data("character", word[i]);
        cell.addClass("cell_focusable");
        i++;
      }
    }

    //numbering the word
    if(mode === "horizontal"){
        cell = _container.find("#"+row+"-"+(col-1));
        _horizontal_words.push(word);

        cell.html(/*_horizontal_words.length*/label);

    }else if(mode === "vertical"){
        cell = _container.find("#"+(row-1)+"-"+col);
        _vertical_words.push(word);

      cell.html(/*_vertical_words.length*/label);

    }
    cell.addClass("cell_label");
  };



  crossword.validate = function(){

    var valid = 0;
    var invalid = 0;
    _container.find(".cell_focusable").each(function(index){
      //this is each cell
      var data = $(this).data();
      console.log(data);
      if(data.character === data.typed_character){
        valid++;
      }else{
        invalid++;
      }

    });


    if(valid > 0 && invalid === 0){
      $('.feedback_bad').hide(100);
      $('.feedback_ok').show(200);
    }else{
      $('.feedback_ok').hide(100);
      $('.feedback_bad').show(200);
    }

  };

  crossword.reset = function(){
    $('.feedback_ok').hide(100);
    $('.feedback_bad').hide(100);
  };

  return crossword;

})($);
