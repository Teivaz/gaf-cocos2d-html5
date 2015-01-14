var gaf = gaf || {};
gaf._tmp = gaf._tmp || {};


gaf.CCGAFLoader = function()
{
    this.load = function(realUrl, url, item, cb)
    {
        var loader = new gaf.Loader();
        loader.LoadFile(realUrl, function(data){cb(null, data)});
    };
};
cc.loader.register('.gaf', new gaf.CCGAFLoader());
