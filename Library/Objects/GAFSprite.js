
gaf.Sprite = gaf.Object.extend({
    _className: "GAFSprite",

    ctor : function(gafSpriteProto){
        this._super();
        cc.assert(gafSpriteProto,  "Error! Missing mandatory parameter.");
        this._proto = gafSpriteProto;

        var frame = this._proto.getObjects()[this._proto.getIdRef()];
        this._sprite = cc.Sprite.createWithSpriteFrame(frame);
        this._sprite.setAnchorPoint(frame._gafAnchor);
        this.addChild(this._sprite);
        //this._sprite.setCascadeColorEnabled(true);
        //this._sprite.setCascadeOpacityEnabled(true);
        this._sprite.setOpacityModifyRGB(true);

    },

    // Private

    _applyState : function(state, parent){
        this._parentTimeLine = parent;
        this.setExternalTransform(gaf.CGAffineTransformCocosFormatFromFlashFormat(state.matrix));
        this._sprite.setOpacity(state.alpha * 255);
        if(state.hasColorTransform){
            this._sprite.setColor(cc.color(
                state.colorTransform.redMultiplier * 255,
                state.colorTransform.greenMultiplier * 255,
                state.colorTransform.blueMultiplier * 255
            ));
        }
        else{
            this._sprite.setColor(cc.color(255, 255, 255));
        }
    }


});
/*
if (cc._renderType === cc._RENDER_TYPE_CANVAS) {
}
else{
    gaf._tmp.WebGLGAFSprite();
    delete  gaf._tmp.WebGLGAFSprite;
}


*/