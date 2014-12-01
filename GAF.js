var gaf = gaf || {};


gaf.IDNONE = cc.UINT_MAX;
gaf.FIRST_FRAME_INDEX = 0;

gaf.ACTION_STOP = 0;
gaf.ACTION_PLAY = 1;
gaf.ACTION_GO_TO_AND_STOP = 2;
gaf.ACTION_GO_TO_AND_PLAY = 3;
gaf.ACTION_DISPATCH_EVENT = 4;

gaf.PI_FRAME = 0;
gaf.PI_EVENT_TYPE = 0;


gaf.LoadSources = function() {

    var gaf_dir = "frameworks/gaf-cocos2d-html5/";

    var sources = [
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
