# Quy tắc phát triển API

## 1. Cấu trúc endpoint
- Tuân theo RESTful conventions
- Sử dụng danh từ số nhiều cho resource: `/api/words`, `/api/users`
- Version API trong URL: `/api/v1/words`

## 2. Request & Response
- **Request**: Sử dụng DTOs (Data Transfer Objects) cho validation
- **Response**: Luôn có cấu trúc chuẩn:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Thành công",
    "timestamp": "2024-01-01T00:00:00Z"
  }
  ```
- **Error Response**:
  ```json
  {
    "success": false,
    "error": {
      "code": "NOT_FOUND",
      "message": "Không tìm thấy từ vựng"
    },
    "timestamp": "2024-01-01T00:00:00Z"
  }
  ```

## 3. HTTP Status Codes
- `200 OK`: Thành công
- `201 Created`: Tạo mới thành công
- `400 Bad Request`: Lỗi validation
- `404 Not Found`: Không tìm thấy resource
- `500 Internal Server Error`: Lỗi server

## 4. Security
- **Authentication**: JWT token trong header `Authorization: Bearer <token>`
- **Validation**: Luôn validate input với Jakarta Validation
- **SQL Injection**: Sử dụng PreparedStatement hoặc JPA

## 5. Naming Conventions
- **Endpoint**: chữ thường, phân cách bằng dấu gạch ngang (`/user-profile`)
- **DTOs**: `[Resource]Request`, `[Resource]Response`
- **Service methods**: `get[Resource]ById`, `search[Resource]`, `create[Resource]`
