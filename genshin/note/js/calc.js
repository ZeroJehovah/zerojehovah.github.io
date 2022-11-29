const calc_week_array = ["", "一", "二", "三", "四", "五", "六", "日"];
const calc_role = [];
const calc_weapon = [];
const calc_week = date.getDay() === 0 ? "7" : String(date.getDay());

$(function () {
    calc_init_title();
    calc_query_data();
});

function calc_init_title() {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let title = $("#date");
    title.text(year + "年" + month + "月" + day + "日 星期" + calc_week_array[calc_week]);
}

function calc_query_data() {
    $.get("https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/get_activity_calendar?app_sn=ys_obc", {
        random: date.getDate()
    }, function (data) {
        init_data(data);
    });
}

function init_data(data) {
    let list = data.data.list;
    for (let i = 0; i < list.length; i++) {
        if (list[i].kind !== "2") {
            continue;
        }
        if (list[i].drop_day.indexOf(calc_week) === -1) {
            continue;
        }
        if (list[i].break_type === "2" && FOLLOW_ROLE.indexOf(list[i].title) > -1) {
            calc_role.push(list[i]);
        } else if (list[i].break_type === "1" && FOLLOW_WEAPON.indexOf(list[i].title) > -1) {
            calc_weapon.push(list[i]);
        }
    }
    calc_role.sort(calc_compare);
    calc_weapon.sort(calc_compare);
    console.log("calc: 已从米游社获取数据")
    console.groupCollapsed("calc-data");
    console.log(calc_role);
    console.log(calc_weapon);
    console.groupEnd();
    show_data();
}

function show_data() {
    let break_list = $("#break-list");
    for (let i = 0; i < calc_role.length; i++) {
        let title = calc_role[i].title;
        let link = "https://bbs.mihoyo.com/ys/obc/content/" + calc_role[i].content_id + "/detail";
        let img_url = calc_role[i].img_url;
        let a = $("<a href='" + link + "' target='_blank' title='" + title + "'><img alt='" + title + "' src='" + img_url + "'></a>");
        break_list.append(a).removeClass("hidden");
    }
    for (let i = 0; i < calc_weapon.length; i++) {
        let title = calc_weapon[i].title;
        let link = "https://bbs.mihoyo.com/ys/obc/content/" + calc_weapon[i].content_id + "/detail";
        let img_url = calc_weapon[i].img_url;
        let a = $("<a href='" + link + "' target='_blank' title='" + title + "'><img alt='" + title + "' src='" + img_url + "'></a>");
        break_list.append(a).removeClass("hidden");
    }
    if (!break_list.find("img").length) {
        $("#empty-notice").removeClass("hidden");
    }
    $("#calc").removeClass("hidden");
}

function calc_compare(a, b) {
    if (a.sort && b.sort) {
        a.sort = JSON.parse(a.sort)["0"];
        b.sort = JSON.parse(b.sort)["0"];
        return a.sort - b.sort;
    }
    return 0;
}