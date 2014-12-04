
gaf.ReadSingleTag = function(stream){
    var tagId = stream.Ushort();
    var tag = gaf.Tags[tagId];
    var result = {};
    if(typeof tag === "undefined"){
        console.log("GAF. Non implemented tag detected.");
        gaf.Tags.default.parse(stream, tagId);
    }
    else{
        //console.log("tag " + tag.tagName);
        result = tag.parse(stream, tagId);
    }
    return result;
};

gaf.ReadTags = function(stream){
    var tags = [];
    try {
        do {
            var tag = gaf.ReadSingleTag(stream);
            tags.push(tag);
        } while (tag.tagId != 0);
    }
    catch (e){
        if (e instanceof Error && e.message == "GAF format error"){
            console.log("GAF format error:\n" + e.stack);
            // Tag will be closed and parser will continue from where it should.
        }
        else{
            console.log(e.stack);
            throw e;
        }
    }
    return tags;
};


gaf.Tag = function(){
    this.default = Object.create(gaf.Tag.base);
    this["0"] = Object.create(gaf.Tag.End);
    this["1"] = Object.create(gaf.Tag.DefineAtlas);
    this["2"] = Object.create(gaf.Tag.DefineAnimationMasks);
    this["3"] = Object.create(gaf.Tag.DefineAnimationObjects);
    this["4"] = Object.create(gaf.Tag.DefineAnimationFrames);
    this["5"] = Object.create(gaf.Tag.DefineNamedParts);
    this["6"] = Object.create(gaf.Tag.DefineSequences);
    this["7"] = Object.create(gaf.Tag.DefineTextFields);
    this["8"] = Object.create(gaf.Tag.DefineAtlas2);
    this["9"] = Object.create(gaf.Tag.DefineStage);
    this["10"] = Object.create(gaf.Tag.DefineAnimationObjects2);
    this["11"] = Object.create(gaf.Tag.DefineAnimationMasks2);
    this["12"] = Object.create(gaf.Tag.DefineAnimationFrames2);
    this["13"] = Object.create(gaf.Tag.DefineTimeline);
};

gaf.Tag.base = function() {};
gaf.Tag.base.parse = function(stream, tagId){
    var size = stream.Uint();

    stream.startNestedBuffer(size);
    var result = this.doParse(stream);
    stream.endNestedBuffer();

    result.tagName = this.tagName;
    result.tagId = tagId;
    return result;
};
gaf.Tag.base.doParse = function(stream){
        return {};
    };

gaf.Tag.End = Object.create(gaf.Tag.base);
gaf.Tag.End.tagName = "TagEnd";

gaf.Tag.DefineAtlas = Object.create(gaf.Tag.base);
gaf.Tag.DefineAtlas.tagName = "TagDefineAtlas";
gaf.Tag.DefineAtlas.doParse = function (s) {
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
    var result = {'content': exec()};
//    debugger;
    return result;
};

gaf.Tag.DefineAnimationMasks = Object.create(gaf.Tag.base);
gaf.Tag.DefineAnimationMasks.tagName = "TagDefineAnimationMasks";
gaf.Tag.DefineAnimationMasks.doParse = function (s) {
    var exec = s.array('Uint', s.fields(
            'objectId', 'Uint',
            'elementAtlasIdRef', 'Uint'
        ));
    var result = {'content': exec()};
    debugger;
    return result;
};

gaf.Tag.DefineAnimationObjects = Object.create(gaf.Tag.base);
gaf.Tag.DefineAnimationObjects.tagName = "TagDefineAnimationObjects";
gaf.Tag.DefineAnimationObjects.doParse = function (s) {
    var exec = s.array('Uint', s.fields(
        'objectId', 'Uint',
        'elementAtlasIdRef', 'Uint'
    ));
    var result = {'content': exec()};
//    debugger;
    return result;
};

gaf.Tag.DefineAnimationFrames = Object.create(gaf.Tag.base);
gaf.Tag.DefineAnimationFrames.tagName = "TagDefineAnimationFrames";
gaf.Tag.DefineAnimationFrames.doParse = function(s){
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
            'effect', s.condition('hasEffect', 1, s.array('Ubyte', gaf.Tag._readFilter(s))),
            'maskObjectIdRef', s.condition('hasMask', 1, s.fields(
                'maskObjectIdRef', 'Uint'
            ))
        ))
    ));
    var result = {'content': exec()};
//    debugger;
    return result;
};

gaf.Tag.DefineNamedParts = Object.create(gaf.Tag.base);
gaf.Tag.DefineNamedParts.tagName = "TagDefineNamedParts";
gaf.Tag.DefineNamedParts.doParse = function(s) {
    var exec = s.array('Uint', s.fields(
        'objectId', 'Uint',
        'tagName', 'String'
    ));
    var result = {'content': exec()};
    debugger;
    return result;
};

