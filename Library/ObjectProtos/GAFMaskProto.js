
gaf._MaskProto = function(atlasFrame, anchor, elementAtlasIdRef) {
    var anchor = atlasFrame._gafAnchor;
    delete atlasFrame._gafAnchor;

    this.getFrame = function(){return atlasFrame};
    this.getIdRef = function(){return elementAtlasIdRef};
    this.getAnchor = function() {
        return anchor;
    };


    /*
     * Will construct GAFMask
     */
    this._gafConstruct = function(){
        var ret = new gaf.Mask(this);

        return ret;
    };
};
