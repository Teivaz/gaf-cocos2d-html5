
gaf.Sprite = gaf.Object.extend
({
    _className: "GAFSprite",

    _hasCtx: false,
    _hasFilter: false,

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

        // Create sprite with custom render command from frame
        this._sprite = new cc.Sprite();
        this._sprite._renderCmd = this._gafCreateRenderCmd(this._sprite);
        this._sprite.initWithSpriteFrame(frame);

        this._sprite.setAnchorPoint(this._gafproto.getAnchor());
        this.addChild(this._sprite);
        //this._sprite.setCascadeColorEnabled(true);
        //this._sprite.setCascadeOpacityEnabled(true);
        this._sprite.setOpacityModifyRGB(true);


    },

    _applyState : function(state, parent)
    {
        this._parentTimeLine = parent;
        this.setExternalTransform(state.matrix);
        this._sprite.setOpacity(state.alpha);
        if(gaf._stateHasCtx(state))
        {
            // Enable ctx state if wasn't enabled
            if(this._hasCtx)
            {
                this._enableCtx();
            }
            // Set ctx shader
            this._applyCtxState(state);
            this._hasCtx = true;
        }
        else
        {
            // Disable ctx state if was enabled
            if(this._hasCtx)
            {
                this._disableCtx();
            }
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
            this._hasCtx = false;
        }
    },

    _enableCtx: function(){},
    _disableCtx: function(){},

    _applyCtxState: function(state){},

    getBoundingBoxForCurrentFrame: function ()
    {
        var result = this._sprite.getBoundingBox();
        return cc._rectApplyAffineTransformIn(result, this.getNodeToParentTransform());
    },

    _gafCreateRenderCmd: function(item){
        if(cc._renderType === cc._RENDER_TYPE_CANVAS)
            return new gaf.Sprite.CanvasRenderCmd(item);
        else
            return new gaf.Sprite.WebGLRenderCmd(item);
    }
});
