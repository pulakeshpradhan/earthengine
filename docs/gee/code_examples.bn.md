# GEE কোড উদাহরণ: জাভাস্ক্রিপ্ট ও পাইথন

এই পৃষ্ঠায় গুগল আর্থ ইঞ্জিন-এর সাধারণ কাজগুলো জাভাস্ক্রিপ্ট ও পাইথন দুটোতেই দেখানো হয়েছে। ভাষা বদলাতে ট্যাবে ক্লিক করুন।

## মৌলিক কাজসমূহ (Basic Operations)

### একটি ইমেজ লোড করা

=== "JavaScript"
    ```javascript
    // একটি ল্যান্ডস্যাট ৮ ইমেজ লোড করুন
    var image = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_044034_20140318');
    print('Image:', image);
    ```

=== "Python"
    ```python
    # একটি ল্যান্ডস্যাট ৮ ইমেজ লোড করুন
    image = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_044034_20140318')
    print('Image:', image)
    ```

### একটি ইমেজ কালেকশন লোড করা

=== "JavaScript"
    ```javascript
    // সেন্টিনেল-২ ইমেজ কালেকশন লোড করুন
    var collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
      .filterDate('2023-01-01', '2023-12-31')
      .filterBounds(ee.Geometry.Point([-122.4, 37.8]));

    print('Number of images:', collection.size());
    ```

=== "Python"
    ```python
    # সেন্টিনেল-২ ইমেজ কালেকশন লোড করুন
    collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
        .filterDate('2023-01-01', '2023-12-31') \
        .filterBounds(ee.Geometry.Point([-122.4, 37.8]))

    print('Number of images:', collection.size().getInfo())
    ```

### জিওমেট্রি তৈরি করা

=== "JavaScript"
    ```javascript
    // একটি পয়েন্ট তৈরি করুন
    var point = ee.Geometry.Point([-122.4194, 37.7749]);

    // একটি আয়তক্ষেত্র তৈরি করুন
    var rectangle = ee.Geometry.Rectangle([-122.5, 37.5, -122.0, 38.0]);
    
    // একটি পলিগন তৈরি করুন
    var polygon = ee.Geometry.Polygon([
      [[-122.5, 37.5], [-122.5, 38.0], [-122.0, 38.0], 
       [-122.0, 37.5], [-122.5, 37.5]]
    ]);
    ```

=== "Python"
    ```python
    # একটি পয়েন্ট তৈরি করুন
    point = ee.Geometry.Point([-122.4194, 37.7749])

    # একটি আয়তক্ষেত্র তৈরি করুন
    rectangle = ee.Geometry.Rectangle([-122.5, 37.5, -122.0, 38.0])
    
    # একটি পলিগন তৈরি করুন
    polygon = ee.Geometry.Polygon([
        [[-122.5, 37.5], [-122.5, 38.0], [-122.0, 38.0], 
         [-122.0, 37.5], [-122.5, 37.5]]
    ])
    ```

## ডেটা ফিল্টার করা

### তারিখ ও অবস্থান অনুযায়ী ফিল্টার

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

## ইমেজ অপারেশন

### NDVI গণনা

=== "JavaScript"
    ```javascript
    var image = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_044034_20140318');
    var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
    Map.addLayer(ndvi, {min: -1, max: 1, palette: ['blue', 'white', 'green']}, 'NDVI');
    ```

=== "Python"
    ```python
    image = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_044034_20140318')
    ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI')
    Map.addLayer(ndvi, {'min': -1, 'max': 1, 'palette': ['blue', 'white', 'green']}, 'NDVI')
    ```

### ব্যান্ড ম্যাথ

=== "JavaScript"
    ```javascript
    var nir = image.select('SR_B5');
    var red = image.select('SR_B4');
    var ndvi = image.expression(
      '(NIR - RED) / (NIR + RED)', {'NIR': nir, 'RED': red}
    );
    ```

=== "Python"
    ```python
    nir = image.select('SR_B5')
    red = image.select('SR_B4')
    ndvi = image.expression(
        '(NIR - RED) / (NIR + RED)', {'NIR': nir, 'RED': red}
    )
    ```

## কালেকশন নিয়ে কাজ

### Map ফাংশন

=== "JavaScript"
    ```javascript
    function addNDVI(image) {
      var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
      return image.addBands(ndvi);
    }
    var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
      .filterDate('2023-01-01', '2023-12-31')
      .map(addNDVI);
    ```

=== "Python"
    ```python
    def add_ndvi(image):
        ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI')
        return image.addBands(ndvi)

    collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
        .filterDate('2023-01-01', '2023-12-31') \
        .map(add_ndvi)
    ```

### কালেকশন রিডিউস করা

=== "JavaScript"
    ```javascript
    var median = collection.median(); // মিডিয়ান কম্পোজিট
    var mean = collection.mean(); // গড়
    ```

=== "Python"
    ```python
    median = collection.median() # মিডিয়ান কম্পোজিট
    mean = collection.mean() # গড়
    ```

## ডেটা এক্সপোর্ট

### ইমেজ এক্সপোর্ট

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

## মূল সিনট্যাক্সের পার্থক্য

| কাজ | JavaScript | Python |
| --- | --- | --- |
| **কনসোলে প্রিন্ট** | `print(value)` | `print(value.getInfo())` |
| **ভ্যারিয়েবল** | `var x = 5` | `x = 5` |
| **ফাংশন** | `function name() {}` | `def name():` |
| **অ্যানোনিমাস ফাংশন** | `function(x) {return x}` | `lambda x: x` |
| **ডিকশনারি** | `{key: value}` | `{'key': value}` |
| **বুলিয়ান** | `true`, `false` | `True`, `False` |
| **কমেন্ট** | `// comment` | `# comment` |

---

**পরামর্শ:** বেশিরভাগ GEE ফাংশন দুটি ভাষাতেই একই রকমভাবে কাজ করে। মূল পার্থক্য হলো সিনট্যাক্সে, কার্যকারিতায় নয়!
