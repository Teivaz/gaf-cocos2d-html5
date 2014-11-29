 /*
 * Created by Teivaz on 29.11.2014.
 * Thanks to David Caldwell <david@porkrind.org> for `renderjson`
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
                    var data = cc.gaf.Load(arrayBuffer);
                    document.getElementById('list').appendChild(renderjson(data));
                };
            })(f);
            reader.readAsArrayBuffer(f);
        }
    }
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

var module;
(module||{}).exports = renderjson = (function() {
    var themetext = function(/* [class, text]+ */) {
        var spans = [];
        while (arguments.length)
            spans.push(append(span(Array.prototype.shift.call(arguments)),
                              text(Array.prototype.shift.call(arguments))));
        return spans;
    };
    var append = function(/* el, ... */) {
        var el = Array.prototype.shift.call(arguments);
        for (var a=0; a<arguments.length; a++)
            if (arguments[a].constructor == Array)
                append.apply(this, [el].concat(arguments[a]));
            else
                el.appendChild(arguments[a]);
        return el;
    };
    var prepend = function(el, child) {
        el.insertBefore(child, el.firstChild);
        return el;
    }
    var isempty = function(obj) { for (var k in obj) if (obj.hasOwnProperty(k)) return false;
                                  return true; }
    var text = function(txt) { return document.createTextNode(txt) };
    var div = function() { return document.createElement("div") };
    var span = function(classname) { var s = document.createElement("span");
                                     if (classname) s.className = classname;
                                     return s; };
    var A = function A(txt, classname, callback) { var a = document.createElement("a");
                                                   if (classname) a.className = classname;
                                                   a.appendChild(text(txt));
                                                   a.href = '#';
                                                   a.onclick = function() { callback(); return false; };
                                                   return a; };

    function _renderjson(json, indent, dont_indent, show_level, sort_objects) {
        var my_indent = dont_indent ? "" : indent;

        if (json === null) return themetext(null, my_indent, "keyword", "null");
        if (json === void 0) return themetext(null, my_indent, "keyword", "undefined");
        if (typeof(json) != "object") // Strings, numbers and bools
            return themetext(null, my_indent, typeof(json), JSON.stringify(json));

        var disclosure = function(open, close, type, builder) {
            var content;
            var empty = span(type);
            var show = function() { if (!content) append(empty.parentNode,
                                                         content = prepend(builder(),
                                                                           A(renderjson.hide, "disclosure",
                                                                             function() { content.style.display="none";
                                                                                          empty.style.display="inline"; } )));
                                    content.style.display="inline";
                                    empty.style.display="none"; };
            append(empty,
                   A(renderjson.show, "disclosure", show),
                   themetext(type+ " syntax", open),
                   A(" ... ", null, show),
                   themetext(type+ " syntax", close));

            var el = append(span(), text(my_indent.slice(0,-1)), empty);
            if (show_level > 0)
                show();
            return el;
        };

        if (json.constructor == Array) {
            if (json.length == 0) return themetext(null, my_indent, "array syntax", "[]");

            return disclosure("[", "]", "array", function () {
                var as = append(span("array"), themetext("array syntax", "[", null, "\n"));
                for (var i=0; i<json.length; i++)
                    append(as,
                           _renderjson(json[i], indent+"    ", false, show_level-1, sort_objects),
                           i != json.length-1 ? themetext("syntax", ",") : [],
                           text("\n"));
                append(as, themetext(null, indent, "array syntax", "]"));
                return as;
            });
        }

        // object
        if (isempty(json))
            return themetext(null, my_indent, "object syntax", "{}");

        return disclosure("{", "}", "object", function () {
            var os = append(span("object"), themetext("object syntax", "{", null, "\n"));
            for (var k in json) var last = k;
            var keys = Object.keys(json);
            if (sort_objects)
                keys = keys.sort();
            for (var i in keys) {
                var k = keys[i];
                append(os, themetext(null, indent+"    ", "key", '"'+k+'"', "object syntax", ': '),
                       _renderjson(json[k], indent+"    ", true, show_level-1, sort_objects),
                       k != last ? themetext("syntax", ",") : [],
                       text("\n"));
            }
            append(os, themetext(null, indent, "object syntax", "}"));
            return os;
        });
    }

    var renderjson = function renderjson(json)
    {
        var pre = append(document.createElement("pre"), _renderjson(json, "", false, renderjson.show_to_level, renderjson.sort_objects));
        pre.className = "renderjson";
        return pre;
    }
    renderjson.set_icons = function(show, hide) { renderjson.show = show;
                                                  renderjson.hide = hide;
                                                  return renderjson; };
    renderjson.set_show_to_level = function(level) { renderjson.show_to_level = typeof level == "string" &&
                                                                                level.toLowerCase() === "all" ? Number.MAX_VALUE
                                                                                                              : level;
                                                     return renderjson; };
    renderjson.set_sort_objects = function(sort_bool) { renderjson.sort_objects = sort_bool;
                                                        return renderjson; };
    // Backwards compatiblity. Use set_show_to_level() for new code.
    renderjson.set_show_by_default = function(show) { renderjson.show_to_level = show ? Number.MAX_VALUE : 0;
                                                      return renderjson; };
    renderjson.set_icons('⊕', '⊖');
    renderjson.set_show_by_default(false);
    renderjson.set_sort_objects(false);
    return renderjson;
})();
