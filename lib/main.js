var buttons = require('sdk/ui/button/action');
var clipboard = require("sdk/clipboard");

var auth_token = "";
var host = "";

var button = buttons.ActionButton({
    id: "mozilla-link",
    label: "Visit Mozilla",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },
    onClick: handleClick
});

function handleClick(state) {

    var selection = require("sdk/selection");
    var data = "";

    auth_token = require("sdk/simple-prefs").prefs.kbauthkey;
    host = require("sdk/simple-prefs").prefs.kbhost;

    console.log("auth_token = " + auth_token + ", host = " + host);

    if (selection.isContiguous) {
        console.log(" + data from single selection: " + selection.text);
        data = selection.text + " | ";
    } else {
        for (var subselection in selection) {
            console.log(" ++ data from multiple selection: " + subselection.text);
            data += subselection.text + " | ";
        }
    }
    var len = data.length;
    data = data.substring(0, len - 3);
    console.log("data from selection: " + data);
    var tabs = require("sdk/tabs");
    console.log("title of active tab is " + tabs.activeTab.title);
    console.log("url of active tab is " + tabs.activeTab.url);
    var jstr = JSON.stringify({"url": tabs.activeTab.url, "data": data});
    console.log("jstr = " + jstr);
    clipboard.set(jstr);

    if (auth_token != "") {
        var ind2 = tabs.activeTab.url.lastIndexOf("/");
        //var api_url = tabs.activeTab.url.substring(0, ind2) + "/apiuser?sel=";
        var api_url = host + "/apiuser?sel=";
        console.log("base api_url = " + api_url);
        var a_url = api_url + jstr + "&auth=" + auth_token;
        console.log("a_url = " + a_url);
        var Request = require("sdk/request").Request;
        var r1 = Request({
            url: a_url,
            onComplete: function (response) {
                console.log(response.text);
                if (response.text) {
                    var notifications = require("sdk/notifications");
                    notifications.notify({
                        title: "From KnowledgeBooks application",
                        text: response.text,
                        data: response.text,
                        onClick: function (data) {
                            console.log(data);
                            // console.log(this.data) would produce the same result.
                        }
                    });
                }
            }
        });
        r1.get();
    } else {
        console.log("\n** warning: You need to set the auth token in the KnowledgeBooks.com Firefox addon preferences.");
        var notifications2 = require("sdk/notifications");
        notifications2.notify({
            title: "From KnowledgeBooks application",
            text: "You need to set the auth token in the KnowledgeBooks.com Firefox addon preferences.",
            data: "You need to set the auth token in the KnowledgeBooks.com Firefox addon preferences.",
            onClick: function (data) {
                console.log(data);
                // console.log(this.data) would produce the same result.
            }
        });
    }
}

