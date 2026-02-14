### Export Raster and Vector Data: 

1.  **Raster Export**: Export an image (like satellite data) with specific details like resolution (scale), area, and file format.
2.  **Vector Export**: Export shapes (like country boundaries) with specific details.

* * *

### Code with Step-by-Step Explanation

```javascript
// Step 1: Load a raster image (elevation data in this case)
var raster = ee.Image('CGIAR/SRTM90_V4'); 
// This is an elevation dataset from GEE. It shows the height of the land.

print("Loaded raster image", raster); // Print raster details in Console

// Step 2: Load a vector dataset (country boundaries)
var vector = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017'); 
// This is a vector dataset showing country boundaries.

print("Loaded vector data", vector); // Print vector details in Console

// Step 3: Define an area of interest (AOI)
// This is a rectangular area we want to work on.
var aoi = ee.Geometry.Polygon([
  [[-120.0, 40.0], [-120.0, 35.0], [-115.0, 35.0], [-115.0, 40.0], [-120.0, 40.0]]
]);

Map.centerObject(aoi); // Center the map view on this area
Map.addLayer(aoi, {color: 'red'}, 'Area of Interest'); // Show the AOI on the map

// Step 4: Clip the raster image to the AOI
var clippedRaster = raster.clip(aoi);
// This cuts the raster to match the area we are interested in.

Map.addLayer(clippedRaster, {min: 0, max: 3000, palette: ['blue', 'green', 'red']}, 'Clipped Raster');
// Display the clipped raster on the map with colors for different heights.
```



* * *
Made by [Pulakesh Pradhan](https://wa.me/918617812861)
* * *

* * *

### Export Code:





```javascript
// Step 5: Export the raster image
Export.image.toDrive({
  image: clippedRaster, // The image we want to export
  description: 'Exported_Raster', // Name for this export task
  folder: 'GEE_Exports', // Folder in Google Drive to save the file
  fileNamePrefix: 'raster_example', // File name for the exported raster
  region: aoi, // The area we want to export
  scale: 30, // Resolution in meters per pixel (30m here)
  crs: 'EPSG:4326', // CRS (Geographic projection in lat/lon)
  maxPixels: 1e13 // Maximum number of pixels allowed for export
});

// Step 6: Filter the vector data to the AOI
var filteredVector = vector.filterBounds(aoi);
// This keeps only the parts of the vector that intersect with our AOI.

Map.addLayer(filteredVector, {}, 'Filtered Vector');
// Show the filtered vector data on the map

// Step 7: Export the vector data
Export.table.toDrive({
  collection: filteredVector, // The vector data we want to export
  description: 'Exported_Vector', // Name for this export task
  folder: 'GEE_Exports', // Folder in Google Drive to save the file
  fileNamePrefix: 'vector_example', // File name for the exported vector
  fileFormat: 'GeoJSON' // File format (GeoJSON is commonly used)
});
```

* * *
Made by [Pulakesh Pradhan](https://wa.me/918617812861)
* * *
