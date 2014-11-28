/**
 * Created by Teivaz on 29.11.2014.
 */

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files;

    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        var name = escape(f.name);
        var ext = name.split('.').pop();
        if(ext == 'gaf'){
            var reader = new FileReader();
            reader.onload = (function(theFile){
                return function(req) {
                    var arrayBuffer = new cc.gaf.DataReader(req.target.result);
                    var loader = cc.gaf.Load(arrayBuffer);
                    var result = JSON.stringify(loader, null, "  ");
                    document.getElementById('list').innerHTML = '<pre>' + result + '</pre>';
                };
            })(f);
            reader.readAsArrayBuffer(f);
        }
    }
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);