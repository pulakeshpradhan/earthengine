# Charts in Google Earth Engine  

## 1. Image-Based Charts
### Time Series Analysis
- `ui.Chart.image.series`: Single region over time
- `ui.Chart.image.seriesByRegion`: Multiple regions over time
- `ui.Chart.image.doySeries`: Day-of-year patterns for single region
- `ui.Chart.image.doySeriesByYear`: Compare years for single region
- `ui.Chart.image.doySeriesByRegion`: Day-of-year patterns across regions

### Spatial Analysis
- `ui.Chart.image.byRegion`: Single-band summary across regions
- `ui.Chart.image.regions`: Time series across multiple regions
- `ui.Chart.image.byClass`: Band distribution by region class
- `ui.Chart.image.histogram`: Pixel value distribution

## 2. Feature-Based Charts
These functions work with FeatureCollections.

### Property Analysis
- `ui.Chart.feature.byFeature`: Individual feature properties
- `ui.Chart.feature.byProperty`: Multiple properties comparison
- `ui.Chart.feature.groups`: Grouped data comparisons
- `ui.Chart.feature.histogram`: Property value distribution
--- 
## Common Parameters
### General Parameters
- `scale`: Spatial resolution in meters
- `reducer`: Function for aggregating pixel values (e.g., mean, max, min)
- `region/regions`: Area(s) of interest for analysis
- `xProperty`: Property for x-axis values
- `seriesProperty`: Property for distinguishing multiple series

### Customization Options

