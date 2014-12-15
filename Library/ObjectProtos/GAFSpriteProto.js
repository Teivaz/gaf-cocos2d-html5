
gaf._SpriteProto = function(objects, elementAtlasIdRef, type) {
    this.type = type || gaf.TYPE_TEXTURE;
    this.objects = elementAtlasIdRef;
    this.idRef = elementAtlasIdRef;

    /*
     * Will construct GAFSprite
     */
    this._gafConstruct = function(sharedObjects){
        var ret = new gaf.Sprite();
        ret.implement(this);
        delete ret._gafConstruct;

        return ret;
    };
};
