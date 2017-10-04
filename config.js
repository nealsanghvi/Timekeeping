function Config() {}

Object.defineProperty(Config.prototype, "updateTimePeriodMinutes", { //updates seconds to mins
  get: function() {
    return 1;
  }
});

Object.defineProperty(Config.prototype, "idle", { // returns whether the user is idle or not
  get: function() {
    return localStorage.idle == "true";
  },
  set: function(i) {
    if (i) {
      localStorage.idle = "true"; 
    } else {
      localStorage.idle = "false";
    }
  }
});
