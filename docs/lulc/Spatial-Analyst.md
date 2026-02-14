# Spatial-Analyst

Vector operations in Google Earth Engine (GEE) involve manipulating and analyzing vector datasets, which are typically geometries, features, or feature collections. Below is a comprehensive guide to vector operations with corresponding GEE code snippets.

## 1. Loading and Displaying Vector Data
GEE allows you to import vector datasets (shapefiles, GeoJSON, etc.) as FeatureCollection.

```javascript
// Load a built-in FeatureCollection
var countries = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017");

// Display the FeatureCollection
Map.centerObject(countries, 2);
Map.addLayer(countries, {}, "Countries");
```
2. Filtering Features
Filtering allows selecting specific features from a FeatureCollection based on attributes or spatial constraints.

a. Attribute-based Filtering
```javascript

// Filter countries by name
var usa = countries.filter(ee.Filter.eq('country_na', 'United States'));

// Display the filtered feature
Map.addLayer(usa, {color: 'blue'}, 'USA');
```
b. Spatial Filtering
```javascript
// Define a geometry
var point = ee.Geometry.Point([-100, 40]);

// Find countries that intersect with the point
var intersecting = countries.filterBounds(point);

// Display the result
Map.addLayer(intersecting, {color: 'red'}, 'Intersecting Countries');
```
3. Creating Geometries
GEE supports creating geometries such as points, lines, and polygons.

