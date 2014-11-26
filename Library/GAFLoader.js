

cc.gaf.Loader = cc.Class.extend({
    m_stream : null,
    m_header : {},

    ctor : function(stream){
        m_stream = stream;
    },

    loadData : function(stream){
        if(arguments.length == 1){
            m_stream = stream;
        }
        this.read(m_stream);

    },

    uncompress : function(stream){
        return stream;
    },

    read : function(stream) {
        this.readHeaderBegin(stream);
        if(this.m_header.magic == 0x00474146) { // GAF
        }
        else if(this.m_header.magic == 0x00474143){ // GAC
            var compressed = stream.dataRaw.slice(stream.tell());

            var inflate = new window.Zlib.Inflate(new Uint8Array(compressed));
            var decompressed = inflate.decompress();
            stream = new cc.gaf.DataReader(decompressed.buffer);
        }
        else{
            throw new Error("GAF syntax error.");
        }

        if(this.m_header.versionMajor < 4){
            this.readHeaderEndV3(stream);
        }
        else{
            this.readHeaderEndV4(stream);
        }

        var tags = [];
        do {
            var tag = cc.gaf.LoadTag(stream);
            tags.push(tag);
        }while(tag.tagName != "TagEnd");
        return tags;
    },

    readHeaderBegin : function(stream){
        var header = this.m_header;
        header.magic = stream.readU32();
        header.versionMajor = stream.readU8();
        header.versionMinor = stream.readU8();
        header.fileLength = stream.readU32();
    },
    readHeaderEndV3 : function(stream) {
        var header = this.m_header;
        header.framesCount = stream.readU16();
        header.bounds = stream.readRect();
        header.point = stream.readVec2();
    },
    readHeaderEndV4 : function(stream){
        var header = this.m_header;
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


});
