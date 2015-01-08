
gaf._MaskProto = function(atlasFrames, elementAtlasIdRef, type) {
    this.type = type || gaf.TYPE_TEXTURE;
    this.getAtlasFrames = function(){return atlasFrames};
    this.getIdRef = function(){return elementAtlasIdRef};

    /*
     * Will construct GAFMask
     */
    this._gafConstruct = function(sharedObjects){
        var ret = new gaf.Mask(this);

        return ret;
    };
};