```javascript
// Create a point
var point = ee.Geometry.Point([-122.082, 37.42]);

// Create a line
var line = ee.Geometry.LineString([[-122.1, 37.4], [-122.0, 37.5]]);

// Create a polygon
var polygon = ee.Geometry.Polygon([
  [[-122.1, 37.4], [-122.0, 37.4], [-122.0, 37.5], [-122.1, 37.5], [-122.1, 37.4]]
]);

// Display geometries
Map.addLayer(point, {color: 'green'}, 'Point');
Map.addLayer(line, {color: 'blue'}, 'Line');
Map.addLayer(polygon, {color: 'red'}, 'Polygon');
```
4. Buffering enlarges geometries by a specified distance.
![image](https://github.com/user-attachments/assets/9b6f4131-9d40-4500-bca0-a5d8d789d5f9)

```javascript
// Create a buffer around the point
var bufferedPoint = point.buffer(10000); // 10 km buffer

// Display the buffered geometry
Map.addLayer(bufferedPoint, {color: 'yellow'}, 'Buffered Point');
```
5. Clipping restricts the extent of a geometry to another geometry.
![image](https://github.com/user-attachments/assets/223f87bc-fcaf-4eb9-85f3-3a42e56d7b67)

```javascript
// Clip the countries dataset to a specific polygon
var clipped = countries.clip(polygon);

// Display the clipped features
Map.addLayer(clipped, {color: 'purple'}, 'Clipped Countries');
```
6. Dissolving Features
![image](https://github.com/user-attachments/assets/128719d9-0f2d-4859-9de2-4654ab1afa46)

Dissolving merges features into a single geometry.

```javascript
// Dissolve all countries into a single geometry
var dissolved = countries.geometry();

// Display the dissolved geometry
Map.addLayer(dissolved, {color: 'gray'}, 'Dissolved Countries');
```
7. Calculating Area and Length
You can calculate the area of polygons or the length of lines.

```javascript
// Calculate the area of a polygon
var area = polygon.area().divide(1e6); // Convert to square kilometers
print('Polygon area (km²):', area);

// Calculate the length of a line
var length = line.length().divide(1000); // Convert to kilometers
print('Line length (km):', length);
```
8. Joining FeatureCollections
GEE supports spatial and attribute-based joins between feature collections.

a. Spatial Join
```javascript
// Define another FeatureCollection
var points = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-122.08, 37.43]), {name: 'A'}),
  ee.Feature(ee.Geometry.Point([-122.1, 37.4]), {name: 'B'})
]);

// Join points to countries they fall within
var spatialJoin = ee.Join.inner().apply({
  primary: countries,
  secondary: points,
  condition: ee.Filter.intersects('.geo', null, '.geo')
});

// Display results
print('Spatial join result:', spatialJoin);
```

b. Attribute Join
```javascript
// Create two FeatureCollections with matching attributes
var featuresA = ee.FeatureCollection([
  ee.Feature(null, {id: 1, value: 'A'}),
  ee.Feature(null, {id: 2, value: 'B'})
]);

var featuresB = ee.FeatureCollection([
  ee.Feature(null, {id: 1, description: 'First'}),
  ee.Feature(null, {id: 2, description: 'Second'})
]);

// Perform an inner join based on the 'id' attribute
var attributeJoin = ee.Join.inner().apply({
  primary: featuresA,
  secondary: featuresB,
  condition: ee.Filter.equals({leftField: 'id', rightField: 'id'})
});

// Display the joined collection
print('Attribute join result:', attributeJoin);
```
9. Union of Geometries
Union combines multiple geometries into one, merging their boundaries.

```javascript
// Define two polygons
var polygon1 = ee.Geometry.Polygon([
  [[-122.1, 37.4], [-122.0, 37.4], [-122.0, 37.5], [-122.1, 37.5], [-122.1, 37.4]]
]);
var polygon2 = ee.Geometry.Polygon([
  [[-122.05, 37.45], [-122.02, 37.45], [-122.02, 37.48], [-122.05, 37.48], [-122.05, 37.45]]
]);

// Perform the union
var unioned = polygon1.union(polygon2);

// Display the unioned geometry
Map.addLayer(unioned, {color: 'orange'}, 'Unioned Geometry');
```
10. Intersection of Geometries
Intersection returns the overlapping area of two geometries.

```javascript
// Find the intersection of two polygons
var intersection = polygon1.intersection(polygon2);

// Display the intersection
Map.addLayer(intersection, {color: 'blue'}, 'Intersection Geometry');
```
11. Difference of Geometries
Difference removes the overlapping area from one geometry.

```javascript
// Find the difference between two polygons
var difference = polygon1.difference(polygon2);

// Display the difference
Map.addLayer(difference, {color: 'red'}, 'Difference Geometry');
```
12. Simplifying Geometries
Simplification reduces the complexity of geometries while maintaining their general shape.

```javascript
// Simplify a polygon
var simplified = polygon.simplify(100); // Tolerance of 100 meters

// Display the simplified geometry
Map.addLayer(simplified, {color: 'green'}, 'Simplified Polygon');
```
13. Reducing FeatureCollections
You can reduce a FeatureCollection into a single geometry or property summary.

a. Reduce to Geometry
```javascript
// Combine all features into one geometry
var reducedGeometry = countries.union();

// Display the reduced geometry
Map.addLayer(reducedGeometry, {color: 'purple'}, 'Reduced Geometry');
```
b. Reduce by Property
```javascript
// Calculate the total area of all features in the collection
var totalArea = countries.reduceColumns({
  reducer: ee.Reducer.sum(),
  selectors: ['shape_area'] // Replace with the relevant property in your dataset
});

// Print the result
print('Total Area:', totalArea);
```
14. Adding and Modifying Properties
You can add or modify properties of a Feature or FeatureCollection.

```javascript
// Add a property to a feature
var featureWithProperty = ee.Feature(point, {name: 'Sample Point'});

// Modify an existing property
var updatedFeature = featureWithProperty.set('name', 'Updated Point');

// Display the properties
print('Updated Feature:', updatedFeature);
```
15. Exporting Vector Data
GEE allows you to export vector data for use outside the platform.

```javascript
// Export a FeatureCollection as a shapefile
Export.table.toDrive({
  collection: countries,
  description: 'CountriesExport',
  fileFormat: 'SHP'
});
```
16. Rasterizing Vector Data
You can convert vector data to raster format using a property as pixel value.

```javascript
// Rasterize the countries dataset with a constant value
var rasterized = countries.reduceToImage({
  properties: ['shape_area'], // Replace with relevant property
  reducer: ee.Reducer.first()
});

// Display the rasterized data
Map.addLayer(rasterized, {min: 0, max: 1e12, palette: ['white', 'green']}, 'Rasterized Countries');
```

17. Merging FeatureCollections
Merging combines multiple FeatureCollections into one.

```javascript
// Define two small FeatureCollections
var collection1 = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-122.1, 37.4]), {name: 'A'}),
  ee.Feature(ee.Geometry.Point([-122.2, 37.5]), {name: 'B'})
]);

var collection2 = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-122.3, 37.6]), {name: 'C'}),
  ee.Feature(ee.Geometry.Point([-122.4, 37.7]), {name: 'D'})
]);

// Merge the two collections
var mergedCollection = collection1.merge(collection2);

// Display the merged collection
Map.addLayer(mergedCollection, {color: 'blue'}, 'Merged Collection');
print('Merged Collection:', mergedCollection);
```
18. Splitting FeatureCollections
Splitting separates a FeatureCollection into subsets based on a property or condition.

```javascript
// Filter features with a specific condition
var subset1 = mergedCollection.filter(ee.Filter.stringStartsWith('name', 'A'));
var subset2 = mergedCollection.filter(ee.Filter.stringStartsWith('name', 'B'));

// Display subsets
Map.addLayer(subset1, {color: 'red'}, 'Subset 1');
Map.addLayer(subset2, {color: 'green'}, 'Subset 2');
```
19. Sampling FeatureCollections
Sampling extracts points, lines, or polygons from a FeatureCollection based on certain conditions.

```javascript

// Generate random points within the unioned geometry
var randomPoints = ee.FeatureCollection.randomPoints({
  region: unioned,
  points: 10
});

// Display random points
Map.addLayer(randomPoints, {color: 'orange'}, 'Random Points');
```
20. Buffering Multiple Features
Buffering can be applied to all features in a FeatureCollection.

```javascript

// Buffer all features in the merged collection
var bufferedFeatures = mergedCollection.map(function(feature) {
  return feature.buffer(5000); // 5 km buffer
});

// Display buffered features
Map.addLayer(bufferedFeatures, {color: 'yellow'}, 'Buffered Features');
```
21. Reprojecting Vector Data
Reprojection changes the coordinate system of geometries.

```javascript

// Reproject a geometry to a new CRS (e.g., EPSG:3857)
var reprojected = polygon.transform('EPSG:3857');

// Display reprojected geometry
Map.addLayer(reprojected, {color: 'purple'}, 'Reprojected Geometry');
```
22. Exporting to Other Formats
GEE allows exporting vector data in multiple formats, such as GeoJSON.

```javascript

// Export FeatureCollection to GeoJSON
Export.table.toDrive({
  collection: countries,
  description: 'CountriesExportGeoJSON',
  fileFormat: 'GeoJSON'
});
```
23. Mapping Functions on FeatureCollections
The map function can apply transformations to every feature in a FeatureCollection.

```javascript

// Add a new property to all features
var updatedCollection = mergedCollection.map(function(feature) {
  return feature.set('category', 'Test Category');
});

// Print the updated collection
print('Updated Collection:', updatedCollection);
```
24. Converting Between Geometries
You can convert between geometry types, such as from points to lines.

```javascript

// Create a line from the points in the FeatureCollection
var lineFromPoints = mergedCollection.geometry().dissolve();

// Display the generated line
Map.addLayer(lineFromPoints, {color: 'cyan'}, 'Line from Points');
```
25. Calculating Feature Stats
Calculate statistics (e.g., mean, sum) for numeric properties in a FeatureCollection.

```javascript

// Reduce properties in the FeatureCollection
var stats = mergedCollection.reduceColumns({
  reducer: ee.Reducer.mean(),
  selectors: ['name_length'] // Replace with a valid numeric property
});

// Print the stats
print('Feature Stats:', stats);

26. Advanced Spatial Joins
Spatial joins in GEE can perform operations such as nearest-neighbor associations or finding features within a specific distance.

a. Nearest Neighbor Join
```javascript

// Define two FeatureCollections: points and polygons
var polygons = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Polygon([[
    [-122.1, 37.4], [-122.0, 37.4], [-122.0, 37.5], [-122.1, 37.5], [-122.1, 37.4]
  ]]), {id: 'Polygon1'}),
  ee.Feature(ee.Geometry.Polygon([[
    [-122.2, 37.6], [-122.1, 37.6], [-122.1, 37.7], [-122.2, 37.7], [-122.2, 37.6]
  ]]), {id: 'Polygon2'})
]);

