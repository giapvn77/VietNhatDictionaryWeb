# Nghiên cứu nguồn dữ liệu câu ví dụ (example sentences) Nhật-Việt

## Mục đích

Trang chi tiết từ ở MVP của website từ điển Việt-Nhật yêu cầu trường **câu ví dụ** (câu tiếng Nhật kèm bản dịch tiếng Việt) là bắt buộc cho mỗi từ. Tài liệu này khảo sát các nguồn dữ liệu mở/miễn phí có thể dùng để lấp trường này, xác minh trực tiếp qua WebFetch/WebSearch vào các trang nguồn chính thức (EDRDG, Tatoeba, NICT, Hugging Face, GitHub) trong phiên nghiên cứu ngày **2026-09-08** — không dựa vào trí nhớ/suy đoán không kiểm chứng. Mọi nhận định đều có trích dẫn link kèm theo; những điểm không xác minh được trực tiếp sẽ ghi rõ "không tìm thấy nguồn đáng tin cậy" hoặc "chỉ xác minh gián tiếp qua kết quả tìm kiếm, chưa fetch trực tiếp trang nguồn".

---

## Câu trả lời nhanh (executive summary)

1. **JMdict (bản chuẩn) không chứa câu ví dụ.** Có một biến thể riêng `JMdict_e_examp` (chỉ tiếng Anh, ~30.000/200.000+ entry) lấy câu ví dụ từ Tatoeba — không có tiếng Việt.
2. **Tatoeba** đúng là nguồn câu ví dụ đa ngôn ngữ mở phổ biến nhất, license mặc định **CC BY 2.0 FR**. Cặp câu **Nhật→Việt hiện có khoảng 11.251–14.336 cặp** (đo trực tiếp trên tatoeba.org ngày 2026-09-08, xem lưu ý về độ tin cậy của con số ở Mục 2). Đây là quy mô **nhỏ hơn nhiều** so với 200.000+ entry của JMdict.
3. Có thêm nguồn **ALT Parallel Corpus (NICT)** — ~20.000 cặp câu Nhật-Việt, license **CC BY 4.0** (thoáng hơn Tatoeba, không cần ghi công theo từng câu) — nhưng là câu tin tức (Wikinews), không phải câu ví dụ từ vựng đời thường.
4. Các nguồn lớn hơn (TED/WIT3, JW300, OpenSubtitles, Glosbe, QED) có sẵn cặp câu Nhật-Việt quy mô lớn hơn nhiều (hàng trăm nghìn) nhưng **license không phù hợp** (CC BY-NC-ND, "chỉ dùng nghiên cứu", hoặc không rõ ràng) — không khuyến nghị dùng trực tiếp.
5. **Phương án dịch máy khả thi**: model mở `Helsinki-NLP/opus-mt-ja-vi` (Apache 2.0, tự host được, BLEU ~20.3) có thể dùng để dịch số lượng lớn câu ví dụ Nhật-Anh (từ JMdict_e_examp hoặc toàn bộ Tatoeba JA-EN, quy mô lớn hơn nhiều) sang tiếng Việt.
6. **Khuyến nghị**: chiến lược lai — ưu tiên Tatoeba + ALT (câu người dịch thật) cho các từ có sẵn, dùng dịch máy (gắn nhãn "dịch tự động") để lấp các entry còn lại. Chi tiết ở Mục 5.

---

## 1. JMdict có tự chứa câu ví dụ không?

**Kết luận: KHÔNG.** JMdict bản chuẩn (`JMdict.xml`, `JMdict_e.xml`) không có trường câu ví dụ. Câu ví dụ chỉ tồn tại trong một **biến thể riêng** của file, và biến thể đó chỉ có tiếng Anh, không có tiếng Việt.

