# Plan: Hoàn thiện Backend Quản Lý Tính Tiền Bida

## Quyết định thiết kế
- Giá gắn vào từng bàn (`table.hourly_rate_id` → HourlyRate)
- Tính tiền theo phút thực tế: `Math.ceil(minutes × price_per_minute / 500) × 500` (làm tròn lên bội số 500đ gần nhất)
- Implement lần lượt từng tính năng theo thứ tự dưới đây

---

## Tính năng 1 – Fix Models & HourlyRate Seeder

### Vấn đề hiện tại
- `table.model.js`: `is_available: Boolean` không phân biệt được 3 trạng thái (trống / đang chơi / bảo trì), thiếu `table_type` và `hourly_rate_id`
- `playingSession.model.js`: `end_time` có `default: Date.now` → khi tạo phiên, `end_time = start_time` → tính tiền sai ngay
- `sessionItems.model.js`: thiếu `unit_price` → nếu giá item thay đổi sau, lịch sử hóa đơn cũ sẽ sai

### Thay đổi cần làm

**`models/table.model.js`**
```diff
- is_available: { type: Boolean, default: true }
+ status: { type: String, enum: ['available', 'playing', 'maintenance'], default: 'available' }
+ table_type: { type: String, default: 'standard' }
+ hourly_rate_id: { type: Schema.Types.ObjectId, ref: 'HourlyRate' }
```

**`models/playingSession.model.js`**
```diff
- end_time: { type: Date, default: Date.now, required: true }
+ end_time: { type: Date, default: null }
```

**`models/sessionItems.model.js`**
```diff
+ unit_price: { type: Number, required: true }
```

**`utils/constant.js`** – thêm API path constants
```js
export const SESSION_API = '/api/v1/session'
export const ITEM_API    = '/api/v1/item'
export const INVOICE_API = '/api/v1/invoice'
export const REPORT_API  = '/api/v1/report'
```

**`seeders/seeds/seedHourlyRate.js`** – tạo mới, seed ít nhất 2 mức giá mẫu

**`seeders/seed.js`** – import và chạy `seedHourlyRate`

**`services/updateTableById.service.js`** – cập nhật hỗ trợ field `status`, `table_type`, `hourly_rate_id`

---

## Tính năng 2 – Quản lý phiên chơi (Session)

### Files cần tạo
```
controllers/sessionController/
  openSession.controller.js
  closeSession.controller.js
  getAllSessions.controller.js
  getSessionById.controller.js

services/
  openSession.service.js
  closeSession.service.js
  getAllSessions.service.js
  getSessionById.service.js

routes/session.route.js
```

### API Routes
| Method | Path | Mô tả |
|--------|------|-------|
| POST | `/api/v1/session/open` | Mở phiên chơi |
| PUT | `/api/v1/session/close/:sessionId` | Đóng phiên, tính tiền |
| GET | `/api/v1/session/sessions` | Lịch sử tất cả phiên |
| GET | `/api/v1/session/sessions/:sessionId` | Chi tiết 1 phiên |

### Logic nghiệp vụ

**`openSession.service.js`**
1. Nhận `table_id` (string)
2. Tìm bàn → throw nếu không tồn tại
3. Throw nếu `table.status !== 'available'`
4. Throw nếu bàn chưa có `hourly_rate_id`
5. Tạo `PlayingSession` với `start_time: Date.now()`, `end_time: null`
6. Set `table.status = 'playing'` → save
7. Return session

**`closeSession.service.js`**
1. Tìm session theo `session_id` → throw nếu không tồn tại
2. Throw nếu đã đóng (`end_time !== null`)
3. Set `end_time = Date.now()`
4. `total_playing_time_minutes = Math.ceil((end_time - start_time) / 60000)`
5. Lấy `price_per_hour` từ HourlyRate → `price_per_minute = price_per_hour / 60`
6. `raw_cost = total_playing_time_minutes × price_per_minute`
7. `total_session_cost = Math.ceil(raw_cost / 500) * 500`
8. Lưu session
9. Set `table.status = 'available'` → save
10. Return session

**`getAllSessions.service.js`** – hỗ trợ query filter: `?tableId=`, `?date=YYYY-MM-DD`, `?status=open|closed`

**Đăng ký route trong `index.js`**
```js
import sessionRoute from './routes/session.route.js'
app.use(SESSION_API, sessionRoute)
```

---

## Tính năng 3 – Quản lý sản phẩm (OtherItem)

### Files cần tạo
```
controllers/itemController/
  getAllItems.controller.js
  getItemById.controller.js
  createItem.controller.js
  updateItem.controller.js
  deleteItem.controller.js

services/
  getAllItems.service.js
  getItemById.service.js
  createItem.service.js
  updateItem.service.js
  deleteItem.service.js

routes/item.route.js
```

