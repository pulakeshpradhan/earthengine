# Commonly Used GEE Syntax Reference
## [Goto Online Version for Copy the Codes Click Here ](https://github.com/pulakeshpradhan/Datasets/blob/main/gee_syntex.md)
This document provides a comprehensive reference for commonly used Google Earth Engine (GEE) syntax and functions, organized by category with detailed examples.

## Table of Contents
1. [Basic Display & Visualization](#basic-display--visualization)
   - [Map.addLayer()](#mapaddlayerimage-visparams-name)
   - [Map.centerObject()](#mapcenterobjectobject-zoom)
   - [print()](#printvariable)
   - [Map.setCenter()](#mapsetcenterlon-lat-zoom)
   - [Map.add()](#mapadduilabeltext)
2. [Loading Datasets](#loading-datasets)
   - [ee.Image()](#var-image--eeimagecopernicus2_sr20220101t00000020220101t000000)
   - [ee.ImageCollection()](#var-collection--eeimagecollectioncopernicus2)
   - [ee.FeatureCollection()](#var-feature--eefeaturecollectionfaogaul2015level1)
   - [ee.Image() (DEM)](#var-dem--eeimageusgs3)
3. [Filtering Data](#filtering-data)
   - [filterDate()](#collectionfilterdatedate2023-01-01-2023-12-31)
   - [filterBounds()](#collectionfilterboundsgeometry)
   - [filter()](#collectionfiltereefiltercloud_cover-0)
4. [Mathematical & Band Operations](#mathematical--band-operations)
   - [normalizedDifference()](#var-ndvi--imagenormalizeddifferenceb5-b4)
   - [select()](#var-image2--imageselectb4-b3-b2)
   - [add()](#var-newimage--imageaddimage2)
   - [multiply()](#var-newimage--imagemultiply2)
5. [Geometry & Feature Collection Operations](#geometry--feature-collection-operations)
   - [ee.Geometry.Point()](#var-point--eegeometrypointlon-lat)
   - [ee.Geometry.Polygon()](#var-polygon--eegeometrypolygonlon1-lat1-lon2-lat2-)
   - [ee.FeatureCollection()](#var-fc--eefeaturecollectionfeature1-feature2)
   - [filterBounds()](#fcfilterboundspoint)
6. [Reducing & Statistics](#reducing--statistics)
   - [reduce(ee.Reducer.mean())](#var-mean--collectionreduceeereducermean)
   - [reduce(ee.Reducer.minMax())](#var-minmax--collectionreduceeereducerminmax)
   - [reduce(ee.Reducer.sum())](#var-sum--collectionreduceeereducersum)
   - [reduceRegion()](#var-histogram--imagereduceregion-reducer-eereducerhistogram-geometry-region-)
7. [Exporting Data](#exporting-data)
   - [Export.image.toDrive()](#exportimagetodriveimage-img-description-export-scale-30-region-geometry)
   - [Export.table.toDrive()](#exporttabletodrivecolection-fc-description-export_fc)
   - [Export.image.toAsset()](#exportimagetoassetimage-img-description-export_asset)
8. [Miscellaneous](#miscellaneous)
   - [clip()](#imageclipregion)
   - [median()](#collectionmedian)

## Basic Display & Visualization
*Functions for visualizing data and controlling the map display*

### Map.addLayer(image, visParams, name)
Adds an image/layer to the map.

**Example:**
```javascript
// Load a Landsat 8 image
var landsat = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318');

// Define visualization parameters
var visParams = {
  bands: ['B4', 'B3', 'B2'],  // Use Red, Green, Blue bands
  min: 0,                     // Minimum value for display
  max: 0.3,                   // Maximum value for display
  gamma: 1.4                  // Gamma correction
};

// Add the image to the map
Map.addLayer(landsat, visParams, 'Landsat 8 RGB');

// Add a single band with a different color palette
Map.addLayer(landsat.select('B5'), 
  {min: 0, max: 0.4, palette: ['blue', 'green', 'red']}, 
  'NIR Band');
```

### Map.centerObject(object, zoom)
Centers the map on a feature/geometry/image.

**Example:**
```javascript
// Create a point for San Francisco
var sanFrancisco = ee.Geometry.Point([-122.4193, 37.7749]);

// Center the map on the point with zoom level 10
Map.centerObject(sanFrancisco, 10);

// Center on a feature collection with automatic zoom
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
var brazil = countries.filter(ee.Filter.eq('country_na', 'Brazil'));
Map.centerObject(brazil);
```

### print(variable)
Prints a variable to the Console.

**Example:**
```javascript
// Print a simple message
print('Hello Earth Engine!');

// Print an Earth Engine object
var image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318');
print('Landsat Image:', image);

// Print properties of an image
print('Image Bands:', image.bandNames());
print('Image Projection:', image.projection());

// Print a dictionary
var stats = {min: 0, max: 255, mean: 127.5};
print('Statistics:', stats);
```

### Map.setCenter(lon, lat, zoom)
Centers the map at a specific latitude and longitude.

**Example:**
```javascript
// Center the map on Tokyo, Japan with zoom level 8
Map.setCenter(139.6917, 35.6895, 8);

// Center on the Amazon Rainforest with a closer zoom
Map.setCenter(-60.5, -3.0, 6);
```

### Map.add(ui.Label('Text'))
Adds a UI label to the map.

**Example:**
```javascript
// Create a simple label
var simpleLabel = ui.Label('This is a map label');
Map.add(simpleLabel);

// Create a styled label
var styledLabel = ui.Label({
  value: 'NDVI Analysis Results',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '10px',
    padding: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  }
});
Map.add(styledLabel);

// Create a panel with multiple labels
var panel = ui.Panel({
  style: {
    position: 'top-left',
    padding: '8px',
    width: '300px'
  }
});
panel.add(ui.Label('Vegetation Analysis'));
panel.add(ui.Label('Data source: Landsat 8'));
Map.add(panel);
```

[Back to top](#comprehensive-google-earth-engine-gee-syntax-reference)

## Loading Datasets
*Functions for loading satellite imagery, collections, and vector data*

### var image = ee.Image('COPERNICUS/S2_SR/20220101T000000_20220101T000000')
Loads a satellite image.

**Example:**
```javascript
// Load a specific Sentinel-2 surface reflectance image
var sentinel2Image = ee.Image('COPERNICUS/S2_SR/20220101T104429_20220101T104426_T31TFJ');
print('Sentinel-2 Image:', sentinel2Image);

// Load a Landsat 8 image
var landsat8Image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_123032_20210615');
print('Landsat 8 Image:', landsat8Image);

// Load a MODIS image
var modisImage = ee.Image('MODIS/006/MOD13A2/2022_01_01');
print('MODIS Image:', modisImage);

// Access image properties
print('Acquisition date:', sentinel2Image.get('system:time_start'));
print('Cloud cover percentage:', sentinel2Image.get('CLOUDY_PIXEL_PERCENTAGE'));
```

### var collection = ee.ImageCollection('COPERNICUS/S2')
Loads an image collection.

**Example:**
```javascript
// Load the Sentinel-2 image collection
var sentinel2Collection = ee.ImageCollection('COPERNICUS/S2');
print('Sentinel-2 Collection:', sentinel2Collection);

// Load the MODIS NDVI collection
var modisNDVI = ee.ImageCollection('MODIS/006/MOD13Q1');
print('MODIS NDVI Collection:', modisNDVI);

// Load Landsat 8 collection
var landsat8Collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA');
print('Landsat 8 Collection:', landsat8Collection);

// Get collection metadata
print('Number of images in collection:', sentinel2Collection.size());
print('Collection date range:', sentinel2Collection.date());
```

### var feature = ee.FeatureCollection('FAO/GAUL/2015/level1')
Loads a feature collection (vector data).

**Example:**
```javascript
// Load country boundaries
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
print('Countries:', countries);

// Load administrative boundaries (level 1 - states/provinces)
var adminLevel1 = ee.FeatureCollection('FAO/GAUL/2015/level1');
print('Admin Level 1:', adminLevel1);

// Load watershed boundaries
var watersheds = ee.FeatureCollection('WWF/HydroSHEDS/v1/Basins/hybas_12');
print('Watersheds:', watersheds);

// Filter a feature collection
var california = adminLevel1.filter(ee.Filter.and(
  ee.Filter.eq('ADM0_NAME', 'United States of America'),
  ee.Filter.eq('ADM1_NAME', 'California')
));
print('California:', california);
```

### var dem = ee.Image('USGS/SRTMGL1_003')
Loads a Digital Elevation Model (DEM).

**Example:**
```javascript
// Load SRTM 30m global DEM
var srtm = ee.Image('USGS/SRTMGL1_003');
print('SRTM DEM:', srtm);

// Load ALOS 30m global DEM
var alos = ee.Image('JAXA/ALOS/AW3D30/V2_2');
print('ALOS DEM:', alos);

// Visualize elevation data
Map.setCenter(-119.5383, 37.8651, 9); // Yosemite National Park
Map.addLayer(srtm, {min: 0, max: 4000, palette: ['blue', 'green', 'yellow', 'brown', 'white']}, 'SRTM DEM');

// Calculate slope and aspect from DEM
var slope = ee.Terrain.slope(srtm);
var aspect = ee.Terrain.aspect(srtm);
Map.addLayer(slope, {min: 0, max: 60}, 'Slope (degrees)');
Map.addLayer(aspect, {min: 0, max: 360, palette: ['blue', 'green', 'yellow', 'orange', 'red']}, 'Aspect (degrees)');
```

[Back to top](#comprehensive-google-earth-engine-gee-syntax-reference)

## Filtering Data
*Functions for subsetting and filtering image collections and feature collections*

### collection.filterDate('2023-01-01', '2023-12-31')
Filters images by date.

**Example:**
```javascript
// Load Sentinel-2 collection
var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR');

// Filter by date range (for the year 2023)
var s2_2023 = sentinel2.filterDate('2023-01-01', '2023-12-31');
print('Images from 2023:', s2_2023.size());

// Filter by specific season (summer 2023)
var s2_summer = sentinel2.filterDate('2023-06-01', '2023-08-31');
print('Summer 2023 images:', s2_summer.size());

// Filter by specific month and sort by cloud cover
var s2_july = sentinel2.filterDate('2023-07-01', '2023-07-31')
  .sort('CLOUDY_PIXEL_PERCENTAGE');
print('July 2023 images (sorted by cloud cover):', s2_july);

// Get the most recent image from a date range
var endDate = ee.Date('2023-12-31');
var startDate = endDate.advance(-1, 'month');
var recentImage = sentinel2
  .filterDate(startDate, endDate)
  .sort('system:time_start', false) // Sort in descending order
  .first();
print('Most recent image:', recentImage);
```

### collection.filterBounds(geometry)
Filters images by geographic region.

**Example:**
```javascript
// Define a region of interest (ROI)
var roi = ee.Geometry.Rectangle([-122.5, 37.5, -122.0, 38.0]); // San Francisco area

// Load Landsat 8 collection
var landsat8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA');

// Filter collection by the ROI
var landsatSF = landsat8.filterBounds(roi);
print('Images intersecting ROI:', landsatSF.size());

// Combine with date filter
var landsatSF_2023 = landsat8
  .filterBounds(roi)
  .filterDate('2023-01-01', '2023-12-31');
print('2023 images intersecting ROI:', landsatSF_2023.size());

// Filter using a point
var mountEverest = ee.Geometry.Point([86.9250, 27.9881]);
var landsatEverest = landsat8
  .filterBounds(mountEverest)
  .filterDate('2023-01-01', '2023-12-31');
print('2023 images covering Mount Everest:', landsatEverest.size());

// Filter using a feature collection
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
var japan = countries.filter(ee.Filter.eq('country_na', 'Japan'));
var landsatJapan = landsat8
  .filterBounds(japan.geometry())
  .filterDate('2023-01-01', '2023-01-31');
print('January 2023 images covering Japan:', landsatJapan.size());
```

### collection.filter(ee.Filter.eq('CLOUD_COVER', 0))
Filters images based on metadata properties.

**Example:**
```javascript
// Load Landsat 8 collection
var landsat8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA');

// Filter by cloud cover (less than 10%)
var clearImages = landsat8.filter(ee.Filter.lt('CLOUD_COVER', 10));
print('Images with < 10% cloud cover:', clearImages.size());

// Filter by exact property match
var path44 = landsat8.filter(ee.Filter.eq('WRS_PATH', 44));
print('Images from Path 44:', path44.size());

// Combine multiple filters
var clearPath44 = landsat8
  .filter(ee.Filter.and(
    ee.Filter.eq('WRS_PATH', 44),
    ee.Filter.lt('CLOUD_COVER', 10)
  ));
print('Clear images from Path 44:', clearPath44.size());

// Filter by date and properties
var recentClearImages = landsat8
  .filterDate('2023-01-01', '2023-12-31')
  .filter(ee.Filter.lt('CLOUD_COVER', 5));
print('Clear 2023 images:', recentClearImages.size());

// Filter by list of values
var pathList = ee.List([44, 45, 46]);
var multiPath = landsat8.filter(ee.Filter.inList('WRS_PATH', pathList));
print('Images from multiple paths:', multiPath.size());
```

[Back to top](#comprehensive-google-earth-engine-gee-syntax-reference)

## Mathematical & Band Operations
*Functions for performing calculations and manipulating image bands*

### var ndvi = image.normalizedDifference(['B5', 'B4'])
Calculates NDVI (or any other index).

**Example:**
```javascript
// Load a Landsat 8 image
var landsat = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318');

// Calculate NDVI (Normalized Difference Vegetation Index)
// For Landsat 8: NIR is B5, Red is B4
var ndvi = landsat.normalizedDifference(['B5', 'B4']);
Map.addLayer(ndvi, {min: -1, max: 1, palette: ['blue', 'white', 'green']}, 'NDVI');

// Calculate NDWI (Normalized Difference Water Index)
// For Landsat 8: Green is B3, NIR is B5
var ndwi = landsat.normalizedDifference(['B3', 'B5']);
Map.addLayer(ndwi, {min: -1, max: 1, palette: ['white', 'blue']}, 'NDWI');

// Calculate EVI (Enhanced Vegetation Index)
// EVI = 2.5 * ((NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1))
var evi = landsat.expression(
  '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
    'NIR': landsat.select('B5'),
    'RED': landsat.select('B4'),
    'BLUE': landsat.select('B2')
  });
Map.addLayer(evi, {min: -1, max: 1, palette: ['white', 'darkgreen']}, 'EVI');

// Create a mask for high vegetation areas
var vegetationMask = ndvi.gt(0.4);
Map.addLayer(vegetationMask, {palette: ['white', 'green']}, 'Vegetation Mask');
```

### var image2 = image.select(['B4', 'B3', 'B2'])
Selects specific bands.

**Example:**
```javascript
// Load a Sentinel-2 image
var sentinel2 = ee.Image('COPERNICUS/S2_SR/20210701T101559_20210701T101554_T33UUP');

// Select RGB bands
var rgbImage = sentinel2.select(['B4', 'B3', 'B2']);
Map.addLayer(rgbImage, {min: 0, max: 3000}, 'RGB Image');

// Select NIR band
var nirImage = sentinel2.select('B8');
Map.addLayer(nirImage, {min: 0, max: 3000, palette: ['black', 'white']}, 'NIR Band');

// Select multiple bands and rename them
var selectedBands = sentinel2.select(
  ['B8', 'B4', 'B3', 'B2'], // Original band names
  ['nir', 'red', 'green', 'blue'] // New band names
);
print('Selected bands with new names:', selectedBands);

// Select all bands that match a pattern (using regular expression)
var allBands = sentinel2.bandNames();
print('All bands:', allBands);

var selectedBands = sentinel2.select('B.*'); // Select all bands starting with 'B'
print('Bands starting with B:', selectedBands.bandNames());
```

### var newImage = image.add(image2)
Adds two images.

**Example:**
```javascript
// Load two Landsat 8 images from different dates
var image1 = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318');
var image2 = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20150321');

// Add corresponding bands
var sumImage = image1.add(image2);
Map.addLayer(sumImage.select(['B4', 'B3', 'B2']), 
  {min: 0, max: 0.6}, 'Sum of two images');

// Calculate the difference between images (for change detection)
var diffImage = image2.subtract(image1);
Map.addLayer(diffImage.select(['B4', 'B3', 'B2']), 
  {min: -0.2, max: 0.2}, 'Difference between images');

// Calculate the average of two images
var avgImage = image1.add(image2).divide(2);
Map.addLayer(avgImage.select(['B4', 'B3', 'B2']), 
  {min: 0, max: 0.3}, 'Average of two images');

// Perform band-wise operations
var ndvi1 = image1.normalizedDifference(['B5', 'B4']);
var ndvi2 = image2.normalizedDifference(['B5', 'B4']);
var ndviDiff = ndvi2.subtract(ndvi1);
Map.addLayer(ndviDiff, 
  {min: -0.5, max: 0.5, palette: ['red', 'white', 'green']}, 
  'NDVI Change');
```

### var newImage = image.multiply(2)
Multiplies an image by a constant.

**Example:**
```javascript
// Load a Landsat 8 image
var landsat = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318');

// Multiply all bands by a constant (e.g., for scaling)
var scaledImage = landsat.multiply(10000);
print('Original range:', landsat.select('B4').reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: landsat.geometry(),
  scale: 30
}));
print('Scaled range:', scaledImage.select('B4').reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: landsat.geometry(),
  scale: 30
}));

// Apply different scaling factors to different bands
var scaleFactors = ee.Image([0.0001, 0.0001, 0.0001, 1]); // Different factors for each band
var selectedBands = landsat.select(['B2', 'B3', 'B4', 'B5']);
var customScaled = selectedBands.multiply(scaleFactors);
Map.addLayer(customScaled, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 'Custom Scaled');

// Convert temperature from Kelvin to Celsius
var thermal = landsat.select('B10'); // Thermal band in Kelvin
var celsius = thermal.multiply(0.1).subtract(273.15); // K to C conversion
Map.addLayer(celsius, {min: -10, max: 30, palette: ['blue', 'white', 'red']}, 'Temperature (C)');

// Calculate percent reflectance
var percentReflectance = landsat.select(['B4', 'B3', 'B2']).multiply(100);
Map.addLayer(percentReflectance, {min: 0, max: 30}, 'Percent Reflectance');
```

[Back to top](#comprehensive-google-earth-engine-gee-syntax-reference)

## Geometry & Feature Collection Operations
*Functions for creating and manipulating vector geometries and feature collections*

### var point = ee.Geometry.Point([lon, lat])
Creates a point geometry.

**Example:**
```javascript
// Create a point for New York City
var nyc = ee.Geometry.Point([-74.0060, 40.7128]);
print('NYC Point:', nyc);

// Add the point to the map
Map.centerObject(nyc, 10);
Map.addLayer(nyc, {color: 'red'}, 'New York City');

// Create a point from coordinates
var longitude = -118.2437;
var latitude = 34.0522;
var losAngeles = ee.Geometry.Point([longitude, latitude]);
Map.addLayer(losAngeles, {color: 'blue'}, 'Los Angeles');

// Get information about the point
print('Point coordinates:', nyc.coordinates());
print('Point type:', nyc.type());
print('Point area (should be 0):', nyc.area());

// Buffer a point to create a circle
var bufferedPoint = nyc.buffer(10000); // 10km buffer
Map.addLayer(bufferedPoint, {color: 'yellow'}, 'NYC 10km Buffer');
```

### var polygon = ee.Geometry.Polygon([[[lon1, lat1], [lon2, lat2], ...]])
Creates a polygon.

**Example:**
```javascript
// Create a polygon for Yellowstone National Park (approximate)
var yellowstone = ee.Geometry.Polygon([
  [[-111.2, 44.6],
   [-111.2, 45.1],
   [-109.9, 45.1],
   [-109.9, 44.6],
   [-111.2, 44.6]]
]);

// Add the polygon to the map
Map.centerObject(yellowstone, 8);
Map.addLayer(yellowstone, {color: 'green'}, 'Yellowstone National Park');

// Create a rectangle (simplified polygon)
var rectangle = ee.Geometry.Rectangle([-122.5, 37.5, -122.0, 38.0]);
Map.addLayer(rectangle, {color: 'blue'}, 'San Francisco Bay Area');

// Create a multi-polygon
var multiPolygon = ee.Geometry.MultiPolygon([
  [[[-122.1, 37.4], [-122.1, 37.5], [-122.0, 37.5], [-122.0, 37.4], [-122.1, 37.4]]], // Polygon 1
  [[[-122.3, 37.6], [-122.3, 37.7], [-122.2, 37.7], [-122.2, 37.6], [-122.3, 37.6]]]  // Polygon 2
]);
Map.addLayer(multiPolygon, {color: 'red'}, 'Multi-Polygon');

// Calculate polygon area
print('Yellowstone area (square meters):', yellowstone.area());
print('Yellowstone perimeter (meters):', yellowstone.perimeter());

// Check if a point is inside a polygon
var testPoint = ee.Geometry.Point([-110.5, 44.8]);
print('Is point inside Yellowstone?', yellowstone.contains(testPoint));
```

### var fc = ee.FeatureCollection([feature1, feature2])
Creates a Feature Collection.

**Example:**
```javascript
// Create features with properties
var city1 = ee.Feature(
  ee.Geometry.Point([-122.4194, 37.7749]), // San Francisco
  {name: 'San Francisco', population: 874961, state: 'CA'}
);

var city2 = ee.Feature(
  ee.Geometry.Point([-74.0060, 40.7128]), // New York
  {name: 'New York', population: 8804190, state: 'NY'}
);

var city3 = ee.Feature(
  ee.Geometry.Point([-87.6298, 41.8781]), // Chicago
  {name: 'Chicago', population: 2746388, state: 'IL'}
);

// Create a feature collection from the features
var cities = ee.FeatureCollection([city1, city2, city3]);
print('Cities collection:', cities);

// Add the feature collection to the map
Map.setCenter(-95, 40, 4);
Map.addLayer(cities, {color: 'red'}, 'Major US Cities');

// Create a feature collection from a list of geometries
var points = [
  ee.Geometry.Point([-122.4, 37.8]),
  ee.Geometry.Point([-122.5, 37.7]),
  ee.Geometry.Point([-122.3, 37.9])
];
var pointCollection = ee.FeatureCollection(points);
Map.addLayer(pointCollection, {color: 'blue'}, 'Bay Area Points');

// Create a feature collection with computed properties
var citiesWithDensity = cities.map(function(city) {
  // Add a new property based on existing properties
  return city.set('density', ee.Number(city.get('population')).divide(100));
});
print('Cities with density:', citiesWithDensity);
```

### fc.filterBounds(point)
Filters features based on location.

**Example:**
```javascript
// Load country boundaries
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Create a point for Paris
var paris = ee.Geometry.Point([2.3522, 48.8566]);

// Filter to find which country contains Paris
var franceFilter = countries.filterBounds(paris);
print('Country containing Paris:', franceFilter);

// Load global cities dataset
var cities = ee.FeatureCollection('projects/sat-io/open-datasets/hrsl/hrsl_cities');

// Define a region of interest (California)
var california = ee.Geometry.Rectangle([-124.4, 32.5, -114.1, 42.0]);

// Filter cities that fall within California
var californiaCities = cities.filterBounds(california);
print('Number of cities in California:', californiaCities.size());
Map.addLayer(californiaCities, {color: 'yellow'}, 'California Cities');

// Filter features that intersect with a buffer
var bufferZone = paris.buffer(100000); // 100km around Paris
var nearbyCountries = countries.filterBounds(bufferZone);
print('Countries within 100km of Paris:', nearbyCountries);

// Combine with property filters
var europeanCountriesNearParis = countries
  .filter(ee.Filter.eq('continent', 'Europe'))
  .filterBounds(bufferZone);
print('European countries near Paris:', europeanCountriesNearParis);
```

[Back to top](#comprehensive-google-earth-engine-gee-syntax-reference)

## Reducing & Statistics
*Functions for computing statistics and aggregating data across collections and regions*

### var mean = collection.reduce(ee.Reducer.mean())
Computes the mean of an image collection.

**Example:**
```javascript
// Load a Landsat 8 collection for a specific area and time
var roi = ee.Geometry.Point([-122.3578, 37.7726]).buffer(50000); // San Francisco area
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterDate('2020-01-01', '2020-12-31')
  .filterBounds(roi);

// Calculate the mean (average) image across the collection
var meanImage = collection.reduce(ee.Reducer.mean());
Map.centerObject(roi, 9);
Map.addLayer(meanImage, 
  {bands: ['B4_mean', 'B3_mean', 'B2_mean'], min: 0, max: 0.3}, 
  'Mean RGB');

// Calculate mean NDVI across the collection
var ndviCollection = collection.map(function(image) {
  return image.normalizedDifference(['B5', 'B4']).rename('NDVI');
});
var meanNDVI = ndviCollection.reduce(ee.Reducer.mean());
Map.addLayer(meanNDVI, 
  {min: -0.2, max: 0.8, palette: ['blue', 'white', 'green']}, 
  'Mean NDVI');

// Calculate mean by season
var winter = collection.filter(ee.Filter.calendarRange(12, 2, 'month'));
var summer = collection.filter(ee.Filter.calendarRange(6, 8, 'month'));
var winterMean = winter.reduce(ee.Reducer.mean());
var summerMean = summer.reduce(ee.Reducer.mean());
Map.addLayer(winterMean, 
  {bands: ['B4_mean', 'B3_mean', 'B2_mean'], min: 0, max: 0.3}, 
  'Winter Mean');
Map.addLayer(summerMean, 
  {bands: ['B4_mean', 'B3_mean', 'B2_mean'], min: 0, max: 0.3}, 
  'Summer Mean');
```

### var minMax = collection.reduce(ee.Reducer.minMax())
Computes min and max values.

**Example:**
```javascript
// Load a Landsat 8 collection for a specific area and time
var roi = ee.Geometry.Point([-122.3578, 37.7726]).buffer(50000); // San Francisco area
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterDate('2020-01-01', '2020-12-31')
  .filterBounds(roi);

// Calculate min and max values across the collection
var minMaxImage = collection.reduce(ee.Reducer.minMax());
Map.centerObject(roi, 9);

// Display the minimum values
Map.addLayer(minMaxImage, 
  {bands: ['B4_min', 'B3_min', 'B2_min'], min: 0, max: 0.3}, 
  'Min RGB');

// Display the maximum values
Map.addLayer(minMaxImage, 
  {bands: ['B4_max', 'B3_max', 'B2_max'], min: 0, max: 0.3}, 
  'Max RGB');

// Calculate the range (max - min)
var rangeImage = minMaxImage.select('.*_max').subtract(minMaxImage.select('.*_min'));
// Rename the bands to remove the _max suffix
var bandNames = rangeImage.bandNames().map(function(name) {
  return ee.String(name).replace('_max', '_range');
});
rangeImage = rangeImage.rename(bandNames);
Map.addLayer(rangeImage, 
  {bands: ['B4_range', 'B3_range', 'B2_range'], min: 0, max: 0.3}, 
  'Range RGB');

// Calculate min/max NDVI
var ndviCollection = collection.map(function(image) {
  return image.normalizedDifference(['B5', 'B4']).rename('NDVI');
});
var ndviMinMax = ndviCollection.reduce(ee.Reducer.minMax());
Map.addLayer(ndviMinMax.select('NDVI_min'), 
  {min: -0.2, max: 0.8, palette: ['blue', 'white', 'green']}, 
  'Min NDVI');
Map.addLayer(ndviMinMax.select('NDVI_max'), 
  {min: -0.2, max: 0.8, palette: ['blue', 'white', 'green']}, 
  'Max NDVI');
```

### var sum = collection.reduce(ee.Reducer.sum())
Computes the sum of pixel values.

**Example:**
```javascript
// Load a MODIS precipitation collection
var precipitation = ee.ImageCollection('UCSB-CHG/CHIRPS/PENTAD')
  .filterDate('2020-01-01', '2020-12-31');

// Calculate total annual precipitation
var annualPrecip = precipitation.reduce(ee.Reducer.sum());
Map.addLayer(annualPrecip, 
  {min: 0, max: 3000, palette: ['white', 'blue', 'purple']}, 
  'Annual Precipitation (mm)');

// Calculate seasonal precipitation
var winterMonths = ee.List([12, 1, 2]);
var springMonths = ee.List([3, 4, 5]);
var summerMonths = ee.List([6, 7, 8]);
var fallMonths = ee.List([9, 10, 11]);

// Filter by season and calculate sum
var winterPrecip = precipitation
  .filter(ee.Filter.calendarRange(12, 2, 'month'))
  .reduce(ee.Reducer.sum());
var springPrecip = precipitation
  .filter(ee.Filter.calendarRange(3, 5, 'month'))
  .reduce(ee.Reducer.sum());
var summerPrecip = precipitation
  .filter(ee.Filter.calendarRange(6, 8, 'month'))
  .reduce(ee.Reducer.sum());
var fallPrecip = precipitation
  .filter(ee.Filter.calendarRange(9, 11, 'month'))
  .reduce(ee.Reducer.sum());

// Display seasonal precipitation
Map.addLayer(winterPrecip, 
  {min: 0, max: 1000, palette: ['white', 'blue', 'purple']}, 
  'Winter Precipitation');
Map.addLayer(summerPrecip, 
  {min: 0, max: 1000, palette: ['white', 'blue', 'purple']}, 
  'Summer Precipitation');

// Calculate cumulative precipitation over time
var cumulativePrecip = precipitation.sort('system:time_start').iterate(
  function(image, result) {
    result = ee.Image(result);
    image = ee.Image(image);
    return result.add(image);
  },
  ee.Image.constant(0)
);
Map.addLayer(ee.Image(cumulativePrecip), 
  {min: 0, max: 3000, palette: ['white', 'blue', 'purple']}, 
  'Cumulative Precipitation');
```

### var histogram = image.reduceRegion({ reducer: ee.Reducer.histogram(), geometry: region })
Computes a histogram of pixel values.

**Example:**
```javascript
// Load a Landsat 8 image
var landsat = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318');

// Define a region of interest
var roi = ee.Geometry.Rectangle([-122.5, 37.5, -122.0, 38.0]); // San Francisco Bay Area

// Calculate NDVI
var ndvi = landsat.normalizedDifference(['B5', 'B4']).rename('NDVI');

// Compute histogram of NDVI values in the region
var histogram = ndvi.reduceRegion({
  reducer: ee.Reducer.histogram({
    maxBuckets: 30
  }),
  geometry: roi,
  scale: 30,
  maxPixels: 1e9
});

// Print the histogram
print('NDVI Histogram:', histogram);

// Access histogram properties
var ndviHistogram = ee.Dictionary(histogram.get('NDVI'));
var counts = ndviHistogram.get('histogram');
var buckets = ndviHistogram.get('bucketMeans');
print('Histogram counts:', counts);
print('Bucket means:', buckets);

// Compute histograms for multiple bands
var rgbHistograms = landsat.select(['B4', 'B3', 'B2']).reduceRegion({
  reducer: ee.Reducer.histogram({
    maxBuckets: 50
  }),
  geometry: roi,
  scale: 30,
  maxPixels: 1e9
});
print('RGB Histograms:', rgbHistograms);

// Compute statistics from histogram
var ndviStats = ndvi.reduceRegion({
  reducer: ee.Reducer.mean().combine({
    reducer2: ee.Reducer.stdDev(),
    sharedInputs: true
  }),
  geometry: roi,
  scale: 30,
  maxPixels: 1e9
});
print('NDVI Statistics:', ndviStats);
```

[Back to top](#comprehensive-google-earth-engine-gee-syntax-reference)

## Exporting Data
*Functions for exporting images and feature collections to Google Drive and Earth Engine assets*

### Export.image.toDrive({image: img, description: 'export', scale: 30, region: geometry})
Exports an image to Google Drive.

**Example:**
```javascript
// Load a Landsat 8 image
var landsat = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318');

// Define a region of interest
var roi = ee.Geometry.Rectangle([-122.5, 37.5, -122.0, 38.0]); // San Francisco Bay Area

// Select RGB bands for a natural color image
var rgb = landsat.select(['B4', 'B3', 'B2']);

// Export the RGB image to Google Drive
Export.image.toDrive({
  image: rgb,
  description: 'Landsat8_RGB_SanFrancisco',
  folder: 'GEE_Exports',
  scale: 30,  // 30 meters per pixel
  region: roi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e9
});

// Export an NDVI image
var ndvi = landsat.normalizedDifference(['B5', 'B4']).rename('NDVI');
Export.image.toDrive({
  image: ndvi,
  description: 'Landsat8_NDVI_SanFrancisco',
  folder: 'GEE_Exports',
  scale: 30,
  region: roi,
  fileFormat: 'GeoTIFF'
});

// Export with different parameters
Export.image.toDrive({
  image: landsat.select(['B4', 'B3', 'B2', 'B5', 'B6']),
  description: 'Landsat8_Multispectral',
  folder: 'GEE_Exports',
  scale: 100,  // Coarser resolution (100m)
  region: roi,
  fileFormat: 'GeoTIFF',
  crs: 'EPSG:4326',  // WGS84 coordinate system
  dimensions: null,  // Use scale instead of dimensions
  skipEmptyTiles: true
});

// Export a classified image
var classified = landsat.select('B5').gt(0.2).add(landsat.select('B4').gt(0.2)).rename('classes');
Export.image.toDrive({
  image: classified,
  description: 'Landsat8_Classification',
  folder: 'GEE_Exports',
  scale: 30,
  region: roi,
  fileFormat: 'GeoTIFF'
});
```

### Export.table.toDrive({collection: fc, description: 'export_fc'})
Exports a feature collection to Google Drive.

**Example:**
```javascript
// Load country boundaries
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Filter to get specific countries
var selectedCountries = countries.filter(ee.Filter.inList('country_na', 
  ['Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia']));

// Export the feature collection to Google Drive as a shapefile
Export.table.toDrive({
  collection: selectedCountries,
  description: 'South_American_Countries',
  folder: 'GEE_Exports',
  fileFormat: 'SHP'  // Shapefile format
});

// Export as CSV with selected properties
Export.table.toDrive({
  collection: selectedCountries,
  description: 'South_American_Countries_CSV',
  folder: 'GEE_Exports',
  fileFormat: 'CSV',
  selectors: ['country_na', 'iso_alpha3']  // Only export these properties
});

// Export as GeoJSON
Export.table.toDrive({
  collection: selectedCountries,
  description: 'South_American_Countries_GeoJSON',
  folder: 'GEE_Exports',
  fileFormat: 'GeoJSON'
});

// Export with computed properties
var countriesWithArea = selectedCountries.map(function(feature) {
  // Add area in square kilometers
  var area = feature.geometry().area().divide(1000 * 1000);
  return feature.set('area_km2', area);
});

Export.table.toDrive({
  collection: countriesWithArea,
  description: 'South_American_Countries_With_Area',
  folder: 'GEE_Exports',
  fileFormat: 'CSV',
  selectors: ['country_na', 'area_km2']
});
```

### Export.image.toAsset({image: img, description: 'export_asset'})
Exports an image to an Earth Engine asset.

**Example:**
```javascript
// Load a Landsat 8 image
var landsat = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318');

// Define a region of interest
var roi = ee.Geometry.Rectangle([-122.5, 37.5, -122.0, 38.0]); // San Francisco Bay Area

// Calculate NDVI
var ndvi = landsat.normalizedDifference(['B5', 'B4']).rename('NDVI');

// Export the NDVI image to an Earth Engine asset
Export.image.toAsset({
  image: ndvi,
  description: 'NDVI_SanFrancisco',
  assetId: 'users/username/NDVI_SanFrancisco',  // Replace 'username' with your GEE username
  scale: 30,
  region: roi,
  maxPixels: 1e9
});

// Export a composite image to an asset
var composite = landsat.select(['B4', 'B3', 'B2', 'B5']);
Export.image.toAsset({
  image: composite,
  description: 'Landsat_Composite',
  assetId: 'users/username/Landsat_Composite',
  scale: 30,
  region: roi,
  maxPixels: 1e9
});

// Export a classified image to an asset
var classified = ndvi.gt(0.3).rename('vegetation');
Export.image.toAsset({
  image: classified,
  description: 'Vegetation_Mask',
  assetId: 'users/username/Vegetation_Mask',
  scale: 30,
  region: roi,
  maxPixels: 1e9
});

// Export with pyramiding policy
var elevation = ee.Image('USGS/SRTMGL1_003');
Export.image.toAsset({
  image: elevation.clip(roi),
  description: 'SRTM_Elevation',
  assetId: 'users/username/SRTM_Elevation',
  scale: 30,
  region: roi,
  maxPixels: 1e9,
  pyramidingPolicy: {'.default': 'mean'}  // Use mean for pyramiding
});
```

[Back to top](#comprehensive-google-earth-engine-gee-syntax-reference)

## Miscellaneous
*Additional useful functions for various operations in Earth Engine*


### image.clip(region)
Clips an image to a specified region.

**Example:**
```javascript
// Load a Landsat 8 image
var landsat = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318');

// Define a region to clip to (San Francisco Bay Area)
var roi = ee.Geometry.Rectangle([-122.5, 37.5, -122.0, 38.0]);

// Clip the image to the region
var clippedImage = landsat.clip(roi);

// Display the clipped image
Map.centerObject(roi, 10);
Map.addLayer(clippedImage, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 'Clipped Landsat Image');

// Clip a DEM to a country boundary
var dem = ee.Image('USGS/SRTMGL1_003');
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
var nepal = countries.filter(ee.Filter.eq('country_na', 'Nepal'));

var nepalDEM = dem.clip(nepal);
Map.centerObject(nepal, 7);
Map.addLayer(nepalDEM, {min: 0, max: 8000, palette: ['blue', 'green', 'yellow', 'red', 'white']}, 'Nepal Elevation');

// Clip multiple bands
var rgbImage = landsat.select(['B4', 'B3', 'B2']).clip(roi);
Map.addLayer(rgbImage, {min: 0, max: 0.3}, 'Clipped RGB');

// Clip an image collection
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterDate('2020-01-01', '2020-12-31')
  .filterBounds(roi);

var clippedCollection = collection.map(function(image) {
  return image.clip(roi);
});

// Display the first image from the clipped collection
var firstImage = ee.Image(clippedCollection.first());
Map.addLayer(firstImage, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 'First Clipped Image');
```

### collection.median()
Computes the median of an image collection.

**Example:**
```javascript
// Load a Landsat 8 collection for a specific area and time
var roi = ee.Geometry.Point([-122.3578, 37.7726]).buffer(50000); // San Francisco area
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterDate('2020-01-01', '2020-12-31')
  .filterBounds(roi);

// Compute the median image
var medianImage = collection.median();
Map.centerObject(roi, 9);
Map.addLayer(medianImage, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 'Median RGB');

// Compare median with mean
var meanImage = collection.mean();
Map.addLayer(meanImage, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 'Mean RGB');

// Calculate median NDVI
var ndviCollection = collection.map(function(image) {
  return image.normalizedDifference(['B5', 'B4']).rename('NDVI');
});
var medianNDVI = ndviCollection.median();
Map.addLayer(medianNDVI, {min: -0.2, max: 0.8, palette: ['blue', 'white', 'green']}, 'Median NDVI');

// Create a cloud-free composite using median
var cloudFreeLandsat = collection
  .filter(ee.Filter.lt('CLOUD_COVER', 20))  // Filter low cloud images
  .median();
Map.addLayer(cloudFreeLandsat, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 'Cloud-free Composite');

// Calculate seasonal medians
var winter = collection.filter(ee.Filter.calendarRange(12, 2, 'month')).median();
var summer = collection.filter(ee.Filter.calendarRange(6, 8, 'month')).median();
Map.addLayer(winter, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 'Winter Median');
Map.addLayer(summer, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 'Summer Median');
```


  scale: 300  // 10x coarser than original 30m resolution
});

Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 'Original Resolution');
Map.addLayer(coarseImage, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 'Aggregated Resolution');
```
