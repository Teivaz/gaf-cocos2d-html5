
gaf._GAFConstruct = function(){

};

gaf._GAFConstruct.Atlases = function(content, parent){
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
        var rect = new cc.rect(item.pivot.x, item.pivot.y, item.width, item.height);
        var rotated = false;
        var offset = item.XY;
        var originalSize = new cc.rect(0, 0, item.width / item.scale, item.height / item.scale);
        var element = new cc.SpriteFrame();
        element.initWithTexture(texture, rect, rotated, offset, originalSize);

        parent.elements[item.elementAtlasId] = element;
    });
};

gaf._GAFConstruct.AnimationObjects = function(content, parent) {
    
};
