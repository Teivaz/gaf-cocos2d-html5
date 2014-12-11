
gaf.GAFTimeLine = gaf.GAFObject.extend({
    _tag : null,
    _className : "GAFTimeLine",
    _container : null,

    ctor : function(){
        this._container = new cc.Node();
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