### API Routes
| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/v1/item/items` | Danh sách sản phẩm |
| GET | `/api/v1/item/items/:itemId` | Chi tiết 1 sản phẩm |
| POST | `/api/v1/item/register` | Tạo sản phẩm mới |
| PUT | `/api/v1/item/update/:itemId` | Cập nhật sản phẩm |
| DELETE | `/api/v1/item/delete/:itemId` | Xóa sản phẩm |
| POST | `/api/v1/session/:sessionId/items` | Thêm item vào phiên đang chơi |
| GET | `/api/v1/session/:sessionId/items` | Danh sách items của phiên |
| DELETE | `/api/v1/session/:sessionId/items/:itemId` | Xóa item khỏi phiên |

### Logic nghiệp vụ

**`addItemToSession.service.js`** (đặt cùng session services)
1. Tìm session → throw nếu đã đóng (`end_time !== null`)
2. Tìm OtherItem theo `item_id` → lấy `price` hiện tại
3. Tạo `SessionItems` với:
   - `unit_price: item.price` ← snapshot giá tại thời điểm bán
   - `item_total_cost: unit_price × quantity`
4. Return sessionItem

---

## Tính năng 4 – Tổng hóa đơn (Invoice)

### Files cần tạo
```
controllers/invoiceController/
  generateInvoice.controller.js
  getInvoiceBySession.controller.js
  updatePaymentStatus.controller.js

services/
  generateInvoice.service.js
  getInvoiceBySession.service.js
  updatePaymentStatus.service.js

routes/invoice.route.js
```

### API Routes
| Method | Path | Mô tả |
|--------|------|-------|
| POST | `/api/v1/invoice/generate/:sessionId` | Tạo hóa đơn (tự đóng phiên nếu chưa đóng) |
| GET | `/api/v1/invoice/:sessionId` | Lấy hóa đơn theo session |
| PUT | `/api/v1/invoice/:invoiceId/payment` | Cập nhật trạng thái thanh toán |

### Logic nghiệp vụ

**`generateInvoice.service.js`**
1. Tìm session → nếu chưa đóng thì gọi `closeSession` trước
2. `playing_cost = session.total_session_cost`
3. Lấy tất cả `SessionItems` của session → `items_cost = sum(item_total_cost)`
4. `total_amount = playing_cost + items_cost`
5. Tạo Invoice → return

---

## Tính năng 5 – Lịch sử phiên chơi

Đã được cover trong **Tính năng 2**:
- `GET /api/v1/session/sessions` – filter theo `tableId`, `date`, `status`
- `GET /api/v1/session/sessions/:sessionId` – populate `table_id`, `hourly_rate_id`

---

## Tính năng 6 – Báo cáo doanh thu

### Files cần tạo
```
controllers/reportController/
  getDailyReport.controller.js
  getMonthlyReport.controller.js

services/
  getDailyReport.service.js
  getMonthlyReport.service.js

routes/report.route.js
```

### API Routes
| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/v1/report/daily?date=YYYY-MM-DD` | Báo cáo theo ngày |
| GET | `/api/v1/report/monthly?year=YYYY&month=MM` | Báo cáo theo tháng |

### Logic nghiệp vụ

**`getDailyReport.service.js`**
1. Query Invoice theo ngày (`invoice_date` trong khoảng start–end of day)
2. Aggregate: tổng `total_amount`, `playing_cost`, `items_cost`
3. Đếm số phiên, số hóa đơn đã thanh toán / chưa thanh toán
4. Return summary

**`getMonthlyReport.service.js`** – tương tự, group theo từng ngày trong tháng

---

## Cấu trúc thư mục sau khi hoàn thành

```
controllers/
  tableController/       ← đã có (update updateTableById)
  sessionController/     ← tạo mới
  itemController/        ← tạo mới
  invoiceController/     ← tạo mới
  reportController/      ← tạo mới

services/
  (table services)       ← đã có (update updateTableById)
  openSession.service.js
  closeSession.service.js
  getAllSessions.service.js
  getSessionById.service.js
  addItemToSession.service.js
  getSessionItems.service.js
  removeItemFromSession.service.js
  (item services × 5)
  (invoice services × 3)
  (report services × 2)

routes/
  table.route.js         ← đã có
  session.route.js       ← tạo mới
  item.route.js          ← tạo mới
  invoice.route.js       ← tạo mới
  report.route.js        ← tạo mới
```

---

## Thứ tự implement

| # | Tính năng | Ghi chú |
|---|-----------|---------|
| 1 | Fix models + seeder HourlyRate | Nền tảng cho mọi thứ phía sau |
| 2 | Session open + close | Core business logic chính |
| 3 | Session list + detail | Lịch sử phiên chơi |
| 4 | OtherItem CRUD + add item to session | Cần trước khi làm invoice |
| 5 | Invoice generate + payment status | Tổng hợp session + items |
| 6 | Report daily + monthly | Cuối cùng, phụ thuộc vào invoice |

---

## Verification (test sau mỗi tính năng)

1. `npm run seed` → seeder chạy không lỗi
2. Test flow chính qua Postman/curl:
   ```
   Tạo bàn → gán hourly rate → mở phiên → thêm item → đóng phiên → xuất hóa đơn
   ```
3. Test edge cases:
   - Mở 2 phiên cùng 1 bàn → phải báo lỗi
   - Đóng phiên đã đóng → phải báo lỗi
   - Thêm item vào phiên đã đóng → phải báo lỗi
   - Tạo hóa đơn cho phiên chưa có item → vẫn hợp lệ (items_cost = 0)
