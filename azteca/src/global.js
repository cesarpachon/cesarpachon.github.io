"use strict";  
//create a global namespace for this game
 window.Aztec = {};

/*
 * getData
 * just a wrapper to retrieve stuff via AJAX
 * @path: {string} path to the resource
 * @cb: {function} err, data
 */
Aztec.getData = function(path, cb){
  var http = new XMLHttpRequest();
  http.onreadystatechange = function() {
      if(http.readyState == 4){
        if(http.status == 200) {
          cb(null, http.responseText); 
        }
        else{
          //by now just send the error code to signal error
          cb(http.status, null);
        }
      }
  }
  http.open("GET", path);
  http.setRequestHeader("Content-type", "text/json");
  http.send();
};


