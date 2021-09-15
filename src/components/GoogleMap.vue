<template>
  <div>
    <div class="row scroll-none">
      <div class="col map-sticky">
        <span class="position-absolute text-searching badge badge-light text-center" v-if="searchLoading">
          <div class="spinner-border spinner-border-sm mr-2" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <span>Searching...</span>
        </span>
        <transition leave-active-class="animate__animated animate__fadeOut animate__faster">
        <span class="position-absolute text-searching badge badge-light text-center" 
          v-if="afterLoading && !searchLoading">
          <span>{{circle_markers.length}} of {{markers.length}} results</span>
        </span>
        </transition>
        <Gmap-map
          ref="mapRef"
          :options="{
           zoomControl: true,
           mapTypeControl: true,
           scaleControl: true,
           streetViewControl: true,
           rotateControl: true,
           fullscreenControl: true,
           disableDefaultUi: true,
           zoomControlOptions: {position: 1},
           streetViewControlOptions: {position: 5}
          }"
          :center="center"
          :zoom="7.2"
          map-type-id="roadmap"
          style="width:100%;height: 100vh;"
          @center_changed="updateCenter"
          @zoom_changed="updateZoom"
          @tilesloaded="infoWinOpen = false"
          @idle="updateData">

          <Gmap-info-window 
            :options="infoOptions" 
            :position="infoWindowPos" 
            :opened="infoWinOpen">
          </Gmap-info-window>

          <Gmap-marker
            v-for="(m, index) in circle_markers"
            :key="index"
            :position="m.position"
            :icon="!m.clicked ? markerOptions : markerClicked"
            @click="markerInfoWindow(m,index)">
          </Gmap-marker>
        </Gmap-map>
      </div>
      <div class="col pr-0 pl-0 main">
        <div class="container mt-4">
          <!-- <div class="hov_none shadow-none m-t-35 card">
              <div class="row">
                <div class="mb-2 col-lg-4 col-md-6">
                  <h4 class=" fs-14"><i class=" fal fa-utensils mr-2 fs-16"></i>Retaurant:<span class=" font-weight-normal ml-1 text-secondary">{{distance_from.restaurant}} Km</span></h4>
                </div>
              </div>
          </div> -->

           <form class="mt-4">
           <div class="form-group">
              <!-- <label for="inputAddress" class="map-search-title">Location</label>
              <input type="text" class="form-control" id="inputAddress" placeholder="Enter Address, City or State"> -->
            </div>
          </form> 
        </div>
        <transition-group class="row p-3" tag="div"
          enter-active-class="animate__animated animate__fadeIn animate__faster"
          leave-active-class="animate__animated animate__fadeOut animate__faster">
           <div class="col-12" v-for="(m,index) in circle_markers" :key="m.name" 
            @mouseover="toggleInfoWindow(m,index)"
            @mouseout="infoWinOpen = !infoWinOpen">

            <app-card :name="m.name" :image="m.image" :location="m.location"></app-card>
           </div>
        </transition-group>
      </div>

    </div><!-- row -->
  </div>
</template>

<script>
import {gmapApi , markers} from 'vue2-google-maps'
import Card from './Card.vue'

