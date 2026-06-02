# API Test Guide – BiDa Application Server

> Base URL: `http://localhost:3000`  
> Khởi động server: `npm run dev`  
> Seed dữ liệu mẫu: `npm run seed`

---

## Chuẩn bị

Sau khi seed, hệ thống có sẵn:
- **HourlyRate**: `HR001` (Bàn thường – 20.000đ/h), `HR002` (Bàn VIP – 25.000đ/h)
- **Table**: `T001` (standard), `T002` (vip)
- **OtherItem**: `NN01` Sting, `CF01` Cafe Đá, `CF02` Cafe Sữa, `NN02` Mì tôm

> ⚠️ Để gán `hourly_rate_id` cho bàn, bạn cần lấy ObjectId của HourlyRate từ DB (xem bước 1.5).

---

## Tính năng 1 – Quản lý bàn bida

### 1.1 Lấy danh sách tất cả bàn
```
GET /api/v1/table/tables
```
**Expected:** 200 – danh sách bàn với `status`, `table_type`, `hourly_rate_id`

---

### 1.2 Lấy chi tiết 1 bàn
```
GET /api/v1/table/tables/T001
```
**Expected:** 200 – thông tin bàn T001

---

### 1.3 Tạo bàn mới
```
POST /api/v1/table/register
Content-Type: application/json

{
  "tableId": "T003",
  "tableName": "Table03",
  "tableNumber": 3,
  "table_type": "standard"
}
```
**Expected:** 200 – bàn mới được tạo, `status: "available"`

---

### 1.4 Tạo bàn trùng ID (edge case)
```
POST /api/v1/table/register
Content-Type: application/json

{
  "tableId": "T001",
  "tableName": "Duplicate"
}
```
**Expected:** 400 – `Table with ID T001 already exists`

---

### 1.5 Gán giá cho bàn (quan trọng – cần làm trước khi mở phiên)

> Lấy `_id` của HourlyRate từ MongoDB (collection `hourlyrates`), ví dụ: `6650abc123def456789`

```
PUT /api/v1/table/update/T001
Content-Type: application/json

{
  "hourly_rate_id": "<ObjectId của HR001>"
}
```
```
PUT /api/v1/table/update/T002
Content-Type: application/json

{
  "hourly_rate_id": "<ObjectId của HR002>"
}
```
**Expected:** 200 – bàn được cập nhật với `hourly_rate_id`

---

### 1.6 Cập nhật trạng thái bàn thành bảo trì
```
PUT /api/v1/table/update/T003
Content-Type: application/json

{
  "status": "maintenance"
}
```
**Expected:** 200 – `status: "maintenance"`

---

### 1.7 Xóa bàn
```
DELETE /api/v1/table/delete/T003
```
**Expected:** 200 – xóa thành công

---

## Tính năng 2 & 5 – Quản lý phiên chơi & Lịch sử

> ⚠️ Bàn phải được gán `hourly_rate_id` trước (xem 1.5)

### 2.1 Mở phiên chơi
```
POST /api/v1/session/open
Content-Type: application/json

{
  "table_id": "T001"
}
```
**Expected:** 201 – session mới với `end_time: null`, `table.status → "playing"`  
> Lưu lại `session_id` để dùng ở các bước sau, ví dụ: `abc-123-xyz`

---

### 2.2 Mở phiên trên bàn đang chơi (edge case)
```
POST /api/v1/session/open
Content-Type: application/json

{
  "table_id": "T001"
}
```
**Expected:** 400 – `Table T001 is not available (current status: playing)`

---

### 2.3 Mở phiên trên bàn bảo trì (edge case)
```
POST /api/v1/session/open
Content-Type: application/json

{
  "table_id": "T003"
}
```
**Expected:** 400 – `Table T003 is not available`

---

### 2.4 Lấy danh sách tất cả phiên
```
GET /api/v1/session/sessions
```
**Expected:** 200 – danh sách phiên, sắp xếp mới nhất trước

---

### 2.5 Lọc phiên đang mở
```
GET /api/v1/session/sessions?status=open
```
**Expected:** 200 – chỉ các phiên có `end_time: null`

---

### 2.6 Lọc phiên theo ngày
```
GET /api/v1/session/sessions?date=2026-06-02
```
**Expected:** 200 – phiên trong ngày hôm nay

---

### 2.7 Lọc phiên theo bàn
```
GET /api/v1/session/sessions?tableId=T001
```
**Expected:** 200 – phiên của bàn T001

---

