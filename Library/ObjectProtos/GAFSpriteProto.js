
gaf._SpriteProto = function(objects, elementAtlasIdRef, type) {
    this.type = type || gaf.TYPE_TEXTURE;
    this.getObjects = function(){return objects};
    this.getIdRef = function(){return elementAtlasIdRef};

    /*
     * Will construct GAFSprite
     */
    this._gafConstruct = function(sharedObjects){
        var ret = new gaf.Sprite(this);

        return ret;
    };
};
