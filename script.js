const cityInput=document.querySelector('.city-input')
const searchButton=document.querySelector('.search-button')

const weatherInfoSection=document.querySelector('.weather-info')
const notFoundSection=document.querySelector('.not-found')
const searchCitySection=document.querySelector('.search-city')

const countryTxt=document.querySelector('.country-text')
const tempTxt=document.querySelector('.temp-txt')
const conditionTxt=document.querySelector('.condition-txt')
const humidityValueTxt=document.querySelector('.humidity-value-txt')
const windValueTxt=document.querySelector('.wind-value-txt') 
const weatherSummaryImg=document.querySelector('.weather-summary-img')
const currentDateTxt=document.querySelector('.current-date-txt')
const forecastItemContainer=document.querySelector('.forecast-items-container')

const apiKey='295dc9e142f227a212e622df81456ff7'

searchButton.addEventListener('click',() =>{
    if (cityInput.value.trim() !=''){
        updateWeatherinfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
    
})
cityInput.addEventListener('keydown',(event) =>{
    if(event.key =='Enter' &&
        cityInput.value.trim() !=''
    ){
        updateWeatherinfo(cityInput.value)  
         cityInput.value=''
        cityInput.blur()
    }
    
})
async function getFetchData(endPoint,city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const response =await fetch(apiUrl)
    return response.json()

}

function getWeatherIcon(id){
    if(id<=232) return 'thunderstorm.png'
    if(id<=321) return 'drizzle.png'
    if(id<=531) return 'rain.png'
    if(id<=622) return 'snow.png'
    if(id<=800) return 'clear.png'
    else return 'clouds.png'
}

function getCurrentDate(){
    const currentDate = new Date()
    const option={
        weekday:'short',
        day :'2-digit',
        month:'short'
    }
    return currentDate.toLocaleDateString('en-gb',option)
}

async function updateWeatherinfo(city){
    const weatherData = await getFetchData('weather',city)

    if (weatherData.cod != 200){
        showDisplaySelection(notFoundSection)
        return
    }
    

     const{
        name:country,
        main:{temp,humidity},
        weather:[{id, main}],
        wind:{speed}  
    }=weatherData

    countryTxt.textContent=country
    tempTxt.textContent=Math.round(temp)+" °C"
    conditionTxt.textContent=main
    humidityValueTxt.textContent=humidity+ "%"
    windValueTxt.textContent=speed+ "M/s "
    currentDateTxt.textContent=getCurrentDate()

    weatherSummaryImg.src=`weather/${getWeatherIcon(id)}`
    
    await updateForecastInfo(city )

    showDisplaySelection(weatherInfoSection)
}

async function updateForecastInfo(city){
    const forecastsData = await getFetchData('forecast', city)
    const timeTaken ='12:00:00'
    const todayDate= new Date().toISOString().split('T')[0]
    
    forecastItemContainer.innerHTML=''
    forecastsData.list.forEach(forecastWeather =>{
        if (forecastWeather.dt_txt.includes(timeTaken) && 
            !forecastWeather.dt_txt.includes(todayDate)){
                upadteForecastItems(forecastWeather )
            
        }
     
    })   
}

function upadteForecastItems(weatherData){
    console.log(weatherData)
    const{
        dt_txt:date,
        weather:[{id}],
        main:{temp}
    }=weatherData

    const dateTaken=new Date(date)
    const dateOption = {
        day:'2-digit',
        month:'short'
    }
    const dateResult=dateTaken.toLocaleDateString('en-US',dateOption)

    const forecastItem=`
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="weather/${getWeatherIcon(id)}"class="forecast-items-image">
            <h5 class="forecast-item-temp">${Math.round(temp)}</h5>
        </div>
    
    `

    forecastItemContainer.insertAdjacentHTML('beforeend',forecastItem)

}


function showDisplaySelection(section){
    [weatherInfoSection,searchCitySection,notFoundSection]
        .forEach(section => section.style.display='none ')
    section.style.display='flex'
}


