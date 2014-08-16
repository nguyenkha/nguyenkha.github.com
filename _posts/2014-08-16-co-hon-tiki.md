---
layout: post
title: Cô hồn tiki
categories:
- blog
---

Thật ra là do bị tăng động do kết quả của vụ cô hồn tiki nên mình viết bài này xong chắc sẽ ngủ được.

Về hiệu ứng lan toả đạt được thì sự kiện này của tiki đã nhận được sự hưởng ứng của rất nhiều người. Một số đã biết sự kiện đó năm ngoái. Mình không có tham gia nhưng có nghe "chửi" hơi bị nhiều về sự kiện đó. Chắc các bạn ấy cũng hy vọng và mình cũng thế là tiki sẽ rút ra kinh nghiệm cho đợt này... Nhưng tội nghiệp cái là con số có lẽ là nhiều hơn năm ngoái x lần nào đó :)) nên lại điệp khúc sập, lag, bad gateway, mysql has gone away =)) cái này buồn cười nhất

Nói chung về mặt kỹ thuật thì mình không thể biết chính xác được những gì bên trong hệ thống, chỉ có thể đưa ra suy đoán từ những thông tin mà mình có được. Về mặt nào đó cũng thấy tiki có rút kinh nghiệm, nhưng có lẽ là chưa rút hết hoặc thời gian chuẩn bị gấp quá hay sao ấy nên đã không lường trước ngay từ đầu sự kiện "tự DDOS chính mình" này. Lần này thì trang Dzựt đã được tách ra chạy trên domain riêng và host trên cloud, lúc đầu là Google sau đó AWS - nghe ghê chưa, điện toán đám mây đó :v

1. Vấn đề thứ nhất: Bài toán chỉ mới giải quyết về vấn đề hạ tầng thôi, chứ vấn đề cốt lõi có lẽ developer không biết hoặc không tính tới (?). Chỉ có hạ tầng thôi là chưa đủ, dù máy chủ có mạnh cỡ nào thì khi số lượng người dùng lớn thì vẫn phải tính toán để chia tải. Mình phải cảm ơn một người anh đã dạy mình rất nhiều bài học về việc này cũng như dự án hiện tại đang làm khiến mình cũng phải suy tính về vấn đề này.

2. Vấn đề thứ hai: Có lẽ lúc đầu tiki đã dùng 1 EC2 (là một máy ảo chạy trên cloud). Do đã sát giờ G mà hệ thống đã quá tải và gần như sập ngay sau đó. Có lẽ quá gấp nên họ đã thêm vào ELB (hệ thống cân bằng tải của Amazon) điều này có lẽ là nguyên nhân dẫn đến việc thay đổi DNS record 2-3 lần ngay trong khi sự kiện diễn ra. Đây chính là lý do dẫn đến bức xúc cho rất nhiều bạn tham gia sự kiện này vì việc cập nhật DNS rất hiếm khi xảy ra, và khi đổi admin thường phải tính toán kỹ thời gian cache của các server DNS để không làm ảnh hưởng đến người dùng. Đằng này tiki lại đổi DNS liên tục khiến cho có người truy cập được, người lại bị trỏ vào server cũ đã đứng... dẫn đến một số người chơi liên tục dzựt được trong khi một số bạn khác lại thắc mắc tại sao không thể truy cập thì sao mà dzựt?

