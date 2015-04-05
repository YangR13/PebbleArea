var UI = require('ui');
var ajax = require('ajax');

// Create a Card with title and subtitle
var loadCard = new UI.Card({
  title:'Area',
  subtitle:'Loading...'
});

loadCard.show();

// Construct URL
var lat;
var lng;
var radius = 400;

function locationSuccess(pos) {
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  lat = pos.coords.latitude;
  lng = pos.coords.longitude;
  console.log(lat +', '+ lng);
  
  getMapData("");
}
function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}
var locationOptions = {
    enableHighAccuracy: true, 
    maximumAge: 10000, 
    timeout: 10000
};
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);

var key = 'AIzaSyDL1iMmBxhXFEBjVMSVX2nf0o-Ee4ZzMgQ';
var URL;
var locations = [];

function getMapData(tokenStr) {
  URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lng+'&radius='+radius+'&key='+key+tokenStr;
  ajax({url: URL, type: 'json'}, function(data) {
    console.log('Data: '+data.results.length);
    locations = locations.concat(data.results);
    if(data.next_page_token) {
      setTimeout( function(){
        getMapData('&pagetoken='+data.next_page_token);  //Recurses here
      }, 1000);
      console.log('Token: '+data.next_page_token);
      console.log("RECURSING!");
    }else{
      formatMenuData();
      showMenu();
    }
  },function(error) {
    console.log('Failed fetching location data: ' + error);
  });
}

var mainMenu;
var foodMenu;
var natureMenu;
var urbanMenu;
var activitiesMenu;
var servicesMenu;
var transportMenu;
var shoppingMenu;
var governmentMenu;
var genericMenu;
var postlifeMenu;
var religionMenu;
var educationMenu;

function formatMenuData() {
  // MAIN MENU
  var mainItems = [];

  var catalogItems = [];
  for(var i=0; i<catalog.length; i++) {
    catalogItems.push([]);
  }
  
  // Sort locations returned by google places api
  for(var i=0; i<locations.length; i++) {
    for(var j=0; j<catalog.length; j++) {
      if(catalog[j].places.indexOf(locations[i].types[0]) != -1) {
        catalogItems[j].push({title:locations[i].name, subtitle:locations[i].types[0]});
        catalog[j].count++;
        continue;
      }
    }
  }
  
  for(var i=0; i<catalog.length; i++) {
    if(catalog[i].count == '0') continue;
    mainItems.push({title:catalog[i].category.toUpperCase()+' ('+catalog[i].count+')'});
  }
  if(mainItems.length <= 0) {
    mainItems.push({title: 'NOTHING HERE'});
  }
  mainMenu = new UI.Menu({
    sections: [{
      title: 'Main Menu',
      items: mainItems
    }]
  });
  
  mainMenu.on('select', function(e) {
    var id;
    var count = 0;
    for(id=0; id<catalog.length; id++){
      if(catalog[id].count != '0') count++;
      if(count == e.itemIndex+1) break;
    }
    switch(id) {
      case 0: foodMenu.show(); break;
      case 1: natureMenu.show(); break;
      case 2: urbanMenu.show(); break;
      case 3: activitiesMenu.show(); break;
      case 4: servicesMenu.show(); break;
      case 5: transportMenu.show(); break;
      case 6: shoppingMenu.show(); break;
      case 7: governmentMenu.show(); break;
      case 8: genericMenu.show(); break;
      case 9: postlifeMenu.show(); break;
      case 10: religionMenu.show(); break;
      case 11: educationMenu.show(); break;
    }
  });
  
  foodMenu = new UI.Menu({
    sections: [{
      title: 'Food',
      items: catalogItems[0]
    }]
  });
  natureMenu = new UI.Menu({
    sections: [{
      title: 'Nature',
      items: catalogItems[1]
    }]
  });
  urbanMenu = new UI.Menu({
    sections: [{
      title: 'Urban',
      items: catalogItems[2]
    }]
  });
  activitiesMenu = new UI.Menu({
    sections: [{
      title: 'Activities',
      items: catalogItems[3]
    }]
  });
  servicesMenu = new UI.Menu({
    sections: [{
      title: 'Services',
      items: catalogItems[4]
    }]
  });
  transportMenu = new UI.Menu({
    sections: [{
      title: 'Transport',
      items: catalogItems[5]
    }]
  });
  shoppingMenu = new UI.Menu({
    sections: [{
      title: 'Shopping',
      items: catalogItems[6]
    }]
  });
  governmentMenu = new UI.Menu({
    sections: [{
      title: 'Government',
      items: catalogItems[7]
    }]
  });
  genericMenu = new UI.Menu({
    sections: [{
      title: 'Generic',
      items: catalogItems[8]
    }]
  });
  postlifeMenu = new UI.Menu({
    sections: [{
      title: 'Post Life',
      items: catalogItems[9]
    }]
  });
  religionMenu = new UI.Menu({
    sections: [{
      title: 'Religion',
      items: catalogItems[10]
    }]
  });
  educationMenu = new UI.Menu({
    sections: [{
      title: 'Education',
      items: catalogItems[11]
    }]
  });
}

function showMenu() {
  mainMenu.show();
  loadCard.hide();
}

var catalog = [
  {category:'food', count: 0, places:['bakery', 'cafe', 'food', 'meal_delivery', 'meal_takeaway', 'restaurant']},
  
  {category:'nature', count: 0, places:['campground', 'park', 'natural_feature']},

  {category:'urban', count: 0, places:['gas_station', 'parking', 'rv_park']},

  {category:'activities', count: 0, places:['art_gallery', 'museum', 'amusement_park', 'aquarium', 'bowling_alley', 'casino', 'movie_theater', 'stadium', 'zoo', 'bar', 'night_club']},

	{category:'services', count: 0, places:['atm', 'bank', 'accounting', 'beauty_salon', 'car_dealer', 'car_repair', 'car_wash', 'dentist', 'doctor', 'electrician', 'finance', 'general_contractor', 'gym', 'hair_care', 'health', 'hospital', 'insurance_agency', 'laundry', 'lawyer', 'locksmith', 'lodging', 'painter', 'physiotherapist', 'plumber', 'real_estate_agency', 'roofing_contractor', 'movie_rental', 'moving_company', 'spa', 'storage', 'veterinary_care', 'travel_agency']},

	{category:'transport', count: 0, places:['airport', 'bus_station', 'car_rental', 'subway_station', 'taxi_stand', 'train_station', 'transit_station']},

	{category:'shopping', count: 0, places:['bicycle_store', 'book_store', 'clothing_store', 'convenience_store', 'electronics_store', 'grocery_or_supermarket', 'hardware_store', 'jewelry_store', 'liquor_store', 'pet_store', 'pharmacy', 'shoe_store', 'shopping_mall', 'store']},

	{category:'government', count: 0, places:['city_hall', 'courthouse', 'firestation', 'local_government_office', 'police', 'post_office', 'political']},

	{category:'generic', count: 0, places:['establishment', 'locality', 'point_of_interest']},

	{category:'postlife', count: 0, places:['cemetery', 'funeral_home']},

	{category:'religion', count: 0, places:['church', 'hindu_temple', 'mosque', 'synagogue', 'place_of_worship']},

	{category:'education', count: 0, places:['library', 'school', 'university']}
];