var points = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-122.15, 37.45]), {name: 'PointA'}),
  ee.Feature(ee.Geometry.Point([-122.05, 37.65]), {name: 'PointB'})
]);

// Find the nearest polygon for each point
var nearest = ee.Join.saveBest({
  matchKey: 'nearest_polygon',
  measureKey: 'distance'
}).apply({
  primary: points,
  secondary: polygons,
  condition: ee.Filter.proximity({
    distance: 100000, // 100 km
    rightField: '.geo'
  })
});

// Print and display results
print('Nearest polygons:', nearest);
Map.addLayer(points, {color: 'red'}, 'Points');
Map.addLayer(polygons, {color: 'blue'}, 'Polygons');
```
27. Finding Features Within a Distance
Find features within a specified distance from another geometry.

```javascript
// Find polygons within 20 km of a point
var bufferPoint = ee.Geometry.Point([-122.1, 37.5]).buffer(20000); // 20 km buffer
var nearbyPolygons = polygons.filterBounds(bufferPoint);

// Display the nearby polygons
Map.addLayer(bufferPoint, {color: 'yellow'}, 'Buffer');
Map.addLayer(nearbyPolygons, {color: 'green'}, 'Nearby Polygons');
```
28. Converting Raster to Vector
You can vectorize raster data by extracting boundaries or regions.

```javascript
// Load a raster image (e.g., a land cover dataset)
var landcover = ee.Image('MODIS/006/MCD12Q1/2016_01_01')
  .select('LC_Type1');

// Extract regions of a specific land cover type (e.g., forests)
var forest = landcover.eq(1); // Assuming class 1 represents forest

// Vectorize the raster data
var forestVector = forest.reduceToVectors({
  geometryType: 'polygon',
  scale: 500,
  maxPixels: 1e8
});

// Display the vectorized data
Map.addLayer(forest, {min: 0, max: 1, palette: ['white', 'green']}, 'Forest Raster');
Map.addLayer(forestVector, {color: 'green'}, 'Forest Vector');
```
29. Splitting Features by Properties
Split a FeatureCollection into multiple groups based on a property.

```javascript

// Split polygons by their 'id' property
var groups = polygons.aggregate_array('id').distinct();
groups.evaluate(function(ids) {
  ids.forEach(function(id) {
    var group = polygons.filter(ee.Filter.eq('id', id));
    Map.addLayer(group, {}, 'Group: ' + id);
  });
});
```
30. Calculating Distance Between Features
Compute distances between points, lines, or polygons.

```javascript

// Calculate distance between a point and a polygon
var distance = points.first().geometry().distance(polygons.first().geometry());
print('Distance (meters):', distance);
```
31. Using Vector Data in Machine Learning
Vector data can serve as training data for machine learning models in GEE.

```javascript

// Define training points with labels
var trainingPoints = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-122.1, 37.4]), {landcover: 0}), // Water
  ee.Feature(ee.Geometry.Point([-122.1, 37.5]), {landcover: 1})  // Forest
]);

// Load an image to classify (e.g., MODIS)
var image = ee.Image('MODIS/006/MCD12Q1/2016_01_01')
  .select('LC_Type1');

// Sample the image at training points
var trainingData = image.sampleRegions({
  collection: trainingPoints,
  properties: ['landcover'],
  scale: 500
});

// Train a classifier
var classifier = ee.Classifier.smileCart().train({
  features: trainingData,
  classProperty: 'landcover',
  inputProperties: ['LC_Type1']
});

// Classify the image
var classified = image.classify(classifier);

// Display the classified image
Map.addLayer(classified, {min: 0, max: 1, palette: ['blue', 'green']}, 'Classified');
```
32. Exporting Vector Subsets
Export a subset of vector data after applying filters.

```javascript

// Export filtered polygons
Export.table.toDrive({
  collection: nearbyPolygons,
  description: 'FilteredPolygons',
  fileFormat: 'KML'
});

```
33. Custom Reducers with FeatureCollections
Custom reducers allow aggregation of numeric properties or geometries in complex ways.

a. Summarizing Numeric Properties
```javascript

// Create a FeatureCollection with numeric properties
var features = ee.FeatureCollection([
  ee.Feature(null, {value: 10, category: 'A'}),
  ee.Feature(null, {value: 20, category: 'B'}),
  ee.Feature(null, {value: 30, category: 'A'})
]);

// Summarize by category using group reducer
var grouped = features.reduceColumns({
  reducer: ee.Reducer.sum().group(1),
  selectors: ['value', 'category']
});

// Print the grouped result
print('Grouped Sum by Category:', grouped);
b. Reducing Geometries
```javascript

// Calculate the union of geometries in a FeatureCollection
var geometryUnion = features.geometry().union();

// Display the unioned geometry
Map.addLayer(geometryUnion, {color: 'orange'}, 'Union of Geometries');
```
34. Handling Complex Multi-Polygons
Manipulating multi-polygon geometries for tasks such as splitting, simplifying, or calculating metrics.

