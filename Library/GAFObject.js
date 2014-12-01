var gaf = gaf || {};

gaf.CGAffineTransformCocosFormatFromFlashFormat = function(transform){
    var t = {};
    t.a = transform.a;
    t.b = -transform.b;
    t.c = -transform.c;
    t.d = transform.d;
    t.tx = transform.tx;
    t.ty = -transform.ty;
    return t;
};

gaf.GAFObject = cc.Sprite.extend({

    // Private
    _animationStartedNextLoopDelegate : null, // function(GAFObject)
    _animationFinishedPlayDelegate : null,    // function(GAFObject)
    _framePlayedDelegate : null,              // function(GAFObject, frame)
    _sequenceDelegate : null,                 // function(GAFObject, sequenceName)
    _fps : 60,
    _currentSequenceStart : gaf.FIRST_FRAME_INDEX,
    _currentSequenceEnd : gaf.FIRST_FRAME_INDEX,
    _totalFrameCount : 0,
    _isRunning : false,
    _isLooped : false,
    _isReversed : false,
    _timeDelta : 0,
    _asset : null,
    _timelineParentObject : null,
    _container : null,
    _timeline : null,
    _currentFrame : gaf.FIRST_FRAME_INDEX,
    _showingFrame : gaf.FIRST_FRAME_INDEX,
    _lastVisibleInFrame : gaf.FIRST_FRAME_INDEX,
    _objectType : 0,
    _animationsSelectorScheduled : false,
    _parentColorTransforms : [new cc.kmVec4(), new cc.kmVec4()],
    _parentFilters : [],
    _masks : [],
    _displayList : [],

    // Public methods

    /**
     * @method setAnimationStartedNextLoopDelegate
     * @param {function(GAFObject)} delegate
     */
    setAnimationStartedNextLoopDelegate : function (delegate) {
        this._animationStartedNextLoopDelegate = delegate;
    },

    /**
     * @method setAnimationFinishedPlayDelegate
     * @param {function(GAFObject)} delegate
     */
    setAnimationFinishedPlayDelegate : function (delegate) {
        this._animationFinishedPlayDelegate = delegate;
    },

    /**
     * @method setLooped
     * @param {bool} looped
     */
    setLooped : function (looped) {
        this._looped = looped;
        this._displayList.forEach(function(item){
            if(item){
                item.setLooped(looped);
            }
        });
    },

    /**
     * @method getBoundingBoxForCurrentFrame
     * @return {cc.Rect}
     */
    getBoundingBoxForCurrentFrame : function () {
    },

    /**
     * @method setFps
     * @param {uint} fps
     */
    setFps : function (fps) {
        cc.assert(fps !== 0, 'Error! Fps is set to zero.');
        this._fps = fps;
    },

    /**
     * @method getObjectByName
     * @param {String} name - name of the object to find
     * @return {gaf.GAFObject}
     */
    getObjectByName : function (name) {
        var elements = name.split('.');
        var result = null;
        var retId = -1;
        var t = this;
        elements.forEach(function(element){
            var np = t._timeline.getNamedParts();
            if(np.hasOwnProperty(element)){
                retId = np[element];
            }
            else{
                // Sequence is incorrect
                return result;
            }
            result = t._displayList[retId];
            t = result;
        });
        return result;
    },

    /**
     * @method clearSequence
     */
    clearSequence : function () {
        this._currentSequenceStart = gaf.FIRST_FRAME_INDEX;
        this._currentSequenceEnd = this._totalFrameCount;
    },

    /**
     * @method getIsAnimationRunning
     * @return {bool}
     */
    getIsAnimationRunning : function () {
        return this._isRunning;
    },

    /**
     * @method gotoAndStop
     * @param {uint|String} value - label ot frame number
     * @return {bool}
     */
    gotoAndStop : function (value) {
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

    /**
     * @method getStartFrame
     * @param {String} frameLabel
     * @return {uint}
     */
    getStartFrame : function (frameLabel) {
        if (!this._asset) {
            return gaf.IDNONE;
        }
        var seq = this._timeline.getSequence(frameLabel);
        if (seq) {
            return seq.startFrameNo;
        }
        return gaf.IDNONE;
    },

    /**
     * @method setFramePlayedDelegate
     * @param {function(GAFObject, frame)} delegate
     */
    setFramePlayedDelegate : function (delegate) {
        this._framePlayedDelegate = delegate;
    },

    /**
     * @method getCurrentFrameIndex
     * @return {uint}
     */
    getCurrentFrameIndex : function () {
        return this._showingFrame;
    },

    /**
     * @method getTotalFrameCount
     * @return {uint}
     */
    getTotalFrameCount : function () {
        return this._totalFrameCount;
    },

    /**
     * @method start
     */
    start : function () {
        this.schedule(_processAnimations);
        this._animationsSelectorScheduled = true;
        if (!this._isRunning) {
            this._currentFrame = gaf.FIRST_FRAME_INDEX;
            this._setAnimationRunning(true);
        }
    },

    /**
     * @method stop
     */
    stop : function () {
        this.unschedule(_processAnimations);
        this._animationsSelectorScheduled = false;
        if (this._isRunning) {
            this._currentFrame = gaf.FIRST_FRAME_INDEX;
            this._setAnimationRunning(false);
        }
    },

    /**
     * @method init
     * @param {gaf.GAFAsset} gafAsset
     * @param {gaf.GAFTimeline} gafTimeline
     * @return {bool}
     */
    init : function (gafAsset, gafTimeline) {
        cc.assert(gafAsset, "anAssetData data should not be nil");
        cc.assert(gafTimeline, "Timeline data should not be nil");
        if (!gafAsset || !gafTimeline) {
            return false;
        }
        this._asset = gafAsset;
        this._timeline = gafTimeline;
        this._container = new cc.Node();
        this.addChild(this._container);
        this._container.setContentSize(this.getContentSize());
        this._currentSequenceStart = gaf.FIRST_FRAME_INDEX;
        this._currentFrame = gaf.FIRST_FRAME_INDEX;
        this._currentSequenceEnd = gafTimeline.getFramesCount();
        this._totalFrameCount = gafTimeline.getFramesCount();
        this._constructObject();
        return true;
    },

    /**
     * @method isVisibleInCurrentFrame
     * @return {bool}
     */
    isVisibleInCurrentFrame : function () {
        if (this._timelineParentObject &&
            (this._timelineParentObject.getCurrentFrameIndex() + 1 != this._lastVisibleInFrame)) {
            return false;
        }
        else {
            return true;
        }
    },

    /**
     * @method isDone
     * @return {bool}
     */
    isDone : function () {
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

    /**
     * @method playSequence
     * @param {String} name - name of the sequence to play
     * @param {bool} looped - play looped. False by default
     * @param {bool} resume - whether to resume animation if stopped. True by default
     * @return {bool}
     */
    playSequence : function (name, looped, resume) {
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

    /**
     * @method isReversed
     * @return {bool}
     */
    isReversed : function () {
        return this._isReversed;
    },

    /**
     * @method setSequenceDelegate
     * @param {function(GAFObject, sequenceName)} delegate
     */
    setSequenceDelegate : function (delegate) {
        this._sequenceDelegate = delegate;
    },

    /**
     * @method setFrame
     * @param {uint} index
     * @return {bool}
     */
    setFrame : function (index) {
        if (index < this._totalFrameCount) {
            this._showingFrame = index;
            this._currentFrame = index;
            this._processAnimation();
            return true;
        }
        return false;
    },

    /**
     * @method setControlDelegate
     * @param {function} func
     */
    setControlDelegate : function (func) {
    },

    /**
     * @method getEndFrame
     * @param {String} frameLabel
     * @return {uint}
     */
    getEndFrame : function (frameLabel) {
        if (!this._asset) {
            return gaf.IDNONE;
        }
        var seq = this._timeline.getSequence(frameLabel);
        if (seq) {
            return seq.endFrameNo;
        }
        return gaf.IDNONE;
    },

    /**
     * @method pauseAnimation
     */
    pauseAnimation : function () {
        if (this._isRunning) {
            this._setAnimationRunning(false);
        }
    },

    /**
     * @method gotoAndPlay
     * @param {uint|String} value - label ot frame number
     * @return {bool}
     */
    gotoAndPlay : function (value) {
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

    /**
     * @method isLooped
     * @return {bool}
     */
    isLooped : function () {
        return this._isLooped;
    },

    /**
     * @method resumeAnimation
     */
    resumeAnimation : function () {
        if (!this._isRunning) {
            this._setAnimationRunning(true);
        }
    },

    /**
     * @method setReversed
     * @param {bool} reversed
     */
    setReversed : function (reversed) {
        this._isReversed = reversed;
        this._displayList.forEach(function(obj){
            if(obj){
                obj.setReversed(reversed);
            }
        });
    },

    /**
     * @method hasSequences
     * @return {bool}
     */
    hasSequences : function () {
        return !this._timeline.getAnimationSequences().empty();
    },

    /**
     * @method getFps
     * @return {uint}
     */
    getFps : function () {
        return this._fps;
    },

    /**
     * @method create
     * @param {gaf.GAFAsset} gafAsset
     * @param {gaf.GAFTimeline} gafTimeline
     * @return {gaf.GAFObject}
     */
    create : function (gafAsset, gafTimeline) {
        var ret = new gaf.GAFAsset();
        if (ret.init(gafAsset, gafTimeline)) {
            return ret;
        }
        ret = null;
        return null;
    },

    // Private methods
    _setAnimationRunning : function (value) {
        this._isRunning = value;
        this._displayList.forEach(function(obj){
            if (obj) {
                obj._setAnimationRunning(value);
            }
        });
    },

    _processAnimations : function (dt) {
        this._timeDelta += dt;
        var frameTime = 1.0 / this._fps;
        while (this._timeDelta >= frameTime) {
            this._timeDelta -= frameTime;
            this._step();
            if (this._framePlayedDelegate) {
                this._framePlayedDelegate(this, this._currentFrame);
            }
        }
    },

    _constructObject : function () {
        var size = this._asset.getHeader().frameSize;
        this.setContentSize(new cc.Size(size.width + size.x * 2, size.height + size.y * 2));
        this._displayList = null;
        this._fps = this._asset.getSceneFps();
        this._animationsSelectorScheduled = false;
        this._instantiateObject(this._timeline.getAnimationObjects(), this._timeline.getAnimationMasks());

    },

    _instantiateObject : function (animationObjects, animationMasks) {

    },

    _step : function () {
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
    },

    _realizeFrame : function(out, frameIndex){
        var t = this;
        var animationFrames = this._timeline.getAnimationFrames();
        if (this._parentColorTransforms[0].w < cc.FLT_EPSILON){
            return;
        }

        if (animationFrames.size() > frameIndex){
            var currentFrame = animationFrames[frameIndex];
            var states = currentFrame.getObjectStates();

            states.forEach(function(state){
                var subObject = this._displayList[state.objectIdRef];

                cc.assert(subObject, "Error. SubObject with current ID not found");
                if (!subObject)
                    return;

                if (!state.isVisible())
                    return;

                if (subObject._isTimeline())
                {
                    var stateTransform = state.affineTransform;
                    var csf = t._timeline.usedAtlasContentScaleFactor();
                    stateTransform.tx *= csf;
                    stateTransform.ty *= csf;
                    var t = gaf.CGAffineTransformCocosFormatFromFlashFormat(state.affineTransform);
                    subObject.setAdditionalTransform(t);
                    subObject._parentFilters = [];
                    var filters = state.getFilters();
                    subObject._parentFilters.insert(subObject._parentFilters.end(), filters.begin(), filters.end());

                    var cm = state.colorMults();
                    subObject._parentColorTransforms[0] = new cc.kmVec4(
                    t._parentColorTransforms[0].x * cm[0],
                    t._parentColorTransforms[0].y * cm[1],
                    t._parentColorTransforms[0].z * cm[2],
                    t._parentColorTransforms[0].w * cm[3]);
                    cc.kmVec4Add(subObject._parentColorTransforms[1], t._parentColorTransforms[1], state.colorOffsets());

                    if (this._masks[state.objectIdRef]){
                        t._rearrangeSubobject(out, t._masks[state.objectIdRef], state.zIndex, frameIndex, 1);
                    }
                    else{
                        if (state.maskObjectIdRef == gaf.IDNONE){
                            t._rearrangeSubobject(out, subObject, state.zIndex, frameIndex, 1);
                        }
                        else{
                            // If the state has a mask, then attach it
                            // to the clipping node. Clipping node will be attached on its state
                            var mask = t._masks[state.maskObjectIdRef];
                            cc.assert(mask, "Error. No mask found for this ID");
                            if (mask)
                                t._rearrangeSubobject(mask, subObject, state.zIndex, frameIndex, 1);
                        }
                    }

                    subObject.step();

                }
                else if (subObject._isTexture()){
                    var prevAP = subObject.getAnchorPoint();
                    var  prevCS = subObject.getContentSize();
                    if (subObject._isMask()){
                        // Validate sprite type (w/ or w/o filter)
                        filters = state.getFilters();
                        var filter = null;
                        /*
                         var mc = static_cast<GAFMovieClip*>(subObject);
                         Filters_t filtersUnion;
                         filtersUnion.insert(filtersUnion.end(), this._parentFilters.begin(), this._parentFilters.end());
                         filtersUnion.insert(filtersUnion.end(), filters.begin(), filters.end());

                         if (!filtersUnion.empty()){
                             filter = filtersUnion[0];
                             filter.apply(mc);
                         }
                         */
                        /*
                        if (t._parentFilters.length > 0){
                            filter = *t._parentFilters.begin();
                        }
                        else if (filters.length > 0){
                            filter = *filters.begin();
                        }
                        if (filter){
                            filter.apply(mc);
                        }
                        if (!filter || filter.getType() != GAFFilterType : :GFT_Blur){
                            mc.setBlurFilterData(nullptr);
                        }
                        if (!filter || filter.getType() != GAFFilterType : :GFT_ColorMatrix){
                            mc.setColorMarixFilterData(nullptr);
                        }
                        if (!filter || filter.getType() != GAFFilterType : :GFT_Glow){
                            mc.setGlowFilterData(nullptr);
                        }
                        if (!filter || filter.getType() != GAFFilterType : :GFT_DropShadow){
                            GAFDropShadowFilterData : :reset(mc);
                        }*/
                    }
                    var newCS = subObject.getContentSize();
                    var newAP = new cc.kmVec2(
                        ((prevAP.x - 0.5) * prevCS.width) / newCS.width + 0.5,
                        ((prevAP.y - 0.5) * prevCS.height) / newCS.height + 0.5);
                    subObject.setAnchorPoint(newAP);
                    if (t._masks[state.objectIdRef])
                    {
                        rearrangeSubobject(out, t._masks[state.objectIdRef], state.zIndex, frameIndex, 1);
                    }
                    else
                    {
                        //subObject.removeFromParentAndCleanup(false);
                        if (state.maskObjectIdRef == IDNONE)
                        {
                            rearrangeSubobject(out, subObject, state.zIndex, frameIndex, 1);
                        }
                        else
                        {
                            // If the state has a mask, then attach it
                            // to the clipping node. Clipping node will be attached on its state
                            mask = this._masks[state.maskObjectIdRef];
                            cc.assert(mask, "Error. No mask found for this ID");
                            if (mask)
                                t._rearrangeSubobject(mask, subObject, state.zIndex, frameIndex, 1);
                        }
                    }

                    stateTransform = state.affineTransform;
                    csf = t._timeline.usedAtlasContentScaleFactor();
                    stateTransform.tx *= csf;
                    stateTransform.ty *= csf;
                    var transform = gaf.CGAffineTransformCocosFormatFromFlashFormat(state.affineTransform);
                    subObject.setExternalTransform(transform);

                    if (!subObject._isMask())
                    {
                        var colorMults = [
                            state.colorMults()[0] * t._parentColorTransforms[0].x,
                            state.colorMults()[1] * t._parentColorTransforms[0].y,
                            state.colorMults()[2] * t._parentColorTransforms[0].z,
                            state.colorMults()[3] * t._parentColorTransforms[0].w
                        ];
                        var colorOffsets = [
                            state.colorOffsets()[0] + t._parentColorTransforms[1].x,
                            state.colorOffsets()[1] + t._parentColorTransforms[1].y,
                            state.colorOffsets()[2] + t._parentColorTransforms[1].z,
                            state.colorOffsets()[3] + t._parentColorTransforms[1].w
                        ];

                        subObject.setColorTransform(colorMults, colorOffsets);
                    }
                }
            else if (subObject._isTextField())
                {
                    t._rearrangeSubobject(out, subObject, state.zIndex, frameIndex, 1);
                }

            });

            var timelineActions = currentFrame.getTimelineActions();
            timelineActions.forEach(function(action){
                switch (action.getType())
                {
                    case gaf.ACTION_STOP :
                        t.pauseAnimation();
                        break;
                    case gaf.ACTION_PLAY :
                        t.resumeAnimation();
                        break;
                    case gaf.ACTION_GO_TO_AND_STOP :
                        t.gotoAndStop(action.getParam(gaf.PI_FRAME));
                        break;
                    case gaf.ACTION_GO_TO_AND_PLAY :
                        t.gotoAndPlay(action.getParam(gaf.PI_FRAME));
                        break;
                    case gaf.ACTION_DISPATCH_EVENT :
                        t._eventDispatcher.dispatchCustomEvent(action.getParam(gaf.PI_EVENT_TYPE), action);
                        break;
                    default :
                        break;
                }
            });
        }
    },

    _isTimeline : function(){
        return false;
    },

    _isTexture : function(){
        return false;
    },

    _isTextField : function(){
        return false;
    },

    _isMask : function(){
        return false;
    }

});
