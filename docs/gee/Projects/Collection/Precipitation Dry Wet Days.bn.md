```javascript
// বৃষ্টিপাত শুষ্ক ও আর্দ্র দিন বিশ্লেষণ (বাংলা কমেন্ট)

var cor = [
  [52.44694261887793,36.17836425046897],
  [53.04020433762793,36.17836425046897],
  [53.04020433762793,36.61168836568063],
  [52.44694261887793,36.61168836568063],
  [52.44694261887793,36.17836425046897]
  ]

var roi = ee.Geometry.Polygon(cor);
Map.centerObject(roi);

var time_start = '2010' , time_end = '2020' 

var pr = imageCollection
.filterDate(time_start, time_end);

// বৃষ্টিপাত শ্রেণীবিভাগ ফাংশন
function pr_class(img){
  var pr_mean = img.reduceRegion({
    reducer: ee.Reducer.mean(), geometry: roi, scale: 27000
    }).values().get(0);
    var pr_max = img.reduceRegion({
    reducer: ee.Reducer.max(), geometry: roi, scale: 27000
    }).values().get(0);
  return img
  .copyProperties(img, img.propertyNames())
  .set('pr_mean', pr_mean)
  .set('pr_max', pr_max)
  }

var pr_values = pr.map(pr_class);

// শুষ্ক দিন (গড় < ০.৫)
var dry = pr_values.filter(ee.Filter.lt('pr_mean',0.5));

// আর্দ্র দিন (গড় > ১)
var wet = pr_values.filter(ee.Filter.gt('pr_mean',1));

// মধ্যবর্তী দিন (০.৫ থেকে ১)
var mid = pr_values
.filter(ee.Filter.gte('pr_mean',0.5))
.filter(ee.Filter.lte('pr_mean', 1));
```
