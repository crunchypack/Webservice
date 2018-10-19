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
class webService {
    url: string;
    constructor(url: string) { 
        this.url = url;
    }
    /**
     * GET all logs and render HTML
     * @param req Request
     */
    show(req): void {
        var xh = new XMLHttpRequest();
        xh.onreadystatechange = function () {
            var log = document.getElementById("alllogs");
            log.innerHTML ="<th>Day</th><th>Exercise</th><th>Duration</th><th>Distance</th><th>Notes</th>";
            if (xh.readyState == XMLHttpRequest.DONE) {
                if (xh.status == 200) {
                    var json = JSON.parse(xh.responseText);
                    for (var i = 0; i < json.length; i++) { // Each log is rendered in a table
                        log.innerHTML += "</td><td id ='day_"+json[i].id+"'>" + json[i].day + "</td><td id = 'ex_"+json[i].id+"'>" + json[i].exercise + "</td><td id ='dur_"+json[i].id+"'>" + json[i].duration + "</td><td id ='dis_"+json[i].id+"'>" + json[i].distance + " </td><td id ='note_"+json[i].id+"'>" + json[i].notes + "</td><td><input type='button' id='delete_" + json[i].id + "'  value='Delete' onclick = del_row("+json[i].id+") class = 'bdelete'> <input type='button' id = 'edit_"+json[i].id+"' onclick = 'edit_row("+json[i].id+")' value = 'Edit' class='bedit'><input type='button' id= 'save_"+json[i].id+"' onclick ='save_row("+json[i].id+")' value = 'Save' class ='save'></td>";
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
        xh.open("GET", this.url +"/"+req, true);
        xh.send();
    }
    /**
     * Create new log using POST
     * @param day day - 2000-01-01
     * @param exc exercise
     * @param dur duration
     * @param dist distance
     * @param note notes
     */
    post(day,exc,dur,dist,note): void {

        if ((day != '' && exc != '' && dur != '')) location.reload();
        let json = { "day": day, "exercise": exc, "duration": dur, "distance": dist, "notes": note };

        var xh = new XMLHttpRequest();
        xh.open("POST", this.url, true);
        xh.setRequestHeader('Content-Type', 'application/json');
        xh.send(JSON.stringify(json));

        xh.onload = () => {
            location.reload();
        }

    }
    /**
     * DELETE log 
     * @param i log id 
     */
    delete(i): void {
        var xh = new XMLHttpRequest();
        xh.open("DELETE", this.url + "/" + i, true);
        xh.send();

        xh.onload = () => {
            location.reload();
        }
    }
    /**
     * Update using PUT 
     * @param id log id
     * @param day day - 2000-01-01
     * @param exc exercise
     * @param dur duration
     * @param dist distance
     * @param note notes
     */
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
/**
 * Waiting for DOM to be loaded, and call the show() method
 */
document.addEventListener("DOMContentLoaded", function () {
    // variables, createing instance of webservice
    let start = new webService("http://localhost/webb/workoutlog.php/logs");
    let filter = document.getElementById("filter_button");
    let sel = document.getElementById("ch_ex");
    let add = document.getElementById('add');

    start.show("");
    /**
     * Event for when filter button is pressed
     */
    filter.addEventListener("click", function(){
        // Casting HTMLInputElement to avoid TS errors
        let f_d = (<HTMLInputElement>document.getElementById('from_d')).value;
        let t_d = (<HTMLInputElement>document.getElementById('to_d')).value;

        start.show((<HTMLInputElement>sel).value + "/" + f_d + "/" + t_d);
    });

    /**
     * Event for when add button is pushed
     * 
     */
    add.addEventListener("click", function(){
        let day = (<HTMLInputElement>document.getElementById("day")).value;
        let exc = (<HTMLInputElement>document.getElementById("exercise")).value;
        let dur = (<HTMLInputElement>document.getElementById("duration")).value;
        let dist = (<HTMLInputElement>document.getElementById("distance")).value;
        let note = (<HTMLInputElement>document.getElementById("notes")).value;
        let reg : RegExp =/^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/;

        if(reg.test(dur)){
            start.post(day,exc,dur,dist,note);
        }else{
            alert("Duration should be filled = HH:MM:SS");
            location.reload();
            
        }
    
        
    });





})


/**
 * Function for when Edit button is pushed
 * @param x log id
 */
function edit_row(x){
    // Hide edit button and show save button
    document.getElementById("edit_"+x).style.display="none";
    document.getElementById("save_"+x).style.display="block";
    // Variables
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
    // Make the rows editable 
    day.innerHTML ="<input type='date' id='day_text"+x+"' value='"+day_data+"'>";
    ex.innerHTML ="<input type='text' id='ex_text"+x+"' value='"+ex_data+"'>";
    dur.innerHTML ="<input type='text' id='dur_text"+x+"' value='"+dur_data+"'>";
    dis.innerHTML ="<input type='text' id='dis_text"+x+"' value='"+dis_data+"'>";
    note.innerHTML ="<input type='text' id='note_text"+x+"' value='"+note_data+"'>";
}
/**
 * Function for when Save button is pushed
 * @param x log id
 */
function save_row(x){
    var day_value = (<HTMLInputElement>document.getElementById("day_text"+x)).value;
    var ex_value = (<HTMLInputElement>document.getElementById("ex_text"+x)).value;
    var dur_value = (<HTMLInputElement>document.getElementById("dur_text"+x)).value;
    var dis_value = (<HTMLInputElement>document.getElementById("dis_text"+x)).value;
    var note_value = (<HTMLInputElement>document.getElementById("note_text"+x)).value;
    // create instace of webService
    let upd = new webService("http://localhost/webb/workoutlog.php/logs");
    // Update the log
    upd.update(x,day_value,ex_value,dur_value,dis_value,note_value);
    //Hide save buttton and show edit button
    document.getElementById("edit_"+x).style.display="block";
    document.getElementById("save_"+x).style.display="none";
}
/**
 * Function for when delete button is pushed
 * @param x log id
 */
function del_row(x){
   var c = confirm("Are you sure you want to delete this log?");
   // If user agrees the delete method is called
   if(c == true){
       let del = new webService("http://localhost/webb/workoutlog.php/logs");
       del.delete(x);
   }
    

}
