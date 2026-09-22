# Thiệp cưới Nguyễn Cường & Hoàng Uyên — Long Phụng V3

Bản này đã đổi tên cô dâu/chú rể thành **Nguyễn Cường & Hoàng Uyên** và chạy hoàn toàn dạng **static site trên GitHub Pages**. Không cần `server.js`, không cần VPS.

RSVP được gửi theo luồng:

```text
Khách mở GitHub Pages
        ↓
Form Xác nhận tham dự
        ↓
Google Apps Script Web App
        ↓
Google Sheet
```

Ngoài Google Sheet, trình duyệt của khách vẫn lưu một bản RSVP trong `localStorage` để khách có thể sửa và gửi lại.

## File quan trọng

- `index.html` — giao diện thiệp
- `styles.css` — giao diện + responsive + animation
- `app.js` — logic thiệp và gửi RSVP
- `config.js` — thông tin cô dâu/chú rể + URL Apps Script
- `google-apps-script/Code.gs` — backend ghi Google Sheet
- `GITHUB_GOOGLE_SHEETS_SETUP.md` — hướng dẫn triển khai chi tiết

## Chạy thử giao diện ở máy local

Có thể dùng VS Code Live Server hoặc:

```bash
python -m http.server 8080
```

Mở:

```text
http://localhost:8080
```

Lưu ý: muốn RSVP ghi vào Google Sheet thì phải cấu hình `rsvp.endpoint` trong `config.js`.

## Dữ liệu Google Sheet

Apps Script tự tạo hai tab:

- `RSVP`: danh sách chi tiết khách mời
- `TỔNG HỢP`: tổng phản hồi, số người tham dự, tổng khách dự kiến, phân nhóm nhà trai/nhà gái

Nếu khách gửi lại trên cùng thiết bị, Apps Script cập nhật dòng cũ theo `Client ID`. Nếu khách đổi thiết bị nhưng nhập cùng số điện thoại, hệ thống cũng ưu tiên cập nhật dòng cũ.

## Bảo mật

Không đặt Google API key, GitHub token hoặc mật khẩu quản trị vào JavaScript public. Web App RSVP được thiết kế chỉ để **ghi form** vào Google Sheet; quyền xem Sheet vẫn do tài khoản Google của bạn kiểm soát.


## Quy ước tên trong giao diện

- Tên hiển thị: **Nguyễn Cường** / **Hoàng Uyên**
- Tên viết hoa: **NGUYỄN CƯỜNG** / **HOÀNG UYÊN**
- Họ tên đầy đủ: **Nguyễn Văn Cường** / **Hoàng Thị Uyên**
- Muốn đổi tiếp chỉ cần sửa object `couple` trong `config.js`.

> Lưu ý: tên cô dâu/chú rể đã được cập nhật theo yêu cầu. Thông tin phụ huynh, ngày giờ, địa điểm, số tài khoản và QR vẫn là dữ liệu mẫu của bản trước; hãy thay trong `config.js`/assets trước khi public chính thức.
