
gaf.Sprite = gaf.Object.extend({
    _className: "GAFSprite",

    ctor : function(gafSpriteProto){
        this._super();
        cc.assert(gafSpriteProto,  "Error! Missing mandatory parameter.");
        this._proto = gafSpriteProto;

        var frame = this._proto.getObjects()[this._proto.getIdRef()];
        var sprite = cc.Sprite.createWithSpriteFrame(frame);
        this.addChild(sprite);
        this._sp = sprite;

        sprite.setAnchorPoint(frame._gafAnchor);

        //sprite.setAnchorPoint(0, 0);
        //this.setContentSize(sprite.getContentSize());
        //this.setAnchorPoint(0.5, 0.5);
    }



    // Private

});
/*
if (cc._renderType === cc._RENDER_TYPE_CANVAS) {
}
else{
    gaf._tmp.WebGLGAFSprite();
    delete  gaf._tmp.WebGLGAFSprite;
}


*/