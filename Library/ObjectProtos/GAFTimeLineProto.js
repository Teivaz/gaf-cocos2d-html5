
gaf._TimeLineProto = function(animationFrameCount, boundingBox, pivotPoint, id, linkageName) {
    id = typeof id != 'undefined' ? id : gaf.IDNONE;
    linkageName = linkageName || "";
    this.getTotalFrames = function(){return animationFrameCount};
    this.getBoundingBox = function() {return boundingBox};
    this.getId = function() {return id};
    this.getLinkageName = function() {return linkageName};
    this.getPivot = function(){return pivotPoint};
    this.getRect = function(){return boundingBox};
    this.getNamedParts = function() {return {}}; // Map name -> id
    this.getSequences = function() {return {}}; // Map name -> {start, end}
    this.getFrames = function(){return []}; // Array {states, actions}
    this.getFps = function(){return 60};

    /*
     * Will construct GAFTimeLine
     */
    this._gafConstruct = function(sharedObjects){
        var ret = new gaf.TimeLine(this);
        ret.getSharedObjects = function(){return sharedObjects};

        return ret;
    };
};