- Nguồn: [EDRDG mailing-list — "Re: Example sentences in JMdict" (Jim Breen, người duy trì dự án JMdict)](https://www.edrdg.org/jmdict_edict_list/2021/msg00041.html) — đã fetch trực tiếp. Breen viết (được tóm tắt/trích qua công cụ fetch): *"I have concentrated on using the collection of sentence pairs (now) in the Tatoeba project, which are linked at the entry level by systems such as WWWJDIC"* và *"The sentences would still come weekly from Tatoeba"* — xác nhận câu ví dụ **không nằm trong CSDL bảo trì gốc của JMdict** mà được sinh ra bằng cách liên kết với Tatoeba.
- Theo kết quả tìm kiếm đối chiếu (WebSearch, trích từ trang chỉ mục FTP của EDRDG — chưa fetch trực tiếp được trang này do lỗi chứng chỉ TLS của subdomain `ftp.edrdg.org`, xem ghi chú kỹ thuật cuối mục): file **`JMdict_e_examp.gz`** là *"the same Japanese and English file, but with example sentences included in about 30,000 entries"*, lấy từ Tanaka Corpus / Tatoeba Corpus.
- Đối chiếu thêm với [Wikipedia — JMdict](https://en.wikipedia.org/wiki/JMdict) (đã fetch trực tiếp): *"From June 2021, a version of JMdict includes example sentences selected from the Tatoeba Corpus."* — xác nhận đây là một **phiên bản/biến thể riêng**, không phải file JMdict chính.
- **Ý nghĩa cho dự án**: dù chọn dùng JMdict_e_examp làm nguồn câu ví dụ Nhật-Anh, biến thể này (a) chỉ tiếng Anh — vẫn cần dịch sang tiếng Việt bằng cách nào đó, và (b) chỉ phủ ~30.000/200.000+ entry của JMdict — không đủ cho toàn bộ từ điển.
- **Ghi chú kỹ thuật**: không fetch trực tiếp được `http://ftp.edrdg.org/pub/Nihongo/00INDEX.html` (lỗi `Hostname/IP does not match certificate's altnames`, do WebFetch tự nâng cấp HTTP→HTTPS và subdomain `ftp.edrdg.org` không có cert hợp lệ cho HTTPS) — thông tin về `JMdict_e_examp.gz` ở trên lấy từ đoạn trích trong kết quả WebSearch (Google index của trang đó), không phải fetch trực tiếp 100%. Độ tin cậy: cao (nội dung khớp nhất quán giữa 3 nguồn độc lập: mailing list, Wikipedia, kết quả search), nhưng khuyến nghị double-check lại link tải thực tế qua trình duyệt thường trước khi viết ETL.

---

## 2. Tatoeba Project — nguồn câu ví dụ đa ngôn ngữ mở phổ biến nhất

### 2.1 License

- Nguồn: [tatoeba.org/en/terms_of_use](https://tatoeba.org/en/terms_of_use) — đã fetch trực tiếp.
- License mặc định cho câu văn bản: **Creative Commons Attribution 2.0 France (CC-BY 2.0 FR)**. Trích: *"Tatoeba's technical infrastructure uses the default Creative Commons Attribution 2.0 France license (CC-BY 2.0 FR) for the use of textual sentences."*
- Điều kiện duy nhất là ghi công tác giả: *"The BY mention implies a single restriction on the use, reuse, modification and distribution of the sentence: a condition of attribution."*
- Một số câu có thể được đóng góp theo **CC0** (miễn ghi công) thay vì CC-BY mặc định — xác nhận qua trang [Using the Tatoeba Corpus for Your Own Projects](https://en.wiki.tatoeba.org/articles/show/using-the-tatoeba-corpus) và sự tồn tại của file export riêng **"Sentences (CC0)"** trên trang tải (xem 2.2). Trang tải cũng nói license áp dụng "CC BY 2.0 FR hoặc CC0 1.0, tuỳ nguồn gốc câu."
- **Ghi công theo lô lớn (bulk attribution)**: trang hướng dẫn chính thức khuyến nghị **ghi công theo từng thành viên/username đã đóng góp câu**, không phải chỉ một dòng credit chung chung: *"mention the username of each member whose content you are reusing, as well as the license they chose"* và *"tell your audience how you selected the sentences"* (nguồn: kết quả WebSearch trích từ trang hướng dẫn Tatoeba, đối chiếu với [Using the Tatoeba Corpus for Your Own Projects](https://en.wiki.tatoeba.org/articles/show/using-the-tatoeba-corpus) đã fetch trực tiếp). Điều này khả thi về mặt kỹ thuật vì file export `sentences_detailed.csv` có cột **Username** cho mỗi câu (xem 2.2) — có thể tự động hoá việc hiển thị "Nguồn: Tatoeba.org, đóng góp bởi `<username>`" cho mỗi câu ví dụ.
- Audio (phát âm) có license **khác và có thể hạn chế hơn** văn bản — không nằm trong phạm vi câu hỏi này nên chỉ ghi chú, không đi sâu.

### 2.2 Cách tải dữ liệu

- Nguồn: [tatoeba.org/en/downloads](https://tatoeba.org/en/downloads) — đã fetch trực tiếp.
- Định dạng: **TSV** (tab-separated values). Các file chính:
  - `sentences.csv`: id, mã ngôn ngữ, text.
  - `sentences_detailed.csv`: id, lang, text, **username**, ngày tạo, ngày sửa — quan trọng vì có cột username để tự động hoá ghi công.
  - `sentences_base.csv`: id, base (câu gốc hay câu dịch).
  - `sentences_CC0.csv`: danh sách riêng các câu thuộc license CC0 (dùng để lọc câu nào cần ghi công, câu nào không).
  - `links.csv`: id câu ↔ id câu dịch (dùng để nối cặp câu Nhật-Việt).
  - `jpn_indices.csv`: chỉ mục riêng cho tiếng Nhật (id câu, id nghĩa, text — có thể hữu ích để map câu ví dụ với entry từ vựng).
  - `sentences_with_audio.csv`: kèm cột **license** riêng cho từng file audio.
- **Tần suất cập nhật**: các file export sẵn được cập nhật **hàng tuần, thứ Bảy 6:30 UTC** — trích: *"The files provided below are updated every Saturday at 6:30 a.m. (UTC)."*
- **Không có file cặp ngôn ngữ dựng sẵn cho Nhật-Việt** (không giống một số cặp phổ biến như Anh-Nhật có sẵn trên manythings.org). Trang tải có **công cụ custom export** cho phép chọn "Sentence language" và "Translation language" riêng để tự sinh file cho một cặp ngôn ngữ cụ thể (kể cả jpn↔vie), nhưng đây là form POST nên không kiểm tra được chi tiết kỹ thuật đầu ra qua fetch tự động (HTTP 405 khi thử truy cập trực tiếp `/en/exports/add`). Cách khác: tự join `sentences_detailed.csv` (lọc lang=jpn và lang=vie) với `links.csv`.

### 2.3 Quy mô cặp câu Nhật-Việt cụ thể (jpn-vie)

Đo trực tiếp trên giao diện tìm kiếm tatoeba.org ngày 2026-09-08:

| Truy vấn | Kết quả hiển thị |
|---|---|
| [Search jpn → vie](https://tatoeba.org/en/sentences/search?from=jpn&to=vie) | "1,000 results out of **11,251** occurrences" |
| [Search vie → jpn](https://tatoeba.org/en/sentences/search?from=vie&to=jpn) | "1,000 results out of **14,336** occurrences" |
| [Tổng số câu tiếng Nhật trong Tatoeba](https://tatoeba.org/en/stats/sentences_by_language) | **249,174** câu |
| [Tổng số câu tiếng Việt trong Tatoeba](https://tatoeba.org/en/stats/sentences_by_language) | **33,192** câu |

**Lưu ý quan trọng về độ tin cậy của con số 11.251/14.336**: giao diện tìm kiếm của Tatoeba có phân biệt "direct translations" và "indirect translations" (câu được dịch bắc cầu qua ngôn ngữ thứ ba, ví dụ Nhật và Việt cùng là bản dịch độc lập của một câu tiếng Anh, không nhất thiết có ai trực tiếp đối chiếu Nhật↔Việt). Đã thử thêm tham số `trans_filter=limit` để lọc chỉ lấy dịch trực tiếp, kết quả trả về **vẫn là 11.251** — nhưng công cụ fetch (chạy qua một model tóm tắt tự động) không thể xác nhận chắc chắn rằng tham số này thực sự có hiệu lực lọc, nên **con số 11.251/14.336 có thể bao gồm cả bản dịch gián tiếp** và nên được xác minh lại thủ công qua trình duyệt hoặc qua file `links.csv` (chỉ chứa liên kết dịch trực tiếp) trước khi dùng để lập kế hoạch quy mô ETL.

**Đối chiếu với nguồn học thuật độc lập** để thấy xu hướng tăng trưởng: repo tổng hợp dữ liệu song ngữ [ngovinhtn/JaViCorpus](https://github.com/ngovinhtn/JaViCorpus) (dùng cho nghiên cứu dịch máy Nhật-Việt, biên soạn khoảng 2019-2020, dựa trên bản snapshot Tatoeba từ OPUS) ghi nhận thành phần "Tatoeba" của họ chỉ có **~2.000 cặp câu**. Con số này nhỏ hơn nhiều so với 11.251/14.336 đo được trực tiếp trên tatoeba.org hôm nay — cho thấy kho câu Nhật-Việt trên Tatoeba **đã tăng trưởng đáng kể** theo thời gian (cộng đồng người học tiếng Nhật/Việt tiếp tục đóng góp), đồng thời cũng là lời nhắc rằng **số liệu cần lấy tại thời điểm ETL thực tế, không nên hard-code** con số từ tài liệu nghiên cứu này.

**Kết luận Mục 2**: dù ~11-14 nghìn cặp câu là con số không nhỏ về giá trị tuyệt đối, nó vẫn chỉ phủ được một phần nhỏ nếu so với 200.000+ entry của JMdict — không đủ để làm nguồn DUY NHẤT cho một trường bắt buộc trên mọi trang chi tiết từ.

---

## 3. Các nguồn khác chứa câu ví dụ Nhật-Việt

### 3.1 Tanaka Corpus — KHÔNG có tiếng Việt, là tiền thân của phần Nhật-Anh trong Tatoeba

- Nguồn: [EDRDG Wiki — Tanaka Corpus](https://www.edrdg.org/wiki/Tanaka_Corpus.html) — đã fetch trực tiếp.
- Lịch sử: do GS. Yasuhito Tanaka (Đại học Hyogo) và sinh viên biên soạn, thu thập ~212.000 cặp câu Nhật-Anh (~2001), ban đầu thuộc **public domain**. Năm 2006, corpus được nhập vào dự án Tatoeba; tháng 9/2007 có ~150.000 cặp câu Nhật-Anh được import vào Tatoeba. Cuối 2009, Tatoeba đổi license phần này sang **CC-BY**.
- **Không có bằng chứng nào về thành phần tiếng Việt** trong Tanaka Corpus — đây thuần là nguồn Nhật↔Anh, hiện đã được "nuốt" vào và duy trì như một phần của Tatoeba (xem Mục 2). Không phải một nguồn Nhật-Việt độc lập.

### 3.2 JaViCorpus (github.com/ngovinhtn/JaViCorpus) — tổng hợp học thuật cho MT nghiên cứu, license hạn chế

- Nguồn: [github.com/ngovinhtn/JaViCorpus](https://github.com/ngovinhtn/JaViCorpus) — đã fetch trực tiếp README.
- Đây là repo tổng hợp **nhiều nguồn song ngữ Nhật-Việt** phục vụ nghiên cứu dịch máy (NMT), không phải một nguồn gốc tự sinh dữ liệu. Các thành phần và quy mô ghi trong README:

  | Nguồn | Số cặp câu | License |
  |---|---|---|
  | TED talks (WIT3) | ~106.000 | CC BY-NC-ND (xem 3.3) |
  | ALT (Asian Language Treebank) | ~20.000 | CC BY 4.0 (xem 3.4) |
  | Tatoeba (snapshot OPUS, ~2019-2020) | ~2.000 | CC BY 2.0 FR / CC0 (xem Mục 2; số liệu live 2026 lớn hơn nhiều) |
  | Glosbe | ~282.000 | Không rõ ràng, tổng hợp từ nhiều nguồn (xem 3.5) |
  | QED (phụ đề video giáo dục) | ~230.000 | Không xác minh được license cụ thể |
  | JW300 (tạp chí tôn giáo Nhân Chứng Giê-hô-va) | ~712.000 | Cấp phép nghiên cứu riêng của JW.org, nội dung tôn giáo |
  | OpenSubtitles (phụ đề phim/TV) | ~679.000 | Không có license rõ ràng, chất lượng dịch amateur/fansub biến thiên |

- **Quan trọng**: README của chính repo này tuyên bố rõ toàn bộ dataset tổng hợp **chỉ dùng cho mục đích nghiên cứu, không cho phép dùng thương mại**: *"These datasets are followed policies from their original source such as TED Talks (at https://www.ted.com/), Glosbe (at https://glosbe.com/), and so on. They are only used for research purposes and do not allow for any commercial usage."* → **Không dùng trực tiếp bundle này cho sản phẩm**, kể cả khi dự án không thu phí, vì một số nguồn con (TED, JW300) có điều khoản ràng buộc riêng biệt còn hạn chế hơn cả "phi thương mại".

### 3.3 TED Talks / WIT3 — quy mô lớn nhưng license chặn cả thương mại lẫn phái sinh

- Nguồn: kết quả WebSearch đối chiếu nhiều bài học thuật/trang NLP (chưa fetch trực tiếp trang wit3.fbk.eu do không tìm thấy URL còn hoạt động ổn định).
- License: **CC BY-NC-ND** (Attribution-NonCommercial-NoDerivatives) — do TED.com áp cho toàn bộ nội dung video/transcript của họ; WIT3 tuân theo license gốc này khi phân phối lại.
- Ý nghĩa: **NC** cấm dùng thương mại, **ND** (No-Derivatives) có thể còn cấm cả việc chỉnh sửa/định dạng lại câu để hiển thị trong app từ điển (dù WIT3 tự nhận họ chỉ đổi format container chứ không đổi nội dung — ranh giới "derivative" khi dùng lại từng câu riêng lẻ trong context khác là vùng xám pháp lý). **Không khuyến nghị** làm nguồn chính.

### 3.4 ALT Parallel Corpus (NICT) — license thoáng nhất trong các nguồn quy mô lớn, nhưng câu thuộc văn phong tin tức

- Nguồn: [Asian Language Treebank (ALT) Project — trang chính thức NICT](https://www2.nict.go.jp/astrec-att/member/mutiyama/ALT/) — đã fetch trực tiếp.
- 13 ngôn ngữ, xác nhận có cả **Japanese và Vietnamese**: *"Bengali, English, Filipino, Hindi, Bahasa Indonesia, Japanese, Khmer, Lao, Malay, Myanmar (Burmese), Thai, Vietnamese, Chinese (Simplified Chinese)."*
- **License**: *"Creative Commons Attribution 4.0 International (CC BY 4.0)"* — thoáng hơn Tatoeba, chỉ cần ghi công dự án (không bắt buộc ghi công theo từng câu/người dịch cụ thể như Tatoeba).
- **Quy mô**: được xây dựng bằng cách lấy mẫu ~20.000 câu từ English Wikinews rồi dịch sang các ngôn ngữ khác — *"sampling about 20,000 sentences from English Wikinews, and then these sentences were translated into the other languages."* Chia theo tập: 18.088 câu train + 1.000 dev + 1.018 test ≈ **20.106 câu** mỗi ngôn ngữ (bao gồm cả Nhật và Việt, cùng căn chỉnh theo ID câu gốc tiếng Anh).
- **Tải về**: file `ALT-Parallel-Corpus-20191206.zip` trên trang dự án.
- **Lưu ý nội dung**: đây là câu trích từ **tin tức Wikinews**, không phải câu ví dụ tiếng Nhật đời thường/giáo trình kiểu Tatoeba — phù hợp làm nguồn bổ sung số lượng, nhưng có thể không phải lựa chọn lý tưởng về mặt sư phạm (văn phong trang trọng, câu dài, chủ đề thời sự) cho một từ điển học tiếng Nhật phổ thông.

### 3.5 Glosbe và các nguồn khác

- Nguồn: kết quả WebSearch (chưa fetch trực tiếp trang điều khoản Glosbe).
- Glosbe là dictionary tổng hợp cộng đồng, license **không đồng nhất** — API "miễn phí tuỳ theo license của nguồn dữ liệu gốc" (nghĩa là license thay đổi theo từng câu/entry tuỳ nguồn Glosbe lấy về), không có một license bao trùm rõ ràng cho toàn bộ dữ liệu. **Không tìm thấy nguồn đáng tin cậy** xác nhận Glosbe cho phép tái sử dụng số lượng lớn (bulk) cho sản phẩm thương mại.
- Không tìm thấy nguồn mở nào khác chứa câu ví dụ Nhật-Việt ngoài các nguồn đã liệt kê ở Mục 2 và 3.

---

## 4. Phương án dịch máy (MT) làm fallback

Vì quy mô Tatoeba (jpn-vie trực tiếp, người dịch thật) chỉ ~11-14 nghìn cặp — nhỏ so với 200.000+ entry JMdict — phương án dịch máy từ câu ví dụ Nhật-Anh (nguồn lớn hơn nhiều) sang tiếng Việt là khả thi, tương tự cách xử lý đã chọn cho nghĩa từ ở nghiên cứu trước.

- Nguồn: [Helsinki-NLP/opus-mt-ja-vi trên Hugging Face](https://huggingface.co/Helsinki-NLP/opus-mt-ja-vi) — đã fetch trực tiếp.
- Đây là model dịch máy neural (kiến trúc transformer-align) dịch **thẳng Nhật→Việt** (không cần bắc cầu qua tiếng Anh), do nhóm Helsinki-NLP huấn luyện trên dữ liệu **Tatoeba Challenge** (tập dữ liệu đa ngôn ngữ lớn hơn nhiều so với chỉ phần jpn-vie trực tiếp), huấn luyện ngày 2020-06-17.
- **License: Apache 2.0** — cho phép dùng thương mại, tự host, không ràng buộc chia sẻ ngược (permissive).
- **Tự host được**: có thể chạy offline qua thư viện Hugging Face `transformers` (`AutoModelForSeq2SeqLM`), không cần gọi API trả phí liên tục — phù hợp cho một lần chạy batch ETL dịch hàng loạt câu ví dụ, thay vì gọi API mỗi lần người dùng xem trang.
- **Chất lượng**: BLEU 20.3, chrF 0.380 trên tập test Tatoeba — mức **trung bình** (dùng được nhưng có sai sót đáng kể so với dịch người), nên nếu dùng, khuyến nghị gắn nhãn rõ "câu dịch tự động" trong UI để không đánh lừa người học, và cân nhắc lấy nguồn Nhật-Anh chất lượng cao (JMdict_e_examp, ~30.000 entry đã qua chọn lọc của EDRDG) làm input trung gian nếu cần, hoặc dịch thẳng Nhật→Việt bằng model trên.
- Không xác minh so sánh với các model/API khác (Google Translate, DeepL — DeepL hiện chưa hỗ trợ tiếng Việt theo hiểu biết chung, chưa kiểm chứng lại trong phiên nghiên cứu này) — nằm ngoài phạm vi câu hỏi.

---

## 5. Khuyến nghị cuối cùng

### 5.1 Chiến lược đề xuất: kết hợp nhiều tầng nguồn theo độ tin cậy giảm dần

1. **Tầng 1 (ưu tiên cao nhất — câu người dịch thật, Nhật-Việt trực tiếp)**: Tatoeba (CC BY 2.0 FR / CC0) — ưu tiên vì văn phong câu đời thường phù hợp học từ vựng, cập nhật hàng tuần, có thể lọc theo tag chất lượng (`@change`, rating). Bổ sung ALT Parallel Corpus (CC BY 4.0) cho các entry chưa có câu Tatoeba, dù văn phong tin tức có phần khô khan hơn.
2. **Tầng 2 (fallback — dịch máy)**: với các entry JMdict không có câu ở Tầng 1, dịch câu ví dụ tiếng Anh (từ `JMdict_e_examp`, CC BY-SA 4.0, ~30.000 entry) hoặc trực tiếp câu Nhật trong Tatoeba JA-EN (quy mô lớn hơn) sang tiếng Việt bằng model `opus-mt-ja-vi` (Apache 2.0) hoặc tương đương, **gắn nhãn rõ ràng "dịch tự động"** trong giao diện.
3. **Không dùng**: JaViCorpus dạng bundle, TED/WIT3, JW300, OpenSubtitles, Glosbe, QED làm nguồn trực tiếp — do license "chỉ nghiên cứu"/CC BY-NC-ND/không rõ ràng, rủi ro pháp lý nếu đưa vào sản phẩm công khai (kể cả phi lợi nhuận, vì một số điều khoản không phân biệt "phi lợi nhuận" với "sử dụng lại/phân phối lại").

### 5.2 Ràng buộc ghi công (attribution) cần lưu ý theo từng nguồn

| Nguồn | License | Ghi công cần thiết |
|---|---|---|
| Tatoeba | CC BY 2.0 FR (mặc định) / CC0 (một phần câu) | **Theo từng câu**: cần hiển thị/liên kết username người đóng góp (lấy từ cột `Username` trong `sentences_detailed.csv`), trừ câu nằm trong danh sách CC0 (không bắt buộc ghi công). Nên có dòng "Nguồn: Tatoeba.org, đóng góp bởi `<username>`" kèm link, theo đúng khuyến nghị chính thức của Tatoeba. |
| ALT Parallel Corpus | CC BY 4.0 | Ghi công **ở cấp dự án** (credit NICT/ALT trong trang "Nguồn dữ liệu" hoặc footer) — không cần ghi công theo từng câu. |
| JMdict_e_examp (nếu dùng làm input dịch máy) | CC BY-SA 4.0 (EDRDG) | Theo license EDRDG đã xác minh ở nghiên cứu trước: phải ghi công **trên mỗi màn hình hiển thị** nội dung phái sinh từ dữ liệu EDRDG, và **ShareAlike** có thể yêu cầu áp cùng license (hoặc license tương thích) lên phần dữ liệu phái sinh — đây là câu hỏi pháp lý cần cân nhắc thêm (liệu việc dịch máy + hiển thị câu ví dụ có cấu thành "derivative work" theo nghĩa ShareAlike hay không), **không tự đưa ra kết luận chắc chắn trong tài liệu này**, khuyến nghị xin ý kiến pháp lý nếu triển khai sản phẩm thương mại. |
| opus-mt-ja-vi | Apache 2.0 | Ghi công đơn giản (tên model + license) trong tài liệu kỹ thuật/about, không có ràng buộc ShareAlike. |

### 5.3 Độ khó tích hợp (ETL)

- **Tatoeba**: **trung bình**. Tải `sentences_detailed.csv` + `links.csv` (hoặc dùng công cụ custom export cho cặp jpn/vie) hàng tuần → lọc theo `lang=jpn`/`lang=vie` → join qua `links.csv` để ra cặp câu → cross-check với `sentences_CC0.csv` để xác định câu nào cần ghi công. Cần đồng bộ lại định kỳ (Tatoeba khuyến nghị cập nhật thường xuyên vì lỗi được sửa liên tục).
- **ALT Parallel Corpus**: **trung bình**, nhưng **chưa xác minh sâu cấu trúc file zip thực tế** (chỉ xác minh trang mô tả, chưa tải và kiểm tra định dạng file bên trong `ALT-Parallel-Corpus-20191206.zip`) — khuyến nghị tải thử và kiểm tra định dạng (khả năng cao là file text căn chỉnh theo ID câu, dạng phổ biến trong các bộ NICT) trước khi lên kế hoạch ETL chi tiết.
- **Dịch máy (opus-mt-ja-vi)**: **thấp-trung bình về mặt kỹ thuật dịch, nhưng cần thêm một pipeline riêng ngoài Java**. Model chạy qua Python (Hugging Face `transformers`), không tích hợp trực tiếp vào backend Spring Boot (Java) — khuyến nghị chạy như **script batch offline riêng** (Python) để dịch trước và nạp kết quả vào SQL Server qua CSV/SQL insert, không phải một dependency runtime của ứng dụng Java.

---

## Ngày nghiên cứu

Toàn bộ thông tin trong tài liệu này được xác minh qua WebFetch/WebSearch trực tiếp vào các trang nguồn (edrdg.org, tatoeba.org, en.wiki.tatoeba.org, nict.go.jp, huggingface.co, github.com, en.wikipedia.org) trong phiên nghiên cứu ngày **2026-09-08**. Các con số về quy mô dữ liệu (đặc biệt là số cặp câu Tatoeba jpn-vie) có thể thay đổi theo thời gian do đây là dữ liệu cộng đồng cập nhật liên tục — cần đo lại tại thời điểm triển khai ETL thực tế, không nên hard-code các con số trong tài liệu này vào code hoặc tài liệu đặc tả lâu dài.
