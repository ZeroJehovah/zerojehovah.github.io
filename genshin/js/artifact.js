const version = '20221128';
const imagePaths = [
    {
        title: "路线A：雪山-璃月-雨林-沙漠",
        path: "/resource/img/road-a.jpg"
    }, {
        title: "路线B：沙漠-雨林-璃月-稻妻",
        path: "/resource/img/road-b.jpg"
    }
];

function showImg() {
    let index = Math.floor((new Date() - new Date('2022-01-01')) / 24 / 60 / 60 / 1000) % imagePaths.length;
    let imagePath = imagePaths[index].path;
    let storageImages = JSON.parse(localStorage.getItem("storageImages"));
    $("#road").text(imagePaths[index].title);
    $("#artifact").append($("<a href='" + imagePath + "' target='_blank'><img alt='" + imagePaths[index].title + "' src='" + storageImages[imagePath] + "'></a>"));
}

$(function() {
    let storageVersion = localStorage.getItem("storageVersion");
    let storageImages = localStorage.getItem("storageImages");
    if (storageVersion !== version || !storageImages) {
        console.log("artifact: 初始化");
        let finishImage = 0;
        localStorage.removeItem("storageVersion");
        localStorage.removeItem("storageImages");
        localStorage.setItem("storageVersion", version);
        storageImages = {};
        for (let i = 0; i < imagePaths.length; i++) {
            let tempImg = document.createElement("img");
            tempImg.setAttribute("crossOrigin",'Anonymous')
            document.body.append(tempImg);
            tempImg.addEventListener("load", function () {
                let imgCanvas = document.createElement("canvas"),
                    imgContext = imgCanvas.getContext("2d");
                imgCanvas.width = this.width;
                imgCanvas.height = this.height;
                imgContext.drawImage(this, 0, 0);
                storageImages[imagePaths[i].path] = imgCanvas.toDataURL("image/jpeg");
                this.remove();
                imgCanvas.remove();
                finishImage++;
                if (finishImage === imagePaths.length) {
                    console.log("artifact: 加载完成");
                    localStorage.setItem("storageImages", JSON.stringify(storageImages));
                    showImg();
                }
            }, false);
            tempImg.setAttribute("src", imagePaths[i].path);
        }
    } else {
        console.log("artifact: 已初始化");
        showImg();
    }
});