
cc.gaf.ReadSingleTag = function(stream){
    var tagId = stream.Ushort();
    var tag = cc.gaf.Tags[tagId];
    var result = {};
    if(typeof tag === "undefined"){
        cc.log("GAF. Non implemented tag detected.");
        cc.gaf.Tags.default.parse(stream, tagId);
    }
    else{
        result = tag.parse(stream, tagId);
    }
    return result;
};

cc.gaf.ReadTags = function(stream){
    var tags = [];
    do {
        var tag = cc.gaf.ReadSingleTag(stream);
        tags.push(tag);
    }while(tag.tagName != "TagEnd");
    return tags;
};

cc.gaf.Tag = cc.Class.extend({
    ctor : function(){
        this.default = new cc.gaf.Tag.base();
        this["0"] = new cc.gaf.Tag.End();
        this["1"] = new cc.gaf.Tag.DefineAtlas();
        this["2"] = new cc.gaf.Tag.DefineAnimationMasks();
        this["3"] = new cc.gaf.Tag.DefineAnimationObjects();
        this["4"] = new cc.gaf.Tag.DefineAnimationFrames();
        this["5"] = new cc.gaf.Tag.DefineNamedParts();
        this["6"] = new cc.gaf.Tag.DefineSequences();
        this["7"] = new cc.gaf.Tag.DefineTextFields();
        this["8"] = new cc.gaf.Tag.DefineAtlas2();
        this["9"] = new cc.gaf.Tag.DefineStage();
        this["10"] = new cc.gaf.Tag.DefineAnimationObjects2();
        this["11"] = new cc.gaf.Tag.DefineAnimationMasks2();
        this["12"] = new cc.gaf.Tag.DefineAnimationFrames2();
        this["13"] = new cc.gaf.Tag.DefineTimeline();
    }
});

