
gaf._TimeLineProto = function(animationFrameCount, boundingBox, pivotPoint, id, linkageName) {
    id = id || gaf.IDNONE;
    linkageName = linkageName || "";
    this.getId = function() {return id};
    this.getLinkageName = function() {return linkageName};
    this.getPivot = function(){return pivotPoint};
    this.getRect = function(){return boundingBox};
    this.getNamedParts = function() {return []};
    this.getSequences = function() {return {}};
    this.getFrames = function(){return []};
    this.getFrames = function(){return []};

    /*
     * Will construct GAFTimeLine
     */
    this._gafConstruct = function(sharedObjects){
        var ret = new gaf.Mask();
        ret.implement(this);
        delete ret._gafConstruct;

        return ret;
    };
};