export default {
  data() {
    return {
      center: { lat: 33.589886, lng: -7.603869 },
      searchLoading: false,
      afterLoading: false,
      circle_markers: [],
      current_position: {lat:  33.52516,lng: -7.64115}, 
      current_zoom: null,
      radius: null,
      current_distance: { 
        restaurant: {lat: null,lng: null},
      },
      distance_from:{
        restaurant: null,
      },
      markers: [

        /* Les Restaurants Connues à Casablanca */

        {position: {lat: 33.52236,lng:-7.64304},
          name:'Shore Street London',
          image:'ShoreStreet.jpg',
          location:'Bd 60, Casablanca',
          clicked: true
        },
        {position:{lat:  33.52143,lng: -7.64331},
          name:'Casablanca Shore',
          image:'CasaShore.jpg',
          location:'Lotissement Soufiane , Lot.N°135 Sidi Maarouf, Casablanca 20100',
          clicked: true
        },
        {position:{lat: 33.52138,lng:-7.64382},
          name:'Le Miams',
          image:'LeMiams.jpg',
          location:'Lotissement Soufiane Chaimaae N°128 Proche de Casanearshore porte Sud، Casablanca',
          clicked: true
        },
        {position:{lat: 33.52642,lng:-7.64184},
          name:'Boca Food Restaurants',
          image:'BocaFood.jpg',
          location:'Nearshore Park ,Casablanca , Maroc ',
          clicked: true
        },
        {position:{lat: 33.54034,lng: -7.64524},
          name:'Ligui Sidi Maarouf',
          image:'LiguiSidiMaarouf.JPG',
          location:'40, 4 Lotissement Mandarona، Casablanca 20250',
          clicked: true
        },
        {position:{lat: 33.53585,lng: -7.64079},
          name:'Pasta Oro',
          image:'Pasta Oro.JPG',
          location:'28 Lotissement La Colline II Sidi Maarouf، Casablanca',
          clicked: true
        },
        /////////////////////////////////////////////////////////////////////////

         {position:{lat: 33.58763 ,lng: -7.64225}, 
          name:'Il Ferrarino',
          image:'IlFerranio.jpg',
          location:'Angle Boulevard Massira al Khadra et, Rue du 4 Août, Casablanca 20100',
          clicked: true
        },
        /////////////////////////////////////////////////////////////////////////

         {position:{lat: 33.54858,lng:  -7.63708}, 
          name:'OLEA',
          image:'OLEA.JPG',
          location:'264 Rte de Oasis, Casablanca 20000',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////
         {position:{lat: 33.53260,lng: -7.64814},
          name:'Machaway Restaurant',
          image:'MachawayRestau.jpg',
          location:'Rue Al Moustakbal، Casablanca',
          clicked: true
        },
        /////////////////////////////////////////////////////////////////////////
         {position:{lat: 33.53779 ,lng: -7.64401}, 
          name:'One Way Steakhouse',
          image:'OneWaySteackHouse.jpg',
          location:'Av. Abou Bakr el Kadiri, Casablanca',
          clicked: true
        },
        /////////////////////////////////////////////////////////////////////////

         {position:{lat: 33.52868,lng: -7.64051},
          name:'Ipopito',
          image:'Ipopito.JPG',
          location:'Casablanca Nearshore, Casablanca',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

         {position:{lat: 33.52154,lng: -7.64494},
          name:'Brothers food',
          image:'BrotherFood.jpg',
          location:'ETAGE MAGASIN APPARTEMENT N°1 124 LOTISSEMENT SOUFIANE, Casablanca 20000',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

         {position:{lat: 33.52049,lng:-7.64892},
          name:'Sur le Toit',
          image:'SurLeToit.png',
          location:'Lot. Lina - 261, route 1029، Casablanca',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

         {position:{lat: 33.52049,lng: -7.64892},
          name:'Gastro Food',
          image:'GastroFood.jpg',
          location:'Casablanca 20201 Sidi Maarouf',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////
         {position:{lat: 33.55522,lng: -7.62381},
          name:'LES 7 MERS',
          image:'Pasta Oro.JPG',
          location:'6 Rte de Taddart, Casablanca 20000',
          clicked: true
        },
        /////////////////////////////////////////////////////////////////////////

         {position:{lat: 33.58308,lng: -7.64137},
          name:'La Closerie',
          image:'LaCloserie.jpg',
          location:'185 Bd Bir Anzarane, Casablanca 20000',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

         {position:{lat: 33.58748,lng: -7.61285},
          name:'Don Camillo',
          image:'DonCamillo.JPG',
          location:'8 Rue Abou Raqraq, Casablanca 20250',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

         {position:{lat: 33.59050,lng: -7.63813},
          name:'Organic Kitchen',
          image:'OrganicKitchen.jpg',
          location:'6-8 Rue Ahmed El Mokri, Casablanca 20000',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  33.60818,lng:  -7.65547},
          name:'Le Cabestan',
          image:'LeCabestan.JPG',
          location:'Phare El hank، 90 Bd de la Corniche, Casablanca 20000',
          clicked: true
        },


          /* Les Restaurants Connues à Mohamedia */


        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  33.70113,lng:  -7.36139},
          name:'Zohras Restaurant',
          image:'Zohras.JPG',
          location:'Bd Mohamed VI, Mohammédia',
          clicked: true
        },
        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  33.70151,lng:  -7.36161},
          name:'Restaurant O\'COIN',
          image:'Ocoin.JPG',
          location:'Ocoin café restaurant, bd mohammed vi riad essalam d 29، Mohammedia',
          clicked: true
        },
        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  33.70231,lng:  -7.37534},
          name:'l"Olivier',
          image:'Lolivier.JPG',
          location:'Résidence Californie II, Bd Hassan II, Mohammédia',
          clicked: true
        },
        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  33.70203,lng:  -7.37601},
          name:'Big Bamboo Gourmet-Pub',
          image:'BigBombo.JPG',
          location:'Bd Hassan II, Mohammédia',
          clicked: true
        },
        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  33.70358,lng:  -7.38663},
          name:'Chez Madame Andrée',
          image:'Andree.JPG',
          location:'Bd Moulay Youssef, Mohammédia 28830',
          clicked: true
        },
        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  33.69674,lng:  -7.39102},
          name:'Marius Mohammedia',
          image:'MariusMedia.JPG',
          location:'Rue Bourgogne, Mohammédia',
          clicked: true
        },
        /////////////////////////////////////////////////////////////////////////


        /* Les Restaurants les plus connues à Rabat */

         {position:{lat:  34.02354,lng:  -6.83881},
          name:'Restaurant de la Libération',
          image:'Liberation.JPG',
          location:'256 Av. Mohammed V, Rabat 10030',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  34.01599,lng:  -6.83907},
          name:'Cosmopolitan',
          image:'cosmo.JPG',
          location:'Av. Ibn Toumart, Rabat 10000',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  34.00069,lng:  -6.84608},
          name:'Le Georges',
          image:'LeGorges.JPG',
          location:'5 Rue Oued Baht, Rabat',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  34.01718,lng:  -6.83195},
          name:'Ty Potes',
          image:'Typotes.JPG',
          location:'11 Rue Ghafsa, Rabat 10000',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

        {position:{lat:  34.02893,lng:  -6.83235},
          name:'Le Dhow Bar Lounge',
          image:'dhow.jpg',
          location:'Quai de Bouregreg، Av. Al Marsa, Rabat 10000',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  33.98668,lng:  -6.82831},
          name:'Le Picolo\'s',
          image:'picolo.JPG',
          location:'Av. Mohamed VI, Rabat 10170',
          clicked: true
        },


        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  33.98987,lng:  -6.83767},
          name:'Golden Fish',
          image:'goldenfish.JPG',
          location:'BP 450 Souissi, Rabat 10000',
          clicked: true
        },


        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  34.02183,lng:  -6.84195},
          name:'Dar Naji Rabat Hassan',
          image:'darnaji.jpg',
          location:'Av. Jazirat Al Arabe, Rabat',
          clicked: true
        },


        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  34.01564,lng:  -6.82159},
          name:'Il Giardino',
          image:'giardino.JPG',
          location:'2 bis e, Av. Ahmed Lyazidi, Rabat',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  33.99648,lng:  -6.84563},
          name:'Limonadier',
          image:'limonadier.JPG',
          location:'16 Rue Jabal Oukaïmeden, Rabat',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  33.99494,lng:  -6.84545},
          name:'Two Brothers',
          image:'towbrothers.JPG',
          location:'44 Av. des Nations Unies, Rabat 10080',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  33.99650,lng:  -6.84818},
          name:'L\'entrecôte',
          image:'entrecote.JPG',
          location:'Phare El hank، 90 Bd de la Corniche, Casablanca 20000',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  33.99311,lng:  -6.84786},
          name:'La Bodega Toro Loco',
          image:'labodega.JPG',
          location:'30 Av. Michlifen, Rabat',
          clicked: true
        },

        /////////////////////////////////////////////////////////////////////////

         {position:{lat:  33.99942,lng:  -6.84451},
          name:'Ilham Chef',
          image:'ilhamchef.JPG',
          location:'52 Av. Omar Ibn Al Khattab, Rabat',
          clicked: true
        },
      ],
      markerOptions: {
        url: markers,
        scaledSize: {width: 50, height: 50, f: 'px', b: 'px'},
      },
      markerClicked: {
        url: markers,
        scaledSize: {width: 50, height: 50, f: 'px', b: 'px'},
      },

      infoWindowPos: null,
      infoWinOpen: false,
      currentMidx: null,
        
      infoOptions: {
        content: '',
        pixelOffset: {
          width: 0,
          height: -35
        }
      },

    }
  },

  computed: {
    google: gmapApi
  },

  methods:{
    rad(x){
      return x * Math.PI / 180
    },
    getDistance(p1,p2){
      /* Haversine formula */
      let R = 6378137 // Earth’s mean radius in meter
      let dLat = this.rad(p2.lat() - p1.lat())
      let dLong = this.rad(p2.lng() - p1.lng())
      let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2)
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      let d = R * c
      return d // returns the distance in meter
    },
    callbackRestaurant(results,status){
      if (status == this.google.maps.places.PlacesServiceStatus.OK) {
        let last = results[0]
        this.current_distance.restaurant.lat = last.geometry.location.lat()
        this.current_distance.restaurant.lng = last.geometry.location.lng()
      }
    },
    getDistanceTo(){
      let current_cursor = new this.google.maps.LatLng(this.current_position.lat,this.current_position.lng)
      // object map
      let map = new this.google.maps.places.PlacesService(this.$refs['mapRef'].$mapObject)
      // search nearby restaurant from current cursor
      map.nearbySearch({
        location: current_cursor, //Add initial lat/lon here
        rankBy: this.google.maps.places.RankBy.DISTANCE,
        type: ['restaurant'],
      }, this.callbackRestaurant);

      let restaurant = new this.google.maps.LatLng(this.current_distance.restaurant.lat,
        this.current_distance.restaurant.lng)

      this.distance_from.restaurant = (this.getDistance(current_cursor,restaurant) / 1000).toFixed(2)

    },
    updateZoom(e){
      this.current_zoom = e
    },
    updateCenter(e) {
      this.current_position.lat = e.lat()
      this.current_position.lng = e.lng()
    },
    updateData(){
      this.getDistanceTo()

      this.searchLoading = true
      setTimeout(() => {
        this.searchLoading = false

        if (this.current_zoom){
          if (this.current_zoom <= 7){
            this.circle_markers = []
            return false
          }
          if (this.current_zoom == 8) this.radius = 60 * 1000 // 60 km
          if (this.current_zoom == 9) this.radius = 50 * 1000 // 50 km
          if (this.current_zoom == 10) this.radius = 30 * 1000 // 30 km
          if (this.current_zoom == 11) this.radius = 20 * 1000 // 20 km
          if (this.current_zoom >= 12) this.radius = 10 * 1000 // 10 km
          if (this.current_zoom >= 13) this.radius = (30 * 1000) / this.current_zoom
        }

        // default radius in meters
        let searchArea = new this.google.maps.Circle({
          center : new this.google.maps.LatLng(this.current_position.lat,this.current_position.lng),
          radius : this.radius
        });

        this.circle_markers = []

        this.markers.map((x) => {
          let marker_position = new this.google.maps.LatLng(x.position.lat,x.position.lng)
          if (this.google.maps.geometry.spherical.computeDistanceBetween(marker_position, searchArea.getCenter()) 
            <= searchArea.getRadius()) {
              this.circle_markers.push(x)
            }
        })

        this.afterLoading = true
      }, 1000)
    },
    toggleInfoWindow (marker, idx) {
      let content = `
      <h6 class="font-weight-bold" style="padding:15px;padding-bottom:7px;"> 
        ${marker.price} 
      </h6>`

      this.infoWindowPos = marker.position;
      this.infoOptions.content = content;

      this.infoWinOpen = true;
      this.currentMidx = idx;
    },

    markerInfoWindow (marker,idx){
      let content = `
      <img src="/properties/${marker.image}" class="img-marker">
      <div class="info">
        <div class="location text-truncate">
        <i class="fal fa-map-marker-alt mr-1"></i> <span class="text-secondary">${marker.location}</span>
        </div>
        <div class="title mt-2 text-truncate">
          ${marker.name}
        </div>
      </div>`

      this.infoWindowPos = marker.position;
      this.infoOptions.content = content;

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and rest current marker index
      else {
        marker.clicked = true
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    }
  },
  mounted(){
    // set to global
    this.current_position.lat = this.center.lat
    this.current_position.lng = this.center.lng
    this.radius = 30 * 1000 // 30 km
  },
  updated(){
    this.getDistanceTo()
  },
  components:{
    appCard:Card
  }
}
</script>

