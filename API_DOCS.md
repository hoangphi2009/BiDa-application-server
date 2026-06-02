# API Documentation – BiDa Application Server

> **Base URL:** `http://localhost:3000`  
> **Content-Type:** `application/json`

---

## Mục lục

1. [Table – Quản lý bàn](#1-table--quản-lý-bàn)
2. [Session – Quản lý phiên chơi](#2-session--quản-lý-phiên-chơi)
3. [Session Items – Sản phẩm trong phiên](#3-session-items--sản-phẩm-trong-phiên)
4. [Item – Quản lý sản phẩm](#4-item--quản-lý-sản-phẩm)
5. [Invoice – Hóa đơn](#5-invoice--hóa-đơn)
6. [Report – Báo cáo doanh thu](#6-report--báo-cáo-doanh-thu)

---

## 1. Table – Quản lý bàn

### GET `/api/v1/table/tables`
Lấy danh sách tất cả bàn.

**Response `200`**
```json
{
  "message": "List of all tables exist in the database",
  "data": [
    {
      "_id": "664abc123",
      "table_id": "T001",
      "table_name": "Table01",
      "table_number": 1,
      "table_type": "standard",
      "status": "available",
      "hourly_rate_id": "664def456",
      "createdAt": "2026-06-02T08:00:00.000Z",
      "updatedAt": "2026-06-02T08:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/v1/table/tables/:tableId`
Lấy chi tiết 1 bàn theo `table_id`.

**Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `tableId` | string | ID của bàn, ví dụ `T001` |

**Response `200`**
```json
{
  "message": "Table T001 found",
  "data": {
    "_id": "664abc123",
    "table_id": "T001",
    "table_name": "Table01",
    "table_number": 1,
    "table_type": "standard",
    "status": "available",
    "hourly_rate_id": "664def456",
    "createdAt": "2026-06-02T08:00:00.000Z",
    "updatedAt": "2026-06-02T08:00:00.000Z"
  }
}
```

**Response `404`**
```json
{ "message": "Table T001 does not exist" }
```

---

### POST `/api/v1/table/register`
Tạo bàn mới.

**Request Body**
| Tên | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| `tableId` | string | ✅ | ID định danh bàn |
| `tableName` | string | ✅ | Tên bàn |
| `tableNumber` | number | ❌ | Số thứ tự bàn |
| `table_type` | string | ❌ | Loại bàn: `standard`, `vip` (default: `standard`) |

```json
{
  "tableId": "T003",
  "tableName": "Table03",
  "tableNumber": 3,
  "table_type": "vip"
}
```

**Response `200`**
```json
{
  "message": "Successfully created table",
  "table": {
    "_id": "664abc789",
    "table_id": "T003",
    "table_name": "Table03",
    "table_number": 3,
    "table_type": "vip",
    "status": "available",
    "hourly_rate_id": null
  }
}
```

**Response `400`** – trùng ID
```json
{ "message": "Table with ID T003 already exists" }
```

---

### PUT `/api/v1/table/update/:tableId`
Cập nhật thông tin bàn.

**Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `tableId` | string | ID của bàn cần cập nhật |

**Request Body** _(gửi 1 hoặc nhiều field cần thay đổi)_
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `table_name` | string | Tên bàn |
| `table_number` | number | Số thứ tự |
| `table_type` | string | `standard` hoặc `vip` |
| `status` | string | `available`, `playing`, `maintenance` |
| `hourly_rate_id` | string | ObjectId của HourlyRate |

```json
{
  "hourly_rate_id": "664def456",
  "status": "maintenance"
}
```

**Response `200`**
```json
{
  "message": "Update table T001 successfully",
  "data": { ...table },
  "success": true
}
```

**Response `400`** – không có gì thay đổi
```json
{ "message": "No changes to update", "success": false }
```

**Response `404`** – không tìm thấy bàn
```json
{ "message": "Can not update table with id T001 due to table not found", "success": false }
```

---

### DELETE `/api/v1/table/delete/:tableId`
Xóa bàn.

**Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `tableId` | string | ID của bàn cần xóa |

**Response `200`**
```json
{ "message": "Successfully deleted table T003 service" }
```

**Response `400`**
```json
{ "message": "Table T003 does not exist" }
```

---

## 2. Session – Quản lý phiên chơi

### POST `/api/v1/session/open`
Mở phiên chơi cho 1 bàn. Bàn phải có trạng thái `available` và đã được gán `hourly_rate_id`.

**Request Body**
| Tên | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| `table_id` | string | ✅ | ID của bàn, ví dụ `T001` |

```json
{
  "table_id": "T001"
}
```

**Response `201`**
```json
{
  "message": "Session opened successfully",
  "data": {
    "_id": "665abc111",
    "session_id": "uuid-v4-string",
    "table_id": { "_id": "664abc123", "table_id": "T001", "table_name": "Table01", "status": "playing" },
    "hourly_rate_id": { "_id": "664def456", "rate_name": "Bàn thường", "price_per_hour": 20000 },
    "start_time": "2026-06-02T10:00:00.000Z",
    "end_time": null,
    "total_playing_time_minutes": null,
    "total_session_cost": null
  }
}
```

**Response `400`** – bàn đang bận hoặc bảo trì
```json
{ "message": "Table T001 is not available (current status: playing)" }
```

**Response `400`** – bàn chưa có giá
```json
{ "message": "Table T001 has no hourly rate assigned" }
```

**Response `404`** – bàn không tồn tại
```json
{ "message": "Table T001 does not exist" }
```

---

### PUT `/api/v1/session/close/:sessionId`
Đóng phiên chơi. Tự động tính tổng thời gian và tiền giờ chơi.

**Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `sessionId` | string | `session_id` (UUID) của phiên |

**Response `200`**
```json
{
  "message": "Session closed successfully",
  "data": {
    "session_id": "uuid-v4-string",
    "start_time": "2026-06-02T10:00:00.000Z",
    "end_time": "2026-06-02T11:10:00.000Z",
    "total_playing_time_minutes": 70,
    "total_session_cost": 23500
  }
}
```

> **Công thức tính tiền:**  
> `total_session_cost = ceil(total_minutes × price_per_hour / 60 / 500) × 500`  
> Ví dụ: 70 phút × 20.000đ/h = 23.333đ → làm tròn lên **23.500đ**

**Response `400`** – phiên đã đóng
```json
{ "message": "Session <id> is already closed" }
```

**Response `404`**
```json
{ "message": "Session <id> does not exist" }
```

---

### GET `/api/v1/session/sessions`
Lấy danh sách phiên chơi, hỗ trợ filter.

**Query Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `tableId` | string | Lọc theo bàn, ví dụ `T001` |
| `date` | string | Lọc theo ngày mở phiên, định dạng `YYYY-MM-DD` |
| `status` | string | `open` (chưa đóng) hoặc `closed` (đã đóng) |

**Ví dụ**
```
GET /api/v1/session/sessions?status=open
GET /api/v1/session/sessions?tableId=T001&date=2026-06-02
```

**Response `200`**
```json
{
  "message": "List of all sessions",
  "data": [ ...sessions ]
}
```

---

### GET `/api/v1/session/sessions/:sessionId`
Lấy chi tiết 1 phiên chơi.

**Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `sessionId` | string | `session_id` (UUID) của phiên |

**Response `200`**
```json
{
  "message": "Session <id> found",
  "data": {
    "session_id": "uuid-v4-string",
    "table_id": { "table_id": "T001", "table_name": "Table01" },
    "hourly_rate_id": { "rate_name": "Bàn thường", "price_per_hour": 20000 },
    "start_time": "2026-06-02T10:00:00.000Z",
    "end_time": "2026-06-02T11:10:00.000Z",
    "total_playing_time_minutes": 70,
    "total_session_cost": 23500
  }
}
```

**Response `404`**
```json
{ "message": "Session <id> does not exist" }
```

---

## 3. Session Items – Sản phẩm trong phiên

### POST `/api/v1/session/:sessionId/items`
Thêm sản phẩm vào phiên đang chơi. Phiên phải còn đang mở.

**Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `sessionId` | string | `session_id` (UUID) của phiên |

**Request Body**
| Tên | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| `item_id` | string | ✅ | ID sản phẩm, ví dụ `CF01` |
| `quantity` | number | ✅ | Số lượng (>= 1) |

```json
{
  "item_id": "CF01",
  "quantity": 2
}
```

**Response `201`**
```json
{
  "message": "Item added to session",
  "data": {
    "session_item_id": "uuid-v4-string",
    "session_id": "665abc111",
    "item_id": { "item_id": "CF01", "item_name": "Cafe Đá", "price": 10000 },
    "unit_price": 10000,
    "total_items": 2,
    "item_total_cost": 20000
  }
}
```

> `unit_price` được snapshot tại thời điểm thêm vào — không bị ảnh hưởng nếu giá sản phẩm thay đổi sau.

**Response `400`** – phiên đã đóng
```json
{ "message": "Session <id> is already closed" }
```

**Response `404`** – phiên hoặc sản phẩm không tồn tại
```json
{ "message": "Item CF01 does not exist" }
```

---

### GET `/api/v1/session/:sessionId/items`
Lấy danh sách sản phẩm đã thêm vào phiên.

**Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `sessionId` | string | `session_id` (UUID) của phiên |

**Response `200`**
```json
{
  "message": "Items in session <id>",
  "data": [
    {
      "session_item_id": "uuid-v4-string",
      "item_id": { "item_id": "CF01", "item_name": "Cafe Đá", "price": 10000, "category": "drink" },
      "unit_price": 10000,
      "total_items": 2,
      "item_total_cost": 20000
    }
  ]
}
```

---

### DELETE `/api/v1/session/:sessionId/items/:sessionItemId`
Xóa 1 sản phẩm khỏi phiên. Chỉ được xóa khi phiên còn đang mở.

**Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `sessionId` | string | `session_id` (UUID) của phiên |
| `sessionItemId` | string | `session_item_id` (UUID) của item trong phiên |

**Response `200`**
```json
{ "message": "Item <sessionItemId> removed from session <sessionId>" }
```

**Response `400`** – phiên đã đóng
```json
{ "message": "Session <id> is already closed" }
```

**Response `404`**
```json
{ "message": "Session item <id> does not exist" }
```

---

## 4. Item – Quản lý sản phẩm

### GET `/api/v1/item/items`
Lấy danh sách tất cả sản phẩm.

**Query Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `category` | string | Lọc theo loại: `drink` hoặc `other` |

**Response `200`**
```json
{
  "message": "List of all items",
  "data": [
    {
      "_id": "664aaa111",
      "item_id": "CF01",
      "item_name": "Cafe Đá",
      "price": 10000,
      "category": "drink"
    }
  ]
}
```

---

### GET `/api/v1/item/items/:itemId`
Lấy chi tiết 1 sản phẩm.

**Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `itemId` | string | ID sản phẩm, ví dụ `CF01` |

**Response `200`**
```json
{
  "message": "Item CF01 found",
  "data": {
    "item_id": "CF01",
    "item_name": "Cafe Đá",
    "price": 10000,
    "category": "drink"
  }
}
```

**Response `404`**
```json
{ "message": "Item CF01 does not exist" }
```

---

### POST `/api/v1/item/register`
Tạo sản phẩm mới.

**Request Body**
| Tên | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| `item_id` | string | ✅ | ID định danh |
| `item_name` | string | ✅ | Tên sản phẩm |
| `price` | number | ✅ | Đơn giá (VNĐ) |
| `category` | string | ✅ | `drink` hoặc `other` |

```json
{
  "item_id": "SN01",
  "item_name": "Snack",
  "price": 10000,
  "category": "other"
}
```

**Response `201`**
```json
{
  "message": "Item created successfully",
  "data": { "item_id": "SN01", "item_name": "Snack", "price": 10000, "category": "other" }
}
```

**Response `400`** – trùng ID hoặc thiếu field
```json
{ "message": "Item với ID SN01 đã tồn tại" }
```

---

### PUT `/api/v1/item/update/:itemId`
Cập nhật sản phẩm.

**Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `itemId` | string | ID sản phẩm |

**Request Body** _(gửi field cần thay đổi)_
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `item_name` | string | Tên sản phẩm |
| `price` | number | Đơn giá mới |
| `category` | string | `drink` hoặc `other` |

```json
{ "price": 12000 }
```

**Response `200`**
```json
{
  "message": "Item SN01 updated successfully",
  "data": { "item_id": "SN01", "item_name": "Snack", "price": 12000, "category": "other" }
}
```

**Response `400`**
```json
{ "message": "No changes to update" }
```

**Response `404`**
```json
{ "message": "Item SN01 does not exist" }
```

---

### DELETE `/api/v1/item/delete/:itemId`
Xóa sản phẩm.

**Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `itemId` | string | ID sản phẩm |

**Response `200`**
```json
{ "message": "Item SN01 deleted successfully" }
```

**Response `404`**
```json
{ "message": "Item SN01 does not exist" }
```

---

## 5. Invoice – Hóa đơn

### POST `/api/v1/invoice/generate/:sessionId`
Tạo hóa đơn cho phiên chơi. Nếu phiên chưa đóng, hệ thống sẽ tự động đóng phiên trước.

**Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `sessionId` | string | `session_id` (UUID) của phiên |

**Response `201`**
```json
{
  "message": "Invoice generated successfully",
  "data": {
    "_id": "665inv001",
    "invoice_id": "uuid-v4-string",
    "session_id": {
      "session_id": "uuid-v4-string",
      "table_id": { "table_id": "T001", "table_name": "Table01" },
      "hourly_rate_id": { "rate_name": "Bàn thường", "price_per_hour": 20000 },
      "start_time": "2026-06-02T10:00:00.000Z",
      "end_time": "2026-06-02T11:10:00.000Z",
      "total_playing_time_minutes": 70,
      "total_session_cost": 23500
    },
    "invoice_date": "2026-06-02T11:10:00.000Z",
    "playing_cost": 23500,
    "items_cost": 30000,
    "total_amount": 53500,
    "payment_status": "Chưa thanh toán",
    "notes": null
  }
}
```

**Response `400`** – hóa đơn đã tồn tại
```json
{ "message": "Invoice for session <id> already exists" }
```

**Response `404`**
```json
{ "message": "Session <id> does not exist" }
```

---

### GET `/api/v1/invoice/:sessionId`
Lấy hóa đơn kèm danh sách sản phẩm của phiên.

**Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `sessionId` | string | `session_id` (UUID) của phiên |

**Response `200`**
```json
{
  "message": "Invoice for session <id>",
  "data": {
    "invoice": {
      "invoice_id": "uuid-v4-string",
      "playing_cost": 23500,
      "items_cost": 30000,
      "total_amount": 53500,
      "payment_status": "Chưa thanh toán",
      "notes": null,
      "session_id": { ...session }
    },
    "sessionItems": [
      {
        "item_id": { "item_id": "CF01", "item_name": "Cafe Đá" },
        "unit_price": 10000,
        "total_items": 2,
        "item_total_cost": 20000
      }
    ]
  }
}
```

**Response `404`**
```json
{ "message": "Invoice for session <id> does not exist" }
```

---

### PUT `/api/v1/invoice/:invoiceId/payment`
Cập nhật trạng thái thanh toán của hóa đơn.

**Params**
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| `invoiceId` | string | `invoice_id` (UUID) của hóa đơn |

**Request Body**
| Tên | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| `payment_status` | string | ✅ | `Chưa thanh toán`, `Đã thanh toán`, `Hủy` |
| `notes` | string | ❌ | Ghi chú thêm |

```json
{
  "payment_status": "Đã thanh toán",
  "notes": "Khách thanh toán tiền mặt"
}
```

**Response `200`**
```json
{
  "message": "Invoice <id> updated",
  "data": {
    "invoice_id": "uuid-v4-string",
    "payment_status": "Đã thanh toán",
    "notes": "Khách thanh toán tiền mặt"
  }
}
```

**Response `400`** – trạng thái không hợp lệ
```json
{ "message": "Trạng thái không hợp lệ. Chỉ chấp nhận: Chưa thanh toán, Đã thanh toán, Hủy" }
```

**Response `404`**
```json
{ "message": "Invoice <id> does not exist" }
```

---

## 6. Report – Báo cáo doanh thu

### GET `/api/v1/report/daily`
Báo cáo doanh thu theo ngày.

**Query Params**
| Tên | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| `date` | string | ✅ | Ngày cần báo cáo, định dạng `YYYY-MM-DD` |

```
GET /api/v1/report/daily?date=2026-06-02
```

**Response `200`**
```json
{
  "message": "Báo cáo doanh thu ngày 2026-06-02",
  "data": {
    "date": "2026-06-02",
    "total_invoices": 3,
    "paid_count": 2,
    "unpaid_count": 1,
    "cancelled_count": 0,
    "total_revenue": 150000,
    "total_playing_cost": 110000,
    "total_items_cost": 40000,
    "invoices": [ ...danh sách hóa đơn ]
  }
}
```

**Response `400`**
```json
{ "message": "date là bắt buộc (YYYY-MM-DD)" }
```

---

### GET `/api/v1/report/monthly`
Báo cáo doanh thu theo tháng, bao gồm phân tích chi tiết từng ngày.

**Query Params**
| Tên | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| `year` | number | ✅ | Năm, ví dụ `2026` |
| `month` | number | ✅ | Tháng `1`–`12` |

```
GET /api/v1/report/monthly?year=2026&month=6
```

**Response `200`**
```json
{
  "message": "Báo cáo doanh thu tháng 6/2026",
  "data": {
    "year": 2026,
    "month": 6,
    "total_invoices": 20,
    "paid_count": 15,
    "unpaid_count": 4,
    "cancelled_count": 1,
    "total_revenue": 2500000,
    "total_playing_cost": 2000000,
    "total_items_cost": 500000,
    "daily_breakdown": [
      {
        "date": "2026-06-01",
        "total_invoices": 5,
        "total_revenue": 800000,
        "playing_cost": 650000,
        "items_cost": 150000
      },
      {
        "date": "2026-06-02",
        "total_invoices": 3,
        "total_revenue": 450000,
        "playing_cost": 380000,
        "items_cost": 70000
      }
    ]
  }
}
```

**Response `400`**
```json
{ "message": "year và month là bắt buộc" }
```

---

## Tổng hợp API

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/v1/table/tables` | Danh sách bàn |
| GET | `/api/v1/table/tables/:tableId` | Chi tiết bàn |
| POST | `/api/v1/table/register` | Tạo bàn |
| PUT | `/api/v1/table/update/:tableId` | Cập nhật bàn |
| DELETE | `/api/v1/table/delete/:tableId` | Xóa bàn |
| POST | `/api/v1/session/open` | Mở phiên chơi |
| PUT | `/api/v1/session/close/:sessionId` | Đóng phiên, tính tiền |
| GET | `/api/v1/session/sessions` | Danh sách phiên (filter) |
| GET | `/api/v1/session/sessions/:sessionId` | Chi tiết phiên |
| POST | `/api/v1/session/:sessionId/items` | Thêm sản phẩm vào phiên |
| GET | `/api/v1/session/:sessionId/items` | Sản phẩm trong phiên |
| DELETE | `/api/v1/session/:sessionId/items/:sessionItemId` | Xóa sản phẩm khỏi phiên |
| GET | `/api/v1/item/items` | Danh sách sản phẩm |
| GET | `/api/v1/item/items/:itemId` | Chi tiết sản phẩm |
| POST | `/api/v1/item/register` | Tạo sản phẩm |
| PUT | `/api/v1/item/update/:itemId` | Cập nhật sản phẩm |
| DELETE | `/api/v1/item/delete/:itemId` | Xóa sản phẩm |
| POST | `/api/v1/invoice/generate/:sessionId` | Tạo hóa đơn |
| GET | `/api/v1/invoice/:sessionId` | Lấy hóa đơn theo session |
| PUT | `/api/v1/invoice/:invoiceId/payment` | Cập nhật thanh toán |
| GET | `/api/v1/report/daily` | Báo cáo theo ngày |
| GET | `/api/v1/report/monthly` | Báo cáo theo tháng |
