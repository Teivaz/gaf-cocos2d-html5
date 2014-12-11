
gaf._GAFConstruct = function(){
    this["0"] = gaf._GAFConstruct.End;
    this["1"] = gaf._GAFConstruct.Atlases;
    //this["2"] = gaf._GAFConstruct.AnimationMasks;
    this["3"] = gaf._GAFConstruct.AnimationObjects;
    this["4"] = gaf._GAFConstruct.AnimationFrames;
    //this["5"] = gaf._GAFConstruct.NamedParts;
    //this["6"] = gaf._GAFConstruct.Sequences;
    //this["7"] = gaf._GAFConstruct.TextFields;
    //this["8"] = gaf._GAFConstruct.Atlases2;
    this["9"] = gaf._GAFConstruct.Stage;
    //this["10"] = gaf._GAFConstruct.AnimationObjects2;
    //this["11"] = gaf._GAFConstruct.AnimationMasks2;
    //this["12"] = gaf._GAFConstruct.AnimationFrames2;
    this["13"] = gaf._GAFConstruct.TimeLine;

    this.Tag = function(asset, tag, parent){
        (this[tag.tagId])(asset, tag.content, parent);
    };
};


gaf._GAFConstruct.End = function(){};
gaf._GAFConstruct.Atlases = function(asset, content, parent){
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

        parent.elements[item.elementAtlasId] = element;
    });
};
//gaf._GAFConstruct.AnimationMasks = function(asset, content, parent){};
gaf._GAFConstruct.AnimationObjects = function(asset, content, parent) {
    parent.animationObjects = {};

    content.forEach(function(item){
        parent.animationObjects[item.objectId] = parent.elements[item.elementAtlasIdRef];
    });
};
gaf._GAFConstruct.AnimationFrames = function(asset, content, parent) {
    var frames = [];
    content.forEach(function(item){
        var frame = {};

        frame.getObjectStates = function(){return item.state};
        frames[item.frame] = frame;

    });
    parent.getAnimationFrames = function(){return frames};
};
//gaf._GAFConstruct.NamedParts = function(asset, content, parent){};
//gaf._GAFConstruct.Sequences = function(asset, content, parent){};
//gaf._GAFConstruct.TextFields = function(asset, content, parent){};
//gaf._GAFConstruct.Atlases2 = function(asset, content, parent){};
gaf._GAFConstruct.Stage = function(asset, content) {
    asset._sceneFps = content.fps;
    asset._sceneColor = content.color;
    asset._sceneWidth = content.width;
    asset._sceneHeight = content.height;
};
//gaf._GAFConstruct.AnimationObjects2 = function(asset, content, parent){};
//gaf._GAFConstruct.AnimationMasks2 = function(asset, content, parent){};
//gaf._GAFConstruct.AnimationFrames2 = function(asset, content, parent){};
gaf._GAFConstruct.TimeLine = function(asset, content) {
    var result = new gaf.GAFTimeLine();
    result._tag = content;

    if(content.id === 0 || !content.hasLinkage){
        asset._rootTimeLine = result;
    }
    asset._timeLines.push(result);
    asset._objects[content.id] = result;
};


gaf._GAFConstruct = new gaf._GAFConstruct();
