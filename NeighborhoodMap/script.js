 var map;


//Hotspot coordinates
 var locations = [{
     title: 'Amanora Town Center',
     location: {
         lat: 18.518004,
         lng: 73.935088
    }
 }, {
     title: 'SGS Mall',
     location: {
         lat: 18.519580,
         lng: 73.877374
    }
 }, {
     title: 'Sigree Global Grill',
     location: {
         lat: 18.539202,
         lng: 73.876126
    }
 }, {
     title: 'Shaniwar Wada Fort',
     location: {
         lat: 18.519324,
         lng: 73.855956
    }
 }, {
     title: 'City Pride Theatre',
     location: {
          lat: 18.523984,
          lng: 73.854561
     }
}];



//This is the Model.
/*Upon passing a location to the Place function, we create an object consisting of parameters
  such as name, lat and long. */
 var Place = function(temp) {
    var self = this;
     this.name = temp.title;
     this.lat = temp.location.lat;
     this.lng = temp.location.lng;
     this.URL = "";
     this.street = "";
     this.city = "";
     this.phone = "";

     this.visible = ko.observable(true);


    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.lng + '&client_id=' + '31ZYASUBGZMRRCNP0LAFP11YE0FVXG3CKWZBGLQJSZHZGBFM'+ '&client_secret=' + 'JEZK0EWVGVG4TEWGNP5W02JECDMBD0T3GESUXPBOY1QMMS2V' + '&v=20160118' + '&query=' + this.name;

    //Calling FourSquare API.
    //API explored using link: https://developer.foursquare.com/docs/explore#req=venues/search%3FproviderId%3Dnymag%26linkedId%3D59455
    $.getJSON(foursquareURL).done(function(data) {
        var results = data.response.venues[0];
        self.URL = results.url;
        if (typeof self.URL === 'undefined'){
            self.URL = "No URL available";
        }
        self.street = results.location.formattedAddress[0];
        self.city = results.location.formattedAddress[1];
        self.phone = results.contact.phone;
        if(typeof self.phone === 'undefined') {
            self.phone = 'No phone number available';
        }

    }).fail(function() {
        alert("Error with FourSquare API call. Please try refreshing the page.");
    });



     this.infoWindow = new google.maps.InfoWindow({
         content: self.contentString
     });

    //we need to create markers for each location, hence we need to keep the marker function in
    //Model, as every location is being passed to it.
     this.marker = new google.maps.Marker({
         position: new google.maps.LatLng(temp.location.lat, temp.location.lng),
         map: map,
         title: temp.title
     });


     this.showMarker = ko.computed(function() {
         if (this.visible() === true) {
             this.marker.setMap(map);
         } else {
             this.marker.setMap(null);
         }
         return true;
     }, this);


     this.marker.addListener('click', function() {

         self.contentString = '<div class="info-window-content"><div class="title"><b>' + temp.title + "</b></div>" +
        '<div class="content"><a href="' + self.URL +'">' + self.URL + "</a></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>" +
        '<div class="content"><a href="tel:' + self.phone +'">' + self.phone +"</a></div></div>";



         self.infoWindow.setContent(self.contentString);


         self.infoWindow.open(map, this);

         self.marker.setAnimation(google.maps.Animation.BOUNCE);

         setTimeout(function() {
            self.marker.setAnimation(null);
        }, 2100);


     });
 };







 var ViewModel = function() {

    //As searchTerm and Plocations my change constantly, we declare them as observables
     this.searchTerm = ko.observable("");
     this.Plocations = ko.observableArray([]);
     var self = this;

     locations.forEach(function(loc) {
         self.Plocations.push(new Place(loc));
     });


     //Create filtered list based on input taken by user.
     this.filteredList = ko.computed(function() {
         var filter = self.searchTerm().toLowerCase();
         if (!filter) {
             self.Plocations().forEach(function(loc) {
                 loc.visible(true);
             });
             return self.Plocations();
         } else {
             return ko.utils.arrayFilter(self.Plocations(), function(loc) {
                 var string = loc.name.toLowerCase();
                 var result = (string.search(filter) >= 0);
                 loc.visible(result);
                 return result;
             });
         }
     }, self);

     this.mapElem = document.getElementById('map');

     this.bounce = function(place) {
        var self = this;
        console.log(this);
        place.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            place.marker.setAnimation(null);
        }, 2100);
        google.maps.event.trigger(self.marker, 'click');


    };

 };



//Applying bindings
 function initiate() {
    map = new google.maps.Map(document.getElementById('map'), {
         center: {
             lat: 18.520430,
             lng: 73.856744
         },
         zoom: 13,
         mapTypeControl: false
     });
     ko.applyBindings(new ViewModel());
 }

 function errorHandling() {
    alert("Google Maps has failed to load. Please recheck your connection.");
}




