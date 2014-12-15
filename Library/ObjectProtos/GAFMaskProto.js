
gaf._MaskProto = function(objects, elementAtlasIdRef, type) {
    this.type = type || gaf.TYPE_TEXTURE;
    this.objects = elementAtlasIdRef;
    this.idRef = elementAtlasIdRef;

    /*
     * Will construct GAFMask
     */
    this._gafConstruct = function(sharedObjects){
        var ret = new gaf.Mask(this);

        return ret;
    };
};

