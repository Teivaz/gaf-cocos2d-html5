
gaf.Mask = gaf.Object.extend({
    _className: "GAFMask",

    ctor : function(gafSpriteProto){
        this._super();
        cc.assert(gafSpriteProto, "Error! Missing mandatory parameter.");
        this._gafproto = gafSpriteProto;
        var frame = this._gafproto.getFrame();
        this._sprite = cc.Sprite.createWithSpriteFrame(frame);
        this._sprite.setAnchorPoint(gafSpriteProto.getAnchor());
        this._clip = cc.ClippingNode.create(this._sprite);
        this._clip.setAlphaThreshold(0.5);
        this.addChild(this._clip);
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