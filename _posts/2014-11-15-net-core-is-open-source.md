---
layout: post
title: .NET is open source
categories:
- blog
---

Nói trước: Mình không phải là fan cuồng của M$ nhé!

Cách đây thậm chí chỉ vài năm có lẽ không ai nghĩ rằng có ngày Microsoft sẽ open source .NET. Còn theo những xu hướng gần đây thì có thể thấy được việc này không có gì quá sốc. Microsoft đã open source lần lượt các thành phần bổ sung cho .NET và ASP.net mà quan trọng nhất là Entity Framework [[1]] và ASP.net MVC [[2]] và sau đó là một compiler mới cho C# với tên Roslyn [[3]] và xây dựng [.NET Foundation](http://www.dotnetfoundation.org/) để hỗ trợ cho các dự án open source .NET của Micrsoft và cộng đồng, kể cả Mono của Xamarin. Bên cạnh đó hãng cũng tăng dần việc hợp tác với Xamarin - công ty đứng sau [Mono](http://www.mono-project.com/). 

Có thể thấy là ngay từ đầu Microsoft đã không "dìm" Ximian, Novell hay Xamarin khi họ phát triển Mono, mang .NET đến Linux, Mac và hấp dẫn nhất là iOS và Android. Bạn có còn nhớ vụ dây dưa giữa Google và Oracle chỉ vì Google tạo ra runtime Java mà không được hội đồng Java - Oracle "cho phép". Nhưng may mắn hay kết quả của vụ việc trên là Google chỉ phải bồi thường vì vài dòng code giống hệt bản Java của Oracle [[4]]. Nhưng Microsoft có lẽ thấy được tiềm năng, hoặc họ đã bỏ qua Mono chỉ vì không thấy những gì mà Mono có thể làm được hơn họ. Thậm chí, khi Mono ra Moonlight - bản Silverlight cho các hệ điều hành khác Windows, họ còn sẵn sàng cung tests để Mono hoàn thiện Moonlight. Trường hợp của Silverlight khác với ứng dụng .NET thông thường, nó là dựa trên web, nên chắc chắn phải chạy được trên nhiều thiết bị, trình duyệt, hệ điều hành. Haha, có lẽ rằng họ thấy rằng: "Ôi, sướng quá, ngồi không có anh khác làm dùm mình, quá khỏe!". Mình nhớ đã đọc đâu đó, Microsoft đã bảo rẳng họ không quan tâm lắm đến Mono, cũng không kiện cáo làm gì. Mặc dù, đặc tả C#, .NET là chuẩn mở, nhưng rất nhiều phần của .NET vẫn thuộc dạng lập lờ, nếu chỉ dùng những gì đúng là mở thì khó có khả năng tạo ra một runtime hoàn chỉnh. Do đó một số bản phân phối Linux đã tranh cãi về tình trạng pháp lý của Mono. À, nói đến đây chắc bạn cũng ngạc nhiên là tại sao lại có Mono trên Linux, thật ra nhiều bản Linux kèm theo Mono lắm, một số ứng dụng viết riêng cho Linux lại viết bằng C# và chạy trên Mono và dĩ nhiên không dùng giao diện Windows Form. Còn lại thì mình cũng không biết rằng có mấy site nào chạy ASP.net trên Mono thực tế không, có vẻ không phổ biến lắm...

Thế rồi làn sóng ứng dụng smartphone phát triển như vũ bão. Novell và sau này là Xamarin (lại là một câu chuyện khác), đưa ra khả năng phát triển ứng dụng cho iOS và Android bằng C#. Và kiếm được bộn tiền từ đó! Vì sao, Mono mã nguồn mở và miễn phí mà! Làm sao họ kiếm tiền được! Câu trả lời đơn giản, họ dựa vào lợi thế là chủ sở hữu của Mono và giấy phép mã nguồn mở cho phép họ buộc những ai sử dụng C# cho iOS và Android phải trả cho họ một khoản tiền để được cấp giấy phép riêng, nếu không bị buộc phải phát hành ứng dụng của mình với giấy phép mã nguồn mở tương tự (GPL). Quá hay, rõ ràng nếu không có cách này, mình không biết họ có thể kiếm tiền với Mono trên desktop như thế nào! Haha, đến đây thì Microsoft đã thấy thèm rồi, một ngôn ngữ do họ tạo ra, nhưng người khác lại kiếm được bộn tiền từ đó. Lúc này ai cũng nghĩ rằng rồi sẽ có một vụ như Oracle-Google (khi chưa có phán quyết). Tuy nhiên, phải nó là may mắn, hay Microsoft bây giờ là một anh chàng tốt bụng (ai rồi cũng khác =))): hợp tác với Xamarin. Vì thế mà chẳng có một vụ kiện nào xảy ra. Mọi người thì nghĩ chắc vài bữa nữa Microsoft sẽ mua luôn Xamarin cho chắc!

