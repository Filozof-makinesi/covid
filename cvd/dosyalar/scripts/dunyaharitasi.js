var map;// Google haritasını başlat
function initMap() 
{
	map = new google.maps.Map(document.getElementById('map'), {
    zoom      : 2,
    center    : new google.maps.LatLng(36.3932, 25.4615),
    mapTypeId : 'hybrid'//roadmap,satellite,hybrid ,terrain 
  });// js dosyasındaki salgın verilerine erişmek için bir <script> etiketi oluşturun
  var script = document.createElement('script');
  script.src = 'dosyalar/data/vakaverisi.js';
  document.getElementsByTagName('head')[0].appendChild(script);
}
var dataPoints = [];
var pinColors  = [];
var popUpText  = [];
// salgın.js dosyasına erişerek elde edilen sonuç dizisini gözden geçirin ve her veri noktası için bir işaretleyici yerleştirin
window.eqfeed_callback = function(results) 
{
  for (var i = 0; i < results.features.length; i++) 
  {
    var latLng = new google.maps.LatLng(results.features[i].LATITUDE, results.features[i].LONGITUDE);
    popUpText[i]     = "<span> <b> Ülke: </b>"      + results.features[i].ÜLKE + 
                       "<br/> <b> Tedavi: </b>"   + results.features[i].TEDAVI + 
                       "<br/> <b> Vaka: </b>" + results.features[i].VAKA;
					   
//pointlerin bulundu renkler 
					   
    if (results.features[i].VAKA < 1000)
    {
      pinColors[i]='44CB15';
    }
    else if ((results.features[i].VAKA > 1000) && (results.features[i].VAKA < 30000))
    {
      pinColors[i]='F9FF00';
    }
    else 
    {
      pinColors[i]='E80303';
    }
    var tmp = {
      'lat' : results.features[i].LATITUDE,
      'lng' : results.features[i].LONGITUDE
	  
    };
    dataPoints.push(tmp);
  }
  var markers = dataPoints.map(function(location, i) 

  {
    var mark  = new google.maps.Marker({
        position : location,            
        icon     : new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColors[i]),
        text     : popUpText[i]
    });
	//icon üstündeki değer gösterimi
    var infowindow = new google.maps.InfoWindow({
        content  : mark.text
    });
    mark.addListener('mouseout', function() 
    {
      if (infowindow) 
      {
       infowindow.close();
      }
    });
    mark.addListener('mouseover', function() 
    {
      infowindow.open(map, mark);
    });

    return mark;
  });
  var markerCluster = new MarkerClusterer(map, 
                                          markers,
                                          {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
                                         );
}