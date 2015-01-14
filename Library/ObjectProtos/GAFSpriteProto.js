
gaf._SpriteProto = function(atlasFrame, elementAtlasIdRef) {
    var anchor = atlasFrame._gafAnchor;
    delete atlasFrame._gafAnchor;

    this.getFrame = function(){return atlasFrame};
    this.getIdRef = function(){return elementAtlasIdRef};
    this.getAnchor = function() {return anchor};


    /*
     * Will construct GAFSprite
     */
    this._gafConstruct = function(){
        cc.log("creating sp " + elementAtlasIdRef);
        var ret = new gaf.Sprite(this);

        return ret;
    };
};