3. Vấn đề thứ ba: Cũng như trên vấn đề thứ nhất sửa lại dẫn đến vấn đề thứ hai, và cũng thế tiếp tục dẫn đến vấn đề thứ ba này. Có lẽ do không tính toán trước phải phân chia tải nên phần mềm phía máy chủ đã không được viết để đảm bảo tính thống nhất của dữ liệu. Đầu tiên là dẫn tới việc captcha không hoạt động đúng, khiến một số bạn phải học lại bảng chữ cái... và dĩ nhiên là rất bức xúc đó chứ, mình cũng bị mà. Hệ lụy tiếp theo của vấn đề này là dữ liệu bị đơ một khoảng thời gian như bảng xếp hạng và thực chất mình cũng dzựt lúc đó và hoàn toàn hệ thống không ghi nhận gì lúc thời điểm đó. Lúc đó mình đoán có thể dev đang freeze hệ thống để sửa vấn đề chia tải? Mình cũng rất ngạc nhiên khi thấy bảng cứ lên số mà người và phần thưởng vẫn vậy. Và cuối cùng là dữ liệu... chạy tầm bậy. Tuy mình dzựt cũng nhiều nhưng mình nhớ cái nào mình có dzựt, cái nào không... cuối cùng lại xuất hiện một số dữ liệu lạ vì mình chắc chắn không dựt sản phẩm đó mà vẫn có kết quả "xém dzụt được" mới lạ chứ?

Chắc nhiêu đó hiện tượng là đủ để người chơi nghi ngờ tính minh bạch của sự kiện. Còn mình nhìn về vấn đề kỹ thuật thì có thể thông cảm là lúc đó rối quá, sửa sao được thì sửa đại vậy... ai ngờ đâu sửa cái này lại phát sinh cái khác. Mình cũng từng thử một hệ thống không ổn định và bị các bạn sinh viên phần nàn crash liên túc cũng vì không kịp deadline. Nhưng có lẽ vẫn là sai lầm ngay từ đầu vì đã không tính toán kỹ nhất là đã có kinh nghiệm đau thương năm trước...

Một số thông tin thú vị mình thấy được:

* Tiki dzựt cô hồn viết bằng PHP có lẽ chạy bằng Apache hoặc PFM. Mình thấy PHP cũng không sao tuy hiệu năng không tốt bằng các ngôn ngữ khác :)

* Framework MVC là Phalcon viết bằng C native nên hiệu năng tốt hơn viết bằng PHP

* CSDL là MySQL (has gone away) và Memcached

* Máy chủ có chạy nginx phía trước Apache hoặc PFM

* Lúc đầu thì tiki chạy Google CE cũng tương tự AWS EC2. Nhưng có thể chỉ là để dev, vì cái này ở Mỹ, EC2 lúc sau thì ở Singapore. Mình thấy trang này đơn giản, nếu ngay từ đầu tính deploy trên PaaS thay vì IaaS chắc sẽ không xảy ra các vần đề như trên :)

* Máy chủ chỉ chạy PHP, static đẩy qua CDN chắc dịch vụ của Google. Tuy nhiên có vài lúc lại host thẳng trên nginx

* Client thì jQuery, Bootstrap, RequireJS. Thỉnh thoảng quên xóa Source Map nên mình thấy cả tên tác giả của phần trang sự kiện dzựt này :P

* Mình chưa xài ELB nên không biết nó thế nào, nhưng nhìn vào DNS record có thể thấy có 8 con server phía sau ELB

Tiki bảo có đến 5000 lượt online mỗi giây, có thể thực tế còn nhiều hơn nhưng bị lag bớt rồi. Tính ra là con số này không quá lớn, họ chắc cũng đã ước lượng trước có điều vẫn chưa giải quyết tốt thôi. Nói thì nghe thế thôi, chứ giả dụ giao vụ này cho mình thì mình cũng không chắc là mình làm được như họ đâu :D. Người ngoài đứng nhìn bao giờ cũng thấy là nó đơn giản mà, mình nghe nhiều rồi, nhưng trong chăn mới biết chăn có rận ạ, cứ thử đi rồi biết. Cũng thông cảm với họ là những vấn đề kỹ thuật không phải dễ dàng gì mà giải thích ngoại trừ lời xin lỗi thôi :). Mình viết bài này không hề có ý ném đá hay chỉ trích tiki, chỉ là thuần túy là chia sẻ những bài học kinh nghiệm rút ra được về mặt triển khai hệ thống thôi :)

Dẫu sao mình cũng may mắn dzựt được vài thứ :) mà mình cũng chưa biết làm gì với nó nữa :))
