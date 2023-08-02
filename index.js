// console.log(" hello ajey ");

const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoConttainer=document.querySelector(".user-info-container");
const errorImage = document.querySelector('[data-errorImg]');
const notFound = document.querySelector(".errorContainer");
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');

//intially variable needed

let currentTab=userTab;
currentTab.classList.add("current-tab");

getfromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoConttainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //now in your weather tab mei ho
            searchForm.classList.remove("active");
            userInfoConttainer.classList.remove("active");
            //hume starting mei weather display karna hoga
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})

function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchuserWeatherInfo(coordinates);
    }
}

async function fetchuserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader screen visible
    loadingScreen.classList.add("active");

    try{
        const res=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data=await res.json();
        loadingScreen.classList.remove("active");
        userInfoConttainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        notFound.classList.add('active');
        errorImage.style.display = 'none';
        errorText.innerText = `Error: ${err?.message}`;
        errorBtn.style.display = 'block';
        errorBtn.addEventListener("click", fetchWeatherInfo);

    }


}

function renderweatherinfo(weatherInfo){

    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all} %`;

}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        grantAccessButton.style.display = 'none';
    }
}

function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchuserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getlocation);

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName===""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){

    loadingScreen.classList.add("active");
    userInfoConttainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data=await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoConttainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(error){
        // console.error("NOT FOUND ERROR 404");
        loadingScreen.classList.remove("active");
        userInfoConttainer.classList.remove('active');
        notFound.classList.add('active');
        errorText.innerText = `${error?.message}`;
        errorBtn.style.display = "none";
    }
    searchInput.value="";

}
