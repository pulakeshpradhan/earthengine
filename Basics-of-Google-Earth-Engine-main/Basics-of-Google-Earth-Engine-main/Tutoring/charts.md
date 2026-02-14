# Charts in Google Earth Engine  

## 1. Image-Based Charts
### Time Series Analysis
- `ui.Chart.image.series`: Single region over time
- `ui.Chart.image.seriesByRegion`: Multiple regions over time
- `ui.Chart.image.doySeries`: Day-of-year patterns for single region
- `ui.Chart.image.doySeriesByYear`: Compare years for single region
- `ui.Chart.image.doySeriesByRegion`: Day-of-year patterns across regions

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
---
Made by [Pulakesh Pradhan](https://wa.me/918617812861)
* * *

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
---
Made by [Pulakesh Pradhan](https://wa.me/918617812861)
* * *
* * *
--- 