cc.gaf.Tag.base = cc.Class.extend({
    name : "undefined",
    parse : function(stream, tagId){
        var size = stream.Uint();

        stream.startNestedBuffer(size);
        var result = this.doParse(stream);
        stream.endNestedBuffer();

        try {
            result.tagName = this.name;
        }
        catch (e){
            e;
        }
        result.tagId = tagId;
        return result;
    },
    doParse : function(stream){
        return {};
    }
});
cc.gaf.Tag.End = cc.gaf.Tag.base.extend({
    name : "TagEnd"
});
cc.gaf.Tag.DefineAtlas = cc.gaf.Tag.base.extend({
    name: "TagDefineAtlas",
    doParse: function (s) {
        var exec = s.fields(
            'scale', 'float',
            'atlases', s.array('Ubyte', s.fields(
                'id', 'Uint',
                'sources', s.array('Ubyte', s.fields(
                    'source', 'String',
                    'csf', 'float'
                ))
            ))
        );
        var result = exec();
        return result;
    }
});
cc.gaf.Tag.DefineAnimationMasks = cc.gaf.Tag.base.extend({
    name : "TagDefineAnimationMasks",
    doParse: function (s) {
        var exec = s.array('Uint', s.fields(
                'objectId', 'Uint',
                'elementAtlasIdRef', 'Uint'
            ));
        var result = exec();
        debugger;
        return result;
    }
});
cc.gaf.Tag.DefineAnimationObjects = cc.gaf.Tag.base.extend({
    name : "TagDefineAnimationObjects"
});
cc.gaf.Tag.DefineAnimationFrames = cc.gaf.Tag.base.extend({
    name : "TagDefineAnimationFrames",
    doParse : function(s){
        var exec = s.array('Uint', s.fields(
            'frame', 'Uint',
            'state', s.array('Uint', s.fields(
                'hasColorTransform', 'Ubyte',
                'hasMask', 'Ubyte',
                'hasEffect', 'Ubyte',
                'objectIdRef', 'Uint',
                'depth', 'int',
                'alpha', 'float',
                'matrix', 'Matrix',
                'colorTransform', s.condition('hasColorTransform', 1, s.fields(
                    'alphaOffset', 'float',
                    'redMultiplier', 'float',
                    'redOffset', 'float',
                    'greenMultiplier', 'float',
                    'greenOffset', 'float',
                    'blueMultiplier', 'float',
                    'blueOffset', 'float'
                )),
                'effect', s.condition('hasEffect', 1, s.array('Ubyte', function() {
                    return cc.gaf.Tag._readFilter(s);
                })),
                'maskObjectIdRef', s.condition('hasMask', 1, s.fields(
                    'maskObjectIdRef', 'Uint'
                ))
            ))
        ));
        var result = exec();
        debugger;
        return result;
    }
});
cc.gaf.Tag.DefineNamedParts = cc.gaf.Tag.base.extend({
    name : "TagDefineNamedParts",
    doParse : function(s) {
        var exec = s.array('Uint', s.fields(
            'objectId', 'Uint',
            'name', 'String'
        ));
        var result = exec();
        debugger;
        return result;
    }
});
cc.gaf.Tag.DefineSequences = cc.gaf.Tag.base.extend({
    name : "TagDefineSequences",
    doParse : function(s) {
        var exec = s.array('Uint', s.fields(
            'id', 'String',
            'start', 'Ushort',
            'end', 'Ushort'
        ));
        var result = exec();
        debugger;
        return result;
    }
});
cc.gaf.Tag.DefineTextFields = cc.gaf.Tag.base.extend({
    name : "TagDefineTextFields",
    doParse : function(s) {
        var exec = s.array('Uint', s.fields(
            'id', 'Uint',
            'pivot', 'Point',
            'end', 'Ushort',
            'width', 'float',
            'height', 'float',
            'text', 'String',
            'embedFonts', 'Boolean',
            'multiline', 'Boolean',
            'wordWrap', 'Boolean',
            'hasRestrict', 'Boolean',
            'restrict', s.condition('hasRestrict', 1, function (){return s['String'];}),
            'editable', 'Boolean',
            'selectable', 'Boolean',
            'displayAsPassword', 'Boolean',
            'maxChars', 'Uint',
            'align', 'Uint',
            'blockIndent', 'Uint',
            'bold', 'Boolean',
            'bullet', 'Boolean',
            'color', 'Uint',
            'font', 'String',
            'indent', 'Uint',
            'italic', 'Boolean',
            'kerning', 'Boolean',
            'leading', 'Uint',
            'leftMargin', 'Uint',
            'letterSpacing', 'float',
            'rightMargin', 'Uint',
            'size', 'Uint',
            'tabStops', s.array('Uint', s.fields(
                'value', 'Uint'
            )),
            'target', 'string',
            'underline', 'Boolean',
            'url', 'String'
        ));
        var result = exec();
        debugger;
        return result;
    }
});
cc.gaf.Tag.DefineAtlas2 = cc.gaf.Tag.base.extend({
    name : "TagDefineAtlas2",
    doParse : function(s) {
        var exec = s.fields(
            'scale', 'float',
            'atlases', s.array('Ubyte', s.fields(
                'id', 'Uint',
                'sources', s.array('Ubyte', s.fields(
                    'source', 'String',
                    'csf', 'float'
                ))
            )),
            'elements', s.array('Uint', s.fields(
                'pivot', 'Point',
                'xy', 'Point',
                'scale', 'float',
                'width', 'float',
                'height', 'float',
                'atlasId', 'Uint',
                'elementAtlasId', 'Uint',
                'hasScale9Grid', 'Boolean',
                'scale9GridRect', s.condition('hasScale9Grid', 1, function(){return s.Rect();})
            ))
        );
        var result = exec();
        debugger;
        return result;
    }
});
cc.gaf.Tag.DefineStage = cc.gaf.Tag.base.extend({
    name : "TagDefineStage",
    doParse : function(s) {
        var exec = s.fields(
            'fps', 'Ubyte',
            'color', 'int',
            'width', 'Ushort',
            'height', 'Ushort'
        );
        var result = exec();
        debugger;
        return result;
    }
});
cc.gaf.Tag.DefineAnimationObjects2 = cc.gaf.Tag.base.extend({
    name : "TagDefineAnimationObjects2",
    doParse : function(s) {
        var exec = s.array('Uint', s.fields(
            'objectId', 'Uint',
            'elementAtlasIdRef', 'Uint',
            'type', 'Ushort'
        ));
        var result = exec();
        debugger;
        return result;
    }
});
cc.gaf.Tag.DefineAnimationMasks2 = cc.gaf.Tag.base.extend({
    name : "TagDefineAnimationMasks2",
    doParse : function(s) {
        var exec = s.array('Uint', s.fields(
            'objectId', 'Uint',
            'elementAtlasIdRef', 'Uint',
            'type', 'Ushort'
        ));
        var result = exec();
        debugger;
        return result;
    }
});
cc.gaf.Tag.DefineAnimationFrames2 = cc.gaf.Tag.base.extend({
    name : "TagDefineAnimationFrames2",
    doParse : function(s) {
        var exec = s.array('Uint', s.fields(
            'frame', 'Uint',
            'hasChangesInDisplayList', 'Boolean',
            'hasActions', 'Boolean',
            'states', s.condition('hasChangesInDisplayList', 1, s.array('Uint', s.fields(
                'hasColorTransform', 'Boolean',
                'hasMask', 'Boolean',
                'hasEffect', 'Boolean',
                'objectIdRef', 'Uint',
                'depth', 'int',
                'alpha', 'float',
                'matrix', 'Matrix',
                'colorTransform', s.condition('hasColorTransform', 1, s.fields(
                    'alphaOffset', 'float',
                    'redMultiplier', 'float',
                    'redOffset', 'float',
                    'greenMultiplier', 'float',
                    'greenOffset', 'float',
                    'blueMultiplier', 'float',
                    'blueOffset', 'float'
                )),
                'effect', s.condition('hasEffect', 1, s.array('Ubyte', function() {
                    return cc.gaf.Tag._readFilter(s);
                }))
            ))),
            'actions',  s.condition('hasActions', 1, s.array('Uint', s.fields(
                'type', 'Uint',
                'params', s.condition('type', function(a){return a > 1;}, s.array('Uint', s.fields(
                    'value', 'String'
                )))
            )))
        ));
        var result = exec();
        debugger;
        return result;
    }
});
cc.gaf.Tag.DefineTimeline = cc.gaf.Tag.base.extend({
    name : "TagDefineTimeline",
    doParse : function(s) {
        var exec = s.fields(
            'smth1', 'Uint',
            'smth2', 'Uint',
            'aabb', 'Rect',
            'pivot', 'Point',
            'hasLinkage', 'Boolean',
            'linkage', s.condition('hasLinkage', 1, function(){return s.String();})
        );
        var result = exec();
        result.tags = cc.gaf.ReadTags(s);
        return result;
    }
});

