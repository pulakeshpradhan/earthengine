### **Feature vs FeatureCollection**

*   **Feature**: A single geographic object with associated attributes (properties). It consists of a geometry (e.g., a point, line, polygon) and metadata.
*   **FeatureCollection**: A collection of multiple features. It's used to store and process datasets containing multiple geographic objects.

* * *

### **Importing FeatureCollection**

```javascript
var table = ee.FeatureCollection("projects/pulakesh/assets/cmc");
var city = ee.FeatureCollection("projects/pulakesh/assets/bmc");
Map.addLayer(table);
```

*   `ee.FeatureCollection`: Represents the spatial data imported.
*   `Map.addLayer`: Adds the data to the map for visualization.

* * *

### **1\. Calculate Area**

```javascript
print(table.geometry().area().divide(1e6));
```

*   **Purpose**: Computes the area of the entire `FeatureCollection` in square kilometers.
*   **Method**:
    *   `table.geometry()`: Merges all features into a single geometry.
    *   `area()`: Calculates the area in square meters.
    *   `.divide(1e6)`: Converts the area to square kilometers.

```javascript
var area = table.map(function(feature) {
  return feature.set('area_km2', feature.geometry().area().divide(1e6));
});
```

*   **Purpose**: Adds a property `area_km2` to each feature, representing its area in square kilometers.
*   **Method**: Use `map()` to iterate over each feature and attach the area as a property.

* * *

### **2\. Get Bounds**

```javascript
var bounds = table.map(function(feature) {
  return feature.setGeometry(feature.geometry().bounds());
});
```

*   **Purpose**: Computes the bounding box (minimum enclosing rectangle) for each feature.
*   **Method**:
    *   `.bounds()`: Calculates the bounds.
    *   `setGeometry`: Updates the feature's geometry to the bounding box.

```javascript
var bounds = table.geometry().bounds();
```

*   **Purpose**: Gets the bounding box for the entire `FeatureCollection`.

* * *

### **3\. Buffer**

```javascript
var buffered = table.map(function(feature) {
  return feature.buffer(10000); // Buffer distance in meters
});
```

*   **Purpose**: Creates a buffer (a zone around a feature) of 10 km around each feature.
*   **Method**:
    *   `.buffer(10000)`: Adds a buffer of 10,000 meters (10 km) to the geometry.

* * *

### **4\. Centroid**

```javascript
var centroids = table.map(function(feature) {
  return feature.setGeometry(feature.geometry().centroid());
});
```

*   **Purpose**: Computes the centroid (geometric center) for each feature.
*   **Method**:
    *   `.centroid()`: Calculates the centroid of the geometry.

* * *

### **5\. Distance**

```javascript
var point = ee.Geometry.Point([37.5, 0.5]); // Example point
var distances = table.map(function(feature) {
  return feature.set('distance_to_point_m', feature.geometry().distance(point));
});
```

*   **Purpose**: Calculates the distance of each feature to a specific point.
*   **Method**:
    *   `.distance(point)`: Computes the distance between the feature's geometry and the given point.

* * *

### **6\. Dissolve**

```javascript
var dissolved = table.geometry();
```

*   **Purpose**: Dissolves all features into a single geometry.

* * *
Made by [Pulakesh Pradhan](https://wa.me/918617812861)

### **7\. Evaluate**

```javascript
table.first().geometry().area().evaluate(function(area) {
  print('Area of the first feature in m²:', area);
});
```

*   **Purpose**: Evaluates the area of the first feature client-side.
*   **Method**:
    *   `.evaluate()`: Converts the server-side object to a client-side value.

* * *

### **8\. Geometry**

```javascript
var firstGeometry = table.first().geometry();
print('First feature geometry:', firstGeometry);
```

*   **Purpose**: Retrieves the geometry of the first feature.

* * *

### **9\. Property Names**

```javascript
var propertyNames = table.first().propertyNames();
print('Property names:', propertyNames);
```

*   **Purpose**: Retrieves the list of property names for the first feature.

* * *

### **10\. Select**

```javascript
var selected = table.select(['ADM1_NAME', 'ADM0_NAME']);
```

*   **Purpose**: Selects specific properties from the features.

* * *

### **11\. Simplify**

```javascript
var simplified = table.map(function(feature) {
  return feature.setGeometry(feature.geometry().simplify(1000)); // Tolerance in meters
});
```

*   **Purpose**: Simplifies the geometry of each feature to reduce complexity.

* * *
Made by [Pulakesh Pradhan](https://wa.me/918617812861)

### **12\. Union**

```javascript
var fc = ee.FeatureCollection('WRI/GPPD/power_plants')
            .filter('country_lg == "Belgium"');
var union = fc.union(1);
```

*   **Purpose**: Merges all geometries in the `FeatureCollection` into one.

* * *

### **13\. Within Distance**

```javascript
var withinDistance = table.filter(ee.Filter.withinDistance({
  distance: 50000, // Distance in meters
  leftField: '.geo', // Geometry field
  rightField: '.geo',
  maxError: 10
}));
```

*   **Purpose**: Finds features within 50 km of a point or another geometry.

* * *

### **14\. Additional Operations**

*   **Intersection**: Calculates the overlapping geometry between features.
    
    ```javascript
    var intersection = table.geometry().intersection(table.geometry());
    ```
    
*   **Difference**: Computes the non-overlapping part of the geometry.
    
    ```javascript
    var difference = table.geometry().difference(buffered.geometry());
    ```
    

* * *

### **15\. Export**

```javascript
Export.table.toDrive({
  collection: area,
  description: 'Exported_Features',
  fileFormat: 'CSV'
});
```

*   **Purpose**: Exports the `FeatureCollection` with computed areas to Google Drive as a CSV file.

---
Made by [Pulakesh Pradhan](https://wa.me/918617812861)
* * *
