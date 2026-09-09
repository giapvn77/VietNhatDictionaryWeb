# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Ngôn ngữ giao tiếp
- **Ngôn ngữ ưu tiên:** Tiếng Việt
- Tất cả các câu trả lời, giải thích, và đề xuất đều bằng tiếng Việt.
- Mã nguồn, tên biến, tên hàm vẫn giữ bằng tiếng Anh theo chuẩn lập trình.
- Comment trong code có thể viết bằng tiếng Việt hoặc tiếng Anh (tùy ngữ cảnh).

## Quy tắc làm việc bắt buộc

- **TUYỆT ĐỐI KHÔNG TỰ Ý VIẾT CODE:** Đây là quy tắc quan trọng nhất. Trước khi viết bất kỳ dòng code nào (bao gồm sửa file, tạo file mới, chạy lệnh build), **luôn luôn thông báo kế hoạch và xin xác nhận trước**.
- **Bắt đầu bằng câu hỏi:** Với mọi yêu cầu, ưu tiên làm rõ bằng câu hỏi trước khi implement — ví dụ: "Bạn muốn xây dựng tính năng này như thế nào?", "Endpoint API nên trả về dữ liệu gì?", "Có ràng buộc logic nào đặc biệt không?".
- **Viết test trước (TDD):** Với backend (Java/Spring Boot), ưu tiên viết unit test cho service/repository trước khi viết logic thực tế.
- **Đề xuất, không ra lệnh:** Đưa ra các phương án kèm ưu/nhược điểm (ví dụ: "Có thể implement theo cách A hoặc B. Cách A có ưu điểm X, cách B có ưu điểm Y. Bạn chọn hướng nào?") rồi chờ phản hồi thay vì tự chọn.
- **Backend:** Tuân thủ chặt cấu trúc package `controller/service/repository/entity/dto`. Logic nghiệp vụ nằm ở `service`.
- **Quy tắc API:** Xem @.claude/rules/api-rules.md (RESTful conventions, cấu trúc request/response, HTTP status codes, security, naming).
- **Quy tắc Database:** Xem @.claude/rules/database-rules.md (naming conventions, data types, constraints, indexes, migration strategy).
- **Frontend:** Tạm thời chỉ làm việc ở mức component/UI để khớp với API. Không tự ý cài thêm thư viện mới mà chưa thông báo trước.
- **Trang tham khảo (mazii.net):** Chỉ dùng để lấy ý tưởng luồng người dùng (trang chủ có ô tìm kiếm, cách hiển thị kết quả chi tiết...) và các loại thông tin từ vựng cần có. Code và logic backend được thiết kế độc lập, không sao chép.

## Tổng quan dự án

