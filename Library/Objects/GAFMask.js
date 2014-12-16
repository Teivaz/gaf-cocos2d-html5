
gaf.Mask = gaf.Object.extend({
    _className: "GAFMask",

    ctor : function(gafMaskProto){
        this._super();
        cc.assert(gafMaskProto,  "Error! Missing mandatory parameter.");
        this._proto = gafMaskProto;

    }

});