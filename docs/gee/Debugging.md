#  Google Earth Engine Debugging
---

### 🤔 **Note:**
These points help with understanding common debugging scenarios and tools for effective debugging in Earth Engine.

- **Syntax Errors**: Syntax errors occur when the code doesn’t follow JavaScript or Python syntax rules, often highlighted by Earth Engine before execution.
  ```javascript
  // Syntax Error Example: Missing closing parenthesis
  var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318'
  print(image);
  // Fix
  var imageCorrect = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318');
  print(imageCorrect);
  ```

- **Client-side Errors:** Even with syntactically correct code, errors can occur due to logic issues or variable scope limitations (e.g., undefined variables or invalid method calls).

  ```javascript
  // Example: Undefined variable error
  var area = length * width; // 'length' and 'width' are undefined
  // Fix
  var length = 10;
  var width = 5;
  var areaCorrect = length * width;
  
  ```

- **Unknown Object Type Casting:** Errors often arise when Earth Engine cannot recognize a variable's type. Solution: Cast objects explicitly.

  ```javascript
  // Example: Casting to a known type
  var feature = ee.Feature(null, {name: 'Test Feature'});
  var area = feature.get('area'); // Causes error if 'area' isn't present
  ```
- **Debugging Methods:** Use methods like `print()`, `aside()`, and `Map.addLayer()` to inspect intermediate values and identify issues. Isolate functions and test on individual elements from collections.

  ```javascript
  // Example: Using `aside()` for debugging
  var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318');
  var bandNames = image.bandNames().aside(print); // Prints band names for inspection
  ```

### ⚠️ Caution:
These points require extra care during development to prevent errors due to the unique server-client structure of Earth Engine.

- **Server-side Errors:** Earth Engine errors often arise when accessing non-existent bands in an image, or performing operations on unsupported data types.

  ```javascript
  // Example: Accessing a non-existent band
  var image = ee.Image('COPERNICUS/S2/20190830T104031_20190830T104033_T31TFJ');
  var ndvi = image.normalizedDifference(['B4', 'B8']); // Sentinel-2 NDVI
  print(ndvi); // Ensure both bands are present
  ```
- **Immutability of Server-side Objects:** Objects in Earth Engine are immutable. To make changes, you must assign them to new variables rather than modifying existing ones.

  ```javascript
  // Example: Reassigning after operation
  var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318');
  var scaledImage = image.multiply(2); // Assign to new variable
  ```
- **Scaling Errors:** Errors like "computation timed out" or "user memory limit exceeded" are due to large-scale computations. Check Profiler to diagnose and simplify operations if needed.

  ```javascript
  // Example: Reduce region or scale to avoid scaling errors
  var reducedRegion = image.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: image.geometry(),
    scale: 1000 // Adjust scale to manage computation
  });
  print(reducedRegion);
  ```
###  ❌ Avoid:
Avoid these common pitfalls that can lead to unexpected results or execution failures.

- **Mixing Client and Server Functions:** Avoid mixing Earth Engine (server-side) objects with JavaScript (client-side) operations.

  ```javascript
  // Incorrect: Mixing client-side with server-side
  var clientNumber = 2;
  var eeNumber = ee.Number(10);
  var result = eeNumber * clientNumber; // Causes error
  
  // Fix: Convert client-side variable to server-side
  var resultCorrect = eeNumber.multiply(ee.Number(clientNumber));
  ```
- **Browser Lock (Avoid `for Loops` and `getInfo()`):** Using getInfo() on large data can freeze the browser. Avoid for loops over Earth Engine collections as it forces client-side evaluation.

  ```javascript
  // Incorrect: Using getInfo() on a large collection
  var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA');
  var size = collection.size().getInfo(); // Potentially freezes browser
  
  // Fix: Avoid getInfo() for large collections
  collection.size().aside(print);
  ```
- **Mapped Functions with Client-side Operations:** Ensure mapped functions only include server-side operations, as client-side operations inside mapped functions will cause errors.

  ```javascript
  // Incorrect: Using client-side math in a mapped function
  var collection = ee.ImageCollection('COPERNICUS/S2');
  var doubledCollection = collection.map(function(img) {
    return img.multiply(2); // This is correct as it's server-side
  });
  ```
- **Procedural Errors:** Applying incompatible functions, such as operations on images without the required bands.

  ```javascript
  // Incorrect: Attempting to calculate NDVI on an image without bands
  var emptyImage = ee.Image([]); // No bands
  var ndvi = emptyImage.normalizedDifference(['B4', 'B5']); // Error
  
  // Fix: Check for bands first
  var bandCheck = emptyImage.bandNames();
  bandCheck.evaluate(function(bands) {
    if (bands.length > 0) {
      var ndviCorrect = emptyImage.normalizedDifference(['B4', 'B5']);
    } else {
      print("No bands available for NDVI calculation.");
    }
  });
  ```
