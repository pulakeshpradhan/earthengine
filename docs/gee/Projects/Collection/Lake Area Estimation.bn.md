```javascript
// হ্রদের ক্ষেত্রফল অনুমান (বাংলা কমেন্ট)
/*
টিউটোরিয়াল কোড: Amirhossein Ahrari
*/

var coordinates = [
  [42.000552219688586, 38.18969302118053],
  [43.868228000938586, 38.18969302118053],
  [43.868228000938586, 39.209978258633186],
  [42.000552219688586, 39.209978258633186],
  [42.000552219688586, 38.18969302118053]
];

var roi = ee.Geometry.Polygon(coordinates);
Map.addLayer(roi)

var time_start = '2013', time_end = '2021'

// ল্যান্ডস্যাট ডেটা ফিল্টার ও NDWI গণনা
var landsat = imageCollection
.filterDate(time_start, time_end)
.filter(ee.Filter.lt('CLOUD_COVER', 10))
.filter(ee.Filter.calendarRange(6,9,'month'))
.filterBounds(geometry).map(function(img){
  var bands = img.select('SR_.*').multiply(2.75e-05).add(-0.2);
  var ndwi = bands.normalizedDifference(['SR_B3','SR_B5']).rename('ndwi');
  return ndwi
  .copyProperties(img, img.propertyNames())
  }).median();

Map.addLayer(landsat.clip(geometry), [], 'ndwi_summer', false);

// থ্রেশহোল্ড ও মাস্ক প্রয়োগ
var thr = landsat.gt(0.1);
var mask = thr.updateMask(thr);

// পিক্সেল ক্ষেত্রফল গণনা
var pixel_area = mask.multiply(ee.Image.pixelArea().divide(1e6));

var lake_area = pixel_area.reduceRegion({
  reducer: ee.Reducer.sum(), geometry: geometry, scale: 100
  }).values().get(0);
  
print(ee.Number(lake_area))
```
