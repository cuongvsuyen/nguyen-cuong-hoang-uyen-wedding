# HƯỚNG DẪN: GITHUB PAGES + GOOGLE SHEETS RSVP

## Phần A — Tạo Google Sheet để nhận RSVP

### 1. Tạo Google Sheet mới

Ví dụ đặt tên:

```text
RSVP - Nguyễn Cường & Hoàng Uyên
```

Không cần tự tạo cột.

### 2. Mở Apps Script

Trong Google Sheet:

```text
Extensions → Apps Script
```

Xóa code mặc định trong `Code.gs`.

Mở file trong project:

```text
google-apps-script/Code.gs
```

Copy toàn bộ nội dung và paste vào Apps Script.

### 3. Chạy setupRsvpSheet một lần

Trong Apps Script, chọn function:

```text
setupRsvpSheet
```

Bấm **Run**.

Lần đầu Google sẽ yêu cầu cấp quyền cho script truy cập Google Sheet của chính bạn. Sau khi chạy thành công, quay lại Sheet sẽ có:

```text
TỔNG HỢP
RSVP
```

### 4. Deploy Apps Script thành Web App

Trong Apps Script:

```text
Deploy → New deployment
```

Chọn:

```text
Select type: Web app
Execute as: Me
Who has access: Anyone
```

Bấm **Deploy**.

Copy URL có dạng:

```text
https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxx/exec
```

**Phải lấy URL kết thúc bằng `/exec`, không dùng URL `/dev`.**

### 5. Test Apps Script

Paste URL `/exec` vào trình duyệt.

Nếu đúng sẽ thấy JSON gần giống:

```json
{
  "ok": true,
  "service": "wedding-rsvp-google-sheets",
  "spreadsheet": "RSVP - Nguyễn Cường & Hoàng Uyên",
  "sheet": "RSVP"
}
```

Nếu báo chưa cấu hình, quay lại Apps Script và chạy `setupRsvpSheet()` một lần.

---

## Phần B — Gắn Google Sheet vào thiệp

Mở:

```text
config.js
```

Tìm:

```javascript
rsvp: {
  provider: 'google-sheets',
  endpoint: 'PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE',
  formVersion: 'github-pages-google-sheets-v1'
}
```

Thay `endpoint` bằng URL `/exec` vừa copy:

```javascript
rsvp: {
  provider: 'google-sheets',
  endpoint: 'https://script.google.com/macros/s/AKfycbxxxxxxxx/exec',
  formVersion: 'github-pages-google-sheets-v1'
}
```

Lưu file.

### Test trước khi push Git

Chạy:

```bash
python -m http.server 8080
```

Mở:

```text
http://localhost:8080
```

Điền RSVP thử rồi kiểm tra tab `RSVP` trong Google Sheet.

---

## Phần C — Push web lên GitHub

### 1. Tạo repository trên GitHub

Ví dụ:

```text
nguyen-cuong-hoang-uyen-wedding
```

Nên để **Public** nếu dùng GitHub Pages thông thường.

### 2. Push source

Mở terminal tại thư mục project:

```bash
git init
git add .
git commit -m "Wedding invitation with Google Sheets RSVP"
git branch -M main
git remote add origin https://github.com/USERNAME/nguyen-cuong-hoang-uyen-wedding.git
git push -u origin main
```

Đổi `USERNAME` thành GitHub username của bạn.

### 3. Bật GitHub Pages

Trong repository:

```text
Settings → Pages
```

Tại **Build and deployment**:

```text
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

Bấm **Save**.

Sau vài phút web sẽ có URL dạng:

```text
https://USERNAME.github.io/nguyen-cuong-hoang-uyen-wedding/
```

Các đường dẫn asset trong project đều là relative path nên chạy được cả khi repository không nằm ở domain root.

---

## Phần D — Gắn domain riêng (không bắt buộc)

Nếu bạn có domain, ví dụ:

```text
cuoicuongha.vn
```

Vào:

```text
GitHub repository → Settings → Pages → Custom domain
```

Nhập domain và cấu hình DNS theo hướng dẫn GitHub.

Website vẫn gửi RSVP tới cùng Google Apps Script, không cần đổi backend.

---

## Khi cập nhật Code.gs sau này

Nếu bạn sửa `Code.gs`, Apps Script Web App đang deploy **không tự lấy phiên bản code mới** nếu deployment dùng version cũ.

Vào:

```text
Deploy → Manage deployments → Edit
```

Chọn:

```text
Version → New version
```

Sau đó **Deploy** lại.

Thông thường URL `/exec` vẫn giữ nguyên, vì vậy không cần sửa `config.js`.

---

## Google Sheet lưu những gì?

Tab `RSVP` gồm:

```text
Mã RSVP
Gửi lần đầu
Cập nhật cuối
Họ và tên
Số điện thoại
Khách của
Trạng thái
Số người
Lưu ý món ăn
Lời nhắn
Trang gửi
Client ID
Phiên bản form
Thiết bị / trình duyệt
```

Tab `TỔNG HỢP` tự tính:

```text
Tổng phản hồi
Số phản hồi tham dự
Số phản hồi không tham dự
Tổng số khách dự kiến
Khách nhà trai / chú rể
Khách nhà gái / cô dâu
Bạn chung của hai bạn
```

Bạn có thể tải Excel bất kỳ lúc nào:

```text
Google Sheets → File → Download → Microsoft Excel (.xlsx)
```

hoặc CSV:

```text
File → Download → Comma Separated Values (.csv)
```

---

## Cách hệ thống chống trùng

Ưu tiên theo thứ tự:

1. `clientId` lưu trong trình duyệt của khách.
2. Nếu clientId khác nhưng số điện thoại trùng, cập nhật bản ghi cùng số điện thoại.
3. Nếu cả hai đều mới, tạo dòng mới.

Vì vậy nên khuyến khích khách nhập số điện thoại để dữ liệu sạch hơn.

---

## Lỗi thường gặp

### Form báo: "Chưa gửi được lên Google Sheet"

Kiểm tra `config.js` đã dán URL `/exec` chưa.

### URL Apps Script mở ra yêu cầu đăng nhập

Deployment chưa để:

```text
Who has access: Anyone
```

Hãy tạo deployment mới hoặc sửa deployment.

### Sheet không có dữ liệu nhưng web báo đã gửi

Mở Apps Script:

```text
Executions
```

để xem request `doPost` có lỗi không.

Ngoài ra đảm bảo bạn đã chạy:

```text
setupRsvpSheet()
```

### Sau khi sửa Code.gs nhưng web vẫn chạy code cũ

Tạo **New version** trong `Manage deployments` và deploy lại.

### Muốn đổi Google Sheet khác

Cách đơn giản nhất:

1. Tạo Apps Script từ Sheet mới.
2. Paste `Code.gs`.
3. Chạy `setupRsvpSheet()`.
4. Deploy Web App mới.
5. Thay `endpoint` trong `config.js`.
