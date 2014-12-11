
gaf.GAFSprite = cc.Sprite.extend({
    _className: "GAFSprite"



});

if (cc._renderType === cc._RENDER_TYPE_CANVAS) {
}
else{
    gaf._tmp.WebGLGAFSprite();
    delete  gaf._tmp.WebGLGAFSprite;
}


