
  var outputElement = document.getElementById('output');
  var Module = {
    preRun: [],
    postRun: [],
    print: (function() {
      if (outputElement) outputElement.value = ''; // clear browser cache
      return function(text) {
        if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
        console.log(text);
        if (outputElement) {
          outputElement.value += text + "\n";
          outputElement.scrollTop = outputElement.scrollHeight; // focus on bottom
        }
      };
    })(),
    setStatus: function(text) {
      if (!text) return;
      if (text === 'Running...') text += '\n==========';

      if (outputElement) {
        outputElement.value += text + "\n";
        outputElement.scrollTop = outputElement.scrollHeight; // focus on bottom
      }
    },
    totalDependencies: 0,
    monitorRunDependencies: function(left) {
      this.totalDependencies = Math.max(this.totalDependencies, left);
      Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
    }
  };
  Module.setStatus('Downloading...');
  window.onerror = function() {
    Module.setStatus('Exception thrown, see JavaScript console');
    Module.setStatus = function(text) {
      if (text) Module.printErr('[post-exception status] ' + text);
    };
  };
  lat = 0;
  lon = 0;
  tx = "";
  function updateLocation(location) {
    lat = Math.round(location.coords.latitude * 100);
    lon = Math.round(location.coords.longitude * 100);
  }
  function sendText() {
    var inputElement = document.getElementById('input');
    tx = inputElement.value + "\n";
    inputElement.value = "";
  }
  function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        alert("Permission denied");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location unavailable");
        break;
      case error.TIMEOUT:
        alert("Request timed out");
        break;
      case error.UNKNOWN_ERROR:
        alert("Unknown error");
        break;
    }
  }
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(updateLocation, showError);
    }
  }