"using strict";

window.TestEditor = 
{

  loadEditor : function(options)
  {
    this.options = options;
    let el = document.querySelector(this.options.sel);
    el.innerHTML = 'iframe starts here: <iframe width="300" height="200" src="https://cesarpachon.github.io/unitusti/test_editor.html"></iframe>';
  },

  unloadEditor : function(cb)
  {
    let el = document.querySelector(this.options.sel);
    el.innerHTML = "";
  },

  addTarget : function(ev)
  {
    console.log("addTarget");
    let name = "name"+Date.now();
    let description = "description for " + name;
    let metadata = {
      timestamp: Date.now()
    };
    this.options.oncreate(name, description, metadata);
  }
}
