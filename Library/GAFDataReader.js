cc.gaf.DataReader = function(data) {
    this.dataRaw = data;
    this.buf = new DataView(data);
    this.offset = [0];
};

cc.gaf.DataReader.prototype.constructor = cc.gaf.DataReader;

cc.gaf.DataReader.prototype.Ubyte = function() {
    this.offset[this.offset.length-1] += 1;
    return this.buf.getUint8(this.offset[this.offset.length-1] - 1);
};

cc.gaf.DataReader.prototype.Uint = function() {
    this.offset[this.offset.length-1] += 4;
    return this.buf.getUint32(this.offset[this.offset.length-1] - 4, true);
};

cc.gaf.DataReader.prototype.int = function() {
    this.offset[this.offset.length-1] += 4;
    return this.buf.getInt32(this.offset[this.offset.length-1] - 4, true);
};

cc.gaf.DataReader.prototype.Ushort = function() {
    this.offset[this.offset.length-1] += 2;
    return this.buf.getUint16(this.offset[this.offset.length-1] - 2, true);
};

cc.gaf.DataReader.prototype.float = function() {
    this.offset[this.offset.length-1] += 4;
    return this.buf.getFloat32(this.offset[this.offset.length-1] - 4, true);
};

cc.gaf.DataReader.prototype.String = function() {
    this.offset[this.offset.length-1] += 2;
    var strLen = this.buf.getUint16(this.offset[this.offset.length-1] - 2, true);

    this.offset[this.offset.length-1] += strLen;
    return decodeURIComponent(escape(String.fromCharCode.apply(null, new Uint8Array(this.dataRaw.slice(this.offset[this.offset.length-1] - strLen, this.offset[this.offset.length-1])))));
};

cc.gaf.DataReader.prototype.startNestedBuffer = function(length) {
    this.offset.push(this.offset[this.offset.length-1]);
    this.offset[this.offset.length-2] += length;
};

cc.gaf.DataReader.prototype.endNestedBuffer = function() {
    if (this.offset.length == 1) throw new Error('No nested buffer available');
    this.offset.pop();
};

cc.gaf.DataReader.prototype.Point = function(){
    return new cc.kmVec2(
        this.float(),
        this.float()
    )
};

cc.gaf.DataReader.prototype.Rect = function(){
    return new cc.Rect(
        this.float(),
        this.float(),
        this.float(),
        this.float()
    )
};

cc.gaf.DataReader.prototype.Matrix = function(){
    return [
        this.float(),
        this.float(),
        this.float(),
        this.float(),
        this.float(),
        this.float()
    ];
};

cc.gaf.DataReader.prototype.seek = function(pos){
    this.offset[this.offset.length-1] = pos;
};

cc.gaf.DataReader.prototype.tell = function(){
    return this.offset[this.offset.length-1];
};

cc.gaf.DataReader.prototype.fields = function(){
    var self = this;
    var arguments_ = arguments;
    return function(){
        arguments.callee.result = {};
        var i = 0;
        while(i < arguments_.length){
            var field = arguments_[i++];
            var func = arguments_[i++];
            if(typeof func === "function"){
                arguments.callee.result[field] = func();
            }
            else{
                arguments.callee.result[field] = self[func].call(self);
            }
        }
        return arguments.callee.result;
    }
};

cc.gaf.DataReader.prototype.condition = function(){
    var self = this;
    var arguments_ = arguments;
    return function() {
        var container = arguments.callee.caller.result;
        var field = arguments_[0];
        var value = arguments_[1];
        var exec = arguments_[2];
        if(container[field] == value){
            return exec();
        }
        else{
            return null;
        }
    }
};

cc.gaf.DataReader.prototype.array = function(){
    var self = this;
    var arguments_ = arguments;
    return function() {
        arguments.callee.result = [];
        var length = self[arguments_[0]].call(self);
        for (var i = 0; i < length; ++i) {
            var r = arguments_[1].call();
            arguments.callee.result.push(r);
        }
        return arguments.callee.result;
    }
};
