"use strict";

let script = document.createElement('script');
let nav = 0; //Jelenlegi hónaphoz képest hol vagyunk
let clicked = null; //A dátum, amire kattintunk
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
let jsonArray = "";

//Ha sikerül összeszedni az eseményeket, bontsa fel, különben legyen üres.

const calendar = document.getElementById('calendar'); //A HTML-ben megadott calendar
const eventModal = document.getElementById('eventModal');
const backDrop = document.getElementById('modalBackDrop')
const eventTitle = document.getElementById('eventTitle');
const weekdays = ['hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat', 'vasárnap'];

const HTML = "https://raw.githubusercontent.com/SasPatrik95/Calendar/main/data.json"

function openModal(date)
{
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if(eventForDay)
    {
        document.getElementById('eventTitle').innerText = eventForDay.title;
        document.getElementById('eventText').innerText = eventForDay.description;
        eventModal.style.display = 'block';
    }

    backDrop.style.display = 'block';
    
}

function JsonToEvents()
{
    jsonArray.forEach(function(item, index) {
        let obj = jsonArray[index];
        saveEvent(obj)
    })
    console.log(jsonArray[0].date);
}

function saveEvent(obj)
{
    let eventForDay = events.find(e => e.date === obj.date);
    if(!eventForDay)
    {
        events.push ({
            title: obj.name,
            date: obj.date,
            time: obj.time,
            location: obj.location,
            description: obj.description,
            fblink: obj.link
        });
    
        localStorage.setItem('events', JSON.stringify(events));
    }
}

function load() {
    const dt = new Date();

    if (nav !== 0)
    {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    //Napok
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate(); //Következő hónaphoz képest előző hónap utolsó napja
    const lastMonth = new Date(year, month, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('hu-hu', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    const paddingDays = weekdays.indexOf(dateString.split(', ')[1]);//Napok száma, ami kimarad a hónap elején.

    //Hónap
    document.getElementById('monthDisplay').innerText = 
    `${year}. ${dt.toLocaleDateString('hu-hu', { month: 'long' })}`;

    calendar.innerHTML = ''; //Törli az eddig létrehozott naptárat

    for(let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');    //Létrehozunk egy div-et              

        const dayString = `${year}/${month + 1}/${i - paddingDays}`;

        if (i > paddingDays) {
          daySquare.classList.add('day');
          daySquare.innerText = i - paddingDays;

          const eventForDay = events.find(e => e.date === dayString);

          if (i - paddingDays === day && nav === 0) {
            daySquare.id = 'currentDay';
          }

          if (eventForDay) {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');
            eventDiv.innerText = eventForDay.title + "\n" + eventForDay.time;
            daySquare.appendChild(eventDiv);
          }
          
          daySquare.addEventListener('click', () => openModal(dayString));
        } else {
            daySquare.classList.add('inactive');
            daySquare.innerText = lastMonth - paddingDays + i;
        }
        
        calendar.appendChild(daySquare);
    }
    //console.log(paddingDays);
}

function closeModal() {
    eventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitle.value = '';
    clicked = null;
    load();
}

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    });

    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });
    document.getElementById('closeButton').addEventListener('click', closeModal);
    load();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

$(document).ready(() => {
    function startUp(){
        load();
        initButtons();
    }
    fetch(HTML)
    .then(function(resp){
        return resp.json();
    })
    .then(function(data){
        jsonArray = data;
    })
    .then(() => {
        JsonToEvents();
        startUp();
    });
});
