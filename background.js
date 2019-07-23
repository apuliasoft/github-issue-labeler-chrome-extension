chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == "xhttp") {
        var xhttp = new XMLHttpRequest();
        var method = request.method ? request.method.toUpperCase() : 'GET';

        xhttp.onload = function() {
            callback({ status: xhttp.status, responseText: xhttp.responseText });
        };
        xhttp.onerror = function() {
            // Do whatever you want on error. Don't forget to invoke the
            // callback to clean up the communication port.
            callback();
        };
        xhttp.open(method, request.url, true);
        if (method == 'POST') {
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhttp.send(request.data);
        return true; // prevents the callback from being called too early on return
    }
});


chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
        console.log('Page uses History API and we heard a pushSate/replaceState.');
        console.log(details);      
        // chrome.tabs.executeScript(null,{file:"classify.js"});
        chrome.tabs.sendMessage(details.tabId, {text:'Ricarica pulsanti'});
});

