
gaf._GAFConstruct = function(){

};

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

gaf._GAFConstruct.TimeLine = function(asset, content) {
    var result = new gaf.GAFTimeLine();
    result._tag = content;

    if(content.id === 0 || !content.hasLinkage){
        asset._rootTimeLine = result;
    }
    asset._timeLines.push(result);
    asset._objects[content.id] = result;
};

