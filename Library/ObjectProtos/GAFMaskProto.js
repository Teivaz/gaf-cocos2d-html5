
gaf._MaskProto = function(objects, elementAtlasIdRef, type) {
    this.type = type || gaf.TYPE_TEXTURE;
    this.getObjects = function(){return objects};
    this.getIdRef = function(){return elementAtlasIdRef};

    /*
     * Will construct GAFMask
     */
    this._gafConstruct = function(sharedObjects){
        var ret = new gaf.Mask(this);

        return ret;
    };
};

