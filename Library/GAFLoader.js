

cc.gaf.Loader = {
    m_stream : null,
    m_object : null,
    loadData : function(stream){
        readHeader(stream);

    },

    uncompress : function(stream){
        return stream;
    },

    read : function(rawStream) {
        var stream = null;
        var magic = rawStream.readU32();
        var header = readHeader(rawStream);
        if(magic == 0x00474146) { // GAF
            stream = rawStream;
        }
        else if(magic == 0x00474143){ // GAC
            stream = uncompress(rawStream);
        }
        else{
            throw new Error("GAF syntax error.");
        }
        cc.gaf.Tags.read(stream);
    },

    readHeader : function(stream){
        var header = {};
        header.versionMajor = stream.readU8();
        header.versionMinor = stream.readU8();
        header.fileLength = stream.readU32();
        if(header.versionMajor < 4){
            header.framesCount = stream.readU16();
            header.bounds = stream.readRect();
            header.point = stream.readVec();
        }
        else{
            header.scaleCount = stream.readU32();
            header.scales = [];
            for(var i = 0; i < header.scaleCount; ++i){
                header.scales.push(stream.readFloat());
            }
            header.csfCount = stream.readU32();
            header.csfs = [];
            for(var i = 0; i < header.scaleCount; ++i){
                header.csfs.push(stream.readFloat());
            }
        }
        return header;
    }
};
