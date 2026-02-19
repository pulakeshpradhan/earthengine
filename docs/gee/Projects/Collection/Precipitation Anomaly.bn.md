```javascript
// বৃষ্টিপাতের অসঙ্গতি বিশ্লেষণ (বাংলা কমেন্ট)

var cor = [
  [54.04610024292115,36.26824729036319],
  [56.30928383667115,36.26824729036319],
  [56.30928383667115,37.7942120428063],
  [54.04610024292115,37.7942120428063],
  [54.04610024292115,36.26824729036319]
  ]

var roi = ee.Geometry.MultiPolygon(cor);
Map.addLayer(roi)

var time_start = '2000', time_end = '2020'

// CHIRPS দৈনিক বৃষ্টিপাত ডেটা লোড
var chirps = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY")
.filterDate(time_start, time_end);

// সময়ভিত্তিক কালেকশন ফাংশন (মাসিক যোগফল)
function temporal_collection(collection, start, count, interval, unit){
  var seq = ee.List.sequence(0, ee.Number(count).subtract(1));
  var origin_date = ee.Date(start);
  return ee.ImageCollection(seq.map(function(i){
    var start_date = origin_date.advance(ee.Number(interval).multiply(i), unit);
    var end_date = origin_date.advance(ee.Number(interval).multiply(ee.Number(i).add(1)), unit);
    return collection.filterDate(start_date, end_date).sum()
    .set('system:time_start', start_date.millis())
    .set('system:time_end', end_date.millis())
    }))
  }

var monthly = temporal_collection(chirps, time_start, 240, 1, 'month');

// গড় বৃষ্টিপাত
var pr_mean = monthly.mean();

// অসঙ্গতি গণনা (প্রতি মাস - গড়)
var anomaly = monthly.map(function(img){
  return img.subtract(pr_mean)
  .copyProperties(img, img.propertyNames())
  });

// অসঙ্গতি চার্ট
print(
  ui.Chart.image.series(anomaly, roi, ee.Reducer.mean(),
  5000, 'system:time_start').setChartType('ColumnChart')
  )
```
