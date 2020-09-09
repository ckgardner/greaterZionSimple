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

        southEntranceIcon: '',
        eastEntranceIcon: '',
        riverEntranceIcon: '',
        kolobEntranceIcon: '',
        southEntranceBusiness: '',
        eastEntranceBusiness: '',
        riverEntranceBusiness: '',
        kolobEntranceBusiness: '',

        zionParkingDistance: 0.2,
        overflowDistance: 1.2,
        zionFillTime: "",
        overflowFillTime: "",
        zionVisitorStat: '',
        overflowStat: '',
        zionVisitorSvg: '#5f8e2d',
        overflowSvg: '#5f8e2d',
        zionVisitorBar: '',
        overflowBar: '',

        smallShuttleMessage: false,

        parkingMap: 'mapbox/visitor_gray.jpg',
        visitorMap: 'mapbox/visitor_gray.jpg',
        overflowMap: 'mapbox/overflow_gray.jpg',
        visitor_selected: true,
        overflow_selected: false,
        zoneA_selected: false,
        zoneB_selected: false,
        zoneC_selected: false,
        entranceMap: 'mapbox/south_gray.jpg',
        southMap: 'mapbox/south_gray.jpg',
        eastMap: 'mapbox/east_gray.jpg',
        riverMap: 'mapbox/river_gray.jpg',
        kolobMap: 'mapbox/kolob_gray.jpg',
        south_selected: false,
        east_selected: false,
        river_selected: false,
        kolob_selected: false,
    },
    created: function (){
        this.PWA_popup();
        this.loadEntrances();
        this.loadParking();
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
        bottomNavImg: function(NewTab) {
            switch(NewTab) {
                case 'home':
                    this.homeImg = 'icons/home_green.svg'; this.mapImg = 'icons/map_grey.svg'; 
                    this.home_selected=true;  this.map_selected=false; 
                    break;
                case 'map':
                    this.homeImg = 'icons/home_grey.svg'; this.mapImg = 'icons/map_green.svg'; 
                    this.home_selected=false;  this.map_selected=true; 
                    break;
            }
        },
        parkingClicked: function(){
            this.page = 'parking';
        },
        entrancesClicked: function (){
            this.page = 'entrances';
        },
        shuttlesClicked: function (){
            this.page = 'shuttles';
        },
        getAPIData_safe: function (data, fields, def){
			//data = json object api return data
			//fields = array of data fields tree
			//def = default return value if nothing is found
			var ret = def;
			var multiEntrance = false;
			try{
				if(i == 0 && tdata.hasOwnProperty(f + "1")){multiEntrance = true;}
				var tdata = data;
				for(var i = 0; i < fields.length; i++){
					let f = fields[i];
					if(tdata.hasOwnProperty(f)){
						if(i == fields.length - 1){
							ret = tdata[f];
						}else{
							tdata = tdata[f];
						}
					}
				}
			}catch(err){
				console.log(err);
			}
			return ret;
        },
        loadEntrances: function (){
            axios.get("https://trailwaze.info/zion/vehicleTraffic_request.php?site=zionsouthin").then(response =>{
                var SE = response.data.zionsouthin.rotate100;
                if(SE < 33){
                    this.southEntranceBusiness = "Not too busy";
                    this.southEntranceIcon = "icons/entrance_low.svg";
                    this.southMap = 'mapbox/south_green.jpg';
                }else if(SE < 66){
                    this.southEntranceBusiness = "A little busy";
                    this.southEntranceIcon = "icons/entrance_moderate.svg";
                    this.southMap = 'mapbox/south_yellow.jpg';
                }else{
                    this.southEntranceBusiness = "As busy as it gets";
                    this.southEntranceIcon = "icons/entrance_high.svg";
                    this.southMap = 'mapbox/south_red.jpg';
                }
            }).catch(error =>{
                console.log("Could not load South Entrance", error);
            });
            axios.get("https://trailwaze.info/zion/vehicleTraffic_request.php?site=zioneastin").then(response =>{
                var E = response.data.zioneastin.rotate100;
                if(E < 33){
                    this.eastEntranceBusiness = "Not too busy";
                    this.eastEntranceIcon = "icons/entrance_low.svg";
                    this.eastMap = 'mapbox/east_green.jpg';
                }else if(E < 66){
                    this.eastEntranceBusiness = "A little busy";
                    this.eastEntranceIcon = "icons/entrance_moderate.svg";
                    this.eastMap = 'mapbox/east_yellow.jpg';
                }else{
                    this.eastEntranceBusiness = "As busy as it gets";
                    this.eastEntranceIcon = "icons/entrance_high.svg";
                    this.eastMap = 'mapbox/east_red.jpg';
                }
            }).catch(error =>{
                console.log("Could not load East Entrance", error);
            });
            axios.get("https://trailwaze.info/zion/vehicleTraffic_request.php?site=zionbridge").then(response =>{
                var R = response.data.zionbridge.rotate100;
                if(R < 33){
                    this.riverEntranceBusiness = "Not too busy";
                    this.riverEntranceIcon = "icons/entrance_low.svg";
                    this.riverMap = 'mapbox/river_green.jpg';
                }else if(R < 66){
                    this.riverEntranceBusiness = "A little busy";
                    this.riverEntranceIcon = "icons/entrance_moderate.svg";
                    this.riverMap = 'mapbox/river_yellow.jpg';
                }else{
                    this.riverEntranceBusiness = "As busy as it gets";
                    this.riverEntranceIcon = "icons/entrance_high.svg";
                    this.riverMap = 'mapbox/river_red.jpg';
                }
            }).catch(error =>{
                console.log("Could not load River Entrance", error);
            });
            this.kolobEntranceIcon = "icons/entrance_low.svg";
            this.kolobEntranceBusiness = "Not too busy";
            this.kolobMap = 'mapbox/kolob_green.jpg';
            
        },
        splitTime: function(time){
            var p1 = time.split(':')[0];
            var p2 = time.split(':')[1];
            return [p1, p2];
        },
        loadParking: function (){
            axios.get("https://trailwaze.info/zion/request.php").then(response => {
                var TOD = "AM";
                //Visitor Center: Today
                this.zionVisitorStat = this.getAPIData_safe(response.data, ["ParkingVisitorCenter", "Today", "count"], 0);
                var zft = this.getAPIData_safe(response.data, ["ParkingVisitorCenter", "Today", "full_time"], 0);
                if(zft == "UNK"){
                    this.zionFillTime = "";
                }else{
                    var zft1 = this.splitTime(zft)[0];
                    var zft2 = this.splitTime(zft)[1];
                    if (zft1 >= 13){
                        zft -= 12;
                        TOD = "PM";
                    }
                    zft = zft1 + ":" + zft2 + " " + TOD;
                    this.zionFillTime = zft;
                }
                
   
                //Overflow: Today
                this.overflowStat = this.getAPIData_safe(response.data, ["ParkingOverflow", "Today", "count"], 0);
                var oft = this.getAPIData_safe(response.data, ["ParkingOverflow", "Today", "full_time"], 0);
                if(oft == "UNK" || oft == 0){
                    this.overflowFillTime = this.zionFillTime;
                }else{
                    var oft1 = this.splitTime(oft)[0];
                    var oft2 = this.splitTime(oft)[1];
                    if (oft1 >= 13){
                        oft -= 12;
                        TOD = "PM";
                    }
                    oft = oft1 + ":" + oft2 + " " + TOD;
                    this.zionFillTime = oft;
                }

                if (this.zionVisitorStat < 33){
                    this.zionVisitorSvg = '#5F8F2C';
                    this.visitorMap = 'mapbox/visitor_green.jpg';
                }
                if (this.zionVisitorStat < 66){
                    this.zionVisitorSvg = '#ffcd31';
                    this.visitorMap = 'mapbox/visitor_yellow.jpg';
                }
                else{
                    this.zionVisitorSvg = '#ef6565';
                    this.visitorMap = 'mapbox/visitor_red.jpg';
                }
                if (this.overflowStat < 33){
                    this.overflowSvg = '#5F8F2C';
                    this.overflowMap = 'mapbox/overflow_green.jpg';
                }
                if (this.overflowStat < 66){
                    this.overflowSvg = '#ffcd31';
                    this.overflowMap = 'mapbox/overflow_yellow.jpg';
                }
                else{
                    this.overflowSvg = '#ef6565';
                    this.overflowMap = 'mapbox/overflow_red.jpg';
                }
                this.zionVisitorBar = this.zionVisitorStat + "%";
                this.overflowBar = this.overflowStat + "%";
            }).catch(error => {
                console.log("Could not load Zion Parking Stats", error);
            });
        },
        parkingBtn: function(img){
            var map;
            this.visitor_selected = this.overflow_selected = this.zoneA_selected = this.zoneB_selected = this.zoneC_selected = false;
            if (img == 'visitor'){
                map = this.visitorMap;
                this.visitor_selected = true;
            }else if(img == 'overflow'){
                map = this.overflowMap;
                this.overflow_selected = true;
            }else if(img == 'zoneA'){
                map = 'mapbox/zone_a.jpg';
                this.zoneA_selected = true;
            }else if(img == 'zoneB'){
                map = 'mapbox/zone_b.jpg';
                this.zoneB_selected = true;
            }else if(img == 'zoneC'){
                map = 'mapbox/zone_c.jpg';
                this.zoneC_selected = true;
            }
            this.parkingMap = map;
        },
        entranceBtn: function(img){
            var map;
            this.south_selected = this.east_selected = this.river_selected = this.kolob_selected = false;
            if (img == 'south'){
                map = this.southMap;
                this.south_selected = true;
            }else if(img == 'east'){
                map = this.eastMap;
                this.east_selected = true;
            }else if(img == 'river'){
                map = this.riverMap;
                this.river_selected = true;
            }else if(img == 'kolob'){
                map = this.kolobMap;
                this.kolob_selected = true;
            }
            this.entranceMap = map;
        },
        headerClicked: function(){
            this.message_show = false;
        }
    }
});