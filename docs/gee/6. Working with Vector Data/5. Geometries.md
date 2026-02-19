### Geometries in Google Earth Engine

Google Earth Engine (GEE) provides a variety of geometries for spatial analysis. Below is an explanation of how to declare and work with geometries, along with detailed examples.

* * *

### **1\. Points**

A **Point** represents a single location in space, defined by latitude and longitude coordinates.

#### Syntax:

```javascript
var poi = ee.Geometry.Point(longitude, latitude);
```

#### Example:

```javascript
var poi = ee.Geometry.Point(0, 45); // Point at (longitude=0, latitude=45)
```

* * *

### **2\. Multi-Points**

A **MultiPoint** represents a collection of points.

#### Syntax:

```javascript
var multi = ee.Geometry.MultiPoint([longitude1, latitude1, longitude2, latitude2, ...]);
```

#### Example:

```javascript
var multi = ee.Geometry.MultiPoint([0, 45, 5, 6, 70, -56]); // Points: (0, 45), (5, 6), (70, -56)
```

* * *

### **3\. LineString**

A **LineString** connects two or more points with a straight line between each pair of consecutive points.

#### Syntax:

```javascript
var lineStr = ee.Geometry.LineString([[longitude1, latitude1], [longitude2, latitude2], ...]);
```

#### Example:

```javascript
var lineStr = ee.Geometry.LineString([[0, 45], [5, 6], [70, -56]]);
```

* * *

### **4\. Multi-LineString**

A **MultiLineString** contains multiple LineStrings.

#### Syntax:

```javascript
var mLineStr = ee.Geometry.MultiLineString([[[long1, lat1], [long2, lat2], ...], ...]);
```

#### Example:

```javascript
var mLineStr = ee.Geometry.MultiLineString(
    [[[0, 45], [5, 6], [70, -56]], [[0, -45], [-5, -6], [-70, 56]]]
);
```

* * *

### **5\. LinearRing**

A **LinearRing** is a closed LineString, forming a loop. The first and last points must be the same.

#### Syntax:

```javascript
var linRin = ee.Geometry.LinearRing([long1, lat1, long2, lat2, ...]);
```

#### Example:

```javascript
var linRin = ee.Geometry.LinearRing([0, 45, 5, 6, 70, -56, 0, 45]);
```

* * *

### **6\. Rectangle**

A **Rectangle** is defined by two diagonally opposite corners.

#### Syntax:

```javascript
var rect = ee.Geometry.Rectangle(long1, lat1, long2, lat2);
```

#### Example:

```javascript
var rect = ee.Geometry.Rectangle(0, 0, 60, 30);
```

* * *

### **7\. Polygon**

A **Polygon** is a closed shape formed by connecting multiple points, where the first and last points are the same.

#### Syntax:

```javascript
var poly = ee.Geometry.Polygon([[[long1, lat1], [long2, lat2], ...]]);
```

#### Example:

```javascript
var poly = ee.Geometry.Polygon([[[0, 0], [6, 3], [5, 5], [-30, 2], [0, 0]]]);
```

* * *

### **8\. Multi-Polygon**

A **MultiPolygon** consists of multiple polygons.

#### Syntax:

```javascript
var multiPoly = ee.Geometry.MultiPolygon([polygon1, polygon2, ...]);
```

#### Example:

```javascript
var multiPoly = ee.Geometry.MultiPolygon([
    ee.Geometry.Polygon([[0, 0], [6, 3], [5, 5], [-30, 2], [0, 0]]),
    ee.Geometry.Polygon([[0, 0], [-6, -3], [-5, -5], [30, -2], [0, 0]])
]);
```

* * *

### Features and FeatureCollections

*   **Features** associate geometries with properties (e.g., name, population).
*   **FeatureCollections** are groups of features.

#### Example:

```javascript
var feature = ee.Feature(ee.Geometry.Point(0, 0), {name: 'A Point'});
var featureCollection = ee.FeatureCollection([
    ee.Feature(ee.Geometry.Point(0, 0), {name: 'Point 1'}),
    ee.Feature(ee.Geometry.Point(1, 1), {name: 'Point 2'})
]);
```

