---
layout: post
title: Khảo sát Facebook
categories:
- blog
---

Mọi người thực hiện khảo sát tại [fb.khado.me](https://fb.khado.me), và xem kết quả dạng đồ họa tại [fb.khado.me/maps](https://fb.khado.me/maps).

**Lưu ý:**
  
  - Trường hợp bạn đang gặp khó khăn trong việc truy cập Facebook và có thể hoặc không thể vào Facebook bằng các cách khác: **TẮT** các công cụ hỗ trợ mạng riêng ảo (VPN, hide IP) hoặc Proxy, TorBrowser trên điện thoại cũng như máy tính.
  
  - Trường hợp bạn đang truy cập Facebook được bình thường cũng giúp mình làm khảo sát này vì mình mong muốn có được số liệu đầy đủ.

Con số hiển thị trong kết quả khảo sát là số lượng khảo sát thành công/hoặc thất bại trong khoảng thời gian 1 giờ trở lại.

Sau đây là phần hỏi-đáp. Mình sẽ trả lời các câu hỏi trên comment vào đây:

**1. Tại sao làm khảo sát này?**

> Tình trạng khó truy cập Facebook là CÓ, các bạn có thể hỏi các bạn mình. Mình không bàn về lý do ở đây. Qua số liệu sơ bộ mà mình có được thì có không ít bạn không thể truy cập Facebook trong vài ngày nay. Mình hy vọng có được số liệu khảo sát để thống kê về tình trạng này.

**2. Mình vẫn đang vào/không vào được Facebook?**

> Vấn đề kỹ thuật là phức tạp, và một hệ thống lớn dĩ nhiên có nhiều hệ thống con và chia theo khu vực, nhà mạng. Một sự thay đổi không nhất thiết phải đồng bộ. Vấn đề xảy ra với tôi, không nhất thiết xảy ra với bạn và ngược lại. Nên theo ý kiến của mình không cần đặt câu "hỏi": Mình đang vào/không vào được mà? Mình không thể trả lời các câu hỏi này vì câu trả lời nằm bên trong "hộp đen", mình không thể biết được.

**3. Khảo sát thu thập những thông tin nào?**

> Mình thu thập IP, trình duyệt bạn sử dụng (Chrome, Safari...), vị trí và tình trạng truy cập Facebook từ thiết bị bạn sử dụng. Riêng vị trí bạn có thể cung cấp hoặc không cung cấp, cũng như phụ thuộc vào thiết bị của bạn có khả năng cung cấp vị trí hay không.

> Ngoài các thông tin trên, mình không lưu giữ các định danh, trạng thái đăng nhập hay BẤT CỨ thông tin nào khác có thể xác định được bạn là ai. Do đó bạn có thể yên tâm thực hiện khảo sát.

**4. Kỹ thuật sử dụng?**

> Mình sử dụng kỹ thuật gọi API của Facebook bằng JS SDK để xác định kết nối đến Facebook có khả thi hay không. Thời gian của việc khảo sát là 7-10s tùy tốc độ của đường truyền. Sau thời gian này nếu không nhận được kết quả mình ghi nhận thiết bị của bạn gặp vấn đề khi truy cập Facebook. Do đó sai sót có thể xảy ra khi đường truyền chậm. Tuy nhiên bạn có thể giữ nguyên trang web để cập nhật tình trạng mới nhất của mình.


> Mã nguồn sẽ được công khai trên sau khi mình sắp xếp lại, do nảy sinh ý tưởng nhanh nên mình đã bỏ qua một số công việc trong việc tổ chức mã nguồn.

**5. Mình không truy cập được trang web khảo sát trên một số thiết bị?**

> Có lẽ hơi vô ích, nhưng nếu bạn không truy cập được trang web khảo sát thì bạn cũng không đọc được những dòng này. Nhưng hy vọng bạn có thể đọc được trên những dòng này và thông cảm. Vì hệ thống khảo sát được bảo vệ bởi Cloudflare sử dụng gói miễn phí, nên không hỗ trợ mình số trình duyệt hoặc thiết bị cũ/không phổ biến.

**6. Có thiên lệch không khi những người lên Facebook được thì làm khảo sát dĩ nhiên thành công?**

> Tình trạng mình gặp là "chập chờn", nghĩa là lúc được lúc không, do đó không hẳn là bị thiên lệch về thành công. Hơn nữa mỗi người có 2-3 thiết bị sử dụng các nhà mạng khác nhau, do đó khả năng bạn vẫn nhận được thông tin này, bạn có thể thực hiện khảo sát trên tất cả thiết bị thì càng tốt. Cuối cùng thì tại VN thì Facebook là công cụ lan thông tin nhanh nhất, mình không sử dụng các kênh khác nhiều nên mình phải chấp nhận kết quả nhận được khả thi nhất có thể.