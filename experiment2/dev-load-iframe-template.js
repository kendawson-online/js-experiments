// ----------------------------------------------------------
// dev-load-iframe-template.js - Dev Use
//
// LOADING HTML TEMPLATE DATA FROM EXTERNAL IFRAME SRC
//
// -----------------------------------------------------------

// get HTML template data from iframe src
function getTemplateData(myiframe) {
        // grab everything between the body tags
        let page = myiframe.contentDocument.body.innerHTML;
        // parse it
        let parsed = new DOMParser().parseFromString(page, 'text/html');
        // select all the template tags
        let tpl = parsed.head.getElementsByTagName('template');
        // create an empty array
        const myarr = [];
        // cycle through the tags
        for (let i=0; i < tpl.length; i++) {
            // and add them to the array (in JSON format)
            myarr.push(`{"id":"${tpl[i].id}","tpl":"${ encodeURIComponent(tpl[i].innerHTML.trim()) }"}`);
        }
        // save array to localstorage
        localStorage.setItem('templates', JSON.stringify(myarr));
        // check to see if it exists
        if (localStorage.getItem('templates')) {
            // if so, inform the user
            console.log('template data saved to localstorage');
        }
        // and load the first template
        document.getElementById('main').innerHTML = tpl[0].innerHTML;
}

// switch the template source
function switchTemplateSource() {

    let myiframe = document.getElementById('testframe');

    let prot = window.location.protocol;
    let host = window.location.hostname;
    let path = window.location.pathname;
    let url = prot + '//' + host + path;

    // if the iframe source is the default,
    if (myiframe.src === url + "iframe-template-content.html") {
            // switch to the alternate
            myiframe.src = url + "iframe-template-alt-content.html";
            console.log('Switched to Alternate Template Source');
    } 
    else {
        // otherwise,
        if (myiframe.src === url + "iframe-template-alt-content.html") {
            myiframe.src = url + "iframe-template-content.html";
            console.log('Switched to Default Template Source');
        }
    }
}

// load template (passing name)
function loadTemplate(name) {
    if (!name) { console.error('There is no template name'); return false; }
    else {
        console.log('Template requested is: ' + name);
        // get template data from localstorage
        let tdata = localStorage.getItem('templates');
        if (tdata) {
            // if we have data, parse it
            let pdata = JSON.parse(tdata);
            // convert object to an array
            let tplArr = Array.from(pdata);
            // each item in the array is still stringified and URI-encoded
            // cycle through each item in the array...
            tplArr.forEach(
                // and run this function:
                function (element) { 
                    // parse the item,
                    let nval = JSON.parse(element);
                    // check for a match with 'name'
                    if (nval.id === name) {
                        // if we have a match,
                        // URI-decode the template
                        let dctpl = decodeURIComponent(nval.tpl);
                        // select the main target
                        let main = document.getElementById('main');
                        // if we have a div
                        if (main){
                            // set the innerHTML to the template data
                            main.innerHTML = dctpl;
                        }
                    }
                }
            );
        }
    }
}