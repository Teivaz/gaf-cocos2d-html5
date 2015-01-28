/*
* Created by Teivaz on 29.11.2014.
* Thanks to David Caldwell <david@porkrind.org> for `renderjson`
*/

var g_hasData = false;
var g_idDropZone = null;
var g_idFade = null;

function handleDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files;

    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        var name = escape(f.name);
        var ext = name.split('.').pop();
        if (ext == 'gaf') {
            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(req) {
                    var arrayBuffer = new gaf.DataReader(req.target.result);
                    var loader = new gaf.Loader();
                    var data = loader.LoadStream(arrayBuffer);
                    g_hasData = true;
                    g_idFade.style.display = "none";
                    g_idDropZone.style.display = "none";
                    document.getElementById('output').appendChild(stringifyGaf("GAF", data, false));
                };
            })(f);
            reader.readAsArrayBuffer(f);
        }
    }
}

function initGlobals() {
    g_idDropZone = document.getElementById('drop_zone');
    g_idFade = document.getElementById('fade');
}

function bodyOnLoad(){
    initGlobals();

    g_idDropZone.addEventListener('dragover', handleDragOver, false);
    g_idDropZone.addEventListener('dragenter', handelDragEnter, false);
    g_idDropZone.addEventListener('dragleave', handelDragLeave, false);
    g_idDropZone.addEventListener('drop', handleDrop, false);
    document.body.addEventListener('dragover', bodyDrag, false);
}

function handelDragEnter(evt){
    evt.stopPropagation();
    evt.preventDefault();
    console.log("handelDragEnter");
    g_idDropZone.style.display = "block";
    if(g_hasData) {
        g_idFade.style.display = "block";
    }
}

function handelDragLeave(evt){
    evt.stopPropagation();
    evt.preventDefault();
     console.log("handelDragLeave");
     g_idFade.style.display = "none";
     if(g_hasData) {
         g_idDropZone.style.display = "none";
     }
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

function bodyDrag(){
    g_idDropZone.style.display = "block";
    console.log("bodyDrag");
}

function stringifyGaf(name, gaf, recursive){
    var gafItem = createItem(name, gaf);
    if(isExtendable(gaf, name)){
        //if(recursive)
        //    buildGafNode(gafItem, recursive);
        //else
            buildPreview(gafItem);
    }
    else{
        buildGafNode(gafItem, false);
    }
    return gafItem;
}

function createItem(name, object){
    var item = document.createElement('div');
    item.gafObject = object;
    item.className = 'item';

    item.gafName = document.createElement('span');
    item.gafName.className = 'itemName';
    item.gafName.innerText = name;
    item.appendChild(item.gafName);

    var br = document.createElement('br');
    item.appendChild(br);

    item.gafContainer = document.createElement('div');
    item.gafContainer.className = 'expandable';
    item.appendChild(item.gafContainer);

    item.gafBuilt = false;

    item.onclick = function(ev) {
        ev.stopPropagation();
        if(item.gafBuilt) {
            item.gafContainer.style.display = (item.gafContainer.style.display === 'none') ? 'block' : 'none';
        }
        else{
            buildGafNode(item, false);
        }
    };

    return item;
}

function buildPreview(obj) {
    var container = obj.gafContainer;
    //container.appendChild(createItem(JSON.stringify(obj)));
    container.appendChild(createItem("..."));
}

function buildGafNode(obj, recursive){
    var item;
    var gaf = obj.gafObject;
    var container = obj.gafContainer;
    obj.gafBuilt = true;

    if (gaf instanceof String) {
        container.appendChild(createItem(gaf));
    }
    else if (typeof gaf === 'number') {
        container.appendChild(createItem(gaf));
    }
    else if (gaf instanceof Array) {
        for (var i = 0, length = gaf.length; i < length; ++i) {
            item = gaf[i];
            if (typeof item !== 'undefined') {
                container.appendChild(stringifyGaf(i, item, recursive));
            }
        }
    }
    else /*if(gaf instanceof Object)*/{
        try {
            for (item in gaf) {
                if (gaf.hasOwnProperty(item)) {
                    container.appendChild(stringifyGaf(item, gaf[item], recursive));
                }
            }
        }
        catch (e) {
            container.appendChild(createItem("..."));
        }
    }
}

function isExtendable(obj, name){
    if (typeof obj === 'number'){
        return false;
    }
    if(obj instanceof String){
        return false;
    }

    return true;
}
