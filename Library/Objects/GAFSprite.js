
gaf.Sprite = gaf.Object.extend({
    _className: "GAFSprite",

    ctor : function(){
    }


});

if (cc._renderType === cc._RENDER_TYPE_CANVAS) {
}
else{
    gaf._tmp.WebGLGAFSprite();
    delete  gaf._tmp.WebGLGAFSprite;
}


