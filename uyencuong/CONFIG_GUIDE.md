# Chỉnh toàn bộ thiệp chỉ trong `config.js`

`index.html` chỉ chứa bố cục. Các dữ liệu riêng của đám cưới được lấy từ `config.js`.

## 1. Tên cô dâu / chú rể

```js
couple: {
  groomShort: 'Nguyễn Cường',
  groomUpper: 'NGUYỄN CƯỜNG',
  groomFull: 'Nguyễn Văn Cường',
  groomBirthOrder: 'ÚT NAM',

  brideShort: 'Hoàng Uyên',
  brideUpper: 'HOÀNG UYÊN',
  brideFull: 'Hoàng Thị Uyên',
  brideBirthOrder: 'TRƯỞNG NỮ'
}
```

## 2. Bố mẹ, địa chỉ và link Google Maps

```js
families: {
  groom: {
    parentTitle: 'Ông Bà',
    father: 'Nguyễn Văn Hùng',
    mother: 'Lê Thị Thu',
    address: '45 Phố Huế, Hai Bà Trưng, Hà Nội',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=45+Pho+Hue+Hai+Ba+Trung+Ha+Noi'
  }
}
```

`mapUrl` có thể là link Google Maps bạn copy trực tiếp từ nút **Chia sẻ**.

## 3. Địa điểm tiệc và Google Maps

```js
reception: {
  venue: 'Tên nhà hàng / địa điểm',
  directionsUrl: 'LINK_GOOGLE_MAPS_CHIA_SE',
  mapEmbedUrl: 'https://www.google.com/maps?q=...&output=embed'
}
```

- `directionsUrl`: dùng cho nút **CHỈ ĐƯỜNG**.
- `mapEmbedUrl`: dùng để hiển thị bản đồ ngay trong thiệp.

## 4. Ảnh hero và album

Có thể dùng file trong project:

```js
images: {
  hero: 'assets/photos/hero.jpg',
  gallery: [
    'assets/photos/gallery-01.jpg',
    'assets/photos/gallery-02.jpg'
  ]
}
```

Hoặc dùng URL ảnh trực tiếp:

```js
images: {
  hero: 'https://example.com/hero.jpg',
  gallery: [
    'https://example.com/photo-01.jpg',
    'https://example.com/photo-02.jpg'
  ]
}
```

Nên dùng URL HTTPS công khai, không cần đăng nhập.

## 5. QR ngân hàng

```js
bankCards: [
  {
    role: 'Chú rể',
    bank: 'BIDV',
    account: '0123456789',
    name: 'NGUYỄN CƯỜNG',
    qr: 'assets/qr/groom.png'
  }
]
```

`qr` cũng có thể là URL ảnh HTTPS. Nếu server ảnh không cho phép tải trực tiếp (CORS), nút **Lưu QR** sẽ mở ảnh ở tab mới để người dùng lưu.

## 6. Nhạc

```js
music: {
  title: 'Tên bài hát',
  artist: 'Ca sĩ',
  url: 'https://example.com/music.mp3',
  startTime: 0,
  endTime: 240,
  volume: 0.5
}
```

## 7. Asset theme

Thông thường không cần đổi, nhưng cũng đã đưa vào config:

```js
assets: {
  chuHy: 'assets/theme/chu-hy.webp',
  phung: 'assets/theme/phung.webp',
  rong: 'assets/theme/rong.webp',
  chimEn: 'assets/theme/chim-en.webp',
  frame: 'assets/theme/frame.svg',
  frameTitle: 'assets/theme/frame-title.svg',
  frameCalendar: 'assets/theme/frame-calendar.webp',
  giftEnvelope: 'assets/theme/dragon_phoenix_v3.webp'
}
```

## 8. Sau khi sửa config

Chỉ cần commit/push lại `config.js` lên GitHub. GitHub Pages sẽ tự cập nhật sau khi deploy xong.
