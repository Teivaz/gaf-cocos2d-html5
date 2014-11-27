
cc.gaf.Load = function(stream){
    var header = {};
    cc.gaf.Load.readHeaderBegin(stream, header);
    if(header.magic == 0x00474146) { // GAF
    }
    else if(header.magic == 0x00474143){ // GAC
        var compressed = stream.dataRaw.slice(stream.tell());

        var inflate = new window.Zlib.Inflate(new Uint8Array(compressed));
        var decompressed = inflate.decompress();
        stream = new cc.gaf.DataReader(decompressed.buffer);
    }
    else{
        throw new Error("GAF syntax error.");
    }

    if(header.versionMajor < 4){
        cc.gaf.Load.readHeaderEndV3(stream, header);
    }
    else{
        cc.gaf.Load.readHeaderEndV4(stream, header);
    }

    var tags = [];
    do {
        var tag = cc.gaf.LoadTag(stream, header);
        tags.push(tag);
    }while(tag.tagName != "TagEnd");
    return new cc.gaf.File(header, tags);
};

cc.gaf.Load.readHeaderBegin = function(stream, header){
    header.magic = stream.Uint();
    header.versionMajor = stream.Ubyte();
    header.versionMinor = stream.Ubyte();
    header.fileLength = stream.Uint();
};

cc.gaf.Load.readHeaderEndV3 = function(stream, header) {
    header.framesCount = stream.Ushort();
    header.bounds = stream.Rect();
    header.point = stream.Point();
};

cc.gaf.Load.readHeaderEndV4 = function(stream, header){
    header.scaleCount = stream.Uint();
    header.scales = [];
    for(var i = 0; i < header.scaleCount; ++i){
        header.scales.push(stream.float());
    }
    header.csfCount = stream.Uint();
    header.csfs = [];
    for(var i = 0; i < header.scaleCount; ++i){
        header.csfs.push(stream.float());
    }
};
