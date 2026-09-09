# Nghiên cứu nguồn dữ liệu từ điển Nhật-Việt mở/miễn phí

## Mục đích

Tài liệu này khảo sát các nguồn dữ liệu từ điển Nhật-Việt (hoặc có thể chuyển đổi thành Nhật-Việt) mở/miễn phí, phục vụ việc thiết kế schema (entity `service`/`repository`/`entity`/`dto` trong `backend/src/main/java/com/vietnhat/dictionary/`) và nạp dữ liệu ban đầu cho website từ điển Việt-Nhật (backend Java Spring Boot + SQL Server). Toàn bộ thông tin dưới đây được xác minh bằng cách fetch trực tiếp trang nguồn (WebFetch) hoặc tìm kiếm rồi đối chiếu (WebSearch) trong phiên nghiên cứu ngày 2026-09-08 — không dựa vào trí nhớ/suy đoán không kiểm chứng.

---

## Mục 1 — Dataset Nhật-Việt trực tiếp (word/reading/nghĩa tiếng Việt có sẵn)

### 1.1 JMdict / JMdict đa ngôn ngữ (EDRDG) — **KHÔNG có tiếng Việt**

- Nguồn: [JMdict Project page](http://www.edrdg.org/jmdict/j_jmdict.html), [JMdict-EDICT Dictionary Project — EDRDG Wiki](https://www.edrdg.org/wiki/JMdict-EDICT_Dictionary_Project.html)
- Đã fetch trực tiếp cả hai trang. Trang JMdict-EDICT Wiki nêu rõ:
  > "the full version in which there are glosses included in German (133,000 entries), Russian (80,000), Hungarian (51,000), Spanish (39,000), Dutch (29,000), Swedish (16,000), French (15,000) and Slovenian (9,000)."
- Danh sách ngôn ngữ đầy đủ trong bản JMdict đa ngôn ngữ: **Anh, Đức, Nga, Hungary, Tây Ban Nha, Hà Lan, Thụy Điển, Pháp, Slovenia** (và bản `jmdict-simplified` của cộng đồng bổ sung thêm Ý — xem 1.5). **Tiếng Việt không xuất hiện trong danh sách này ở bất kỳ trang chính thức nào đã kiểm tra.**
- Kết luận: JMdict là nguồn Nhật↔Anh (và 8 ngôn ngữ châu Âu khác) chất lượng rất cao, nhưng **không dùng trực tiếp làm nguồn nghĩa tiếng Việt được** — phải kết hợp với dịch máy hoặc dữ liệu khác (xem Mục 2 và 1.2–1.4).

### 1.2 `dreamofi/yomichan-Vietnamese-dictionary` — dataset JA-VI thực tế nhưng chất lượng nguồn chưa rõ ràng

- Nguồn: [github.com/dreamofi/yomichan-Vietnamese-dictionary](https://github.com/dreamofi/yomichan-Vietnamese-dictionary), xác nhận thêm qua issue [yomidevs/yomitan#50 "Request to add Vietnamese kanjidic2 and jmdict"](https://github.com/yomidevs/yomitan/issues/50).
- Nội dung: một script Python (`yomichanViDictGenerator.py`) tạo ra hai bộ từ điển cho add-on Yomichan/Yomitan — **`jmdict_vietnamese.zip`** và **`kanjidic_vietnamese.zip`** — bằng cách gắn nghĩa/âm đọc tiếng Việt vào JMdict và KANJIDIC2 tiếng Anh gốc, lấy từ một SQLite DB.
- **Nguồn gốc dữ liệu tiếng Việt**: README ghi "open source dictionaries over the internet such as ODVP Vietnamese-Japanese dictionary" — **không có trích dẫn cụ thể (URL, phiên bản) cho "ODVP"**, không rõ đây là dữ liệu tự thu thập/crawl hay có giấy phép.
- **Giấy phép**: Đã liệt kê toàn bộ file gốc của repo (`SQLiteDB/`, `vietnameseDict/`, `yomichanJsonInput/`, `yomichanJsonOutput/`, `.gitignore`, `README.md`, `yomichanViDictGenerator.py`) — **không có file LICENSE nào**. Đây là rủi ro pháp lý lớn: không rõ tác giả có quyền phân phối lại dữ liệu "ODVP" hay không, và không có điều khoản sử dụng rõ ràng cho chính output của repo.
- **Quy mô**: README không nêu số lượng entry cụ thể (không có số liệu chính thức).
- **Tình trạng bảo trì**: README tự mô tả "The script was made to fit my simple need, so it is quite barebone" — dự án cá nhân, quy mô nhỏ, không có dấu hiệu bảo trì tích cực.
- **Độ khó tích hợp**: Dữ liệu đóng gói dạng ZIP chứa JSON cho định dạng riêng của Yomitan (không phải bảng SQL/JSON tổng quát) — cần viết ETL riêng để parse cấu trúc Yomitan JSON và ánh xạ sang schema riêng của dự án.
- Kết luận: đây là bằng chứng **duy nhất** tìm được về việc ai đó từng ghép trọn JMdict+KANJIDIC2 với nghĩa tiếng Việt, nhưng vì thiếu license rõ ràng và nguồn gốc dữ liệu mập mờ, **rủi ro cao nếu dùng trực tiếp cho sản phẩm thương mại/công khai**.

### 1.3 `trungnt2910/KanjiDictVN` — KANJIDIC tiếng Việt (chỉ phần Kanji, không phải từ vựng)

- Nguồn: [github.com/trungnt2910/KanjiDictVN](https://github.com/trungnt2910/KanjiDictVN)
- Nội dung: bản dịch tiếng Việt của KANJIDIC (dựa trên KANJIDIC tiếng Anh của dự án `yomidevs`), bổ sung âm Hán-Việt và nghĩa tiếng Việt lấy từ **hvdic.thivien.net** (Từ điển Hán Nôm — Thi Viện).
- **Giấy phép**: repo có file LICENSE dùng **MIT** cho mã nguồn/dữ liệu do tác giả tạo: *"Tất cả mã nguồn chương trình trong dự án thuộc sở hữu (C) 2023-2025 Nguyễn Thành Trung"*; đồng thời README ghi rõ phần KANJIDIC gốc (tiếng Anh) thuộc bản quyền EDRDG và dùng theo giấy phép của EDRDG (CC BY-SA 4.0 — xem Mục 2.2). Vì vậy đây là **license lồng nhau** (MIT cho phần thêm của tác giả + CC BY-SA 4.0 cho phần lõi KANJIDIC kế thừa từ EDRDG) — khi dùng lại phải tuân thủ cả hai.
- **Nguồn dữ liệu tiếng Việt (hvdic.thivien.net)**: không tìm thấy trang điều khoản sử dụng/license công khai của hvdic.thivien.net qua tìm kiếm — **không tìm thấy nguồn đáng tin cậy về giấy phép của hvdic.thivien.net**, chỉ biết trang ghi bản quyền "© 2001-2025 hvdic.thivien.net" cho phần "Vietnamese readings and interpretations". Đây là rủi ro pháp lý cần lưu ý nếu dùng lại nguyên trạng.
- **Định dạng**: file `.zip` chứa `index.json` ở gốc, tương thích format import của Yomichan/Yomitan.
- **Quy mô**: README ghi rõ *"Bao gồm 10350 mục Hán tự"* (10.350 mục Hán tự).
- **Độ khó tích hợp**: cần ETL để chuyển từ định dạng Yomitan JSON sang schema Kanji riêng (bộ thủ, số nét, âm on/kun, JLPT) của backend.
- Kết luận: nguồn tốt nhất tìm được cho phần **tra Kanji riêng bằng tiếng Việt**, nhưng cần làm rõ pháp lý của hvdic.thivien.net trước khi dùng.

### 1.4 Wiktionary tiếng Việt (`vi.wiktionary.org`) qua Kaikki.org (wiktextract) — có dữ liệu, quy mô vừa phải

- Nguồn: [kaikki.org](https://kaikki.org/) (danh sách các phiên bản Wiktionary được trích xuất), [kaikki.org/viwiktionary/index.html](https://kaikki.org/viwiktionary/index.html) (mục từ trong Wiktionary tiếng Việt), đối chiếu chéo với [Thể loại:Tiếng Nhật — Wiktionary tiếng Việt](https://vi.wiktionary.org/wiki/Th%E1%BB%83_lo%E1%BA%A1i:Ti%E1%BA%BFng_Nh%E1%BA%ADt).
- Đã fetch trực tiếp `kaikki.org` (trang chủ) và xác nhận **có** ấn bản "Vietnamese wiktionary edition (viwiktionary)" và "Japanese wiktionary edition (jawiktionary)" trong danh sách các ấn bản Wiktionary được kaikki.org trích xuất bằng công cụ `wiktextract`.
- Trong ấn bản **Wiktionary tiếng Việt** (mục từ được định nghĩa **bằng tiếng Việt**), trang chỉ mục liệt kê **"Tiếng Nhật (12917 senses)"** — tức khoảng 12.917 nghĩa/định nghĩa cho từ vựng tiếng Nhật, viết bằng tiếng Việt. Con số này khớp hợp lý với số liệu đối chiếu từ chính `vi.wiktionary.org`: thể loại "Mục từ tiếng Nhật" có khoảng 8.334 trang (cộng thêm các thể loại con hiragana/katakana/biến thể).
- Lưu ý phân biệt: kaikki.org cũng có trang "Japanese (237328 senses)" trong **ấn bản Wiktionary tiếng Anh** (`kaikki.org/dictionary/Japanese/index.html`) — đã fetch và xác nhận đây là các mục từ tiếng Nhật **được định nghĩa bằng tiếng Anh** (glosses in English), KHÔNG phải tiếng Việt. Chỉ nhánh **viwiktionary** mới cho cặp Nhật→Việt.
- **Giấy phép**: toàn bộ dữ liệu Wiktionary (và bản trích xuất của kaikki.org) theo **CC-BY-SA và GFDL** — trang kaikki.org ghi: "All content derives from Wiktionary and is made available under CC-BY-SA and GFDL licenses."
- **Định dạng**: JSON/JSONL do `wiktextract` sinh ra, tải trực tiếp từ kaikki.org (không cần tự parse wikitext MediaWiki).
- **Quy mô**: ~12.917 senses tiếng Nhật trong viwiktionary — nhỏ hơn nhiều so với ~200.000+ entry của JMdict (xem Mục 2.1), vì Wiktionary tiếng Việt là dự án cộng đồng còn non trẻ, độ phủ từ vựng thấp hơn.
- **Độ khó tích hợp**: **thấp** — dữ liệu đã ở dạng JSON có cấu trúc rõ ràng (word, pos, senses, readings...), không cần tự viết trình phân tích wikitext, chỉ cần ETL JSON → schema SQL Server.
- Kết luận: nguồn **hợp pháp, có cấu trúc, dễ tích hợp nhất trong nhóm dataset Nhật-Việt trực tiếp**, nhưng quy mô còn khiêm tốn — phù hợp làm nguồn bổ sung/khởi động chứ chưa đủ thay thế toàn bộ JMdict.

### 1.5 Kiwix ZIM (bản offline của Wiktionary)

- Nguồn: [download.kiwix.org/zim/wiktionary/ → lb.download.kiwix.org/zim/wiktionary/](https://lb.download.kiwix.org/zim/wiktionary/) (đã fetch trực tiếp danh sách file).
- Xác nhận có sẵn file ZIM cho cả hai ấn bản:
  - Tiếng Việt: `wiktionary_vi_all_nopic_2026-03.zim` (246MB) và bản mới hơn `wiktionary_vi_all_nopic_2026-06.zim` (259MB).
  - Tiếng Nhật: `wiktionary_ja_all_nopic_2026-04.zim` (475MB) và `wiktionary_ja_all_nopic_2026-07.zim` (493MB).
- Đây là **cùng một nguồn dữ liệu Wiktionary** như Mục 1.4 (chỉ đóng gói dạng ZIM để đọc offline qua Kiwix), không phải một dataset Nhật-Việt ghép sẵn riêng biệt. Không có file ZIM "từ điển Nhật-Việt" độc lập nào được tìm thấy trên kiwix.org.
- **Độ khó tích hợp**: **cao hơn** kaikki.org JSON — phải cài Kiwix/thư viện đọc ZIM rồi tự trích xuất HTML từng trang, khó hơn nhiều so với dùng thẳng JSON của kaikki.org. Vì vậy nếu cần dữ liệu Wiktionary, **nên dùng kaikki.org (Mục 1.4) thay vì ZIM**.

### 1.6 Các nguồn liên quan nhưng KHÔNG phải từ điển Nhật-Việt sẵn sàng dùng

- **`undertheseanlp/dictionary`** ([github.com/undertheseanlp/dictionary](https://github.com/undertheseanlp/dictionary)): đã fetch, xác nhận đây là **từ điển tiếng Việt thuần túy** (tổng hợp từ Hồ Ngọc Đức, Tudientv, Wiktionary — 79.226 từ), **không chứa** cặp Nhật-Việt. Giấy phép GPL-3.0. Không phù hợp cho mục tiêu này.
- **`ToJupiter/VN-JP-Translate`** ([github.com/ToJupiter/VN-JP-Translate](https://github.com/ToJupiter/VN-JP-Translate)): theo mô tả tìm được, đây là **corpus song ngữ để huấn luyện mô hình dịch máy** (~3,3 triệu dòng, dataset trên HuggingFace), **không phải** một từ điển có cấu trúc word/reading/nghĩa — không phù hợp để import trực tiếp làm entry từ điển, chỉ có thể tham khảo nếu sau này muốn tự huấn luyện/fine-tune mô hình dịch riêng.
- **Ứng dụng thương mại "Jdict"/"JVDict"** (jdict.net, apps.apple.com...): là sản phẩm thương mại đóng, không có dataset mở công khai đi kèm — không tìm thấy nguồn dữ liệu mở nào liên quan.

---

## Mục 2 — Phương án thay thế: JMdict (JP-EN) + dịch máy, KANJIDIC2, API dịch

### 2.1 JMdict (JP-EN) — nguồn nền tảng chất lượng cao nhất

- Nguồn: [JMdict Project page](http://www.edrdg.org/jmdict/j_jmdict.html)
- **Định dạng**: XML (theo DTD riêng), tải qua FTP: `ftp://ftp.edrdg.org/pub/Nihongo/JMdict.gz` (bản đa ngôn ngữ, UTF-8) hoặc `JMdict_e.gz` (chỉ tiếng Anh).
- **Quy mô**: trang gốc không nêu số liệu, nhưng theo tổng hợp từ tìm kiếm (nguồn thứ cấp, English Wikipedia và các bài viết kỹ thuật) JMdict có khoảng **200.000+ entry**, tính đến khoảng 2023 có **~214.000 entry / ~314.000 tổ hợp headword-reading**. Đây là số liệu **không chính thức từ trang gốc EDRDG** — ghi nhận là ước tính dựa trên nguồn thứ cấp (Wikipedia + bài kỹ thuật cộng đồng), không phải công bố chính thức từ EDRDG.
- **Giấy phép** (đã fetch trực tiếp [edrdg.org/edrdg/licence.html](http://www.edrdg.org/edrdg/licence.html)):
  - Phiên bản: **Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA V4.0)**.
  - Thương mại: **được phép** — "provided the conditions above are met, there is NO restriction placed on commercial use of the files."
  - Yêu cầu ghi công (bắt buộc, chi tiết theo loại sản phẩm):
    - Với phần mềm/app/dịch vụ web: phải "acknowledge the usage and source of the files in the documentation, publicity material, WWW site" và cung cấp link tới license/tài liệu gốc (tại Monash University hoặc EDRDG).
    - Với **web-based dictionary server** (đúng loại hình dự án này): *"the acknowledgement must be made on each screen display, e.g. in the form of a message at the foot of the screen or page"* — tức phải có dòng ghi công JMdict/EDRDG ở **chân mỗi trang** kết quả tra từ, không chỉ ở trang giới thiệu.
    - Với app di động: *"acknowledgement must be made, e.g. on a separate screen accessed from a menu... It is not sufficient just to mention it on a start-up/launch page."*
  - **Yêu cầu cập nhật định kỳ** (điều khoản dễ bị bỏ sót nhưng quan trọng): *"there must be a procedure for regular updating of the data from the most recent versions available. For example, WWW-based dictionary servers should update their dictionary versions at least once a month. Failure to keep the versions up-to-date is a violation of the licence to use the data."* — nghĩa là dự án **bắt buộc** phải có quy trình cập nhật JMdict tối thiểu mỗi tháng một lần, nếu không sẽ vi phạm license.
  - Về derivative work: *"the addition of material to the files or to extracts from the files does not remove or in any way diminish the Group's copyright over the files. Users of material from the files must NOT claim copyright over that material."* Theo điều khoản ShareAlike, bản phái sinh (kể cả bản có thêm nghĩa tiếng Việt do dịch máy) phải dùng license "the same, similar or a compatible licence" — tức về nguyên tắc, **dữ liệu tiếng Việt tạo ra từ việc dịch máy JMdict cũng nên/phải được chia sẻ lại theo CC BY-SA tương thích**, không được giữ độc quyền.
- **Độ khó tích hợp Spring Boot + SQL Server**: cần viết ETL parse XML lớn (file gốc vài chục MB nén), ánh xạ cấu trúc `entry/k_ele/r_ele/sense/gloss` sang entity JPA. Có thể giảm việc này bằng cách dùng bản JSON dựng sẵn (xem 2.3/2.4) thay vì tự parse XML.

### 2.2 KANJIDIC2 (EDRDG) — cho tính năng tra Kanji riêng

- Nguồn chính: [KANJIDIC Project — EDRDG Wiki](https://www.edrdg.org/wiki/KANJIDIC_Project.html) (lưu ý: trang wiki gốc `edrdg.org/wiki/index.php/...` đã bị đóng do bot scraping quá tải, EDRDG chuyển sang các trang tĩnh `.html` lưu trữ cục bộ — đã fetch trực tiếp trang tĩnh và trang DTD [kanjidic2_dtdh.html](https://www.edrdg.org/kanjidic/kanjidic2_dtdh.html)).
- **Định dạng**: XML.
- **Trường dữ liệu** (đã xác nhận qua DTD): bộ thủ (`radical`, giá trị 1–214, theo phân loại classical/nelson_c...), số nét (`stroke_count`), cấp lớp Kyouiku (`grade`, 1–6), cấp độ JLPT cũ (`jlpt`, 1 = khó nhất đến 4 = dễ nhất), xếp hạng tần suất dùng (`freq`, chỉ có cho ~2.500 ký tự thông dụng nhất), âm on (katakana)/âm kun (hiragana), phiên âm Pinyin, âm Hàn, và nghĩa (`meaning`, mặc định tiếng Anh, hỗ trợ đa ngôn ngữ qua thuộc tính `m_lang` theo mã ISO 639-1 — nhưng **không có sẵn tiếng Việt** trong dữ liệu gốc, tương tự JMdict).
- **Quy mô**: theo kết quả tìm kiếm đối chiếu nhiều nguồn kỹ thuật (CRAN package `kanjistat`, PHP library `kanjidic2-lib`...), KANJIDIC2 bao phủ **13.108 ký tự Kanji** (theo JIS X 0208, 0212, 0213) — con số này không nằm trên một trang HTML chính thức duy nhất của EDRDG mà được suy ra nhất quán từ nhiều nguồn kỹ thuật cộng đồng dùng chính file `kanjidic2.xml`, nên độ tin cậy cao dù không phải trích dẫn "một câu duy nhất" từ edrdg.org.
- **Giấy phép**: cùng **CC BY-SA 4.0** như JMdict (đã xác nhận qua [licence.html](http://www.edrdg.org/edrdg/licence.html)), nhưng có **điều kiện bổ sung quan trọng**: một số trường dữ liệu do các cá nhân khác giữ bản quyền riêng và cấp phép cho EDRDG sử dụng, cụ thể (trích từ trang license):
  - Jack Halpern — mã SKIP
  - Christian Wittern & Koichi Yasuoka — thông tin Pinyin
  - Urs App — mã Four Corner và thông tin Morohashi
  - Mark Spahn & Wolfgang Hadamitzky — kanji descriptor
  - Charles Muller — âm đọc Hàn
  - Joseph De Roo — mã De Roo
  
  → Nếu dự án chỉ dùng các trường cốt lõi (bộ thủ, số nét, on/kun, JLPT, grade, freq, meaning) thì không vướng các đồng tác giả này, nhưng nếu dùng SKIP code/Four Corner/Morohashi/Hàn thì cần lưu ý ghi công riêng.
- **Độ khó tích hợp**: tương tự JMdict — cần ETL XML, nhưng file nhỏ hơn nhiều (13k ký tự so với 200k+ entry từ vựng) nên dễ xử lý hơn.

### 2.3 `scriptin/jmdict-simplified` — JSON dựng sẵn, giảm công ETL

- Nguồn: [github.com/scriptin/jmdict-simplified](https://github.com/scriptin/jmdict-simplified)
- Chuyển đổi JMdict, JMnedict, Kanjidic, RADKFILE/KRADFILE từ XML sang **JSON**, publish release **hàng tuần** ("Releases are automatically scheduled for every Monday"), có sẵn npm package (`@scriptin/jmdict-simplified-types`, `@scriptin/jmdict-simplified-loader`) hỗ trợ TypeScript/JS (không có gì đặc thù cho Java, nhưng file JSON đơn thuần có thể đọc bằng Jackson trong Spring Boot).
- **Giấy phép**: JMdict/JMnedict/RADKFILE-KRADFILE theo EDRDG License; Kanjidic theo CC BY-SA 4.0; code/npm package theo CC-BY-SA-4.0 và MIT tùy phần.
- **Ngôn ngữ hỗ trợ trong output**: Anh, Đức, Nga, Hungary, Hà Lan, Tây Ban Nha, Pháp, Thụy Điển, Slovenia — **không có tiếng Việt** (đã xác nhận qua fetch trực tiếp README).
- **Độ khó tích hợp**: **thấp nhất trong nhóm nguồn Nhật-Anh** — chỉ cần tải file JSON release có sẵn, parse bằng Jackson, không cần tự viết XML parser. Đây là lựa chọn tốt nếu quyết định đi theo hướng "JMdict (Anh) + dịch máy sang Việt", vì tiết kiệm hẳn công đoạn ETL XML.
- Repo liên quan cùng hệ sinh thái: [`yomidevs/jmdict-yomitan`](https://github.com/yomidevs/jmdict-yomitan) — cũng sinh JSON từ JMdict/KANJIDIC nhưng đóng gói cho định dạng Yomitan; code MIT, dictionary CC BY-SA 4.0; **không có tiếng Việt** (đã xác nhận: "The supported languages for JMdict are: English, Dutch, French, German, Hungarian, Russian, Slovenian, and Spanish. KANJIDIC is available in English, French, Portuguese, and Spanish.").

### 2.4 API dịch máy để bổ sung nghĩa tiếng Việt

- **Google Cloud Translation API** — nguồn: [cloud.google.com/translate/pricing](https://cloud.google.com/translate/pricing) (đối chiếu qua kết quả tìm kiếm giới hạn domain `cloud.google.com`, không fetch trực tiếp được toàn văn do trang bị cắt bớt/nội dung động, nên số liệu dưới đây lấy từ đoạn trích chính thức trong kết quả tìm kiếm giới hạn domain, coi là gần với nguồn gốc nhưng cần tự kiểm tra lại giá tại thời điểm triển khai):
  - Miễn phí 500.000 ký tự/tháng đầu tiên, áp dụng chung cho cả Basic (v2, NMT) và Advanced (v3), không tự động hết hạn (reset hàng tháng), nhưng yêu cầu bật billing.
  - Sau ngưỡng miễn phí: khoảng 20 USD / 1 triệu ký tự (Basic và Advanced).
  - Hỗ trợ 100+ cặp ngôn ngữ, gồm cả Nhật↔Việt.
- **DeepL API** — nguồn: [DeepL API plans (Help Center)](https://support.deepl.com/hc/en-us/articles/360021200939-DeepL-API-plans) và trang sản phẩm chính thức (fetch trực tiếp trang `deepl.com/en/pro-api` bị lỗi kết nối nhiều lần — dùng kết quả tìm kiếm giới hạn domain `deepl.com` thay thế, đây gần với nguồn gốc nhưng không phải fetch trực tiếp 100%):
  - Gói **API Free** (500.000 ký tự/tháng) và **API Pro** (không giới hạn, trả phí) **không còn bán cho khách hàng mới** kể từ khoảng giữa 2026 — DeepL hiện hướng khách mới sang gói **Developer** (khoảng 1 triệu ký tự dùng thử, không phải 1 triệu ký tự miễn phí mỗi tháng) và **Growth** (giới hạn khoảng 50 triệu ký tự/tháng, trả phí).
  - **Không tìm thấy nguồn chính thức xác nhận rõ DeepL có hỗ trợ cặp Nhật→Việt hay không** trong lần fetch này (trang chính thức không truy cập được do lỗi kết nối) — cần tự kiểm tra danh sách ngôn ngữ hỗ trợ của DeepL trước khi chọn (theo hiểu biết chung DeepL hỗ trợ Nhật nhưng danh sách ngôn ngữ đích có thay đổi theo thời gian, không nên coi là chắc chắn nếu chưa tự xác minh lại tại thời điểm triển khai).
  - Kết luận: giá cả/hạn mức miễn phí của DeepL đã thay đổi nhiều trong 2026, **cần kiểm tra lại giá và ngôn ngữ hỗ trợ trực tiếp trên deepl.com tại thời điểm quyết định**, không nên chốt theo số liệu trong tài liệu này.

---

## Mục 3 — Bảng so sánh chi tiết theo 4 tiêu chí

| Nguồn | Giấy phép (thương mại?) | Định dạng | Quy mô | Độ khó tích hợp Spring Boot + SQL Server |
|---|---|---|---|---|
| [JMdict (đa ngôn ngữ, JP-EN+8 ngôn ngữ châu Âu)](http://www.edrdg.org/jmdict/j_jmdict.html) | CC BY-SA 4.0, **thương mại OK**, yêu cầu ghi công mỗi trang + cập nhật ≥1 lần/tháng ([license](http://www.edrdg.org/edrdg/licence.html)) | XML (DTD riêng) | ~200.000+ entry (số liệu thứ cấp, không chính thức từ EDRDG) | Trung bình-cao: cần tự viết ETL XML lớn; **không có tiếng Việt** |
| [`dreamofi/yomichan-Vietnamese-dictionary`](https://github.com/dreamofi/yomichan-Vietnamese-dictionary) | **Không rõ** — không có file LICENSE, nguồn "ODVP" không trích dẫn cụ thể | ZIP chứa JSON định dạng Yomitan (từ SQLite) | Không có số liệu chính thức | Trung bình: cần ETL từ JSON Yomitan sang schema riêng; rủi ro pháp lý cao |
| [`trungnt2910/KanjiDictVN`](https://github.com/trungnt2910/KanjiDictVN) | MIT (phần thêm) + CC BY-SA 4.0 (lõi KANJIDIC kế thừa EDRDG); nguồn hvdic.thivien.net **không rõ license** | ZIP chứa `index.json` (định dạng Yomitan) | 10.350 mục Hán tự (số liệu từ README) | Thấp-trung bình: chỉ áp dụng cho phần Kanji, cần ETL JSON |
| [Wiktionary tiếng Việt qua kaikki.org](https://kaikki.org/viwiktionary/index.html) | CC-BY-SA + GFDL (license chuẩn Wiktionary) | JSON/JSONL (đã trích xuất sẵn bởi wiktextract) | ~12.917 senses tiếng Nhật (số liệu từ kaikki.org, đối chiếu ~8.334 trang trên vi.wiktionary.org) | **Thấp** — JSON có cấu trúc sẵn, không cần tự parse wikitext |
| [Kiwix ZIM (vi/ja wiktionary)](https://lb.download.kiwix.org/zim/wiktionary/) | Như trên (CC-BY-SA + GFDL, cùng nguồn Wiktionary) | ZIM (đóng gói offline HTML) | Cùng nội dung như bản kaikki.org, đóng gói khác | Cao hơn kaikki.org — phải tự đọc/trích xuất ZIM, không có JSON sẵn |
| [KANJIDIC2](https://www.edrdg.org/wiki/KANJIDIC_Project.html) | CC BY-SA 4.0, **thương mại OK**, có đồng tác giả riêng cho một số trường (SKIP, Four Corner, Hàn...) ([license](http://www.edrdg.org/edrdg/licence.html)) | XML | 13.108 ký tự Kanji (số liệu đối chiếu nhiều nguồn kỹ thuật cộng đồng, không phải một câu duy nhất trên edrdg.org) | Trung bình: ETL XML nhưng file nhỏ hơn JMdict nhiều; **không có tiếng Việt** |
| [`scriptin/jmdict-simplified`](https://github.com/scriptin/jmdict-simplified) | EDRDG License (JMdict/JMnedict/RADKFILE-KRADFILE) + CC BY-SA 4.0 (Kanjidic); thương mại OK theo license gốc | JSON (release hàng tuần) | Bằng JMdict/KANJIDIC2 gốc, không thêm tiếng Việt | **Thấp** — JSON dựng sẵn, không cần tự parse XML; nhưng vẫn không có tiếng Việt |
| [`yomidevs/jmdict-yomitan`](https://github.com/yomidevs/jmdict-yomitan) | MIT (code) + CC BY-SA 4.0 (dictionary) | JSON (định dạng Yomitan) | Bằng JMdict/KANJIDIC2 gốc | Thấp-trung bình (định dạng đặc thù Yomitan); không có tiếng Việt |
| [Google Cloud Translation API](https://cloud.google.com/translate/pricing) | Dịch vụ trả phí, có gói miễn phí 500k ký tự/tháng; điều khoản dịch vụ riêng (không phải Creative Commons) | REST API | N/A (dịch theo yêu cầu, không phải dataset tĩnh) | Thấp về mặt kỹ thuật (gọi API), nhưng phát sinh chi phí vận hành liên tục và rủi ro chất lượng dịch máy |
| [DeepL API](https://support.deepl.com/hc/en-us/articles/360021200939-DeepL-API-plans) | Dịch vụ trả phí; gói Free/Pro cũ ngừng bán cho khách mới (khoảng giữa 2026), hiện là Developer/Growth | REST API | N/A | Thấp về kỹ thuật; cần tự xác minh lại hỗ trợ cặp Nhật-Việt và giá tại thời điểm triển khai — **không tìm thấy nguồn đáng tin cậy xác nhận trong lần nghiên cứu này** |

---

## Mục 4 — Khuyến nghị và rủi ro

### Khuyến nghị cho MVP

1. **Không có một dataset Nhật-Việt "sẵn sàng import ngay, license rõ ràng, quy mô lớn" nào được tìm thấy.** Tình huống thực tế là:
   - Nguồn từ vựng lớn nhất, chất lượng cao nhất, license rõ ràng nhất (JMdict, ~200k+ entry, CC BY-SA 4.0, thương mại OK) — **không có tiếng Việt**.
   - Nguồn duy nhất có sẵn tiếng Việt ghép với JMdict/KANJIDIC2 (`dreamofi/yomichan-Vietnamese-dictionary`) — **không có license, nguồn gốc dữ liệu mập mờ** ("ODVP" không trích dẫn được).
   - Nguồn có tiếng Việt, license rõ ràng, dễ tích hợp nhất (Wiktionary tiếng Việt qua kaikki.org) — **quy mô nhỏ** (~12.9k sense tiếng Nhật, so với 200k+ của JMdict).

2. **Đề xuất kiến trúc dữ liệu 2 lớp cho MVP:**
   - **Lớp nền (từ vựng + Kanji)**: import **JMdict** (headword, reading, part-of-speech, ví dụ câu nếu có) và **KANJIDIC2** (bộ thủ, số nét, on/kun, JLPT, grade) làm nguồn "sự thật" về từ vựng/Kanji tiếng Nhật — dùng bản JSON dựng sẵn của `scriptin/jmdict-simplified` để giảm công ETL XML.
   - **Lớp nghĩa tiếng Việt**: 
     - Với phần chồng lấn (~12.9k sense tiếng Nhật có trong Wiktionary tiếng Việt), lấy trực tiếp nghĩa tiếng Việt đã có sẵn (chất lượng do con người biên soạn, license CC-BY-SA rõ ràng) — đây là dữ liệu "sạch" nhất về mặt pháp lý và chất lượng.
     - Với phần còn lại (đa số entry của JMdict không có trong Wiktionary tiếng Việt), dùng **dịch máy** (Google Cloud Translation hoặc DeepL, tùy giá/độ chính xác thực tế lúc triển khai) để tạo nghĩa tiếng Việt tạm thời, và **gắn cờ rõ ràng trong schema** (ví dụ trường `source = "machine_translated"` vs `source = "wiktionary_vi"` vs `source = "human_reviewed"`) để về sau có thể ưu tiên rà soát/sửa thủ công.
   - KANJIDIC2 phần tiếng Việt: cân nhắc dùng lại ý tưởng của `trungnt2910/KanjiDictVN` (âm Hán-Việt) nhưng nên **tự lấy dữ liệu Hán-Việt từ nguồn có license rõ ràng hơn** (ví dụ tự tổng hợp bảng âm Hán-Việt công khai/học thuật) thay vì phụ thuộc trực tiếp vào crawl từ hvdic.thivien.net mà chưa rõ điều khoản sử dụng.

3. **Vì sao không nên dùng thẳng `dreamofi/yomichan-Vietnamese-dictionary` cho sản phẩm công khai**: thiếu LICENSE, nguồn "ODVP" không kiểm chứng được — nếu dữ liệu "ODVP" thực chất là crawl lại từ một app/website thương mại khác mà chưa xin phép, việc tái sử dụng có thể vi phạm quyền sở hữu của bên thứ ba đó (rủi ro không nằm ở EDRDG mà ở nguồn "ODVP" ẩn danh). Có thể dùng để **tham khảo/đối chiếu nội bộ** trong giai đoạn phát triển, nhưng không nên đưa thẳng vào dữ liệu production của một sản phẩm public.

### Rủi ro pháp lý cần lưu ý

- **Nghĩa vụ ghi công của EDRDG (JMdict/KANJIDIC2) rất cụ thể và dễ bị bỏ sót**: với một "web-based dictionary server" (đúng loại hình dự án này), EDRDG yêu cầu ghi công **ở chân mỗi trang kết quả tra từ**, không chỉ ở trang "About" — cần thiết kế UI/footer từ đầu để tuân thủ, trích nguyên văn: *"the acknowledgement must be made on each screen display, e.g. in the form of a message at the foot of the screen or page"* ([license](http://www.edrdg.org/edrdg/licence.html)).
- **Nghĩa vụ cập nhật định kỳ**: license yêu cầu cập nhật dữ liệu JMdict/KANJIDIC2 **tối thiểu mỗi tháng một lần**, nếu không sẽ bị coi là vi phạm license — cần lên kế hoạch pipeline cập nhật dữ liệu định kỳ (cron job re-import) ngay từ giai đoạn thiết kế, không chỉ import một lần rồi bỏ quên.
- **Bản dịch máy từ JMdict/KANJIDIC2 vẫn là derivative work của dữ liệu CC BY-SA 4.0**: theo điều khoản ShareAlike, sản phẩm phái sinh (bảng nghĩa tiếng Việt do dịch máy tạo ra từ gloss tiếng Anh của JMdict) về nguyên tắc **vẫn phải giữ license tương thích CC BY-SA** và vẫn phải ghi công EDRDG, **không được tuyên bố bản quyền độc quyền lên phần nghĩa đã dịch** — trích: *"Users of material from the files must NOT claim copyright over that material."* Điều này ảnh hưởng trực tiếp đến việc dự án có thể "đóng" hoàn toàn dữ liệu từ điển của mình hay không (về nguyên tắc là không, nếu dữ liệu gốc bắt nguồn từ JMdict/KANJIDIC2).
- **Chất lượng dịch máy Nhật→Việt cho mục đích từ điển**: dịch máy (Google/DeepL) dịch câu văn cảnh tốt, nhưng gloss từ điển JMdict thường là các mảnh nghĩa ngắn, nhiều nghĩa đa dạng theo POS/sắc thái (ví dụ "counter for X", thành ngữ, từ cổ...) — dịch máy dễ tạo nghĩa sai lệch/thiếu sắc thái nếu dịch máy móc từng dòng gloss tiếng Anh mà không có ngữ cảnh câu ví dụ. Khuyến nghị: ưu tiên dịch **kèm ví dụ câu** (nếu JMdict có `example`) để tăng độ chính xác, và hiển thị rõ ràng cho người dùng biết nghĩa nào là "dịch máy, chưa kiểm duyệt" để tránh hiểu lầm mức độ tin cậy.
- **hvdic.thivien.net và "ODVP"**: cả hai nguồn dữ liệu tiếng Việt "phi EDRDG" tìm được đều **không có trang điều khoản sử dụng công khai đã kiểm chứng được** — đây là khoảng trống thông tin, ghi nhận rõ là "không tìm thấy nguồn đáng tin cậy" cho license của hai nguồn này, cần liên hệ trực tiếp chủ sở hữu nếu muốn dùng chính thức.
- **DeepL**: gói giá đã thay đổi giữa 2026 (Free/Pro cũ ngừng bán khách mới), và **chưa xác minh được chắc chắn việc DeepL hỗ trợ cặp Nhật→Việt** trong lần nghiên cứu này do lỗi kết nối khi fetch trang chính thức — cần tự kiểm tra lại trước khi chọn DeepL thay vì Google Cloud Translation.

---

*Ngày nghiên cứu: 2026-09-08*
