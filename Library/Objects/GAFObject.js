var gaf = gaf || {};

gaf._stateHasCtx = function(state)
{
    // Check for tint color offset
    if( state.hasColorTransform &&
       (state.colorTransform.offset.r > 0 ||
        state.colorTransform.offset.g > 0 ||
        state.colorTransform.offset.b > 0 ||
        state.colorTransform.offset.a > 0)
    )
    {
        return true;
    }

    // Check for color transform filter
    var BreakException= {};
    try
    {
        if(state.hasEffect)
        {
            state.effect.forEach(function(effect)
            {
                if(effect.type === gaf.EFFECT_COLOR_MATRIX) throw BreakException;
            });
        }
    }
    catch(e)
    {
        if (e!==BreakException) throw e;
        return true;
    }

    return false;
};

gaf.Object = cc.Node.extend
({
    _externalTransform : null,
    _asset : null,
    _className : "GAFObject",
    _id : gaf.IDNONE,
    _gafproto : null,
    _parentTimeLine : null,
    _lastVisibleInFrame : 0,


    // Public methods
    ctor: function()
    {
        this._super();
        this._externalTransform = cc.affineTransformMakeIdentity();
    },

    /**
     * @method setAnimationStartedNextLoopDelegate
     * @param {function(Object)} delegate
     */
    setAnimationStartedNextLoopDelegate : function (delegate) {},

    /**
     * @method setAnimationFinishedPlayDelegate
     * @param {function(Object)} delegate
     */
    setAnimationFinishedPlayDelegate : function (delegate) {},

    /**
     * @method setLooped
     * @param {bool} looped
     */
    setLooped : function (looped) {},

    /**
     * @method getBoundingBoxForCurrentFrame
     * @return {cc.Rect}
     */
    getBoundingBoxForCurrentFrame : function () {return cc.rect();},

    /**
     * @method setFps
     * @param {uint} fps
     */
    setFps : function (fps) {},

    /**
     * @method getObjectByName
     * @param {String} name - name of the object to find
     * @return {gaf.Object}
     */
    getObjectByName : function (name) {return null;},

    /**
     * @method clearSequence
     */
    clearSequence : function () {},

    /**
     * @method getIsAnimationRunning
     * @return {bool}
     */
    getIsAnimationRunning : function () {return false;},

    /**
     * @method gotoAndStop
     * @param {uint|String} value - label ot frame number
     * @return {bool}
     */
    gotoAndStop : function (value) {},

    /**
     * @method getStartFrame
     * @param {String} frameLabel
     * @return {uint}
     */
    getStartFrame : function (frameLabel) {return gaf.IDNONE;},

    /**
     * @method setFramePlayedDelegate
     * @param {function(Object, frame)} delegate
     */
    setFramePlayedDelegate : function (delegate) {},

    /**
     * @method getCurrentFrameIndex
     * @return {uint}
     */
    getCurrentFrameIndex : function () {
        return gaf.IDNONE;
    },

    /**
     * @method getTotalFrameCount
     * @return {uint}
     */
    getTotalFrameCount : function () {return 0;},

    /**
     * @method start
     */
    start : function () {},

    /**
     * @method stop
     */
    stop : function () {},

    /**
     * @method isVisibleInCurrentFrame
     * @return {bool}
     */
    isVisibleInCurrentFrame : function ()
    {
        if (this._parentTimeLine &&
            (this._parentTimeLine.getCurrentFrameIndex() + 1 != this._lastVisibleInFrame))
        {
            return false;
        }
        else
        {
            return true;
        }
    },

    /**
     * @method isDone
     * @return {bool}
     */
    isDone : function () {return true;},

    /**
     * @method playSequence
     * @param {String} name - name of the sequence to play
     * @param {bool} looped - play looped. False by default
     * @param {bool} resume - whether to resume animation if stopped. True by default
     * @return {bool}
     */
    playSequence : function (name, looped, resume) {return false;},

    /**
     * @method isReversed
     * @return {bool}
     */
    isReversed : function () {return false;},

    /**
     * @method setSequenceDelegate
     * @param {function(Object, sequenceName)} delegate
     */
    setSequenceDelegate : function (delegate) {},

    /**
     * @method setFrame
     * @param {uint} index
     * @return {bool}
     */
    setFrame : function (index) {return false;},

    /**
     * @method setControlDelegate
     * @param {function} func
     */
    setControlDelegate : function (func) {},

    /**
     * @method getEndFrame
     * @param {String} frameLabel
     * @return {uint}
     */
    getEndFrame : function (frameLabel) {return gaf.IDNONE;},

    /**
     * @method pauseAnimation
     */
    pauseAnimation : function () {},

    /**
     * @method gotoAndPlay
     * @param {uint|String} value - label ot frame number
     * @return {bool}
     */
    gotoAndPlay : function (value) {},

    /**
     * @method isLooped
     * @return {bool}
     */
    isLooped : function () {return false;},

    /**
     * @method resumeAnimation
     */
    resumeAnimation : function () {},

    /**
     * @method setReversed
     * @param {bool} reversed
     */
    setReversed : function (reversed) {},

    /**
     * @method hasSequences
     * @return {bool}
     */
    hasSequences : function () {return false;},

    /**
     * @method getFps
     * @return {uint}
     */
    getFps : function () {return 60;},

    /**
     * @method setLocator
     * @param {bool} locator
     * Locator object will not draw itself, but its children will be drawn
     */
    setLocator : function (locator){},

    setExternalTransform : function(affineTransform)
    {
        if(!cc.affineTransformEqualToTransform(this._additionalTransform, affineTransform))
        {
            this.setAdditionalTransform(affineTransform);
        }
    },

    getExternalTransform : function()
    {
        return this._externalTransform;
    },

    getNodeToParentTransform : function()
    {
        if(this._transformDirty)
        {
            var scale = 1 / cc.Director.getInstance().getContentScaleFactor();
            if (scale !== 1)
            {
                var transform = cc.affineTransformScale(this.getExternalTransform(), scale, scale);
                cc.CGAffineToGL(cc.affineTransformTranslate(transform, -this._anchorPointInPoints.x, -this._anchorPointInPoints.y), this._transform.m);
            }
            else
            {
                cc.CGAffineToGL(cc.affineTransformTranslate(this.getExternalTransform(), -this._anchorPointInPoints.x, -this._anchorPointInPoints.y), this._transform.m);
            }
            this._transformDirty = false;
        }
        return this._transform;
    },

    getNodeToParentAffineTransform : function()
    {
        if (this._transformDirty)
        {
            var transform = this.getExternalTransform();
            var scale = 1 / cc.Director.getInstance().getContentScaleFactor();
            if (scale !== 1)
            {
                transform = cc.affineTransformScale(transform, scale, scale);
            }

            cc.CGAffineToGL(cc.affineTransformTranslate(transform, -this._anchorPointInPoints.x, -this._anchorPointInPoints.y), this._transform.m);
            this._transformDirty = false;
        }
        cc.GLToCGAffine(this._transform.m, this.transform);

        return transform;
    },

    ////////////////
    // Private
    ////////////////

    _updateVisibility : function(state, parent)
    {
        var alphaOffset = state.hasColorTransform ? state.colorTransform.offset.a : 0;
        this.setOpacity(state.alpha + alphaOffset);
        //return this.isVisible();
    },

    // @Override
    isVisible : function()
    {
        return this.getDisplayedOpacity() > 0;
    },

    // @Override
    visit: function(parentCmd)
    {
        if(this.isVisibleInCurrentFrame())
        {
            this._super(parentCmd);
        }
    },

    _getFilters : function(){return null},

    _processAnimation : function(){},

    _setAnimationRunning: function () {},

    _applyState : function(state, parent)
    {
        this._parentTimeLine = parent;
        this.setExternalTransform(state.matrix);
    },

    _initRendererCmd: function()
    {
        this._renderCmd = cc.renderer.getRenderCmd(this);
        this._renderCmd._visit = this._renderCmd.visit;
        var self = this;
        this._renderCmd.visit = function(parentCmd) {
            if(self.isVisibleInCurrentFrame()){
                this._visit(parentCmd);
            }
        }
    },

    _getNode : function()
    {
        return this;
    }

});

gaf.Object._createNullObject = function()
{
    var ret = new gaf.Object();
    ret.isVisible = function(){return true};
    return ret;
};
