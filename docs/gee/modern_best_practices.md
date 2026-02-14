# Modern GEE Best Practices & Recent Changes

Google Earth Engine is constantly evolving. Staying up-to-date with the latest best practices ensures your scripts are efficient, scalable, and use the most accurate data available.

## 1. Use Collection 2 (C02) for Landsat

Landsat Collection 1 is being retired. Always use Collection 2, which provides improved data quality, better geolocation, and consistent metadata.

=== "JavaScript"
    ```javascript
    // Modern approach - Collection 2 Level 2 (Surface Reflectance)
    var landsat = ee.Image('LANDSAT/LC08/C02/T1_L2');
    ```

=== "Python"
    ```python
    # Modern approach - Collection 2 Level 2 (Surface Reflectance)
    landsat = ee.Image('LANDSAT/LC08/C02/T1_L2')
    ```

=== "Legacy (Avoid)"
    ```javascript
    // Old approach - Don't use this anymore
    var legacy = ee.Image('LANDSAT/LC08/C01/T1_SR');
    ```

## 2. Server-Side vs. Client-Side

One of the most common mistakes is mixing server-side Earth Engine objects with client-side functions (like `for` loops or `if` statements).

### The Correct Way (Server-Side)

Use `.map()` instead of `for` loops and `ee.Algorithms.If()` or boolean expressions instead of `if`.

=== "JavaScript"
    ```javascript
    // Scale an ImageCollection (The modern way)
    var collection = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
      .map(function(image) {
        return image.divide(10000); // Server-side operation
      });
    ```

=== "Python"
    ```python
    # Scale an ImageCollection (The modern way)
    def scale_image(image):
        return image.divide(10000)  # Server-side operation

    collection = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
        .map(scale_image)
    
    # Or using lambda (shorter syntax)
    collection = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
        .map(lambda image: image.divide(10000))
    ```

## 3. Sentinel-2 Harmonization

Recent Sentinel-2 data (after early 2022) has a processing change. Use `COPERNICUS/S2_SR_HARMONIZED` to ensure consistent values across different processing baseline versions.

=== "JavaScript"
    ```javascript
    var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
    ```

=== "Python"
    ```python
    s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
    ```

## 4. Efficient Reducers

When calculating statistics over large areas, specify a `scale` and `tileScale` to avoid memory errors.

=== "JavaScript"
    ```javascript
    var stats = image.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: region,
      scale: 30,
      tileScale: 4 // Use higher values (up to 16) for complex computations
    });
    ```

=== "Python"
    ```python
    stats = image.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=region,
        scale=30,
        tileScale=4  # Use higher values (up to 16) for complex computations
    )
    ```

## 5. UI and Apps

Modern GEE apps should use the `ui.*` package instead of simple print statements for a more professional user interface.

!!! note "JavaScript Only"
    The UI package is only available in the JavaScript Code Editor. For Python, use libraries like `geemap` or `ipywidgets` for interactive interfaces.

=== "JavaScript"
    ```javascript
    var panel = ui.Panel({
      style: {width: '400px', backgroundColor: 'rgba(255,255,255,0.8)'}
    });
    ui.root.add(panel);
    ```

=== "Python (Alternative)"
    ```python
    # In Python, use geemap for interactive maps
    import geemap

    Map = geemap.Map()
    Map.addLayer(image, vis_params, 'Layer Name')
    Map
    ```

---

## Key Differences: JavaScript vs Python

| Feature | JavaScript | Python |
| ------- | ---------- | ------ |
| **Variable Declaration** | `var x = ...` | `x = ...` |
| **Functions** | `function(x) { return x; }` | `def func(x): return x` or `lambda x: x` |
| **Dictionary/Object** | `{key: 'value'}` | `{'key': 'value'}` |
| **Comments** | `// comment` | `# comment` |
| **True/False** | `true`, `false` | `True`, `False` |
| **UI Elements** | `ui.Panel()`, `ui.Label()` | Use `geemap` or `ipywidgets` |

---

*Stay updated by checking the [Earth Engine Developers Blog](https://medium.com/google-earth) regularly.*
