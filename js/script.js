var formatting = [
    [/&gt;\s*([^<>]*)\s*<br\s*\/?>/ig,'<li class="st-listitem">$1</li>'],
    [/\[([\w\d#]*),(\w*)\]/ig,'<span class="st-tag hl-$2">$1</span>'],
    [/\[([\w\d#]*)\]/ig,'<span class="st-tag">$1</span>'],
    [/:([^:<>]+):\s*<br\s*\/?>/ig,'<span class="st-heading">$1</span> <br>'],
    [/::([^:<>]+)::\s*<br\s*\/?>/ig,'<span class="st-subheading">$1</span> <br>'],
    [/{([^@<>]*)@([^}\s]*)}\s*/ig,'<a href="$2">$1</a>'],
    [/{\s*<br\s*\/?>/ig,'<ul class="st-list">'],
    [/}\s*<br\s*\/?>/ig,'</ul>'],
];

$(function(){
    
    $(".text")
        // make sure br is always the lastChild of contenteditable
        .on("keyup mouseup", function(){
            if (!this.lastChild || this.lastChild.nodeName.toLowerCase() != "br") {
                this.appendChild(document.createElement("br"));
            }

            document.execCommand('removeformat',false,null);

            var text = $('.text')[0].innerHTML;
            
            text = text.replace(/`([^`]*)`/ig,function(full,gr1) {
                return gr1.replace(/./g, function (char) {
                    return "&#" + char.charCodeAt(0) + ";";
                });
            });

            text = text.replace(/&#60;\s*&#98;\s*&#114;\s*&#62;/ig,function(br){
                return "<br>";
            });

            console.log(text);

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
        });
    
    $(".text").trigger("keyup");
});