```javascript

// Define a multi-polygon
var multiPolygon = ee.Geometry.MultiPolygon([
  [[[-122.1, 37.4], [-122.0, 37.4], [-122.0, 37.5], [-122.1, 37.5], [-122.1, 37.4]]],
  [[[-122.2, 37.6], [-122.1, 37.6], [-122.1, 37.7], [-122.2, 37.7], [-122.2, 37.6]]]
]);

// Split the multi-polygon into individual polygons
var splitPolygons = multiPolygon.geometries();

// Print each split polygon
print('Individual Polygons:', splitPolygons);

// Display the multi-polygon
Map.addLayer(multiPolygon, {color: 'purple'}, 'Multi-Polygon');
```
35. Buffer with Varying Distances
Apply a buffer with dynamic distances for each feature.

```javascript

// Add a buffer size property to features
var bufferedFeatures = features.map(function(feature) {
  var bufferSize = feature.get('value'); // Use 'value' as buffer size
  return feature.buffer(bufferSize);
});

// Display buffered features
Map.addLayer(bufferedFeatures, {color: 'green'}, 'Buffered Features with Varying Distances');
```
36. Convex Hull of Geometries
Convex hull computes the smallest convex polygon enclosing a geometry or a collection of geometries.

```javascript

// Create a convex hull of the FeatureCollection
var convexHull = features.geometry().convexHull();

// Display the convex hull
Map.addLayer(convexHull, {color: 'red'}, 'Convex Hull');
```
37. Centroids of Geometries
Calculate the centroid of a geometry or each feature in a FeatureCollection.

```javascript

// Calculate the centroid of each feature
var centroids = features.map(function(feature) {
  return feature.setGeometry(feature.geometry().centroid());
});

// Display the centroids
Map.addLayer(centroids, {color: 'blue'}, 'Centroids');
```
38. Sampling Raster Data with FeatureCollections
Extract raster values at vector locations.

```javascript

// Load a raster image
var elevation = ee.Image('CGIAR/SRTM90_V4');

// Sample elevation values at points
var sampled = points.map(function(feature) {
  var elevationValue = elevation.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: feature.geometry(),
    scale: 30
  }).get('elevation');
  return feature.set('elevation', elevationValue);
});

// Print the sampled points with elevation values
print('Sampled Points with Elevation:', sampled);

// Display sampled points
Map.addLayer(sampled, {color: 'yellow'}, 'Sampled Elevation Points');
```
39. Combining Vector Data with Imagery Masks
Apply vector geometries as masks to filter raster imagery.

```javascript

// Load a raster image
var landcover = ee.Image('MODIS/006/MCD12Q1/2016_01_01').select('LC_Type1');

// Create a mask from a polygon
var polygonMask = landcover.updateMask(polygon.contains(landcover.geometry()));

// Display the masked raster
Map.addLayer(polygonMask, {min: 1, max: 17, palette: ['blue', 'green']}, 'Masked Landcover');
```
40. Real-World Application: Mapping Urban Growth
Use vector operations for practical applications like mapping urban growth.

```javascript

// Load urban areas for two different years
var urban2000 = ee.FeatureCollection('users/yourusername/urban2000');
var urban2020 = ee.FeatureCollection('users/yourusername/urban2020');

// Calculate the difference (new urban areas in 2020)
var newUrban = urban2020.filterBounds(urban2000.geometry().difference(urban2020.geometry()));

// Display results
Map.addLayer(urban2000, {color: 'gray'}, 'Urban Areas 2000');
Map.addLayer(urban2020, {color: 'blue'}, 'Urban Areas 2020');
Map.addLayer(newUrban, {color: 'red'}, 'New Urban Areas');

```
41. Simplifying Complex FeatureCollections
Reduce the complexity of geometries in a FeatureCollection for faster processing.

```javascript

// Simplify geometries in a FeatureCollection
var simplifiedFeatures = features.map(function(feature) {
  return feature.setGeometry(feature.geometry().simplify(100)); // Simplify with a tolerance of 100 meters
});

// Display simplified features
Map.addLayer(simplifiedFeatures, {color: 'cyan'}, 'Simplified Features');
```
42. Overlay Analysis
Perform overlay analysis to calculate spatial relationships between geometries, such as intersections and unions.

a. Intersect Two FeatureCollections
```javascript

// Find intersections between two FeatureCollections
var intersections = polygons.map(function(polygon) {
  return points.filterBounds(polygon.geometry()).map(function(point) {
    return point.setGeometry(point.geometry().intersection(polygon.geometry()));
  });
}).flatten();

// Display the intersections
Map.addLayer(intersections, {color: 'orange'}, 'Intersections');
```
b. Combine Multiple Layers Using Union
```javascript

// Union all geometries in two FeatureCollections
var unionedFeatures = polygons.merge(points).geometry().union();

// Display the unioned geometry
Map.addLayer(unionedFeatures, {color: 'purple'}, 'Unioned Features');
```
43. Clipping Rasters with Vectors
Use vector data to clip raster imagery.

```javascript

// Clip a raster using a polygon
var clippedRaster = elevation.clip(polygon);

// Display the clipped raster
Map.addLayer(clippedRaster, {min: 0, max: 4000, palette: ['white', 'black']}, 'Clipped Raster');
```
44. Creating Grids or Tessellations
Generate grids or tessellations over a specified region.

```javascript

// Define a bounding box
var boundingBox = ee.Geometry.Rectangle([-122.2, 37.4, -121.8, 37.8]);

// Create a grid of 0.01-degree squares
var grid = ee.FeatureCollection(
  ee.Image().paint(boundingBox, 1).reduceToVectors({
    geometryType: 'polygon',
    reducer: ee.Reducer.countEvery(),
    scale: 1000,
    geometry: boundingBox
  })
);

// Display the grid
Map.addLayer(grid, {color: 'blue'}, 'Grid');
```
45. Working with Multi-Feature Layers
Handle layers with mixed geometry types.

