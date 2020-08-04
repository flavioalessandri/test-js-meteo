
// Main Function DOMContentLoaded ----------------------------------
document.addEventListener("DOMContentLoaded", function(event) {

  var btn = document.getElementById("btn");

  getMyIpAddress();//function to get User-Ip/then get GeoLocation from IP/ finally get User Location weather forecast (using IP address) after web-page is loaded

  btn.addEventListener("click", getInputValue);
});

// New Function ----------------------------------
function getInputValue(){

  document.getElementById('container').innerHTML = "";

  var input_val = document.getElementById("input").value;

  document.getElementById("input").value = ""; //clear input value

  getWeatherForecast(input_val);//function to show weather forecast of the selected city (INPUT CITY NAME)

  setReloadInterval(input_val);
}

// New Function ----------------------------------
function getMyIpAddress(){
  var xmlhttp = new XMLHttpRequest(),
      method = "GET",
      url = 'https://api.ipify.org';

  xmlhttp.open(method, url, true);
  xmlhttp.onreadystatechange = function () {
    if(xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {

      var my_ip = xmlhttp.responseText;
      console.log("my_ip: ", my_ip);

      getGeoLocation(my_ip); // get User GeoLocation from IP
    }
  };
  xmlhttp.send();
}

// New Function ----------------------------------
function getGeoLocation(my_ip){
  var xmlhttp = new XMLHttpRequest(),
      method = "GET",
      url = 'http://ipwhois.app/json/'+ my_ip;

  xmlhttp.open(method, url, true);
  xmlhttp.onreadystatechange = function () {
    if(xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {

      var data = JSON.parse(xmlhttp.responseText);
      console.log(data);

      var city_name = data.city;

      var count= 1;
      var btn = document.getElementById('btn');

      getWeatherForecast(city_name); // show User Location weather forecast (using IP address) and GeoLocation

      setReloadInterval(city_name);
    }
    else if (xmlhttp.status == 400) {
      alert('There was an error 400');
    }
  };
  xmlhttp.send();
}

// New Function ----------------------------------
function setReloadInterval(elem){
  var count= 1;
  var btn = document.getElementById('btn');

  var my_interval = setInterval(function(){
      getWeatherForecast(elem); // show User Location weather forecast (using IP address) and GeoLocation
      console.log("------------------------Reloaded Page Every ten seconds; Loop: ",count++);
  },20000);

  btn.addEventListener("click", function(){
    clearInterval(my_interval);
    console.log("------------Break Reload Page--------------------");
  });
}

// New Function ----------------------------------
function getWeatherForecast(input_val) {
    console.log("-----------function getWeatherForecast");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
          console.log("XMLHttpRequest.DONE", XMLHttpRequest.DONE);

           if (xmlhttp.status == 200) {

              var data = JSON.parse(xmlhttp.responseText);

              console.log("data json parse", data);

              var forecast_day = data.forecast.forecastday;
              var location = data.location.name;

              // Handlebars section
              var template = document.getElementById("template").innerHTML;
              console.log("--Handlebars template--", template);

              var compiled = Handlebars.compile(template);
              console.log("compiled---------------",compiled);

              var target = "container";
              console.log("target---------",target);

              var loc_template = document.getElementById("loc_template").innerHTML;
              var loc_compiled = Handlebars.compile(loc_template);
              var loc_target = "location";
              var locationHTML = loc_compiled(data);
              console.log("loc_data", data);
              document.getElementById(loc_target).innerHTML = locationHTML;


             for (var i = 0; i < 3; i++) {

               var datas = forecast_day[i];
               datas.dayname = moment(datas.date).format('dddd');
               datas.date = moment(datas.date, "YYYY-MM-DD").format('DD-MMMM-YYYY');
               var elementHTML = compiled(datas);

             // var compiled = Handlebars.compile(template);
               console.log("elementHTML--------------------",elementHTML);
               console.log("locationHTML--------------------",locationHTML);
               console.log("datas----------------------------",datas );

               // document.getElementById('location').innerHTML = "<h2>" + location + "</h2>";
               document.getElementById(target).innerHTML += elementHTML;
             }
           }
           else if (xmlhttp.status == 400) {
              alert('There was an error 400');
           }
        }
    };
    xmlhttp.open("GET", 'http://api.weatherapi.com/v1/forecast.json?key=59723a46f32442b5886110030200308&q='+input_val+'&days=3', true);
    console.log(xmlhttp);
    xmlhttp.send();
    // var prova = setTimeout(function(){
    //
    //   getWeatherForecast(input_val),3000);
}
