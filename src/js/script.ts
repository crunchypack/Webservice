/***********************************************************************************
 * 
 * Workout API 
 * 
 * Author: Simon Lobo
 * 
 * 
 * *********************************************************************************/

class webService {
    url: string;
    constructor(url: string) {
        this.url = url;
    }
    show(): void {
        var xh = new XMLHttpRequest();
        xh.onreadystatechange = function () {
            if (xh.readyState == XMLHttpRequest.DONE) {
                if (xh.status == 200) {
                    var json = JSON.parse(xh.responseText);
                    for (var i = 0; i < json.length; i++) {
                        document.getElementById("alllogs").innerHTML += "</td><td id ='day_"+json[i].id+"'>" + json[i].day + "</td><td id = 'ex_"+json[i].id+"'>" + json[i].exercise + "</td><td id ='dur_"+json[i].id+"'>" + json[i].duration + "</td><td id ='dis_"+json[i].id+"'>" + json[i].distance + "</td><td id ='note_"+json[i].id+"'>" + json[i].notes + "</td><td><input type='button' id='delete_" + json[i].id + "'  value='Delete' onclick = del_row("+json[i].id+")> <input type='button' id = 'edit_"+json[i].id+"' onclick = 'edit_row("+json[i].id+")' value = 'Edit'><input type='button' id= 'save_"+json[i].id+"' onclick ='save_row("+json[i].id+")' value = 'Save' class ='save'></td>";
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
    }
    post(): void {
        let day = (<HTMLInputElement>document.getElementById("day")).value;
        let exc = (<HTMLInputElement>document.getElementById("exercise")).value;
        let dur = (<HTMLInputElement>document.getElementById("duration")).value;
        let dist = (<HTMLInputElement>document.getElementById("distance")).value;
        let note = (<HTMLInputElement>document.getElementById("notes")).value;

        if (!(day != '' && exc != '' && dur != '')) location.reload();
        let json = { "day": day, "exercise": exc, "duration": dur, "distance": dist, "notes": note };

        var xh = new XMLHttpRequest();
        xh.open("POST", this.url, true);
        xh.setRequestHeader('Content-Type', 'application/json');
        xh.send(JSON.stringify(json));

        xh.onload = () => {
            location.reload();
        }

    }
    delete(i): void {
        var xh = new XMLHttpRequest();
        xh.open("DELETE", this.url + "/" + i, true);
        xh.send();

        xh.onload = () => {
            location.reload();
        }
    }
    update(id,day,exc,dur,dist,note): void {


        if (!(day != '' && exc != '' && dur != '')) location.reload();
        let json = { "day": day, "exercise": exc, "duration": dur, "distance": dist, "notes": note };

        var xh = new XMLHttpRequest();
        xh.open("PUT", this.url + "/" + id, true);
        xh.setRequestHeader('Content-Type', 'application/json');
        xh.send(JSON.stringify(json));

        xh.onload = () => {
            location.reload();
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    let start = new webService("http://localhost/webb/workoutlog.php/logs");
    var logs = document.getElementById("alllogs");
    start.show();



})

function edit_row(x){
    document.getElementById("edit_"+x).style.display="none";
    document.getElementById("save_"+x).style.display="block";

    var day = document.getElementById("day_"+x);
    var ex = document.getElementById("ex_"+x);
    var dur = document.getElementById("dur_"+x);
    var dis = document.getElementById("dis_"+x);
    var note = document.getElementById("note_"+x);

    var day_data = day.innerHTML;
    var ex_data = ex.innerHTML;
    var dur_data = dur.innerHTML;
    var dis_data = dis.innerHTML;
    var note_data = note.innerHTML;

    day.innerHTML ="<input type='text' id='day_text"+x+"' value='"+day_data+"'>";
    ex.innerHTML ="<input type='text' id='ex_text"+x+"' value='"+ex_data+"'>";
    dur.innerHTML ="<input type='text' id='dur_text"+x+"' value='"+dur_data+"'>";
    dis.innerHTML ="<input type='text' id='dis_text"+x+"' value='"+dis_data+"'>";
    note.innerHTML ="<input type='text' id='note_text"+x+"' value='"+note_data+"'>";
}
function save_row(x){
    var day_value = (<HTMLInputElement>document.getElementById("day_text"+x)).value;
    var ex_value = (<HTMLInputElement>document.getElementById("ex_text"+x)).value;
    var dur_value = (<HTMLInputElement>document.getElementById("dur_text"+x)).value;
    var dis_value = (<HTMLInputElement>document.getElementById("dis_text"+x)).value;
    var note_value = (<HTMLInputElement>document.getElementById("note_text"+x)).value;

    let upd = new webService("http://localhost/webb/workoutlog.php/logs");

    upd.update(x,day_value,ex_value,dur_value,dis_value,note_value);
    document.getElementById("edit_"+x).style.display="block";
    document.getElementById("save_"+x).style.display="none";
}
function del_row(x){
    let del = new webService("http://localhost/webb/workoutlog.php/logs");

    del.delete(x);

}