```javascript

// Filter and separate geometry types
var pointsOnly = mergedCollection.filter(ee.Filter.eq('type', 'Point'));
var polygonsOnly = mergedCollection.filter(ee.Filter.eq('type', 'Polygon'));

// Display filtered layers
Map.addLayer(pointsOnly, {color: 'red'}, 'Points Only');
Map.addLayer(polygonsOnly, {color: 'green'}, 'Polygons Only');
```
46. Geometry Metrics
Calculate metrics like area, length, or perimeter for geometries.

```javascript

// Calculate area of polygons
var areas = polygons.map(function(feature) {
  var area = feature.geometry().area(); // Area in square meters
  return feature.set('area', area);
});

// Print areas
print('Polygons with Areas:', areas);
```
47. Dissolving Features by Attribute
Group and merge features based on a common property.

```javascript

// Dissolve polygons by 'id' attribute
var dissolved = polygons.reduceToImage(['id'], ee.Reducer.mode()).reduceToVectors({
  geometryType: 'polygon',
  scale: 1000
});

// Display dissolved features
Map.addLayer(dissolved, {color: 'orange'}, 'Dissolved Features');
```
48. Spatial Weighting
Assign weights to features based on proximity or density.

```javascript

// Create a distance-based weighting image
var distanceWeights = ee.Image().paint(points, 1).fastDistanceTransform({
  maxDistance: 10000, // Max distance in meters
  units: 'meters'
});

// Display weights
Map.addLayer(distanceWeights, {min: 0, max: 10000, palette: ['white', 'blue']}, 'Distance Weights');
```
49. Spatial Autocorrelation Analysis
Assess spatial patterns and relationships between features.

```javascript

// Calculate spatial autocorrelation using Moran's I
var autocorrelation = features.map(function(feature) {
  var neighbors = features.filterBounds(feature.geometry().buffer(1000));
  return feature.set('neighborCount', neighbors.size());
});

// Print results
print('Spatial Autocorrelation:', autocorrelation);
```
50. Combining Vector and Raster in Zonal Analysis
Use vector polygons to summarize raster data.

```javascript

// Calculate mean elevation within each polygon
var zonalStats = polygons.map(function(feature) {
  var meanElevation = elevation.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: feature.geometry(),
    scale: 30
  }).get('elevation');
  return feature.set('mean_elevation', meanElevation);
});

// Print zonal stats
print('Zonal Statistics:', zonalStats);

```
51. Using Weighted Overlay for Multi-Criteria Analysis
Combine multiple raster layers with vector weights for decision-making applications.

```javascript

// Load multiple raster layers (e.g., slope and land cover)
var slope = ee.Terrain.slope(elevation);
var landcover = ee.Image('MODIS/006/MCD12Q1/2016_01_01').select('LC_Type1');

// Assign weights to layers
var weightedOverlay = slope.multiply(0.4).add(landcover.multiply(0.6));

// Mask by a polygon region
var maskedOverlay = weightedOverlay.updateMask(polygon);

// Display the weighted overlay
Map.addLayer(maskedOverlay, {min: 0, max: 1, palette: ['white', 'red']}, 'Weighted Overlay');
```
52. Extracting Sub-Geometries
Extract specific parts of geometries like rings or interiors.

```javascript

// Extract the outer ring of a polygon
var outerRing = polygon.geometries().get(0);

// Convert to a new geometry for visualization
var outerGeometry = ee.Geometry(outerRing);

// Display the outer ring
Map.addLayer(outerGeometry, {color: 'blue'}, 'Outer Ring');
```
53. Computing Voronoi Diagrams
Create Voronoi diagrams from point geometries.

```javascript

// Generate Voronoi polygons from points
var voronoi = points.reduceToImage(['name'], ee.Reducer.first())
  .fastDistanceTransform(5000)
  .reduceToVectors({geometryType: 'polygon', scale: 500});

// Display Voronoi diagram
Map.addLayer(voronoi, {color: 'purple'}, 'Voronoi Diagram');
```
54. Hotspot Analysis
Identify areas of high density or significant activity.

```javascript

// Count the number of points in grid cells
var hotspotImage = ee.Image().paint(points, 1).reduceNeighborhood({
  reducer: ee.Reducer.count(),
  kernel: ee.Kernel.square(1)
});

// Display hotspots
Map.addLayer(hotspotImage, {min: 0, max: 10, palette: ['white', 'red']}, 'Hotspots');
```
55. Integrating External Data Sources
Load vector data from external files, such as GeoJSON or KML.

```javascript

// Import a GeoJSON file from Google Drive
var externalData = ee.FeatureCollection('users/yourusername/geojson_data');

// Display external data
Map.addLayer(externalData, {color: 'green'}, 'External Data');
```
56. Topology Validation
Ensure vector data meets topological rules, such as non-overlapping polygons.

```javascript

// Validate topology of a FeatureCollection
var validatedFeatures = polygons.map(function(feature) {
  var isValid = feature.geometry().isValid();
  return feature.set('is_valid', isValid);
});

// Filter for invalid features
var invalidFeatures = validatedFeatures.filter(ee.Filter.eq('is_valid', false));

// Display invalid features
Map.addLayer(invalidFeatures, {color: 'red'}, 'Invalid Features');
```
57. Custom Feature Attributes
Add attributes based on calculations or external logic.

```javascript

// Add a custom property based on area
var updatedFeatures = polygons.map(function(feature) {
  var area = feature.geometry().area();
  return feature.set('size_category', area.gt(1000000) ? 'Large' : 'Small');
});

// Display categorized features
print('Features with Size Categories:', updatedFeatures);
```
58. Using Vector Layers for Visualization
Create custom symbology for vector layers.

