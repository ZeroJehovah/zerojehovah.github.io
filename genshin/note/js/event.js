$(function() {
   event_query_data();
});

function event_query_data () {
   $.get("https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/position?app_sn=ys_obc", {
      random: date.getDate()
   }, function (data) {
      event_show_data(data);
   });
}

function event_show_data(data) {
   let list = data.data.list[0].children[0].children[0].list;
   console.groupCollapsed("event-data");
   console.log(list);
   console.groupEnd();
   let event_list = $("#event-list");
   for (let i = 0; i < list.length; i++) {
      let end_time = Number(list[i].end_time);
      if (end_time <= date) {
         continue;
      }
      let left_hour = Math.floor((end_time - date) / 3600000);
      let left_day = Math.floor(left_hour / 24);
      left_hour = left_hour % 24;
      console.log("还剩" + left_day + "天" + left_hour + "小时");
      let a = $("<a class='list-group-item' href='" + list[i].url + "' target='_blank'>" + list[i].title + "</a>");
      let span = $("<span class='pull-right'>还剩" + left_day + "天" + left_hour + "小时</span>");
      span.addClass(left_day > 1 ? "text-success" : "text-danger");
      a.prepend(span);
      event_list.append(a);
   }
   if (event_list.find("a").length) {
      $("#event").removeClass("hidden");
   }
}