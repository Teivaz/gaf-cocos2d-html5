
gaf._SpriteProto = function(atlasFrame, anchor, elementAtlasIdRef) {
    this.getFrame = function(){return atlasFrame};
    this.getIdRef = function(){return elementAtlasIdRef};
    this.getAnchor = function() {return anchor};


    /*
     * Will construct GAFSprite
     */
    this._gafConstruct = function(sharedObjects){
        var ret = new gaf.Sprite(this);

        return ret;
    };
};