```javascript

// Style features based on a property
var styledFeatures = polygons.map(function(feature) {
  var color = feature.get('id') === 'Polygon1' ? 'red' : 'blue';
  return feature.set('style', {color: color, width: 2});
});

// Display styled features
Map.addLayer(styledFeatures.style(), {}, 'Styled Features');
```
59. Calculating Density Maps
Create density maps from point data.

```javascript

// Generate a density map
var density = ee.Image().paint(points, 1).convolve(ee.Kernel.gaussian(5, 3, 'meters'));

// Display the density map
Map.addLayer(density, {min: 0, max: 10, palette: ['white', 'blue']}, 'Density Map');
```
60. Detecting Changes Over Time
Analyze changes between different time periods using vector and raster layers.

```javascript

// Detect changes between two time periods
var change = urban2020.difference(urban2000);

// Display changes
Map.addLayer(change, {color: 'red'}, 'Urban Growth');

```
61. Time-Series Analysis with Vector Features
Track changes over time using vector data.

```javascript
// Create a time-series property for features
var timeSeries = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-122.2, 37.5]), {year: 2000, population: 500}),
  ee.Feature(ee.Geometry.Point([-122.2, 37.5]), {year: 2010, population: 800}),
  ee.Feature(ee.Geometry.Point([-122.2, 37.5]), {year: 2020, population: 1200})
]);

// Filter by year and analyze changes
var year2000 = timeSeries.filter(ee.Filter.eq('year', 2000));
var year2020 = timeSeries.filter(ee.Filter.eq('year', 2020));

// Print filtered data
print('Data for Year 2000:', year2000);
print('Data for Year 2020:', year2020);
```
62. Vector Rasterization
Convert vector data into raster format for pixel-based analysis.

```javascript

// Rasterize a FeatureCollection based on a property
var rasterized = polygons.reduceToImage({
  properties: ['id'],
  reducer: ee.Reducer.first()
});

// Display rasterized data
Map.addLayer(rasterized, {min: 0, max: 10, palette: ['yellow', 'orange']}, 'Rasterized Data');
```
63. Custom Kernels for Proximity Analysis
Design and apply custom kernels to analyze proximity or influence.

```javascript

// Create a custom kernel
var kernel = ee.Kernel.circle({
  radius: 1000,
  units: 'meters',
  normalize: true
});

// Apply the kernel to analyze point influence
var proximity = ee.Image().paint(points, 1).convolve(kernel);

// Display proximity map
Map.addLayer(proximity, {min: 0, max: 1, palette: ['white', 'blue']}, 'Proximity Map');
```
64. Dynamic Region Selection
Allow interactive selection of regions for processing.

```javascript

// Define a region dynamically (e.g., a manually drawn polygon)
var drawnRegion = ee.Geometry.Polygon([
  [[-122.3, 37.6], [-122.3, 37.8], [-122.1, 37.8], [-122.1, 37.6]]
]);

// Clip a raster using the dynamic region
var clippedRegion = elevation.clip(drawnRegion);

// Display the clipped raster
Map.addLayer(clippedRegion, {min: 0, max: 4000, palette: ['white', 'black']}, 'Clipped Region');
```
65. Optimizing Vector Processing
Improve performance for large FeatureCollections.

a. Tile-Based Processing
Divide large datasets into manageable tiles.

```javascript

// Divide the region into tiles
var tiles = ee.FeatureCollection.randomPoints({
  region: polygon,
  points: 100,
  seed: 42
});

// Process data tile by tile
var processedTiles = tiles.map(function(tile) {
  return tile.buffer(100).intersection(polygon);
});

// Display tiles
Map.addLayer(processedTiles, {color: 'purple'}, 'Processed Tiles');
```
b. Filtering by Attribute
Reduce computation by pre-filtering features.

```javascript

// Filter features with an attribute condition
var largePolygons = polygons.filter(ee.Filter.gt('area', 1e6));

// Display filtered polygons
Map.addLayer(largePolygons, {color: 'green'}, 'Large Polygons');
```
66. Creating Animated Maps
Visualize temporal changes with animations.

```javascript

// Load annual data
var years = ee.List.sequence(2000, 2020);
var annualFeatures = years.map(function(year) {
  var data = ee.FeatureCollection('users/yourusername/annual_data_' + year);
  return data.set('year', year);
});

// Create an animation
var animation = ee.ImageCollection(annualFeatures).map(function(feature) {
  return feature.set('year', feature.get('year'));
});

// Export animation
Export.video.toDrive({
  collection: animation,
  description: 'AnimatedMap',
  dimensions: 720,
  framesPerSecond: 2
});
```
67. Custom Feature Joins
Join vector datasets based on spatial or attribute relationships.

```javascript

// Perform a spatial join
var joined = ee.Join.saveAll('matches').apply({
  primary: polygons,
  secondary: points,
  condition: ee.Filter.intersects('.geo', null, '.geo')
});

// Display joined features
print('Joined Features:', joined);
```
68. Network Analysis
Analyze paths and connectivity between points.

```javascript

// Load road network data
var roads = ee.FeatureCollection('users/yourusername/road_network');

// Find the shortest path between points
var shortestPath = roads.shortestPath({
  start: ee.Geometry.Point([-122.1, 37.6]),
  end: ee.Geometry.Point([-121.9, 37.6])
});

// Display the shortest path
Map.addLayer(shortestPath, {color: 'red'}, 'Shortest Path');
```
69. Multi-Layer Analysis
Combine multiple vector and raster datasets for integrated analysis.

```javascript

// Combine land cover and population density
var combined = landcover.addBands(elevation).reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: polygon,
  scale: 30
});

// Print combined analysis result
print('Combined Analysis:', combined);
```
70. Real-Time Updates
Use streaming data or real-time updates in visualization.

