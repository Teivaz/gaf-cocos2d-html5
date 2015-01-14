
gaf._SpriteProto = function(atlasFrame, elementAtlasIdRef) {
    this._anchor = atlasFrame._gafAnchor;
    //delete atlasFrame._gafAnchor;

    this.getFrame = function(){return atlasFrame};
    this.getIdRef = function(){return elementAtlasIdRef};
    this.getAnchor = function() {return this._anchor};


    /*
     * Will construct GAFSprite
     */
    this._gafConstruct = function(){
        var ret = new gaf.Sprite(this);
        ret._init();
        //cc.log("creating sp " + elementAtlasIdRef + " instance "+ ret.__instanceId);

        return ret;
    };
};
