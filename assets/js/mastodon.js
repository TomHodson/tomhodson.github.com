function getComments(statusId) {
    $.ajax({
        url: "https://tech.lgbt/api/v1/statuses/" + statusId + "/context",
        type: "get",
        success: function(replies) {
            console.log(replies);
            replies.descendants.forEach(reply => {
              var timestamp = Date.parse(reply.created_at);
              var date = new Date(timestamp);
              var comment = "<div class='comment' id='" + reply.id + "'>";
                comment += "<img class='avatar' src='" + reply.account.avatar + "' />";
                comment += "<div class='author'><a class='displayName' href='" + reply.account.url + "'>" + reply.account.display_name + "</a> wrote at ";
                comment += "<a class='date' href='" + reply.url + "'>" + date.toDateString() + ', ' + date.toLocaleTimeString() + "</a></div>";
                comment += "<div class='toot'>" + reply.content + "</div>";
                comment += "</div>";
                if (reply.in_reply_to_id == statusId) {
                  document.getElementById("comments").innerHTML = document.getElementById("comments").innerHTML + comment;
                } else {
                  var selector = reply.in_reply_to_id;
                  document.getElementById(selector).innerHTML = document.getElementById(selector).innerHTML + comment;
              }
            });
            var join = "<div class=\"reference\"><a href=\"https://tech.lgbt/@TomHodson/" + statusId + "\">Join the discussion on Mastodon.</a></div>"
            document.getElementById("comments").innerHTML = document.getElementById("comments").innerHTML + join;
        }
    });
  };