```javascript

// Simulate real-time updates
var realTimePoints = ee.FeatureCollection.randomPoints({
  region: polygon,
  points: 10,
  seed: Date.now()
});

// Update map every 5 seconds
Map.addLayer(realTimePoints, {color: 'orange'}, 'Real-Time Points');

```
71. Integrating Machine Learning with Vectors
Combine vector data with machine learning models for predictions.

a. Feature Extraction for Training
Use vector attributes as training data for models.

```javascript

// Extract features from points
var trainingData = points.map(function(feature) {
  var elevationValue = elevation.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: feature.geometry(),
    scale: 30
  }).get('elevation');
  return feature.set('elevation', elevationValue);
});

// Print training data
print('Training Data:', trainingData);
```
b. Train a Classifier
Train a classifier with vector-based training data.

```javascript

// Create a training set with land cover labels
var trainingSet = polygons.map(function(feature) {
  return feature.set('label', feature.get('land_cover_type'));
});

// Train a random forest classifier
var classifier = ee.Classifier.smileRandomForest(10).train({
  features: trainingSet,
  classProperty: 'label',
  inputProperties: ['elevation', 'slope']
});

// Print classifier
print('Trained Classifier:', classifier);
```
72. Scaling Large Region Analysis
Process large regions efficiently using batch and tiling methods.

a. Batch Export
Export results for large areas using batch processing.

```javascript

// Export large analysis results
Export.table.toDrive({
  collection: polygons,
  description: 'LargeRegionAnalysis',
  fileFormat: 'CSV'
});
```
b. Tiling for Scalability
Divide analysis into tiles to avoid computation limits.

```javascript

// Create a grid for tiling
var grid = ee.FeatureCollection.randomPoints({
  region: ee.Geometry.BBox(-122.5, 37.5, -121.5, 38),
  points: 100
});

// Process each tile independently
var tiledAnalysis = grid.map(function(tile) {
  return tile.buffer(5000).intersection(polygon).set('tile_id', tile.get('system:index'));
});

// Display tiled results
Map.addLayer(tiledAnalysis, {color: 'cyan'}, 'Tiled Analysis');
```
73. Dynamic Apps with Earth Engine
Create interactive applications for visualization.

```javascript

// Import ui module for Earth Engine Apps
var ui = require('users/gena/packages:ui');

// Create a dynamic app
var slider = ui.Slider({
  min: 0,
  max: 100,
  value: 50,
  onChange: function(value) {
    Map.layers().reset([ui.Map.Layer(elevation.multiply(value))]);
  }
});

// Add the slider to the UI
ui.root.widgets().add(slider);
```
74. Custom Rasterization with Attributes
Use feature attributes to create a custom raster.

```javascript

// Rasterize features using a custom property
var customRaster = polygons.reduceToImage({
  properties: ['population_density'],
  reducer: ee.Reducer.mean()
});

// Display the custom raster
Map.addLayer(customRaster, {min: 0, max: 500, palette: ['white', 'red']}, 'Custom Raster');
```
75. Spatial Correlation Analysis
Analyze relationships between spatial features.

```javascript

// Calculate Moran's I for spatial correlation
var moransI = polygons.aggregate_stats({
  property: 'elevation',
  scale: 500,
  reducer: ee.Reducer.pearsonCorrelation()
});

// Print Moran's I result
print('Moran\'s I:', moransI);
```
76. Edge Detection in Vector Layers
Identify boundaries or edges in vector geometries.

```javascript

// Extract edges from a polygon
var edges = polygons.geometry().edges();

// Display edges
Map.addLayer(edges, {color: 'black'}, 'Edges');
```
77. Advanced Zonal Statistics
Perform advanced aggregation within vector polygons.

```javascript

// Compute zonal statistics for multiple layers
var advancedZonalStats = polygons.map(function(feature) {
  var stats = elevation.reduceRegion({
    reducer: ee.Reducer.mean().combine({
      reducer2: ee.Reducer.median(),
      sharedInputs: true
    }),
    geometry: feature.geometry(),
    scale: 30
  });
  return feature.set(stats);
});

// Print advanced zonal statistics
print('Advanced Zonal Statistics:', advancedZonalStats);
```
78. Global Region Processing
Handle vector data at a global scale.

```javascript

// Load a global dataset
var globalDataset = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level1');

// Filter to a specific region
var country = globalDataset.filter(ee.Filter.eq('ADM0_NAME', 'India'));

// Display the country data
Map.addLayer(country, {color: 'blue'}, 'Country Data');
```
79. Time-Weighted Analysis
Incorporate time as a weighting factor in vector analyses.

```javascript

// Apply time weights to features
var timeWeightedData = points.map(function(feature) {
  var timeWeight = ee.Date(feature.get('timestamp')).millis().divide(Date.now());
  return feature.set('time_weight', timeWeight);
});

// Display weighted data
print('Time-Weighted Data:', timeWeightedData);
80. Automated Workflow Integration
Combine multiple steps into a single workflow for automation.

```javascript

// Automated workflow combining clipping, rasterization, and export
var workflowResult = polygons.reduceToImage({
  properties: ['id'],
  reducer: ee.Reducer.first()
}).clip(polygon);

// Export the result
Export.image.toDrive({
  image: workflowResult,
  description: 'AutomatedWorkflow',
  scale: 30,
  region: polygon
});

```
81. Integrating External APIs
Connect external data sources and APIs with Earth Engine for enhanced workflows.

a. Fetch External Data
Use external APIs to fetch data and integrate it with Earth Engine.

```javascript

// Example: Fetch weather data via a REST API
var apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&daily=temperature_2m_max&timezone=auto';

// Simulate an API integration with an Earth Engine FeatureCollection
var apiData = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-122.4194, 37.7749]), {max_temp: 28}),
  ee.Feature(ee.Geometry.Point([-121.8863, 37.3382]), {max_temp: 30})
]);

// Display the external data
Map.addLayer(apiData, {color: 'red'}, 'API Data');
```
82. Custom Geometry Manipulation
Apply complex geometry operations to refine datasets.

```javascript

