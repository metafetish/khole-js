var devices = [];

var init = function() {
  var connectBtn = document.getElementById('connect');
  connectBtn.addEventListener('click', function(event) {
    findDevice().then(d => {
      dev = new KHoleWebBluetooth(d);
      dev.open();
      devices.push(dev);
    });
  });
};
