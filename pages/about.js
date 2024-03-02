import UserLayout from '@/components/Layout/UserLayout';
import Thumbnail from '@/components/Utils/Thumbnail';

function About() {
    return (
        <UserLayout>
            <Thumbnail title={'Về chúng tôi'} content={'Về chúng tôi'} />
            <div className="w-10/12 max-sm:text-xs text-sm lg:text-base lg:w-8/12 mx-auto flex flex-col gap-6 lg:gap-10 max-sm:my-10 my-16">
                <section className="max-sm:w-full w-10/12 mx-auto text-secondary font-bold uppercase max-sm:text-base text-xl lg:text-2xl text-center">
                    Ngôi nhà của bạn nên là một câu chuyện về con người bạn và là một bộ sưu tập những gì bạn yêu thích.
                </section>

                <section className="font-normal text-justify flex flex-col gap-8">
                    <p>
                        Trước đây, việc mua các mặt hàng trang trí nội thất đã từng gặp nhiều khó khăn vì phải đến các
                        cửa hàng trực tiếp để lựa chọn sản phẩm phù hợp với không gian dự định. Tuy nhiên, với sự ra đời
                        của World Wide Web (WWW) vào những năm 1990, thương mại điện tử đã trở thành một tiến bộ đáng
                        kể, giúp giải quyết một phần thách thức này. Nhiều trang web mua sắm trực tuyến đã ra đời, tạo
                        điều kiện thuận lợi hơn cho việc mua sắm. Tuy nhiên, vẫn còn tồn tại những hạn chế, như không
                        thể kiểm tra chất lượng sản phẩm trước khi mua và không thể đảm bảo sản phẩm phù hợp với không
                        gian mong muốn. Đó chính là lý do Dự án TKDecor ra đời - sử dụng công nghệ thực tế tăng cường để
                        cung cấp trải nghiệm mua sắm trang trí nội thất tốt nhất cho người dùng.
                    </p>
                    {/* <img src="/assets/svg/about_thumbnail.svg" alt="thumbnails" /> */}
                    <video autoPlay loop muted>
                        <source src="/assets/video/video_tkdecor.mp4" />
                    </video>
                </section>

                <section className="flex flex-col gap-4">
                    <h3 className="font-semibold max-sm:text-sm text-lg">CÂU CHUYỆN VỀ CHÚNG TÔI</h3>
                    <div className="flex justify-between max-sm:gap-6 gap-20 text-justify max-sm:flex-wrap">
                        <p>
                            TKDecor là dự án đáng chú ý được khởi xướng để giải quyết những khó khăn chung mà người mua
                            hàng thường gặp phải khi mua đồ trang trí nội thất. Thay vì phải di chuyển đến các cửa hàng
                            thực tế để tìm kiếm sản phẩm phù hợp, TKDecor mang đến một giải pháp đột phá bằng việc sử
                            dụng công nghệ thực tế tăng cường. Khi tương tác với mô hình 3D được cung cấp bởi TKDecor.
                        </p>
                        <p>
                            Người dùng có thể hình dung rõ ràng và sinh động về cách sản phẩm trang trí sẽ trông như thế
                            nào khi đặt vào không gian dự định. Ví dụ, một gia đình dự định chuyển đến một căn hộ có các
                            phòng có kích thước và không gian khác nhau, cùng với những sở thích riêng của từng thành
                            viên. Thông qua TKDecor, họ có thể trải nghiệm như đang thăm một cửa hàng trang trí nội thất
                            trực tuyến, dễ dàng lựa chọn các vật dụng phù hợp với không gian và thích ứng với các kích
                            thước cụ thể.
                        </p>
                    </div>
                </section>
                <section className="flex flex-col gap-4 text-justify">
                    <h3 className="font-semibold max-sm:text-sm text-lg">MỤC ĐÍCH CỦA CHÚNG TÔI</h3>
                    <p>
                        Mục tiêu hàng đầu của TKDecor là mang đến trải nghiệm mua sắm tốt nhất cho khách hàng. Dự án này
                        không chỉ đơn thuần là một trang web mua bán trực tuyến, mà là một nền tảng sáng tạo kết hợp
                        giữa công nghệ thực tế tăng cường và trang trí nội thất. lựa chọn tuyệt vời cho những ai muốn
                        trang trí nhà cửa một cách dễ dàng, chính xác và hiệu quả. Chúng tôi muốn giải quyết hai vấn đề
                        chính mà người mua hàng thường gặp phải.
                    </p>

                    <p>
                        Thứ nhất, việc không thể kiểm tra chất lượng và xuất xứ của sản phẩm trước khi mua là một vấn đề
                        lớn khi mua sắm trực tuyến. Với TKDecor, khách hàng có thể xem chi tiết sản phẩm thông qua mô
                        hình 3D chân thực, giúp họ tự tin hơn trong việc lựa chọn sản phẩm phù hợp với không gian của
                        mình.
                    </p>
                    <p>
                        Thứ hai, việc không thể chắc chắn sản phẩm mua có phù hợp với không gian dự định hay không, gây
                        ra tình trạng phải trả lại hàng hoặc sửa chữa. TKDecor giúp khách hàng tránh tình trạng này bằng
                        cách cho phép họ đặt các sản phẩm trang trí vào không gian thực tế, tạo ra những hình ảnh trực
                        quan và sinh động. Nhờ đó, khách hàng có cái nhìn tổng quan và rõ ràng về việc sắp xếp và trang
                        trí căn phòng một cách hiệu quả.
                    </p>
                </section>
                <section className="flex flex-col gap-4 text-justify">
                    <h3 className="font-semibold max-sm:text-sm text-lg">TÓM LẠI</h3>
                    <p>
                        TKDecor hướng tới việc cải thiện trải nghiệm mua sắm trang trí nội thất bằng cách ứng dụng công
                        nghệ thực tế tăng cường vào quy trình mua sắm trực tuyến. Chúng tôi tin rằng đây sẽ là lựa chọn
                        tuyệt vời cho những ai muốn trang trí nhà cửa một cách dễ dàng, chính xác và hiệu quả.
                    </p>
                </section>
            </div>
        </UserLayout>
    );
}

export default About;