// Example: Split polygons into equal parts
var splitPolygons = polygons.map(function(feature) {
  var bounds = feature.geometry().bounds();
  var split = bounds.divide(2, 2); // Divide into 4 quadrants
  return ee.Feature(split).set(feature.toDictionary());
});

// Display split polygons
Map.addLayer(splitPolygons, {color: 'orange'}, 'Split Polygons');
```
83. Real-Time Dashboard Integration
Create live dashboards for data visualization.

```javascript

// Example: Set up a live map layer
var liveLayer = ui.Map.Layer(points, {color: 'blue'}, 'Live Data');

// Set up a dashboard panel
var panel = ui.Panel({
  widgets: [
    ui.Label('Live Dashboard'),
    ui.Label('Data Points: ' + points.size().getInfo())
  ],
  style: {width: '300px'}
});

// Add the panel and layer to the map
ui.root.add(panel);
Map.add(liveLayer);
```
84. Customized Export Formats
Export Earth Engine results in tailored formats.

```javascript

// Export data as GeoJSON
Export.table.toDrive({
  collection: polygons,
  description: 'CustomGeoJSON',
  fileFormat: 'GeoJSON'
});

// Export raster data with custom scale and region
Export.image.toDrive({
  image: elevation.clip(polygon),
  description: 'CustomRaster',
  scale: 10,
  region: polygon
});
```
85. Heatmap Generation
Create heatmaps based on point density or attributes.

```javascript

// Generate a heatmap from point density
var heatmap = ee.Image().paint(points, 1).convolve(ee.Kernel.gaussian(2000, 'meters'));

// Display the heatmap
Map.addLayer(heatmap, {min: 0, max: 10, palette: ['white', 'blue', 'red']}, 'Heatmap');
```
86. Vector-Based Interpolation
Perform spatial interpolation using vector data.

```javascript

// Interpolate values between points
var interpolated = points.reduceToImage({
  properties: ['value'],
  reducer: ee.Reducer.mean()
}).resample('bicubic');

// Display interpolated results
Map.addLayer(interpolated, {min: 0, max: 1, palette: ['white', 'green']}, 'Interpolated Data');
```
87. Land Use Change Detection
Analyze changes in land use over time using vector data.

```javascript

// Load historical land use data
var landUse2000 = ee.FeatureCollection('users/yourusername/land_use_2000');
var landUse2020 = ee.FeatureCollection('users/yourusername/land_use_2020');

// Detect changes between years
var changes = landUse2020.difference(landUse2000);

// Display land use changes
Map.addLayer(changes, {color: 'red'}, 'Land Use Changes');
```
88. Geospatial Optimization
Optimize geospatial processes, such as site selection.

```javascript

// Example: Find optimal locations for wind farms
var windSpeeds = ee.Image('path_to_wind_speed_data');
var optimalLocations = windSpeeds.gt(10).clip(polygon);

// Display optimal locations
Map.addLayer(optimalLocations, {palette: ['green']}, 'Optimal Wind Locations');
```
89. Multi-Layer Buffer Analysis
Buffer around multiple layers and analyze overlaps.

```javascript

// Apply buffers to multiple feature collections
var bufferedPoints = points.map(function(feature) {
  return feature.buffer(500);
});
var bufferedPolygons = polygons.map(function(feature) {
  return feature.buffer(1000);
});

// Analyze overlaps between buffers
var overlaps = bufferedPoints.union(bufferedPolygons);

// Display overlaps
Map.addLayer(overlaps, {color: 'purple'}, 'Buffer Overlaps');
```
90. Dynamic Web Map Integration
Integrate Earth Engine data with web mapping libraries like Leaflet.

```javascript

// Export a map tile for integration
Export.map.toCloudStorage({
  image: elevation,
  description: 'ElevationMap',
  bucket: 'your-bucket-name',
  fileFormat: 'PNG',
  path: 'maps/elevation_tiles'
});


91. Scalability Optimization with Parallel Processing
Optimize workflows by leveraging Earth Engine’s parallel processing capabilities.

a. Parallel Feature Mapping
Distribute operations across features in a FeatureCollection.

```javascript

// Apply operations in parallel
var parallelProcessing = polygons.map(function(feature) {
  var clippedImage = elevation.clip(feature.geometry());
  var meanElevation = clippedImage.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: feature.geometry(),
    scale: 30
  });
  return feature.set('mean_elevation', meanElevation.get('elevation'));
});

// Display results
print('Parallel Processing Results:', parallelProcessing);
```
b. Chunk-Based Processing
Divide large datasets into smaller chunks for efficient processing.

```javascript

// Split dataset into chunks
var chunkSize = 100;
var totalSize = polygons.size().getInfo();
for (var i = 0; i < totalSize; i += chunkSize) {
  var chunk = polygons.toList(chunkSize, i);
  var chunkFc = ee.FeatureCollection(chunk);
  // Perform processing on each chunk
  print('Processing Chunk:', chunkFc);
}
```
92. Integration with Google Cloud Services
Enhance workflows with Google Cloud resources like BigQuery and Cloud Storage.

a. BigQuery Integration
Export vector analysis results to BigQuery.

```javascript

// Export analysis results to BigQuery
Export.table.toBigQuery({
  collection: polygons,
  description: 'ExportToBigQuery',
  tableId: 'earth_engine_results',
  dataset: 'geo_analysis',
  projectId: 'your-project-id'
});
```
b. Cloud Storage Integration
Store and access large raster data using Google Cloud Storage.

```javascript

// Export raster data to Cloud Storage
Export.image.toCloudStorage({
  image: elevation.clip(polygon),
  description: 'ElevationToCloudStorage',
  bucket: 'your-bucket-name',
  fileNamePrefix: 'elevation_raster',
  scale: 30,
  region: polygon
});
```
