const server = 'http://134.209.248.162:5000/';

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
   	console.log(res);

    if(status===200 && res.result)
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
		let res = JSON.parse(responseText);
	   
	   	console.log(status);
	   	console.log(res);

	    if(status===200)
	    	if(res.result)
	     		getMyModels();
	     	else
	     		showInstallButton();
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
	if(models.length<=0){
		console.log("You don't have any model to classify your repo!")
		return 0;
	}

	let h1 = document.getElementsByTagName("h1")[0];

	let newSpan = document.createElement("h1");
	newSpan.innerHTML = "Models: ";

	let newSelect = document.createElement("select");
	let styleSelect = "padding-right:40px;margin-right:10px;margin-left:5px;background-image: linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%), linear-gradient(to right, #ccc, #ccc); background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px), calc(100% - 2.5em) 0.5em; background-size: 5px 5px, 5px 5px, 1px 1.5em; background-repeat: no-repeat;";

    newSelect.setAttribute('id','myModels');
    newSelect.setAttribute('class','btn');
    newSelect.setAttribute('style',styleSelect);
    
    models.forEach(function(element) {
		  let option = document.createElement("option");
		  option.text = element.name;
		  option.value = element.name;
		  if(element.ready == false){
		  	option.text = option.text + " (in training)";
		  	option.setAttribute("disabled",true);
		  }
		  	
		  newSelect.add(option);
	});
    	
    let newButton = document.createElement("button");
	newButton.setAttribute('id','classify_btn');
	newButton.setAttribute('class','btn');
	newButton.innerHTML = 'Classify';

	h1.insertAdjacentHTML('afterend', newButton.outerHTML);
	h1.insertAdjacentHTML('afterend', newSelect.outerHTML);
	h1.insertAdjacentHTML('afterend', newSpan.outerHTML);

	let btn = document.getElementById('classify_btn');
	btn.addEventListener("click", classify);
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

function showInstallButton()
{
	let h1 = document.getElementsByTagName("h1")[0];

	let newButton = document.createElement("button");
	newButton.setAttribute('id','install_btn');
	newButton.setAttribute('class','btn');
	newButton.innerHTML = 'Install';

	let btn = document.getElementById('install_btn');
	btn.addEventListener("click", install);
}