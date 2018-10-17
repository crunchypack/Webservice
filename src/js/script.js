/***********************************************************************************
 *
 * Workout API
 *
 * Author: Simon Lobo
 *
 *
 * *********************************************************************************/
var webService = /** @class */ (function () {
    function webService(url) {
        this.url = url;
    }
    webService.prototype.show = function () {
        var xh = new XMLHttpRequest();
        xh.onreadystatechange = function () {
            if (xh.readyState == XMLHttpRequest.DONE) {
                if (xh.status == 200) {
                    var json = JSON.parse(xh.responseText);
                    for (var i = 0; i < json.length; i++) {
                        document.getElementById("test").innerHTML += "</td><td>" + json[i].id + "</td><td>" + json[i].day + "</td><td>" + json[i].exercise + "</td><td><button id='" + json[i].id + "'>Delete #" + json[i].id + "</button></td>";
                    }
                }
                else if (xh.status == 400) {
                    alert("ERROR");
                }
                else {
                    alert('Something else was returned');
                }
            }
        };
        xh.open("GET", this.url, true);
        xh.send();
    };
    webService.prototype.post = function (e) {
        var day = document.getElementById("day").value;
        var exc = document.getElementById("exercise").value;
        var dur = document.getElementById("duration").value;
        var dist = document.getElementById("distance").value;
        var note = document.getElementById("notes").value;
        if (!(day != '' && exc != '' && dur != ''))
            location.reload();
        var json = { "day": day, "exercise": exc, "duration": dur, "distance": dist, "notes": note };
        var xh = new XMLHttpRequest();
        xh.open("POST", this.url, true);
        xh.setRequestHeader('Content-Type', 'application/json');
        xh.send(JSON.stringify(json));
        xh.onload = function () {
            location.reload();
        };
    };
    webService.prototype["delete"] = function (ev) {
        var xh = new XMLHttpRequest();
        xh.open("DELETE", this.url + "/" + ev.target.id, true);
        xh.send();
        xh.onload = function () {
            location.reload();
        };
    };
    return webService;
}());
document.addEventListener("DOMContentLoaded", function () {
    var test = new webService("http://localhost/webb/workoutlog.php/logs");
    test.show();
    document.getElementById("add").addEventListener("click", function (e) {
        test.post(e);
    });
    document.getElementById("test").addEventListener("click", function (e) {
        test["delete"](e);
    });
});
