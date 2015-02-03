
(function(){
    gaf.Sprite.WebGLRenderCmd = function (renderable) {
        cc.Sprite.WebGLRenderCmd.call(this, renderable);
        this._defualtShader = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);
        this._customShader = gaf._Shaders.Alpha;

    };

    var proto = gaf.Sprite.WebGLRenderCmd.prototype = Object.create(cc.Sprite.WebGLRenderCmd.prototype);
    proto.constructor = gaf.Sprite.WebGLRenderCmd;


})();
