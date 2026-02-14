# GEE Code Examples: JavaScript & Python

This page shows common Google Earth Engine operations in both JavaScript and Python. Use the tabs to switch between languages.

## Basic Operations

### Loading an Image

=== "JavaScript"
    ```javascript
    // Load a single Landsat 8 image
    var image = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_044034_20140318');
    print('Image:', image);
    ```

=== "Python"
    ```python
    # Load a single Landsat 8 image
    image = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_044034_20140318')
    print('Image:', image)
    ```

### Loading an Image Collection

=== "JavaScript"
    ```javascript
    // Load Sentinel-2 image collection
    var collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
      .filterDate('2023-01-01', '2023-12-31')
      .filterBounds(ee.Geometry.Point([-122.4, 37.8]));

    print('Number of images:', collection.size());
    ```

=== "Python"
    ```python
    # Load Sentinel-2 image collection
    collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
        .filterDate('2023-01-01', '2023-12-31') \
        .filterBounds(ee.Geometry.Point([-122.4, 37.8]))

    print('Number of images:', collection.size().getInfo())
    ```

### Creating Geometries

=== "JavaScript"
    ```javascript
    // Create a point
    var point = ee.Geometry.Point([-122.4194, 37.7749]);

    // Create a rectangle
    var rectangle = ee.Geometry.Rectangle([-122.5, 37.5, -122.0, 38.0]);
    
    // Create a polygon
    var polygon = ee.Geometry.Polygon([
      [[-122.5, 37.5], [-122.5, 38.0], [-122.0, 38.0], 
       [-122.0, 37.5], [-122.5, 37.5]]
    ]);
    ```

=== "Python"
    ```python
    # Create a point
    point = ee.Geometry.Point([-122.4194, 37.7749])

    # Create a rectangle
    rectangle = ee.Geometry.Rectangle([-122.5, 37.5, -122.0, 38.0])
    
    # Create a polygon
    polygon = ee.Geometry.Polygon([
        [[-122.5, 37.5], [-122.5, 38.0], [-122.0, 38.0], 
         [-122.0, 37.5], [-122.5, 37.5]]
    ])
    ```

## Filtering Data

### Filter by Date and Location

=== "JavaScript"
    ```javascript
    var roi = ee.Geometry.Point([-122.4, 37.8]);

    var filtered = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
      .filterDate('2023-06-01', '2023-08-31')
      .filterBounds(roi)
      .filter(ee.Filter.lt('CLOUD_COVER', 10));
    
    print('Filtered images:', filtered.size());
    ```

=== "Python"
    ```python
    roi = ee.Geometry.Point([-122.4, 37.8])

    filtered = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
        .filterDate('2023-06-01', '2023-08-31') \
        .filterBounds(roi) \
        .filter(ee.Filter.lt('CLOUD_COVER', 10))
    
    print('Filtered images:', filtered.size().getInfo())
    ```

## Image Operations

### Calculate NDVI

=== "JavaScript"
    ```javascript
    // Load an image
    var image = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_044034_20140318');

    // Calculate NDVI
    var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4'])
      .rename('NDVI');
    
    // Display on map
    Map.centerObject(image, 8);
    Map.addLayer(ndvi, {min: -1, max: 1, palette: ['blue', 'white', 'green']}, 'NDVI');
    ```

=== "Python"
    ```python
    # Load an image
    image = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_044034_20140318')

    # Calculate NDVI
    ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']) \
        .rename('NDVI')
    
    # Display on map (using geemap)
    import geemap
    Map = geemap.Map()
    Map.centerObject(image, 8)
    Map.addLayer(ndvi, {'min': -1, 'max': 1, 'palette': ['blue', 'white', 'green']}, 'NDVI')
    Map
    ```

### Band Math

=== "JavaScript"
    ```javascript
    // Select bands
    var nir = image.select('SR_B5');
    var red = image.select('SR_B4');

    // Calculate using expression
    var ndvi = image.expression(
      '(NIR - RED) / (NIR + RED)', {
        'NIR': nir,
        'RED': red
      }
    );
    ```

