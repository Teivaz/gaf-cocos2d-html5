
gaf.Mask = gaf.Object.extend({
    _className: "GAFMask",

    ctor : function(gafMaskProto){
        this._super();
        cc.assert(gafMaskProto, "Error! Missing mandatory parameter.");
        this._proto = gafMaskProto;
        var frame = this._proto.getAtlasFrames()[this._proto.getIdRef()];
        this._sprite = cc.Sprite.createWithSpriteFrame(frame);
        this._sprite.setAnchorPoint(frame._gafAnchor);
        this._clip = cc.ClippingNode.create(this._sprite);
        this._clip.setAlphaThreshold(0.5);
        this.addChild(this._clip);
        //this.addChild(this._sprite);

    },

    setExternalTransform : function(affineTransform){
        if(!cc.affineTransformEqualToTransform(this._sprite._additionalTransform, affineTransform)){
            this._sprite.setAdditionalTransform(affineTransform);
        }
    },

    _getNode : function(){
        return this._clip;
    }
});