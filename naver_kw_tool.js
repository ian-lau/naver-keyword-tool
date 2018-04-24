var request = require('sync-request');
var fs = require('fs');
var CryptoJS = require("crypto-js");

var relKeywords = [];

fs.readFile('input.json', 'utf8', function (err,data) {
	if (err) {return console.log(err);}
	keywords = JSON.parse(data);
	for (i=0;i<keywords.length;i++) {

		if (err) {
			var relKeywordsStringify = JSON.stringify(relKeywords);
			fs.writeFile('output.json', relKeywordsStringify, (err) => {
				if (err) throw err;
				console.log(i+'/'+keywords.length+' '+keywords[i]+' '+relKeywords.length+' Error! The file has been saved!');
			});
		}

		if (keywords[i] != null) {
			var timestamp = new Date().getTime()
			var hash = CryptoJS.HmacSHA256(timestamp+".GET./keywordstool", ""); // API Secret goes here
			var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
			var header = {
				'X-Timestamp': timestamp,
				'X-API-KEY': '', // API Key goes here
				'X-Customer': '', // Customer ID goes here
				'X-Signature': hashInBase64};
			var requestUrl = 'https://api.naver.com/keywordstool?showDetail=1&hintKeywords=';
			console.log(keywords[i]);
			var response = request('GET', requestUrl+encodeURIComponent(keywords[i]), {'headers': header});
			var parseResponse = JSON.parse(response.body);
			for (x=0;x<parseResponse.keywordList.length;x++) {
				if (err) {
					var relKeywordsStringify = JSON.stringify(relKeywords);
					fs.writeFile('output.json', relKeywordsStringify, (err) => {
						if (err) throw err;
						console.log(x+'/'+keywords.length+' '+keywords[x]+' '+relKeywords.length+' Error! The file has been saved!');
					});
				}
				relKeywords.push([
				    parseResponse.keywordList[x].relKeyword,
				    parseResponse.keywordList[x].monthlyPcQcCnt,
				    parseResponse.keywordList[x].monthlyMobileQcCnt,
				    parseResponse.keywordList[x].monthlyAvePcClkCnt,
				    parseResponse.keywordList[x].monthlyAveMobileClkCnt,
				    parseResponse.keywordList[x].monthlyAvePcCtr,
				    parseResponse.keywordList[x].monthlyAveMobileCtr,
				    parseResponse.keywordList[x].plAvgDepth,
				    parseResponse.keywordList[x].compIdx,
				])
			}
		}
		console.log(i+'/'+keywords.length+' '+keywords[i]+' '+response.statusCode+' '+relKeywords.length);
	}

	console.log('finished w/ '+relKeywords.length);

	var relKeywordsStringify = JSON.stringify(relKeywords);
	fs.writeFile('output.json', relKeywordsStringify, (err) => {
		if (err) throw err;
		console.log('The file has been saved!');
	});
})
