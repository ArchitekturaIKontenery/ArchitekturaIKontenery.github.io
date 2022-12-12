import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import Alpine from 'alpinejs';

const appInsights = new ApplicationInsights({
  config: {
    connectionString: 'InstrumentationKey=a4f42d47-2bd5-43ca-b7ba-41f16efc3a7f;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/'
  }
});
appInsights.loadAppInsights();
appInsights.trackPageView();


window.Alpine = Alpine;

var sessions;
Alpine.start();
fetch('/watch-2022.json', { cache: "no-store" })
  .then((response) => response.json())
  .then((data) => { sessions = data; whichSession(); });

setInterval(function () {
  fetch('/watch-2022.json', { cache: "no-store" })
    .then((response) => response.json())
    .then((data) => {
      sessions = data;
      whichSession();
    });
}, 30 * 1000);

function whichSession() {
  var selectedSession;
  var currentTime = new Date();
  var currentDay = currentTime.getDay();
  var currentHour = String(currentTime.getHours()).padStart(2, '0');
  var currentMinutes = String(currentTime.getMinutes()).padStart(2, '0');
  var currentSeconds = String(currentTime.getSeconds()).padStart(2, '0');
  currentTimeString = `${currentHour}:${currentMinutes}:${currentSeconds}`;
  sessions.agenda.forEach(element => {
    if (currentDay == 12) {
      if (element.time <= currentTimeString) {
        selectedSession = element;
      }
    } else {
      selectedSession = sessions.agenda[0];
    }
  });
  let event = new CustomEvent('items-load', {
    detail: {
      selectedSession: selectedSession,
      isLoading: false,
      agenda: sessions.agenda
    }
  });
  window.dispatchEvent(event);
}

