
(function() {
    gaf.Sprite.CanvasRenderCmd = function (renderable) {
        cc.Sprite.CanvasRenderCmd.call(this, renderable);
    };
    var proto = gaf.Sprite.CanvasRenderCmd.prototype = Object.create(cc.Sprite.CanvasRenderCmd.prototype);
    proto.constructor = gaf.Sprite.CanvasRenderCmd;
})();
