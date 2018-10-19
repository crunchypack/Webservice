/***********************************************************************************
 *
 * Workout API
 *
 * Author: Simon Lobo
 *
 *
 * *********************************************************************************/
/**
 * Object for web service handling
 * Constructed using URL
 */
var webService = /** @class */ (function () {
    function webService(url) {
        this.url = url;
    }
    /**
     * GET all logs and render HTML
     * @param req Request
     */
    webService.prototype.show = function (req) {
        var xh = new XMLHttpRequest();
        xh.onreadystatechange = function () {
            var log = document.getElementById("alllogs");
            log.innerHTML = "";
            if (xh.readyState == XMLHttpRequest.DONE) {
                if (xh.status == 200) {
                    var json = JSON.parse(xh.responseText);
                    for (var i = 0; i < json.length; i++) { // Each log is rendered in a table
                        log.innerHTML += "</td><td id ='day_" + json[i].id + "'>" + json[i].day + "</td><td id = 'ex_" + json[i].id + "'>" + json[i].exercise + "</td><td id ='dur_" + json[i].id + "'>" + json[i].duration + "</td><td id ='dis_" + json[i].id + "'>" + json[i].distance + " </td><td id ='note_" + json[i].id + "'>" + json[i].notes + "</td><td><input type='button' id='delete_" + json[i].id + "'  value='Delete' onclick = del_row(" + json[i].id + ")> <input type='button' id = 'edit_" + json[i].id + "' onclick = 'edit_row(" + json[i].id + ")' value = 'Edit'><input type='button' id= 'save_" + json[i].id + "' onclick ='save_row(" + json[i].id + ")' value = 'Save' class ='save'></td>";
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
        xh.open("GET", this.url + "/" + req, true);
        xh.send();
    };
    /**
     * Create new log using POST
     * @param day day - 2000-01-01
     * @param exc exercise
     * @param dur duration
     * @param dist distance
     * @param note notes
     */
    webService.prototype.post = function (day, exc, dur, dist, note) {
        if ((day != '' && exc != '' && dur != ''))
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
    /**
     * DELETE log
     * @param i log id
     */
    webService.prototype["delete"] = function (i) {
        var xh = new XMLHttpRequest();
        xh.open("DELETE", this.url + "/" + i, true);
        xh.send();
        xh.onload = function () {
            location.reload();
        };
    };
    /**
     * Update using PUT
     * @param id log id
     * @param day day - 2000-01-01
     * @param exc exercise
     * @param dur duration
     * @param dist distance
     * @param note notes
     */
    webService.prototype.update = function (id, day, exc, dur, dist, note) {
        if (!(day != '' && exc != '' && dur != ''))
            location.reload();
        var json = { "day": day, "exercise": exc, "duration": dur, "distance": dist, "notes": note };
        var xh = new XMLHttpRequest();
        xh.open("PUT", this.url + "/" + id, true);
        xh.setRequestHeader('Content-Type', 'application/json');
        xh.send(JSON.stringify(json));
        xh.onload = function () {
            location.reload();
        };
    };
    return webService;
}());
/**
 * Waiting for DOM to be loaded, and call the show() method
 */
document.addEventListener("DOMContentLoaded", function () {
    // variables, createing instance of webservice
    var start = new webService("http://localhost/webb/workoutlog.php/logs");
    var filter = document.getElementById("filter_button");
    var sel = document.getElementById("ch_ex");
    var add = document.getElementById('add');
    start.show("");
    /**
     * Event for when filter button is pressed
     */
    filter.addEventListener("click", function () {
        // Casting HTMLInputElement to avoid TS errors
        var f_d = document.getElementById('from_d').value;
        var t_d = document.getElementById('to_d').value;
        start.show(sel.value + "/" + f_d + "/" + t_d);
    });
    /**
     * Event for when add button is pushed
     *
     */
    add.addEventListener("click", function () {
        var day = document.getElementById("day").value;
        var exc = document.getElementById("exercise").value;
        var dur = document.getElementById("duration").value;
        var dist = document.getElementById("distance").value;
        var note = document.getElementById("notes").value;
        var reg = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/;
        if (reg.test(dur)) {
            start.post(day, exc, dur, dist, note);
        }
        else {
            alert("Duration should be filled = HH:MM:SS");
            location.reload();
        }
    });
});
/**
 * Function for when Edit button is pushed
 * @param x log id
 */
function edit_row(x) {
    // Hide edit button and show save button
    document.getElementById("edit_" + x).style.display = "none";
    document.getElementById("save_" + x).style.display = "block";
    // Variables
    var day = document.getElementById("day_" + x);
    var ex = document.getElementById("ex_" + x);
    var dur = document.getElementById("dur_" + x);
    var dis = document.getElementById("dis_" + x);
    var note = document.getElementById("note_" + x);
    var day_data = day.innerHTML;
    var ex_data = ex.innerHTML;
    var dur_data = dur.innerHTML;
    var dis_data = dis.innerHTML;
    var note_data = note.innerHTML;
    // Make the rows editable 
    day.innerHTML = "<input type='date' id='day_text" + x + "' value='" + day_data + "'>";
    ex.innerHTML = "<input type='text' id='ex_text" + x + "' value='" + ex_data + "'>";
    dur.innerHTML = "<input type='text' id='dur_text" + x + "' value='" + dur_data + "'>";
    dis.innerHTML = "<input type='text' id='dis_text" + x + "' value='" + dis_data + "'>";
    note.innerHTML = "<input type='text' id='note_text" + x + "' value='" + note_data + "'>";
}
/**
 * Function for when Save button is pushed
 * @param x log id
 */
function save_row(x) {
    var day_value = document.getElementById("day_text" + x).value;
    var ex_value = document.getElementById("ex_text" + x).value;
    var dur_value = document.getElementById("dur_text" + x).value;
    var dis_value = document.getElementById("dis_text" + x).value;
    var note_value = document.getElementById("note_text" + x).value;
    // create instace of webService
    var upd = new webService("http://localhost/webb/workoutlog.php/logs");
    // Update the log
    upd.update(x, day_value, ex_value, dur_value, dis_value, note_value);
    //Hide save buttton and show edit button
    document.getElementById("edit_" + x).style.display = "block";
    document.getElementById("save_" + x).style.display = "none";
}
/**
 * Function for when delete button is pushed
 * @param x log id
 */
function del_row(x) {
    var c = confirm("Are you sure you want to delete this log?");
    // If user agrees the delete method is called
    if (c == true) {
        var del = new webService("http://localhost/webb/workoutlog.php/logs");
        del["delete"](x);
    }
}
