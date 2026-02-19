```javascript
// তাপমাত্রা শতাংশ পরিবর্তন বিশ্লেষণ (বাংলা কমেন্ট)

var cor = [
  [-106.362109375,36.957529497279594],
  [-101.528125,36.957529497279594],
  [-101.528125,40.5210649481601],
  [-106.362109375,40.5210649481601],
  [-106.362109375,36.957529497279594]
  ]

var roi = ee.Geometry.Polygon(cor)
Map.centerObject(roi)

var time_start = '1950', time_end = '2020'

// ERA5 ভূমি মাসিক তাপমাত্রা ডেটা লোড
var era5 = ee.ImageCollection("ECMWF/ERA5_LAND/MONTHLY_AGGR")
.select('temperature_2m')
.filterDate(time_start, time_end);

// সময়ভিত্তিক কালেকশন (বার্ষিক গড়)
function temporal_collection(collection, start, count, interval, unit){
  var seq = ee.List.sequence(0, ee.Number(count).subtract(1));
  var origin_date = ee.Date(start);
  return ee.ImageCollection(seq.map(function(i){
    var start_date = origin_date.advance(ee.Number(interval).multiply(i), unit);
    var end_date = origin_date.advance(ee.Number(interval).multiply(ee.Number(i).add(1)), unit);
    return collection.filterDate(start_date, end_date).mean()
    .set('system:time_start', start_date.millis())
    .set('system:time_end', end_date.millis())
    }))
  }

// কেলভিন থেকে সেলসিয়াসে রূপান্তর
var annual = temporal_collection(era5, time_start, 70, 1, 'year')
.map(function(img){
  return img.subtract(273.15)
  .copyProperties(img, img.propertyNames())
  });

// তাপমাত্রা টাইম সিরিজ চার্ট
print(
  ui.Chart.image.series(annual, roi, ee.Reducer.mean(), 10000, 'system:time_start')
  )

// শতাংশ পরিবর্তন গণনা
var temp_mean = annual.mean();
// সূত্র = ((temp - mean)/(mean)) * 100

var change = annual.map(function(img){
  var eq = img.expression('((temp - mean)/(mean)) * 100',{
    'temp': img, 'mean': temp_mean
    }).rename('temp_change');
  return eq
  .copyProperties(img, img.propertyNames())
  })

// পরিবর্তন চার্ট
print(
  ui.Chart.image.series(change, roi, ee.Reducer.mean(),
  10000, 'system:time_start').setChartType('ColumnChart')
  )
```
