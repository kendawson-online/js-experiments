// ------------------------------------------------------
// experiment1.js - specific funtions for Experiment 1
// ------------------------------------------------------

// load the default templates and data:
document.getElementById('boxa').innerHTML = loadTemplate('default_boxa');
document.getElementById('boxb').innerHTML = loadTemplate('default_boxb');
document.getElementById('boxc').innerHTML = loadTemplate('default_boxc');
document.getElementById('right').innerHTML = loadTemplate('default_content');

function showJsonData() {
	document.getElementById('txtdisplay').value = JSON.stringify(getRouteMap(), null, 2);
}

// close the experiment 
function loadBlankPage() {
	// first check to make sure we're in the iframe
	if (window.self !== window.top) {
		// if so, load the blank page
		window.parent.frames['sourceviewer'].location.href = '../blank.html';
	} else {
		// otherwise, if we're in a new tab or window, close it
		self.close();
	}
}

// open the page in a new tab or window
function newWindow() {
	// first check to make sure we're in the iframe
	if (window.self !== window.top) {
		// if so, pop open a new tab 
		window.open(window.location.href, '_blank');
		// and replace the iframe with the blank page
		window.parent.frames['sourceviewer'].location.href = '../blank.html';
	} else {
		// otherwise, do nothing
		return false;
	}
}

// start the router
startRouter();

// show the JSON data
showJsonData();