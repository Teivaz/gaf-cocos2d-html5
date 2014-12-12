
gaf.GAFTimeLineData = gaf.Object.extend({
    _tag : null,
    _className : "GAFTimeLineData",
    _objects : {},

    ctor : function(){
    },

    getLinkageName : function() {
        return this._tag.linkageName;
    },

    getPivot : function(){
        return this._tag.pivotPoint;
    },

    getRect : function(){
        return this._tag.boundingBox;
    }

});