---
# Projection in Earth Engine 
### ⚠️ Caution:
- **Automatic Projection Handling**: Earth Engine automatically assigns projections (e.g., Web Mercator) for visualizations. Explicitly set projections only if needed to avoid unexpected results.
- **Default Output Projection**: When combining images with different projections, the default output is WGS84 (EPSG:4326) with a 1° scale, which may not suit high-resolution analyses.[ https://epsg.io/](https://epsg.io/)
- **Reprojection and Data Requests**: When using `reproject()`, requesting data at scales finer than the current zoom level can result in excessive data usage.

### ❌ Avoid:
- **Leaving Projections Unspecified**: Ensure projections are defined, especially with `ImageCollection`, to prevent inconsistencies.
- **Frequent Reprojection Calls**: Overuse of `reproject()` can decrease performance due to redundant reprojections.
- **Mixing Projections**: When using images with different projections in a single computation, ensure they’re properly handled to avoid errors.


### 🤔 **Note:**
- **Checking Projection Information**: Use image.projection() to retrieve an image's projection.
  ```javascript
  var image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318').select(0);
  print('Projection:', image.projection());
  print('Scale in meters:', image.projection().nominalScale());
  ```
- **Composites and Projections:** Default to WGS84 when combining differently projected images.
  ```javascript
  var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA');
  var mosaic = collection.filterDate('2018-01-01', '2019-01-01').mosaic();
  print(mosaic.projection());
  ```

- **Specifying Projection:** Use reproject() for fixed projections.
  ```javascript
  var proj = ee.Projection('EPSG:4326');
  var output = collection.reduce(...).reproject(proj);
  ```
For specific analysis needs, such as gradients, a fixed projection may be required.
---
### Code Example for Reprojecting and Calculating Slope in Earth Engine
- Use of `ee.Image.reproject` is rarely needed and should generally be `avoided`.
- Define projection and scale with "scale", "crs", and "crsTransform" when available.
- Use `reproject()` only if alternative methods aren’t suitable. Below, it’s used to calculate terrain slope from a DEM composite at a desired scale.

```javascript
// Load DEM datasets and calculate mean elevation (defaults to WGS84, 1 degree pixels).
var dem1 = ee.Image('NASA/NASADEM_HGT/001').select('elevation');
var dem2 = ee.Image('CGIAR/SRTM90_V4').select('elevation');
var demMean = ee.ImageCollection([dem1, dem2]).mean();

// Display the DEMs on the map
var demVisParams = {min: 500, max: 2500};
Map.setCenter(-123.457, 47.815, 11);
Map.addLayer(dem1, demVisParams, 'DEM 1');
Map.addLayer(dem2, demVisParams, 'DEM 2');
Map.addLayer(demMean, demVisParams, 'DEM composite');

// Calculate terrain slope from the composite DEM (WGS84, 1 degree pixel scale).
var demCompSlope = ee.Terrain.slope(demMean);

// Display slope (1 degree scale; zoom out to see pixels).
Map.addLayer(demCompSlope, {min: 0, max: 0.3}, 'Slope');
```
### [ https://epsg.io/](https://epsg.io/)
```javascript
// Force slope calculation at 30m scale on WGS84 CRS with reproject().
var slopeScale = ee.Terrain.slope(
  demMean.reproject({
    crs: 'EPSG:4326',
    scale: 30
  })
);
Map.addLayer(slopeScale, {min: 0, max: 45}, 'Slope w/ CRS and scale');

// Control reprojection more precisely using "crsTransform" or match a reference image projection.
var nasademProj = dem1.projection();
var demMeanReproj = demMean.reproject(nasademProj);
var slopeRefProj = ee.Terrain.slope(demMeanReproj);
Map.addLayer(slopeRefProj, {min: 0, max: 45}, 'Slope w/ reference proj');
print('Reference projection', nasademProj);
print('DEM composite projection', demMeanReproj.projection());

// Alternative to reproject(): set default projection with setDefaultProjection().
var demMeanProj = ee.ImageCollection([dem1, dem2]).mean()
                      .setDefaultProjection(nasademProj);
var slopeProj = ee.Terrain.slope(demMeanProj);
Map.addLayer(slopeProj, {min: 0, max: 45}, 'slope w/ default projection set');
```

---
🤔 Note:
⚠️ Caution: 
❌ Avoid: 
