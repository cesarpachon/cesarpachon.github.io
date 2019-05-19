"using strict";

window.TestEditor = 
{

  loadEditor : function(options)
  {
    this.options = options;
    let el = document.querySelector(this.options.sel);
    el.innerHTML = 'iframe starts here: <iframe width="300" height="200" src="https://cesarpachon.github.io/unitusti/test_editor.html"></iframe>';
    window.addEventListener("message", ev => this.onMessage(ev));
  },

  unloadEditor : function(cb)
  {
    let el = document.querySelector(this.options.sel);
    el.innerHTML = "";
  },

  onMessage : function(ev)
  {
    console.log("onMessage");
    let target = ev.data;
    console.log(ev);
    this.options.oncreate(target.name, target.description, target.metadata);
    return false;
  }

}
