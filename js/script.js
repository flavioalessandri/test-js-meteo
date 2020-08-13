
// my Function ------------------------------------------------------
const currentTime = () => {
  const now = moment()['_d'];
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  var clock = hours +" : " + minutes +" : " + seconds;
  return clock;
}

// my Function ------------------------------------------------------
const showSpinner = () => {
  document.querySelector('#spinner').classList.add('show');
}

// my Function ------------------------------------------------------
const hideSpinner = () => {
  document.querySelector('#spinner').classList.remove('show');
  document.querySelector('#spinner').classList.add('hide');
}

// my Function ------------------------------------------------------
const getMyIp = () => {
   return axios.get('https://api.ipify.org')
    .then(result => {
      console.log("-const getMyIp- result: ", result.data);
      return result.data;
  })
    .catch(error => {
       console.log("-const getMyIp- ERROR:",error);
       throw error;
   })
}

// my Function ------------------------------------------------------
const getNameLocation = (ip) => {
  return axios.get('http://ipwhois.app/json/'+ ip)
    .then((result) => {
    console.log("-const getNameLocation- result: ",result.data.city);
    return result.data.city;
  })
    .catch(error => {
     console.log("-const getNameLocation- ERROR:",error);
     throw error;
  })
}

// my Function ------------------------------------------------------
const getWeatherForecast = (cityName) => {
  return axios.get('http://api.weatherapi.com/v1/forecast.json?key=59723a46f32442b5886110030200308&q='+cityName+'&days=3')
    .then((result) => {
    console.log("-const getWeatherForecast- result : ", result.data);
    return result.data;
  })
    .catch(error => {
     console.log("-const getWeatherForecast- ERROR:",error);
     throw error;
  })
}

// my Function ------------------------------------------------------
const setWeatherData = (data) => {

  const forecast_day = data.forecast.forecastday;

  // Handlebars section
  const template = document.getElementById("template").innerHTML;
  const compiled = Handlebars.compile(template);
  const target = "container";

  const loc_template = document.getElementById("loc_template").innerHTML;
  const loc_compiled = Handlebars.compile(loc_template);
  const loc_target = "location";
  data.currentdate = currentTime();
  const locationHTML = loc_compiled(data);

  document.getElementById(loc_target).innerHTML = locationHTML;

 for (let i = 0; i < 3; i++) {
   const datas = forecast_day[i];
   datas.dayname = moment(datas.date).format('dddd');
   datas.date = moment(datas.date, "YYYY-MM-DD").format('DD-MMMM-YYYY');
   var elementHTML = compiled(datas);

 // var compiled = Handlebars.compile(template);
   console.log("elementHTML--------------------",elementHTML);
   console.log("locationHTML--------------------",locationHTML);
   console.log("datas----------------------------",datas );

   document.getElementById(target).innerHTML += elementHTML;
 }
}

// my Function ------------------------------------------------------
const getWeatherForecastByIp = () => {
  return getMyIp()
    .then(ip => getNameLocation(ip))  //can also write .then(getNameLocation)
      .then(cityName => getWeatherForecast(cityName)) //can also write .then(getWeatherForecast)
  }

  // my Function ------------------------------------------------------
const getWeatherForecastByInput = (input) => {
  return getWeatherForecast(input)
}

// my Function ------------------------------------------------------
const cleanDOMcontainer = () =>{
  document.getElementById('container').innerHTML = "";
}

// my Function ------------------------------------------------------
const cleanInputValue = () =>{
  document.getElementById("input").value = "";
}

// my Function ------------------------------------------------------
const setIntervalforIP = () => {
  console.log("Enter in -setIntervalforIP- ");
  let counter = 0;

  var my_interval = setInterval(() => {
    console.log("Every 20seconds Call api; num" , counter++);
    cleanDOMcontainer();
     getWeatherForecastByIp()
      .then(setWeatherData)
      .catch(console.log)
      .finally(highlightCurrentDay);
  },200000);

  btn.addEventListener("click", () => {
    console.log("Break Reload Page--------------------");
    return clearInterval(my_interval);
  });
}

// my Function ------------------------------------------------------
const setIntervalforInput = (arg) => {
  console.log("Enter in -setIntervalforInput- ");
  let counter = 0;

  var my_interval = setInterval(() => {
    console.log("Every 20seconds Call api; num" , counter++);
    cleanDOMcontainer();
      getWeatherForecastByInput(arg)
        .then(setWeatherData)
        .catch(console.log)
        .finally(highlightCurrentDay);

          cleanInputValue();
  },200000);

  btn.addEventListener("click", () => {
    console.log("Break Reload Page--------------------");
    return clearInterval(my_interval);
  });
}

const highlightCurrentDay = () => {
  let target = document.getElementById('container');
  let active = target.querySelector('div:first-child');
  active.classList.add('active');

  let newtarget = active.children[1];
  // newtarget.firstElementChild.classList.add('currentDay');
  let tempData = newtarget.querySelectorAll("div[class$='_d']");
  let newArray = Array.from(tempData);
  for (let i = 0; i < newArray.length; i++) {
    newArray[i].classList.add("current");
  }

  console.log("newtarget",newtarget);
  console.log("tempData",tempData, newArray);

}

// LOAD -------INVOKE init()-----------------------------------------------
document.addEventListener("load", init());

// MAIN FUNCTION ---------------------------------------------------
function init(){

  const btn = document.getElementById('btn');

  showSpinner();
  getWeatherForecastByIp()
    .then(setWeatherData) // can also write .then(data => setWeatherData(data))
    .catch(console.log)
    .then(hideSpinner)
    .catch(console.log)
    .then(highlightCurrentDay)
    .catch(console.log)
    .finally(setIntervalforIP);


  btn.addEventListener("click",function (){
    console.log("Click Button------------------------");
    const input = document.getElementById('input');

    cleanDOMcontainer();

     getWeatherForecastByInput(input.value)
      .then(setWeatherData)
      .catch(console.log)
      .then(highlightCurrentDay)
      .catch(console.log)
      .finally(setIntervalforInput(input.value));

    cleanInputValue();
  });
}
