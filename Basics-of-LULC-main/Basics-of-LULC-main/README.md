
Image Processing
----------------

### 1\. Radiometric Correction

These corrections deal with the image’s brightness values (Digital Numbers or DN), ensuring they accurately represent surface reflectance. They aim to correct:
![https___cdn_mathpix_com_cropped_2024_05_08_9a0fa8d73b570593b3e9g-096_jpg_height_1098_width_1442_top_left_y_362_top_left_x_491](https://github.com/user-attachments/assets/01617e32-22ef-4db6-a67f-61308db44ec0)


*   **Sensor Defects:** Calibration errors, striping, and sensor drift (especially for older sensors like Landsat MSS or TM).
*   **Atmospheric Correction:** Removing scattering and absorption effects caused by the atmosphere. Methods range from simple (Dark Object Subtraction) to complex (physical modeling like 6S or MODTRAN).
* ![image](https://github.com/user-attachments/assets/72d71c1b-e1e3-40bf-a5d6-26181f68fc8d)


* * *

### 2\. Geometric Correction

This ensures images align properly with geographic coordinates, correcting distortions caused by:

*   **Sensor Geometry:** Perspective distortions caused by sensor movement and angle.
*   **Platform Instability:** Aircraft or satellite movement during capture (pitch, roll, yaw).
*   **Earth Curvature and Terrain Effects:** These are addressed through:
    *   **GPS and Ground Control Points (GCP):** Linking image features to known geographic coordinates.
    *   **Mathematical Transformation Models:** Polynomial transformations, RPC models, etc.
    *   **DTM/DEM Use:** For terrain correction, especially in hilly/mountainous areas.
    *   ![image](https://github.com/user-attachments/assets/8bb8b983-bd46-436b-98fd-9717254b7e48)


* * *

Image Enhancement
-----------------

### 1\. Radiometric/Contrast Enhancement

Direct modification of individual pixel brightness (DN values) to enhance visual interpretability:

*   **Linear Contrast Stretch:** Expands DN range (e.g., min-max stretch).
*   **Non-Linear Transformations:** Logarithmic and inverse log stretches to enhance darker areas (log) or compress brighter areas (inverse log).
*   ![image](https://github.com/user-attachments/assets/76129f19-f066-47c9-b4f0-297410641961)


* * *

### 2\. Spectral Enhancement

Multiband transformations to enhance spectral patterns:

*   **Band Ratios:** e.g., NDVI (Vegetation), NDBI (Built-up), NDWI (Water).
*   **Principal Component Analysis (PCA):** Reduces data dimensionality by transforming correlated bands into a set of uncorrelated components.
*   ![image](https://github.com/user-attachments/assets/708da846-1d13-42e3-bf1d-8be1c8d4effb)


* * *

### 3\. Spatial Enhancement

Enhancement based on relationships between neighboring pixels (spatial context):

*   **Low-Pass Filters:** Smoothing (e.g., Mean filter) to reduce noise.
*   **Edge Enhancement:** High-pass filters to sharpen edges.
*   **Edge Detection:** Sobel, Prewitt, or Canny filters for boundary extraction.

* * *


![image](https://github.com/user-attachments/assets/11927990-70bf-432b-9e9e-2b1579cc5b48)

Land Use / Land Cover (LULC) Classification
-------------------------------------------

### 1\. Spectral Pattern Recognition

The **most widely used** approach, distinguishing land cover classes based on:

*   Differences in spectral reflectance (or DN values) across different wavelength bands.
*   Works well when spectral separability is high (e.g., water vs vegetation vs bare soil).

* * *

### 2\. Spatial Pattern Recognition

This method adds **texture analysis and spatial context** into classification. This can involve:

*   Measuring texture (e.g., homogeneity, contrast, entropy).
*   Considering shapes, sizes, and spatial relationships between objects.
*   Particularly useful in high-resolution imagery (e.g., urban mapping).

* * *

### 3\. Temporal Pattern Recognition

For dynamic landscapes, you can leverage:

*   **Multi-temporal data:** Changes in spectral reflectance over time (e.g., phenological cycles in vegetation).
*   **Derived indices over time:** Time-series analysis of NDVI or other spectral indices.

* * *

Training Samples - Key Characteristics
--------------------------------------

For supervised classification, training samples must follow these criteria:

### Number of Pixels

*   Minimum: **10-25n** pixels (where `n` = number of spectral bands).
*   Recommended: Each class should have at least **100n** pixels.

### Quality Factors

*   **Size:** Large enough to capture within-class spectral variability.
*   **Shape:** Ideally compact and contiguous.
*   **Geographic Distribution:** Spread across the image, covering different terrain/conditions.
*   **Number of Training Areas:** Several training sites per class to capture variations.
*   **Easy Identification:** Sites should be visually distinct and geographically locatable on the image.
*   **Spectral Homogeneity:** Each training site should have relatively uniform spectral properties representative of the class.

### Spectral Homogeneity Check

*   Before classification, **plot spectral curves** for all training samples.
*   Spectra for pixels within each class should cluster tightly (indicating good homogeneity).

* * *

Classifier Example: Parallelepiped (Box Classifier)
---------------------------------------------------

### How it works

*   Each class is defined by **upper and lower bounds** in each spectral band (essentially defining an n-dimensional box for each class).
*   If a pixel falls within all boxes for a class, it gets classified to that class.

### Problems with Parallelepiped Classifier

*   **Sensitivity to Overlap:** If two classes have overlapping boxes, the classifier either assigns one arbitrarily or flags it as unclassified.
*   **Rigidity:** It assumes all class distributions are rectangular, which is almost never the case.
*   **Not Robust in Complex Spectral Spaces:** It struggles with subtle class separations and noisy data.
*   **Prone to Overclassification:** Especially if boxes are too large, leading to false positives.

### When to Use

*   Works reasonably well for **simple, spectrally distinct classes** (e.g., water vs forest).
*   **Avoid for complex land covers** with high spectral variability (e.g., urban vs bare soil).

* * *


