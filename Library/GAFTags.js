/**
 * Created by Teivaz on 25.11.2014.
 */

cc.gaf.Tags = {
    /*
    TAG_END : 0,
    TAG_DEFINE_ATLAS : 1,
    TAG_DEFINE_ANIMATION_MASKS : 2,
    TAG_DEFINE_ANIMATION_OBJECTS : 3,
    TAG_DEFINE_ANIMATION_FRAMES : 4,
    TAG_DEFINE_NAMED_PARTS : 5,
    TAG_DEFINE_SEQUENCES : 6,
    TAG_DEFINE_TEXT_FIELDS : 7,
    TAG_DEFINE_ATLAS_2 : 8,
    TAG_DEFINE_STAGE : 9,
    TAG_DEFINE_ANIMATION_OBJECTS2 : 10,
    TAG_DEFINE_ANIMATION_MASKS2 : 11,
    TAG_DEFINE_ANIMATION_FRAMES2 : 12,
    TAG_DEFINE_TIMELINE : 13*/

    read : function(stream){
        var tagId = stream.readU32();
        var tag = this[tagId];
        tag.parse(stream);
    },

    _base : {
        parse : function(stream){
            var size = stream.readU32();
            this.doParse(stream, size);
        },

        doParse : function(stream, size){
            stream.startNestedBuffer(size);
            stream.endNestedBuffer();
        }
    },


    End : {
        prototype : cc.gaf.Tags._base
    },

    DefineAtlas : {
        prototype : cc.gaf.Tags._base,
        doParse : function(stream, size){
            this.scale = stream.readU8();
            this.atlasCount = stream.readU8();
            this.atlases = [];
            for(var atlas = 0; atlas < this.atlasCount; ++atlas){
                this.atlases.push(readAtlas(stream));
            }

        },
        readAtlas : function(stream){
            var atlas = {
                id : stream.readU32(),
                sourceCount : stream.readU8(),
                sources : []
            };
            for(var i = 0; i < atlas.sourceCount; ++i){
                var atlasSource = {
                    source : stream.readString(),
                    csf : stream.readFloat()
                };
                atlas.sources.push(atlasSource);
            }
            return atlas;
        }
    },

    0 : cc.gaf.Tags.End,
    1 : cc.gaf.Tags.DefineAtlas,
    2 : cc.gaf.Tags.DefineAnimationMasks,
    3 : cc.gaf.Tags.DefineAnimationObjects,
    4 : cc.gaf.Tags.DefineAnimationFrames,
    5 : cc.gaf.Tags.DefineNamedParts,
    6 : cc.gaf.Tags.DefineSequences,
    7 : cc.gaf.Tags.DefineTextFields,
    8 : cc.gaf.Tags.DefineAtlas2,
    9 : cc.gaf.Tags.DefineStage,
    10 : cc.gaf.Tags.DefineAnimationObjects2,
    11 : cc.gaf.Tags.DefineAnimationMasks2,
    12 : cc.gaf.Tags.DefineAnimationFrames2,
    13 : cc.gaf.Tags.DefineTimeline
};