cc.gaf.Tag._readFilter = function(s){
    return s.fields(
        'type', 'Uint',
        'dropShadow', s.condition('type', 0, s.fields( // DropShadow
            'color', 'Uint',
            'blurX', 'float',
            'blurY', 'float',
            'angle', 'float',
            'distance', 'float',
            'strength', 'float',
            'inner', 'Boolean',
            'knockout', 'Boolean'
        )),
        'blur', s.condition('type', 0, s.fields( // Blur
            'blurX', 'float',
            'blurY', 'float'
        )),
        'glow', s.condition('type', 0, s.fields( // Glow
            'color', 'Uint',
            'blurX', 'float',
            'blurY', 'float',
            'strength', 'float',
            'inner', 'Boolean',
            'knockout', 'Boolean'
        )),
        'colorMatrix', s.condition('type', 0, s.fields( // ColorMatrix
            'rr', 'float', 'gr', 'float', 'br', 'float', 'ar', 'float', 'r', 'float',
            'rg', 'float', 'gg', 'float', 'bg', 'float', 'ag', 'float', 'g', 'float',
            'rb', 'float', 'gb', 'float', 'bb', 'float', 'ab', 'float', 'b', 'float',
            'ra', 'float', 'ga', 'float', 'ba', 'float', 'aa', 'float', 'a', 'float'
        ))
    )
};

cc.gaf.Tags = new cc.gaf.Tag();
