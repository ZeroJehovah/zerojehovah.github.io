const WEEK_ARRAY = ["日", "一", "二", "三", "四", "五", "六"];
let all_birthday;
let all_role;
let all_weapon;
let follow_role;
let follow_weapon;
const date = new Date();

$(function () {
    initTitleDate();
    initAllData();
    initCustomData();
    initEvent();
    showData();
});

function initTitleDate() {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let week = date.getDay();
    let title = $("#date");
    title.text(year + "年" + month + "月" + day + "日 星期" + WEEK_ARRAY[week]);
}

function initAllData() {
    let version = localStorage.getItem("calc-data-version");
    if (version && version === $("#date").text()) {
        let all_data = localStorage.getItem("all-data");
        if (all_data) {
            all_data = JSON.parse(all_data);
            all_birthday = all_data.birthday;
            all_role = all_data.role;
            all_weapon = all_data.weapon;
            return;
        }
    }
    findAllData();
}

function findAllData() {
    let result = ajax_get("https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/get_activity_calendar?app_sn=ys_obc");
    let list = result.data.list;
    all_birthday = {};
    all_role = [];
    all_weapon = [];
    for (let i = 0; i < list.length; i++) {
        if (ROLE_BLACKLIST.indexOf(list[i].content_id) > -1) {
            continue;
        }
        if (list[i].kind === "4") {
            // 生日
            let date = new Date(list[i].start_time * 1000);
            let month = date.getMonth();
            let day = date.getDate();
            all_birthday[month] = all_birthday[month] ? all_birthday[month] : {};
            if (all_birthday[month][day] && all_birthday[month][day].start_time > list[i].start_time) {
                continue;
            }
            all_birthday[month][day] = {
                title: list[i].title,
                content_id: list[i].content_id,
                link: "https://bbs.mihoyo.com/ys/obc/content/" + list[i].content_id + "/detail",
                month: date.getMonth(),
                day: date.getDate()
            };
        } else if (list[i].kind === "2") {
            let sort = JSON.parse(list[i].sort)["0"];
            let item = {
                title: list[i].title,
                img_url: list[i].img_url,
                content_id: list[i].content_id,
                link: "https://bbs.mihoyo.com/ys/obc/content/" + list[i].content_id + "/detail",
                drop_day: list[i].drop_day,
                sort: sort
            };
            if (list[i].break_type === "2") {
                // 角色
                all_role.push(item);
            }
            if (list[i].break_type === "1") {
                // 武器
                all_weapon.push(item);
            }
        }
    }
    all_role.sort(compareFn);
    all_weapon.sort(compareFn);
    console.log("calc: 已从米游社获取数据")
    // console.log(all_birthday);
    // console.log(all_role);
    // console.log(all_weapon);
    localStorage.setItem("all-data", JSON.stringify({
        birthday: all_birthday,
        role: all_role,
        weapon: all_weapon
    }));
    localStorage.setItem("calc-data-version", $("#date").text());
}

function initCustomData() {
    let custom_data = localStorage.getItem("custom-data");
    if (custom_data) {
        custom_data = JSON.parse(custom_data);
        follow_role = custom_data.role;
        follow_weapon = custom_data.weapon;
    } else {
        follow_role = [];
        follow_weapon = [];
    }
}

function initEvent() {
    $('#calc-config').on('show.bs.modal', function () {
        if ($("#role-break-config>div").length === 0) {
            let role_config = $("#role-break-config");
            for (let i = 0; i < all_role.length; i++) {
                let checkbox = $("<div><img alt='" + all_role[i].title + "' title='" + all_role[i].title + "' src='" + all_role[i].img_url + "'><div></div></div>");
                checkbox.attr("content-id", all_role[i].content_id);
                if (follow_role.indexOf(all_role[i].content_id) > -1) {
                    checkbox.addClass("selected");
                }
                role_config.append(checkbox);
            }
            let weapon_config = $("#weapon-break-config");
            for (let i = 0; i < all_weapon.length; i++) {
                let checkbox = $("<div><img alt='" + all_weapon[i].title + "' title='" + all_weapon[i].title + "' src='" + all_weapon[i].img_url + "'><div></div></div>");
                checkbox.attr("content-id", all_weapon[i].content_id);
                if (follow_weapon.indexOf(all_weapon[i].content_id) > -1) {
                    checkbox.addClass("selected");
                }
                weapon_config.append(checkbox);
            }
        }
        $("#role-break-config>div, #weapon-break-config>div").click(function () {
            $(this).toggleClass("selected");
        });
    }).on('hide.bs.modal', function () {
        let seleted_role = $("#role-break-config>div.selected");
        follow_role = [];
        follow_weapon = [];
        for (let i = 0; i < seleted_role.length; i++) {
            follow_role.push(seleted_role.eq(i).attr("content-id"));
        }
        let seleted_weapon = $("#weapon-break-config>div.selected");
        for (let i = 0; i < seleted_weapon.length; i++) {
            follow_weapon.push(seleted_weapon.eq(i).attr("content-id"));
        }
        localStorage.setItem("custom-data", JSON.stringify({
            role: follow_role,
            weapon: follow_weapon
        }));
        location.reload();
    });
}

function showData() {
    let month = date.getMonth(), day = date.getDate();
    let birthday = $("#birthday-notice");
    if (all_birthday[month] && all_birthday[month][day]) {
        birthday.text(all_birthday[month][day].title);
        birthday.removeClass("hide");
    }
    let week = date.getDay() === 0 ? "7" : String(date.getDay());
    let role = $("#role-break");
    for (let i = 0; i < all_role.length; i++) {
        if (all_role[i].drop_day.indexOf(week) > -1 && (follow_role.length === 0 || follow_role.indexOf(all_role[i].content_id) > -1)) {
            let a = $("<a href='" + all_role[i].link + "' target='_blank' title='" + all_role[i].title + "'><img alt='" + all_role[i].title + "' src='" + all_role[i].img_url + "'></a>");
            role.append(a).removeClass("hide");
        }
    }
    let weapon = $("#weapon-break");
    for (let i = 0; i < all_weapon.length; i++) {
        if (all_weapon[i].drop_day.indexOf(week) > -1 && (follow_weapon.length === 0 || follow_weapon.indexOf(all_weapon[i].content_id) > -1)) {
            let a = $("<a href='" + all_weapon[i].link + "' target='_blank' title='" + all_weapon[i].title + "'><img alt='" + all_weapon[i].title + "' src='" + all_weapon[i].img_url + "'></a>");
            weapon.append(a).removeClass("hide");
        }
    }
    if (!role.find("img").length && !weapon.find("img").length) {
        $("#empty-notice").removeClass("hide");
    }
}

function ajax_get(url) {
    let response;
    $.ajax({
        url: url,
        type: "GET",
        async: false,
        success: function (data) {
            response = data;
        }
    });
    return response;
}

function compareFn(a, b) {
    if (a.sort && b.sort) {
        return a.sort - b.sort;
    }
    return 0;
}