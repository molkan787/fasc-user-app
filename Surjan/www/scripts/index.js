(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        //document.addEventListener( 'pause', onPause.bind( this ), false );
        //document.addEventListener( 'resume', onResume.bind( this ), false );

        //window.alert = function (txt) {
        //    navigator.notification.alert(txt, null, "WalkOnRetail", txt('close'));
        //}
    };

    window.AppName = "WalkOnRetail";


    window.onload = function () {
        actions_init();
        dm_init_v2();
        pams_init();
        mc_init();
        leftmenu_init();
        ui_init();
        applyTextsToElements();

        window.firstLaunch = (window.localStorage.getItem('launched') != 'true');
        dm_load();

        payments_init();
        testing_do();

        document.addEventListener("backbutton", ui_device_backBtn_click, false);
    };


    window.onerror = function (msg, url, lineNo, columnNo, error) {
        if (lineNo) alert(msg + " -- " + lineNo);
        else alert(msg);

        return false;
    }

    function onPause() {

    };

    function onResume() {

    };
} )();