<style>
@import '../assets/fontawesome/css/all.css';

.gm-ui-hover-effect { display: none !important; }
.gm-style-iw-d {overflow:hidden !important;}
.gm-style .gm-style-iw-t::after{top:38px;}
.gm-control-active.gm-fullscreen-control{border-radius: 8px !important;}

.gm-style .gm-style-iw-c{
  padding: 0px;
  top:40px;
  border-radius:12px;
}
.map-search-title {
    font-weight: 600 !important;
    color: rgb(34, 34, 34) !important;
}
.btn-red-hot {
  background-color: #ff385c;
  color: #fff;
}
.btn-red-hot:hover {
    background-color: #ff385c;
    color: #fff;
}
.info {
    padding: 10px;
    text-align: left;
    overflow-wrap: break-word;
}
.info .location{
  font-size: 14px !important;
  max-width:230px;
}
.info .title {
    font-weight: 400 !important;
    color: rgb(34, 34, 34) !important;
    font-size: 16px !important;
    padding-bottom: 5px;
    max-width: 230px;
}
.info .price {
  color: rgb(34, 34, 34) !important;
  font-weight: 800;
  font-size: 16px !important;
}
.img-marker {
  object-fit: cover;
  width: 250px;
  height: 200px;
}
.text-searching{
  z-index: 10;
  margin: 0 auto;
  top: 2rem;
  font-size: 1rem;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 15px 20px;
  align-items: center !important;
  justify-content: center !important;
  background: rgb(255, 255, 255) !important;
  border-radius: 8px !important;
}
.gmnoprint > div {
  border-radius: 8px !important;
}
.map-sticky {
  position: sticky;
  top: 0px;
}
.main {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100vh;
}
.scroll-none {
  width: 100vw;
}
.main::-webkit-scrollbar {
    display: none;
}
.property-distance h3{
  color: rgb(34,34,34) !important;
  font-size: 22px !important;
}
.fs-14{
  font-size: 14px;
}
</style>