* * *

### **Common Operations on Geometries**

1.  **Finding the Area**
    
    ```javascript
    var geoArea = geometry.area(maxError);
    ```
    
    Example:
    
    ```javascript
    var area = rect.area(); // Calculate area of a rectangle
    ```
    
2.  **Finding the Length of a Line**
    
    ```javascript
    var linLen = lineString.length(maxError);
    ```
    
    Example:
    
    ```javascript
    var length = lineStr.length();
    ```
    
3.  **Finding the Perimeter**
    
    ```javascript
    var geoPeri = geometry.perimeter(maxError);
    ```
    
    Example:
    
    ```javascript
    var perimeter = poly.perimeter();
    ```
    
4.  **Simplifying a Geometry**
    
    ```javascript
    var simpGeo = geometry.simplify(maxError);
    ```
    
    Example:
    
    ```javascript
    var simplified = poly.simplify(1);
    ```
    
5.  **Finding the Centroid**
    
    ```javascript
    var centrGeo = geometry.centroid(maxError);
    ```
    
    Example:
    
    ```javascript
    var centroid = poly.centroid();
    ```
    
6.  **Buffering**
    
    ```javascript
    var buffGeo = geometry.buffer(radius, maxError);
    ```
    
    Example:
    
    ```javascript
    var buffer = poi.buffer(1000); // Create a 1000-meter buffer around a point
    ```
    
7.  **Bounding Rectangle**
    
    ```javascript
    var bounGeo = geometry.bounds(maxError);
    ```
    
    Example:
    
    ```javascript
    var bounds = poly.bounds();
    ```
    
8.  **Convex Hull**
    
    ```javascript
    var convexGeo = geometry.convexHull(maxError);
    ```
    
    Example:
    
    ```javascript
    var convex = poly.convexHull();
    ```
    
9.  **Intersection**
    
    ```javascript
    var interGeo = geometry1.intersection(geometry2, maxError);
    ```
    
    Example:
    
    ```javascript
    var intersection = rect.intersection(poly);
    ```
    
10.  **Union**
    
    ```javascript
    var unGeo = geometry1.union(geometry2, maxError);
    ```
    
    Example:
    
    ```javascript
    var union = rect.union(poly);
    ```