Đây là website từ điển Việt-Nhật, lấy cảm hứng về giao diện và tính năng từ [mazii.net](https://mazii.net). Dự án đang ở giai đoạn khởi tạo (scaffold) — backend và frontend mới được dựng khung, chưa có logic nghiệp vụ (domain logic) thực sự.

> **Lưu ý:** mazii.net chặn truy cập tự động (HTTP 403) nên chưa thể phân tích trực tiếp cấu trúc/tính năng của trang này. Danh sách tính năng dự kiến ở phần "Định hướng tính năng" bên dưới dựa trên hiểu biết chung về các từ điển Nhật-Việt tương tự — cần đối chiếu lại với mazii.net (qua trình duyệt thủ công) trước khi coi là đặc tả chính thức.

## Kiến trúc tổng thể

Repo này là **một repo git duy nhất chứa hai ứng dụng độc lập**, chạy như hai tiến trình riêng biệt khi phát triển:

```
VietNhatDictionaryWeb/
├── backend/     # REST API — Java 17 + Spring Boot (Maven)
└── frontend/    # SPA — React 19 + TypeScript (Vite)
```

- `frontend` gọi `backend` qua HTTP dưới tiền tố `/api`.
- Khi chạy `npm run dev`, Vite dev server (cổng 5173) **proxy mọi request `/api/*` sang `http://localhost:8080`** (cấu hình tại [frontend/vite.config.ts](frontend/vite.config.ts)) — nhờ vậy code frontend luôn gọi đường dẫn tương đối `/api/...` mà không cần lo CORS khi dev.
- Backend cũng tự khai báo CORS cho phép origin `http://localhost:5173` tại [backend/src/main/java/com/vietnhat/dictionary/config/CorsConfig.java](backend/src/main/java/com/vietnhat/dictionary/config/CorsConfig.java) — **phải thêm origin của domain production vào đây khi deploy**, nếu không frontend production sẽ bị chặn CORS.
- Package Java theo domain-layer chuẩn Spring: `com.vietnhat.dictionary.{controller,service,repository,entity,dto,config}`. Hiện mới có `controller` (một `HealthController` placeholder) và `config` (CORS) — các package `service`/`repository`/`entity`/`dto` sẽ được tạo khi bắt đầu implement nghiệp vụ từ điển thật.

## Lệnh thường dùng

### Backend (chạy trong `backend/`)

```bash
./mvnw spring-boot:run          # chạy dev server, mặc định cổng 8080
./mvnw test                     # chạy toàn bộ test
./mvnw -Dtest=ClassName#methodName test   # chạy một test method cụ thể
./mvnw clean package            # build ra file jar (target/*.jar)
```

Trên Windows dùng `mvnw.cmd` thay cho `./mvnw` nếu không chạy trong Git Bash.

**Lưu ý môi trường:** máy dev hiện tại có JDK không tin cậy chứng chỉ TLS của Maven Central (`PKIX path building failed`) dù `curl`/trình duyệt truy cập bình thường — dấu hiệu điển hình của phần mềm diệt virus/proxy công ty chặn SSL mà chưa được thêm vào cacerts của JDK. Nếu gặp lỗi này, đây **không phải lỗi code** — cần import root CA của phần mềm chặn SSL vào `$JAVA_HOME/lib/security/cacerts`, hoặc chạy trên mạng/máy không bị chặn.

### Frontend (chạy trong `frontend/`)

```bash
npm install       # cài dependency
npm run dev       # dev server tại http://localhost:5173
npm run build     # tsc -b && vite build → output vào dist/
npm run lint      # oxlint (không phải eslint — Vite scaffold gần đây dùng oxlint mặc định)
npm run preview   # preview bản build production
```

Không có lệnh test riêng — frontend hiện chưa có test runner nào được cài (chưa có Vitest/Jest). Cần bổ sung khi bắt đầu viết component/logic thật.

### Chạy cả hai cùng lúc (local dev)

Cần **hai terminal riêng**: một chạy `./mvnw spring-boot:run` trong `backend/`, một chạy `npm run dev` trong `frontend/`. Không có script gộp (concurrently/turborepo) ở root — nếu cần, đây là điểm hợp lý để bổ sung sau.

## Cấu hình cơ sở dữ liệu (SQL Server)

Kết nối khai báo tại [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties), đọc từ biến môi trường với giá trị mặc định dùng cho local dev:

| Biến môi trường | Mặc định |
|---|---|
| `DB_HOST` | `localhost` |
| `DB_PORT` | `1433` |
| `DB_NAME` | `vietnhat_dictionary` |
| `DB_USER` | `sa` |
| `DB_PASSWORD` | `changeme` |
| `DB_ENCRYPT` | `true` |
| `DB_TRUST_CERT` | `true` |

`spring.jpa.hibernate.ddl-auto=update` — Hibernate tự tạo/cập nhật schema từ entity, tiện cho giai đoạn đầu nhưng **không an toàn cho production**. Khi domain model ổn định, nên chuyển sang migration tool có version (Flyway hoặc Liquibase) thay vì để Hibernate tự sinh schema.

## Định hướng tính năng (tham khảo mazii.net)

Chưa implement — kết quả một phiên `/grill-me` đã chia tính năng thành 3 giai đoạn. Đối tượng chính: người Việt học tiếng Nhật (tra Nhật→Việt là chính); giao diện chỉ tiếng Việt ở Giai đoạn 1.

### Giai đoạn 1 (MVP)
- Tra từ Nhật↔Việt: nhập bằng kanji/hiragana/katakana/romaji/nghĩa tiếng Việt, match kiểu prefix + gợi ý tức thời (autocomplete).
- Trang chi tiết từ: nghĩa, loại từ (nhãn tiếng Việt đơn giản, ví dụ "danh từ"/"động từ"), cách đọc (kana + romaji), câu ví dụ. Câu ví dụ **chỉ** lấy từ Tatoeba/ALT (câu người dịch thật) — không dùng dịch máy cho câu ví dụ, để trống nếu chưa có nguồn thật.
- Không có phát âm audio, không có tài khoản người dùng ở giai đoạn này.
- Nguồn dữ liệu nghĩa: JMdict + KANJIDIC2 (nền) + Wiktionary tiếng Việt (overlay chỗ trùng) + dịch máy cho phần còn thiếu — hiển thị công khai ngay kèm nhãn "dịch tự động" (không ẩn, không cần duyệt trước). Chi tiết nghiên cứu: [docs/research/jp-vn-dictionary-data-sources.md](docs/research/jp-vn-dictionary-data-sources.md), [docs/research/example-sentences-data-sources.md](docs/research/example-sentences-data-sources.md).
- Nghĩa vụ pháp lý cần build trong MVP (license JMdict/EDRDG là CC BY-SA 4.0): chân trang ghi công JMdict/EDRDG (+ Tatoeba/ALT khi dùng câu ví dụ), và job cập nhật dữ liệu định kỳ tối thiểu hàng tháng.
- Sửa dữ liệu lỗi: qua script/SQL trực tiếp, chưa xây admin UI ở giai đoạn này.
- Schema: xem @.claude/rules/database-rules.md.

### Giai đoạn 2
- Tài khoản người dùng: đăng ký/đăng nhập (JWT, xem @.claude/rules/api-rules.md).
- Sổ tay từ vựng cá nhân (lưu từ yêu thích), lịch sử tra cứu.
- Flashcard để ôn tập từ đã lưu.
- Admin UI để duyệt/sửa các nghĩa bị gắn nhãn "dịch tự động" — dùng chung hạ tầng auth vừa xây cho tài khoản người dùng, thay vì xây riêng cho MVP rồi bỏ.

### Giai đoạn 3
- Tra Kanji riêng: bộ thủ, số nét, âm on/kun, cấp độ JLPT, từ ghép liên quan — **kèm tra Hán Việt** (dùng chung nguồn dữ liệu Kanji, ví dụ `KanjiDictVN`).
- Danh sách từ vựng/Kanji theo cấp độ JLPT (N5–N1).
- Tra cứu ngữ pháp theo mẫu câu/cấp độ.

**Trước khi implement**, nên mở mazii.net thủ công (hoặc site Nhật-Việt tương tự) để xác nhận/tinh chỉnh danh sách này — tránh giả định sai lệch tính năng thật của trang tham khảo.

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues; skills use the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context layout: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
