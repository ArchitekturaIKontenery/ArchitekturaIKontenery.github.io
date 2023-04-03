import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse'

window.getEdition = async function (edition) {
  let data = localStorage.getItem('accessToken');
  let headers = new Headers();
  if (data != null) {
    console.log('auth');
    headers.append('Authorization', 'Bearer ' + data);
  }
  let response = await fetch('/api/materials/' + edition, {
    headers: headers
  });
  return await response.json();
}

window.auth = async function (mail) {
  let response = await fetch('/api/auth/' + mail);
  if (response.status == 200) {
    let token = await response.text();
    localStorage.setItem('accessToken', token);
    return true;
  } else {
    ml('show', 'XCycHU', true);
    return false;
  }
}

Alpine.plugin(collapse);

const appInsights = new ApplicationInsights({
  config: {
    connectionString: 'InstrumentationKey=a4f42d47-2bd5-43ca-b7ba-41f16efc3a7f;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/'
  }
});
appInsights.loadAppInsights();
appInsights.trackPageView();

window.Alpine = Alpine;
Alpine.start();

document.addEventListener('DOMContentLoaded', function () {
  // open
  const burger = document.querySelectorAll('.navbar-burger');
  const menu = document.querySelectorAll('.navbar-menu');

  if (burger.length && menu.length) {
    for (var i = 0; i < burger.length; i++) {
      burger[i].addEventListener('click', function () {
        for (var j = 0; j < menu.length; j++) {
          menu[j].classList.toggle('hidden');
        }
      });
    }
  }

  // close
  const close = document.querySelectorAll('.navbar-close');
  const backdrop = document.querySelectorAll('.navbar-backdrop');

  if (close.length) {
    for (var i = 0; i < close.length; i++) {
      close[i].addEventListener('click', function () {
        for (var j = 0; j < menu.length; j++) {
          menu[j].classList.toggle('hidden');
        }
      });
    }
  }

  if (backdrop.length) {
    for (var i = 0; i < backdrop.length; i++) {
      backdrop[i].addEventListener('click', function () {
        for (var j = 0; j < menu.length; j++) {
          menu[j].classList.toggle('hidden');
        }
      });
    }
  }
});