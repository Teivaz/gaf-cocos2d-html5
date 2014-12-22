
gaf._AssetPreload = function(){
    this["0"] = gaf._AssetPreload.End;
    this["1"] = gaf._AssetPreload.Atlases;
    this["2"] = gaf._AssetPreload.AnimationMasks;
    this["3"] = gaf._AssetPreload.AnimationObjects;
    this["4"] = gaf._AssetPreload.AnimationFrames;
    this["5"] = gaf._AssetPreload.NamedParts;
    this["6"] = gaf._AssetPreload.Sequences;
    this["7"] = gaf._AssetPreload.TextFields;
    this["8"] = gaf._AssetPreload.Atlases; // 2
    this["9"] = gaf._AssetPreload.Stage;
    this["10"] = gaf._AssetPreload.AnimationObjects2;
    this["11"] = gaf._AssetPreload.AnimationMasks2;
    this["12"] = gaf._AssetPreload.AnimationFrames; // 2
    this["13"] = gaf._AssetPreload.TimeLine;

    this.Tag = function(asset, tag, timeLine){
        (this[tag.tagId])(asset, tag.content, timeLine);
    };

    this.Tags = function(asset, tags, timeLine){
        var self = this;
        tags.forEach(function(tag){
            self.Tag(asset, tag, timeLine);
        });
    };
};

gaf._AssetPreload.End = function(asset, content, timeLine){
    if(timeLine)
        timeLine.getFps = function(){return asset.getSceneFps()};
};

gaf._AssetPreload.Atlases = function(asset, content, timeLine){
    var csf = cc.Director._getInstance().getContentScaleFactor();
    var atlases = [];
    content.atlases.forEach(function(item){
        var atlasPath = "";
        item.sources.forEach(function(atlasSource){
            if(atlasSource.csf === csf)
                atlasPath = atlasSource.source;
        });
        atlases[item.id] = cc.textureCache.getTextureForKey(atlasPath);
        cc.assert(atlases[item.id], "Error loading texture!");
    });

    content.elements.forEach(function(item){
        var texture = atlases[item.atlasId];
        var rect = cc.rect(item.origin.x, item.origin.y, item.size.x, item.size.y);
        var rotated = false;
        //var offset = {x: item.pivot.x, y: item.size.y - item.pivot.y};
        var offset = {x: 0, y: 0};
        var originalSize = cc.rect(0, 0, item.size.x / item.scale, item.size.y / item.scale);
        var frame = new cc.SpriteFrame(texture, rect, rotated, offset, originalSize);
        frame._gafAnchor = {
            x: (0 - (0 - (item.pivot.x / item.size.x))),
            y: (0 + (1 - (item.pivot.y / item.size.y)))};
        //frame.setAnchorPoint(frame._gafAnchor);
        asset._objects[item.elementAtlasId] = frame;
        // 9 grid
    });
};

gaf._AssetPreload.AnimationMasks = function(asset, content, timeLine){
    content.forEach(function(item){
        asset._objects[item.objectId] = new gaf._MaskProto(asset._objects, item.elementAtlasIdRef);
    });
};

gaf._AssetPreload.AnimationObjects = function(asset, content, timeLine) {
    content.forEach(function(item){
        asset._objects[item.objectId] = new gaf._SpriteProto(asset._objects, item.elementAtlasIdRef);
    });
};

gaf._AssetPreload.AnimationFrames = function(asset, content, timeLine) {
    cc.assert(timeLine, "Error. Time Line should not be null.");

    var statesForId = {};
    var frames = [];
    var lastFrame = {};

    for(var i = 0, len = content.length; i < len; ++i){
        var frame = content[i];
        if(frame.state) {
            frame.state.forEach(function (state) {
                if (state.alpha > 0) {
                    statesForId[state.objectIdRef] = state;
                }
                else {
                    statesForId[state.objectIdRef] = null;
                }
            });
        }

        var stateArray = [];
        for(var obj in statesForId){ if(statesForId.hasOwnProperty(obj) && statesForId[obj]) {
            stateArray.push(statesForId[obj]);
        }}
        lastFrame = frame;
        frames[frame.frame - 1] = {states: stateArray, actions: frame.actions || null};
    }
    timeLine.getFrames = function(){return frames};
};

gaf._AssetPreload.NamedParts = function(asset, content, timeLine){
    var parts = {};
    content.forEach(function(item){
        parts[item.name] = item.objectIdRef;
    });
    timeLine.getNamedParts = function(){return parts};
};

gaf._AssetPreload.Sequences = function(asset, content, timeLine){
    var sequences = {};
    content.forEach(function(item){
        sequences[item.name] = {start: item.start, end: item.end};
    });
    timeLine.getSequences = function(){return sequences};
};

gaf._AssetPreload.TextFields = function(asset, content, timeLine){
    debugger;
};

gaf._AssetPreload.Stage = function(asset, content, timeLine) {
    asset._sceneFps = content.fps;
    asset._sceneColor = content.color;
    asset._sceneWidth = content.width;
    asset._sceneHeight = content.height;
};

gaf._AssetPreload.AnimationObjects2 = function(asset, content, timeLine){
    content.forEach(function(item){
        asset._objects[item.objectId] = new gaf._SpriteProto(asset._objects, item.elementAtlasIdRef, item.type);
    });
};

gaf._AssetPreload.AnimationMasks2 = function(asset, content, timeLine){
    content.forEach(function(item){
        asset._objects[item.objectId] = new gaf._MaskProto(asset._objects, item.elementAtlasIdRef, item.type);
    });
};

gaf._AssetPreload.TimeLine = function(asset, content, timeLine) {
    var result = new gaf._TimeLineProto(content.animationFrameCount, content.boundingBox, content.pivotPoint, content.id, content.linkageName);
    asset._pushTimeLine(result);
    gaf._AssetPreload.Tags(asset, content.tags, result);
};

gaf._AssetPreload = new gaf._AssetPreload();
