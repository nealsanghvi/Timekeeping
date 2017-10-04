// tracks focus change between windows and tabs testing
function Tracker(config, sites) {
  this._sites = sites;
  var self = this; // renamed this to self
  chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
      self._updateTimeWithCurrentTab(); // when a tab is updated, update the time
    }
  );
  chrome.tabs.onActivated.addListener(
    function(activeInfo) {
      chrome.tabs.get(activeInfo.tabId, function(tab) {
        self._sites.setCurrentFocus(tab.url); // set the current focus to a tab when it is activated
      });
    }
  );
  chrome.windows.onFocusChanged.addListener(
    function(windowId) {
      if (windowId == chrome.windows.WINDOW_ID_NONE) {
        self._sites.setCurrentFocus(null);
        return;
      }
      self._updateTimeWithCurrentTab(); // when the window focused is changed, update the time
    }
  );
  chrome.idle.onStateChanged.addListener(function(idleState) {
    if (idleState == "active") {
      config.idle = false;
      self._updateTimeWithCurrentTab(); // if active, update time
    } else {
      config.idle = true;
      self._sites.setCurrentFocus(null); // if idle, the current focus becomes null
    }
  });
}

Tracker.prototype._updateTimeWithCurrentTab = function() {
  var self = this;
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) { // get all tabs that are active
    if (tabs.length == 1) { // finds the tab in the currently focused window
      var url = tabs[0].url; // gets the url of the lastfocused window
      chrome.windows.get(tabs[0].windowId, function(windows) { //gets the windowID
        if (!windows.focused) { //checks whether it is focused
          url = null;
        }
        self._sites.setCurrentFocus(url);
      });
    }
  });
};