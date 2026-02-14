# GEE Training Draft


**📅 10-Day Google Earth Engine (GEE) Training Schedule**
---------------------------------------------------------

### **🚀 Day 1: Introduction to Google Earth Engine (GEE)**
🔹 **What is GEE?** Overview of cloud computing for geospatial analysis.  
🔹 **Why GEE?** Advantages: time-efficient, cost-effective, and scalable.  
🔹 **How GEE works?** Cloud-based processing, parallel computation.  
🔹 **GEE Use Cases:** Deforestation monitoring, climate analysis, urban expansion, etc.  
🔹 **GEE Interface Walkthrough:** Code Editor UI, Assets, Docs, and Help sections.

📌 **Hands-on Task:**  
✅ Sign up for GEE ([https://earthengine.google.com/](https://earthengine.google.com/))  
✅ Explore Code Editor and run a sample script.

* * *

### **📅 Day 2: Data Types in JavaScript (JS Basics for GEE)**
🔹 **Data Types in JS:** `ee.Number`, `ee.String`, `ee.List`, `ee.Dictionary`.  
🔹 **JS Syntax in GEE:** Writing scripts for geospatial analysis.  
🔹 **Understanding functions:** Basics of function writing.

📌 **Hands-on Task:**  
✅ Write a JavaScript script to define variables and run simple operations in GEE.

* * *

### **📅 Day 3: Data Types in Google Earth Engine (GEE Specific)**
🔹 **GEE Data Types:**

*   `ee.Geometry`, `ee.Feature`, `ee.FeatureCollection`
*   `ee.Image`, `ee.ImageCollection`  
    🔹 **Differences between JS and GEE data types.**  
    🔹 **Working with FeatureCollections and ImageCollections.**

📌 **Hands-on Task:**  
✅ Load a dataset (e.g., Landsat, MODIS, Sentinel-2) and explore its properties.

* * *

### **📅 Day 4: Importing and Exporting Data**
🔹 **Importing Assets:** Uploading shapefiles, CSVs, and images.  
🔹 **Loading Public Datasets:** Accessing GEE datasets (Landsat, MODIS, Sentinel, etc.).  
🔹 **Exporting Data:**

*   Exporting images to Google Drive
*   Exporting FeatureCollections to CSV
*   Exporting time-series data

📌 **Hands-on Task:**  
✅ Export a Landsat  / Sentinel-2 image to Google Drive.

* * *

### **📅 Day 5: Core Functionality – Filtering and Functions**
🔹 **Filtering Data:**

*   `filterBounds()`, `filterDate()`, `filter(.....)`  
    🔹 **Using Map and Reduce functions.**  
    🔹 **Defining and applying user functions.**  
    🔹 **Filtering ImageCollections and FeatureCollections.**

📌 **Hands-on Task:**  
✅ Filter Sentinel-2 data for a specific region and time range.

* * *

### **📅 Day 6: Core Functionality – Reducers**
🔹 **Introduction to Reducers:**

*   `reduceRegion()`, `reduceColumns()`, `reduceNeighbors()`  
    🔹 **Zonal Statistics (Mean, Max, Min, Sum) using Reducers.**  
    🔹 **Reducing ImageCollections to single images.**

📌 **Hands-on Task:**  
✅ Compute NDVI mean for a given region using reducers.

* * *

### **📅 Day 7: Core Functionality – Charts and Visualization**
🔹 **Creating Time-Series Charts.**  
🔹 **Visualizing trends using `ui.Chart.image.series()`.**  
🔹 **Mapping features and visualizing statistical summaries.**

📌 **Hands-on Task:**  
✅ Create a time-series NDVI chart for a location.

* * *

### **📅 Day 8: Project – Time Series Analysis of Climate Data**

🔹 **Concept of Time-Series Analysis in Remote Sensing.**  
🔹 **Extracting time-series data from MODIS, Landsat, or Sentinel.**  
🔹 **Analyzing trends in land cover changes, vegetation, temperature, etc.**

📌 **Hands-on Task:**  
✅ Perform time-series NDVI analysis for a given region.

* * *

### **📅 Day 9: Project – Machine Learning (Land Use Land Cover - LULC)**
🔹 **Machine Learning in GEE:**

*   Supervised Classification (Random Forest, SVM, etc.)
*   Training and Testing Data Preparation  
    🔹 **Creating LULC Maps using Classification Algorithms.**

📌 **Hands-on Task:**  
✅ Classify an area (e.g., urban, water, vegetation) using Random Forest.

* * *

### **📅 Day 10: Advanced Topics – AI, IMD Data, OSM Data Import**
🔹 **Integrating AI Models with GEE.**  
🔹 **Importing IMD (Indian Meteorological Department) weather data.**  
🔹 **Using OpenStreetMap (OSM) data for urban studies.**  
🔹 **Future Scope: Deep Learning & Big Data Analytics in GEE.**

📌 **Hands-on Task:**  
✅ Import OSM data and IMD Collection to GEE.

---
Follow me on LinkedIn:   [Pulakesh Pradhan](https://www.linkedin.com/in/pulakeshpradhan/)
