# বেসিকস (The Basics): ডেটা দিয়ে শুরু করা (Getting Started with Data)

এই পৃষ্ঠায় আর্থ ইঞ্জিন-এ ডেটা নিয়ে কাজ করার জন্য প্রয়োজনীয় কমান্ডগুলো আলোচনা করা হয়েছে। আপনি শিখবেন কীভাবে ডেটাসেট লোড করতে হয়, সেগুলো অন্বেষণ করতে হয় এবং ফলাফলগুলো ম্যাপে প্রদর্শন করতে হয়।

---

## ১. কীভাবে ডেটাসেট লোড করবেন (How to Load a Dataset)

ডেটা নিয়ে কাজ করতে হলে, প্রথমে আর্থ ইঞ্জিন ক্যাটালগ থেকে এর ইউনিক আইডি (Unique ID) ব্যবহার করে সেটি "কল" করতে হবে।

=== "JavaScript"
    ```javascript
    // একটি ইমেজ লোড করুন (যেমন: বিশ্বের উচ্চতা বা Elevation)
    var srtm = ee.Image("USGS/SRTMGL1_003");

    // অনেকগুলো ইমেজের সংগ্রহ বা একটি কালেকশন লোড করুন (যেমন: ল্যান্ডস্যাট ৮)
    var landsat = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2");
    ```

=== "Python"
    ```python
    import ee

    # একটি ইমেজ লোড করুন
    srtm = ee.Image("USGS/SRTMGL1_003")

    # একটি কালেকশন লোড করুন
    landsat = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
    ```

---

## ২. আপনার ডেটা অন্বেষণ করা (মেটাডেটা) (Exploring Your Data - Metadata)

বিশ্লেষণের আগে, আপনার ডেটাসেটের ভিতরে কী আছে (ব্যান্ড, তারিখ, স্কেল ইত্যাদি) তা বোঝা গুরুত্বপূর্ণ।

=== "JavaScript"
    ```javascript
    // 'Console' ট্যাবে বিস্তারিত দেখতে print কমান্ড ব্যবহার করুন
    print('SRTM Metadata:', srtm);
    ```

=== "Python"
    ```python
    # পাইথনে সার্ভার থেকে মেটাডেটা পেতে .getInfo() ব্যবহার করতে হয়
    import pprint
    pprint.pprint(srtm.getInfo())
    ```

---

## ৩. ম্যাপে ডেটা প্রদর্শন করা (Displaying Data on the Map)

`Map.addLayer()` ফাংশনটি হলো ডেটা দেখার প্রধান মাধ্যম।

=== "JavaScript"
    ```javascript
    // সাধারণ প্রদর্শন (ডিফল্ট সেটিংসে দেখায়)
    Map.addLayer(srtm, {}, 'Elevation');
    ```

=== "Python"
    ```python
    # পাইথনে geemap ব্যবহার করে
    import geemap
    Map = geemap.Map()
    Map.addLayer(srtm, {}, 'Elevation')
    Map
    ```

---

## ৪. ভিজ্যুয়ালাইজেশন প্যারামিটার (Visualization Parameters)

আপনি **কোডিং** বা **ইউজার ইন্টারফেস** ব্যবহার করে ডেটা দেখতে কেমন হবে তা নিয়ন্ত্রণ করতে পারেন।

### ক. কোড-এর মাধ্যমে (Via Code)

ব্যান্ড, সর্বনিম্ন/সর্বোচ্চ মান এবং কালার প্যালেট নির্দিষ্ট করুন।

=== "JavaScript"
    ```javascript
    var visParams = {
      min: 0,
      max: 3000,
      palette: ['blue', 'green', 'red']
    };
    Map.addLayer(srtm, visParams, 'Colored Elevation');
    ```

=== "Python"
    ```python
    vis_params = {
      'min': 0,
      'max': 3000,
      'palette': ['blue', 'green', 'red']
    }
    Map.addLayer(srtm, vis_params, 'Colored Elevation')
    ```

### খ. ক্লিক করার মাধ্যমে (লেয়ার সেটিংস)

১. `Map.addLayer()` দিয়ে আপনার স্ক্রিপ্টটি রান করুন।
২. ম্যাপের ডানদিকের উপরে **Layers** বাটনটি খুঁজুন।
৩. লেয়ারের পাশে **Settings** (গিয়ার আইকন) ক্লিক করুন।
৪. স্ট্রেচ, স্বচ্ছতা এবং প্যালেট সামঞ্জস্য করুন।
৫. **Apply** ক্লিক করুন।

---

## ৫. উদাহরণ: SRTM DEM দেখা (Case Study: Visualizing SRTM DEM)

উচ্চতা সংক্রান্ত ডেটা বা ডিজিটাল ইলিভেশন মডেল (DEM) দিয়ে শুরু করা সহজ।

=== "JavaScript"
    ```javascript
    var srtm = ee.Image("USGS/SRTMGL1_003");

    // উচ্চতার ব্যান্ডটি নির্বাচন করুন
    var elevation = srtm.select('elevation');
    
    // একটি ভৌগোলিক প্যালেট দিয়ে দেখুন
    Map.addLayer(elevation, {min: 0, max: 2500, palette: ['0000FF', '00FF00', 'FFFF00', 'FF0000', 'FFFFFF']}, 'SRTM DEM');
    Map.setCenter(85.8, 20.4, 6);
    ```

---

## ৬. নিজস্ব স্টাডি এরিয়া ব্যবহার করা (Using Your Own Study Area - Assets)

আপনি কি নির্দিষ্ট কোনো শহর বা জেলা নিয়ে কাজ করতে চান? আপনি আপনার নিজের শেপফাইল (Shapefiles) আপলোড করতে পারেন।

### কীভাবে আপলোড করবেন

১. **Assets** ট্যাবে যান (বামদিকের উপরে)।
২. **NEW** -> **Shape files** ক্লিক করুন (সমস্ত অংশ আপলোড করুন: .shp, .shx, .dbf, .prj)।
৩. আপলোড হয়ে গেলে এটি আপনার অ্যাসেট লিস্টে দেখা যাবে।

### কোডে যেভাবে ব্যবহার করবেন

১. আপনার অ্যাসেটের উপরে মাউস নিয়ে গিয়ে **অ্যারো আইকন** (Import) ক্লিক করুন।
২. এটি আপনার স্ক্রিপ্টের উপরে `table` হিসেবে যুক্ত হবে।
৩. আপনার ডেটাকে ওই সীমানায় কাটতে `.clip()` ব্যবহার করুন।

=== "JavaScript"
    ```javascript
    // ধরে নিচ্ছি আপনি আপনার অ্যাসেটটি 'roi' নামে ইমপোর্ট করেছেন
    var srtm = ee.Image("USGS/SRTMGL1_003").clip(roi);
    Map.centerObject(roi, 10);
    Map.addLayer(srtm, {min: 0, max: 2000}, 'My Study Area Elevation');
    ```

=== "Python"
    ```python
    # পাইথনের জন্য পাথ ব্যবহার করে অ্যাসেট কল করতে হয়
    roi = ee.FeatureCollection("users/yourusername/myshapefile")
    srtm = ee.Image("USGS/SRTMGL1_003").clip(roi)

    Map = geemap.Map()
    Map.centerObject(roi, 10)
    Map.addLayer(srtm, {'min': 0, 'max': 2000}, 'My Elevation')
    Map
    ```
