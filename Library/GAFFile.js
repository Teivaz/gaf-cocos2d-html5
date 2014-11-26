/**
 * Created by Teivaz on 27.11.2014.
 */

cc.gaf.File = cc.Class.extend({
    header : null,
    tags : null,

    ctor : function(header, tags){
        this.header = header;
        this.tags = tags;
    }
});
