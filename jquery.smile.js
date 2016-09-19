/**
 * 表情插件 jQuery版
 *
 * @author guozhenyi (JerryDev@163.com)
 * @version 0.1
 * @date 2016-04-11 14:21
 *
 * todo:
 *   1. 考虑如果选择的是多个元素，那么绑定的点击事件是绑定在几个元素上的。
 *   2. 优化表情渲染部分的循环逻辑，可以精简为一层for循环
 *   3. 考虑如果绑定的元素的父元素很大，而绑定元素很小，会导致表情框隔得很远
 *
 *
 *
 *
 */

(function ( $, window, undefined) {
    "use strict";

    var document = window.document,
        _getPath = function () {
            var scripts = document.scripts;
            var url = scripts[scripts.length - 1].src;
            // if (scripts[scripts.length - 1].getAttribute('merge')) return;
            return url.substring(0, url.lastIndexOf("/"));
        },
        smile = {};

    // current path
    smile.path = _getPath();

    smile.map = {
        "default" : {"weix":"微笑","xixi":"嘻嘻","haha":"哈哈","keai":"可爱","keln":"可怜","wabi":"挖鼻","chjn":"吃惊","haix":"害羞","jyan":"挤眼","bzui":"闭嘴","bshi":"鄙视","love":"爱你","leii":"泪","xkul":"笑cry","toux":"偷笑","qqin":"亲亲","sbng":"生病","tkxn":"太开心","byan":"白眼","yhhn":"右哼哼","zhhn":"左哼哼","xuuu":"嘘","suai":"衰","wequ":"委屈","tuuu":"吐","haqn":"哈欠","bobo":"抱抱","nuuu":"怒","ywen":"疑问","byee":"拜拜","siko":"思考","hann":"汗","kunn":"困","shui":"睡","qian":"钱","shiw":"失望","kuuu":"酷","seee":"色","heng":"哼","guzh":"鼓掌","yunn":"晕","beis":"悲伤","zhkn":"抓狂","hexn":"黑线","yxan":"阴险","numa":"怒骂","hufn":"互粉","xinn":"心","shxn":"伤心","zhto":"猪头","xmao":"熊猫","tuzi":"兔子","oook":"OK","yeee":"耶","good":"good","nooo":"NO","zann":"赞","laii":"来","ruoo":"弱","cnma":"草泥马","shma":"神马","jong":"囧","fyun":"浮云","geli":"给力","wegn":"围观","wewu":"威武","atmn":"奥特曼","liwu":"礼物","zhon":"钟","huat":"话筒","lzhu":"蜡烛","dgao":"蛋糕"}
    };

    smile.template = '<div class="smile_layer_1990">' +
                     '<div class="smile_content">'+
                       '<div class="smile_close"><a href="javascript:void(0)">X</a></div>'+
                       '<div class="smile_faces">'+
                          '<ul class="face_ul">'+
                            '{faceList}'+
                          '</ul>'+
                       '</div>'+
                       '<div class="smile_arrow">'+
                          '<span class="bor"><i></i><em></em></span>'+
                       '</div>'+
                      '</div>'+
                   '</div>';

    // load stylesheet
    var nodeLink = document.createElement('link');
    nodeLink.type = 'text/css';
    nodeLink.rel = 'stylesheet';
    nodeLink.href = smile.path + '/assets/smile.css';
    nodeLink.id = 'smile_css_auto';
    document.getElementsByTagName('head')[0].appendChild(nodeLink);


    $.fn.bindSmile = $.fn.smile = function (options) {
        var $this    = this,
            $parent  = this.parent(),
            settings = {},
            smileTpl = smile.template,
            faceList = '',
            i;

        $parent.css('position', 'relative');
        options = $.extend({}, {
            path: smile.path,
            top: $parent.offset().top + $parent.height() -5,
            left: $parent.offset().left,
            pleft: $this.position().left + $this.width() * 0.5
        }, options || {});
        $parent.css('position', '');
        options.path = options.path.replace(/\/$/g, ""); // fix path

        for (i in smile.map.default) {
            faceList += '<li title="['+smile.map.default[i]+
                ']"><img src="'+options.path + '/default/'+i+'.gif'+'"></li>';
        }

        smileTpl = smileTpl.replace('{faceList}', faceList);

        $this.on('click', function(eve){
            var $smileTpl = $(smileTpl);
            $smileTpl = $smileTpl.css({"top": options.top, "left": options.left});
            $smileTpl.find('span.bor').css('left', options.pleft);

            $smileTpl.find('.smile_close').on('click', 'a', function(eve){
                $('.smile_layer_1990').remove();
                eve.stopPropagation();
            });

            // bind face event
            $smileTpl.find('ul.face_ul').children('li').on('click', function(eve){
                if (options.assign) {
                    $(options.assign).val($('#j_msg_text').val() + $(this).attr('title'));
                } else {
                    console.warn('smile plugin: assign is undefined');
                }
                eve.stopPropagation();
            });
            //
            $smileTpl.on('click', function(eve){
                eve.stopPropagation();
            });

            $(document).one('click', function(eve){
                $('.smile_layer_1990').remove();
            });

            $('body').append($smileTpl);
            eve.stopPropagation();
        });

        // $(document).on('click', function(eve){
        //     $('.smile_layer_1990').remove();
        // });

        // return this.each(function(){
        //   // ...
        // });

    };

    $.extend({
        smileParse : function(text) {
            var faces = text.match(/\[\S*?\]/g),
                faceLen = 0,
                content = text,
                path = smile.path,
                map = smile.map,
                i,n,m,mapn,contn;

            if (!faces) {
                return text;
            }

            faceLen = faces.length;
            // unique
            var uFaces = [];
            var hash = {};
            for (var j = 0; j < faceLen; j++) {
                if (hash[typeof faces[j] + faces[j]] !== 1) {
                    uFaces.push(faces[j]);
                    hash[typeof faces[j] + faces[j]] = 1;
                }
            }


            for (i in uFaces) {
                for (n in map) {
                    contn = 0;
                    mapn = map[n];
                    for (m in mapn) {
                        if (mapn[m] == uFaces[i].replace(/\[|\]/g, "")) {
                            content = content.replace(new RegExp('\\['+uFaces[i].replace(/\[|\]/g, "")+'\\]','g'), '<img src="'+path+'/'+n+'/'+m+'.gif" title="'+uFaces[i]+'">');
                            contn = 1;
                            break;
                        }
                    }
                    if (contn == 1) break;
                }
            }
            return content;
        }
    });


})(jQuery, window);
