window.onscroll = function() {
    var scrollTop = document.documentElement.scrollTop; 
    var clientHeight = document.documentElement.clientHeight; 
    var scrollHeight = document.documentElement.scrollHeight;
    if (scrollHeight - scrollTop < clientHeight + 100) {
        if(document.cookie.match(/scrollTop=([^;]+)(;|$)/) != null){
            var match = document.cookie.match(/scrollTop=([^;]+)(;|$)/);
            document.documentElement.scrollTop = parseInt(match[1]);
            document.body.scrollTop = parseInt(match[1]);
        }
        document.cookie = "scrollTop="+scrollTop;
        loadMore();
    }
}

function loadMore() {
    var news = document.getElementsByClassName("news-list");
    fetch("http://127.0.0.1:5500/apps/lesson-3-homework/homework-3/feed2.json").then(function (response) {
        return response.json();
    }).then(function (container) {
        news[0].append(getRefreshMode());
        
        container.data.forEach(function (content) {
            if (!content.single_mode && !content.more_mode && content.middle_mode) {
                news[0].append(getNoMode(content));
            } else if (!content.more_mode && content.middle_mode) {
                news[0].append(getSingleMode(content));
            }
        });

        document.cookie = "loadtime="+Date.now();
    });
}

function getNoMode(content) {
    var noMode = document.createElement("div");
    noMode.setAttribute("class", "no-mode");

    noMode.append(getTitle(content));
    noMode.append(getFooterBar(content));

    return noMode;
}

function getSingleMode(content) {
    var singleMode = document.createElement("div");
    singleMode.setAttribute("class", "single-mode");

    var left = document.createElement("div");
    left.setAttribute("class", "single-mode-left");
    var right = document.createElement("div");
    right.setAttribute("class", "single-mode-right");

    var image = document.createElement("img");
    image.setAttribute("src", "http:"+content.image_url)
    image.setAttribute("class", "lazy-load-img")
    var img_link = getLink("https://www.toutiao.com"+content.source_url, image);
    img_link.setAttribute("class", "img-wrap");
    if (content.video_duration_str) {
        var time_len = document.createElement("i");
        time_len.setAttribute("class", "pic-tip video-tip");
        time_len.innerHTML = "<span>"+content.video_duration_str+"</span>";
        img_link.append(time_len);
    }
    left.append(img_link);

    right.append(getTitle(content));
    right.append(getFooterBar(content));

    singleMode.append(left);
    singleMode.append(right);

    return singleMode;
}

function getRefreshMode() {
    var refreshMode = document.createElement("div");
    refreshMode.setAttribute("class", "refresh-mode");
    refreshMode.innerHTML = "&nbsp;点击刷新&nbsp;"
    var time_last = document.createElement("span");

    var time_before = Date.now();
    if(document.cookie.match(/loadtime=([^;]+)(;|$)/) != null){
        time_before = parseInt(document.cookie.match(/loadtime=([^;]+)(;|$)/)[1]);
    }
    timestamp = Date.now() - time_before;
    var time_text = ""
    if (timestamp / 60000 < 1) {
        time_text = "刚刚看到这里";
    } else if (timestamp / 3600000 < 1) {
        time_text = parseInt(timestamp / 60000)+"分钟前看到这里";
    } else if (timestamp / 86400000 < 1) {
        time_text = parseInt(timestamp / 3600000)+"小时前看到这里";
    } else {
        time_text = parseInt(timestamp / 86400000)+"天前看到这里";
    }
    time_last.innerHTML = time_text;
    refreshMode.insertAdjacentElement("afterbegin", time_last);

    var icon = document.createElement("i");
    icon.setAttribute("class", "bui-icon icon-refresh");
    refreshMode.insertAdjacentElement("beforeend", icon);

    return refreshMode;
}

function getTitle(content) {
    var title_box = document.createElement("div");
    title_box.setAttribute("class", "title");
    
    let title = document.createTextNode(content.title);
    var title_link = getLink("https://www.toutiao.com"+content.source_url, title);
    title_link.setAttribute("class", "link");

    title_box.append(title_link);
    return title_box;
}

function getFooterBar(content) {
    var footer_box = document.createElement("div");
    footer_box.setAttribute("class", "news-footer");

    var footer_bar = document.createElement("div");
    footer_bar.setAttribute("class", "footer-bar");

    var tag = getLink("https://www.toutiao.com/ch/"+content.tag_url, content.chinese_tag)
    var tag_list = ["hot", "video", "image", "society", "car", "sport", "finance", "technology", "entertainment"];
    if (tag_list.indexOf(content.tag_url) != -1) {
        tag.setAttribute("class", "footer-bar-action tag tag-style-"+content.tag_url);
    } else {
        tag.setAttribute("class", "footer-bar-action tag tag-style-other");
    }
    footer_bar.append(tag);

    var media_avatar_img = document.createElement("img");
    media_avatar_img.setAttribute("src", "http:"+content.media_avatar_url);
    var media_avatar = getLink("https://www.toutiao.com"+content.media_url, media_avatar_img);
    media_avatar.setAttribute("class", "footer-bar-action media-avatar");
    footer_bar.append(media_avatar);

    var source = getLink("https://www.toutiao.com"+content.media_url, "");
    source.innerHTML = ("&nbsp;"+content.source+"&nbsp;·");
    source.setAttribute("class", "footer-bar-action source");
    footer_bar.append(source);

    var comments_num = ""
    if (content.comments_count < 10000) {
        comments_num = String(content.comments_count);
    } else {
        comments_num = String(parseInt(content.comments_count / 10000));
        comments_num = comments_num+"万";
    }
    var comments = getLink("https://www.toutiao.com"+content.source_url+"/#comment=area", "");
    comments.innerHTML = ("&nbsp;"+comments_num+"评论");
    comments.setAttribute("class", "footer-bar-action source");
    footer_bar.append(comments);

    // var time = 

    footer_box.append(footer_bar)
    return footer_box;
}

function getLink(href, content) {
    var link = document.createElement("a");

    link.setAttribute("href", href);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    link.append(content)

    return link;
}