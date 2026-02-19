# The Basics: Getting Started with Data

This page covers the essential commands for working with data in Earth Engine. You'll learn how to load datasets, explore them, and visualize your results.

---

## 1. How to Load a Dataset

To work with data, you first need to "call" it from the Earth Engine catalog using its unique ID.

=== "JavaScript"
    ```javascript
    // Load a single image (e.g., Earth's Elevation)
    var srtm = ee.Image("USGS/SRTMGL1_003");

    // Load a collection of images (e.g., Landsat 8)
    var landsat = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2");
    ```

=== "Python"
    ```python
    import ee

    # Load a single image
    srtm = ee.Image("USGS/SRTMGL1_003")

    # Load a collection of images
    landsat = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
    ```

---

## 2. Exploring Your Data (Metadata)

Before analysis, it's important to understand what's inside your dataset (bands, date, scale, etc.).

=== "JavaScript"
    ```javascript
    // Use the print command to see details in the 'Console' tab
    print('SRTM Metadata:', srtm);
    ```

=== "Python"
    ```python
    # In Python, you must use .getInfo() to retrieve the metadata from the server
    import pprint
    pprint.pprint(srtm.getInfo())
    ```

---

## 3. Displaying Data on the Map

The `Map.addLayer()` function is your primary tool for visualization.

=== "JavaScript"
    ```javascript
    // Basic display (shows with default settings)
    Map.addLayer(srtm, {}, 'Elevation');
    ```

=== "Python"
    ```python
    # Using geemap in Python
    import geemap
    Map = geemap.Map()
    Map.addLayer(srtm, {}, 'Elevation')
    Map
    ```

---

## 4. Visualization Parameters (Vis Params)

You can control how data looks using either **Code** or the **User Interface**.

### A. Via Code

Specify bands, min/max values, and color palettes.

=== "JavaScript"
    ```javascript
    var visParams = {
      min: 0,
      max: 3000,
      palette: ['blue', 'green', 'red']
    };
    Map.addLayer(srtm, visParams, 'Colored Elevation');
    ```

=== "Python"
    ```python
    vis_params = {
      'min': 0,
      'max': 3000,
      'palette': ['blue', 'green', 'red']
    }
    Map.addLayer(srtm, vis_params, 'Colored Elevation')
    ```

### B. Via Clicking (Layer Settings)

1. Run your script with `Map.addLayer()`.
2. Find the **Layers** button (top right of the map).
3. Click the **Settings icon** (gear) next to your layer.
4. Adjust the stretch, opacity, and palette.
5. Click **Apply**.

---

## 5. Case Study: Visualizing SRTM DEM

Digital Elevation Models (DEM) are a great way to start.

=== "JavaScript"
    ```javascript
    var srtm = ee.Image("USGS/SRTMGL1_003");

    // Select the elevation band
    var elevation = srtm.select('elevation');
    
    // Visualize with a terrain-like palette
    Map.addLayer(elevation, {min: 0, max: 2500, palette: ['0000FF', '00FF00', 'FFFF00', 'FF0000', 'FFFFFF']}, 'SRTM DEM');
    Map.setCenter(85.8, 20.4, 6);
    ```

---

## 6. Using Your Own Study Area (Assets)

Want to focus on a specific city or district? You can upload your own Shapefiles or GeoJSONs.

### How to Upload

1. Go to the **Assets** tab (top left).
2. Click **NEW** -> **Shape files** (upload all parts: .shp, .shx, .dbf, .prj).
3. Once uploaded, it will appear in your assets list.

### How to use it in Code

1. Hover over your asset and click the **arrow icon** (Import).
2. It will appear at the top of your script as `table`.
3. Use `.clip()` to cut your data to that boundary.

=== "JavaScript"
    ```javascript
    // Assuming you imported your asset as 'roi'
    var srtm = ee.Image("USGS/SRTMGL1_003").clip(roi);
    Map.centerObject(roi, 10);
    Map.addLayer(srtm, {min: 0, max: 2000}, 'My Study Area Elevation');
    ```

=== "Python"
    ```python
    # For Python, you call the asset by its path
    roi = ee.FeatureCollection("users/yourusername/myshapefile")
    srtm = ee.Image("USGS/SRTMGL1_003").clip(roi)

    Map = geemap.Map()
    Map.centerObject(roi, 10)
    Map.addLayer(srtm, {'min': 0, 'max': 2000}, 'My Elevation')
    Map
    ```
