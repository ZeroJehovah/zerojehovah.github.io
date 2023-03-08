function show_achievement() {
    for (let i = 0; i < ACHIEVEMENT.length; i++) {
        let achievement_visible = ACHIEVEMENT[i].visible;
        if (!achievement_visible) {
            continue;
        }
        let achievement_title = ACHIEVEMENT[i].title;
        let achievement_url = ACHIEVEMENT[i].url;
        let achievements = ACHIEVEMENT[i].achievements;
        achievement_create_panel(achievement_title, achievement_url, achievements);
    }
}

function achievement_create_panel(achievement_title, achievement_url, achievements) {
    if (!achievement_title || !achievements || !achievements.length) {
        return;
    }
    let panel = $("<div class=\"panel panel-default achievement hidden\"><div class=\"panel-heading\"><button class='btn btn-default btn-xs pull-right' onclick=\"show_edit_config_page()\"><span class='glyphicon glyphicon-edit'></span></button><span></span></div></div>");
    if (achievement_url) {
        panel.find(".panel-heading>span").append($("<a href='" + achievement_url + "' target='_blank'>" + achievement_title + "</a>"));
    } else {
        panel.find(".panel-heading>span").text(achievement_title);
    }
    let achievement_list_div = $("<div></div>");
    for (let i = 0; i < achievements.length; i++) {
        let achievement_table = $("<table><tbody><tr><td class='achievement-icon'><img src='/resource/img/achievement.jpg' alt='achievement-icon'></td><td class='achievement-title'></td></tr></tbody></table>");
        let achievement_title_td = achievement_table.find("td.achievement-title");
        achievement_title_td.append($("<strong class='achievement-title'>" + achievements[i].title + "</strong>"));
        achievement_title_td.append($("<strong class='achievement-description'>" + achievements[i].description + "</strong>"));
        if (achievements[i].type === "action") {
            for (let j = 0; j < achievements[i].actions.length; j++) {
                let action_span = $("<strong class='achievement-action'>" + achievements[i].actions[j].title + "</strong>");
                if (achievements[i].actions[j].finish) {
                    action_span.prepend($("<span class='glyphicon glyphicon-ok'></span>")).addClass("text-success");
                }
                achievement_title_td.append(action_span);
            }
        } else if (achievements[i].type === "count") {
            for (let j = 0; j < achievements[i].counts.length; j++) {
                let action_span = $("<strong class='achievement-action'>" + achievements[i].counts[j].title + ":&nbsp" + achievements[i].counts[j].finish + "/" + achievements[i].counts[j].total + "</strong>");
                if (achievements[i].counts[j].finish === achievements[i].counts[j].total) {
                    action_span.prepend($("<span class='glyphicon glyphicon-ok'></span>")).addClass("text-success");
                }
                achievement_title_td.append(action_span);
            }

        } else {
            achievement_title_td.find("strong").addClass("achievement-long-margin");
        }
        achievement_list_div.append(achievement_table);
    }
    panel.append(achievement_list_div);
    panel.removeClass("hidden");
    $("body").append(panel);

}