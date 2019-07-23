const server = 'http://134.209.248.162:5000/';
console.log("Open Req - Issue Labeller");


let pathname = window.location.pathname;
let pathnameArray = pathname.split("/");
var repo = pathnameArray[1]+"/"+pathnameArray[2];

if(isIssuePathName()){
	createDivContainer();
	const h1 = document.getElementsByTagName("h1")[0];

	if(h1.className.trim()!="public")
		console.log("Is not possibile to work on a private reposiory!");
	else{
		createTrainButton();
		checkIsOwner();
	}
}

function createDivContainer(){
	const elem = document.getElementsByClassName('repository-content')[0]
	const divContainer = document.createElement("div");
	divContainer.setAttribute('id','container-id');
	divContainer.setAttribute('style','margin-bottom:10px;');
	elem.insertBefore(divContainer, elem.firstChild);
}

function isIssuePathName(){
	const regex = /https?:\/\/github\.com\/(.*?)\/(.*?)\/issues/;
	return regex.test(window.location.href);
}

function getCurrentUrl(){
	return window.location.href;
}

function createTrainButton(){

	const container = document.getElementById('container-id');

	const trainButton = document.createElement("button");
	trainButton.setAttribute('id','train-button-id');
	trainButton.setAttribute('class','btn');
	trainButton.innerHTML = 'Train this repository';
	trainButton.addEventListener("click", train);

	container.appendChild(trainButton);
}

function train(){

	let url = server+'train?repo='+repo+'&next='+getCurrentUrl();
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


function checkIsOwner(){
	chrome.runtime.sendMessage({
	method: 'GET',
	action: 'xhttp',
	url: server+'is-owner?repo='+repo+'&next='+getCurrentUrl(),
	data:''
	}, function({ status, responseText }) {
		let res = JSON.parse(responseText);
	   	console.log("Status " + status + " Is owner?");
	   	console.log(res);

	    if(status===200 && res.result)
	     	checkInstalled();
	});
}


function checkInstalled(){
	let urlCheckInstalled = server+'check-installed?repo='+repo+'&next='+getCurrentUrl();
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
	const checkClassifyButton = document.getElementById('classify-button-id');
	if(checkClassifyButton){
		return 0;
	}

	if(models.length<=0){
		console.log("You don't have any model to classify your repo!")
		return 0;
	}

	

	const container = document.getElementById('container-id');


	let newSpan = document.createElement("h3");
	newSpan.setAttribute('style','margin-top:10px;margin-bottom:5px');
	newSpan.innerHTML = "Models: ";

	let newSelect = document.createElement("select");
	let styleSelect = "padding-right:40px;margin-right:10px;background-image: linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%), linear-gradient(to right, #ccc, #ccc); background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px), calc(100% - 2.5em) 0.5em; background-size: 5px 5px, 5px 5px, 1px 1.5em; background-repeat: no-repeat;";

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
    	
    let newClassifyButton = document.createElement("button");
	newClassifyButton.setAttribute('id','classify-button-id');
	newClassifyButton.setAttribute('class','btn');
	newClassifyButton.innerHTML = 'Classify';
	newClassifyButton.addEventListener("click", classify);

	
	container.appendChild(newSpan);
	container.appendChild(newSelect);
	container.appendChild(newClassifyButton);
}

function classify(){
	let select = document.getElementById('myModels');
	let selectedRepo = select.options[select.selectedIndex].value;

	let classifyUrl = server + 'classify?repo=' + repo + '&model=' + selectedRepo+'&next='+getCurrentUrl();

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
	const checkClassifyButton = document.getElementById('classify-button-id');
	
	if(checkClassifyButton){
		return 0;
	}

	const container = document.getElementById('container-id');

	let newInstallButton = document.createElement("button");
	newInstallButton.setAttribute('id','classify-button-id');
	newInstallButton.setAttribute('class','btn');
	newInstallButton.setAttribute('style','margin-left:10px;');
	newInstallButton.innerHTML = 'Install';
	newInstallButton.addEventListener("click", install);

	container.appendChild(newInstallButton);
}


chrome.runtime.onMessage.addListener(function(msg){
    console.log(msg);

    if(isIssuePathName()){
 
    	let checkTrainButton = document.getElementById('train-button-id');
    	let checkClassifyButton = document.getElementById('classify-button-id');
    	let checkDivContainer = document.getElementById('container-id');

    	if(!checkDivContainer)
			createDivContainer();

		if(!checkTrainButton)
			createTrainButton();

		if(!checkClassifyButton)
			checkIsOwner();

		
    }
    
})