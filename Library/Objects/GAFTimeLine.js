
gaf.TimeLine = gaf.Object.extend({
    _className : "GAFTimeLine",
    _container : null,
    _animationStartedNextLoopDelegate : null,
    _animationFinishedPlayDelegate : null,
    _framePlayedDelegate : null,
    _sequenceDelegate : null,
    _fps : 60,
    _currentSequenceStart : gaf.FIRST_FRAME_INDEX,
    _currentSequenceEnd : gaf.FIRST_FRAME_INDEX,
    _isRunning : false,
    _isLooped: false,
    _isReversed: false,
    _timeDelta: 0,
    _animationsSelectorScheduled: false,
    _currentFrame: gaf.FIRST_FRAME_INDEX,
    _timeLines: [],


    ctor : function(gafTimeLineProto){
        this._super();
        cc.assert(gafTimeLineProto,  "Error! Missing mandatory parameter.");
        this._gafproto = gafTimeLineProto;
        this._init();
        this._fps = gafTimeLineProto.getFps();

        this._container = new cc.Node();
        this.addChild(this._container);
/*
        var anchor = {
            x: (0 - (0 - (this._gafproto.getPivot().x / this._gafproto.getBoundingBox().width))),
            y: (0 + (1 - (this._gafproto.getPivot().y / this._gafproto.getBoundingBox().height)))
        };
        this._container.setContentSize(this._gafproto.getBoundingBox().width, this._gafproto.getBoundingBox().height);
        this._container.setAnchorPoint(anchor);
        this._container.setPosition(-this._gafproto.getBoundingBox().x, this._gafproto.getBoundingBox().height + this._gafproto.getBoundingBox().y);

        var c = this._container._renderCmd;
        var v = c.visit;
        c.visit = function(parentCmd){
            v.apply(c, parentCmd);
        };*/
    },

    setAnimationStartedNextLoopDelegate : function (delegate) {
        this._animationStartedNextLoopDelegate = delegate;
    },
    setAnimationFinishedPlayDelegate : function (delegate) {
        this._animationFinishedPlayDelegate = delegate;
    },
    setLooped : function (looped) {
        this._isLooped = looped;
    },
    getBoundingBoxForCurrentFrame : function () {
        debugger;
        return cc.rect();
    },
    setFps : function (fps) {
        cc.assert(fps !== 0, 'Error! Fps is set to zero.');
        this._fps = fps;
    },
    getObjectByName: function (name) {
        debugger;
        var elements = name.split('.');
        var result = null;
        var retId = -1;
        var timeLine = this;
        var objects = this._getSharedObjects();
        try{
        elements.forEach(function(element){
            var parts = timeLine._gafproto.getNamedParts();
            if(parts.hasOwnProperty(element)){
                retId = parts[element];
            }
            else{
                // Sequence is incorrect
                throw new Error("NamedPartsSequenceError");
            }
            result = objects[retId];
            timeLine = result;
        });}
        catch (e){
            if(typeof e !== "Error" || e.getText() !== "NamedPartsSequenceError")
                throw e;
        }
        return result;
    },
    clearSequence : function () {
        this._currentSequenceStart = gaf.FIRST_FRAME_INDEX;
        this._currentSequenceEnd = this._gafproto.getTotalFrames();
    },
    getIsAnimationRunning: function () {
        return this._isRunning;
    },
    gotoAndStop: function (value) {
        var frame = 0;
        if (typeof value === 'string') {
            frame = this.getStartFrame(value);
        }
        else {
            frame = value;
        }
        if (this.setFrame(frame)) {
            this._setAnimationRunning(false);
            return true;
        }
        return false;
    },
    gotoAndPlay: function (value) {
        var frame = 0;
        if (typeof value === 'String') {
            frame = this.getStartFrame(value);
        }
        else {
            frame = value;
        }
        if (this.setFrame(frame)) {
            this._setAnimationRunning(true);
            return true;
        }
        return false;
    },
    getStartFrame : function (frameLabel) {
        if (!this._asset) {
            return gaf.IDNONE;
        }
        var seq = this._gafproto.getSequences()[frameLabel];
        if (seq) {
            return seq.start;
        }
        return gaf.IDNONE;
    },
    getEndFrame: function (frameLabel) {
        if (!this._asset) {
            return gaf.IDNONE;
        }
        var seq = this._gafproto.getSequences()[frameLabel];
        if (seq) {
            return seq.end;
        }
        return gaf.IDNONE;
    },
    setFramePlayedDelegate : function (delegate) {
        this._framePlayedDelegate = delegate;
    },
    getCurrentFrameIndex: function () {
        return this._showingFrame;
    },
    getTotalFrameCount: function () {
        return this._gafproto.getTotalFrames();
    },
    start: function () {
        this._running = true;
        this.schedule("_processAnimations");
        this._animationsSelectorScheduled = true;
        if (!this._isRunning) {
            this._currentFrame = gaf.FIRST_FRAME_INDEX;
            this._setAnimationRunning(true);
            this._timeLines.forEach(function(item){
                item._setAnimationRunning(true);
                item.setLooped(true);
            });
        }
    },

    stop: function () {
        this.unschedule("_processAnimations");
        this._animationsSelectorScheduled = false;
        if (this._isRunning) {
            this._currentFrame = gaf.FIRST_FRAME_INDEX;
            this._setAnimationRunning(false);
        }
    },
    isVisibleInCurrentFrame: function () {
        if (this._timelineParentObject &&
            (this._timelineParentObject.getCurrentFrameIndex() + 1 !== this._lastVisibleInFrame)) {
            return false;
        }
        else {
            return true;
        }
    },
    isDone: function () {
        if (this._isLooped) {
            return false;
        }
        else {
            if (!this._isReversed) {
                return this._currentFrame > this._totalFrameCount;
            }
            else {
                return this._currentFrame < gaf.FIRST_FRAME_INDEX - 1;
            }
        }
    },
    playSequence: function (name, looped, resume) {
        looped = looped || false;
        resume = resume || true;
        if (!this._asset || !this._timeline) {
            return false;
        }
        var s = this.getStartFrame(name);
        var e = this.getEndFrame(name);
        if (gaf.IDNONE === s || gaf.IDNONE === e) {
            return false;
        }
        this._currentSequenceStart = s;
        this._currentSequenceEnd = e;
        if (this._currentFrame < this._currentSequenceStart || this._currentFrame > this._currentSequenceEnd) {
            this._currentFrame = this._currentSequenceStart;
        }
        else {
            this._currentFrame = this._currentSequenceStart;
        }
        this.setLooped(looped);
        if (resume) {
            this.resumeAnimation();
        }
        else {
            this.stop();
        }
        return true;
    },
    isReversed: function () {
        return this._isReversed;
    },
    setSequenceDelegate: function (delegate) {
        this._sequenceDelegate = delegate;
    },
    setFrame: function (index) {
        if (index < this._totalFrameCount) {
            this._showingFrame = index;
            this._currentFrame = index;
            this._processAnimation();
            return true;
        }
        return false;
    },
    setControlDelegate: function (func) {
        debugger;
    },
    pauseAnimation: function () {
        if (this._isRunning) {
            this._setAnimationRunning(false);
        }
    },
    isLooped: function () {
        return this._isLooped;
    },
    resumeAnimation: function () {
        if (!this._isRunning) {
            this._setAnimationRunning(true);
        }
    },
    setReversed: function (reversed) {
        this._isReversed = reversed;
    },
    hasSequences: function () {
        return this._gafproto.getSequences().length > 0;
    },
    getFps: function () {
        return this._fps;
    },




    // Private

    setExternalTransform: function(affineTransform){
        if(!cc.affineTransformEqualToTransform(this._additionalTransform, affineTransform)){
            this._container.setAdditionalTransform(affineTransform);
        }
    },

    _applyState: function(s, p){
        this._super(s, p);
    },

    _init : function(){
        this._currentSequenceEnd = this._gafproto.getTotalFrames() + 1;
    },

    _processAnimations : function (dt) {
        this._timeDelta += dt;
        var frameTime = 1 / this._fps;
        while (this._timeDelta >= frameTime) {
            this._timeDelta -= frameTime;

            this._step();
        }
    },
    _step: function () {
        cc.log("time line "+ this._gafproto.getId() + " stepping frame " + (this._currentFrame + 1) + "" );
        this._showingFrame = this._currentFrame;
        if (!this._isReversed) {
            if (this._currentFrame < this._currentSequenceStart) {
                this._currentFrame = this._currentSequenceStart;
            }
            if (this._sequenceDelegate && this._timeline) {
                var seq = this._timeline.getSequenceByLastFrame(this._currentFrame);
                if (seq) {
                    this._sequenceDelegate(this, seq.name);
                }
            }
            if (this._currentFrame >= this._currentSequenceEnd - 1) {
                if (this._isLooped) {
                    this._currentFrame = this._currentSequenceStart;
                    if (this._animationStartedNextLoopDelegate) {
                        this._animationStartedNextLoopDelegate(this);
                    }
                }
                else {
                    this._setAnimationRunning(false);
                    if (this._animationFinishedPlayDelegate) {
                        this._animationFinishedPlayDelegate(this);
                    }
                }
            }
            this._processAnimation();
                if (this.getIsAnimationRunning()) {
                this._showingFrame = this._currentFrame++;
            }
        }
        else {
            // If switched to reverse after final frame played
            if (this._currentFrame >= this._currentSequenceEnd) {
                this._currentFrame = this._currentSequenceEnd - 1;
            }
            if (this._sequenceDelegate && this._timeline) {
                var seq = this._timeline.getSequenceByFirstFrame(this._currentFrame + 1);
                if (seq) {
                    this._sequenceDelegate(this, seq.name);
                }
            }
            if (this._currentFrame < this._currentSequenceStart) {
                if (this._isLooped) {
                    this._currentFrame = this._currentSequenceEnd - 1;
                    if (this._animationStartedNextLoopDelegate) {
                        this._animationStartedNextLoopDelegate(this);
                    }
                }
                else {
                    this._setAnimationRunning(false);
                    if (this._animationFinishedPlayDelegate) {
                        this._animationFinishedPlayDelegate(this);
                    }
                    return;
                }
            }
            this._processAnimation();
            if (this.getIsAnimationRunning()) {
                this._showingFrame = this._currentFrame--;
            }
        }
    },
    _processAnimation : function () {
        this._realizeFrame(this._container, this._currentFrame);
        if (this._framePlayedDelegate) {
            this._framePlayedDelegate(this, this._currentFrame);
        }
    },
    _realizeFrame : function(out, frameIndex) {
        var self = this;
        var objects = self._getSharedObjects();
        var frames = self._gafproto.getFrames();
        if(frameIndex > frames.length) {
            return;
        }
        var currentFrame = frames[frameIndex];
        if(!currentFrame){
            return;
        }
        var states = currentFrame.states;
        states.forEach(function(state){
            var object = objects[state.objectIdRef];
            if(!object){
                return;
            }
            object._updateVisibility(state, self);
            if(!object.isVisible()){
                return;
            }
            object._applyState(state, self);
            var parent = out;
            if(state.hasMask){
                parent = objects[state.maskObjectIdRef]._getNode();
                cc.assert(parent, "Error! Mask not found.");
            }
            object._lastVisibleInFrame = 1 + frameIndex;
            gaf.TimeLine.rearrangeSubobject(parent, object, state.depth);
            if(object._step){
                object._step();
            }
        });


    },

    _setAnimationRunning: function (value) {
        this._isRunning = value;
        if(arguments.length > 1 && arguments[1] === false)
            return; // Don't call recursively
        this._getSharedObjects().forEach(function(obj){
            if (obj && obj.hasOwnProperty("_setAnimationRunning")) {
                obj._setAnimationRunning(value, false);
            }
        });
    },

    _getSharedObjects : function(){return[]}


});

gaf.TimeLine.rearrangeSubobject = function(out, object, depth){
    var parent = object.getParent();
    if (parent !== out)
    {
        object.removeFromParent(false);
        out.addChild(object, depth);
    }
    else
    {
        object.setLocalZOrder(depth);
    }
};
