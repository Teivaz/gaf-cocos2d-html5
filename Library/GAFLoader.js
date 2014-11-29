
gaf.Load = function(stream){
    var header = {};
    gaf.Load.readHeaderBegin(stream, header);
    if(header.magic == 0x00474146) { // GAF
    }
    else if(header.magic == 0x00474143){ // GAC
        var compressed = stream.dataRaw.slice(stream.tell());

        var inflate = new window.Zlib.Inflate(new Uint8Array(compressed));
        var decompressed = inflate.decompress();
        stream = new gaf.DataReader(decompressed.buffer);
    }
    else{
        throw new Error("GAF syntax error.");
    }

    if(header.versionMajor < 4){
        gaf.Load.readHeaderEndV3(stream, header);
    }
    else{
        gaf.Load.readHeaderEndV4(stream, header);
    }

    var tags = gaf.ReadTags(stream);
    return {
        header: header,
        tags: tags
    };
};

gaf.Load.readHeaderBegin = function(stream, header){
    header.magic = stream.Uint();
    header.versionMajor = stream.Ubyte();
    header.versionMinor = stream.Ubyte();
    header.fileLength = stream.Uint();
};

gaf.Load.readHeaderEndV3 = function(stream, header) {
    header.framesCount = stream.Ushort();
    header.bounds = stream.Rect();
    header.point = stream.Point();
};

gaf.Load.readHeaderEndV4 = function(stream, header){
    header.scaleCount = stream.Uint();
    header.scales = [];
    for(var i = 0; i < header.scaleCount; ++i){
        header.scales.push(stream.float());
    }
    header.csfCount = stream.Uint();
    header.csfs = [];
    for(var i = 0; i < header.csfCount; ++i){
        header.csfs.push(stream.float());
    }
};
