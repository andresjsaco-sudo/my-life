(function () {
  var map = L.map('map').setView([4.53, -74.10], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var sectorColors = { sec0: '#ff7d2e', sec1: '#ffb400', sec2: '#1e8cff' };
  function load(name) { return fetch('data/' + name + '.geojson').then(function (r) { return r.json(); }); }

  Promise.all([load('upz'), load('sector'), load('enb')]).then(function (d) {
    var upz = L.geoJSON(d[0], {
      style: function (f) { return { color: f.properties.loc === 'Usme' ? '#2f9e44' : '#c99a00', weight: 2, fillOpacity: 0.06 }; },
      onEachFeature: function (f, l) { l.bindPopup(f.properties.name + '\n' + f.properties.desc); }
    }).addTo(map);
    var sectors = L.geoJSON(d[1], {
      style: function (f) { return { color: sectorColors[f.properties.s] || '#888', weight: 0.6, fillOpacity: 0.28 }; }
    }).addTo(map);
    var sites = L.geoJSON(d[2], {
      pointToLayer: function (f, ll) { return L.circleMarker(ll, { radius: 4, color: '#1c2520', weight: 1, fillColor: '#ffffff', fillOpacity: 1 }); },
      onEachFeature: function (f, l) {
        var box = document.createElement('div');
        var title = document.createElement('b');
        title.textContent = f.properties.name;
        box.appendChild(title);
        box.appendChild(document.createTextNode('\n' + f.properties.desc));
        l.bindPopup(box);
      }
    }).addTo(map);
    map.fitBounds(upz.getBounds(), { padding: [10, 10] });
    L.control.layers(null, { 'Design area (UPZ)': upz, 'Sector footprints': sectors, 'eNB sites': sites }).addTo(map);

    var legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'legend');
      div.innerHTML = '<div><span class="sw sw-sc"></span>San Cristóbal</div>' +
        '<div><span class="sw sw-us"></span>Usme</div>' +
        '<div><span class="sw sw-a"></span><span class="sw sw-b"></span><span class="sw sw-c"></span>Sectors A, B, C</div>';
      return div;
    };
    legend.addTo(map);
  });
})();
