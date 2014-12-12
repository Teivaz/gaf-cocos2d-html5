
gaf._GAFPreload = function(){
    this["0"] = gaf._GAFPreload.End;
    this["1"] = gaf._GAFPreload.Atlases;
    //this["2"] = gaf._GAFPreload.AnimationMasks;
    this["3"] = gaf._GAFPreload.AnimationObjects;
    this["4"] = gaf._GAFPreload.AnimationFrames;
    //this["5"] = gaf._GAFPreload.NamedParts;
    //this["6"] = gaf._GAFPreload.Sequences;
    //this["7"] = gaf._GAFPreload.TextFields;
    //this["8"] = gaf._GAFPreload.Atlases2;
    this["9"] = gaf._GAFPreload.Stage;
    //this["10"] = gaf._GAFPreload.AnimationObjects2;
    //this["11"] = gaf._GAFPreload.AnimationMasks2;
    //this["12"] = gaf._GAFPreload.AnimationFrames2;
    this["13"] = gaf._GAFPreload.TimeLine;

    this.Tag = function(asset, tag){
        (this[tag.tagId])(asset, tag.content);
    };
};


gaf._GAFPreload.End = function(){};
gaf._GAFPreload.Atlases = function(asset, content){
    var atlases = {};
    var csf = cc.Director._getInstance().getContentScaleFactor();
    content.atlases.forEach(function(item){
        var atlasPath = "";
        item.sources.forEach(function(atlasSource){
            if(atlasSource.csf === csf)
                atlasPath = atlasSource.source;
        });

        atlases[item.id] = new cc.TextureAtlas(atlasPath);
    });

    parent.elements = {};
    content.elements.forEach(function(item){
        var texture = atlases[item.atlasId];
        var rect = cc.rect(item.pivot.x, item.pivot.y, item.width, item.height);
        var rotated = false;
        var offset = item.XY;
        var originalSize = cc.rect(0, 0, item.width / item.scale, item.height / item.scale);
        var element = new cc.SpriteFrame();
        element.initWithTexture(texture, rect, rotated, offset, originalSize);

        asset._objects[item.elementAtlasId] = element;
    });
};
//gaf._GAFPreload.AnimationMasks = function(asset, content){};
gaf._GAFPreload.AnimationObjects = function(asset, content) {
    // Constructed with animation
};
gaf._GAFPreload.AnimationFrames = function(asset, content) {
    var frames = [];
    content.forEach(function(item){
        var frame = {};

        frame.getObjectStates = function(){return item.state};
        frames[item.frame] = frame;

    });
    parent.getAnimationFrames = function(){return frames};
};
//gaf._GAFPreload.NamedParts = function(asset, content){};
//gaf._GAFPreload.Sequences = function(asset, content){};
//gaf._GAFPreload.TextFields = function(asset, content){};
//gaf._GAFPreload.Atlases2 = function(asset, content){};
gaf._GAFPreload.Stage = function(asset, content) {
    asset._sceneFps = content.fps;
    asset._sceneColor = content.color;
    asset._sceneWidth = content.width;
    asset._sceneHeight = content.height;
};
//gaf._GAFPreload.AnimationObjects2 = function(asset, content){};
//gaf._GAFPreload.AnimationMasks2 = function(asset, content){};
//gaf._GAFPreload.AnimationFrames2 = function(asset, content){};
gaf._GAFPreload.TimeLine = function(asset, content) {
    var result = new gaf.GAFTimeLine();
    result._tag = content;
    asset._timeLines.push(result);
    asset._objects[content.id] = result;
};

gaf._GAFPreload = new gaf._GAFPreload();
