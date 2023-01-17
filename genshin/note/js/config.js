let CONFIG;
let FOLLOW_ROLE;
let FOLLOW_WEAPON;
let ACHIEVEMENT;
let token;

$(function () {
    get_config();
});

function get_config() {
    token = get_token();
    if (!token) {
        return;
    }
    $.ajax({
        url: "https://api.github.com/repos/ZeroJehovah/zerojehovah.github.io/issues/1",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (data) {
            $("#set-token").addClass("hidden");
            CONFIG = data.body;
            $("#config-json").val(CONFIG);
            let config_json = JSON.parse(data.body);
            console.log("config: 已从github获取数据");
            console.groupCollapsed("config-data");
            console.log(config_json);
            console.groupEnd();
            FOLLOW_ROLE = config_json.FOLLOW_ROLE;
            FOLLOW_WEAPON = config_json.FOLLOW_WEAPON;
            ACHIEVEMENT = config_json.ACHIEVEMENT;
            if (CALC_DATA) {
                init_data();
            }
            show_achievement();
        },
        error: function (data) {
            console.log("config: 从github获取数据失败");
            console.groupCollapsed("config-data");
            console.log(data);
            console.groupEnd();
            show_set_token_panel(data.responseText);
        }
    });
}

function get_token() {
    let token = localStorage.getItem("github-token");
    if (token) {
        return token;
    }
    show_set_token_panel("初次使用，请设置Token");
}

function show_set_token_panel(message) {
    $("#set-token").removeClass("hidden");
    $("#set-token-message").text(message);
}

function set_token() {
    let token = $("#token-value").val();
    if (!token) {
        show_set_token_panel("输入的token为空");
        return;
    }
    localStorage.setItem("github-token", token);
    get_config();
}

function show_edit_config_page() {
    $("body>div.panel").addClass("hidden-by-config");
    $("#edit-config-page").removeClass("hidden");
    let config_break_role = $("#config-break-role");
    for (let i = 0; i < ALL_ROLES.length; i++) {
        let item = $("<span class='config-break-item'></span>");
        item.append($("<span class='icon-ok'><span class='glyphicon glyphicon-ok'></span>&nbsp;</span>"));
        item.append($("<span class='title'></span>").text(ALL_ROLES[i].title));
        if (FOLLOW_ROLE.indexOf(ALL_ROLES[i].title) > -1) {
            item.addClass("selected");
        }
        config_break_role.append(item);
    }
    let config_break_weapon = $("#config-break-weapon");
    for (let i = 0; i < ALL_WEAPONS.length; i++) {
        let item = $("<span class='config-break-item'></span>");
        item.append($("<span class='icon-ok'><span class='glyphicon glyphicon-ok'></span>&nbsp;</span>"));
        item.append($("<span class='title'></span>").text(ALL_WEAPONS[i].title));
        if (FOLLOW_WEAPON.indexOf(ALL_WEAPONS[i].title) > -1) {
            item.addClass("selected");
        }
        config_break_weapon.append(item);
    }
    $("span.config-break-item").click(function () {
        $(this).toggleClass("selected");
    });
    let config_achievement = $("#config-achievement");
    for (let i = 0; i < ACHIEVEMENT.length; i++) {
        let header = $("<h4></h4>");
        header.append($("<span class='title slide-btn'></span>").text(ACHIEVEMENT[i].title));
        if (ACHIEVEMENT[i].url) {
            header.append($("<small><a href='" + ACHIEVEMENT[i].url + "' target='_blank' class='url'><span class='glyphicon glyphicon-new-window'></span></a></small>"));
        }
        config_achievement.append(header);
        let achievement_group = $("<div class='config-achievement-group'></div>");
        for (let j = 0; j < ACHIEVEMENT[i].achievements.length; j++) {
            let title = $("<h4 class='config-achievement-title'></h4>");
            title.append($("<span class='title'></span>").text(ACHIEVEMENT[i].achievements[j].title));
            if (ACHIEVEMENT[i].achievements[j].description) {
                title.append($("<small class='description'></small>").text(ACHIEVEMENT[i].achievements[j].description));
            }
            achievement_group.append(title);
            let achievement_item = $("<div class='config-achievement-item'></div>");
            if (ACHIEVEMENT[i].achievements[j].type === "action") {
                for (let k = 0; k < ACHIEVEMENT[i].achievements[j].actions.length; k++) {
                    let item = $("<span class='config-achievement-action'></span>");
                    item.append($("<span class='icon-ok'><span class='glyphicon glyphicon-ok'></span>&nbsp;</span>"));
                    item.append($("<span class='title'></span>").text(ACHIEVEMENT[i].achievements[j].actions[k].title));
                    if (ACHIEVEMENT[i].achievements[j].actions[k].finish) {
                        item.addClass("finished");
                    }
                    achievement_item.append(item);
                }
            } else if (ACHIEVEMENT[i].achievements[j].type === "count") {
                for (let k = 0; k < ACHIEVEMENT[i].achievements[j].counts.length; k++) {
                    let item = $("<span class='config-achievement-count'></span>");
                    item.append($("<span class='icon-ok'><span class='glyphicon glyphicon-ok'></span>&nbsp;</span>"));
                    item.append($("<span><span class='title'>" + ACHIEVEMENT[i].achievements[j].counts[k].title + "</span>:&nbsp;<span class='finish'>" + ACHIEVEMENT[i].achievements[j].counts[k].finish + "</span>/<span class='total'>" + ACHIEVEMENT[i].achievements[j].counts[k].total + "</span></span>"));
                    item.append($("<span class='count-btns'>&nbsp;&nbsp;&nbsp;<span class='glyphicon glyphicon-minus' onclick='change_finish_num(this,-1)'></span>&nbsp;&nbsp;<span class='glyphicon glyphicon-plus' onclick='change_finish_num(this,1)'></span></span>"))
                    if (ACHIEVEMENT[i].achievements[j].counts[k].finish === ACHIEVEMENT[i].achievements[j].counts[k].total) {
                        item.addClass("finished");
                    }
                    achievement_item.append(item);
                }
            }
            achievement_group.append(achievement_item);
        }
        config_achievement.append(achievement_group);
    }
    $("span.config-achievement-action").click(function () {
        $(this).toggleClass("finished");
    });
    $(".slide-btn").click(function () {
        $(this).parent().next().slideToggle("fast");
    });

}

