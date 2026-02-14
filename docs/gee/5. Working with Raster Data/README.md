# Working with Satellite Images (Raster Data)

In Google Earth Engine, satellite images are called **Raster Data**. Think of them as digital photos of the Earth.

Each pixel in these photos contains information, not just about color (Red, Green, Blue), but also about things our eyes can't see, like temperature or plant health.

## Popular Datasets Explained

Here are the most common "cameras" (satellites) you'll use:

| Satellite | Best For... | Detail Level | How Often? |
| :--- | :--- | :--- | :--- |
| **Sentinel-2** | Agriculture, vegetation, detail | High (10m) | Every 5 days |
| **Landsat 8 & 9** | Long-term changes (since 2013) | Medium (30m) | Every 16 days |
| **MODIS** | Daily monitoring, climate, fire | Low (250m-1km) | Daily |
| **Sentinel-1** | Floods, landslides (Radar) | Medium (10m) | Every 6-12 days |

---

## How to Load a Dataset

To use these images, you need to "call" them from the catalog.

### 1. Loading Landsat 8

Great for looking at land changes over time.

=== "JavaScript"
    ```javascript
    // Load the Landsat 8 collection
    var landsat = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
      .filterDate('2023-01-01', '2023-12-31')
      .filterBounds(ee.Geometry.Point([-122.4, 37.8])); // San Francisco

    print('Number of images:', landsat.size());
    ```

=== "Python"
    ```python
    # Load the Landsat 8 collection
    landsat = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
        .filterDate('2023-01-01', '2023-12-31') \
        .filterBounds(ee.Geometry.Point([-122.4, 37.8])) # San Francisco

    print('Number of images:', landsat.size().getInfo())
    ```

### 2. Loading Sentinel-2

Best for sharp, detailed images of cities or fields.

=== "JavaScript"
    ```javascript
    // Load Sentinel-2
    var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
      .filterDate('2023-06-01', '2023-06-30')
      .filterBounds(ee.Geometry.Point([-0.12, 51.50])); // London

    // Sort by cloud cover to get the clearest image
    var clearImage = sentinel2.sort('CLOUDY_PIXEL_PERCENTAGE').first();
    
    // Display it
    Map.centerObject(clearImage, 11);
    Map.addLayer(clearImage, {min: 0, max: 3000, bands: ['B4', 'B3', 'B2']}, 'Sentinel-2 RGB');
    ```

=== "Python"
    ```python
    # Load Sentinel-2
    sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
        .filterDate('2023-06-01', '2023-06-30') \
        .filterBounds(ee.Geometry.Point([-0.12, 51.50])) # London

    # Sort by cloud cover to get the clearest image
    clear_image = sentinel2.sort('CLOUDY_PIXEL_PERCENTAGE').first()
    
    # Display it (using geemap)
    Map = geemap.Map()
    Map.centerObject(clear_image, 11)
    Map.addLayer(clear_image, {'min': 0, 'max': 3000, 'bands': ['B4', 'B3', 'B2']}, 'Sentinel-2 RGB')
    Map
    ```

### 3. Loading Climate Data (ERA5)

Want to know the temperature or rainfall? Use ERA5.

=== "JavaScript"
    ```javascript
    // Load ERA5 Monthly data
    var climate = ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY_AGGR')
      .filterDate('2023-01-01', '2023-12-31');

    // Select temperature (in Kelvin)
    var temp = climate.select('temperature_2m');
    
    // Convert to Celsius and get average
    var tempC = temp.mean().subtract(273.15);
    
    Map.addLayer(tempC, {min: -10, max: 35, palette: ['blue', 'white', 'red']}, 'Avg Temp (C)');
    ```

=== "Python"
    ```python
    # Load ERA5 Monthly data
    climate = ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY_AGGR') \
        .filterDate('2023-01-01', '2023-12-31')

    # Select temperature (in Kelvin)
    temp = climate.select('temperature_2m')
    
    # Convert to Celsius and get average
    temp_c = temp.mean().subtract(273.15)
    
    Map = geemap.Map()
    Map.addLayer(temp_c, {'min': -10, 'max': 35, 'palette': ['blue', 'white', 'red']}, 'Avg Temp (C)')
    Map
    ```

---

## What Next?

Now that you know how to load these "raster" images, learn how to analyze them!

- [Single Band Images](1 .Working with Single Band Images.md) - Working with just one layer (like temperature)
- [Multi Band Images](2. Working with Multi Band Images.md) - Combining layers (like Red+Green+Blue)
- [Calculating Indices](3. Computing NDVI.md) - Formulas like NDVI for plants
