const images = [];

function get_images() {

    $.ajax({ //jquery ajax
        type: "post", //get방식으로 가져오기
        url: "http://15.164.12.220/iot/galary.php", //값을 가져올 경로
        dataType: "json", //html, xml, text, script, json, jsonp 등 다양하게 쓸 수 있음
        success: function (data) {   //요청 성공시 실행될 메서드
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                var url = data[i].url;
                var date = data[i].date;
                images.push({ 'url': url, 'date': date });
            }
            console.log(images);
            display_images();


        },
        error: function (r, t, error) {		 //요청 실패시 에러 확인을 위함
            console.log("통신에러");
            console.log(error);
        }
    })
}

function display_images() {
    for (var i = 0; i < images.length; i++) {
        document.getElementById("galary").innerHTML += "<div class='image-frame'><img class='wrapper' src='data:image/jpeg;base64," + images[i].url + "'>" + "<span>" + images[i].date + "</span> </div>";

    }

}


window.addEventListener('DOMContentLoaded', function () {
    get_images();

});
