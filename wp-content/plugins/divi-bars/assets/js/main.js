function dibTogglePlayableTags(divibar_id, wait) {
    let $ = jQuery;
    if (!divibar_id) {
        divibar_id = ''
    }
    let divibars = $(divibar_id + '.divibars');
    if (!wait) {
        wait = 1
    }
    setTimeout(function() {
        divibars.find("iframe").not('[id^="gform"], .frm-g-recaptcha, [name^="__privateStripeFrame"]').each(function() {
            let iframe = $(this),
                iframeSRC = iframe.attr('src');
            if (iframeSRC !== undefined && iframeSRC !== '') {
                let srcG = 'google.com/',
                    isGoogleSRC = iframeSRC.indexOf(srcG),
                    srcPDF = '.pdf',
                    isPDF = iframeSRC.indexOf(srcPDF);
                if (isGoogleSRC === -1 && isPDF === -1) {
                    let iframeOuterHTML = iframe.prop("outerHTML"),
                        src = iframeOuterHTML.match(/src=[\'"]?((?:(?!\/>|>|"|\'|\s).)+)"/)[0];
                    src = src.replace("src", "data-src");
                    iframeOuterHTML = iframeOuterHTML.replace(/src=".*?"/i, "src=\"about:blank\" data-src=\"\"");
                    if (src != "data-src=\"about:blank\"") {
                        iframeOuterHTML = iframeOuterHTML.replace("data-src=\"\"", src)
                    }
                    $(iframeOuterHTML).insertAfter(iframe);
                    iframe.remove()
                }
            }
        })
    }, wait);
    divibars.find("video").each(function() {
        $(this).get(0).pause()
    });
    divibars.find("audio").each(function() {
        this.pause();
        this.currentTime = 0
    })
}! function(send) {
    var divibars_ajax_intercept = function(body) {
        var isDiviBarsOpen = document.querySelectorAll('.divibars.divibars-opened'),
            isDiviOverlaysOpen = document.querySelectorAll('.overlay.open');
        if (isDiviBarsOpen.length > 0 && isDiviOverlaysOpen.length < 1) {
            try {
                if (body !== null) {
                    var doCustomFieldName = 'et_pb_signup_divibarid',
                        action = 'action=et_pb_submit_subscribe_form',
                        is_optin_submit_subscribe_form = body.indexOf(action),
                        is_divibar_ref_form = body.indexOf(doCustomFieldName);
                    if (is_optin_submit_subscribe_form !== -1 && is_divibar_ref_form !== -1) {
                        var result = [];
                        body.split('&').forEach(function(part) {
                            var item = part.split("="),
                                name = decodeURIComponent(item[0]),
                                value = decodeURIComponent(item[1]),
                                doCustomField = 'et_custom_fields[' + doCustomFieldName + ']';
                            if (name != doCustomField && name != 'et_post_id') {
                                result.push(part)
                            }
                            if (name == doCustomField) {
                                result.push('et_post_id=' + value)
                            }
                        });
                        var url = result.join('&');
                        body = url
                    }
                    send.call(this, body)
                }
                if (body === null) {
                    send.call(this)
                }
            } catch (err) {
                send.call(this, body)
            }
        } else {
            send.call(this, body)
        }
    };
    XMLHttpRequest.prototype.send = divibars_ajax_intercept
}(XMLHttpRequest.prototype.send);;
(function($, window, document, undefined) {
    'use strict';
    var diviBodyElem = $('body');
    $.fn.mainDiviBars = function(options) {
        var divibar_body, divibar, idx_divibar, divi_divibar_container_selector, $divibar = this,
            contentLengthcache, divibarHeightCache, diviMobile, diviMobileCache, themesBreakpoint = {
                Divi: 980,
                Extra: 1024
            },
            styleTagID = 'divi-bars-styles',
            vw, fixedElements, scrollCheck, divibar_container = $('div.divibars-container'),
            sidebarDivibar = $("#sidebar-divibar"),
            mainBody = $('body'),
            diviTopHeader = $('#top-header'),
            divibarsDetached = {},
            tempPagecontainer = $('<div/>', {
                "id": 'page-container',
                "class": 'divibars-temp-page-container',
                "style": 'overflow-y: hidden;'
            }),
            ExtraTheme = (detectTheme() === 'Extra') ? true : false,
            cssclass_HtmlNoMargin = 'divibar-htmlNoMargin';
        if (ExtraTheme) {
            var temp_et_pb_extra_column_main = $('<div/>', {
                "class": 'et_pb_extra_column_main',
                "style": 'overflow-y: hidden;'
            });
            temp_et_pb_extra_column_main.appendTo(tempPagecontainer)
        }
        if (typeof options == 'function') {
            options = {
                success: options
            }
        } else if (options === undefined) {
            options = {}
        }

        function detectTheme() {
            let currentTheme = 'Divi';
            if (diviBodyElem.hasClass('et_extra')) {
                currentTheme = 'Extra'
            }
            return currentTheme
        }
        $('<style id="' + styleTagID + '"></style>').appendTo('head');
        if (divibar_container.length) {
            setTimeout(function() {
                let allDivibarsContainers = $('div.divibars-container');
                allDivibarsContainers.each(function() {
                    let divibar_id = parseInt($(this).attr('id').replace('divi-divibars-container-', '')),
                        divibar_selector = '#divibar-' + divibar_id,
                        divibar = $(divibar_selector);
                    divibar.attr('style', '');
                    divibarsDetached[divibar_id] = $(this).detach();
                    loadAutomaticTriggers()
                });
                $('#sidebar-divibar').removeClass('hiddenMainDiviBarsContainer')
            }, 1);
            dibTogglePlayableTags('', 1);
            let ds_icon_party_css = $('#ds-icon-party-css');
            if (ds_icon_party_css.length > 0) {
                let dshref = ds_icon_party_css.attr('href');
                $.ajax({
                    method: 'GET',
                    dataType: 'text',
                    url: dshref
                }).then(function(data) {
                    let dsdata = data;
                    dsdata = dsdata.replace(/#page-container/gi, '');
                    $('#' + styleTagID).html(dsdata)
                })
            }
            diviMobile = diviMobileCache = isDiviMobile();
            var container = $('div#page-container'),
                htmlE = $('html'),
                positionTimer = 0,
                removeMonarchTimer = 0,
                removeBloomTimer = 0;
            var cacheHtmlMarginTop = parseInt(htmlE.css('margin-top'));
            if (cacheHtmlMarginTop <= 0) {
                cacheHtmlMarginTop = 0
            }
            var cacheBodyPaddingTop = parseInt(diviBodyElem.css('padding-top'));
            if (cacheBodyPaddingTop <= 0) {
                cacheBodyPaddingTop = 0
            }
            var cacheBodyPaddingBottom = parseInt(diviBodyElem.css('padding-bottom'));
            if (cacheBodyPaddingBottom <= 0) {
                cacheBodyPaddingBottom = 0
            }
            var cacheTopHeaderTop = parseInt(diviTopHeader.css('top'));
            if (cacheTopHeaderTop <= 0) {
                cacheTopHeaderTop = 0
            }
            var cacheMainHeaderTop = parseInt($('#main-header').css('top'));
            if (cacheMainHeaderTop <= 0) {
                cacheMainHeaderTop = 0
            }
            var cachePageContainer = 0;
            var diviBodyElemStyleCache = $("body,html").attr('style');
            fixedElements = getFlyingElements();
            divibar_container.each(function() {
                $('[id="' + this.id + '"]:gt(0)').remove()
            });
            $('body [id^="divibars_"]').on('click touch tap', function(e) {
                var divibarArr = $(this).attr('id').split('_'),
                    divibar_id = divibarArr[3],
                    cookieName = 'divibar' + divibar_id;
                eraseCookie(cookieName);
                showDivibar(divibar_id);
                e.preventDefault()
            });
            $('body [rel^="unique_divibars_"]').on('click touch tap', function(e) {
                var divibarArr = $(this).attr('rel').split('_'),
                    divibar_id = divibarArr[4],
                    cookieName = 'divibar' + divibar_id;
                eraseCookie(cookieName);
                showDivibar(divibar_id);
                e.preventDefault()
            });
            $('body [class*="dividivibar-"], body [class*="divibar-"]').on('click touch tap', function(e) {
                var divibarArr = $(this).attr('class').split(' ');
                $(divibarArr).each(function(index, value) {
                    idx_divibar = value.indexOf('divibar');
                    if (idx_divibar !== -1) {
                        var idx_divibarArr = value.split('-');
                        if (idx_divibarArr.length > 1) {
                            var divibar_id = idx_divibarArr[1],
                                cookieName = 'divibar' + divibar_id;
                            eraseCookie(cookieName);
                            showDivibar(divibar_id)
                        }
                    }
                })
            });
            if (typeof divibars_with_css_trigger !== 'undefined') {
                if ($(divibars_with_css_trigger).length > 0) {
                    $.each(divibars_with_css_trigger, function(divibar_id, selector) {
                        $(selector).on('click touch tap', function(e) {
                            var cookieName = 'divibar' + divibar_id;
                            eraseCookie(cookieName);
                            showDivibar(divibar_id);
                            e.preventDefault()
                        })
                    })
                }
            }

            function loadAutomaticTriggers() {
                if (typeof divibars_with_automatic_trigger !== 'undefined') {
                    if ($(divibars_with_automatic_trigger).length > 0) {
                        $.each(divibars_with_automatic_trigger, function(divibar_id, at_settings) {
                            var at_settings_parsed = jQuery.parseJSON(at_settings),
                                at_type_value = at_settings_parsed.at_type,
                                at_onceperload = at_settings_parsed.at_onceperload;
                            if (at_onceperload == 1) {
                                showdivibarOnce(divibar_id)
                            }
                            if (at_type_value == 'divibar-timed') {
                                let time_delayed = at_settings_parsed.at_value * 1000;
                                if (time_delayed == 0) {
                                    time_delayed = 1000
                                }
                                time_delayed = time_delayed + 1000;
                                setTimeout(function() {
                                    showDivibar(divibar_id)
                                }, time_delayed)
                            }
                            if (at_type_value == 'divibar-scroll') {
                                let divibarScroll = at_settings_parsed.at_value,
                                    refScroll, checkdivibarScroll;
                                if (divibarScroll.indexOf('%') || divibarScroll.indexOf('px')) {
                                    checkdivibarScroll = divibarScroll.toString();
                                    if (checkdivibarScroll.indexOf('%') !== -1) {
                                        divibarScroll = divibarScroll.replace(/%/g, '');
                                        refScroll = '%'
                                    }
                                    if (checkdivibarScroll.indexOf('px') !== -1) {
                                        divibarScroll = divibarScroll.replace(/px/g, '');
                                        refScroll = 'px'
                                    }
                                    divibarScroll = divibarScroll.split(':');
                                    let divibarScrollFrom = divibarScroll[0],
                                        divibarScrollTo = divibarScroll[1];
                                    $(window).scroll(function(e) {
                                        let divibar_selector = '#divibar-' + divibar_id,
                                            divibar = $(divibarsDetached[divibar_id]).find(divibar_selector),
                                            s = getScrollTop(),
                                            d = $(document).height(),
                                            c = $(window).height(),
                                            wScroll, displayonceperloadpassed = divibar.attr('data-displayonceperloadpassed');
                                        if (refScroll == '%') {
                                            wScroll = (s / (d - c)) * 100
                                        } else if (refScroll == 'px') {
                                            wScroll = s
                                        } else {
                                            return
                                        }
                                        if (divibarScrollFrom > 0 && divibarScrollTo > 0) {
                                            if (divibarScrollFrom <= wScroll && divibarScrollTo >= wScroll) {
                                                if (!isActiveDivibar(divibar_id)) {
                                                    if (at_onceperload == 1 && displayonceperloadpassed != 1) {
                                                        showDivibar(divibar_id);
                                                        divibar.attr('data-displayonceperloadpassed', 1)
                                                    }
                                                    if (at_onceperload == 0) {
                                                        showDivibar(divibar_id)
                                                    }
                                                }
                                            } else if (isActiveDivibar(divibar_id)) {
                                                closeActiveDivibar(divibar_id)
                                            }
                                        }
                                        if (divibarScrollFrom > 0 && divibarScrollTo == '') {
                                            if (divibarScrollFrom <= wScroll) {
                                                if (!isActiveDivibar(divibar_id)) {
                                                    if (at_onceperload == 1 && displayonceperloadpassed != 1) {
                                                        showDivibar(divibar_id);
                                                        divibar.attr('data-displayonceperloadpassed', 1)
                                                    }
                                                    if (at_onceperload == 0) {
                                                        showDivibar(divibar_id)
                                                    }
                                                }
                                            } else if (isActiveDivibar(divibar_id)) {
                                                closeActiveDivibar(divibar_id)
                                            }
                                        }
                                        if (divibarScrollFrom == '' && divibarScrollTo > 0) {
                                            if (divibarScrollTo >= wScroll) {
                                                if (!isActiveDivibar(divibar_id)) {
                                                    if (at_onceperload == 1 && displayonceperloadpassed != 1) {
                                                        showDivibar(divibar_id);
                                                        divibar.attr('data-displayonceperloadpassed', 1)
                                                    }
                                                    if (at_onceperload == 0) {
                                                        showDivibar(divibar_id)
                                                    }
                                                }
                                            } else if (isActiveDivibar(divibar_id)) {
                                                closeActiveDivibar(divibar_id)
                                            }
                                        }
                                    })
                                }
                            }
                            if (at_type_value == 'divibar-exit') {
                                $.exitIntent('enable', {
                                    'sensitivity': 100
                                });
                                $(document).bind('exitintent', function() {
                                    let divibar_selector = '#divibar-' + divibar_id,
                                        divibar = $(divibarsDetached[divibar_id]).find(divibar_selector),
                                        at_onceperload = divibar.attr('data-displayonceperload'),
                                        displayonceperloadpassed = divibar.attr('data-displayonceperloadpassed');
                                    if (!isActiveDivibar(divibar_id)) {
                                        if (at_onceperload == 1 && displayonceperloadpassed != 1) {
                                            showDivibar(divibar_id);
                                            divibar.attr('data-displayonceperloadpassed', 1)
                                        }
                                        if (undefined === at_onceperload) {
                                            showDivibar(divibar_id)
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            }
            $('.nav a, .mobile_nav a').each(function(index, value) {
                var href = $(value).attr('href');
                if (href !== undefined) {
                    idx_divibar = href.indexOf('divibar');
                    if (idx_divibar !== -1) {
                        var idx_divibarArr = href.split('-');
                        if (idx_divibarArr.length > 1) {
                            var divibar_id = idx_divibarArr[1];
                            $(this).attr('data-divibarid', divibar_id);
                            $(this).on('click touch tap', function() {
                                divibar_id = $(this).data('divibarid');
                                showDivibar(divibar_id)
                            })
                        }
                    }
                }
            });
            $('a').each(function(e) {
                var href = $(this).attr('href');
                if (href !== undefined) {
                    var hash = href[0],
                        ref = href.indexOf('divibar');
                    if (hash == '#' && href.length > 1 && ref != -1) {
                        var divibar_id = parseInt(href.replace('#divibar-', ''));
                        if (typeof divibar_id == 'number') {
                            $(this).attr('data-divibarid', divibar_id);
                            $(this).on('click touch tap', function(e) {
                                divibar_id = $(this).data('divibarid');
                                showDivibar(divibar_id);
                                e.preventDefault()
                            })
                        }
                    }
                }
            });

            function getFlyingElements() {
                var elemData = {},
                    height, totalHeight = 0,
                    pageContainerPaddingTop = 0,
                    allElems, attr, lastElemHeight = 0,
                    lastElemTop = 0,
                    defaultElems = '#wpadminbar,#top-header',
                    selector, elemRef, elemHeight, elemBackgroundRGBA, elemBackgroundAlpha, addTotalHeight, addDivibarHeight;
                if (ExtraTheme && diviBodyElem.hasClass('et_fixed_nav')) {
                    defaultElems = '#wpadminbar,#top-header,#main-header'
                } else if (ExtraTheme) {
                    defaultElems += ',#main-header-wrapper'
                } else {
                    defaultElems += ',#main-header'
                }
                allElems = defaultElems;
                if (typeof divibars_settings !== 'undefined' && divibars_settings['dib_custom_elems'] !== undefined && divibars_settings['dib_custom_elems'] != '') {
                    allElems = allElems + ',' + divibars_settings['dib_custom_elems']
                }
                allElems = allElems.split(',');
                fixedElements = [];
                $.each(allElems, function(index, value) {
                    let pThis = $(this);
                    if (pThis.length > 0) {
                        if (!pThis.hasClass('divibars')) {
                            selector = '';
                            let isCustomElem = (value.indexOf(divibars_settings['dib_custom_elems']) !== -1 ? true : false);
                            if (isCustomElem) {
                                if (pThis.hasClass('et_pb_sticky_module')) {
                                    pThis.css('top', lastElemHeight + 'px');
                                    pThis.css('position', 'fixed');
                                    pThis.css('width', '100%')
                                }
                            }
                            elemData['id'] = (pThis.attr('id') !== undefined) ? pThis.attr('id') : '';
                            elemData['class'] = (pThis.attr('class') !== undefined) ? pThis.attr('class') : '';
                            elemData['css_height'] = getElemHeight(pThis);
                            elemData['css_top'] = parseInt(pThis.css('top'));
                            let cssPosition = pThis.css('position'),
                                mainHeaderIsNotFixed = false,
                                elemIsFixed = (cssPosition === 'fixed') ? true : false;
                            elemData['css_position'] = (cssPosition !== 'fixed' && cssPosition !== 'absolute') ? 'fixed' : cssPosition;
                            elemData['lastElemHeight'] = lastElemHeight;
                            elemData['lastElemTop'] = lastElemTop;
                            elemData['addDivibarHeight'] = true;
                            if ((elemData['id'] != '') || (elemData['class'] != '')) {
                                if (elemData['id'] != '') {
                                    selector = '#' + elemData['id']
                                } else if (elemData['class'] != '') {
                                    selector = '.' + elemData['class']
                                }
                            }
                            if (isCustomElem) {
                                addStyles(selector, 'position:' + cssPosition + ' !important;');
                                addStyles(selector, 'width:100% !important;')
                            }
                            if (selector === '#main-header' && elemData['css_position'] === 'absolute' && diviBodyElem.hasClass('et_non_fixed_nav')) {
                                mainHeaderIsNotFixed = true
                            }
                            if ((diviBodyElem.hasClass('et_vertical_nav') && selector == '#main-header' && elemData['css_position'] == 'fixed') || (diviBodyElem.hasClass('et_fixed_nav') && selector == '#wpadminbar' && elemData['css_position'] == 'absolute' && isDiviMobile) || mainHeaderIsNotFixed || (defaultElems.indexOf(selector) === -1 && elemIsFixed === true)) {
                                elemData['addDivibarHeight'] = false
                            }
                            if (elemData['css_position'] != 'fixed' && elemData['css_position'] != 'absolute') {
                                elemData = fixElementsPositionTop(elemData)
                            }
                            if ((elemData['css_position'] == 'fixed' && pThis.css('display') != 'none' && pThis.css('visibility') != 'hidden' && elemData['css_top'] >= 0) || (elemData['css_position'] == 'absolute' && pThis.css('display') != 'none' && pThis.css('visibility') != 'hidden' && elemData['css_top'] >= 0)) {
                                if ((diviMobile && elemData['css_position'] == 'absolute') || mainHeaderIsNotFixed) {
                                    pThis.attr('data-position', 'absolute')
                                } else if (!diviMobile && elemData['css_position'] == 'fixed') {
                                    pThis.attr('data-position', '')
                                }
                                if (selector != '') {
                                    if ($(selector).css('position') != 'static' && $(selector).css('position') != 'relative') {
                                        addTotalHeight = true;
                                        fixedElements[elemData['css_top']] = [];
                                        fixedElements[elemData['css_top']]['id'] = elemData['id'];
                                        fixedElements[elemData['css_top']]['class'] = elemData['class'];
                                        fixedElements[elemData['css_top']]['css_top'] = elemData['css_top'];
                                        fixedElements[elemData['css_top']]['css_height'] = elemData['css_height'];
                                        fixedElements[elemData['css_top']]['css_position'] = elemData['css_position'];
                                        elemHeight = elemData['css_height'];
                                        if (diviBodyElem.hasClass('et_transparent_nav')) {
                                            if (selector != '') {
                                                elemRef = $(selector);
                                                if (elemRef.length > 0) {
                                                    elemBackgroundRGBA = elemRef.css('background-color').split(',');
                                                    elemBackgroundAlpha = (elemBackgroundRGBA[3] !== undefined ? elemBackgroundRGBA[3].replace(/[^\d.-]/g, '') : 1);
                                                    if (elemBackgroundAlpha < 1 || elemRef.css('opacity') < 1) {
                                                        elemHeight = 0
                                                    }
                                                }
                                            }
                                        }
                                        if (!elemData['addDivibarHeight'] && !mainHeaderIsNotFixed) {
                                            addTotalHeight = false;
                                            pThis.attr('data-forceposition', 'fixed')
                                        } else {
                                            pThis.attr('data-forceposition', '')
                                        }
                                        if (addTotalHeight) {
                                            totalHeight = (totalHeight + elemData['css_height']);
                                            pageContainerPaddingTop = (pageContainerPaddingTop + elemHeight);
                                            lastElemHeight = elemData['css_height'];
                                            lastElemTop = elemData['css_top']
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                fixedElements['totalHeight'] = totalHeight;
                fixedElements['pageContainerPaddingTop'] = pageContainerPaddingTop;
                return fixedElements
            }

            function fixElementsPositionTop(elemData) {
                var selector, newCssTop, divibar_id = getActiveDivibar(),
                    divibar_selector = '#divibar-' + divibar_id,
                    divibarHeight = $(divibar_selector).find('.divibars-body').height();
                if (elemData['id'] != '') {
                    selector = '#' + elemData['id']
                } else if (elemData['class'] != '') {
                    selector = '.' + elemData['class']
                } else {
                    return false
                }
                if (divibarHeight !== null) {
                    newCssTop = divibarHeight + elemData['lastElemHeight']
                } else {
                    newCssTop = elemData['lastElemHeight'] + elemData['lastElemTop']
                }
                if (ExtraTheme && diviBodyElem.hasClass('et_fixed_nav')) {
                    if (diviTopHeader.css('position') !== 'relative') {
                        let topHeader = getElemHeight(diviTopHeader);
                        mainBody.removeClass('divibar-active').addClass('divibar-active-fast');
                        addStyles('#page-container', 'padding-top:' + topHeader + 'px !important;');
                        cacheBodyPaddingTop = topHeader;
                        setTimeout(function() {
                            mainBody.removeClass('divibar-active-fast').addClass('divibar-active')
                        }, 100)
                    }
                }
                addStyles(selector, 'width:100% !important;');
                let elemToPosition = $(selector);
                if (elemToPosition.css('position') != 'static' && elemToPosition.css('position') != 'relative') {
                    addStyles(selector, 'top:' + newCssTop + 'px !important;');
                    addStyles(selector, 'position:fixed !important;')
                }
                elemData['css_top'] = newCssTop;
                elemData['css_position'] = 'fixed';
                return elemData
            }
            var fixedElementsScrollHandler = function() {
                if (!$("html,body").hasClass('divibar-open')) {
                    return
                }
                if (fixedElements.length) {
                    autoPositionFixedElements(fixedElements)
                }
            };

            function autoPositionFixedElements(fixedElements) {
                var scroll = getScrollTop(),
                    selector, divibar_id = getActiveDivibar(),
                    divibar_selector = '#divibar-' + divibar_id,
                    divibar = $(divibar_selector),
                    divibarHeight = $(divibar_selector).find('.divibars-body').height(),
                    currentPosition, currentPositionTop, position, dataPosition, divibarScreenfixed = divibar.data('screenfixed');
                if (fixedElements[0]['id'].length) {
                    if (fixedElements[0]['id'] != '') {
                        selector = '#' + fixedElements[0]['id']
                    } else if (fixedElements[0]['class'] != '') {
                        selector = '.' + fixedElements[0]['class']
                    } else {
                        return false
                    }
                }
                dataPosition = $(selector).attr('data-position');
                if (dataPosition != 'absolute') {
                    if (!divibarScreenfixed) {
                        divibarHeight = divibarHeight - fixedElements['totalHeight']
                    }
                    if (dataPosition != 'fixed' && scroll > divibarHeight) {
                        scrollCheck = true;
                        whileScrollingUpdateFixedElementsPosition('fixed');
                        $(selector).attr('data-position', 'fixed')
                    } else if (dataPosition == 'fixed' && scroll < divibarHeight) {
                        scrollCheck = false;
                        whileScrollingUpdateFixedElementsPosition('absolute');
                        $(selector).attr('data-position', '')
                    }
                }
            }

            function whileScrollingUpdateFixedElementsPosition(position) {
                var selector, positionTop, divibar_id = getActiveDivibar(),
                    divibar_selector = '#divibar-' + divibar_id,
                    divibar = $(divibar_selector),
                    divibarHeight = divibar.find('.divibars-body').height(),
                    lastPosition, elemHeight, lastElemHeight = 0,
                    currentPosition, keepElementPosition, forceElementPosition, screenfixed = divibar.data('screenfixed');
                if (screenfixed && position == 'fixed') {
                    divibarHeight = 0
                }
                lastPosition = divibarHeight;
                $.each(fixedElements, function(index, value) {
                    if (Array.isArray(value)) {
                        if (value['id'] != '') {
                            selector = '#' + value['id']
                        } else if (value['class'] != '') {
                            selector = '.' + value['class']
                        } else {
                            return true
                        }
                        let theElement = $(selector);
                        keepElementPosition = theElement.attr('data-position') == 'absolute' ? true : false;
                        forceElementPosition = theElement.attr('data-forceposition') != '' ? theElement.attr('data-forceposition') : '';
                        if (value['css_position'] === 'fixed' && position !== value['css_position']) {
                            keepElementPosition = true;
                            position = value['css_position'];
                            scrollCheck = true
                        }
                        if (scrollCheck) {
                            lastPosition = lastPosition + lastElemHeight;
                            positionTop = lastPosition;
                            if (!keepElementPosition) {
                                theElement.attr('data-position', '')
                            }
                        } else if (!scrollCheck) {
                            currentPosition = parseInt(theElement.css('top'));
                            lastPosition = lastPosition - lastElemHeight;
                            if (screenfixed) {
                                positionTop = currentPosition + divibarHeight
                            } else {
                                positionTop = currentPosition - divibarHeight
                            }
                        }
                        if (positionTop <= divibarHeight) {
                            positionTop = divibarHeight
                        }
                        addStyles(selector, 'top:' + positionTop + 'px !important;');
                        if (!keepElementPosition) {
                            $(selector).removeClass('divibar-elem-transition-top');
                            if (position != null) {
                                if (forceElementPosition != '') {
                                    addStyles(selector, 'position:' + forceElementPosition + ' !important;')
                                } else {
                                    addStyles(selector, 'position:' + position + ' !important;')
                                }
                            }
                        }
                        if (diviMobile) {
                            if (divibar_selector != selector) {
                                if (selector != '#main-header' && (theElement.attr('class')).indexOf('--fixed') === -1) {
                                    addStyles(selector, 'position:absolute !important;')
                                }
                            }
                        }
                        elemHeight = value['css_height'];
                        lastElemHeight = elemHeight
                    }
                })
            }

            function setDivibarHeightBeforeInit(innerContainer) {
                initDiviElements();
                let divibarHeight = document.querySelector(innerContainer).getBoundingClientRect().height;
                return divibarHeight
            }

            function toggleDivibar(divibar_id) {
                var divibar_selector = '#divibar-' + divibar_id,
                    divibar_cache_selector = '#divibar-' + divibar_id,
                    divibar_container = '#divi-divibars-container-' + divibar_id,
                    divibar = diviBodyElem.find(divibar_cache_selector),
                    thisDivibar = $(divibar),
                    isMobile = divibar.attr('data-ismobile'),
                    isDiviBarsOpening = thisDivibar.hasClass('divibar-opening'),
                    isDivibarOpen = thisDivibar.hasClass('open');
                if (isDiviBarsOpening || thisDivibar.hasClass('divibar-closing')) {
                    return
                }
                if (!isDivibarOpen && !thisDivibar.hasClass('close')) {
                    thisDivibar.addClass('divibar-opening')
                }
                var displayonceperload = divibar.data('displayonceperload'),
                    preventOpen = divibar.attr('data-preventopen');
                var placement = divibar.data('placement'),
                    plSign = '+',
                    pushpage = divibar.data('pushpage'),
                    screenfixed = divibar.data('screenfixed');
                var cookieName = 'divibar' + divibar_id,
                    cookieDays = divibar.data('cookie');
                var pageContainer = $('#page-container');
                pageContainer.prepend(sidebarDivibar);
                var options = [];
                options['divibar_id'] = divibar_id;
                options['placement'] = placement;
                options['screenfixed'] = screenfixed;
                if (positionTimer !== undefined) {
                    positionTimer = setInterval(autoPositionAll, 100)
                }
                removeBloom();
                $('.divibars_dbars_section').addClass('et_pb_section').removeClass('divibars_dbars_section');
                $('.divibars-body #et-boc').removeAttr('id');
                $('.divibars-content-inner').attr('id', 'et-boc');
                let $divibarsBody = divibar.find('.divibars-body'),
                    hasParentWithLayoutClass = $divibarsBody.parents('.et-l').length;
                if (!hasParentWithLayoutClass) {
                    $divibarsBody.addClass('et-l')
                }
                if (placement == 'top') {
                    contentLengthcache = $(divibar_selector).text().length
                }
                if (readCookie(cookieName) && cookieDays != 0) {
                    return
                }
                if (!screenfixed) {
                    thisDivibar.css('position', 'fixed')
                }
                var divibarInner = 'body ' + divibar_cache_selector + ' .divibars-content-inner';
                if (!thisDivibar.hasClass('close') && !thisDivibar.hasClass('divibar-closing') && !preventOpen) {
                    if (pushpage) {
                        if (screenfixed) {
                            diviBodyElem.prepend(tempPagecontainer)
                        } else {
                            diviBodyElem.append(tempPagecontainer)
                        }
                        if (ExtraTheme) {
                            temp_et_pb_extra_column_main.prepend(sidebarDivibar)
                        } else {
                            tempPagecontainer.prepend(sidebarDivibar)
                        }
                    }
                }
                if (isDivibarOpen) {
                    thisDivibar.removeClass('open');
                    thisDivibar.addClass('close')
                }
                setTimeout(function() {
                    setDivibarHeightBeforeInit(divibarInner);
                    let diviBarsContainer = $(divibar_container),
                        divibarBodyWidth = divibar.width(),
                        divibarBodyRealSize = divibar.clone().attr('id', divibar_cache_selector + '-temp').css('width', divibarBodyWidth).attr('class', 'dbhidden');
                    divibarBodyRealSize.appendTo(diviBarsContainer);
                    let divibarBodyHeight = Math.round(divibarBodyRealSize.height());
                    divibarBodyRealSize.remove();
                    let divibarBodyRealSizeElem = document.getElementById(divibar_cache_selector + '-temp');
                    if (divibarBodyRealSizeElem !== null) {
                        divibarBodyRealSizeElem.parentNode.removeChild(divibarBodyRealSizeElem);
                        divibarBodyRealSizeElem.remove()
                    }
                    var divibarHeight = (divibarBodyHeight !== null && divibarBodyHeight > 0) ? divibarBodyHeight : document.querySelector(divibarInner).clientHeight,
                        bodyPaddingTopDivibar = (divibarHeight - cacheHtmlMarginTop) + 'px',
                        areDiviBarsActive = isActiveDivibar() ? true : false;
                    options['divibarHeight'] = divibarHeight;
                    options['bodyPaddingTopDivibar'] = bodyPaddingTopDivibar;
                    if (thisDivibar.hasClass('close')) {
                        thisDivibar.addClass('divibar-closing');
                        setTimeout(function() {
                            thisDivibar.removeClass('divibars-opened');
                            if (cookieDays > 0) {
                                createCookie(cookieName, 'true', cookieDays)
                            }
                            if (pushpage) {
                                $(window).off("scroll", fixedElementsScrollHandler);
                                options['pagecontainer'] = pageContainer;
                                pushBody(options, 'close')
                            }
                            if (screenfixed) {
                                if (htmlE.hasClass(cssclass_HtmlNoMargin)) {
                                    htmlE.removeClass(cssclass_HtmlNoMargin)
                                }
                            }
                            thisDivibar.animate({
                                height: '0px',
                                specialEasing: {
                                    height: "linear"
                                },
                                queue: false
                            }, 350, function() {
                                thisDivibar.removeClass('close');
                                if (displayonceperload) {
                                    $(divibar_container).remove()
                                } else {
                                    dibTogglePlayableTags('#divibar-' + divibar_id)
                                }
                                if (!areDiviBarsActive) {
                                    $("html,body").removeClass('divibar-open');
                                    if (pageContainer.length) {
                                        $("#page-container .container").addClass('divibar-pagecontainer-z1');
                                        $("#page-container #main-header").css('z-index', '99989')
                                    }
                                    sidebarDivibar.css('z-index', '-15');
                                    sidebarDivibar.removeClass('sidebar-divibar-bottom');
                                    if (screenfixed) {
                                        if (typeof diviBodyElemStyleCache != 'undefined' && diviBodyElemStyleCache != '') {
                                            $("body,html").attr('style', diviBodyElemStyleCache)
                                        } else {
                                            $("body,html").removeAttr('style')
                                        }
                                        sidebarDivibar.css('position', 'absolute')
                                    }
                                }
                                if (screenfixed) {
                                    affixFixedElements(divibarHeight, 'close')
                                }
                                $(divibar).find(".divibars-close-container").removeClass('dibShow');
                                setTimeout(function() {
                                    pageContainer.prepend(sidebarDivibar);
                                    tempPagecontainer.detach();
                                    if (!isActiveDivibar()) {
                                        areDiviBarsActive = false
                                    }
                                    if (!areDiviBarsActive) {
                                        if (ExtraTheme && diviBodyElem.hasClass('et_fixed_nav')) {
                                            mainBody.css('padding-top', '')
                                        }
                                        $('#' + styleTagID).empty();
                                        if (pageContainer.length) {
                                            $("#page-container .container").removeClass('divibar-pagecontainer-z1')
                                        }
                                        setTimeout(function() {
                                            stopAllTimers();
                                            thisDivibar.removeClass('divibar-closing')
                                        }, 500)
                                    }
                                }, 200)
                            })
                        }, 1)
                    } else if (!thisDivibar.hasClass('close') && !thisDivibar.hasClass('divibar-closing') && !preventOpen) {
                        cachePageContainer = pageContainer.css('padding-top');
                        var et_pb_newsletter = divibar.find('.et_pb_newsletter_form form .et_pb_newsletter_fields');
                        if (et_pb_newsletter.length) {
                            var et_pb_signup_divibarid = et_pb_newsletter.find('.et_pb_signup_divibarid');
                            if (et_pb_signup_divibarid.length < 1) {
                                $('<input>').attr({
                                    type: 'text',
                                    name: 'et_pb_signup_divibarid',
                                    class: 'et_pb_signup_divibarid et_pb_signup_custom_field',
                                    'data-original_id': 'et_pb_signup_divibarid',
                                    value: divibar_id
                                }).appendTo(et_pb_newsletter)
                            }
                        }
                        if (!screenfixed) {
                            if (placement) {
                                $(divibar).css(placement, plSign + '0')
                            }
                        }
                        if (screenfixed) {
                            if (htmlE.css('margin') !== '') {
                                htmlE.addClass(cssclass_HtmlNoMargin)
                            }
                        }
                        if (displayonceperload) {
                            divibar.attr('data-preventopen', 1)
                        }
                        divibar.attr('data-scrolltop', getScrollTop());
                        $("html,body").addClass('divibar-open');
                        if (pageContainer.length) {
                            $("#page-container .container").addClass('divibar-pagecontainer-z0')
                        }
                        divibar.css('height', 0);
                        setTimeout(function() {
                            sidebarDivibar.css('z-index', '16777200');
                            divibar.removeClass('divibar-opening');
                            divibar.addClass('open');
                            divibar.animate({
                                height: divibarHeight + 'px',
                                specialEasing: {
                                    height: "linear"
                                }
                            }, 300, function() {
                                if (placement == 'top') {
                                    divibarHeightCache = getElemHeight($(divibar_selector))
                                }
                                divibar.addClass('divibars-opened');
                                divibar.find(".divibars-close-container").addClass('dibShow');
                                initDiviElements();
                                $("#page-container .container").removeClass('divibar-pagecontainer-z0');
                                stopAutoPositionTimer()
                            });
                            if (pushpage && !diviBodyElem.hasClass('divibars-pushed')) {
                                pushBody(options, 'open');
                                $(window).scroll(fixedElementsScrollHandler);
                                if (screenfixed) {
                                    diviBodyElem.addClass('divibars-pushed');
                                    sidebarDivibar.css('position', 'relative');
                                    divibar.css('position', 'relative');
                                    affixFixedElements(divibarHeight, 'open')
                                }
                            }
                            if (divibar.attr('data-bgcolor') != "") {
                                $(divibar_cache_selector).css({
                                    'background-color': divibar.attr('data-bgcolor')
                                })
                            }
                            if (divibar.attr('data-fontcolor') != "") {
                                $(divibar_cache_selector).css('color', divibar.attr('data-fontcolor'))
                            }
                        }, 1)
                    }
                }, 350)
            }

            function initDiviElements() {
                $(window).trigger("resize");
                let $et_pb_circle_counter = $(".divibars-body .et_pb_circle_counter"),
                    $et_pb_number_counter = $(".divibars-body .et_pb_number_counter"),
                    $et_pb_countdown_timer = $(".divibars-body .et_pb_countdown_timer");
                setTimeout(function() {
                    window.et_fix_testimonial_inner_width(), $et_pb_circle_counter.length && window.et_pb_reinit_circle_counters($et_pb_circle_counter), $et_pb_number_counter.length && window.et_pb_reinit_number_counters($et_pb_number_counter), $et_pb_countdown_timer.length && window.et_pb_countdown_timer_init($et_pb_countdown_timer), window.et_reinit_waypoint_modules()
                }, 1)
            }

            function getScrollTop() {
                if (typeof pageYOffset != 'undefined') {
                    return pageYOffset
                } else {
                    var B = document.body;
                    var D = document.documentElement;
                    D = (D.clientHeight) ? D : B;
                    return D.scrollTop
                }
            }

            function showDivibar(divibar_id) {
                if (!isInt(divibar_id)) {
                    return
                }
                let the_divibar = $(divibarsDetached[divibar_id]);
                the_divibar.appendTo(sidebarDivibar);
                divi_divibar_container_selector = '#divi-divibars-container-' + divibar_id;
                if ($(divi_divibar_container_selector).length) {
                    divibar_body = $(divi_divibar_container_selector).find('.divibars');
                    toggleSrcInPlayableTags(divibar_body);
                    toggleDivibar(divibar_id)
                }
            }

            function showdivibarOnce(divibar_id) {
                if (!isInt(divibar_id)) {
                    return
                }
                divibar = '#divibar-' + divibar_id;
                $(divibarsDetached[divibar_id]).find(divibar).attr('data-displayonceperload', 1)
            }

            function toggleSrcInPlayableTags(str) {
                str.find("iframe").each(function() {
                    var src = $(this).data('src');
                    $(this).attr('src', src)
                });
                return str
            }

            function addListenersToTriggerCloseButton() {
                diviBodyElem.on('click touch tap', '.divibars-close, .divibars-close span, .close-divibar', function(e) {
                    if (e.target !== e.currentTarget) {
                        return
                    }
                    closeDivibar(this)
                })
            }
            addListenersToTriggerCloseButton();

            function closeActiveDivibar(divibar_id) {
                var divibar = diviBodyElem.find('.divibars.open');
                if (divibar.length) {
                    if (divibar_id === undefined || divibar_id === null) {
                        var divibarArr = divibar.attr('id').split('-');
                        divibar_id = divibarArr[1]
                    }
                    closeDivibar(false, divibar_id)
                }
            }

            function closeDivibar(elem, divibar_id) {
                if ((divibar_id === undefined || divibar_id === null) && elem) {
                    var divibarArr = $(elem).parents('.divibars').attr('id').split('-');
                    divibar_id = divibarArr[1]
                }
                divibar_id = parseInt(divibar_id);
                if (isInt(divibar_id)) {
                    if (!$('#divibar-' + divibar_id).hasClass('open')) {
                        return
                    }
                    showDivibar(divibar_id)
                }
            }

            function getActiveDivibar() {
                var divibar = null,
                    divibar_id = null,
                    elemID = null,
                    placement = null;
                $('.divibars.open').each(function(index, el) {
                    placement = $(this).data('placement');
                    if (placement == 'top') {
                        elemID = $(this).attr('id');
                        divibar = $('#' + elemID)
                    }
                });
                if (!divibar) {
                    divibar = diviBodyElem.find('.divibars.close')
                }
                if (divibar.length) {
                    var divibarArr = divibar.attr('id').split('-');
                    var divibar_id = divibarArr[1]
                }
                return divibar_id
            }

            function isOpeningDivibar(divibar_id) {
                if (!divibar_id) {
                    return null
                }
                var divibar = $('#divibar-' + divibar_id);
                if ($(divibar).css('opacity') < 1) {
                    return true
                }
                return false
            }

            function isClosingdivibar(divibar_id) {
                if (!divibar_id) {
                    return null
                }
                var divibar = $('#divibar-' + divibar_id);
                if ($(divibar).hasClass('close') || $(divibar).hasClass('divibar-closing')) {
                    return false
                }
                return true
            }

            function isActiveDivibar(divibar_id) {
                var divibar;
                if (!divibar_id) {
                    divibar = $('.divibars.open');
                    if (divibar.length > 0) {
                        return true
                    }
                } else {
                    divibar = $('#divibar-' + divibar_id);
                    if ($(divibar).hasClass('open')) {
                        return true
                    }
                }
                return false
            }

            function activeDiviBarsOnTopPushingBody(divibar_id) {
                var divibars = $('.divibars.open[data-pushpage=1][data-placement=top]:not( #divibar-' + divibar_id + ' )');
                if (divibars.length > 0) {
                    return divibars
                }
            }

            function isInt(value) {
                var x;
                return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x)
            }

            function pushBody(options, status, onlyPushBody) {
                var placement = options['placement'],
                    screenfixed = options['screenfixed'],
                    bodyPaddingTopDivibar = options['bodyPaddingTopDivibar'],
                    divibarHeight = options['divibarHeight'],
                    areDiviBarsActive = isActiveDivibar() ? true : false,
                    areDiviBarsOnTopPushingBody = activeDiviBarsOnTopPushingBody(options['divibar_id']) ? true : false,
                    pageContainer = options['pagecontainer'];
                if (status == 'close') {
                    if (!areDiviBarsActive && placement !== 'bottom') {
                        sidebarDivibar.css('z-index', '1')
                    }
                    if (placement == 'bottom') {
                        if (!screenfixed) {
                            diviBodyElem.animate({
                                paddingBottom: cacheBodyPaddingBottom + 'px'
                            })
                        }
                    }
                    if (placement == 'top') {
                        diviBodyElem.animate({
                            paddingTop: cacheBodyPaddingTop + 'px'
                        });
                        setTimeout(function() {
                            if ('undefined' === cachePageContainer) {
                                cachePageContainer = '0px'
                            }
                            pageContainer.css('padding-top', cachePageContainer)
                        }, 1);
                        if (!onlyPushBody) {
                            if (areDiviBarsActive && areDiviBarsOnTopPushingBody) {
                                updateFixedElementsPosition('close', false, null, divibarHeight)
                            } else {
                                updateFixedElementsPosition('close')
                            }
                        }
                    }
                } else if (status == 'open') {
                    if (placement == 'bottom') {
                        if (!screenfixed) {
                            diviBodyElem.animate({
                                paddingBottom: divibarHeight + 'px'
                            })
                        }
                    }
                    if (placement == 'top') {
                        if (!areDiviBarsOnTopPushingBody) {
                            if (ExtraTheme && diviBodyElem.hasClass('et_fixed_nav')) {
                                let wpadminbar = $('#wpadminbar'),
                                    wpadminbarHeight = (wpadminbar.length ? getElemHeight(wpadminbar) : 0),
                                    topHeader = getElemHeight(diviTopHeader),
                                    pageContainerPaddingTop;
                                if (diviTopHeader.css('position') === 'relative') {
                                    topHeader = 0
                                }
                                pageContainerPaddingTop = topHeader + wpadminbarHeight;
                                addStyles('#page-container', 'padding-top:' + pageContainerPaddingTop + 'px !important;')
                            } else {
                                addStyles('#page-container', 'padding-top:' + fixedElements['pageContainerPaddingTop'] + 'px !important;')
                            }
                            if (!screenfixed) {
                                diviBodyElem.animate({
                                    paddingTop: bodyPaddingTopDivibar
                                })
                            }
                            if (!onlyPushBody) {
                                updateFixedElementsPosition('open')
                            }
                        }
                    }
                }
                return
            }

            function updateFixedElementsPosition(divibarStatus, transition, position, forceHeight) {
                var selector, positionTop, divibar_id = getActiveDivibar(),
                    divibar_selector = '#divibar-' + divibar_id,
                    divibar = $(divibar_selector),
                    divibarHeight = divibar.find('.divibars-body').height(),
                    lastPosition, elemHeight, lastElemHeight = 0,
                    currentPosition, keepElementPosition, forceElementPosition, transition = typeof transition !== 'undefined' ? transition : true,
                    forceHeight = typeof forceHeight !== 'undefined' ? forceHeight : null;
                if (forceHeight) {
                    divibarHeight = forceHeight
                }
                lastPosition = divibarHeight;
                $.each(fixedElements, function(index, value) {
                    if (Array.isArray(value)) {
                        if (value['id'] != '') {
                            selector = '#' + value['id']
                        } else if (value['class'] != '') {
                            selector = '.' + value['class']
                        } else {
                            return true
                        }
                        let theElement = $(selector);
                        keepElementPosition = theElement.attr('data-position') == 'absolute' ? true : false;
                        forceElementPosition = theElement.attr('data-forceposition') != '' ? theElement.attr('data-forceposition') : '';
                        if (divibarStatus == 'open') {
                            lastPosition = lastPosition + lastElemHeight;
                            positionTop = lastPosition;
                            if (!keepElementPosition) {
                                theElement.attr('data-position', '')
                            }
                        } else if (divibarStatus == 'close') {
                            currentPosition = parseInt(theElement.css('top'));
                            lastPosition = lastPosition - lastElemHeight;
                            positionTop = currentPosition - divibarHeight;
                            positionTop = Math.round(positionTop);
                            if (positionTop < 0) {
                                positionTop = 0
                            }
                        }
                        if (positionTop >= 0) {
                            if (transition) {
                                theElement.addClass('divibar-elem-transition-top');
                                addStyles(selector, 'top:' + positionTop + 'px !important;')
                            } else {
                                addStyles(selector, 'top:' + positionTop + 'px !important;');
                                if (!keepElementPosition) {
                                    theElement.removeClass('divibar-elem-transition-top');
                                    if (position != null) {
                                        if (forceElementPosition != '') {
                                            addStyles(selector, 'position:' + forceElementPosition + ' !important;')
                                        } else {
                                            addStyles(selector, 'position:' + position + ' !important;')
                                        }
                                    }
                                }
                                if (diviMobile) {
                                    if (divibar_selector != selector) {
                                        if (selector != '#main-header' && (theElement.attr('class')).indexOf('--fixed') === -1) {
                                            addStyles(selector, 'position:absolute !important;')
                                        }
                                    }
                                }
                            }
                        }
                        elemHeight = value['css_height'];
                        lastElemHeight = elemHeight
                    }
                })
            }

            function affixFixedElements(divibarHeight, divibarStatus) {
                var selector, position, divibarHeight, keepElementPosition, forceElementPosition;
                $.each(fixedElements, function(index, value) {
                    if (Array.isArray(value)) {
                        if (value['id'] != '') {
                            selector = '#' + value['id']
                        } else if (value['class'] != '') {
                            selector = '.' + value['class']
                        } else {
                            return true
                        }
                        keepElementPosition = $(selector).attr('data-position') == 'absolute' ? true : false;
                        forceElementPosition = $(selector).attr('data-forceposition') != '' ? $(selector).attr('data-forceposition') : '';
                        if (divibarStatus == 'open') {
                            position = 'absolute'
                        } else if (divibarStatus == 'close') {
                            position = 'fixed'
                        }
                        if (!keepElementPosition) {
                            if (forceElementPosition != '') {
                                addStyles(selector, 'position:' + forceElementPosition + ' !important;')
                            } else {
                                addStyles(selector, 'position:' + position + ' !important;')
                            }
                        }
                    }
                })
            }

            function testEvents(obj) {
                var retVal = false;
                var windowEvents = $._data(obj, "events");
                return
            }

            function updateFixedElementsPositionOnly() {
                var selector, positionTop, divibar_id = getActiveDivibar(),
                    divibar_selector = '#divibar-' + divibar_id,
                    divibar = $(divibar_selector),
                    divibarHeight = divibar.find('.divibars-body').height(),
                    lastPosition, elemHeight, currentElemHeight, lastElemHeight = 0,
                    currentPosition, counter = 0,
                    divibarScreenfixed = divibar.data('screenfixed');
                lastPosition = divibarHeight;
                $.each(fixedElements, function(index, value) {
                    if (Array.isArray(value)) {
                        if (value['id'] != '') {
                            selector = '#' + value['id']
                        } else if (value['class'] != '') {
                            selector = '.' + value['class']
                        } else {
                            return true
                        }
                        if (scrollCheck && counter == 0 && divibarScreenfixed) {
                            lastPosition = 0;
                            counter += 1
                        }
                        currentElemHeight = getElemHeight($(selector));
                        elemHeight = value['css_height'];
                        if (currentElemHeight != elemHeight) {
                            elemHeight = currentElemHeight
                        }
                        lastPosition = lastPosition + lastElemHeight;
                        positionTop = lastPosition;
                        addStyles(selector, 'top:' + positionTop + 'px !important;');
                        lastElemHeight = elemHeight
                    }
                })
            }

            function autoPositionAll() {
                var divibar_id = getActiveDivibar();
                diviMobile = isDiviMobile();
                if (divibar_id) {
                    var divibar_selector = '#divibar-' + divibar_id,
                        divibar = $(divibar_selector),
                        contentLength = divibar.text().length,
                        divibarHeight = getElemHeight($(divibar_selector).find('.divibars-body')),
                        placement = divibar.data('placement'),
                        pushpage = divibar.data('pushpage'),
                        screenfixed = divibar.data('screenfixed'),
                        areDiviBarsOnTopPushingBody = activeDiviBarsOnTopPushingBody() ? true : false;
                    if (divibar.hasClass('divibars-opened')) {
                        divibar.css('height', divibarHeight);
                        if ((contentLength != contentLengthcache) || (divibarHeight != divibarHeightCache)) {
                            var bodyPaddingTopDivibar = (divibarHeight - cacheHtmlMarginTop) + 'px',
                                options = [];
                            options['pushpage'] = pushpage;
                            options['placement'] = placement;
                            options['screenfixed'] = screenfixed;
                            options['divibarHeight'] = divibarHeight;
                            options['bodyPaddingTopDivibar'] = bodyPaddingTopDivibar;
                            $(divibar_selector).animate({
                                height: divibarHeight + 'px'
                            });
                            if ((diviMobile === false && diviMobileCache === true) || (diviMobile === true && diviMobileCache === false)) {
                                stopAutoPositionTimer();
                                updateGlobals(options)
                            } else {
                                if (pushpage) {
                                    if (placement == 'top' || screenfixed) {
                                        updateFixedElementsPosition('open', false, null, divibarHeight)
                                    }
                                    if (placement == 'top' && !areDiviBarsOnTopPushingBody) {
                                        pushBody(options, 'open', true)
                                    }
                                }
                                contentLengthcache = contentLength;
                                divibarHeightCache = divibarHeight
                            }
                        } else {
                            if (pushpage) {
                                if (placement == 'top') {
                                    updateFixedElementsPositionOnly()
                                }
                            }
                        }
                    }
                }
            }

            function updateGlobals(options) {
                var placement = options['placement'],
                    pushpage = options['pushpage'],
                    screenfixed = options['screenfixed'],
                    divibarHeight = options['divibarHeight'],
                    selector;
                diviMobile = diviMobileCache = isDiviMobile();
                setTimeout(function() {
                    removeStyles();
                    setTimeout(function() {
                        fixedElements = getFlyingElements();
                        setTimeout(function() {
                            $.each(fixedElements, function(index, value) {
                                if (Array.isArray(value)) {
                                    if (value['id'] != '') {
                                        selector = '#' + value['id']
                                    } else if (value['class'] != '') {
                                        selector = '.' + value['class']
                                    } else {
                                        return true
                                    }
                                    $(selector).removeAttr('data-position')
                                }
                            });
                            setTimeout(function() {
                                affixFixedElements(divibarHeight, 'open');
                                setTimeout(function() {
                                    if (pushpage) {
                                        if (placement == 'top' || screenfixed) {
                                            updateFixedElementsPosition('open', false, null, divibarHeight)
                                        }
                                        pushBody(options, 'open', true)
                                    }
                                    if (positionTimer !== undefined) {
                                        positionTimer = setInterval(autoPositionAll, 100)
                                    }
                                }, 1)
                            }, 1)
                        }, 1)
                    }, 1)
                }, 1)
            }

            function removeBloom() {
                if ($('.divibars .et_bloom_below_post').length) {
                    $('.divibars .et_bloom_below_post').parents('.et_pb_row').remove()
                }
                if (removeBloomTimer !== undefined) {
                    removeBloomTimer = setTimeout(removeBloom, 500)
                }
            }

            function stopAutoPositionTimer() {
                if (positionTimer) {
                    clearInterval(positionTimer);
                    positionTimer = 0
                }
            }

            function stopAllTimers() {
                if (positionTimer) {
                    clearInterval(positionTimer);
                    positionTimer = 0
                }
                if (removeMonarchTimer) {
                    clearTimeout(removeMonarchTimer);
                    removeMonarchTimer = 0
                }
                if (removeBloomTimer) {
                    clearTimeout(removeBloomTimer);
                    removeBloomTimer = 0
                }
            }

            function getElemHeight(elem) {
                var elemHeight = 0,
                    attr;
                if (elem.length) {
                    elemHeight = elem.outerHeight();
                    if (elemHeight === 0) {
                        attr = elem.attr('id');
                        if (typeof attr !== typeof undefined && attr !== false) {
                            elemHeight = document.getElementById(attr).offsetHeight
                        }
                    }
                    if (elemHeight === 0) {
                        elemHeight = elem.delay(100).outerHeight()
                    }
                    elemHeight = parseInt(elemHeight)
                }
                return elemHeight
            }

            function addStyles(selector, css) {
                var CSSline, CSSlines, regexCSSline, regex, divibarStylesTag = $('#' + styleTagID),
                    divibarStylesTagContent = divibarStylesTag.text();
                if (selector && selector != '#undefined') {
                    CSSline = 'body.divibar-open ' + selector + ' { ' + css + ' }';
                    if (ExtraTheme && diviBodyElem.hasClass('et_fixed_nav')) {
                        CSSline += 'body.et_extra.et_fixed_nav ' + selector + ' { ' + css + ' }'
                    }
                    if (diviBodyElem.hasClass('et_fixed_nav') && diviBodyElem.hasClass('admin-bar')) {
                        CSSline += 'body.et_fixed_nav.admin-bar ' + selector + ' { ' + css + ' }'
                    }
                    if (diviBodyElem.hasClass('et_fixed_nav') && diviBodyElem.hasClass('et_secondary_nav_only_menu') && diviBodyElem.hasClass('admin-bar')) {
                        CSSline += 'body.et_fixed_nav.et_secondary_nav_only_menu.admin-bar #main-header' + selector + ' { ' + css + ' }'
                    }
                    regexCSSline = escapeRegExp(CSSline);
                    regex = new RegExp(regexCSSline, 'g');
                    divibarStylesTagContent = divibarStylesTagContent.replace(regex, '');
                    divibarStylesTag.text(divibarStylesTagContent);
                    divibarStylesTag.append(CSSline);
                }
            }

            function escapeRegExp(string) {
                return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }

            function removeStyles(selector) {
                var CSSline, regexCSSline, regex, divibar_id = getActiveDivibar(),
                    divibar_selector = '#divibar-' + divibar_id,
                    divibarStylesTag = $('#' + styleTagID),
                    divibarStylesTagContent = divibarStylesTag.text();
                if (selector && selector != '#undefined') {
                    selector = [selector]
                } else {
                    selector = fixedElements
                }
                $.each(selector, function(index, value) {
                    if (Array.isArray(value)) {
                        if (value['id'] != '') {
                            selector = '#' + value['id']
                        } else if (value['class'] != '') {
                            selector = '.' + value['class']
                        } else {
                            return true
                        }
                        CSSline = 'body.divibar-open ' + selector + ' { position:absolute !important; }';
                        regexCSSline = escapeRegExp(CSSline);
                        regex = new RegExp(regexCSSline, 'g');
                        divibarStylesTagContent = divibarStylesTagContent.replace(regex, '');
                        CSSline = 'body.et_fixed_nav.et_secondary_nav_only_menu.admin-bar ' + selector + ' { position:absolute !important; }';
                        regexCSSline = escapeRegExp(CSSline);
                        regex = new RegExp(regexCSSline, 'g');
                        divibarStylesTagContent = divibarStylesTagContent.replace(regex, '');
                        CSSline = 'body.divibar-open ' + selector + ' { position:fixed !important; }';
                        regexCSSline = escapeRegExp(CSSline);
                        regex = new RegExp(regexCSSline, 'g');
                        divibarStylesTagContent = divibarStylesTagContent.replace(regex, '');
                        CSSline = 'body.et_fixed_nav.et_secondary_nav_only_menu.admin-bar ' + selector + ' { position:fixed !important; }';
                        regexCSSline = escapeRegExp(CSSline);
                        regex = new RegExp(regexCSSline, 'g');
                        divibarStylesTagContent = divibarStylesTagContent.replace(regex, '')
                    }
                });
                divibarStylesTag.text(divibarStylesTagContent)
            }

            function isDiviMobile() {
                let currentTheme = detectTheme();
                vw = actual('width', 'px');
                diviMobile = (vw < themesBreakpoint[currentTheme]) ? true : false;
                return diviMobile
            }

            function createCookie(name, value, days) {
                var expires = "";
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = "; expires=" + date.toUTCString()
                }
                document.cookie = name + "=" + value + expires + "; path=/;SameSite=Lax"
            }

            function readCookie(name) {
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i += 1) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1, c.length)
                    }
                    if (c.indexOf(nameEQ) == 0) {
                        return c.substring(nameEQ.length, c.length)
                    }
                }
                return null
            }

            function eraseCookie(name) {
                createCookie(name, '', -1)
            }
            if (window.location.hash) {
                var hash = window.location.hash.substring(1);
                var idx_divibar = hash.indexOf('divibar');
                if (idx_divibar !== -1) {
                    var idx_divibarArr = hash.split('-');
                    if (idx_divibarArr.length > 1) {
                        var divibar_id = idx_divibarArr[1];
                        setTimeout(function() {
                            showDivibar(divibar_id)
                        }, 1)
                    }
                }
            }
        }
    };
    var $dibiframes = $("#sidebar-divibar .divibars iframe");
    setTimeout(function() {
        $dibiframes.each(function() {
            let iframeHeight = this.height;
            if (iframeHeight == '') {
                iframeHeight = $(this).height()
            }
            let iframeWidth = this.width;
            if (iframeWidth == '') {
                iframeWidth = $(this).width()
            }
            iframeHeight = parseInt(iframeHeight);
            iframeWidth = parseInt(iframeWidth);
            let ratio = iframeHeight / iframeWidth;
            $(this).attr("data-ratio", ratio).removeAttr("width").removeAttr("height");
            let width = $(this).parent().width();
            if (width === 0) {
                width = '100%';
                $(this).width(width)
            } else {
                $(this).width(width).height(width * ratio)
            }
        })
    }, 200);
    var db_getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName, i;
        for (i = 0; i < sURLVariables.length; i += 1) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1]
            }
        }
    };
    $(window).on('resize orientationchange', function() {
        $dibiframes.each(function() {
            var width = $(this).parent().width();
            $(this).width(width).height(width * $(this).data("ratio"))
        })
    });
    diviBodyElem.prepend($("#sidebar-divibar"));
    $(window).on("load", function(e) {
        if (db_getUrlParameter('et_fb') != 1) {
            if (!$('.et_pb_section.et_pb_fullwidth_section').length && !$('.et_pb_fullwidth_header')) {
                $('#sidebar-divibar .divibars').mainDiviBars()
            } else {
                let sidebar = $('#sidebar-divibar');
                sidebar.css('position', 'absolute');
                sidebar.css('visibility', 'visible');
                sidebar.css('display', 'block');
                $('#sidebar-divibar .divibars').mainDiviBars()
            }
        }
    })
})(jQuery, window, document);