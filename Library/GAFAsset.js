var gaf = gaf || {};

gaf.GAFAsset = cc.Class.extend({

    /**
     * @method initWithGAFFile
     * @param {String} filePath - path to .gaf file
     * @param {function({path:String})} delegate - is used to change atlas path, e.g. to load `atlas.tga` instead of `atlas.png`
     * @return {bool}
     */
    initWithGAFFile : function(filePath, delegate){
        debugger;
    },

    /**
     * @method initWithGAFBundle
     * @param {String} zipFilePath - path to the archive with .gaf and its textures
     * @param {String} entryFile - name of the .gaf file in archive
     * @param {function({path:String})} delegate - is used to change atlas path, e.g. to load `atlas.tga` instead of `atlas.png`
     * @return {bool}
     */
    initWithGAFBundle : function(zipFilePath, entryFile, delegate){
        debugger;
    },

    /**
     * @method setRootTimelineWithName
     * @param {String} arg0
     */
    setRootTimelineWithName : function(name){
        debugger;
    },

    /**
     * @method getRootTimeline
     * @return {gaf::GAFTimeline}
     */
    getRootTimeline : function(){
        debugger;
    },

    /**
     * @method getTimelines
     * @return {[gaf::GAFTimeline]}
     */
    getTimelines : function(){
        debugger;
    },

    /**
     * @method createWithBundle
     * @param {String} zipFilePath - path to the archive with .gaf and its textures
     * @param {String} entryFile - name of the .gaf file in archive
     * @param {function({path:String})} delegate - is used to change atlas path, e.g. to load `atlas.tga` instead of `atlas.png`
     * @return {gaf::GAFAsset}
     */
    createWithBundle : function(zipFilePath, entryFile, delegate){
        var asset = new gaf.GAFAsset();
        asset.initWithGAFBundle(zipFilePath, entryFile, delegate);
        return asset;
    },

    isAssetVersionPlayable : function(){
        return true;
    },

    /**
     * @method initWithGAFFile
     * @param {String} filePath - path to .gaf file
     * @param {function({path:String})} delegate - is used to change atlas path, e.g. to load `atlas.tga` instead of `atlas.png`
     * @return {gaf::GAFAsset}
     */
    create : function (gafFilePath, delegate ){
        var asset = new gaf.GAFAsset();
        asset.initWithGAFFile(gafFilePath, delegate);
        return asset;
    },

    /**
     * @method createObject
     * @return {gaf::GAFObject}
     */
    createObject : function(){
        debugger;
    },

    /**
     * @method createObjectAndRun
     * [@param {boolean} arg0 - run looped. False by default]
     * @return {gaf::GAFObject}
     */
    createObjectAndRun : function(){
        var looped = false;
        if(arguments.length == 1) {
            looped = arguments[0];
        }

        debugger;
    },

    /**
     * @method desiredCsf
     * @return {float}
     */
    desiredCsf : function(){
        debugger;
    },

    /**
     * @method setDesiredCsf
     * @param {float} arg0
     */
    setDesiredCsf : function(csf){
        debugger;
    },

    /**
     * @method setTextureLoadDelegate
     * @param {function} arg0
     */
    setTextureLoadDelegate : function(delegate){
        debugger;
    },

    /**
     * @method getTextureManager
     * @return {gaf::GAFAssetTextureManager}
     */
    getTextureManager : function(){
        debugger;
    },

    /**
     * @method getSceneFps
     * @return {unsigned int}
     */
    getSceneFps : function(){
        debugger;
    },

    /**
     * @method getSceneWidth
     * @return {unsigned int}
     */
    getSceneWidth : function(){
        debugger;
    },

    /**
     * @method getSceneHeight
     * @return {unsigned int}
     */
    getSceneHeight : function(){
        debugger;
    },

    /**
     * @method getSceneColor
     * @return {color4b_object}
     */
    getSceneColor : function(){
        debugger;
    },

    /**
     * @method setSceneFps
     * @param {unsigned int} arg0
     */
    setSceneFps : function(fps){
        debugger;
    },

    /**
     * @method setSceneWidth
     * @param {unsigned int} arg0
     */
    setSceneWidth : function(width){
        debugger;
    },

    /**
     * @method setSceneHeight
     * @param {unsigned int} arg0
     */
    setSceneHeight : function(height){
        debugger;
    },

    /**
     * @method setSceneColor
     * @param {color4b_object} arg0
     */
    setSceneColor : function(color4B){
        debugger;
    },

    /**
     * @method getHeader
     * @return {gaf::GAFHeader}
     */
    getHeader : function ()
    {
        debugger;
    }
});
