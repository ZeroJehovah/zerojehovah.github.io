const calendar_week_array = ["", "一", "二", "三", "四", "五", "六", "日"];
const calendar_role = [];
const calendar_weapon = [];
const calendar_week = date.getDay() === 0 ? "7" : String(date.getDay());
let calc_item_rank;
let CALENDAR_DATA;
let ALL_ROLES = [];
let ALL_WEAPONS = [];

$(function () {
    calendar_init_title();
    calendar_init_event();
    calendar_query_data();
});

function calendar_init_title() {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let title = $("#date");
    title.text(year + "年" + month + "月" + day + "日 星期" + calendar_week_array[calendar_week]);
}

function calendar_init_event() {
    $("#calc-tool tbody tr:first-child td input, #calc-tool-target").change(function () {
        if (parseInt($(this).val()) < 0) {
            $(this).val(0);
        }
        calc_tool_action();
    });
    $("#calc-tool-rank-select").change(function () {
        calc_item_rank = $(this).val();
        $(this).removeClass("calc-item-star-1 calc-item-star-2 calc-item-star-3 calc-item-star-4 calc-item-star-5").addClass("calc-item-star-" + (parseInt(calc_item_rank) + 1));
        calc_tool_action();
    });
}

function calc_tool_action() {
    let inputs = $("#calc-tool tbody tr:first-child td input");
    let sum = 0;
    for (let i = 0; i <= calc_item_rank; i++) {
        sum += inputs.eq(i).val() * (3 ** i);
    }
    sum = sum / (3 ** calc_item_rank);
    sum = sum.toFixed(2);
    let target = parseInt($("#calc-tool-target").val());
    let result_div = $("#calc-tool-result");
    result_div.removeClass("alert-info alert-success alert-warning");
    if (target === 0) {
        result_div.addClass("alert-info");
    } else if (sum >= target) {
        result_div.addClass("alert-success");
    } else {
        result_div.addClass("alert-warning");
    }
    $("#calc-tool-result").text(sum);
}

function calendar_query_data() {
    $.get("https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/get_activity_calendar?app_sn=ys_obc", {
        random: date.getDate()
    }, function (data) {
        CALENDAR_DATA = data;
        if (FOLLOW_ROLE && FOLLOW_WEAPON) {
            init_data();
        }
    });
}

function init_data() {
    let list = CALENDAR_DATA.data.list;
    for (let i = 0; i < list.length; i++) {
        if (list[i].kind !== "2") {
            continue;
        }
        if (list[i].break_type === "2") {
            ALL_ROLES.push({
                title: list[i].title,
                img_url: list[i].img_url,
                sort: list[i].sort
            });
            if (list[i].drop_day.indexOf(calendar_week) > -1 && FOLLOW_ROLE.indexOf(list[i].title) > -1) {
                calendar_role.push(list[i]);
            }
        } else if (list[i].break_type === "1") {
            ALL_WEAPONS.push({
                title: list[i].title,
                img_url: list[i].img_url,
                sort: list[i].sort
            });
            if (list[i].drop_day.indexOf(calendar_week) > -1 && FOLLOW_WEAPON.indexOf(list[i].title) > -1) {
                calendar_weapon.push(list[i]);
            }
        }
    }
    calendar_role.sort(calendar_compare);
    calendar_weapon.sort(calendar_compare);
    show_data();
    ALL_ROLES.sort(calendar_compare);
    ALL_WEAPONS.sort(calendar_compare);
    console.log("calendar: 已从米游社获取数据");
    console.groupCollapsed("calendar-data");
    console.log(calendar_role);
    console.log(calendar_weapon);
    console.log(ALL_ROLES);
    console.log(ALL_WEAPONS);
    console.groupEnd();
}

function show_data() {
    let break_list = $("#break-list");
    for (let i = 0; i < calendar_role.length; i++) {
        let title = calendar_role[i].title;
        let link = "https://bbs.mihoyo.com/ys/obc/content/" + calendar_role[i].content_id + "/detail";
        let img_url = calendar_role[i].img_url;
        let a = $("<a href='" + link + "' target='_blank' title='" + title + "'><img alt='" + title + "' src='" + img_url + "'></a>");
        break_list.append(a).removeClass("hidden");
    }
    for (let i = 0; i < calendar_weapon.length; i++) {
        let title = calendar_weapon[i].title;
        let link = "https://bbs.mihoyo.com/ys/obc/content/" + calendar_weapon[i].content_id + "/detail";
        let img_url = calendar_weapon[i].img_url;
        let a = $("<a href='" + link + "' target='_blank' title='" + title + "'><img alt='" + title + "' src='" + img_url + "'></a>");
        break_list.append(a).removeClass("hidden");
    }
    if (!break_list.find("img").length) {
        $("#empty-notice").removeClass("hidden");
    }
    $("#calendar").removeClass("hidden");
}

function calendar_compare(a, b) {
    if (a.sort && isNaN(a.sort)) {
        a.sort = JSON.parse(a.sort)["0"];
    }
    if (b.sort && isNaN(b.sort)) {
        b.sort = JSON.parse(b.sort)["0"];
    }
    if (a.sort && b.sort) {
        return a.sort - b.sort;
    }
    return 0;
}

function show_calc_tool_modal() {
    let modal = $("#calc-tool");
    modal.find("input").val(0);
    modal.find("select").val(4).change();
    calc_tool_action();
    $("#calc-tool").modal("show");
}