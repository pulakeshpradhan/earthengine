# GEE-তে তত্ত্বাবধিত LULC শ্রেণীবিভাগ

---

🔍 ধাপগুলোর সংক্ষিপ্ত বিবরণ
-----------------------------

১. **স্যাটেলাইট ইমেজারি লোড ও ভিজ্যুয়ালাইজ করুন**
২. **প্রশিক্ষণ নমুনা সংজ্ঞায়িত করুন**
৩. **প্রশিক্ষণ ডেটা একত্রিত ও স্যাম্পল করুন**
৪. **ক্লাসিফায়ার প্রশিক্ষণ দিন**
৫. **ইমেজ শ্রেণীবিভাগ করুন**
৬. **শ্রেণীবিভক্ত মানচিত্র ভিজ্যুয়ালাইজ করুন**
৭. **ফলাফল এক্সপোর্ট করুন**
৮. _(ঐচ্ছিক)_ নির্ভুলতা মূল্যায়ন

---

## 🛰️ ধাপ ১: স্যাটেলাইট ইমেজারি লোড ও ভিজ্যুয়ালাইজ করুন

```javascript
var aoi = ee.Geometry.Rectangle([85.0, 20.0, 86.0, 21.0]);

var image = ee.ImageCollection("COPERNICUS/S2_SR")
  .filterBounds(aoi)
  .filterDate('2022-01-01', '2022-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median().clip(aoi);

var bands = ['B2', 'B3', 'B4', 'B8']; // নীল, সবুজ, লাল, NIR

Map.centerObject(aoi, 10);
Map.addLayer(image.select(['B4', 'B3', 'B2']), {min: 0, max: 3000}, 'ট্রু কালার ইমেজ');
```

---

## 🧪 ধাপ ২: প্রশিক্ষণ নমুনা সংজ্ঞায়িত করুন

```javascript
var water = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([85.1, 20.5]), {'landcover': 0}),
  ee.Feature(ee.Geometry.Point([85.2, 20.6]), {'landcover': 0})
]);
var forest = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([85.4, 20.5]), {'landcover': 1}),
  ee.Feature(ee.Geometry.Point([85.5, 20.6]), {'landcover': 1})
]);
var urban = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([85.6, 20.5]), {'landcover': 2}),
  ee.Feature(ee.Geometry.Point([85.7, 20.6]), {'landcover': 2})
]);
```

---

## 🔗 ধাপ ৩: প্রশিক্ষণ ডেটা একত্রিত ও স্যাম্পল করুন

```javascript
var trainingPoints = water.merge(forest).merge(urban);
var training = image.select(bands).sampleRegions({
  collection: trainingPoints, properties: ['landcover'], scale: 10
});
```

---

## 🧠 ধাপ ৪: ক্লাসিফায়ার প্রশিক্ষণ দিন (Random Forest)

```javascript
var classifier = ee.Classifier.smileRandomForest(50).train({
  features: training, classProperty: 'landcover', inputProperties: bands
});
```

---

## 🗺️ ধাপ ৫: ইমেজ শ্রেণীবিভাগ করুন

```javascript
var classified = image.select(bands).classify(classifier);
```

---

## 🎨 ধাপ ৬: শ্রেণীবিভক্ত মানচিত্র ভিজ্যুয়ালাইজ করুন

```javascript
var palette = ['0000FF', '00FF00', 'FF0000']; // পানি, বন, নগর
Map.addLayer(classified, {min: 0, max: 2, palette: palette}, 'LULC শ্রেণীবিভাগ');
```

---

## 💾 ধাপ ৭: ফলাফল এক্সপোর্ট করুন

```javascript
Export.image.toDrive({
  image: classified, description: 'LULC_Classification',
  scale: 10, region: aoi, maxPixels: 1e13
});
```

---

## ✅ (ঐচ্ছিক) ধাপ ৮: নির্ভুলতা মূল্যায়ন

```javascript
var withRandom = training.randomColumn('random');
var trainingSet = withRandom.filter(ee.Filter.lt('random', 0.7));
var testingSet = withRandom.filter(ee.Filter.gte('random', 0.7));

var trainedClassifier = ee.Classifier.smileRandomForest(50).train({
  features: trainingSet, classProperty: 'landcover', inputProperties: bands
});

var validated = testingSet.classify(trainedClassifier);
var errorMatrix = validated.errorMatrix('landcover', 'classification');
print('কনফিউশন ম্যাট্রিক্স:', errorMatrix);
print('সামগ্রিক নির্ভুলতা:', errorMatrix.accuracy());
```

---

## 📌 নোট

* আরও ভূমি আচ্ছাদন শ্রেণী (যেমন- কৃষি, অনুর্বর, তৃণভূমি) যোগ করতে আরও `FeatureCollection` ব্যবহার করতে পারেন।
* `smileCart()` বা `smileSVM()` এর মতো অন্যান্য ক্লাসিফায়ার ব্যবহার করতে পারেন।
* ইনপুট ফিচার হিসেবে NDVI বা অন্যান্য সূচক ব্যবহার করুন।

---