=== "Python"
    ```python
    # Select bands
    nir = image.select('SR_B5')
    red = image.select('SR_B4')

    # Calculate using expression
    ndvi = image.expression(
        '(NIR - RED) / (NIR + RED)', {
            'NIR': nir,
            'RED': red
        }
    )
    ```

## Working with Collections

### Map Function

=== "JavaScript"
    ```javascript
    // Function to calculate NDVI for each image
    function addNDVI(image) {
      var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4'])
        .rename('NDVI');
      return image.addBands(ndvi);
    }

    // Apply to collection
    var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
      .filterDate('2023-01-01', '2023-12-31')
      .map(addNDVI);
    ```

=== "Python"
    ```python
    # Function to calculate NDVI for each image
    def add_ndvi(image):
        ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']) \
            .rename('NDVI')
        return image.addBands(ndvi)

    # Apply to collection
    collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
        .filterDate('2023-01-01', '2023-12-31') \
        .map(add_ndvi)
    
    # Or using lambda
    collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
        .filterDate('2023-01-01', '2023-12-31') \
        .map(lambda img: img.addBands(
            img.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI')
        ))
    ```

### Reduce Collection

=== "JavaScript"
    ```javascript
    // Calculate median composite
    var median = collection.median();

    // Calculate mean
    var mean = collection.mean();
    
    // Calculate min and max
    var minMax = collection.reduce(ee.Reducer.minMax());
    ```

=== "Python"
    ```python
    # Calculate median composite
    median = collection.median()

    # Calculate mean
    mean = collection.mean()
    
    # Calculate min and max
    minMax = collection.reduce(ee.Reducer.minMax())
    ```

## Statistics

### Reduce Region

=== "JavaScript"
    ```javascript
    var region = ee.Geometry.Rectangle([-122.5, 37.5, -122.0, 38.0]);

    var stats = image.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: region,
      scale: 30,
      maxPixels: 1e9
    });
    
    print('Mean values:', stats);
    ```

=== "Python"
    ```python
    region = ee.Geometry.Rectangle([-122.5, 37.5, -122.0, 38.0])

    stats = image.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=region,
        scale=30,
        maxPixels=1e9
    )
    
    print('Mean values:', stats.getInfo())
    ```

## Exporting Data

### Export Image

=== "JavaScript"
    ```javascript
    Export.image.toDrive({
      image: ndvi,
      description: 'NDVI_Export',
      scale: 30,
      region: region,
      fileFormat: 'GeoTIFF'
    });
    ```

=== "Python"
    ```python
    task = ee.batch.Export.image.toDrive(
        image=ndvi,
        description='NDVI_Export',
        scale=30,
        region=region,
        fileFormat='GeoTIFF'
    )
    task.start()
    ```

### Export Table

=== "JavaScript"
    ```javascript
    var features = ee.FeatureCollection([
      ee.Feature(point, {name: 'Point 1', value: 100})
    ]);

    Export.table.toDrive({
      collection: features,
      description: 'Features_Export',
      fileFormat: 'CSV'
    });
    ```

=== "Python"
    ```python
    features = ee.FeatureCollection([
        ee.Feature(point, {'name': 'Point 1', 'value': 100})
    ])

    task = ee.batch.Export.table.toDrive(
        collection=features,
        description='Features_Export',
        fileFormat='CSV'
    )
    task.start()
    ```

## Key Syntax Differences

| Operation | JavaScript | Python |
| --- | --- | --- |
| **Print to console** | `print(value)` | `print(value.getInfo())` |
| **Variable** | `var x = 5` | `x = 5` |
| **Function** | `function name() {}` | `def name():` |
| **Anonymous function** | `function(x) {return x}` | `lambda x: x` |
| **Dictionary** | `{key: value}` | `{'key': value}` |
| **Boolean** | `true`, `false` | `True`, `False` |
| **Line continuation** | `;` (optional) | `\` (for multi-line) |
| **Comments** | `// comment` | `# comment` |

---

**Tip:** Most GEE functions work the same in both languages. The main differences are in syntax, not functionality!
