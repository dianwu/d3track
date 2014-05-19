var http = require("http");
var https = require('https');

var d3 = require("./heroes.js");
var async = require('./async.js');
http.createServer(function(request, response) {


	response.writeHead(200, {
		"Content-Type": "text/plain"
	});

}).listen(8888);


function reloadMyD3Data() {
	var batTag='扛到腰閃到-3249';
	var options = {
		host: 'tw.battle.net',
		path: '/api/d3/profile/'+batTag+'/'
	};
	// https: //tw.battle.net/api/d3/profile/DianTW-3588/
	https.get(options, function(res) {
		console.log("Got response: " + res.statusCode);
		var fs = require('fs');
		var stream = fs.createWriteStream("tmp/Career.tmp");
		var careerStr='';
		res.on('data', function(d) {
			// response.write(d);
			// stream.write(d);
			careerStr+=d;
		});
		res.on('end', function() {
			// response.end();
			// stream.end();
			var data = JSON.parse(careerStr);
			d3.initHeros(batTag,data);
			// var fs = require('fs');
			// fs.readFile('tmp/Career.tmp', 'utf8', function(err, data) {
			// 	if (err) {
			// 		console.log('Error: ' + err);
			// 		return;
			// 	}
				
			// });
		});
		setTimeout(reloadMyD3Data, 1000 * 60 * 30);
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
		setTimeout(reloadMyD3Data, 1000 * 60 * 30);
	});
}
reloadMyD3Data();