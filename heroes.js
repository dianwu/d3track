var fs = require('fs');

exports.initHeros = function(battleTag, career) {
	console.log('initHeros...start.');
	console.log('heroes count=', career.heroes.length);
	//var battleTag = career.battleTag;
	for (var i = 0, l = career.heroes.length; i < l; i++) {
		var hero = career.heroes[i];
		var heroFilePath = './output/hero-' + hero.name;
		var lastUpdateTime = hero['last-updated'];
		if (!fs.existsSync(heroFilePath)) {
			console.log('create new file.', heroFilePath);
			var stream = fs.createWriteStream(heroFilePath);
			stream.end();
		}

		exports.updateHeor(battleTag, hero.id, hero.name);
	}
	console.log('initHeros...End.');
	// exports.updateHeors(battleTag, career.heroes);
};
exports.updateHeors = function(battletag, heroes) {
	var async = require('./async.js');
	var datas = [];
	for (var i = 0, l = heroes.length; i < l; i++) {
		datas.push([battletag, heroes[i].id]);
		// updates.push(function (){
		// 	exports.updateHeor(battletag,heroes[i].id);
		// })
	}
	async.each(datas, exports.updateHeor, function(err, results) {
		console.log('updateHeors....end ?');
	});
	//async.series(updates); 
	// if (heroes.length>0){
	// 	exports.updateHeor(battleTag, heroes, );
	// }
}

exports.updateHeor = function(battletag, heroId, heroName) {
	var https = require('https');
	var options = {
		host: 'tw.battle.net',
		path: '/api/d3/profile/' + battletag + '/hero/' + heroId
	};
	console.log('updateHeor\t:', battletag, heroId, heroName);
	https.get(options, function(res) {
		var tmpFilePath = "tmp/hero-" + heroId + ".tmp";
		console.log('updateHeor start\t:', tmpFilePath);
		var tmpStr = '';
		// var stream = fs.createWriteStream(tmpFilePath);
		res.on('data', function(d) {
			// stream.write(d);
			tmpStr += d;
		}).on('end', function(d) {
			// stream.end();
			console.log('updateHeor end\t:', tmpFilePath);
			console.log('end:', tmpStr.length);
			var jsonData = JSON.parse(tmpStr);
			var stats = jsonData.stats;
			var filePath = "output/hero-" + jsonData.name;



			var rs = fs.createReadStream(filePath);
			var last = "";
			rs.on('data', function(chunk) {
				var lines, i, tmpLast;
				lines = (last + chunk).split("\n");

				for (i = 0; i < lines.length - 1; i++) {
					//console.log('line:',i,lines[i]);
				}
				last = lines[i - 1];
				// if (last.length>0) {
				// 	console.log('update last line:',last);
				// 	//last=tmpLast;	
				// }else{
				// 	console.log('update  lines:',lines.length);
				// }

			}).on('end', function() {
				var lastUpdated = last.split(',')[0];
				if (lastUpdated != jsonData['last-updated']) {
					console.log(jsonData.name + " update data. ");
					var heroData = [
						jsonData['last-updated'],
						jsonData['level'],
						stats['life'],
						stats['damage'],
						stats['attackSpeed'],
						stats['armor'],
						stats['strength'],
						stats['dexterity'],
						stats['vitality'],
						stats['intelligence'],
						stats['physicalResist'],
						stats['fireResist'],
						stats['coldResist'],
						stats['lightningResist'],
						stats['poisonResist'],
						stats['arcaneResist'],
						stats['critDamage'],
						stats['blockChance'],
						stats['blockAmountMin'],
						stats['blockAmountMax'],
						stats['damageIncrease'],
						stats['critChance'],
						stats['damageReduction'],
						stats['thorns'],
						stats['lifeSteal'],
						stats['lifePerKill'], stats['goldFind'],
						stats['magicFind'],
						stats['lifeOnHit'],
						stats['primaryResource'],
						stats['secondaryResource'],
						jsonData['kills']['elites']
					];
					fs.appendFile(filePath, heroData.join(', ') + '\r\n');
				}
				
			});
			//fs.appendFile(filename, data, [options], callback)
			//
		}).on('error', function() {
			console.log('error!!!');
		});
	})
}