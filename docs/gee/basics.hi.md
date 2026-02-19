# बेसिक्स (The Basics): डेटा के साथ शुरुआत (Getting Started with Data)

यह पृष्ठ अर्थ इंजन में डेटा के साथ काम करने के लिए आवश्यक कमांड्स को कवर करता है। आप सीखेंगे कि डेटासेट कैसे लोड करें, उन्हें कैसे खोजें और अपने परिणामों को मानचित्र पर कैसे देखें।

---

## 1. डेटासेट कैसे लोड करें (How to Load a Dataset)

डेटा के साथ काम करने के लिए, आपको सबसे पहले अर्थ इंजन कैटलॉग से इसकी यूनिक आईडी (Unique ID) का उपयोग करके इसे "कॉल" करना होगा।

=== "JavaScript"
    ```javascript
    // एक एकल छवि लोड करें (जैसे: पृथ्वी की ऊंचाई या Elevation)
    var srtm = ee.Image("USGS/SRTMGL1_003");

    // छवियों का एक संग्रह या कलेक्शन लोड करें (जैसे: लैंडसैट 8)
    var landsat = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2");
    ```

=== "Python"
    ```python
    import ee

    # एक एकल छवि लोड करें
    srtm = ee.Image("USGS/SRTMGL1_003")

    # छवियों का एक संग्रह लोड करें
    landsat = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
    ```

---

## 2. अपने डेटा को समझना (मेटाडाटा) (Exploring Your Data - Metadata)

विश्लेषण से पहले, यह समझना महत्वपूर्ण है कि आपके डेटासेट के अंदर क्या है (बैंड, तारीख, स्केल आदि)।

=== "JavaScript"
    ```javascript
    // 'Console' टैब में विवरण देखने के लिए print कमांड का उपयोग करें
    print('SRTM Metadata:', srtm);
    ```

=== "Python"
    ```python
    # पायथन में सर्वर से मेटाडाटा प्राप्त करने के लिए .getInfo() का उपयोग करना होता है
    import pprint
    pprint.pprint(srtm.getInfo())
    ```

---

## 3. मानचित्र पर डेटा प्रदर्शित करना (Displaying Data on the Map)

`Map.addLayer()` फ़ंक्शन विज़ुअलाइज़ेशन (डेटा देखने) के लिए आपका प्राथमिक टूल है।

=== "JavaScript"
    ```javascript
    // बुनियादी प्रदर्शन (डिफ़ॉल्ट सेटिंग्स के साथ दिखाता है)
    Map.addLayer(srtm, {}, 'Elevation');
    ```

=== "Python"
    ```python
    # पायथन में geemap का उपयोग करके
    import geemap
    Map = geemap.Map()
    Map.addLayer(srtm, {}, 'Elevation')
    Map
    ```

---

## 4. विज़ुअलाइज़ेशन पैरामीटर्स (Visualization Parameters)

आप **कोड** या **यूजर इंटरफेस** का उपयोग करके यह नियंत्रित कर सकते हैं कि डेटा कैसा दिखता है।

### क. कोड के माध्यम से (Via Code)

बैंड, न्यूनतम/अधिकतम मान और रंग पैलेट (Palette) निर्दिष्ट करें।

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

### ख. क्लिक करने के माध्यम से (लेयर सेटिंग्स)

1. अपने स्क्रिप्ट को `Map.addLayer()` के साथ रन करें।
2. मानचित्र के ऊपर दाईं ओर **Layers** बटन ढूंढें।
3. अपनी लेयर के बगल में **Settings** (गियर आइकन) पर क्लिक करें।
4. स्ट्रेच, पारदर्शिता और पैलेट को समायोजित करें।
5. **Apply** पर क्लिक करें।

---

## 5. उदाहरण: SRTM DEM को देखना (Case Study: Visualizing SRTM DEM)

डिजिटल एलीवेशन मॉडल (DEM) शुरू करने का एक शानदार तरीका है।

=== "JavaScript"
    ```javascript
    var srtm = ee.Image("USGS/SRTMGL1_003");

    // ऊंचाई बैंड का चयन करें
    var elevation = srtm.select('elevation');
    
    // एक रंगीन पैलेट के साथ विज़ुअलाइज़ करें
    Map.addLayer(elevation, {min: 0, max: 2500, palette: ['0000FF', '00FF00', 'FFFF00', 'FF0000', 'FFFFFF']}, 'SRTM DEM');
    Map.setCenter(85.8, 20.4, 6);
    ```

---

## 6. अपने अध्ययन क्षेत्र का उपयोग करना (Using Your Own Study Area - Assets)

क्या आप किसी विशिष्ट शहर या जिले पर ध्यान केंद्रित करना चाहते हैं? आप अपनी खुद की शेपफाइल (Shapefiles) या GeoJSON अपलोड कर सकते हैं।

### कैसे अपलोड करें

1. **Assets** टैब (ऊपर बाईं ओर) पर जाएं।
2. **NEW** -> **Shape files** पर क्लिक करें (सभी भागों को अपलोड करें: .shp, .shx, .dbf, .prj)।
3. अपलोड होने के बाद, यह आपकी एसेट सूची में दिखाई देगा।

### कोड में इसका उपयोग कैसे करें

1. अपनी एसेट पर कर्सर ले जाएं और **एरो आइकन** (Import) पर क्लिक करें।
2. यह आपके स्क्रिप्ट के शीर्ष पर `table` के रूप में दिखाई देगा।
3. अपने डेटा को उस सीमा तक काटने के लिए `.clip()` का उपयोग करें।

=== "JavaScript"
    ```javascript
    // मान लें कि आपने अपनी एसेट को 'roi' के रूप में इम्पोर्ट किया है
    var srtm = ee.Image("USGS/SRTMGL1_003").clip(roi);
    Map.centerObject(roi, 10);
    Map.addLayer(srtm, {min: 0, max: 2000}, 'My Study Area Elevation');
    ```

=== "Python"
    ```python
    # पायथन के लिए आप इसके पथ द्वारा एसेट को कॉल करते हैं
    roi = ee.FeatureCollection("users/yourusername/myshapefile")
    srtm = ee.Image("USGS/SRTMGL1_003").clip(roi)

    Map = geemap.Map()
    Map.centerObject(roi, 10)
    Map.addLayer(srtm, {'min': 0, 'max': 2000}, 'My Elevation')
    Map
    ```
