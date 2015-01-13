
gaf._MaskProto = function(atlasFrame, anchor, elementAtlasIdRef) {
    this.getFrame = function(){return atlasFrame};
    this.getIdRef = function(){return elementAtlasIdRef};
    this.getAnchor = function() {return anchor};


    /*
     * Will construct GAFMask
     */
    this._gafConstruct = function(sharedObjects){
        var ret = new gaf.Mask(this);

        return ret;
    };
};
