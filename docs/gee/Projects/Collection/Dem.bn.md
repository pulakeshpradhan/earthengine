```javascript
// DEM কোড উদাহরণ (বাংলা কমেন্ট)

var cor = [
  [48.646401641929856,35.98889945187288],
  [50.211953399742356,35.98889945187288],
  [50.211953399742356,37.15353368743586],
  [48.646401641929856,37.15353368743586],
  [48.646401641929856,35.98889945187288]
  ]

var roi = ee.Geometry.Polygon(cor)

Map.centerObject(roi);

// এলিভেশন সিলেক্ট করুন
var srtm = image.select('elevation');
Map.addLayer(srtm.clip(roi),[],'dem30',false)

// হিস্টোগ্রাম প্রিন্ট করুন
print(
  ui.Chart.image.histogram(srtm,roi,100)
  )
  
// ঢাল গণনা করুন
var slope = ee.Terrain.slope(srtm);
Map.addLayer(slope.clip(roi),[],'slope', false);

// দিক গণনা করুন
var aspect = ee.Terrain.aspect(srtm);
Map.addLayer(aspect.clip(roi),[],'aspect',false);

// সকল ভূমিরূপ পণ্য
var product = ee.Terrain.products(srtm);
print(product);

// গুগল ড্রাইভে এক্সপোর্ট করুন
Export.image.toDrive({
  image: product.clip(roi).float(),
  description: 'dem_product',
  scale: 30,
  region: roi,
  crs: product.getInfo().crs,
  folder: 'dem',
  maxPixels: 1e13
  })

// ALOS DSM
var alos = imageCollection.select('DSM').mean()
print(
  ui.Chart.image.histogram(alos, roi, 100)
  )
```
