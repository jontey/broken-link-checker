var blc = require('broken-link-checker');
var fs = require('fs');
var options = {};
options.excludeExternalLinks = false;
options.excludeLinksToSamePage = true;
options.filterLevel = 3;
var siteUrl = "<YOUR URL HERE>";
var customData = {};
var parsedUrls = {};
var brokenUrls = [];

function uniq(a) {
   return Array.from(new Set(a));
}

var htmlUrlChecker = new blc.HtmlUrlChecker(options, {
    html: function(tree, robots, response, pageUrl, customData){},
    junk: function(result, customData){},
    link: function(result, customData){
		if (result.broken) {
			brokenUrls.push(result.url.resolved);
			console.log("Broken ", blc[result.brokenReason], result.url.resolved);
		} else if (result.excluded) {
			brokenUrls.push(result.url.resolved);
			console.log("Excluded", blc[result.excludedReason], result.url.resolved);
		} else {
			if(!parsedUrls[result.url.resolved]){
				console.log(result.http.response.statusCode, result.url.resolved);
				parsedUrls[result.url.resolved] = true;
				htmlUrlChecker.enqueue(result.url.resolved, customData);
			}
		}
	},
    page: function(error, pageUrl, customData){},
    end: function(){
		console.log("Finished scanning");
		brokenUrls = uniq(brokenUrls); // Remove duplicates from array
		console.log("Broken URLs ", brokenUrls);
		console.log(brokenUrls.join(' \n'));
		fs.writeFileSync("broken.txt", brokenUrls.join(' \n'));
		process.exit();
	}
});

htmlUrlChecker.enqueue(siteUrl, customData);

setInterval(function(){
		console.log("Runtime", process.uptime(), htmlUrlChecker.numPages());
	}, 5000);
