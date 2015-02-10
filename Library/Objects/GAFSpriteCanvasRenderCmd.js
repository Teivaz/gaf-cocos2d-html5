
(function() {
    gaf.Sprite.CanvasRenderCmd = function (renderable) {
        cc.Sprite.CanvasRenderCmd.call(this, renderable);
        this._hasTint = false;
        this._tintMult = null;
        this._tinOffset = null;
    };
    var proto = gaf.Sprite.CanvasRenderCmd.prototype = Object.create(cc.Sprite.CanvasRenderCmd.prototype);
    proto.constructor = gaf.Sprite.CanvasRenderCmd;

    proto._disableCtx = function(){
        this._hasTint = false;
    };

    proto._enableCtx = function(){};

    proto._applyCtxState = function(gafObject){
        this._tintMult = gafObject._cascadeColorMult;
        var tintOffset = this._tintOffset = gafObject._cascadeColorOffset;
        this._hasTint = (tintOffset.r < 255 ||
                         tintOffset.g < 255 ||
                         tintOffset.b < 255 ||
                         tintOffset.a < 255 );
    };

    proto.rendering = function(ctx, scaleX, scaleY)
    {
        // Super call
        cc.Sprite.CanvasRenderCmd.prototype.rendering.call(this, ctx, scaleX, scaleY);

        if(false)//this._hasTint)
        {
            var node = this._node;
            var contentSize = node._contentSize;
            var wrapper = ctx || cc._renderContext, context = wrapper.getContext();
            var locX = node._offsetPosition.x, locHeight = node._rect.height, locWidth = node._rect.width,
                locY = -node._offsetPosition.y - locHeight, image;

            wrapper.save();

            wrapper.setTransform(this._worldTransform, scaleX, scaleY);
            if(node._flippedX || node._flippedY)
                wrapper.save();
            if (node._flippedX) {
                locX = -locX - locWidth;
                context.scale(-1, 1);
            }
            if (node._flippedY) {
                locY = node._offsetPosition.y;
                context.scale(1, -1);
            }

            // Multiply
            wrapper.setCompositeOperation("multiply");
            wrapper.setGlobalAlpha(1);
            wrapper.setFillStyle("rgba(" + this._tintMult.r + "," + this._tintMult.g + "," + this._tintMult.b + "," + this._tintMult.a/255 + ")");
            context.fillRect(locX * scaleX, locY * scaleY, contentSize.width * scaleX, contentSize.height * scaleY);
            cc.g_NumberOfDraws++;

            // Offset
            wrapper.setCompositeOperation("source-over");
            wrapper.setFillStyle("rgba(" + this._tintOffset.r + "," + this._tintOffset.g + "," + this._tintOffset.b + "," + this._tintOffset.a/255 + ")");
            context.fillRect(locX * scaleX, locY * scaleY, contentSize.width * scaleX, contentSize.height * scaleY);
            cc.g_NumberOfDraws++;

            wrapper.restore();
        }
    };
})();
