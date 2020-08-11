// SCRIPT QUASI COMPLETO - MANCA PARTE DELLO SPINNER

// nuova funzione ------------------------------------------------------
const showSpinner = () => {
  document.querySelector('#spinner').classList.add('show');
  return true;
}

// nuova funzione ------------------------------------------------------
const hideSpinner = () => {
  document.querySelector('#spinner').classList.remove('show');
  document.querySelector('#spinner').classList.add('hide');
}

// nuova funzione ------------------------------------------------------
const getMyIp = () => {
   return axios.get('https://api.ipify.org')
    .then(result => {
      console.log("-const getMyIp- result:", result.data);
      return result.data;
  })
    .catch(error => {
       console.log("getMyIp L'errore è:",error);
       throw error;
   })
}

// nuova funzione ------------------------------------------------------
const getNameLocation = (ip) => {
  return axios.get('http://ipwhois.app/json/'+ ip)
    .then((result) => {
    console.log("-const getNameLocation- result :",result.data.city);
    return result.data.city;
  })
    .catch(error => {
     console.log("getNameLocation L'errore è:",error);
     throw error;
  })
}

// nuova funzione ------------------------------------------------------
const getWeatherForecast = (cityName) => {
  return axios.get('http://api.weatherapi.com/v1/forecast.json?key=59723a46f32442b5886110030200308&q='+cityName+'&days=3')
    .then((result) => {
    console.log("-const getWeatherForecast - result : ", result.data);
    return result.data;
  })
    .catch(error => {
     console.log("getWeatherForecast  L'errore è:",error);
     throw error;
  })
}

// nuova funzione ------------------------------------------------------
const setWeatherData = (data) => {

  const forecast_day = data.forecast.forecastday;
  const location = data.location.name;

  // Handlebars section
  const template = document.getElementById("template").innerHTML;
  const compiled = Handlebars.compile(template);
  const target = "container";

  const loc_template = document.getElementById("loc_template").innerHTML;
  const loc_compiled = Handlebars.compile(loc_template);
  const loc_target = "location";
  const locationHTML = loc_compiled(data);
  console.log("loc_data", data);
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
 return true;
}

// nuova funzione ------------------------------------------------------
const getWeatherForecastByIp = () => {
  return new Promise((resolve,reject) => {
    getMyIp()
    .then(ip => getNameLocation(ip))
      .then(cityName => getWeatherForecast(cityName))
        .then(data => setWeatherData(data));
      })
  }

// nuova funzione ------------------------------------------------------
const getWeatherForecastByInput = (input) => {
  getWeatherForecast(input)
    .then(data => setWeatherData(data))
  }

// nuova funzione -NON UTILIZZATA-----------------------------------------------------
  async function asyncWeatherForecastByIp() {
     try {
       showSpinner();
       await getWeatherForecastByIp();
     } catch (err) {
       console.error(err);
     } finally {
       hideSpinner()
     }
}

// nuova funzione ------------------------------------------------------
const cleanDom = () =>{
  document.getElementById('container').innerHTML = "";
}

// nuova funzione ------------------------------------------------------
const cleanInputValue = () =>{
  document.getElementById("input").value = "";
}

// MAIN FUNCTIONS  ------------------------------------------------------

document.addEventListener("load", init());

// MAIN FUNCTIONS  ------------------------------------------------------function init(){

function init(){
  console.log("HELLO");

  showSpinner();
  getWeatherForecastByIp();
  hideSpinner();

  const input = document.getElementById('input');
  const btn = document.getElementById('btn');

  btn.addEventListener("click",function (){

    console.log("------------------Click Function------------------------");

    cleanDom();
    getWeatherForecastByInput(document.getElementById("input").value);
    cleanInputValue();
  });

}
