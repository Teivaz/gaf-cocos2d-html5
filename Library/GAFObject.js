var gaf = gaf || {};

gaf.GAFObject = cc.Sprite.extend({

    // Private
    _animationStartedNextLoopDelegate : null, // function(GAFObject)
    _animationFinishedPlayDelegate : null,    // function(GAFObject)
    _framePlayedDelegate : null,              // function(GAFObject, frame)
    _sequenceDelegate : null,                 // function(GAFObject, sequenceName)
    _displayList : [],
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

    // Public methods

    /**
     * @method setAnimationStartedNextLoopDelegate
     * @param {function(GAFObject)} delegate
     */
    setAnimationStartedNextLoopDelegate : function (delegate){
        this._animationStartedNextLoopDelegate = delegate;
    },

    /**
     * @method setAnimationFinishedPlayDelegate
     * @param {function(GAFObject)} delegate
     */
    setAnimationFinishedPlayDelegate : function (delegate){
        this._animationFinishedPlayDelegate = delegate;
    },

    /**
     * @method setLooped
     * @param {bool} looped
     */
    setLooped : function (looped){
        this._looped = looped;
        for(var item in this._displayList){
            if(item){
                item.setLooped(looped);
            }
        }
    },

    /**
     * @method getBoundingBoxForCurrentFrame
     * @return {cc.Rect}
     */
    getBoundingBoxForCurrentFrame : function (){
    },

    /**
     * @method setFps
     * @param {uint} fps
     */
    setFps : function (fps){
        cc.assert(fps !== 0, 'Error! Fps is set to zero.');
        this._fps = fps;
    },

    /**
    * @method getObjectByName
    * @param {String} name - name of the object to find
    * @return {gaf.GAFObject}
    */
    getObjectByName : function(name){
        debugger;
    },

    /**
     * @method clearSequence
     */
    clearSequence : function (){
        this._currentSequenceStart = gaf.FIRST_FRAME_INDEX;
        this._currentSequenceEnd = this._totalFrameCount;
    },

    /**
     * @method getIsAnimationRunning
     * @return {bool}
     */
    getIsAnimationRunning : function ()
    {
        return this._isRunning;
    },

    /**
    * @method gotoAndStop
    * @param {uint|String} value - label ot frame number
    * @return {bool}
    */
    gotoAndStop : function(value){
        var frame = 0;
        if(typeof value === 'String') {
            frame = this.getStartFrame(value);
        }
        else {
            frame = value;
        }
        if (this.setFrame(frame)){
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
    getStartFrame : function (frameLabel){
        if(!this._asset) {
            return gaf.IDNONE;
        }
        var seq = this._timeline.getSequence(frameLabel);
        if(seq){
            return seq.startFrameNo;
        }
        return gaf.IDNONE;
    },

    /**
     * @method setFramePlayedDelegate
     * @param {function(GAFObject, frame)} delegate
     */
    setFramePlayedDelegate : function (delegate){
        this._framePlayedDelegate = delegate;
    },

    /**
     * @method getCurrentFrameIndex
     * @return {uint}
     */
    getCurrentFrameIndex : function ()
    {
        return this._showingFrame;
    },

    /**
     * @method getTotalFrameCount
     * @return {uint}
     */
    getTotalFrameCount : function ()
    {
        return this._totalFrameCount;
    },

    /**
     * @method start
     */
    start : function ()
    {
        this.schedule(_processAnimations);
        this._animationsSelectorScheduled = true;
        if(!this._isRunning){
            this._currentFrame = gaf.FIRST_FRAME_INDEX;
            this._setAnimationRunning(true);
        }
    },

    /**
     * @method stop
     */
    stop : function ()
    {
        this.unschedule(_processAnimations);
        this._animationsSelectorScheduled = false;
        if(this._isRunning){
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
    init : function (gafAsset, gafTimeline){
        cc.assert(gafAsset, "anAssetData data should not be nil");
        cc.assert(gafTimeline, "Timeline data should not be nil");
        if (!gafAsset || !gafTimeline){
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
    isVisibleInCurrentFrame : function (){
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
    isDone : function ()
    {
        if (this._isLooped){
            return false;
        }
        else{
            if (!this._isReversed){
                return this._currentFrame > this._totalFrameCount;
            }
            else{
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
    playSequence : function (name, looped, resume){
        var looped = looped || false;
        var resume = resume || true;
        if (!this._asset || !this._timeline){
            return false;
        }
        var s = this.getStartFrame(name);
        var e = this.getEndFrame(name);
        if (gaf.IDNONE === s || gaf.IDNONE === e){
            return false;
        }
        this._currentSequenceStart = s;
        this._currentSequenceEnd = e;
        if (this._currentFrame < this._currentSequenceStart || this._currentFrame > this._currentSequenceEnd){
            this._currentFrame = this._currentSequenceStart;
        }
        else{
            this._currentFrame = this._currentSequenceStart;
        }
        this.setLooped(looped);
        if (resume){
            this.resumeAnimation();
        }
        else{
            this.stop();
        }
        return true;
    },

    /**
     * @method isReversed
     * @return {bool}
     */
    isReversed : function ()
    {
        return false;
    },

    /**
     * @method setSequenceDelegate
     * @param {function} arg0
     */
    setSequenceDelegate : function (func ){
    },

    /**
     * @method setFrame
     * @param {unsigned int} arg0
     * @return {bool}
     */
    setFrame : function (int ){
        return false;
    },

    /**
     * @method setControlDelegate
     * @param {function} arg0
     */
    setControlDelegate : function (func ){
    },

    /**
     * @method getEndFrame
     * @param {String} arg0
     * @return {unsigned int}
     */
    getEndFrame : function (str ){
        return 0;
    },

    /**
     * @method pauseAnimation
     */
    pauseAnimation : function ()
    {
    },

    /**
     * @method gotoAndPlay
    * @param {unsigned int|String} int
    * @return {bool|bool}
    */
    gotoAndPlay : function(str ){
        return false;
    },

    /**
     * @method isLooped
     * @return {bool}
     */
    isLooped : function ()
    {
        return false;
    },

    /**
     * @method resumeAnimation
     */
    resumeAnimation : function ()
    {
    },

    /**
     * @method setReversed
     * @param {bool} arg0
     */
    setReversed : function (bool ){
    },

    /**
     * @method hasSequences
     * @return {bool}
     */
    hasSequences : function ()
    {
        return false;
    },

    /**
     * @method getFps
     * @return {unsigned int}
     */
    getFps : function ()
    {
        return 0;
    },

    /**
     * @method create
     * @param {gaf::GAFAsset} arg0
     * @param {gaf::GAFTimeline} arg1
     * @return {gaf::GAFObject}
     */
    create : function (gafasset,
    gaftimeline ){
        return gaf::GAFObject;
    },


    // Private methods
    _setAnimationRunning : function(value){
        this._isRunning = value;
        for (var obj in this._displayList){
            if (obj) {
                obj._setAnimationRunning(value);
            }
        }
    },

    _processAnimations : function(dt){
        this._timeDelta += dt;
        var frameTime = 1.0 / this._fps;
        while (this._timeDelta >= frameTime){
            this._timeDelta -= frameTime;
            this._step();
            if (this._framePlayedDelegate){
                this._framePlayedDelegate(this, this._currentFrame);
            }
        }
    },

    _constructObject : function(){
        var size = this._asset.getHeader().frameSize;
        this.setContentSize(new cc.Size(size.width + size.x * 2, size.height + size.y * 2));
        this._displayList = null;
        this._fps = this._asset.getSceneFps();
        this._animationsSelectorScheduled = false;
        this._instantiateObject(this._timeline.getAnimationObjects(), this._timeline.getAnimationMasks());

    },

    _instantiateObject : function(animationObjects, animationMasks){

    },

    _step : function(){
        this._showingFrame = this._currentFrame;
        if (!this._isReversed){
            if (this._currentFrame < this._currentSequenceStart){
                this._currentFrame = this._currentSequenceStart;
            }
            if (this._sequenceDelegate && this._timeline)
            {
                var seq = this._timeline.getSequenceByLastFrame(this._currentFrame);
                if (seq){
                    this._sequenceDelegate(this, seq.name);
                }
            }
            if (this._currentFrame >= this._currentSequenceEnd - 1){
                if (this._isLooped){
                    this._currentFrame = this._currentSequenceStart;
                    if (this._animationStartedNextLoopDelegate){
                        this._animationStartedNextLoopDelegate(this);
                    }
                }
                else{
                    this._setAnimationRunning(false);
                    if (this._animationFinishedPlayDelegate){
                        this._animationFinishedPlayDelegate(this);
                    }
                }
            }
            this._processAnimation();
            if (this.getIsAnimationRunning()){
                this._showingFrame = this._currentFrame++;
            }
        }
        else{
            // If switched to reverse after final frame played
            if (this._currentFrame >= this._currentSequenceEnd){
                this._currentFrame = this._currentSequenceEnd - 1;
            }
            if (this._sequenceDelegate && this._timeline){
                var seq = this._timeline.getSequenceByFirstFrame(this._currentFrame + 1);
                if (seq){
                    this._sequenceDelegate(this, seq.name);
                }
            }
            if (this._currentFrame < this._currentSequenceStart){
                if (this._isLooped){
                    this._currentFrame = this._currentSequenceEnd - 1;
                    if (this._animationStartedNextLoopDelegate){
                        this._animationStartedNextLoopDelegate(this);
                    }
                }
                else{
                    this._setAnimationRunning(false);
                    if (this._animationFinishedPlayDelegate){
                        this._animationFinishedPlayDelegate(this);
                    }
                    return;
                }
            }
            this._processAnimation();
            if (this.getIsAnimationRunning()){
                this._showingFrame = this._currentFrame--;
            }
        }
    },

    _processAnimation : function(){

    }

);
