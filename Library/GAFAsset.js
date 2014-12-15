var gaf = gaf || {};

gaf.Asset = cc.Class.extend({
    _className: "GAFAsset",

    // Private members
    _header: {},
    _objects: [],
    _timeLines: [],
    _rootTimeLine: null,
    _textureLoadDelegate: null,
    _sceneFps: 60,
    _sceneWidth: 0,
    _sceneHeight: 0,
    _sceneColor: 0,
    _gafData: null,

    /**
     * @method initWithGAFFile
     * @param {String} filePath - path to .gaf file
     * @param {function({path:String})} delegate - is used to change atlas path, e.g. to load `atlas.tga` instead of `atlas.png`
     * @return {bool}
     */
    initWithGAFFile: function (filePath, delegate) {
        this._gafData = cc.loader.getRes(filePath);
        cc.assert(this._gafData, "File `" + filePath + "` not found.");
    },

    /**
     * @method initWithGAFBundle
     * @param {String} zipFilePath - path to the archive with .gaf and its textures
     * @param {String} entryFile - name of the .gaf file in archive
     * @param {function({path:String})} delegate - is used to change atlas path, e.g. to load `atlas.tga` instead of `atlas.png`
     * @return {bool}
     */
    initWithGAFBundle: function (zipFilePath, entryFile, delegate) {
        debugger;
    },

    /**
     * @method setRootTimelineWithName
     * @param {String} name
     */
    setRootTimelineWithName: function (name) {
        if (this._rootTimeLine &&
            this._rootTimeLine.getLinkageName() === name) {
            return;
        }

        var BreakException= {};
        var self = this;
        try {
            self._timeLines.forEach(function (object) {
                if (object.getLinkageName() === name) {
                    self._setRootTimeline(object);
                    throw BreakException;
                }
            });
        }
        catch(e){
            if (e!==BreakException) throw e;
        }
    },

    /**
     * @method getRootTimeline
     * @return {gaf.TimeLine}
     */
    getRootTimeline: function () {
        return this._rootTimeLine;
    },

    /**
     * @method getTimelines
     * @return {[gaf.TimeLine]}
     */
    getTimelines: function () {
        return this._timeLines;
    },

    /**
     * @method createWithBundle
     * @param {String} zipFilePath - path to the archive with .gaf and its textures
     * @param {String} entryFile - name of the .gaf file in archive
     * @param {function({path:String})} delegate - is used to change atlas path, e.g. to load `atlas.tga` instead of `atlas.png`
     * @return {gaf.Asset}
     */
    createWithBundle: function (zipFilePath, entryFile, delegate) {
        var asset = new gaf.Asset();
        asset.initWithGAFBundle(zipFilePath, entryFile, delegate);
        return asset;
    },

    isAssetVersionPlayable: function () {
        return true;
    },


    /**
     * @method createObject
     * @return {gaf.Object}
     */
    createObject: function () {
        debugger;
    },

    /**
     * @method createObjectAndRun
     * [@param {boolean} arg0 - run looped. False by default]
     * @return {gaf.Object}
     */
    createObjectAndRun: function () {
        var looped = false;
        if (arguments.length == 1) {
            looped = arguments[0];
        }
        var object = this._instantiateJsGaf(this._gafData);
        object.setLooped(looped);
        object.start();
        return object;
    },

    /**
     * @method desiredCsf
     * @return {float}
     */
    desiredCsf: function () {
        debugger;
    },

    /**
     * @method setDesiredCsf
     * @param {float} csf
     */
    setDesiredCsf: function (csf) {
        debugger;
    },

    /**
     * @method setTextureLoadDelegate
     * @param {function} delegate
     */
    setTextureLoadDelegate: function (delegate) {
        debugger;
    },

    /**
     * @method getTextureManager
     * @return {gaf::GAFAssetTextureManager}
     */
    getTextureManager: function () {
        debugger;
    },

    /**
     * @method getSceneFps
     * @return {uint}
     */
    getSceneFps: function () {
        debugger;
    },

    /**
     * @method getSceneWidth
     * @return {uint}
     */
    getSceneWidth: function () {
        debugger;
    },

    /**
     * @method getSceneHeight
     * @return {uint}
     */
    getSceneHeight: function () {
        debugger;
    },

    /**
     * @method getSceneColor
     * @return {cc.color4b}
     */
    getSceneColor: function () {
        debugger;
    },

    /**
     * @method setSceneFps
     * @param {uint} fps
     */
    setSceneFps: function (fps) {
        debugger;
    },

    /**
     * @method setSceneWidth
     * @param {uint} width
     */
    setSceneWidth: function (width) {
        debugger;
    },

    /**
     * @method setSceneHeight
     * @param {uint} height
     */
    setSceneHeight: function (height) {
        debugger;
    },

    /**
     * @method setSceneColor
     * @param {color4b_object} arg0
     */
    setSceneColor: function (color4B) {
        debugger;
    },

    /**
     * @method getHeader
     * @return {GAFHeader}
     */
    getHeader: function () {
        return this._header;
    },

    // Private

    _setRootTimeline : function(timeLine){
        this._rootTimeLine = timeLine;
        this._header.pivot = timeLine.getPivot();
        this._header.frameSize = timeLine.getRect();
    },

    _instantiateJsGaf: function (gafData) {
        this._setHeader(gafData.header);
        var result = this._constructTags(gafData.tags);
        return result;
    },

    _constructTags: function (tags, parent) {
        var self = this;
        parent = parent || gaf.Object._createNullObject();
        tags.forEach(function (tag) {
            //gaf._GAFConstruct.Tag(self, tag, parent);
        });
    },

    _setHeader: function (gafHeader) {
        for(var prop in gafHeader){
            if(gafHeader.hasOwnProperty(prop))
                this._header[prop] = gafHeader[prop];
        }
    }

});


/**
 * @method initWithGAFFile
 * @param {String} gafFilePath - path to .gaf file
 * @param {function({path:String})} delegate - is used to change atlas path, e.g. to load `atlas.tga` instead of `atlas.png`
 * @return {gaf.Asset}
 */
gaf.Asset.create = function (gafFilePath, delegate) {
    var asset = new gaf.Asset();
    asset.initWithGAFFile(gafFilePath, delegate);
    return asset;
};