```javascript
.setOptions({
  title: 'Chart Title',
  hAxis: {
    title: 'X-Axis Label',
    titleTextStyle: {italic: false, bold: true}
  },
  vAxis: {
    title: 'Y-Axis Label',
    titleTextStyle: {italic: false, bold: true}
  },
  lineWidth: 2,
  colors: ['hexcolor1', 'hexcolor2'],
  curveType: 'function'  // for smooth lines
})
```
![image](https://github.com/user-attachments/assets/c2ca4392-3220-4c71-bf84-90768bae555b)

---


### **1\. `ui.Chart.image.series`**

#### Description:

This chart shows how vegetation indices (NDVI and EVI) change over time for a specific region, such as a forest. Each image band (NDVI and EVI) is plotted as a unique series. The x-axis represents the time, and the y-axis shows the average vegetation index value.

#### Code:

```javascript
// Import the example feature collection and subset the forest feature.
var forest = ee.FeatureCollection('projects/google/charts_feature_example')
                 .filter(ee.Filter.eq('label', 'Forest'));

// Load MODIS vegetation indices data and subset a decade of images.
var vegIndices = ee.ImageCollection('MODIS/061/MOD13A1')
                     .filter(ee.Filter.date('2010-01-01', '2020-01-01'))
                     .select(['NDVI', 'EVI']);

// Define the chart and print it to the console.
var chart = ui.Chart.image.series({
  imageCollection: vegIndices,
  region: forest,
  reducer: ee.Reducer.mean(),
  scale: 500,
  xProperty: 'system:time_start'
})
.setSeriesNames(['EVI', 'NDVI'])
.setOptions({
  title: 'Average Vegetation Index Value by Date for Forest',
  hAxis: {title: 'Date', titleTextStyle: {italic: false, bold: true}},
  vAxis: {title: 'Vegetation index (x1e4)', titleTextStyle: {italic: false, bold: true}},
  lineWidth: 5,
  colors: ['e37d05', '1d6b99'],
  curveType: 'function'
});
print(chart);
```
![image](https://github.com/user-attachments/assets/d4a753e5-ee11-4d3b-aeb6-09d65fc67039)

* * *

### **2\. `ui.Chart.image.seriesByRegion`**

#### Description:

This chart compares NDVI values over time for multiple regions, such as forest, desert, and grasslands. Each region is represented as a unique series.

#### Code:

```javascript
// Import the example feature collection.
var ecoregions = ee.FeatureCollection('projects/google/charts_feature_example');

// Load MODIS vegetation indices data and subset a decade of images.
var vegIndices = ee.ImageCollection('MODIS/061/MOD13A1')
                     .filter(ee.Filter.date('2010-01-01', '2020-01-01'))
                     .select(['NDVI', 'EVI']);

// Define the chart and print it to the console.
var chart = ui.Chart.image.seriesByRegion({
  imageCollection: vegIndices,
  band: 'NDVI',
  regions: ecoregions,
  reducer: ee.Reducer.mean(),
  scale: 500,
  seriesProperty: 'label',
  xProperty: 'system:time_start'
})
.setOptions({
  title: 'Average NDVI Value by Date',
  hAxis: {title: 'Date', titleTextStyle: {italic: false, bold: true}},
  vAxis: {title: 'NDVI (x1e4)', titleTextStyle: {italic: false, bold: true}},
  lineWidth: 5,
  colors: ['f0af07', '0f8755', '76b349'],
});
print(chart);
```
![image](https://github.com/user-attachments/assets/249dc677-452a-461c-acbc-1907ecb94a7b)

* * *

### **3\. `ui.Chart.image.doySeries`**

#### Description:

This chart plots average NDVI and EVI values for each **day of the year** across multiple years for a single region. For example, it can help identify seasonal vegetation trends in a grassland.

#### Code:

```javascript
// Import the example feature collection and subset the grassland feature.
var grassland = ee.FeatureCollection('projects/google/charts_feature_example')
                    .filter(ee.Filter.eq('label', 'Grassland'));

// Load MODIS vegetation indices data and subset a decade of images.
var vegIndices = ee.ImageCollection('MODIS/061/MOD13A1')
                     .filter(ee.Filter.date('2010-01-01', '2020-01-01'))
                     .select(['NDVI', 'EVI']);

// Define the chart and print it to the console.
var chart = ui.Chart.image.doySeries({
  imageCollection: vegIndices,
  region: grassland,
  regionReducer: ee.Reducer.mean(),
  scale: 500,
  yearReducer: ee.Reducer.mean(),
  startDay: 1,
  endDay: 365
})
.setSeriesNames(['EVI', 'NDVI'])
.setOptions({
  title: 'Average Vegetation Index Value by Day of Year for Grassland',
  hAxis: {title: 'Day of year', titleTextStyle: {italic: false, bold: true}},
  vAxis: {title: 'Vegetation index (x1e4)', titleTextStyle: {italic: false, bold: true}},
  lineWidth: 5,
  colors: ['e37d05', '1d6b99'],
});
print(chart);
```
![image](https://github.com/user-attachments/assets/fc1a1b24-4b41-482f-8ff5-792279008556)

* * *

### **4\. `ui.Chart.image.doySeriesByYear`**

#### Description:

This chart compares NDVI trends for a specific region over different years, plotting the average value for each day of the year. Each year’s data is shown as a separate series.

#### Code:

```javascript
// Import the example feature collection and subset the grassland feature.
var grassland = ee.FeatureCollection('projects/google/charts_feature_example')
                    .filter(ee.Filter.eq('label', 'Grassland'));

// Load MODIS vegetation indices data and subset years 2012 and 2019.
var vegIndices = ee.ImageCollection('MODIS/061/MOD13A1')
                     .filter(ee.Filter.or(
                         ee.Filter.date('2012-01-01', '2013-01-01'),
                         ee.Filter.date('2019-01-01', '2020-01-01')))
                     .select(['NDVI', 'EVI']);

// Define the chart and print it to the console.
var chart = ui.Chart.image.doySeriesByYear({
  imageCollection: vegIndices,
  bandName: 'NDVI',
  region: grassland,
  regionReducer: ee.Reducer.mean(),
  scale: 500,
  sameDayReducer: ee.Reducer.mean(),
  startDay: 1,
  endDay: 365
})
.setOptions({
  title: 'Average NDVI Value by Day of Year for Grassland',
  hAxis: {title: 'Day of year', titleTextStyle: {italic: false, bold: true}},
  vAxis: {title: 'NDVI (x1e4)', titleTextStyle: {italic: false, bold: true}},
  lineWidth: 5,
  colors: ['39a8a7', '9c4f97'],
});
print(chart);
```
![image](https://github.com/user-attachments/assets/082fa72c-d015-4824-b354-0d3aeeb9c6ec)


* * *

### **5\. `ui.Chart.image.doySeriesByRegion`**

#### Description:

This chart compares average NDVI values for different regions (e.g., forest, desert, and grasslands) over a single year. It shows how vegetation varies seasonally across regions.

#### Code:

```javascript
// Import the example feature collection.
var ecoregions = ee.FeatureCollection('projects/google/charts_feature_example');

// Load MODIS vegetation indices data and subset a decade of images.
var vegIndices = ee.ImageCollection('MODIS/061/MOD13A1')
                     .filter(ee.Filter.date('2010-01-01', '2020-01-01'))
                     .select(['NDVI', 'EVI']);

// Define the chart and print it to the console.
var chart = ui.Chart.image.doySeriesByRegion({
  imageCollection: vegIndices,
  bandName: 'NDVI',
  regions: ecoregions,
  regionReducer: ee.Reducer.mean(),
  scale: 500,
  yearReducer: ee.Reducer.mean(),
  seriesProperty: 'label',
  startDay: 1,
  endDay: 365
})
.setOptions({
  title: 'Average NDVI Value by Day of Year',
  hAxis: {title: 'Day of year', titleTextStyle: {italic: false, bold: true}},
  vAxis: {title: 'NDVI (x1e4)', titleTextStyle: {italic: false, bold: true}},
  lineWidth: 5,
  colors: ['f0af07', '0f8755', '76b349'],
});
print(chart);
```
![ee-chart (2)](https://github.com/user-attachments/assets/3151de0f-e2cd-4a2b-aaad-421397cbaa1c)

* * *
--- 


* * *

### 1\. **`ui.Chart.image.byRegion`**

#### **Purpose**:

This function creates a chart summarizing the values of a single band of an image or image collection across multiple regions.

* * *

#### **Example**:

We will calculate and display the mean NDVI for different ecoregions.

```javascript
// Import the example feature collection.
var ecoregions = ee.FeatureCollection('projects/google/charts_feature_example');

// Load a MODIS image containing NDVI and EVI bands for a specific date.
var modisImage = ee.Image('MODIS/061/MOD13A1/2010_01_01').select('NDVI');

// Create the chart and print it.
var chart = ui.Chart.image.byRegion({
  image: modisImage,
  regions: ecoregions,
  reducer: ee.Reducer.mean(),
  scale: 500,
  xProperty: 'label'
})
.setOptions({
  title: 'Mean NDVI for Ecoregions',
  hAxis: {title: 'Ecoregion'},
  vAxis: {title: 'NDVI (x1e4)'},
  colors: ['76b349']
});
print(chart);
```
![image](https://github.com/user-attachments/assets/b5a7cf75-063e-4661-bc0d-42309dece098)

* * *

### 2\. **`ui.Chart.image.regions`**

#### **Purpose**:

This function plots a time series for a given region using the values of one or more bands over multiple images in an image collection.

* * *

#### **Example**:

We will generate a time series for NDVI values in a single region (grassland).

```javascript
// Import the example feature collection and filter the grassland feature.
var grassland = ee.FeatureCollection('projects/google/charts_feature_example')
                    .filter(ee.Filter.eq('label', 'Grassland'));

// Load MODIS vegetation indices data for a decade.
var vegIndices = ee.ImageCollection('MODIS/061/MOD13A1')
                     .filterDate('2010-01-01', '2020-01-01')
                     .select('NDVI');

// Reduce the ImageCollection over the time period to create a time series.
var meanNDVI = vegIndices.mean();  // Calculate the mean NDVI for the whole time period.

// Create the chart with regions for the time series
var chart = ui.Chart.image.regions({
  image: meanNDVI,          // Use the reduced image (mean NDVI)
  regions: grassland,       // The FeatureCollection (regions of interest)
  reducer: ee.Reducer.mean(),  // Aggregation function (mean of NDVI)
  scale: 500,               // Spatial resolution (500 meters)
  seriesProperty: 'label'   // Use the 'label' property to differentiate regions
})
.setOptions({
  title: 'NDVI Time Series for Grassland',
  hAxis: {title: 'Date'},
  vAxis: {title: 'NDVI (x1e4)'},
  lineWidth: 2,
  colors: ['#1d6b99']  // Set a valid color code (hex format)
});

// Print the chart
print(chart);

```

* * *

### 3\. **`ui.Chart.image.byClass`**

#### **Purpose**:

This function compares the value distribution of an image's band(s) across different classes defined in a region.

* * *

#### **Example**:

We will compare the mean NDVI for forest, desert, and grassland classes.

```javascript
// Import the example feature collection.
var ecoregions = ee.FeatureCollection('projects/google/charts_feature_example');

// Load a MODIS image containing NDVI and EVI bands for a specific date.
var modisImage = ee.Image('MODIS/061/MOD13A1/2010_01_01').select('NDVI');

// Create the chart and print it.
var chart = ui.Chart.image.byClass({
  image: modisImage,
  regions: ecoregions,
  classProperty: 'label',
  reducer: ee.Reducer.mean(),
  scale: 500
})
.setOptions({
  title: 'NDVI Distribution by Class',
  hAxis: {title: 'Class'},
  vAxis: {title: 'NDVI (x1e4)'},
  colors: ['f0af07', '76b349', '1d6b99']
});
print(chart);
```

* * *

### 4\. **`ui.Chart.image.histogram`**

#### **Purpose**:

This function generates a histogram for one or more bands of an image or image collection, based on pixel values.

* * *

#### **Example**:

We will create a histogram showing the distribution of NDVI values for a grassland region.

```javascript
// Import the example feature collection and filter the grassland feature.
var grassland = ee.FeatureCollection('projects/google/charts_feature_example')
                    .filter(ee.Filter.eq('label', 'Grassland'));

// Load a MODIS image containing NDVI and EVI bands for a specific date.
var modisImage = ee.Image('MODIS/061/MOD13A1/2010_01_01').select('NDVI');

// Create the chart and print it.
var chart = ui.Chart.image.histogram({
  image: modisImage,
  region: grassland,
  scale: 500,
  maxBuckets: 20
})
.setOptions({
  title: 'NDVI Histogram for Grassland',
  hAxis: {title: 'NDVI Value'},
  vAxis: {title: 'Frequency'},
  colors: ['39a8a7']
});
print(chart);
```

* * *
--- 

### 1\. **`ui.Chart.feature.byFeature`**

#### **Purpose**:

This function creates a chart displaying feature properties, with each feature in a `FeatureCollection` represented as a unique data point on the chart.

* * *

#### **Example**:

We will plot average NDVI values for individual features in an `FeatureCollection` (ecoregions).

```javascript
// Import the example feature collection.
var ecoregions = ee.FeatureCollection('projects/google/charts_feature_example');

// Calculate the mean NDVI for each region and add it as a property.
var vegIndices = ee.ImageCollection('MODIS/061/MOD13A1')
                     .filterDate('2010-01-01', '2010-12-31')
                     .select('NDVI')
                     .mean();
var ecoregionsWithNDVI = vegIndices.reduceRegions({
  collection: ecoregions,
  reducer: ee.Reducer.mean(),
  scale: 500
});

// Create the chart and print it.
var chart = ui.Chart.feature.byFeature({
  features: ecoregionsWithNDVI,
  xProperty: 'label',
  yProperties: ['mean']
})
.setOptions({
  title: 'Average NDVI by Region',
  hAxis: {title: 'Region'},
  vAxis: {title: 'Mean NDVI'},
  colors: ['76b349']
});
print(chart);
```

* * *

### 2\. **`ui.Chart.feature.byProperty`**

#### **Purpose**:

This function displays a chart summarizing multiple numeric properties of a `FeatureCollection`. Each property is represented as a series.

* * *

#### **Example**:

We will compare mean NDVI and EVI values across features in a `FeatureCollection`.

```javascript
// Add both mean NDVI and mean EVI properties to the FeatureCollection.
var vegIndices = ee.ImageCollection('MODIS/061/MOD13A1')
                     .filterDate('2010-01-01', '2010-12-31')
                     .mean();
var ecoregionsWithVeg = vegIndices.reduceRegions({
  collection: ecoregions,
  reducer: ee.Reducer.mean(),
  scale: 500
}).map(function(feature) {
  return feature.set({
    NDVI: feature.get('mean'),
    EVI: vegIndices.select('EVI').reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: feature.geometry(),
      scale: 500
    }).get('EVI')
  });
});

// Create the chart and print it.
var chart = ui.Chart.feature.byProperty({
  features: ecoregionsWithVeg,
  xProperties: ['NDVI', 'EVI']
})
.setOptions({
  title: 'Vegetation Index Comparison by Property',
  hAxis: {title: 'Properties'},
  vAxis: {title: 'Values'},
  colors: ['76b349', '1d6b99']
});
print(chart);
```

* * *

### 3\. **`ui.Chart.feature.groups`**

#### **Purpose**:

This function creates a chart comparing grouped data based on a categorical property. It’s useful for aggregating and comparing data across different groups.

* * *

#### **Example**:

We will compare mean NDVI values for forest, grassland, and desert groups.

```javascript
// Add a grouping property to the FeatureCollection.
var ecoregionsWithGroups = ecoregionsWithNDVI.map(function(feature) {
  return feature.set('group', feature.get('label'));
});

// Create the chart and print it.
var chart = ui.Chart.feature.groups({
  features: ecoregionsWithGroups,
  xProperty: 'group',
  yProperty: 'mean'
})
.setOptions({
  title: 'Grouped Mean NDVI Values',
  hAxis: {title: 'Group'},
  vAxis: {title: 'Mean NDVI'},
  colors: ['39a8a7']
});
print(chart);
```

* * *

### 4\. **`ui.Chart.feature.histogram`**

#### **Purpose**:

This function generates a histogram of a numeric property across features in a `FeatureCollection`.

* * *

#### **Example**:

We will create a histogram of mean NDVI values for all regions.

```javascript
// Create the chart and print it.
var chart = ui.Chart.feature.histogram({
  features: ecoregionsWithNDVI,
  property: 'mean',
  minBucketWidth: 0.1
})
.setOptions({
  title: 'Histogram of NDVI Values',
  hAxis: {title: 'NDVI Value'},
  vAxis: {title: 'Frequency'},
  colors: ['9c4f97']
});
print(chart);
```

* * *

