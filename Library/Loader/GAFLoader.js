var gaf = gaf || {};

//@Private class
gaf.Loader = function(){

    var readHeaderBegin = function(stream, header){
        header.magic = stream.Uint();
        header.versionMajor = stream.Ubyte();
        header.versionMinor = stream.Ubyte();
        header.fileLength = stream.Uint();
    };

    var readHeaderEndV3 = function(stream, header) {
        header.framesCount = stream.Ushort();
        header.bounds = stream.Rect();
        header.point = stream.Point();
    };

    var readHeaderEndV4 = function(stream, header){
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

    this.LoadFile = function(filePath, onLoaded){
        var oReq = new XMLHttpRequest();
        var self = this;
        oReq.responseType = "arraybuffer";
        oReq.onload = function(oEvent) {
            var gaf_data = new gaf.DataReader(oReq.response);
            var gafFile = self.LoadStream(gaf_data);
            if(onLoaded)
                onLoaded(gafFile);
        };
        oReq.open("GET", filePath, true);
        oReq.send();
    };

    this.LoadStream = function(stream){
        var header = {};
        readHeaderBegin(stream, header);
        if(header.magic == gaf.COMPRESSION_NONE) { // GAF
        }
        else if(header.magic == gaf.COMPRESSION_ZIP){ // GAC
            var compressed = stream.dataRaw.slice(stream.tell());

            var inflate = new window.Zlib.Inflate(new Uint8Array(compressed));
            var decompressed = inflate.decompress();
            stream = new gaf.DataReader(decompressed.buffer);
        }
        else{
            throw new Error("GAF syntax error.");
        }

        if(header.versionMajor < 4){
            readHeaderEndV3(stream, header);
        }
        else{
            readHeaderEndV4(stream, header);
        }

        var tags = gaf.ReadTags(stream);
        return {
            header: header,
            tags: tags
        };
    };
};
