/**
 * Created by Teivaz on 25.11.2014.
 */



cc.gaf.LoadTag = function(stream, header){
    var tagId = stream.readU16();
    var tag = cc.gaf.Tags[tagId];
    var result = {};
    if(typeof tag === "undefined"){
        cc.log("GAF. Non implemented tag detected.");
        cc.gaf.Tags.default.parse(stream, tagId, header);
    }
    else{
        result = tag.parse(stream, tagId, header);
    }
    return result;
};


cc.gaf.Tag = cc.Class.extend({
    ctor : function(){
        this.default = new cc.gaf.Tag._base();
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

cc.gaf.Tag._base = cc.Class.extend({
    name : "undefined",
    header : null,
    parse : function(stream, tagId, header){
        this.header = header;
        var size = stream.readU32();
        var result = this.doParse(stream, size);
        result.tagName = this.name;
        result.tagId = tagId;
        return result;
    },
    doParse : function(stream, size){
        stream.seek(stream.tell() + size);
        return {};
    }
});

cc.gaf.Tag.End = cc.gaf.Tag._base.extend({
    name : "TagEnd"
});

cc.gaf.Tag.DefineAtlas = cc.gaf.Tag._base.extend({
    name : "TagDefineAtlas",
    doParse : function(stream, size){
        var result = {};
        result.scale = stream.readFloat();
        result.atlasCount = stream.readU8();
        result.atlases = [];
        for(var atlas = 0; atlas < result.atlasCount; ++atlas){
            result.atlases.push(this.readAtlas(stream));
        }
        return result;
    },
    readAtlas : function(stream){
        var atlas = {};
        atlas.id = stream.readU32();
        atlas.sourceCount = stream.readU8();
        atlas.sources = [];
        for(var i = 0; i < atlas.sourceCount; ++i){
            var atlasSource = {};
            atlasSource.source = stream.readString();
            atlasSource.csf = stream.readFloat();
            atlas.sources.push(atlasSource);
        }
        return atlas;
    }
});
cc.gaf.Tag.DefineAnimationMasks = cc.gaf.Tag._base.extend({
    name : "TagDefineAnimationMasks"

});
cc.gaf.Tag.DefineAnimationObjects = cc.gaf.Tag._base.extend({
    name : "TagDefineAnimationObjects"

});
cc.gaf.Tag.DefineAnimationFrames = cc.gaf.Tag._base.extend({
    name : "TagDefineAnimationFrames"

});
cc.gaf.Tag.DefineNamedParts = cc.gaf.Tag._base.extend({
    name : "TagDefineNamedParts"

});
cc.gaf.Tag.DefineSequences = cc.gaf.Tag._base.extend({
    name : "TagDefineSequences"

});
cc.gaf.Tag.DefineTextFields = cc.gaf.Tag._base.extend({
    name : "TagDefineTextFields"

});
cc.gaf.Tag.DefineAtlas2 = cc.gaf.Tag._base.extend({
    name : "TagDefineAtlas2"

});
cc.gaf.Tag.DefineStage = cc.gaf.Tag._base.extend({
    name : "TagDefineStage"

});
cc.gaf.Tag.DefineAnimationObjects2 = cc.gaf.Tag._base.extend({
    name : "TagDefineAnimationObjects2"

});
cc.gaf.Tag.DefineAnimationMasks2 = cc.gaf.Tag._base.extend({
    name : "TagDefineAnimationMasks2"

});
cc.gaf.Tag.DefineAnimationFrames2 = cc.gaf.Tag._base.extend({
    name : "TagDefineAnimationFrames2"

});
cc.gaf.Tag.DefineTimeline = cc.gaf.Tag._base.extend({
    name : "TagDefineTimeline"

});

cc.gaf.Tags = new cc.gaf.Tag();