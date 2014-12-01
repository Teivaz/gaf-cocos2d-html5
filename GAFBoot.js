var gaf = gaf || {};

gaf.LoadSources = function() {

    var gaf_dir = "frameworks/gaf-cocos2d-html5/";

    var sources = [
    "GAFMacros.js",
    "Library/GAFTags.js",
    "Library/GAFObject.js",
    "Library/GAFLoader.js",
    "Library/GAFDataReader.js",
    "Library/GAFAsset.js"];

    sources.forEach(function(source){
        var s = cc.newElement('script');
        s.src = gaf_dir + source;
        document.body.appendChild(s);
    });
};

gaf.CCGAFLoader = function(){
    this.load = function(realUrl, url, item, cb){
        var loader = new gaf.Loader();
        loader.LoadFile(realUrl, function(data){cb(null, data)});
    };
};
cc.loader.register('.gaf', new gaf.CCGAFLoader());
