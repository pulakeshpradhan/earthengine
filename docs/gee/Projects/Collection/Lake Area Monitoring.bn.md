```javascript
// হ্রদের ক্ষেত্রফল পর্যবেক্ষণ (বাংলা কমেন্ট)

var cor = [[44.82021271860131,37.08040466447922],
           [46.11659943735131,37.08040466447922],
           [46.11659943735131,38.37506300104177],
           [44.82021271860131,38.37506300104177],
           [44.82021271860131,37.08040466447922]
            ]

var roi = ee.Geometry.Polygon(cor)
Map.addLayer(roi)
Map.centerObject(roi)

var time_start = '2001', time_end = '2023'

// MODIS ডেটা থেকে NDWI গণনা
var modis = ee.ImageCollection("MODIS/061/MOD09A1")
.filterDate(time_start, time_end);

var ndwi = modis.map(function(img){
  var band = img.select('sur.*').multiply(0.0001);
  var index = band.normalizedDifference(['sur_refl_b04','sur_refl_b02']).rename('ndwi');
  return index
  .copyProperties(img, img.propertyNames())
  });

// হ্রদের ক্ষেত্রফল টাইম সিরিজ
var lake_area = ndwi.map(function(img){
  var thr = img.gt(0.1)
  var mask = thr.updateMask(thr);
  var area = mask.multiply(ee.Image.pixelArea().divide(1e6));
  return area
  .copyProperties(img, img.propertyNames())
  });

// চার্ট প্রিন্ট করুন
print(
  ui.Chart.image.series(lake_area, roi, ee.Reducer.sum(),
  500, 'system:time_start')
  )
```
