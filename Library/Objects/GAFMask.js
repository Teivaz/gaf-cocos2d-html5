
gaf.Mask = gaf.Object.extend({
    _className: "GAFMask",

    ctor : function(gafMaskProto){
        cc.assert(gafMaskProto,  "Error! Missing mandatory parameter.");
        this._proto = gafMaskProto;

    }

});