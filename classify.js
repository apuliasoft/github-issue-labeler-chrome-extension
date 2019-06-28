const server = 'http://localhost:5000/';

var pathname = window.location.pathname;
var pathnameArray = pathname.split("/");
var repo = pathnameArray[1]+"/"+pathnameArray[2];


chrome.runtime.sendMessage({
method: 'GET',
action: 'xhttp',
url: server+'is-owner?repo='+repo,
data:''
}, function({ status, responseText }) {
	let res = JSON.parse(responseText);
   	console.log(status);
   	console.log(responseText);

   	// uso la funzione trim perchè la risposta arriva sporco
    if(status===200 && responseText.trim()=="true")
     	checkInstalled();

});


function checkInstalled(){
	let urlCheckInstalled = server+'check-installed?repo='+repo;

	chrome.runtime.sendMessage({
	method: 'GET',
	action: 'xhttp',
	url: urlCheckInstalled,
	data:''
	}, function({ status, responseText }) {
	   	console.log(status);
	   	console.log(responseText);

	    if(status===200)
	    	if(responseText.trim()=="true")
	     		getMyModels();
	     	else
	     		install();
	});
}

function getMyModels(){
	chrome.runtime.sendMessage({
	method: 'GET',
	action: 'xhttp',
	url: server+'my-models',
	data:''
	}, function({ status, responseText }) {
		let models = JSON.parse(responseText);
	    if(status===200)
	     	showClassifyButton(models);
	});
}

function showClassifyButton(models){
	console.log(models);
	if(models.length<=0)
		return 0;
	let h1s = document.getElementsByTagName("h1");
	let newSelect = document.createElement("select");
    newSelect.setAttribute('id','myModels');
    
    
    models.forEach(function(element) {
		  let option = document.createElement("option");
		  option.text = element.name;
		  option.value = element.name;
		  if(element.ready == false){
		  	option.text = option.text+" (in training)";
		  	option.setAttribute("disabled",true);
		  }
		  	
		  newSelect.add(option);
	});
    	
    


    let newButton = document.createElement("button");
	newButton.setAttribute('id','classify_btn');
	newButton.innerHTML = 'Classify';
	h1s[0].insertAdjacentHTML('afterend', newButton.outerHTML);

	let btn = document.getElementById('classify_btn');
	btn.addEventListener("click", classify);

	h1s[0].insertAdjacentHTML('afterend', newSelect.outerHTML);
}

function classify(){
	let select = document.getElementById('myModels');
	let selectedRepo = select.options[select.selectedIndex].value;

	let classifyUrl = server + 'classify?repo=' + repo + '&model=' + selectedRepo;

	console.log(classifyUrl);
	chrome.runtime.sendMessage({
	method: 'GET',
	action: 'xhttp',
	url: classifyUrl,
	data:''
	}, function({ status, responseText }) {
		let res = JSON.parse(responseText);
	    console.log(res);
	    alert(res.message);
	});
}

function install(){
	window.open(server+'install');
}