### 2.8 Lấy chi tiết phiên
```
GET /api/v1/session/sessions/<session_id>
```
**Expected:** 200 – chi tiết phiên với thông tin bàn và giá được populate

---

### 2.9 Đóng phiên (tính tiền)
> Nên đợi ít nhất 1 phút để thấy tiền > 0

```
PUT /api/v1/session/close/<session_id>
```
**Expected:** 200 – phiên đóng với:
- `end_time`: thời điểm đóng
- `total_playing_time_minutes`: số phút (làm tròn lên)
- `total_session_cost`: tiền đã làm tròn lên bội số 500đ
- `table.status → "available"`

**Ví dụ tính tiền:** chơi 70 phút, giá 20.000đ/h  
→ `price_per_minute = 20000/60 ≈ 333.33`  
→ `raw = 70 × 333.33 = 23.333đ`  
→ `total = ceil(23333/500) × 500 = 23.500đ`

---

### 2.10 Đóng phiên đã đóng (edge case)
```
PUT /api/v1/session/close/<session_id>
```
**Expected:** 400 – `Session <id> is already closed`

---

## Tính năng 3 – Quản lý sản phẩm

### 3.1 Lấy danh sách sản phẩm
```
GET /api/v1/item/items
```
**Expected:** 200 – 4 sản phẩm từ seeder

---

### 3.2 Lọc theo category
```
GET /api/v1/item/items?category=drink
```
**Expected:** 200 – chỉ sản phẩm category `drink`

---

### 3.3 Lấy chi tiết sản phẩm
```
GET /api/v1/item/items/CF01
```
**Expected:** 200 – thông tin Cafe Đá

---

### 3.4 Tạo sản phẩm mới
```
POST /api/v1/item/register
Content-Type: application/json

{
  "item_id": "SN01",
  "item_name": "Snack",
  "price": 10000,
  "category": "other"
}
```
**Expected:** 201 – sản phẩm mới được tạo

---

### 3.5 Cập nhật giá sản phẩm
```
PUT /api/v1/item/update/SN01
Content-Type: application/json

{
  "price": 12000
}
```
**Expected:** 200 – giá được cập nhật

---

### 3.6 Thêm item vào phiên đang chơi

> Cần mở 1 phiên mới trước (xem 2.1), lưu `session_id`

```
POST /api/v1/session/<session_id>/items
Content-Type: application/json

{
  "item_id": "CF01",
  "quantity": 2
}
```
**Expected:** 201 – session item với `unit_price: 10000`, `item_total_cost: 20000`  
> Lưu lại `session_item_id` để test xóa

---

### 3.7 Thêm nhiều item khác nhau vào phiên
```
POST /api/v1/session/<session_id>/items
Content-Type: application/json

{
  "item_id": "NN01",
  "quantity": 3
}
```
**Expected:** 201 – item thứ 2 được thêm

---

### 3.8 Lấy danh sách items trong phiên
```
GET /api/v1/session/<session_id>/items
```
**Expected:** 200 – danh sách 2 items với thông tin chi tiết

---

### 3.9 Thêm item vào phiên đã đóng (edge case)
```
POST /api/v1/session/<closed_session_id>/items
Content-Type: application/json

{
  "item_id": "CF01",
  "quantity": 1
}
```
**Expected:** 400 – `Session <id> is already closed`

---

### 3.10 Xóa item khỏi phiên
```
DELETE /api/v1/session/<session_id>/items/<session_item_id>
```
**Expected:** 200 – item bị xóa khỏi phiên

---

### 3.11 Xóa sản phẩm
```
DELETE /api/v1/item/delete/SN01
```
**Expected:** 200 – xóa thành công

---

## Tính năng 4 – Hóa đơn

> Cần có 1 phiên với items (xem tính năng 2 + 3)

### 4.1 Tạo hóa đơn (phiên đã đóng)
```
POST /api/v1/invoice/generate/<session_id>
```
**Expected:** 201 – hóa đơn với:
- `playing_cost`: tiền giờ chơi
- `items_cost`: tổng tiền sản phẩm
- `total_amount = playing_cost + items_cost`
- `payment_status: "Chưa thanh toán"`

---

### 4.2 Tạo hóa đơn (phiên đang mở – tự động đóng)
> Mở phiên mới, thêm vài item, rồi gọi generate luôn mà không close

```
POST /api/v1/invoice/generate/<open_session_id>
```
**Expected:** 201 – hệ thống tự đóng phiên rồi tạo hóa đơn

