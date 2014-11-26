
cc.gaf.DataReader = function(data) {
    this.dataRaw = data;
    this.buf = new DataView(data);
    this.offset = [0];
};

cc.gaf.DataReader.prototype.constructor = cc.gaf.DataReader;

cc.gaf.DataReader.prototype.readU8 = function() {
    this.offset[this.offset.length-1] += 1;
    return this.buf.getUint8(this.offset[this.offset.length-1] - 1);
};

cc.gaf.DataReader.prototype.readU32 = function() {
    this.offset[this.offset.length-1] += 4;
    return this.buf.getUint32(this.offset[this.offset.length-1] - 4, true);
};

cc.gaf.DataReader.prototype.readS32 = function() {
    this.offset[this.offset.length-1] += 4;
    return this.buf.getInt32(this.offset[this.offset.length-1] - 4, true);
};

cc.gaf.DataReader.prototype.readU16 = function() {
    this.offset[this.offset.length-1] += 2;
    return this.buf.getUint16(this.offset[this.offset.length-1] - 2, true);
};

cc.gaf.DataReader.prototype.readFloat = function() {
    this.offset[this.offset.length-1] += 4;
    return this.buf.getFloat32(this.offset[this.offset.length-1] - 4, true);
};

cc.gaf.DataReader.prototype.readString = function() {
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

cc.gaf.DataReader.prototype.readVec2 = function(){
    return new cc.kmVec2(
        this.readFloat(),
        this.readFloat()
    )
};

cc.gaf.DataReader.prototype.readRect = function(){
    return new cc.Rect(
        this.readFloat(),
        this.readFloat(),
        this.readFloat(),
        this.readFloat()
    )
};

cc.gaf.DataReader.prototype.seek = function(pos){
    this.offset[this.offset.length-1] = pos;
};

cc.gaf.DataReader.prototype.tell = function(){
    return this.offset[this.offset.length-1];
};
