
gaf.GAFSprite = cc.Sprite.extend({
    _externalTransform : cc.affineTransformMake(),

    setExternalTransform : function(affineTransform){
        if(cc.affineTransformEqualToTransform(this.getExternalTransform(), affineTransform)){
            this._externalTransform = affineTransform;
            this._transformDirty = true;
            this._inverseDirty = true;
        }
    },
    getExternalTransform : function(){
        return this._externalTransform;
    },
    getNodeToParentTransform : function(){
        if(this._transformDirty){
            if (this._atlasScale != 1){
                var transform = cc.affineTransformScale(this.getExternalTransform(), this._atlasScale, this._atlasScale);
                cc.CGAffineToGL(cc.affineTransformTranslate(transform, -this._anchorPointInPoints.x, -this._anchorPointInPoints.y), this._transform.m);
            }
            else{
                cc.CGAffineToGL(cc.affineTransformTranslate(this.getExternalTransform(), -this._anchorPointInPoints.x, -this._anchorPointInPoints.y), this._transform.m);
            }
            this._transformDirty = false;
        }
        return this._transform;
    },
    getNodeToParentAffineTransform : function(){
        if (this._transformDirty)
        {
            var transform = this.getExternalTransform();
            if (this._atlasScale != 1)
            {
                transform = cc.affineTransformScale(transform, this._atlasScale, this._atlasScale);
            }

            cc.CGAffineToGL(cc.affineTransformTranslate(transform, -this._anchorPointInPoints.x, -this._anchorPointInPoints.y), this._transform.m);
            this._transformDirty = false;
        }
        cc.GLToCGAffine(this._transform.m, this.transform);

        return transform;
    },
    draw : function(){


    },
    setLocator : function(){},
    getAtlasScale : function(){},
    setAtlasScale : function(){}

});

if (cc._renderType === cc._RENDER_TYPE_CANVAS) {
}
else{
    gaf._tmp.WebGLGAFSprite();
    delete  gaf._tmp.WebGLGAFSprite;
}


