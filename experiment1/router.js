// ---------------------------------------------------
// router.js - functions to handle template loading
// ---------------------------------------------------

const routekey = 'Routemap';

// route: load correct templates to predefined elements
// accepts 1 argument: request (string or object)
function route(req) {
	// if no request is passed, show an error
	if (!req) { 
		console.error(`Empty Route Request!`); 
		return false; 
	}
	// try to grab element ID from 'this' (used on links and buttons)
	var id = req.id;
	// if no element ID... 
	if (!id) { 
		// is it an object? try to route it...
		if (isObject(req)) { loadRouteObj(req); }
		// otherwise, check routemap for string
		else { routeMapLookup(req); }
	}
	// if we have an element id from 'this' value,
	// look up template target in routemap
	else { routeMapLookup(id); }
}

// routemap lookup
// looks up the mapping in JSON file and loads templates
function routeMapLookup(req) {
	// DEV USE:
	console.log(`Request is: ${req}`);
	// try to get the routemap from localStorage
	let rm = getRouteMap();
	// if there is no routemap,
	if (!rm) { 
		// show an error
		console.log(`There is no routemap in localStorage`);
		// try to load routemap again
		loadRouteMap();
	}
	// create arrays for routemap keys and values
	const keysArr = Object.keys(rm);
	const valsArr = Object.values(rm);	
	// index id - index from keysArr (using id value)
	let ii = keysArr.indexOf(req);
	// if index id doesn't exist (e.g. misspelled id name)
	if (ii < 0) { 
		// show an error and return false
		console.log(`Element id ("${req}") has no matching template`);
		console.log(`Check your routemap.json file (or HTML code) for errors`);
		return false;
	}
	// get template id from valsArr (using index id)
	let tpl = valsArr[ii];
	// if the returned value is an object, 
	// we're loading multiple templates:
	if (isObject(tpl)) {		
		// create new arrays for the object keys and values
		const karr = Object.keys(tpl);
		const varr = Object.values(tpl);
		// cycle through the object keys 
		for (var i = 0; i < karr.length; i++) {
			// set page element to be updated
			let pe = document.getElementById(karr[i]);
			// update element with matching template
			pe.innerHTML = loadTemplate(varr[i]);
		}
	}	
	// if the returned value is a string, we're loading a single template
	// Singles are displayed in default link target ('linktarg') element defined in the routemap
    else { 
		// use default target ('linktarg') value from routemap
		if (rm.linktarg) { 
			let target = document.getElementById(rm.linktarg);
			target.innerHTML = loadTemplate(tpl); 		
		}	
		// if there is no 'linktarg' in routemap
		else { 	
			console.error(`there is no 'linktarg' in routemap`);
		}
	}	
}

// get routemap file from localStorage
// returns routemap object, or false
function getRouteMap() {
	// try to retrieve routemap from localStorage
	// TODO: move this to a function in storage.js
	let rmap = localStorage.getItem(routekey);
	// if there is no routemap, return false
	if (!rmap) { return false; }
	// otherwise, parse and return the object
	if (rmap) { return JSON.parse(rmap); }
}

// template loader
// accepts 1 argument: template id
function loadTemplate(tid) {
	// if there is no template id, show an error
	if (!tid) { console.log('You have to provide a template id to load'); return false; }
	// try getting internal template id
	let itpl = document.getElementById(tid);
	// success! we have a matching template id
	if (itpl) { 	
		// extract HTML from template tags
		let tdata = itpl.innerHTML;
		// return HTML
		return tdata;
	}
}

// remove routemap data from localstorage
function removeRouteMap() {
	let rm = localStorage.getItem(routekey);
	if (!rm) { return false; } 
	else { localStorage.removeItem(routekey); return true; }
}

// JSON file fetcher - loads routemap.json file 
// accepts 1 argument: file name
async function loadRouteMap(fname) {	
  // if no file name is given, use this default
  if (!fname) { fname = 'routemap.json'; }
  console.log(`loading new routemap data`);
  // wait for it...
  let data = await getJSONPromise(fname);
  // if we have no data, give an error
  if (!data) { console.log(`JSON file ${fname} returned no data`); return false; }
  // save routemap to localStorage
  localStorage.setItem(routekey, JSON.stringify(data));
  // log status
  console.log(`routemap data loaded successfully`);
}

// start the router
// accepts 1 argument: path to routemap.json file
function startRouter(fname=null) {
	// check to see if we have one in localstorage
	let rm = getRouteMap();
	// Routemap exists --> return true
	if (rm) { return true; }
	// No routemap --> load from JSON (async function)
	else { loadRouteMap(fname); }
}

// load route object: loads templates directly from a route object
// accepts 1 argument: route object (a mini routemap)
function loadRouteObj(obj) {
	// if we don't have a route object, show an error
	if (!obj) { console.error(`There was no route object passed`); return false; }
	// otherwise, the user passed something...
	else {
		// check to make sure it's an object, or show an error
		if (!isObject(obj)) { console.log(`You have to pass an object to this function`); return false; }
		// we have an object!
		else {
			// cycle through the object,
			for (var key in obj) 
			{
				// make sure it's an actual property (not from prototype)
				if (obj.hasOwnProperty(key)) 
				{
					// skip any 'default target' keys
					if (key === 'linktarget') { continue; }
					// try to get the page element 
					let ele = document.getElementById(key);
					// if it doesn't exist, show an error
					if (!ele) { console.log(`The element ${key} does not exist`); return false; }
					// otherwise, load the templates
					else { ele.innerHTML = loadTemplate(obj[key]); }
					// DEV USE:
					console.log(key + " -> ", obj[key]);
				}
			}
		}	
	}
}

// JSON file loader
function getJSONPromise(fname){
	return new Promise(function(resolve,reject){
		fetch(fname)
		.then(function(response) {
		  if (!response.ok) {
			throw new Error("HTTP Error! Status Code: " + response.status);
		  }
		  return response.json();
		})
		.then(function(json) {
			resolve(json);	
		})
		.catch(function(error) {	
			console.error(`Problem fetching file: "${fname}"`);
		});
	});
}

// check for objectivity: 
// returns true if 'obj' is an object
function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}