/***********************************************************************************
 * 
 * Workout
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
            log.innerHTML ="<tr><th onclick = 'sortTable(0)'>Day</th><th onclick='sortTable(1)'>Exercise</th><th>Duration</th><th>Distance</th><th>Notes</th></tr>";
            if (xh.readyState == XMLHttpRequest.DONE) {
                if (xh.status == 200) {
                    var json = JSON.parse(xh.responseText);
                    for (var i = 0; i < json.length; i++) { // Each log is rendered in a table
                        log.innerHTML += "<tr><td id ='day_"+json[i].id+"'>" + json[i].day + "</td><td id = 'ex_"+json[i].id+"'>" + json[i].exercise + "</td><td id ='dur_"+json[i].id+"'>" + json[i].duration + "</td><td id ='dis_"+json[i].id+"'>" + json[i].distance + " </td><td id ='note_"+json[i].id+"'>" + json[i].notes + "</td><td><input type='button' id='delete_" + json[i].id + "'  value='Delete' onclick = del_row("+json[i].id+") class = 'bdelete'> <input type='button' id = 'edit_"+json[i].id+"' onclick = 'edit_row("+json[i].id+")' value = 'Edit' class='bedit'><input type='button' id= 'save_"+json[i].id+"' onclick ='save_row("+json[i].id+")' value = 'Save' class ='save'></td></tr>";
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
    let start = new webService("https://simonlobo.ddns.net/workout/workoutlog.php/logs");
    let filter = document.getElementById("filter_button");
    let sel = document.getElementById("ch_ex");
    let add = document.getElementById('add');

    start.show("");
    
    // Set current day in add log form
    (<HTMLInputElement>document.getElementById('day')).valueAsDate = new Date();
    
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
    ex.innerHTML ="<select id='ex_text"+x+"' value='"+ex_data+"'> <option value = 'Badminton'> Badminton </option> <option value = 'Cycling'> Cycling </option> <option value = 'Hiking'> Hiking </option> <option value = 'Indoor cycling'> Indoor cycling </option> <option value = 'Jogging'> Jogging </option> <option value = 'Other indoor'> Other indoor </option> <option value = 'Other outdoor'> Other outdoor </option> <option value = 'Running'> Running </option> <option value = 'Strength training'> Strength training </option> <option value = 'Treadmill running'> Treadmill running </option> <option value = 'Walking'> Walking </option>";
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
    let upd = new webService("https://simonlobo.ddns.net/workout/workoutlog.php/logs");
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
       let del = new webService("https://simonlobo.ddns.net/workout/workoutlog.php/logs");
       del.delete(x);
   }
    

}
/**
 * Code taken from w3schools
 *  
 */
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("alllogs");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc"; 
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++; 
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }
