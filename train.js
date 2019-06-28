const server = 'http://localhost:5000/';

let h1s = document.getElementsByTagName("h1");
let newButton = document.createElement("button");

newButton.setAttribute('id','buttonid');
newButton.innerHTML = 'Train';
h1s[0].insertAdjacentHTML('afterend', newButton.outerHTML);

let btn = document.getElementById('buttonid');
btn.addEventListener("click", train);

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