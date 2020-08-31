/*jshint esversion: 6 */

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js')
        .then((reg) => console.log("Service Worker Registered", reg))
        .catch((err) => console.log("Service Worker Not Registered", err));
}

var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        page: 'home', // home, entrances, parking, shuttles, map
        homeImg: 'icons/home_green.svg',
        mapImg: 'icons/map_grey.svg',
        home_selected: true,
        map_selected: false,
        showInstallMessage: false,
        showAndroidInstallMessage: false,
    },
    created: function (){
        this.PWA_popup();
    },
    methods: {
        PWA_popup: function(){
            const isIos = () => {
                const userAgent = window.navigator.userAgent.toLowerCase();
                return /iphone|ipad|ipod/.test( userAgent );
            };
              // Detects if device is in standalone mode
            const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
              
              // Checks if should display install popup notification:
            if (isIos() && !isInStandaloneMode()) {
                this.showInstallMessage = true;
            }else if(!isIos() && !isInStandaloneMode()) {
                this.showAndroidInstallMessage = true;
            }

            setTimeout(() => this.showInstallMessage = false, 15000);
            setTimeout(() => this.showAndroidInstallMessage = false, 15000);
        },
        parkingClicked: function(){
            this.page = 'parking';
        },
        entrancesClicked: function (){
            this.page = 'entrances';
        },
        shuttlesClicked: function (){
            this.page = 'shuttles';
        }
    }
});