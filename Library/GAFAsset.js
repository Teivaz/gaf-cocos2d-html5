var gaf = gaf || {};

gaf.GAFAsset = cc.Class.extend({

    /**
     * @method initWithGAFFile
     * @param {String} filePath - path to .gaf file
     * @param {function({path:String})} delegate - is used to change atlas path, e.g. to load `atlas.tga` instead of `atlas.png`
     * @return {bool}
     */
    initWithGAFFile : function(filePath, delegate){

    },

    /**
     * @method initWithGAFBundle
     * @param {String} zipFilePath - path to the archive with .gaf and its textures
     * @param {String} entryFile - name of the .gaf file in archive
     * @param {function({path:String})} delegate - is used to change atlas path, e.g. to load `atlas.tga` instead of `atlas.png`
     * @return {bool}
     */
    initWithGAFBundle : function(zipFilePath, entryFile, delegate){

    },

    /**
     * @method pushTimeline
     * @param {unsigned int} arg0
     * @param {gaf::GAFTimeline} arg1
     */
    pushTimeline : function(timelineIdRef, GAFTimeline){

    },

    /**
     * @method setHeader
     * @param {gaf::GAFHeader} arg0
     */
    setHeader : function(GAFHeader){

    },

    /**
     * @method setRootTimeline
     * @param {gaf::GAFTimeline} arg0
     */
    setRootTimeline : function(timeline){

    },

    /**
     * @method setRootTimelineWithName
     * @param {String} arg0
     */
    setRootTimelineWithName : function(name){

    },

    /**
     * @method getRootTimeline
     * @return {gaf::GAFTimeline}
     */
    getRootTimeline : function(){

    },

    /**
     * @method getTimelines
     * @return {map_object|map_object}
     */
    getTimelines : function(){

    },
    createWithBundle : function(){

    },
    create : function(){

    },
    isAssetVersionPlayable : function(){

    },
    createObject : function(){

    },
    createObjectAndRun : function(){

    },
    desiredCsf : function(){

    },
    setDesiredCsf : function(){

    },
    setTextureLoadDelegate : function(){

    },
    getTextureManager : function(){

    },
    getSceneFps : function(){

    },
    getSceneWidth : function(){

    },
    getSceneHeight : function(){

    },
    getSceneColor : function(){

    },
    setSceneFps : function(fps){

    },
    setSceneWidth : function(width){

    },
    setSceneHeight : function(height){

    },
    setSceneColor : function(color4B){

    }

});