gaf.Tag.DefineSequences = Object.create(gaf.Tag.base);
gaf.Tag.DefineSequences.tagName = "TagDefineSequences";
gaf.Tag.DefineSequences.doParse = function(s) {
    var exec = s.array('Uint', s.fields(
        'id', 'String',
        'start', 'Ushort',
        'end', 'Ushort'
    ));
    var result = {'content': exec()};
    debugger;
    return result;
};

gaf.Tag.DefineTextFields = Object.create(gaf.Tag.base);
gaf.Tag.DefineTextFields.tagName = "TagDefineTextFields";
gaf.Tag.DefineTextFields.doParse = function(s) {
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
    var result = {'content': exec()};
    debugger;
    return result;
};

gaf.Tag.DefineAtlas2 = Object.create(gaf.Tag.base);
gaf.Tag.DefineAtlas2.tagName = "TagDefineAtlas2";
gaf.Tag.DefineAtlas2.doParse = function(s) {
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
    var result = {'content': exec()};
//    debugger;
    return result;
};

gaf.Tag.DefineStage = Object.create(gaf.Tag.base);
gaf.Tag.DefineStage.tagName = "TagDefineStage";
gaf.Tag.DefineStage.doParse = function(s) {
    var exec = s.fields(
        'fps', 'Ubyte',
        'color', 'int',
        'width', 'Ushort',
        'height', 'Ushort'
    );
    var result = {'content': exec()};
//    debugger;
    return result;
};

gaf.Tag.DefineAnimationObjects2 = Object.create(gaf.Tag.base);
gaf.Tag.DefineAnimationObjects2.tagName = "TagDefineAnimationObjects2";
gaf.Tag.DefineAnimationObjects2.doParse = function(s) {
    var exec = s.array('Uint', s.fields(
        'objectId', 'Uint',
        'elementAtlasIdRef', 'Uint',
        'type', 'Ushort'
    ));
    var result = {'content': exec()};
//    debugger;
    return result;
};

gaf.Tag.DefineAnimationMasks2 = Object.create(gaf.Tag.base);
gaf.Tag.DefineAnimationMasks2.tagName = "TagDefineAnimationMasks2";
gaf.Tag.DefineAnimationMasks2.doParse  = function(s) {
    var exec = s.array('Uint', s.fields(
        'objectId', 'Uint',
        'elementAtlasIdRef', 'Uint',
        'type', 'Ushort'
    ));
    var result = {'content': exec()};
//    debugger;
    return result;
};

gaf.Tag.DefineAnimationFrames2 = Object.create(gaf.Tag.base);
gaf.Tag.DefineAnimationFrames2.tagName = "TagDefineAnimationFrames2";
gaf.Tag.DefineAnimationFrames2.doParse = function(s) {
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
            'effect', s.condition('hasEffect', 1, s.array('Ubyte', gaf.Tag._readFilter(s))),
            'maskObjectIdRef', s.condition('hasMask', 1, function(){return s.Uint()})
        ))),
        'actions',  s.condition('hasActions', 1, s.array('Uint', s.fields(
            'type', 'Uint',
            'scope', 'String',
            'params', gaf.Tag._readActionArguments(s)
        )))
    ));
    var result = {'content': exec()};
//    debugger;
    return result;
};

gaf.Tag.DefineTimeline = Object.create(gaf.Tag.base);
gaf.Tag.DefineTimeline.tagName = "TagDefineTimeline";
gaf.Tag.DefineTimeline.doParse = function(s) {
    var exec = s.fields(
        'id', 'Uint',
        'animationFrameCount', 'Uint',
        'boundingBox', 'Rect',
        'pivotPoint', 'Point',
        'hasLinkage', 'Boolean',
        'linkageName', s.condition('hasLinkage', 1, function () {
            return s.String();
        })
    );
    var result = {'content': exec()};
//    debugger;
    result.content.tags = gaf.ReadTags(s);
    return result;
};

gaf.Tag._readActionArguments = function(s){
    return function(){
        var size = s.Uint();
        var ret = [];
        s.startNestedBuffer(size);
        while(s.maxOffset() < s.tell()){
            ret.push(s.String());
        }
        s.endNestedBuffer();
        return ret;
    };
};

gaf.Tag._readFilter = function(s){
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
        'blur', s.condition('type', 1, s.fields( // Blur
            'blurX', 'float',
            'blurY', 'float'
        )),
        'glow', s.condition('type', 2, s.fields( // Glow
            'color', 'Uint',
            'blurX', 'float',
            'blurY', 'float',
            'strength', 'float',
            'inner', 'Boolean',
            'knockout', 'Boolean'
        )),
        'colorMatrix', s.condition('type', 6, s.fields( // ColorMatrix
            'rr', 'float', 'gr', 'float', 'br', 'float', 'ar', 'float', 'r', 'float',
            'rg', 'float', 'gg', 'float', 'bg', 'float', 'ag', 'float', 'g', 'float',
            'rb', 'float', 'gb', 'float', 'bb', 'float', 'ab', 'float', 'b', 'float',
            'ra', 'float', 'ga', 'float', 'ba', 'float', 'aa', 'float', 'a', 'float'
        ))
    )
};

gaf.Tags = new gaf.Tag();