---
Made by [Pulakesh Pradhan](https://wa.me/918617812861)
* * *

### **Loading and Displaying the FeatureCollection**

```javascript
var city = ee.FeatureCollection("projects/pulakesh/assets/bmc");
Map.addLayer(city);
```

*   **Explanation**:  
    The `ee.FeatureCollection` function loads a collection of features from a specified path. Here, the `city` FeatureCollection is loaded, representing geographic features.
*   **Visualization**:  
    `Map.addLayer(city)` adds the layer to the map for visualization in the GEE Code Editor.

* * *

### **Calculating and Printing the Area of the Geometry**

```javascript
print(city.geometry().area().divide(1e6));
```

*   **Explanation**:
    *   The `.geometry()` method extracts the geometry of the FeatureCollection.
    *   `.area()` calculates the area of the geometry in square meters.
    *   `.divide(1e6)` converts the area from square meters to square kilometers.
    *   `print` outputs the calculated area to the Console.

* * *

### **Finding the Bounding Box**

```javascript
var bounds = city.geometry().bounds();
Map.addLayer(bounds);
```

*   **Explanation**:
    *   The `.bounds()` method creates a rectangular bounding box that fully contains the geometry of the `city`.
    *   This bounding box is added to the map for visualization.

* * *

### **Creating a Buffer Around the Geometry**

```javascript
var buffer = city.geometry().buffer(10000);
Map.addLayer(buffer);
```

*   **Explanation**:
    *   The `.buffer(10000)` method creates a buffer of 10,000 meters (10 km) around the geometry of `city`.
    *   The buffer is visualized on the map.

* * *

### **Finding the Centroid of the Geometry**

```javascript
var centroid = city.geometry().centroid();
Map.addLayer(centroid);
```

*   **Explanation**:
    *   The `.centroid()` method calculates the geometric center of the `city`.
    *   This centroid is added to the map for visualization.

* * *

### **Calculating Centroids for Each Feature**

```javascript
var centroids = city.map(function(feature) {
  return feature.setGeometry(feature.geometry().centroid());
});
Map.addLayer(centroids);
```

*   **Explanation**:
    *   The `.map()` function iterates over each feature in the `city` FeatureCollection.
    *   For each feature, the `.centroid()` method calculates its centroid, and `.setGeometry()` updates the feature geometry to its centroid.
    *   The resulting centroids are visualized on the map.

* * *

### **Calculating Distance to a Point**

```javascript
var point = ee.Geometry.Point([85.895361, 20.462031]); // Example point
var distances = city.map(function(feature) {
  return feature.set('distance_to_point_m', feature.geometry().distance(point));
});
print(distances);
```

*   **Explanation**:
    *   A `Point` geometry is created using the `.Point()` method with the specified coordinates.
    *   The `.map()` function iterates over each feature in the `city` FeatureCollection.
    *   For each feature, `.distance(point)` calculates the distance in meters between the feature's geometry and the specified point.
    *   The distance is added as a new property (`distance_to_point_m`) to each feature.
    *   `print(distances)` outputs the updated FeatureCollection with distances to the Console.

* * *

### **Dissolving the Geometry**

```javascript
var dissolved = city.geometry().dissolve();
Map.addLayer(dissolved);
```

*   **Explanation**:
    *   The `.dissolve()` method merges all geometries in the `city` FeatureCollection into a single unified geometry.
    *   The dissolved geometry is visualized on the map.

* * *

### **Simplifying the Geometry**

```javascript
var simplified = city.geometry().simplify(100);
Map.addLayer(simplified);
```

*   **Explanation**:
    *   The `.simplify(100)` method reduces the number of vertices in the geometry, with a tolerance of 100 meters.
    *   This simplifies the geometry for faster processing and visualization.
    *   The simplified geometry is added to the map.

* * *

### **Union of Features**

```javascript
var union = city.union();
Map.addLayer(union);
```

*   **Explanation**:
    *   The `.union()` method combines overlapping or adjacent geometries into a single unified geometry.
    *   This is useful for merging multiple features into a single shape.
    *   The result is visualized on the map.

* * *

### **Intersection of Geometries**

#### Code:

```javascript
var intersection = city.first().geometry().intersection(city.geometry().buffer(100));
Map.addLayer(intersection);
```

*   **Explanation**:
    *   The `.intersection()` method finds the common area between two geometries: the geometry of the first feature in `city` and the 100-meter buffer of the `city` geometry.
    *   The resulting intersected area is visualized on the map.

* * *

### **Difference Between Geometries**

#### Code:

```javascript
var difference = city.geometry().difference(buffer);
print(difference);
```

*   **Explanation**:
    *   The `.difference(buffer)` method calculates the area of the `city` geometry that does not overlap with the buffer.
    *   The resulting geometry is printed to the Console.

* * *

### **Exporting the FeatureCollection**

#### Code:

```javascript
Export.table.toDrive({
  collection: city,
  description: 'Exported_Features',
  fileFormat: 'SHP'
});
```

*   **Explanation**:
    *   The `Export.table.toDrive` function exports the `city` FeatureCollection as a shapefile (`SHP`) to Google Drive.
    *   `description` specifies the name of the exported file.
    *   This allows the FeatureCollection to be used in external GIS tools like QGIS or ArcGIS.

* * *

### Summary of Key Operations:

1.  **Area, Bounds, Centroid**: Measure and summarize basic geometric properties.
2.  **Buffer, Simplify, Union, Dissolve**: Modify geometries for analysis and visualization.
3.  **Intersection, Difference**: Analyze spatial relationships between geometries.
4.  **Export**: Save the processed geometries for further use.

These operations form the backbone of geospatial analysis in Google Earth Engine.



---
Made by [Pulakesh Pradhan](https://wa.me/918617812861)
