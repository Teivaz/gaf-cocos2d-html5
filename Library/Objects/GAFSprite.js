
gaf.Sprite = gaf.Object.extend
({
    _className: "GAFSprite",

    ctor : function(gafSpriteProto)
    {
        this._super();
        cc.assert(gafSpriteProto, "Error! Missing mandatory parameter.");
        this._gafproto = gafSpriteProto;
    },

    // Private

    _init : function()
    {
        var frame = this._gafproto.getFrame();
        cc.assert(frame instanceof cc.SpriteFrame, "Error. Wrong object type.");
        this._sprite = cc.Sprite.createWithSpriteFrame(frame);
        this._sprite.setAnchorPoint(this._gafproto.getAnchor());
        this.addChild(this._sprite);
        //this._sprite.setCascadeColorEnabled(true);
        //this._sprite.setCascadeOpacityEnabled(true);
        this._sprite.setOpacityModifyRGB(true);

        if(cc._renderType === cc._RENDER_TYPE_WEBGL)
        {
            // WebGL set up
            this._applyCtxState = this._applyWebGLCtxState;
        }
        else
        {
            // Canvas
            this._applyCtxState = this._applyCanvasCtxState;
        }
    },

    _applyState : function(state, parent)
    {
        this._parentTimeLine = parent;
        this.setExternalTransform(state.matrix);
        this._sprite.setOpacity(state.alpha);
        if(gaf._stateHasCtx(state))
        {
            // Set ctx shader
            this._applyCtxState(state);
        }
        else
        {
            this._resetCtxState();
            // Set normal shader
            if(state.hasColorTransform)
            {
                if(!cc.colorEqual(this._sprite.getColor(), state.colorTransform.mult))
                    this._sprite.setColor(state.colorTransform.mult);
            }
            else
            {
                if(!cc.colorEqual(this._sprite.getColor(), cc.color.WHITE))
                    this._sprite.setColor(cc.color.WHITE);
            }
        }
    },

    _resetCtxState: function(){},

    _applyCtxState: function(state){},

    _applyWebGLCtxState: function(state)
    {
        //var state = this._sprite.getGLProgramState();
    },

    getBoundingBoxForCurrentFrame: function ()
    {
        var result = this._sprite.getBoundingBox();
        return cc._rectApplyAffineTransformIn(result, this.getNodeToParentTransform());
    },

    _applyCanvasCtxState: function(state){}


});
/*
if (cc._renderType === cc._RENDER_TYPE_CANVAS) {
}
else{
    gaf._tmp.WebGLGAFSprite();
    delete  gaf._tmp.WebGLGAFSprite;
}


*/