Với sự phát triển của hệ thống mã nguồn mở, các máy chủ chạy Linux là gần như mặc nhiên, máy chủ Windows thì lại có phí bản quyền, quá đắt. Bản thân chính Microsoft cũng phải thêm hỗ trợ Linux cho nền tảng điện toán đám mây Azure của họ (điều mà họ vừa rồi rất tự hào tuyên bố). Có lẽ, Microsoft đã nhận ra rằng họ không thể đứng một mình một chợ nữa, Linux đầy ra đó, họ phải hỗ trợ thôi. Thế rồi open source Entity Framework và ASP.net MVC, cộng thêm Mono nữa là khỏi cần Windows để chạy và cũng hợp pháp. Nhưng có lẽ Mono vẫn không đủ để cộng đồng tin tưởng một nền tảng Web ổn định cho ASP.net trên máy chủ Linux. Và cuối cùng Microsoft đã tuyên bố, chuyển .NET 5 thành mã nguồn mở! Và các thành phần liên quan khác của ASP.net nữa [[5]]! Nghe sốc đó, nhưng với ai đã theo dõi tin tức thường xuyên thì động thái này không đến nỗi nằm ngoài dự đoán. Mình thì nghĩ là Microsoft sẽ mua Xamarin trước. Vậy là từ bây giờ .NET chính thức là cross-platform, không phải là ngoài lề như Mono nữa! Việc đầu tiên mình làm là... sửa lại mấy câu trong luận văn thạc sĩ =)), sắp nộp rồi mà vẫn phải sửa lại đó :)). Chắc trong vòng 1 năm nữa việc máy chủ Linux chạy ASP.net sẽ trở nên bình thường thậm chí phổ biến, chứ Mono nội cấu hình chắc đuối. Vài câu hỏi của mình sau việc này là:

  * Mono và Xamarin sẽ ra sao?

    - Có lẽ Mono đã hoàn thành nhiệm vụ của mình, nhưng vẫn sẽ tồn tại vì các bản phân phối Linux chắc cũng không thích mấy Microsoft

    - NET 5 có thể sẽ merge luôn một phần của Mono vào (viễn cảnh đẹp nhỉ :D)

  * Còn Xamarin thì sao?

    - Xamarin chắc vẫn kiếm từ iOS và Android là chính, họ có hợp tác với Microsoft nên chắc tập trung vô phần này thôi... và như mình nói đó, chắc rồi Microsoft sẽ mua luôn

  * Java, Python, Ruby...

    - Chắc sẽ có động lực để phát triển hơn, họ có thêm đối thủ cạnh trên trên máy chủ Linux rồi

  * .NET for Linux, Mac

    - Chắc Microsoft sẽ phải tung ra một bộ thư viện giao diện mới để wrap giao diện native của các hệ điều hành hành. Không biết Microsoft sẽ như thế nào, chứ Java thì chả có mấy cái được, nặng mà xấu quá!

Chắc còn nữa, mà mình không nhớ, sẽ cập nhật lại sau. Rồi phần cuối cùng là mình quá SỐC vì Microsoft hào phóng quá, tung ra bản full feature miễn phí luôn. Trước giờ xài bản Express hơi bị cùi, thiếu đủ thứ... Chắc là sẽ không tung ra VS for Mac hay Linux đâu, nhưng biết đâu những phiên bản sau.

Tóm lại là Microsoft đã không còn "Em của ngày hôm qua", họ đã thay đổi, và theo một xu hướng tích cực. Có lẽ cộng đồng mã nguồn mở sẽ có cái nhìn khác về họ sau ngày hôm nay. Mình trước giờ vẫn có một chút kỳ thị Windows và ASP.net, giờ thì đỡ rồi =)). Nhưng tương lai là không định, cứ chờ xem :D. Điểm lại vài điểm thú vị nhé:

  - Microsoft giới thiệu bản VS Community với Surface 3 và... Macbook =))

  - Source code của .NET được host trên github chứ không phải codeplex của Microsoft

  - Visual Studio hỗ trợ git (vốn do Linus Torvalds, tác giả Linux viết) mặc định 

  - Phần ASP.net cho Linux, Mac sẽ dựa trên libuv, thư viện core của Node.js

Yaah, tất nhiên bài viết thể hiện quan điểm cá nhân của mình. Đọc cho vui, thích hay không tùy bạn :D.

P.S: Biết đâu ngày nào đó Microsoft bảo, tao sẽ phát triển Windows trên nhân Linux. Đùa thôi nhé =))

[1]: http://weblogs.asp.net/scottgu/entity-framework-and-open-source "Entity Framework and Open Source"
[2]: http://weblogs.asp.net/scottgu/asp-net-mvc-web-api-razor-and-open-source "ASP.NET MVC, Web API, Razor and Open Source"
[3]: https://roslyn.codeplex.com/ ".NET Compiler Platform (Roslyn)"
[4]: http://www.computerworld.com/article/2504709/technology-law-regulation/oracle-agrees-to--zero--damages-in-google-lawsuit--eyes-appeal.html "Oracle agrees to 'zero' damages in Google lawsuit, eyes appeal"
[5]: http://news.microsoft.com/2014/11/12/microsoft-takes-net-open-source-and-cross-platform-adds-new-development-capabilities-with-visual-studio-2015-net-2015-and-visual-studio-online/ "Microsoft takes .NET open source and cross-platform, adds new development capabilities with Visual Studio 2015, .NET 2015 and Visual Studio Online"