gaf._Uniforms = {
    ColorTransformMult: -1,
    ColorTransformOffset: -1,
    ColorMatrixBody: -1,
    ColorMatrixAppendix: -1,
    BlurTexelOffset: -1,
    GlowTexelOffset: -1,
    GlowColor: -1
};

gaf._shaderCreate = function(fs, vs) {
    var program = new cc.GLProgram();
    var result = program.initWithByteArrays(fs, vs);
    cc.assert(result, "Shader init error");
    result = program.link();
    cc.assert(result, "Shader linking error");
    program.updateUniforms();
    program.bindAttribLocation(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
    program.bindAttribLocation(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
    program.bindAttribLocation(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
    return program;
};

gaf._shaderCreateAlpha = function(){
    var program = gaf._shaderCreate(gaf.SHADER_COLOR_MATRIX_FRAG, cc.SHADER_POSITION_TEXTURE_COLOR_VERT);
    program._glContext.getUniformLocation(program._programObj, gaf.UNIFORM_BLUR_TEXEL_OFFSET);
    gaf._Uniforms.ColorTransformMult = program._glContext.getUniformLocation(program._programObj, gaf.UNIFORM_ALPHA_CTX_MULT);
    gaf._Uniforms.ColorTransformOffset = program._glContext.getUniformLocation(program._programObj, gaf.UNIFORM_ALPHA_CTX_OFFSET);
    gaf._Uniforms.ColorMatrixBody = program._glContext.getUniformLocation(program._programObj, gaf.UNIFORM_ALPHA_COLOR_MATRIX_BODY);
    gaf._Uniforms.ColorMatrixAppendix = program._glContext.getUniformLocation(program._programObj, gaf.UNIFORM_ALPHA_COLOR_MATRIX_APPENDIX);
    return program;
};

gaf._shaderCreateBlur = function(){
    var program = gaf._shaderCreate(gaf.SHADER_GAUSSIAN_BLUR_FRAG, cc.SHADER_POSITION_TEXTURE_COLOR_VERT);
    gaf._Uniforms.BlurTexelOffset = program._glContext.getUniformLocation(program._programObj, gaf.UNIFORM_BLUR_TEXEL_OFFSET);

    return program;
};

gaf._shaderCreateGlow = function(){
    var program = gaf._shaderCreate(gaf.SHADER_GLOW_FRAG, cc.SHADER_POSITION_TEXTURE_COLOR_VERT);
    gaf._Uniforms.GlowTexelOffset = program._glContext.getUniformLocation(program._programObj, gaf.UNIFORM_GLOW_TEXEL_OFFSET);
    gaf._Uniforms.GlowColor = program._glContext.getUniformLocation(program._programObj, gaf.UNIFORM_GLOW_COLOR);
    return program;
};

gaf._Shaders = {
    Alpha: gaf._shaderCreateAlpha(),
    Blur: gaf._shaderCreateBlur(),
    Glow: gaf._shaderCreateGlow()
};