function change_finish_num(item, num) {
    let parent = $(item).parents(".config-achievement-count");
    let total = parseInt(parent.find(".total").text());
    let finish = parseInt(parent.find(".finish").text()) + num;
    if (finish < 0 || finish > total) {
        return;
    }
    if (finish === total) {
        parent.addClass("finished");
    } else {
        parent.removeClass("finished");
    }
    parent.find(".finish").text(finish);
}

function config_back() {
    $("#config-break-role").empty().css("display", "block");
    $("#config-break-weapon").empty().css("display", "block");
    $("#config-achievement").empty().css("display", "block");
    $(".slide-btn").off("click");
    $("#edit-config-page").addClass("hidden");
    $("#config-edit-json").addClass("hidden");
    $("#config-json").val(CONFIG);
    $("body>div.panel").removeClass("hidden-by-config");
}

function show_edit_json() {
    $("#config-edit-json").toggleClass("hidden");
}

function config_save_page() {
    let new_config = {};
    new_config.FOLLOW_ROLE = [];
    let follow_roles = $("#config-break-role").find("span.selected");
    for (let i = 0; i < follow_roles.length; i++) {
        new_config.FOLLOW_ROLE.push(follow_roles.eq(i).find("span.title").text());
    }
    new_config.FOLLOW_WEAPON = [];
    let follow_weapons = $("#config-break-weapon").find("span.selected");
    for (let i = 0; i < follow_weapons.length; i++) {
        new_config.FOLLOW_WEAPON.push(follow_weapons.eq(i).find("span.title").text());
    }
    let achievement_group = $("#config-achievement>*");
    new_config.ACHIEVEMENT = [];
    for (let i = 0; i < achievement_group.length; i += 2) {
        let achievement_json = {};
        achievement_json.title = achievement_group.eq(i).find("span.title").text();
        achievement_json.url = achievement_group.eq(i).find("a.url").attr("href");
        achievement_json.achievements = [];
        let achievements = achievement_group.eq(i + 1).children();
        for (let j = 0; j < achievements.length; j += 2) {
            let achievement_item = {};
            achievement_item.title = achievements.eq(j).find("span.title").text();
            achievement_item.description = achievements.eq(j).find("small.description").text();
            if (achievements.eq(j + 1).find(".config-achievement-action").length) {
                achievement_item.type = "action";
                achievement_item.actions = [];
                let actions = achievements.eq(j + 1).find(".config-achievement-action");
                for (let k = 0; k < actions.length; k++) {
                    let action = {};
                    action.title = actions.eq(k).find("span.title").text();
                    if (actions.eq(k).hasClass("finished")) {
                        action.finish = true;
                    }
                    achievement_item.actions.push(action);
                }
            } else if (achievements.eq(j + 1).find(".config-achievement-count").length) {
                achievement_item.type = "count";
                achievement_item.counts = [];
                let counts = achievements.eq(j + 1).find(".config-achievement-count");
                for (let k = 0; k < counts.length; k++) {
                    let count = {};
                    count.title = counts.eq(k).find("span.title").text();
                    count.finish = parseInt(counts.eq(k).find("span.finish").text());
                    count.total = parseInt(counts.eq(k).find("span.total").text());
                    achievement_item.counts.push(count);
                }
            }
            achievement_json.achievements.push(achievement_item);
        }
        new_config.ACHIEVEMENT.push(achievement_json);
    }
    config_save(JSON.stringify(new_config));
}

function config_save_json() {
    config_save($("#config-json").val());
}

function config_save(json) {
    console.log("config: 保存配置文件到github issue");
    console.groupCollapsed("save-config");
    console.log(json);
    console.groupEnd();
    $.ajax({
        url: "https://api.github.com/repos/ZeroJehovah/zerojehovah.github.io/issues/1",
        type: "PATCH",
        async: false,
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            body: json
        }),
        success: function (data) {
            location.reload();
        },
        error: function (data) {
            console.log("error");
            console.log(data);
        }
    });
}