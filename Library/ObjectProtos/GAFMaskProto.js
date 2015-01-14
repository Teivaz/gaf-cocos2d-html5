
gaf._MaskProto = function(mask, idRef)
{
    this.getIdRef = function(){return idRef};
    this.getMaskNodeProto = function() {return mask};

    /*
     * Will construct GAFMask
     */
    this._gafConstruct = function()
    {
        var ret = new gaf.Mask(this);
        ret._init();
        return ret;
    };
};
