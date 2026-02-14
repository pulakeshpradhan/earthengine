# Supervised LULC Classification GEE

* * *

🔍 Overview of Steps:
---------------------

1.  **Load and Visualize Satellite Imagery**
    
2.  **Define Training Samples**
    
3.  **Merge and Sample Training Data**
    
4.  **Train the Classifier**
    
5.  **Classify the Image**
    
6.  **Visualize the Classified Map**
    
7.  **Export the Result**
    
8.  _(Optional)_ Accuracy Assessment
    

* * *

🛰️ Step 1: Load and Visualize Satellite Imagery
------------------------------------------------

```javascript
// Define Area of Interest (AOI)
var aoi = ee.Geometry.Rectangle([85.0, 20.0, 86.0, 21.0]);

// Load Sentinel-2 image
var image = ee.ImageCollection("COPERNICUS/S2_SR")
  .filterBounds(aoi)
  .filterDate('2022-01-01', '2022-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median()
  .clip(aoi);

// Select bands
var bands = ['B2', 'B3', 'B4', 'B8']; // Blue, Green, Red, NIR

Map.centerObject(aoi, 10);
Map.addLayer(image.select(['B4', 'B3', 'B2']), {min: 0, max: 3000}, 'True Color Image');
```

* * *

🧪 Step 2: Define Training Samples (Manually using FeatureCollection)
---------------------------------------------------------------------

```javascript
// Example: Manually drawn polygons for different classes
var water = /* color: blue */ ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([85.1, 20.5]), {'landcover': 0}),
  ee.Feature(ee.Geometry.Point([85.2, 20.6]), {'landcover': 0})
]);

var forest = /* color: green */ ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([85.4, 20.5]), {'landcover': 1}),
  ee.Feature(ee.Geometry.Point([85.5, 20.6]), {'landcover': 1})
]);

var urban = /* color: red */ ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([85.6, 20.5]), {'landcover': 2}),
  ee.Feature(ee.Geometry.Point([85.7, 20.6]), {'landcover': 2})
]);
```

* * *

🔗 Step 3: Merge and Sample Training Data
-----------------------------------------

```javascript
var trainingPoints = water.merge(forest).merge(urban);

// Sample the image at the locations of the training points
var training = image.select(bands).sampleRegions({
  collection: trainingPoints,
  properties: ['landcover'],
  scale: 10
});
```

* * *

🧠 Step 4: Train the Classifier (Random Forest)
-----------------------------------------------

```javascript
var classifier = ee.Classifier.smileRandomForest(50).train({
  features: training,
  classProperty: 'landcover',
  inputProperties: bands
});
```

* * *

🗺️ Step 5: Classify the Image
------------------------------

```javascript
var classified = image.select(bands).classify(classifier);
```

* * *

🎨 Step 6: Visualize the Classified Map
---------------------------------------

```javascript
// Define a palette
var palette = ['0000FF', '00FF00', 'FF0000']; // water, forest, urban

Map.addLayer(classified, {min: 0, max: 2, palette: palette}, 'LULC Classification');
```

* * *

💾 Step 7: Export the Result
----------------------------

```javascript
Export.image.toDrive({
  image: classified,
  description: 'LULC_Classification',
  scale: 10,
  region: aoi,
  maxPixels: 1e13
});
```

* * *

✅ (Optional) Step 8: Accuracy Assessment
----------------------------------------

```javascript
// Split into training/testing datasets
var withRandom = training.randomColumn('random');
var trainingSet = withRandom.filter(ee.Filter.lt('random', 0.7));
var testingSet = withRandom.filter(ee.Filter.gte('random', 0.7));

// Train new classifier
var trainedClassifier = ee.Classifier.smileRandomForest(50).train({
  features: trainingSet,
  classProperty: 'landcover',
  inputProperties: bands
});

// Classify testing set
var validated = testingSet.classify(trainedClassifier);

// Error Matrix
var errorMatrix = validated.errorMatrix('landcover', 'classification');
print('Confusion Matrix:', errorMatrix);
print('Overall Accuracy:', errorMatrix.accuracy());
```

* * *

📌 Notes
--------

*   You can use more landcover classes by adding more `FeatureCollection` for other types (e.g., agriculture, barren, grassland).
    
*   You can use other classifiers like `smileCart()` or `smileSVM()` by changing the classifier function.
    
*   Use NDVI or other indices if helpful as input features.
    

* * *

Would you like a version of this in Python (GEE Python API) as well?

