var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-45267314-2']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var config = new Config();
var gsites = new Sites(config);

function secondsToString(seconds) { //standard unit converter into a string

  var years = Math.floor(seconds / 31536000);
  var days = Math.floor((seconds % 31536000) / 86400);
  var hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  var mins = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  var secs = (((seconds % 31536000) % 86400) % 3600) % 60;
  var s = "";
  if (years) {
    s = s + " " + years + "y";
  }
  if (days) {
    s = s + " " + days + "d";
  }
  if (hours) {
    s = s + " " + hours + "h";
  }
  if (mins) {
    s = s + " " + mins + "m";
  }
  if (secs) {
    s = s + " " + secs.toFixed(0) + "s";
  }
  return s;
}

function addLocalDisplay() {
  /* Fetch the old table, create the new table
  and replace the old table */
  var old_tbody = document.getElementById("stats_tbody");
  var tbody = document.createElement("tbody");
  tbody.setAttribute("id", "stats_tbody");
  old_tbody.parentNode.replaceChild(tbody, old_tbody);

  /* Sort sites by time spent */
  var sites = gsites.sites; // get the sites 
  var sortedSites = new Array();
  var totalTime = 0;
  for (site in sites) {
   sortedSites.push([site, sites[site]]); // push an array [site, timespent]
   totalTime += sites[site]; // add up total time
  }

  /* Add the row stating the total. And a row for every site. */
  var row = document.createElement("tr");
  var cell = document.createElement("td");
  cell.innerHTML = "<b>Total</b>";
  row.appendChild(cell);
  cell = document.createElement("td");
  cell.appendChild(document.createTextNode(secondsToString(totalTime)));
  row.appendChild(cell);
  tbody.appendChild(row);

  for (var index = 0; ((index < sortedSites.length));
      index++ ){
   var site = sortedSites[index][0]; //site name
   row = document.createElement("tr");
   cell = document.createElement("td");
   var a = document.createElement('a');
   var linkText = document.createTextNode(site);
   a.appendChild(linkText); // make the site name a link
   cell.appendChild(a);
   row.appendChild(cell);
   cell = document.createElement("td");
   cell.appendChild(document.createTextNode(secondsToString(sites[site])));
   row.appendChild(cell);
   tbody.appendChild(row);
  }
}

function initialize() {
  addLocalDisplay();
}

document.addEventListener("DOMContentLoaded", function() {
  initialize();
});