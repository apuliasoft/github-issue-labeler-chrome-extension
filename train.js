const server = 'http://134.209.248.162:5000/';

function train(){

	let pathname = window.location.pathname;
	let lenPathname = pathname.length;
	pathname = pathname.slice(1,lenPathname);

	let url = server+'train?repo='+pathname
	console.log(url);

	chrome.runtime.sendMessage({
    method: 'GET',
    action: 'xhttp',
    url: url,
    data:''
	}, function({ status, responseText }) {
		let res = JSON.parse(responseText);
	    alert(res.message);
	   	console.log(status);
	   	console.log(JSON.parse(responseText));

	    if(status===401)
	     	window.open(res.next);

	});
}

let h1 = document.getElementsByTagName("h1")[0];

if(h1.className.trim()!="public")
	console.log("Is not possibile to train a private reposiory!");
else
	(function (){
		let newButton = document.createElement("button");

		newButton.setAttribute('id','buttonid');
		newButton.setAttribute('class','btn');
		newButton.setAttribute('style','margin-left:10px;');
		newButton.innerHTML = 'Train this repository';
		h1.insertAdjacentHTML('afterend', newButton.outerHTML);

		let btn = document.getElementById('buttonid');
		btn.addEventListener("click", train);
	})();



