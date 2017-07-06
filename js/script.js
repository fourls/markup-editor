function toggle_window(btn) {
    if($('.main').hasClass('l-s')) {
        $('.main').removeClass('l-s');
        $('.main').addClass('s-l');
        $('.s-l > i').removeClass('fa-expand');
        $('.s-l > i').addClass('fa-compress');
    } else {
        $('.main').removeClass('s-l');
        $('.main').addClass('l-s');
        $('.s-l > i').removeClass('fa-compress');
        $('.s-l > i').addClass('fa-expand');
    }
}

function code_formatting(full,gr1,singleline=false) {
    gr1 = gr1.replace(/[^\w\d\s]/g, function (char) {
        return "&#" + char.charCodeAt(0) + ";";
    }).replace(/&#60;\s*br\s*&#62;/ig,function(br){
        return "<br>";
    }).replace(/&#38;nbsp&#59;/g,function(br){
        return "&nbsp;";
    }).replace(/&#38;[gl]t&#59;/g,function(gt) {
        if(gt == '&#38;lt;') {
            return '&#60;';
        } else {
            return '&#62;';
        }
    });
    if(singleline === true) {
        return '<span class="st-code">' + gr1 + '</span>';
    } else {
        return '<span class="st-code">' + gr1 + '</span>' + '<br>';
    }
}

function single_line_code_formatting(full,gr1,gr2) {
    return code_formatting(full,gr1,true).replace(/st-code/g,'st-code inline') + gr2 + "<br>";
}

function header_formatting(full,gr1,gr2) {
    heading_level = gr1.length;
    return '<br> <h' + heading_level + ' class="st-heading">' + gr2 + '</h' + heading_level + '>';
}

var formatting = [
    [/<br\s*\/?>\*\s(.*?)\s*(?=<)/ig,'<li class="st-listitem">$1</li>'], // unordered list item
    [/<br\s*\/?>(\d)\.\s(.*?)\s*(?=<)/ig,'<li class="st-orderedlistitem">$2</li>'], // ordered list item
    [/<li\sclass=["']st-listitem["']>(?:.*?)<\/li>(?=<[^l][^i])/gi,'<ul class="st-list">$&</ul>'], // unordered list
    [/<li\sclass=["']st-orderedlistitem["']>(?:.*?)<\/li>(?=<[^l][^i])/gi,'<ol class="st-orderedlist">$&</ol>'], // ordered list
    [/<br\s*\/?>*&gt;\s*(.*?)(?=<)/ig,'<li class="st-blockquote">$1</li>'], // blockquote
    [/```\s*<br\s*\/?>(.*)```\s*<br\s*\/?>/ig,code_formatting], // multiline code
    [/`([^`]*)`(.*)<br\s*\/?>/ig,single_line_code_formatting], // singleline code
    [/<br\s*\/?>\s*(#{1,8})\s(.+?)\s*(?=<)/ig,header_formatting], // header
    [/!\[([^\]]*)\]\(([^\)]*)\)/ig,'<img src="$2" alt="$1">'], // img                           | conflicts: link
    [/\[([^\]]*)\]\(([^\)]*)\)/ig,'<a href="$2">$1</a>'], // link
    [/<br\s*\/?>[\*\-\_]{3,}\s*<br\s*\/?>/ig,'<hr>'], // horizontal rule
    [/\[([^\],]+),?(\w*)?\]/ig,'<span class="st-tag hl-$2">$1</span>'], // tag                  | conflicts: link
    [/[\*\_]{2}\s*([^\*\_]+)[\*\_]{2}/ig,'<b>$1</b>'], // bold                                  | conflicts: italic, list, horizontal rule
    [/[\*\_]\s*([^\*\_]+)[\*\_]/ig,'<i>$1</i>'], // italic                                      | conflicts: bold, list, horizontal rule
];

$(function(){
    
    $(".text")
        // make sure br is always the lastChild of contenteditable
        .on("keyup mouseup", function(){
            if (!this.lastChild || this.lastChild.nodeName.toLowerCase() != "br") {
                this.appendChild(document.createElement("br"));
            }

            document.execCommand('removeformat',false,null);

            var text = '<br>' + $('.text')[0].innerHTML;
            
            text = text.replace(/~([^~]*)~/ig,function(full,gr1) {
                return gr1.replace(/[^\w\d\s]/g, function (char) {
                    return "&#" + char.charCodeAt(0) + ";";
                }).replace(/&#60;\s*br\s*&#62;/ig,function(br){
                    return "<br>";
                }).replace(/&#38;nbsp&#59;/g,function(br){
                    return "&nbsp;";
                }).replace(/&#38;[gl]t&#59;/g,function(gt) {
                    if(gt == '&lt;') {
                        return '&#60;';
                    } else {
                        return '&#62;';
                    }
                });
            });

            for (var i = 0; i < formatting.length; i++) {
                text = text.replace(formatting[i][0],formatting[i][1]);
            }

            $('.output')[0].innerHTML = text;
        })

        // use br instead of div div
        .on("keypress", function(e){
            if (e.which == 13) {
                if (window.getSelection) {
                    var selection = window.getSelection(),
                        range = selection.getRangeAt(0),
                        br = document.createElement("br");
                    range.deleteContents();
                    range.insertNode(br);
                    range.setStartAfter(br);
                    range.setEndAfter(br);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    return false;
                }
            }
        })

        .on("keydown", function(e) {
            if(e.ctrlKey || e.metaKey) {
                switch(e.keyCode) {
                    case 66: case 98:
                        e.preventDefault();
                        break;
                    case 73: case 105:
                        e.preventDefault();
                        break;
                    case 85: case 117:
                        e.preventDefault();
                        break;
                }
            }
            if(e.keyCode == 9) {
                e.preventDefault();
            }
        });
    
    $(".text").trigger("keyup");
});