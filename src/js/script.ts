/***********************************************************************************
 * 
 * Workout API 
 * 
 * Author: Simon Lobo
 * 
 * 
 * *********************************************************************************/

 class webService {
     url : string;
     constructor (url: string){
         this.url = url;
     }
     show(): void{
        var xh = new XMLHttpRequest();
        xh.onreadystatechange = function() {
            if(xh.readyState == XMLHttpRequest.DONE){
                if(xh.status == 200){
                    var json = JSON.parse(xh.responseText);
                    for(var i = 0; i < json.length; i++){
                        document.getElementById("test").innerHTML += "</td><td>"+json[i].id + "</td><td>" + json[i].day + "</td><td>" + json[i].exercise + "</td><td><button id='"+json[i].id+"'>Delete #"+json[i].id+"</button></td>";  
                    }   
                }
                else if(xh.status == 400){
                    alert("ERROR");
                }
                else{
                    alert('Something else was returned');
                }
            }
        };
        xh.open("GET", this.url, true);
        xh.send();
     }
     post(e):void{
         let day = (<HTMLInputElement>document.getElementById("day")).value;
         let exc = (<HTMLInputElement>document.getElementById("exercise")).value;
         let dur = (<HTMLInputElement>document.getElementById("duration")).value;
         let dist = (<HTMLInputElement>document.getElementById("distance")).value;
         let note = (<HTMLInputElement>document.getElementById("notes")).value;

         if(!(day != '' && exc != '' && dur != '')) location.reload();
         let json = {"day": day, "exercise": exc, "duration": dur, "distance": dist, "notes": note};

         var xh = new XMLHttpRequest();
         xh.open("POST", this.url, true);
         xh.setRequestHeader('Content-Type', 'application/json');
         xh.send(JSON.stringify(json));

         xh.onload = ()=>{
             location.reload();
         }

     }
     delete(ev):void{
             var xh = new XMLHttpRequest();
             xh.open("DELETE", this.url+"/"+(<HTMLInputElement>ev.target).id, true);
             xh.send();

             xh.onload = () =>{
                 location.reload();
             }
     }
     update():void{
         let id = (<HTMLInputElement>document.getElementById("id")).value;
         let day = (<HTMLInputElement>document.getElementById("dayu")).value;
         let exc = (<HTMLInputElement>document.getElementById("exu")).value;
         let dur = (<HTMLInputElement>document.getElementById("dur")).value;
         let dist = (<HTMLInputElement>document.getElementById("dis")).value;
         let note = (<HTMLInputElement>document.getElementById("not")).value;

         if(!(day != '' && exc != '' && dur != '')) location.reload();
         let json = {"day": day, "exercise": exc, "duration": dur, "distance": dist, "notes": note};

         var xh = new XMLHttpRequest();
         xh.open("PUT", this.url + "/"+id,true);
         xh.setRequestHeader('Content-Type', 'application/json');
         xh.send(JSON.stringify(json));

         xh.onload = () =>{
             location.reload();
         }
     }
 }
document.addEventListener("DOMContentLoaded", function(){
    let test = new webService("http://localhost/webb/workoutlog.php/logs");
    test.show();

    document.getElementById("add").addEventListener("click", function(e){
        test.post(e);
    });
    document.getElementById("test").addEventListener("click", function(e){
        test.delete(e);
    });

    

})
 