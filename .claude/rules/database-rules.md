# Quy tắc phát triển Database

Schema từ vựng (mục 7) được chuẩn hóa theo cấu trúc `words → word_readings → word_senses → word_examples` thay vì gộp mọi nghĩa vào một cột JSON — quyết định này bám sát cấu trúc dữ liệu gốc của JMdict (nguồn dữ liệu chính đã chọn): một từ có thể có nhiều cách đọc, và mỗi nghĩa (sense) có loại từ riêng chứ không dùng chung một loại từ cho cả từ.

## 1. Naming Conventions
- **Table names**: Số nhiều, chữ thường, phân cách bằng underscore (`words`, `word_readings`, `word_senses`, `word_examples`, `users`)
- **Column names**: Chữ thường, phân cách bằng underscore (`headword_kanji`, `jlpt_level`)
- **Primary key**: `id` (auto-increment)
- **Foreign key**: `[table]_id` (ví dụ: `word_id`, `sense_id`, `user_id`)
- **Timestamps**: `created_at`, `updated_at`

## 2. Data Types (SQL Server)
- **String**: `NVARCHAR(n)` cho Unicode (tiếng Nhật, tiếng Việt)
- **Integer**: `INT`
- **Boolean**: `BIT`
- **DateTime**: `DATETIME2`
- **JSON**: `NVARCHAR(MAX)` với `JSON` constraint

## 3. Constraints
- **NOT NULL**: Cho các trường bắt buộc
- **UNIQUE**: Cho trường `email`, `username`
- **CHECK**: Cho giá trị có giới hạn (ví dụ: `jlpt_level IN ('N5','N4','N3','N2','N1')`)
- **FOREIGN KEY**: Cho quan hệ giữa các bảng

## 4. Indexes (Tối ưu hiệu năng)
```sql
-- Index cho tìm kiếm nhanh trên headword (phục vụ prefix match + autocomplete)
CREATE INDEX idx_words_headword_kanji ON words(headword_kanji);
CREATE INDEX idx_words_headword_kana ON words(headword_kana);
CREATE INDEX idx_words_romaji ON words(romaji);

-- Index cho foreign keys
CREATE INDEX idx_word_readings_word_id ON word_readings(word_id);
CREATE INDEX idx_word_senses_word_id ON word_senses(word_id);
CREATE INDEX idx_word_examples_word_id ON word_examples(word_id);
```

Tra theo nghĩa tiếng Việt (`word_senses.vietnamese_meaning`) là tìm-trong-đoạn-văn-bản chứ không phải prefix match trên một từ ngắn, nên B-tree index thường không phù hợp — dùng **SQL Server Full-Text Search** (built-in, không cần hạ tầng ngoài như Elasticsearch, khớp quyết định đã chốt) thay vì `CREATE INDEX` thường cho cột này.

## 5. Migration Strategy
- Giai đoạn dev: Dùng `spring.jpa.hibernate.ddl-auto=update`
- Production: KHÔNG DÙNG `update` - chuyển sang Flyway hoặc Liquibase
- Migration files: `V1__initial_schema.sql`, `V2__add_user_table.sql`

## 6. Query Optimization
- Luôn dùng LIMIT/TOP cho kết quả tìm kiếm
- Tránh `SELECT *` - chỉ lấy các cột cần thiết
- Sử dụng JOIN thay vì N+1 queries
- Cache các query thường xuyên (Redis)

## 7. Sample Schema (Words)

```sql
-- Từ (entry gốc). jmdict_entry_seq lưu lại ent_seq gốc từ JMdict để đối chiếu
-- khi chạy job cập nhật dữ liệu định kỳ hàng tháng (bắt buộc theo license JMdict/EDRDG).
CREATE TABLE words (
    id INT PRIMARY KEY IDENTITY(1,1),
    jmdict_entry_seq INT NULL,
    headword_kanji NVARCHAR(255) NULL,      -- NULL nếu từ chỉ viết bằng kana, không có dạng kanji
    headword_kana NVARCHAR(255) NOT NULL,
    romaji NVARCHAR(255) NOT NULL,
    jlpt_level NCHAR(2) CHECK (jlpt_level IN ('N5','N4','N3','N2','N1')),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Các cách đọc/dạng viết thay thế cho cùng một từ (ví dụ okurigana khác nhau).
CREATE TABLE word_readings (
    id INT PRIMARY KEY IDENTITY(1,1),
    word_id INT NOT NULL FOREIGN KEY REFERENCES words(id),
    kanji_form NVARCHAR(255) NULL,
    kana_form NVARCHAR(255) NOT NULL,
    romaji NVARCHAR(255) NOT NULL,
    is_primary BIT NOT NULL DEFAULT 0
);

-- Mỗi nghĩa riêng biệt của từ — loại từ gắn theo TỪNG nghĩa, không gắn cho cả word,
-- vì một từ có thể vừa là danh từ vừa là động từ tùy nghĩa đang dùng.
CREATE TABLE word_senses (
    id INT PRIMARY KEY IDENTITY(1,1),
    word_id INT NOT NULL FOREIGN KEY REFERENCES words(id),
    sense_order INT NOT NULL,
    word_type NVARCHAR(50) NOT NULL CHECK (word_type IN
        ('noun','verb','adjective','adverb','particle','conjunction','interjection','numeral','other')),
    vietnamese_meaning NVARCHAR(1000) NOT NULL,
    meaning_source NVARCHAR(20) NOT NULL CHECK (meaning_source IN ('wiktionary','machine_translated','manual')),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Câu ví dụ — CHỈ từ Tatoeba/ALT (câu người dịch thật), không dùng dịch máy.
-- Gắn ở cấp WORD (không phải cấp sense): việc xác định một câu Tatoeba/ALT minh họa
-- CHÍNH XÁC nghĩa nào trong nhiều nghĩa của từ đòi hỏi gán nhãn NLP mà nguồn dữ liệu
-- không cung cấp sẵn — gắn theo word là mức khả thi thực tế khi ETL.
CREATE TABLE word_examples (
    id INT PRIMARY KEY IDENTITY(1,1),
    word_id INT NOT NULL FOREIGN KEY REFERENCES words(id),
    japanese_sentence NVARCHAR(MAX) NOT NULL,
    vietnamese_sentence NVARCHAR(MAX) NOT NULL,
    source NVARCHAR(20) NOT NULL CHECK (source IN ('tatoeba','alt')),
    source_id NVARCHAR(100) NULL   -- id câu gốc bên Tatoeba/ALT, phục vụ ghi công đúng theo license
);
```

`word_type` lưu mã tiếng Anh ổn định (không lưu thẳng nhãn tiếng Việt) — tầng hiển thị (frontend) ánh xạ mã này sang nhãn tiếng Việt đơn giản (`noun` → "danh từ", `verb` → "động từ"...), giữ dữ liệu độc lập với ngôn ngữ hiển thị.

`meaning_source = 'machine_translated'` là cột dùng để hiển thị nhãn "dịch tự động" trên UI theo quyết định đã chốt (hiển thị công khai kèm cảnh báo, không ẩn/không cần admin duyệt trước ở MVP).
