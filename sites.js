
function Sites(config) {
  this._config = config;
  if (!localStorage.sites) {
    localStorage.sites = JSON.stringify({}); // if there are no sites in local storage
  }
  this._currentSite = null; 
  this._siteRegexp = /^(\w+:\/\/[^\/]+).*$/; // gets rid of extra stuff on url
  this._startTime = null;
}

// returns a dictionary of sites -> time spent 
Object.defineProperty(Sites.prototype, "sites", {
  get: function() {
    var s = JSON.parse(localStorage.sites);
    var sites = {}
    for (var site in s) {
      if (s.hasOwnProperty(site)) { 
        sites[site] = s[site]; 
      }
    }
    return sites;
  }
});

/**
 * Returns just the site/domain from the url. Includes the protocol.
 Excludes the paths
 */
Sites.prototype.getSiteFromUrl = function(url) {
  var match = url.match(this._siteRegexp);
  if (match) {
    return match[1];
  }
  return null;
};

// function updates the time 
Sites.prototype._updateTime = function() {
  if (!this._currentSite || !this._startTime) {
    return;
  }
  var delta = new Date() - this._startTime; //changed times
  console.log("Site: " + this._currentSite + " Delta = " + delta/1000); // site and amount of time changed.
  if (delta/1000/60 > 2*this._config.updateTimePeriodMinutes) { // changes to minutes if necessary
    console.log("Delta of " + delta/1000 + " seconds too long; ignored.");
    return;
  }
  var sites = this.sites;
  if (!sites[this._currentSite]) {
    sites[this._currentSite] = 0; // if there is no current site set it to zero 
  }
  sites[this._currentSite] += delta/1000; // adds the time elapsed
  localStorage.sites = JSON.stringify(sites);
};

// called when there is a potential focus change 
Sites.prototype.setCurrentFocus = function(url) {
  console.log("setCurrentFocus: " + url); // sets the current focus to this 
  this._updateTime(); // update all times
  if (url == null) { 
    this._currentSite = null;
    this._startTime = null;
  } else {
    this._currentSite = this.getSiteFromUrl(url);
    this._startTime = new Date();
  }
};