---

### 4.3 Tạo hóa đơn trùng (edge case)
```
POST /api/v1/invoice/generate/<session_id>
```
**Expected:** 400 – `Invoice for session <id> already exists`

---

### 4.4 Lấy hóa đơn theo session
```
GET /api/v1/invoice/<session_id>
```
**Expected:** 200 – hóa đơn kèm danh sách items

---

### 4.5 Cập nhật trạng thái thanh toán
```
PUT /api/v1/invoice/<invoice_id>/payment
Content-Type: application/json

{
  "payment_status": "Đã thanh toán",
  "notes": "Khách thanh toán tiền mặt"
}
```
**Expected:** 200 – `payment_status: "Đã thanh toán"`

---

### 4.6 Trạng thái không hợp lệ (edge case)
```
PUT /api/v1/invoice/<invoice_id>/payment
Content-Type: application/json

{
  "payment_status": "invalid_status"
}
```
**Expected:** 400 – `Trạng thái không hợp lệ. Chỉ chấp nhận: Chưa thanh toán, Đã thanh toán, Hủy`

---

### 4.7 Hủy hóa đơn
```
PUT /api/v1/invoice/<invoice_id>/payment
Content-Type: application/json

{
  "payment_status": "Hủy",
  "notes": "Khách hủy"
}
```
**Expected:** 200 – `payment_status: "Hủy"`

---

## Tính năng 6 – Báo cáo doanh thu

> Cần có ít nhất 1 hóa đơn đã tạo (tính năng 4)

### 6.1 Báo cáo theo ngày
```
GET /api/v1/report/daily?date=2026-06-02
```
**Expected:** 200 – tổng hợp:
```json
{
  "date": "2026-06-02",
  "total_invoices": 2,
  "paid_count": 1,
  "unpaid_count": 1,
  "cancelled_count": 0,
  "total_revenue": 73500,
  "total_playing_cost": 53500,
  "total_items_cost": 20000,
  "invoices": [...]
}
```

---

### 6.2 Ngày không có dữ liệu
```
GET /api/v1/report/daily?date=2020-01-01
```
**Expected:** 200 – tất cả số liệu = 0, `invoices: []`

---

### 6.3 Thiếu param date (edge case)
```
GET /api/v1/report/daily
```
**Expected:** 400 – `date là bắt buộc (YYYY-MM-DD)`

---

### 6.4 Báo cáo theo tháng
```
GET /api/v1/report/monthly?year=2026&month=6
```
**Expected:** 200 – tổng hợp tháng + `daily_breakdown` theo từng ngày:
```json
{
  "year": 2026,
  "month": 6,
  "total_revenue": 150000,
  "daily_breakdown": [
    { "date": "2026-06-01", "total_revenue": 80000, ... },
    { "date": "2026-06-02", "total_revenue": 70000, ... }
  ]
}
```

---

### 6.5 Tháng không hợp lệ (edge case)
```
GET /api/v1/report/monthly?year=2026&month=13
```
**Expected:** 400 – `year hoặc month không hợp lệ`

---

### 6.6 Thiếu param (edge case)
```
GET /api/v1/report/monthly?year=2026
```
**Expected:** 400 – `year và month là bắt buộc`

---

## Flow test đầy đủ (end-to-end)

Chạy theo thứ tự để test toàn bộ hệ thống:

```
1.  npm run seed
2.  GET  /api/v1/table/tables                         → lấy danh sách bàn
3.  PUT  /api/v1/table/update/T001                    → gán hourly_rate_id (HR001)
4.  PUT  /api/v1/table/update/T002                    → gán hourly_rate_id (HR002)
5.  POST /api/v1/session/open          { table_id: T001 }
6.  POST /api/v1/session/<id>/items    { item_id: CF01, quantity: 2 }
7.  POST /api/v1/session/<id>/items    { item_id: NN01, quantity: 1 }
8.  GET  /api/v1/session/<id>/items                   → xem items trong phiên
9.  PUT  /api/v1/session/close/<id>                   → đóng phiên, kiểm tra tiền
10. POST /api/v1/invoice/generate/<id>                → xuất hóa đơn
11. GET  /api/v1/invoice/<id>                         → xem hóa đơn đầy đủ
12. PUT  /api/v1/invoice/<invoice_id>/payment         → thanh toán
13. GET  /api/v1/report/daily?date=<hôm nay>          → báo cáo ngày
14. GET  /api/v1/report/monthly?year=2026&month=6     → báo cáo tháng
```
