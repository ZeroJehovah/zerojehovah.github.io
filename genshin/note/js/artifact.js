const artifact_version = '20221129';
const artifact_image_path = [
    {
        title: "雪山(2)-璃月(7)-雨林(7)-沙漠(3)",
        path: "/resource/img/road-a.jpg"
    }, {
        title: "沙漠(1)-雨林(5)-璃月(2)-稻妻(12)",
        path: "/resource/img/road-b.jpg"
    }
];

function artifact_show_image() {
    let index = Math.floor((new Date() - new Date('2022-01-01')) / 24 / 60 / 60 / 1000) % artifact_image_path.length;
    let image_path = artifact_image_path[index].path;
    let storage_images = JSON.parse(localStorage.getItem("artifact-images"));
    $("#road").text("今日圣遗物路线：" + artifact_image_path[index].title);
    let panel = $("#artifact");
    panel.append($("<a href='" + image_path + "' target='_blank'><img alt='" + artifact_image_path[index].title + "' src='" + storage_images[image_path] + "'></a>"));
    panel.removeClass("hidden");
}

$(function () {
    let storage_version = localStorage.getItem("artifact-version");
    let storage_images = localStorage.getItem("artifact-images");
    if (storage_version !== artifact_version || !storage_images) {
        console.log("artifact: 初始化");
        let finish_image = 0;
        localStorage.removeItem("artifact-version");
        localStorage.removeItem("artifact-images");
        localStorage.setItem("artifact-version", artifact_version);
        storage_images = {};
        for (let i = 0; i < artifact_image_path.length; i++) {
            let temp_image = document.createElement("img");
            temp_image.setAttribute("crossOrigin", 'Anonymous')
            document.body.append(temp_image);
            temp_image.addEventListener("load", function () {
                let image_canvas = document.createElement("canvas");
                let image_context = image_canvas.getContext("2d");
                image_canvas.width = this.width;
                image_canvas.height = this.height;
                image_context.drawImage(this, 0, 0);
                storage_images[artifact_image_path[i].path] = image_canvas.toDataURL("image/jpeg");
                this.remove();
                image_canvas.remove();
                finish_image++;
                if (finish_image === artifact_image_path.length) {
                    console.log("artifact: 加载完成");
                    localStorage.setItem("artifact-images", JSON.stringify(storage_images));
                    artifact_show_image();
                }
            }, false);
            temp_image.setAttribute("src", artifact_image_path[i].path);
        }
    } else {
        console.log("artifact: 已初始化");
        artifact_show_image();
    }
});