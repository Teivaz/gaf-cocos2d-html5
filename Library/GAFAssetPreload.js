
gaf._AssetPreload = function(){
    this["0"] = gaf._AssetPreload.End;
    this["1"] = gaf._AssetPreload.Atlases;
    //this["2"] = gaf._AssetPreload.AnimationMasks;
    this["3"] = gaf._AssetPreload.AnimationObjects;
    this["4"] = gaf._AssetPreload.AnimationFrames;
    //this["5"] = gaf._AssetPreload.NamedParts;
    //this["6"] = gaf._AssetPreload.Sequences;
    //this["7"] = gaf._AssetPreload.TextFields;
    //this["8"] = gaf._AssetPreload.Atlases2;
    this["9"] = gaf._AssetPreload.Stage;
    //this["10"] = gaf._AssetPreload.AnimationObjects2;
    //this["11"] = gaf._AssetPreload.AnimationMasks2;
    //this["12"] = gaf._AssetPreload.AnimationFrames2;
    this["13"] = gaf._AssetPreload.TimeLine;

    this.Tag = function(asset, tag){
        (this[tag.tagId])(asset, tag.content);
    };
};


gaf._AssetPreload.End = function(){};
gaf._AssetPreload.Atlases = function(asset, content){
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
//gaf._AssetPreload.AnimationMasks = function(asset, content){};
gaf._AssetPreload.AnimationObjects = function(asset, content) {
    // Constructed with animation
};
gaf._AssetPreload.AnimationFrames = function(asset, content) {
    var frames = [];
    content.forEach(function(item){
        var frame = {};

        frame.getObjectStates = function(){return item.state};
        frames[item.frame] = frame;

    });
    parent.getAnimationFrames = function(){return frames};
};
//gaf._AssetPreload.NamedParts = function(asset, content){};
//gaf._AssetPreload.Sequences = function(asset, content){};
//gaf._AssetPreload.TextFields = function(asset, content){};
//gaf._AssetPreload.Atlases2 = function(asset, content){};
gaf._AssetPreload.Stage = function(asset, content) {
    asset._sceneFps = content.fps;
    asset._sceneColor = content.color;
    asset._sceneWidth = content.width;
    asset._sceneHeight = content.height;
};
//gaf._AssetPreload.AnimationObjects2 = function(asset, content){};
//gaf._AssetPreload.AnimationMasks2 = function(asset, content){};
//gaf._AssetPreload.AnimationFrames2 = function(asset, content){};
gaf._AssetPreload.TimeLine = function(asset, content) {
    var result = new gaf.GAFTimeLine();
    result._tag = content;
    asset._timeLines.push(result);
    asset._objects[content.id] = result;
};

gaf._AssetPreload = new gaf._AssetPreload();
