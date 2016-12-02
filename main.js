
var STATE = {};
var HOST = 'https://clearmyrecord.codeforamerica.org/';
var PARAM_PREFIX = "?source=";
var escaper = document.createElement('textarea');

var BORDER_COLORS = {
	'#FEE228': '#d8bc01',
	'#004A6C': '#003153',
	'#069ED6': '#006BA3',
};

function getButtonState(){
	// get text
	STATE.text = $('input[name=button_text').val();
	// get source param
	STATE.useSourceParam = $('input[name=add_source_param]').is(':checked');
	STATE.sourceParam = $('input[name=source_param]').val();
	// get colors
	STATE.backgroundColor = $('input[name=background-color]:checked').val();
	STATE.color = $('input[name=text-color]:checked').val();
	STATE.borderColor = BORDER_COLORS[STATE.backgroundColor];
	var url = HOST;
	if (STATE.useSourceParam) {
		url = HOST + PARAM_PREFIX + STATE.sourceParam;
	}
	STATE.fullLinkUrl = url;
}

function setContentFromState(){
	// replace the text in all the buttons
	// set source param
	if (STATE.useSourceParam) {
		$('.source_param.prefix').html(PARAM_PREFIX);
		$('.source_param.output').html(STATE.sourceParam);
	} else {
		$('.source_param').html('');
	}
	var linkButtons = $('.cmr-button a')
	linkButtons.attr('href', STATE.fullLinkUrl);
	linkButtons.css({
		"color": STATE.color,
		"background-color": STATE.backgroundColor,
		"border-color": STATE.borderColor,
	});
	linkButtons.html(STATE.text);

}

function updateCodeSnippets(){
	var buttonContainers = $('.button-container');
	buttonContainers.each(function(i, container){
		var container = $(container);
		var outputFigure = container.next('.html_output');
		escaper.textContent = container.html();
		var preTag = outputFigure.find('pre.html_code');
		preTag.html(escaper.innerHTML);
	});
}

function updateCycle(){
	getButtonState();
	setContentFromState();
	updateCodeSnippets();
}

function addEventListeners(){
	$('input[name=source_param]').keyup(function(){
		if (this.value.match(/[^a-zA-Z1-9_\-]/)) {
	    this.value = this.value.replace(/[^a-zA-Z1-9_\-]/g, '');
		}
	});

	$('aside :input').change(function(){
		updateCycle();
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


function buildColorRadioOptions(){
	var labels = $("aside fieldset label");
	labels.each(function(i, elem){
		var colorCode = elem.children[0].value;
		elem.style.backgroundColor = colorCode;
	});
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
	buildColorRadioOptions();
	addEventListeners();
	updateCycle();
}

document.addEventListener("DOMContentLoaded", main);