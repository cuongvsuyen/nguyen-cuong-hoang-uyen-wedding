window.WEDDING_CONFIG = {
  theme: {
    background: '#7A0014',
    gateGradient: 'linear-gradient(to bottom right, #710001, #5a0001, #450001)',
    primary: '#FFBE89',
    secondary: '#D4AF37'
  },

  /* ================= CÔ DÂU - CHÚ RỂ ================= */
  couple: {
    groomShort: 'Nguyễn Cường',
    groomUpper: 'NGUYỄN CƯỜNG',
    groomFull: 'Nguyễn Văn Cường',
    groomBirthOrder: 'TRƯỞNG NAM',

    brideShort: 'Hoàng Uyên',
    brideUpper: 'HOÀNG UYÊN',
    brideFull: 'Hoàng Thị Uyên',
    brideBirthOrder: 'ÚT NỮ'
  },

  /* ================= GIA ĐÌNH ================= */
  families: {
    groom: {
      sideTitle: 'NHÀ TRAI',
      parentTitle: 'Ông Bà',
      father: 'Nguyễn Văn Thường',
      mother: 'Lê Thị Tâm',
      address: 'Số 10 Đường Đồng Cạn, Thôn Quản Xá, Xã Thiệu Quang, Tỉnh Thanh Hóa',
      // Nếu muốn bấm vào địa chỉ để mở Google Maps thì dán link vào đây.
      mapUrl: 'https://maps.app.goo.gl/e18QqAY323C6eNw88?g_st=ifm'
    },
    bride: {
      sideTitle: 'NHÀ GÁI',
      parentTitle: 'Ông Bà',
      father: 'Hoàng Văn Qúy',
      mother: 'Đinh Thị Hiền',
      address: 'Thôn Hà Thịnh, Xã Văn Chấn, Tỉnh Lào Cai',
      mapUrl: 'https://maps.app.goo.gl/N3DvANmp5AZgwFDG9?g_st=ifm'
    }
  },

  announcement: {
    line1: 'TRÂN TRỌNG BÁO TIN',
    line2: 'LỄ THÀNH HÔN CỦA CHÚNG TÔI'
  },

  /* ================= LỄ THÀNH HÔN ================= */
  ceremony: {
    date: '2026-11-13',
    time: '09:00',
    header: 'LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI\nTƯ GIA NHÀ TRAI',
    lunar: 'Tức ngày 07 tháng 10 năm Bính Ngọ'
  },

  /* ================= TIỆC CƯỚI ================= */
  reception: {
    date: '2026-11-13',
    banquetTime: '11:00',
    guestReceptionTime: '09:00',
    partyLabel: 'Tiệc cưới sẽ diễn ra vào lúc:',
    lunar: 'Tức ngày 07 tháng 10 năm Bính Ngọ',
    venuePrefix: 'Tiệc cưới sẽ tổ chức tại',
    venue: 'TƯ GIA NHÀ TRAI',

    // Google Maps: có thể dán link Google Maps thật vào directionsUrl.
    directionsUrl: 'https://maps.app.goo.gl/e18QqAY323C6eNw88?g_st=ifm',
    // Embed URL dùng cho iframe bản đồ trên thiệp.
    mapEmbedUrl: 'https://www.google.com/maps?q=19.8935278,105.72425&z=17&output=embed'
  },

  // dresscode: {
  //   title: 'DRESS CODE',
  //   subtitle: 'Trang phục dự tiệc',
  //   colors: ['#FFFFFF', '#E89050', '#E87070', '#7A4020']
  // },

  timeline: [
    { time: '09:00', label: 'Đón khách' },
    { time: '09:30', label: 'Rước Dâu' },
    { time: '10:00', label: 'Bắt đầu lễ cưới' },
    { time: '10:30', label: 'Rót rượu, cắt bánh' },
    { time: '11:00', label: 'Khai tiệc' },
    { time: '13:00', label: 'Kết thúc tiệc' }
  ],

  /* ================= ẢNH =================
     Có thể dùng:
       - file trong project: assets/photos/hero.jpg
       - hoặc URL trực tiếp: https://example.com/photo.jpg
  */
  images: {
    hero: 'assets/photos/hero.jpg',
    gallery: [
      'assets/photos/gallery-01.jpg',
      'assets/photos/gallery-02.jpg',
      'assets/photos/gallery-03.jpg',
      'assets/photos/gallery-04.jpg',
      'assets/photos/gallery-05.jpg',
      'assets/photos/gallery-06.jpg',
      'assets/photos/gallery-07.jpg',
      'assets/photos/gallery-08.jpg',
      'assets/photos/gallery-09.jpg',
      'assets/photos/gallery-10.jpg'
    ]
  },

  /* Asset giao diện. Thường không cần đổi khi chỉ thay thông tin đám cưới. */
  assets: {
    chuHy: 'assets/theme/chu-hy.webp',
    phung: 'assets/theme/phung.webp',
    rong: 'assets/theme/rong.webp',
    chimEn: 'assets/theme/chim-en.webp',
    frame: 'assets/theme/frame.svg',
    frameTitle: 'assets/theme/frame-title.svg',
    frameCalendar: 'assets/theme/frame-calendar.webp',
    giftEnvelope: 'assets/theme/dragon_phoenix_v3.webp'
  },

  /* ================= NHẠC ================= */
  music: {
    title: 'Lễ Đường',
    artist: 'Kai Đinh',
    // url: 'https://cdn.chungdoi.com/music/le-duong.mp3',
    url: 'assets/mp3/motdoi.mp3',
    startTime: 59,
    endTime: 249,
    volume: 0.5
  },

  /* ================= MỪNG CƯỚI / QR ================= */
  bankCards: [
    {
      role: 'Chú rể',
      bank: 'LPBank',
      account: '0353528698',
      name: 'NGUYEN VAN CUONG',
      qr: 'assets/qr/cuong.jpg'
    },
    {
      role: 'Cô dâu',
      bank: 'Vietinbank',
      account: '102873523921',
      name: 'HOANG THI UYEN',
      qr: 'assets/qr/uyen.jpg'
    }
  ],

  /* ================= RSVP GOOGLE SHEETS ================= */
  rsvp: {
    provider: 'google-sheets',
    endpoint: 'https://script.google.com/macros/s/AKfycbzO56TIP_J3fOkX8TjtTDfIjtIdbcLXcjJ3xtEPxDfcLpj4_xNL72PN3NZLwIE8I-0n/exec',
    formVersion: 'github-pages-google-sheets-v1'
  },

  comments: [
    // { name: 'Gia đình cô Lan', message: 'Chúc hai cháu trăm năm hạnh phúc, sớm sinh quý tử!' },
    // { name: 'Bạn thân của cô dâu', message: 'Chúc mừng hai bạn về chung một nhà. Mong hai bạn luôn yêu thương nhau như ngày đầu!' },
    // { name: 'Anh Minh', message: 'Nhìn thiệp mà thấy ấm áp ghê. Chúc đám cưới thật trọn vẹn nhé!' },
    // { name: 'Chị Hương', message: 'Chúc cô dâu chú rể trăm năm hảo hợp, gia đình luôn đầm ấm.' },
    // { name: 'Văn Minh Hân', message: 'Chúc hai vợ chồng trăm năm hạnh phúc, răng long bạc đầu!' }
  ],

  thankYou: 'Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!'
};
