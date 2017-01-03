(function($) {
    var state = {
        rock : null,
        currentrock : null,
        currenturl : null,
        currentdevice : "mobp",
        message : null,
        map : null,
        viewports : {
            "mobp":    { ref: "mobile portrait",        width: 320, height: 480 },
            "mobl":    { ref: "mobile landscape",       width: 480, height: 320 },
            "minip":   { ref: "mini tablet portrait",   width: 480, height: 640 },
            "minil":   { ref: "mini tablet landscape",  width: 640, height: 480 },
            "tabp":    { ref: "tablet portrait",        width: 768, height: 1024 },
            "tabl":    { ref: "tablet landscape",       width: 1024, height: 768 },
            "lg":      { ref: "desktop",                width: 1280, height: 802 },
            "11in":    { ref: "11in desktop",           width: 1366, height: 768 },
            "15in":    { ref: "15in desktop",           width: 1680, height: 1050 },
            "17in":    { ref: "17in desktop",           width: 1920, height: 1200 },
            "27in":    { ref: "27in desktop",           width: 2560, height: 1440 },
        }
    }

    var _cache = {};
    state.map = LoadJson("/cms/rocksmap.json");
    if(!state.map) {
        console.log("WARNING : can not found /cms/rocksmap.json, loading rocksmap test");
        state.map = LoadJson("rocksmap.json");
    }
    var _templateFrames = LoadHTML("view/responsivewindows.html");
    var _templateTitle = LoadHTML("view/title.html");
    var _templateMenu = LoadHTML("view/menu.html");
    var _templateMap = LoadHTML("view/map.html");

    //private functions

    function UpdateState () {
        var hash = location.hash;
        hash = hash.replace(/^#/, "");
        state.currentrock = hash || "";
        state.currenturl = $("#urlInput").val();
        
        state.rock = state.map && state.map[state.currentrock];
    }

    function UpdateViews () {
        UpdateState();
        UpdateMenuView();
        UpdateFramesView();
        StartUserInteraction();
    }

    function UpdateFramesView (path) {
        $("#frames").html("");
        $("#title").html("");
        $("#map").html("");
        state.message = "";
        if(state.currentrock && !state.rock)
            state.message = "Can not find rock " + state.currentrock + " in rocks map";

        $.tmpl(_templateFrames, state).appendTo("#frames");
        $.tmpl(_templateTitle, state).appendTo("#title");
        $.tmpl(_templateMap, state).appendTo("#map");
    }

    function UpdateMenuView (path) {
        $("#menu").html("");
        $.tmpl(_templateMenu, state).appendTo("#menu");
    }

    function LoadJson (url) {
        if(!url)
            return;

        var jsoncontent = "";
        $.ajax({
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType : "json",
            cache: false,
            async: false,
            success: function (data) {
                jsoncontent = data;
            },
            error: function (xhr, status, error) {
                console.log("ERROR : can not load json from (" + url + ") : ", error);
                return error;
            }
        });
        return jsoncontent;
    }

    function LoadHTML (filename) {
        if(_cache[filename])
            return _cache[filename];
        
        var htmlcontent;
        $.ajax({
            url: filename,
            cache: false,
            dataType: "html",
            contentType: 'text/plain; charset=utf-8',
            async: false,
            type: 'GET',
            success: function (data, success) {
                htmlcontent = data;
            },
            error: function (XMLHttpRequest, textStatus, error) {
                console.log("ERROR : htmlLoad::Can not load html (" + filename + ") : ", error);
                return error;
            }
        });
        
        if(!htmlcontent) {
            console.log("ERROR : htmlLoad::Can not load html (" + filename + ") : content not found");
            return;
        }
        
        _cache[filename] = htmlcontent;
        return htmlcontent;
    }
    


    //events

    $(document).ready(function () {
        UpdateViews();
    });

    $(window).on('hashchange', function() {
        UpdateViews();
    });

    function StartUserInteraction () {
        $("#btnWidthOnly").click(function() {
            $("#frames").toggleClass("widthOnly");
            $("#btnWidthOnly").toggleClass("active");
        });
        $("#urlInput").change(function(e) {
            e.preventDefault();
            UpdateViews();
        });
        $(".mapoption-item").click(function(e) {
            state.currentdevice = $(this).data("option");
            UpdateViews();
        });
    }

})(jQuery);