var gaf = gaf || {};



gaf.GAFAsset = cc.Class.extend({

    // Private members
    _header: null,
    _timelines: [],
    _rootTimeline: null,
    _textureLoadDelegate: null,
    _sceneFps: 60,
    _sceneWidth: 0,
    _sceneHeight: 0,
    _sceneColor: 0,

    /**
     * @method initWithGAFFile
     * @param {String} filePath - path to .gaf file
     * @param {function({path:String})} delegate - is used to change atlas path, e.g. to load `atlas.tga` instead of `atlas.png`
     * @return {bool}
     */
    initWithGAFFile: function (filePath, delegate) {
        var data = cc.loader.getRes(filePath);
        cc.assert(data, "File `" + filePath + "` not found.");
        this._instantiateJsGaf(data);

        debugger;
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
     * @param {String} arg0
     */
    setRootTimelineWithName: function (name) {
        debugger;
    },

    /**
     * @method getRootTimeline
     * @return {gaf::GAFTimeline}
     */
    getRootTimeline: function () {
        debugger;
    },

    /**
     * @method getTimelines
     * @return {[gaf::GAFTimeline]}
     */
    getTimelines: function () {
        debugger;
    },

    /**
     * @method createWithBundle
     * @param {String} zipFilePath - path to the archive with .gaf and its textures
     * @param {String} entryFile - name of the .gaf file in archive
     * @param {function({path:String})} delegate - is used to change atlas path, e.g. to load `atlas.tga` instead of `atlas.png`
     * @return {gaf::GAFAsset}
     */
    createWithBundle: function (zipFilePath, entryFile, delegate) {
        var asset = new gaf.GAFAsset();
        asset.initWithGAFBundle(zipFilePath, entryFile, delegate);
        return asset;
    },

    isAssetVersionPlayable: function () {
        return true;
    },


    /**
     * @method createObject
     * @return {gaf::GAFObject}
     */
    createObject: function () {
        debugger;
    },

    /**
     * @method createObjectAndRun
     * [@param {boolean} arg0 - run looped. False by default]
     * @return {gaf::GAFObject}
     */
    createObjectAndRun: function () {
        var looped = false;
        if (arguments.length == 1) {
            looped = arguments[0];
        }

        debugger;
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
     * @param {float} arg0
     */
    setDesiredCsf: function (csf) {
        debugger;
    },

    /**
     * @method setTextureLoadDelegate
     * @param {function} arg0
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
     * @return {unsigned int}
     */
    getSceneFps: function () {
        debugger;
    },

    /**
     * @method getSceneWidth
     * @return {unsigned int}
     */
    getSceneWidth: function () {
        debugger;
    },

    /**
     * @method getSceneHeight
     * @return {unsigned int}
     */
    getSceneHeight: function () {
        debugger;
    },

    /**
     * @method getSceneColor
     * @return {color4b_object}
     */
    getSceneColor: function () {
        debugger;
    },

    /**
     * @method setSceneFps
     * @param {unsigned int} arg0
     */
    setSceneFps: function (fps) {
        debugger;
    },

    /**
     * @method setSceneWidth
     * @param {unsigned int} arg0
     */
    setSceneWidth: function (width) {
        debugger;
    },

    /**
     * @method setSceneHeight
     * @param {unsigned int} arg0
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
     * @return {gaf.GAFHeader}
     */
    getHeader: function () {
        return this._header;
    },

    // Private

    _instantiateJsGaf: function (gafData) {
        this._setHeader(gafData.header);
        this._constructTags(gafData.tags);

    },

    _constructTags: function (tags) {
        var self = this;
        var root = {};
        tags.forEach(function (tag) {
            self._constructSingleTag(tag, root);
        });
    },

    _constructSingleTag: function (tag, parent) {
        var self = this;
        switch (tag.tagName) {
            case "TagDefineStage":
                self._setStage(tag.content);
                break;
            case "TagDefineTimeline":
                self._constructTimeline(tag.content, parent);
                break;
            case "TagDefineAnimationObjects":
                self._constructAnimationObjects(tag.content, parent);
                break;
            case "TagDefineAtlas":
                gaf._GAFConstruct.Atlases(tag.content, parent);
                break;
        }
    },

    _setHeader: function (gafHeader) {
        this._header = gafHeader;
    },

    _setStage: function (content) {
        this._sceneFps = content.fps;
        this._sceneColor = content.color;
        this._sceneWidth = content.width;
        this._sceneHeight = content.height;
    },

    _constructTimeline: function (content, parent) {

    },


    _constructAnimationObjects : function(content, parent){
        parent.animationObjects = [];
        var elements = parent.atlases.elements;
        content.forEach(function(item){
            parent.animationObjects[+item.objectId] = elements[+item.elementAtlasIdRef];
        });
    }


});


/**
 * @method initWithGAFFile
 * @param {String} gafFilePath - path to .gaf file
 * @param {function({path:String})} delegate - is used to change atlas path, e.g. to load `atlas.tga` instead of `atlas.png`
 * @return {gaf.GAFAsset}
 */
gaf.GAFAsset.create = function (gafFilePath, delegate) {
    var asset = new gaf.GAFAsset();
    asset.initWithGAFFile(gafFilePath, delegate);
    return asset;
};

