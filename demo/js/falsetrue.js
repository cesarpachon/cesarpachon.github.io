var FalseTrue = (function($){
  "use strict";
  var falseTrue = {};

  //array of booleans
  var _answers = [];
  var _validanswers = [];

  falseTrue.init = function(){
    $('ol.falsetrue_questions').empty();
    $('button.falsetrue_validate').on('click', function(){ falseTrue.validate();});
    $('button.falsetrue_reset').on('click', function(){ falseTrue.reset();});
  };


  falseTrue.add_question = function(question, validanswer){
    console.log("adding question");
    var id = "question_"+_answers.length;
    var $input = $(
       "<li>"+
      '<div id="'+id+'">'
      +'<p class="question">'
      + question+'</p>'
      +'<input type="radio" id="'+id+'1" name="'+id+'"><label for="'+id+'1">True</label>'
      +'<input type="radio" id="'+id+'2" name="'+id+'" checked="checked"><label for="'+id+'2">False</label>'
      +'</div>'
      +"</li>");

    $input.buttonset();

    $input.on("click", "*[type='radio']", function(){
      var $this = $(this);
      var _q = $this.attr('name');
      var _val = $this.attr('id').substr(_q.length) === "1";
      var _index = parseInt(_q.substr("question_".length));
      _answers[_index] = _val;
    });

    $('ol.falsetrue_questions').append($input);

    _answers.push(false);
    _validanswers.push(validanswer);
  };


  falseTrue.validate = function(){

    var valid = true;
    for(var i = 0; i<_answers.length; ++i){
      valid = valid && (_answers[i] === _validanswers[i]);
    }

    if(valid){
      $('.feedback_bad').hide(100);
      $('.feedback_ok').show(200);
    }else{
      $('.feedback_ok').hide(100);
      $('.feedback_bad').show(200);
    }

  };

  falseTrue.reset = function(){
      $('.feedback_ok').hide(100);
      $('.feedback_bad').hide(100);
    console.log("reset");
    for(var i=0; i< _answers.length; ++i){
      _answers[i] = false;
    }
  };



  return falseTrue;

})($);
