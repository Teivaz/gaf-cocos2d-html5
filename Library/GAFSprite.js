
gaf.SpriteProto = function(){

};



gaf.Sprite = cc.Sprite.extend({
    _className: "GAFSprite",

    ctor : function(spriteProto){
        this.implement(spriteProto);
    }


});

if (cc._renderType === cc._RENDER_TYPE_CANVAS) {
}
else{
    gaf._tmp.WebGLGAFSprite();
    delete  gaf._tmp.WebGLGAFSprite;
}


