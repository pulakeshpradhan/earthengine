# আধুনিক GEE সেরা অনুশীলন ও সাম্প্রতিক পরিবর্তন

গুগল আর্থ ইঞ্জিন ক্রমাগত উন্নত হচ্ছে। সর্বশেষ সেরা অনুশীলনগুলো জানা থাকলে আপনার স্ক্রিপ্টগুলো দক্ষ, স্কেলেবল এবং সবচেয়ে নির্ভুল ডেটা ব্যবহার করবে।

## ১. ল্যান্ডস্যাটে কালেকশন ২ (C02) ব্যবহার করুন

ল্যান্ডস্যাট কালেকশন ১ বন্ধ হয়ে যাচ্ছে। সবসময় কালেকশন ২ ব্যবহার করুন, যা উন্নত ডেটা মান, আরও ভালো জিওলোকেশন এবং সুসংগত মেটাডেটা দেয়।

=== "JavaScript"
    ```javascript
    // আধুনিক পদ্ধতি - কালেকশন ২ লেভেল ২ (সারফেস রিফ্লেক্ট্যান্স)
    var landsat = ee.Image('LANDSAT/LC08/C02/T1_L2');
    ```

=== "Python"
    ```python
    # আধুনিক পদ্ধতি - কালেকশন ২ লেভেল ২ (সারফেস রিফ্লেক্ট্যান্স)
    landsat = ee.Image('LANDSAT/LC08/C02/T1_L2')
    ```

=== "Legacy (পরিহার করুন)"
    ```javascript
    // পুরানো পদ্ধতি - এটি আর ব্যবহার করবেন না
    var legacy = ee.Image('LANDSAT/LC08/C01/T1_SR');
    ```

## ২. সার্ভার-সাইড বনাম ক্লায়েন্ট-সাইড

সবচেয়ে সাধারণ ভুলগুলোর একটি হলো সার্ভার-সাইড আর্থ ইঞ্জিন অবজেক্টকে ক্লায়েন্ট-সাইড ফাংশনের (যেমন `for` লুপ বা `if` স্টেটমেন্ট) সাথে মিশিয়ে ফেলা।

### সঠিক পদ্ধতি (সার্ভার-সাইড)

`for` লুপের পরিবর্তে `.map()` এবং `if` এর পরিবর্তে `ee.Algorithms.If()` ব্যবহার করুন।

=== "JavaScript"
    ```javascript
    // ইমেজ কালেকশন স্কেল করুন (আধুনিক পদ্ধতি)
    var collection = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
      .map(function(image) {
        return image.divide(10000); // সার্ভার-সাইড অপারেশন
      });
    ```

=== "Python"
    ```python
    # ইমেজ কালেকশন স্কেল করুন (আধুনিক পদ্ধতি)
    collection = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
        .map(lambda image: image.divide(10000))
    ```

## ৩. সেন্টিনেল-২ হারমোনাইজেশন

সাম্প্রতিক সেন্টিনেল-২ ডেটায় (আর্লি ২০২২ এর পর) প্রসেসিং পরিবর্তন হয়েছে। সংগত মান নিশ্চিত করতে `COPERNICUS/S2_SR_HARMONIZED` ব্যবহার করুন।

## ৪. দক্ষ রিডিউসার

বৃহৎ এলাকায় পরিসংখ্যান গণনা করতে `scale` এবং `tileScale` নির্ধারণ করুন যাতে মেমরি এরর না হয়।

=== "JavaScript"
    ```javascript
    var stats = image.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: region,
      scale: 30,
      tileScale: 4 // জটিল গণনার জন্য ১৬ পর্যন্ত ব্যবহার করুন
    });
    ```

=== "Python"
    ```python
    stats = image.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=region,
        scale=30,
        tileScale=4
    )
    ```

---

## মূল পার্থক্য: JavaScript বনাম Python

| বৈশিষ্ট্য | JavaScript | Python |
| ------- | ---------- | ------ |
| **ভ্যারিয়েবল ঘোষণা** | `var x = ...` | `x = ...` |
| **ফাংশন** | `function(x) { return x; }` | `def func(x): return x` বা `lambda x: x` |
| **ডিকশনারি/অবজেক্ট** | `{key: 'value'}` | `{'key': 'value'}` |
| **কমেন্ট** | `// comment` | `# comment` |
| **True/False** | `true`, `false` | `True`, `False` |

---

*আপডেট থাকতে নিয়মিত [Earth Engine Developers Blog](https://medium.com/google-earth) দেখুন।*
