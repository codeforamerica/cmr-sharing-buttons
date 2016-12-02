
var STATE = {};
var escaper = document.createElement('textarea');

function getButtonState(){
	// get text
	STATE.text = $('input[name=button_text').val();
	// get source param
	STATE.useSourceParam = $('input[name=add_source_param]').is(':checked');
	STATE.sourceParam = $('input[name=source_param]').val();
	// get colors
	STATE.backgroundColor = $('input[name=background-color]').val();
	STATE.color = $('input[name=text-color]').val();
}

function setContentFromState(){
	// replace the text in all the buttons
	// set the source param in all the links
	// set the colors on all the buttons
}

function addEventListeners(){
	$('input[name=source_param]').keyup(function(){
		/*
		lettters/numbers: 48-90
		dash: 189
		shift: 16
		caps lock: 20
		*/
		if (this.value.match(/[^a-zA-Z1-9_\-]/)) {
	    this.value = this.value.replace(/[^a-zA-Z1-9_\-]/g, '');
		}
	});
}

function getNextSiblingByClass(start, className){
	var node = start.nextSibling;
	var found = false;
	while (node && !found) {
		var sibling = node.nextSibling;
		if (sibling.className == className) {
			found = true;
		}
		node = sibling;
	}
	return node;
}

function selectKeyElements(){
	var buttonContainer = document.getElementById("basic-link");
	var preContainer = getNextSiblingByClass(buttonContainer, "html_output");
	var preTag;
	console.log([preContainer]);
	for (var i = 0; i < preContainer.children.length; i++) {
		var node = preContainer.children[i];
		if( 
			node.tagName.toLowerCase() == "pre") {
			preTag = node;
		}
	}
	return {
		btn: buttonContainer,
		pre: preTag,
	};
}

function buildColorRadioOptions(){
	var labels = $("aside fieldset label");
	labels.each(function(i, elem){
		var colorCode = elem.children[0].value;
		elem.style.backgroundColor = colorCode;
	});
}
function createUpdater(){

}

function updateHtmlOutput(from, to){
	escaper.textContent = from.innerHTML;
	to.innerHTML = escaper.innerHTML;
}

function hexToRGB(hexString){
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString);
	return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
  } : null;
}

function isDark(colorCode){
	var threshold = 200;
	var color = hexToRGB(colorCode);
	var highestValue = Math.max(color.r, color.g, color.b);
	if ( highestValue > threshold) {
		return false;
	}
	return true;
}

function main(e){
	console.log(e);
	addEventListeners();
	var elems = selectKeyElements();
	updateHtmlOutput(elems.btn, elems.pre)
	buildColorRadioOptions();
	getButtonState();
	console.log(STATE);
}

document.addEventListener("DOMContentLoaded", main);