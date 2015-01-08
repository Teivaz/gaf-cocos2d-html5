
gaf._SpriteProto = function(atlasFrames, elementAtlasIdRef) {
    this.getAtlasFrames = function(){return atlasFrames};
    this.getIdRef = function(){return elementAtlasIdRef};

    /*
     * Will construct GAFSprite
     */
    this._gafConstruct = function(sharedObjects){
        var ret = new gaf.Sprite(this);

        return ret;
    };
};
