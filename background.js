// var bkg = chrome.extension.getBackgroundPage();
// bkg.console.log('inizio');

// function reqListener () {
// 	  console.log(this.responseText);
// 	  switch(this.status){
// 			case 200: alert('Success! You can now find this repository in your models!');break;
// 			case 201: alert('Training already started');break;
// 			case 403: alert("Repository not in the format ‘owner/name’ or ‘organization/name’");break;
// 			case 404: alert('Repository not exists');break;
// 			case 401: console.log(this);
// 			//case 401: window.open(response.body.next, '_blank');chrome.tabs.create({"url": "http://google.com"});
// 		}
// 	}

	
// let url = 'http://localhost:5000/train?repo=nunziogianfelice/telescope';
// console.log("Chiamata Get su " + url);
// var oReq = new XMLHttpRequest();
// oReq.onload = reqListener;
// oReq.open("GET", url);
// oReq.send();

chrome.webNavigation.onCompleted.addListener(function() {
      //alert("This is my favorite website!");
     chrome.tabs.executeScript({
     code: 'document;'
        //If you had something somewhat more complex you can use an IIFE:
        //code: '(function (){return document.body.innerText;})();'
        //If your code was complex, you should store it in a
        // separate .js file, which you inject with the file: property.
    },receiveText);
  }, {url: [{urlMatches : 'https://www.google.com*'}]});

function receiveText(resultsArray){
    console.log(resultsArray[0]);
}