
(function(){
    gaf.Sprite.WebGLRenderCmd = function (renderable) {
        cc.Sprite.WebGLRenderCmd.call(this, renderable);
        this._defualtShader = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);
        this._customShader = gaf._Shaders.Alpha;

        //this._shaderProgram = this._defualtShader;

        this._tintMult = null;
        this._tintOffset = null;
        this._ctxMatrixBody = null;
        this._ctxMatrixAppendix = null;
    };

    var proto = gaf.Sprite.WebGLRenderCmd.prototype = Object.create(cc.Sprite.WebGLRenderCmd.prototype);
    proto.constructor = gaf.Sprite.WebGLRenderCmd;

    proto._identityVec = [1.0, 1.0, 1.0, 1.0];
    proto._zeroVec = [0.0, 0.0, 0.0, 0.0];
    proto._identityMat = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    proto._disableCtx = function(){
        this.setShaderProgram(this._defualtShader);
    };

    proto._enableCtx = function(){
        this.setShaderProgram(this._customShader);
    };

    proto._applyCtxState = function(state){/*
        this._tintMult = [
            state.colorTransform.mult.r / 255 ,
            state.colorTransform.mult.g / 255 ,
            state.colorTransform.mult.b / 255 ,
            state.colorTransform.mult.a / 255
        ];
        this._tintOffset = [
            state.colorTransform.offset.r / 255 ,
            state.colorTransform.offset.g / 255 ,
            state.colorTransform.offset.b / 255 ,
            state.colorTransform.offset.a / 255
        ];
        if(state.hasEffect && state.effect[0].type === gaf.EFFECT_COLOR_MATRIX)
        {
            var m = state.effect[0].colorMatrix;
            this._ctxMatrixBody = [
                m.rr, m.gr, m.br, m.ar,
                m.rg, m.gg, m.bg, m.ag,
                m.rb, m.gb, m.bb, m.ab,
                m.ra, m.ga, m.ba, m.aa
            ];
            this._ctxMatrixAppendix = [m.r, m.g, m.b, m.a];
        }
        else
        {
            this._ctxMatrixBody = null;
            this._ctxMatrixAppendix = null;
        }*/
    };

    proto._setUniforms = function()
    {
        if(this._shaderProgram === this._customShader)
        {
            this._shaderProgram.use();
            if(this._tintMult && this._tintOffset)
            {
                this._shaderProgram.setUniformLocationWith4fv(
                    gaf._Uniforms.ColorTransformMult,
                    this._tintMult,
                    1
                );
                this._shaderProgram.setUniformLocationWith4fv(
                    gaf._Uniforms.ColorTransformOffset,
                    this._tintOffset,
                    1
                );
            }
            else
            {
                this._shaderProgram._glContext.uniform4fv(gaf._Uniforms.ColorTransformMult, this._identityVec);
                this._shaderProgram._glContext.uniform4fv(gaf._Uniforms.ColorTransformMult, this._identityVec);
                this._shaderProgram.setUniformLocationWith4fv(
                    gaf._Uniforms.ColorTransformMult,
                    this._identityVec,
                    1
                );
                this._shaderProgram.setUniformLocationWith4fv(
                    gaf._Uniforms.ColorTransformOffset,
                    this._zeroVec,
                    1
                );
            }

            if(this._ctxMatrixBody && this._ctxMatrixAppendix)
            {
                this._shaderProgram.setUniformLocationWithMatrix4fv(
                    gaf._Uniforms.ColorMatrixBody,
                    this._ctxMatrixBody,
                    1
                );
                this._shaderProgram.setUniformLocationWith4fv(
                    gaf._Uniforms.ColorMatrixAppendix,
                    this._ctxMatrixAppendix,
                    1
                );
            }
            else
            {
                this._shaderProgram.setUniformLocationWithMatrix4fv(
                    gaf._Uniforms.ColorMatrixBody,
                    this._identityMat,
                    1
                );
                this._shaderProgram.setUniformLocationWith4fv(
                    gaf._Uniforms.ColorMatrixAppendix,
                    this._zeroVec,
                    1
                );
            }
        }
        else
        {
            var a;
        }
    };

    proto.rendering = function(ctx)
    {
        this._setUniforms();

        // Super call
        cc.Sprite.WebGLRenderCmd.prototype.rendering.call(this, ctx);
    };

})();
