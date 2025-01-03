var dmpSingletonInstance = null;
! function(send) {
    var divimegapro_ajax_intercept = function(body) {
        var isDiviMegaProOpen = document.querySelectorAll('.divimegapro.dmp-open'),
            isDiviOverlaysOpen = document.querySelectorAll('.overlay.open');
        if (isDiviMegaProOpen.length > 0 && isDiviOverlaysOpen.length < 1) {
            try {
                if (body !== null) {
                    var doCustomFieldName = 'et_pb_signup_divimegaproid',
                        action = 'action=et_pb_submit_subscribe_form',
                        is_optin_submit_subscribe_form = body.indexOf(action),
                        is_divimegapro_ref_form = body.indexOf(doCustomFieldName);
                    if (is_optin_submit_subscribe_form !== -1 && is_divimegapro_ref_form !== -1) {
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
    XMLHttpRequest.prototype.send = divimegapro_ajax_intercept
}(XMLHttpRequest.prototype.send);
(function() {
    var dmp_nTimer = setInterval(function() {
        if (typeof jQuery !== 'undefined') {
            function isNitroPackEnabled() {
                let nitropack = false;
                if (jQuery('[id^="nitropack"]').length > 0 || jQuery('[class^="nitropack"]').length > 0 || typeof window.IS_NITROPACK !== 'undefined' || typeof window.NITROPACK_STATE !== 'undefined' || jQuery('[id="nitro-telemetry"]').length > 0) {
                    nitropack = true
                }
                return nitropack
            }
            let delayMegaProInit = (isNitroPackEnabled() === true) ? 1000 : 1;
            setTimeout(function() {;
                (function($, window, document, undefined) {
                    'use strict';
                    var refMenuItemHasChildren = $('.menu-item.menu-item-has-children'),
                        pagecontainer = $('#page-container'),
                        divimegaprowrapper = $('.divimegapro-wrapper'),
                        body = $('body'),
                        isIOS = body.hasClass('osx'),
                        divimegapros = {};
                    $.fn.mainDiviMegaPro = function(options) {
                        var divimegapro_body, divimegapro, idx_divimegapro, divi_divimegapro_container_selector, $divimegapro = this,
                            contentLengthcache, divimegaproHeightCache, diviMobile, isIphone, smallDevice, isDiviMenuBarVisible = $('.mobile_menu_bar').is(':visible'),
                            themesBreakpoint = {
                                Divi: 980,
                                Extra: 1024
                            },
                            vw, fixedElements, scrollCheck, diviElement_togglePro, initDiviElements_timer = null,
                            initDiviFuncs_timer = null,
                            diviet_fix_slider_height = window.et_fix_slider_height,
                            defaultArrow = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"/></svg>';
                        const singletonContentCache = [],
                            styleTagID = 'divi-mega-pro-styles',
                            diviMenuHover_observeConfig = {
                                attributes: true,
                                childList: false,
                                subtree: false
                            },
                            diviMenuHover_callback = function(mutationsList, observer) {
                                mutationsList.forEach(function(mutation) {
                                    if (mutation.type === 'attributes') {
                                        let refElement = $(mutation.target);
                                        checkDiviMenuHover(refElement)
                                    }
                                })
                            },
                            diviMenuHover_observer = new MutationObserver(diviMenuHover_callback),
                            supportIGMap = {},
                            supportRevSlider = {},
                            hideOnEsc = {
                                name: 'hideOnEsc',
                                defaultValue: true,
                                fn({
                                    hide
                                }) {
                                    function onKeyDown(event) {
                                        if (event.keyCode === 27) {
                                            hide()
                                        }
                                    }
                                    return {
                                        onShow() {
                                            document.addEventListener('keydown', onKeyDown)
                                        },
                                        onHide() {
                                            document.removeEventListener('keydown', onKeyDown)
                                        }
                                    }
                                }
                            };

                        function checkDiviMenuHover(refElement) {
                            if (!refElement.hasClass('et-hover')) {
                                refElement.addClass('et-hover')
                            }
                        }

                        function emulateIOS(listener) {
                            let clicks = 0;
                            return function() {
                                clicks += 1;
                                if (clicks === 2 || isIOS) {
                                    clicks = 0;
                                    listener.apply(this, arguments)
                                }
                            }
                        }
                        const dmps = {};
                        const dmps_tippyinstances = [];
                        var dmpsSingleton = 0;
                        var diviPageContainer = document.getElementById('page-container'),
                            diviPageContainerBody = $('.et-db #et-boc .et-l').not(function() {
                                return $(this).parents('#sidebar-overlay').length === 1 || $(this).parents('.divimegapro-container').length === 1
                            }),
                            diviTopHeader = document.getElementById('top-header'),
                            diviAltHeader = document.querySelector('header.et-l--header'),
                            diviAltHeaderMenu = document.querySelector('.et-l--header .et_pb_row--with-menu'),
                            diviAltMainContentMenu = document.querySelector('#main-content .et_pb_row--with-menu'),
                            diviMainHeader = document.getElementById('main-header'),
                            diviMainFooter = document.getElementById('main-footer'),
                            documentHTML = $('html'),
                            documentBody = document.body,
                            dynamicHeightTimer = 0;
                        if (diviPageContainerBody.length > 0) {
                            diviPageContainer = diviPageContainerBody[0]
                        }
                        if (typeof options == 'function') {
                            options = {
                                success: options
                            }
                        } else if (options === undefined) {
                            options = {}
                        }
                        $('<style id="' + styleTagID + '"></style>').appendTo('head');
                        if ($('div.divimegapro-container').length) {
                            diviMobile = isDiviMobile();
                            isIphone = isIphone();
                            if (window.matchMedia) {
                                smallDevice = window.matchMedia('(max-device-width: 414px)').matches
                            } else {
                                smallDevice = screen.width <= 414
                            }
                            if (diviMobile) {
                                diviElement_togglePro = $('.et_mobile_nav_menu > .mobile_nav');
                                if (diviElement_togglePro.length) {
                                    diviElement_togglePro.on('click touchstart', function(e) {
                                        if ($('.tippy-popper').length && $(e.target).hasClass('mobile_menu_bar')) {
                                            var allPoppers = document.querySelectorAll('.tippy-popper');
                                            $.each(allPoppers, function(index, popper) {
                                                const instance = popper._tippy;
                                                if (instance.state.isVisible) {
                                                    instance.hide()
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                            var divimegapro_container = $('div.divimegapro-wrapper'),
                                container = $('div#page-container'),
                                removeMonarchTimer = 0;

                            function applyAccesibility(pThis, selector) {
                                if (typeof pThis !== 'undefined' && pThis !== '') {
                                    pThis.attr('aria-haspopup', 'dialog')
                                }
                            }

                            function observeDiviDefaultStickyElems(elem) {
                                let setAttribute = elem.setAttribute;
                                elem.setAttribute = function(key, value) {
                                    setAttribute.call(elem, key, value)
                                }
                            }
                            $(divimegapro_container).each(function() {
                                let iddmp = this.id;
                                if (typeof iddmp !== 'undefined' && iddmp !== '') {
                                    $('[id="' + this.id + '"]:gt(0)').remove()
                                }
                            });

                            function avoidDiviHashIssues(elemTrigger) {
                                let href = elemTrigger.attr('href');
                                if (href !== undefined) {
                                    let hash = href[0];
                                    if (typeof hash !== 'undefined') {
                                        if (hash == '#' && hash.length > 1) {
                                            elemTrigger.off('click')
                                        }
                                    }
                                } else if (href === undefined) {
                                    elemTrigger.attr('href', '#dmp');
                                    elemTrigger.off('click')
                                }
                            }

                            function removeEventsOnParentDiviNav(elemTrigger) {
                                let parent_has_divi_nav = elemTrigger.parents('.nav');
                                if (diviMobile === true && parent_has_divi_nav.length > 0) {
                                    elemTrigger.parent().off()
                                }
                            }
                            $('body [class*="divimegapro"]').each(function() {
                                let pThis = $(this),
                                    divimegaproArr = pThis.attr('class'),
                                    divimegapro_match = divimegaproArr.match(/divimegapro-(\d+)/),
                                    selector = this,
                                    divimegapro_id = null;
                                if (null != divimegapro_match) {
                                    divimegapro_id = divimegapro_match[1];
                                    if (divimegapro_id) {
                                        let is_divi_mobile_nav = pThis.parents('.mobile_nav');
                                        if (is_divi_mobile_nav.length > 0) {
                                            avoidDiviHashIssues(pThis);
                                            let aLink = pThis.find('a');
                                            if (aLink.length > 0) {
                                                aLink.attr('rel', 'divimegapro-' + divimegapro_id)
                                            }
                                        } else {
                                            selector.setAttribute('data-divimegaproid', divimegapro_id);
                                            applyAccesibility(pThis);
                                            createDiviMegaPro(divimegapro_id, selector)
                                        }
                                    }
                                }
                            });
                            $('body [rel^="divimegapro"]').each(function() {
                                let pThis = $(this),
                                    divimegaproArr = pThis.attr('rel').split('-'),
                                    divimegapro_id = parseInt(divimegaproArr[1]),
                                    selector = this;
                                if (divimegapro_id) {
                                    let is_divi_mobile_nav = pThis.parents('.mobile_nav');
                                    if (is_divi_mobile_nav.length > 0) {
                                        avoidDiviHashIssues(pThis)
                                    } else {
                                        removeEventsOnParentDiviNav(pThis)
                                    }
                                    selector.setAttribute('data-divimegaproid', divimegapro_id);
                                    applyAccesibility(pThis);
                                    createDiviMegaPro(divimegapro_id, selector)
                                }
                            });
                            $('.nav a, .mobile_nav a').each(function(index, value) {
                                let href = $(value).attr('href');
                                if (href !== undefined) {
                                    idx_divimegapro = href.indexOf('divimegapro');
                                    if (idx_divimegapro !== -1) {
                                        let idx_divimegaproArr = href.split('-');
                                        if (idx_divimegaproArr.length > 1) {
                                            let divimegapro_id = parseInt(idx_divimegaproArr[1]);
                                            if (divimegapro_id) {
                                                let pThis = $(this),
                                                    selector = this;
                                                selector.setAttribute('data-divimegaproid', divimegapro_id);
                                                applyAccesibility(pThis);
                                                createDiviMegaPro(divimegapro_id, selector)
                                            }
                                        }
                                    }
                                }
                            });
                            if (typeof divimegapros_with_css_trigger !== 'undefined') {
                                var dmpTriggerType = '',
                                    dmp_container_selector, dmp_container, dmp_options;
                                if ($(divimegapros_with_css_trigger).length > 0) {
                                    $.each(divimegapros_with_css_trigger, function(divimegapro_id, selector) {
                                        $(selector).each(function(e) {
                                            let pThis = $(this);
                                            this.setAttribute('data-divimegaproid', divimegapro_id);
                                            applyAccesibility(pThis);
                                            createDiviMegaPro(divimegapro_id, this)
                                        })
                                    })
                                }
                            }
                            $('a').each(function() {
                                let pThis = $(this),
                                    href = pThis.attr('href');
                                if (href !== undefined) {
                                    var hash = href[0],
                                        ref = href.indexOf('divimegapro');
                                    if (hash == '#' && href.length > 1 && ref != -1) {
                                        var divimegapro_id = parseInt(href.replace('#divimegapro-', ''));
                                        if (typeof divimegapro_id == 'number') {
                                            pThis.attr('data-divimegaproid', divimegapro_id);
                                            applyAccesibility(pThis);
                                            createDiviMegaPro(divimegapro_id, this)
                                        }
                                    }
                                }
                            });

                            function addClosingListeners() {
                                $('.divimegapro-close, .divimegapro-close a').off('click');
                                body.on('click touchstart', '.divimegapro-close, .divimegapro-close a', function(e) {
                                    const pThis = this,
                                        $this = $(pThis),
                                        dmp = $this.parents('.tippy-popper'),
                                        childLink = $this.find('a:first-child'),
                                        currentTarget = $(e.currentTarget),
                                        instance = dmp[0]._tippy,
                                        etlinkdata = [];
                                    if (currentTarget.hasClass('et_clickable') && 'undefined' !== typeof et_link_options_data && 0 < et_link_options_data.length) {
                                        $.each(et_link_options_data, function(index, link_option_entry) {
                                            if (link_option_entry.class && link_option_entry.url && link_option_entry.target) {
                                                if (currentTarget.hasClass(link_option_entry.class)) {
                                                    dmp.attr('data-etlinkclass', link_option_entry.class);
                                                    dmp.attr('data-etlinkurl', link_option_entry.url);
                                                    dmp.attr('data-etlinktarget', link_option_entry.target)
                                                }
                                            }
                                        })
                                    } else if (childLink.length > 0) {
                                        dmp.attr('data-etlinkclass', 'nodivilink');
                                        dmp.attr('data-etlinkurl', childLink.attr('href'));
                                        dmp.attr('data-etlinktarget', childLink.attr('target'))
                                    }
                                    if (documentHTML.hasClass('divimegapro-opening') === false) {
                                        if (instance.state.isVisible) {
                                            instance.hide()
                                        }
                                    }
                                })
                            }
                            addClosingListeners();

                            function onCloseScrollTo(dClass, dURL, dTarget) {
                                if ('undefined' !== typeof dClass && 'undefined' !== typeof dURL && 'undefined' !== typeof dTarget) {
                                    if (dURL = (dURL = dURL.replace(/&#91;/g, "[")).replace(/&#93;/g, "]"), "_blank" === dTarget) {
                                        return void window.open(dURL)
                                    }
                                    if ("_blank" === dTarget) {
                                        return void window.open(dURL)
                                    }
                                    if (dURL && dURL.indexOf('#') !== -1) {
                                        if ('#' !== dURL[0]) {
                                            let hash = dURL.toLowerCase().substring(dURL.indexOf('#'));
                                            if ('#' === hash[0]) {
                                                dURL = hash
                                            }
                                        }
                                        let anchorElem = $(dURL);
                                        if ('#' === dURL[0] && dURL.length && anchorElem.length) {
                                            et_pb_smooth_scroll(anchorElem, !1, 800, "swing"), setTimeout((function() {
                                                et_pb_smooth_scroll(anchorElem, !1, 150, "linear")
                                            }), 825);
                                            history.pushState(null, "", dURL)
                                        }
                                    } else {
                                        window.location = dURL
                                    }
                                }
                            }
                            $('body').on('focusout', '.divimegapro-close', function(e) {
                                let dmp = $(this).parents('.tippy-popper'),
                                    dmpid = dmp.data('dmpid'),
                                    alldmps = document.querySelectorAll('.dmp-' + dmpid);
                                if (documentHTML.hasClass('divimegapro-opening') === false) {
                                    $.each(alldmps, function(index, popper) {
                                        const instance = popper._tippy;
                                        deflectFocusControl(instance, true)
                                    })
                                }
                            });

                            function createDiviMegaPro(divimegapro_id, selector, dmp_parent_selector, singletonEnabled) {
                                var divimegapro_selector = '#divimegapro-' + divimegapro_id,
                                    divimegapro = $(divimegapro_selector),
                                    divimegapro_container_selector = '#divimegapro-container-' + divimegapro_id,
                                    divimegapro_container = $(divimegapro_container_selector);
                                if (typeof dmp_parent_selector === 'undefined') {
                                    var dmp_parent_selector = ''
                                }
                                if (typeof singletonEnabled === 'undefined') {
                                    var singletonEnabled = false
                                }
                                if (typeof divimegapro_container.data() == 'undefined') {
                                    return
                                }
                                if (typeof divimegapros[divimegapro_id] === 'undefined') {
                                    divimegapros[divimegapro_id] = {}
                                }
                                divimegapros[divimegapro_id]['options'] = divimegapro_container.data();
                                var options = dmpGetOptions(divimegapro_id);
                                if (options === null) {
                                    return
                                }
                                var triggerType = options['triggertype'],
                                    exitType = options['exittype'],
                                    trigger = triggerType,
                                    hideOnClick = true,
                                    flip = false,
                                    flipBehavior = ["top", "bottom", "right", "left"],
                                    flipOnUpdate = true,
                                    interactiveDebounce = 0,
                                    interactiveBorder = 5,
                                    maxWidth = '',
                                    popperOptions = {},
                                    megaprofixedheight = 0,
                                    tippyIns = null,
                                    zIndex = 16777270;
                                setContainerWidth(divimegapro_container, options);
                                const refElement = $(selector);
                                if (options['bgcolor'] != '') {
                                    $(divimegapro_selector + ' .divimegapro-pre-body').css({
                                        'background-color': options['bgcolor']
                                    })
                                }
                                if (!diviMobile) {
                                    if (exitType == 'hover') {
                                        if (trigger != 'mouseenter focus' && exitType == 'hover') {
                                            hideOnClick = false
                                        }
                                    }
                                }
                                if (exitType == 'click') {
                                    interactiveDebounce = 900000
                                }
                                if ($('.et_social_inline').length) {
                                    removeMonarch()
                                }
                                clickOffMobileLinkswithHashtagOnly();
                                setTimeout(function() {
                                    var props = {},
                                        allProps = {},
                                        appendTo = props.appendTo = diviPageContainer,
                                        ariaRole = 'dialog',
                                        $document = $(document);
                                    props.parentDiviTopHeader = refElement.closest('#top-header');
                                    props.parentDiviMainHeader = refElement.closest('#main-header');
                                    props.parentDiviRowWithMenu = refElement.closest('.et_pb_row--with-menu');
                                    props.parentDiviModuleMenu = refElement.closest('.et_pb_menu, .et_pb_fullwidth_menu');
                                    props.parentSlideMenuContainer = refElement.closest('.et_slide_in_menu_container');
                                    props.parentDiviPageContainerHeader = refElement.closest('header.et-l--header');
                                    props.parentDiviPageContainer = refElement.closest('#page-container');
                                    props.parentDiviETMainArea = refElement.closest('#et-main-area');
                                    props.parentDiviMainContent = refElement.closest('#main-content');
                                    props.parentDiviMainFooter = refElement.closest('#main-footer');
                                    props.parentDiviETMainAreaAltFooter = refElement.closest('footer.et-l--footer');
                                    props.placement = options['placement'];
                                    props.parentDivioverlay = refElement.parents('.divioverlay');
                                    props.parentDiviDefaultSubmenu = refElement.parents('.sub-menu');
                                    if (props.parentDiviMainHeader.length < 1) {
                                        let closestMenuModule = refElement.closest('.et_pb_menu');
                                        if (closestMenuModule.parents('header').length > 0 && closestMenuModule.parents('#et-main-area').length < 1) {
                                            props.parentDiviMainHeader = closestMenuModule;
                                            diviPageContainer = diviAltHeader
                                        }
                                        if (dmp_parent_selector !== '') {
                                            props.parentDiviMainHeader = refElement.parents('.tippy-reference-header')
                                        }
                                        if (props.parentDiviMainHeader.length < 1 && props.parentDiviRowWithMenu.length == 1) {
                                            if (diviAltHeaderMenu !== null) {
                                                props.parentDiviMainHeader = props.parentDiviPageContainerHeader;
                                                diviPageContainer = diviAltHeaderMenu.parentNode
                                            }
                                        }
                                        if (diviAltHeaderMenu === null && props.parentDiviRowWithMenu.length == 1) {
                                            if (diviAltMainContentMenu !== null) {
                                                props.parentDiviMainHeader = props.parentDiviMainContent;
                                                if ($(diviAltMainContentMenu).is(":visible")) {
                                                    diviPageContainer = diviAltMainContentMenu
                                                } else {
                                                    diviAltMainContentMenu = diviAltMainContentMenu.parentNode.parentNode;
                                                    diviPageContainer = diviAltMainContentMenu
                                                }
                                            }
                                        }
                                        if (!$(diviPageContainer).is(":visible")) {
                                            diviPageContainer = diviPageContainer.parentNode
                                        }
                                    }
                                    let triggerFromDiviMenu = refElement.parents('.et-menu'),
                                        TriggerFromMobileMenu = refElement.parents('.mobile_nav'),
                                        cssClassTriggerFromMobileMenu = 'tippy-trigger-mobilemenu';
                                    if (((props.parentDiviTopHeader.length || props.parentDiviMainHeader.length) && divimegapro_singleton['header'] === true) || ((props.parentDiviMainContent.length || props.parentDiviPageContainerHeader.length) && divimegapro_singleton['content'] === true) || ((props.parentDiviMainFooter.length) && divimegapro_singleton['footer'] === true)) {
                                        singletonEnabled = true
                                    }
                                    if (dmp_parent_selector !== '') {
                                        if (refElement.parents('.tippy-popper-singleton').length === 1) {
                                            singletonEnabled = true
                                        }
                                    }
                                    if (diviMobile === true) {
                                        singletonEnabled = false
                                    }
                                    let tippyDmpSelector = (singletonEnabled === true) ? '[data-dmpid="' + divimegapro_id + '"]' : '.dmp-' + divimegapro_id,
                                        boundary = (singletonEnabled === false) ? documentBody : 'scrollParent';
                                    if (options['arrowEnabled'] === true) {
                                        options['arrowEnabled'] = defaultArrow;
                                        if (options['arrowType'] === 'round') {
                                            options['arrowEnabled'] = tippyv5.roundArrow
                                        }
                                    }
                                    if (options['megaprowidth'] == '100%') {
                                        maxWidth = '100%';
                                        if (props.parentDiviTopHeader.length || props.parentDiviMainHeader.length) {
                                            props.placement = 'bottom-start'
                                        }
                                    }
                                    if (props.placement === 'bottom' && diviMobile === true) {
                                        props.placement = 'bottom-start'
                                    }
                                    if (props.placement === 'bottom' && dmp_parent_selector !== '') {
                                        props.placement = 'bottom-start'
                                    }
                                    props.centerHorizontal = false;
                                    if (options['centerHorizontal'] === true) {
                                        props.centerHorizontal = true
                                    }
                                    if (diviMobile === false) {
                                        if (!props.parentDiviMainContent.length && !props.parentDiviMainFooter.length && props.parentDiviPageContainerHeader.length) {
                                            flip = false;
                                            flipBehavior = ["bottom"]
                                        }
                                    }
                                    if (triggerFromDiviMenu.length > 0) {
                                        if (refElement.hasClass('menu-item')) {
                                            if (!refElement.hasClass('menu-item-has-children') && refMenuItemHasChildren.length > 0) {
                                                refElement.addClass('menu-item-has-children')
                                            }
                                        }
                                    }
                                    popperOptions = {
                                        onUpdate: function onUpdate(data) {
                                            let instance = data.instance,
                                                tippy = instance.reference._tippy;
                                            if (typeof tippy !== 'undefined' && tippy.popperChildren.content.firstChild !== null) {
                                                let dmpClass, instanceClassName, dmpid = tippy.popperChildren.content.firstChild.getAttribute('data-dmpcid'),
                                                    dmp_parent = $(selector).parents('.tippy-popper');
                                                if (dmp_parent.length === 0 && singletonEnabled === false) {
                                                    appendTo = whereAppendTippy(tippy, props, '', singletonEnabled, '')
                                                }
                                                if (singletonEnabled === false || (dmp_parent_selector !== '' && singletonEnabled === true)) {
                                                    setCustomWidth(tippy, options, singletonEnabled);
                                                    setMaxHeight(tippy, dmpid, props, false);
                                                    updateDiviIframes('#' + tippy.popperChildren.content.firstChild.getAttribute('id'))
                                                } else if (singletonEnabled === true && dmp_parent_selector === '') {
                                                    if (tippy.popperChildren.content.firstChild !== null && tippy.popperChildren.content.firstChild.getAttribute !== undefined) {
                                                        dmpid = tippy.popperChildren.content.firstChild.getAttribute('data-dmpcid');
                                                        instance.popper.setAttribute('data-dmpid', dmpid);
                                                        dmpClass = removeClassRegExp(instance.popper.className, 'dmp-');
                                                        instanceClassName = instance.popper.className + '';
                                                        instanceClassName = instanceClassName.replace(dmpClass, '');
                                                        instanceClassName = instanceClassName.trim();
                                                        instance.popper.className = instanceClassName + ' dmp-' + dmpid;
                                                        updateDiviIframes('#' + tippy.popperChildren.content.firstChild.getAttribute('id'))
                                                    }
                                                }
                                            }
                                        }
                                    };
                                    popperOptions['modifiers'] = {};
                                    popperOptions['positionFixed'] = false;
                                    if (options['position'] === 'fixed') {
                                        popperOptions['positionFixed'] = true
                                    }
                                    if (singletonEnabled === false && options['position'] === 'fixed') {
                                        boundary = 'viewport'
                                    }
                                    if (singletonEnabled === false || (dmp_parent_selector !== '' && singletonEnabled === true)) {
                                        popperOptions['modifiers'] = {
                                            computeStyle: {
                                                gpuAcceleration: false
                                            }
                                        };
                                        if ((options['megaprowidth'] == '100%' || props.parentSlideMenuContainer.length) && singletonEnabled !== true) {
                                            popperOptions['modifiers']['computeStyle']['y'] = 'left'
                                        }
                                        popperOptions['modifiers']['flip'] = {
                                            flipVariations: true,
                                            flipVariationsByContent: true
                                        };
                                        if (props.placement == 'left' || props.placement == 'right') {
                                            flip = true
                                        }
                                        if (props.placement == 'top') {
                                            flip = true;
                                            flipBehavior = ["top", "left", "right", "bottom"]
                                        }
                                        if (props.placement == 'left') {
                                            flipBehavior = ["left", "bottom", "right", "top"]
                                        }
                                        if (props.placement == 'right') {
                                            flipBehavior = ["right", "bottom", "left", "top"]
                                        }
                                        if (dmp_parent_selector !== '') {
                                            flip = true;
                                            flipBehavior = ["bottom", "left", "right", "top"];
                                            if ((props.parentDiviTopHeader.length || props.parentDiviMainHeader.length)) {
                                                flipBehavior = ["bottom", "left", "right"];
                                                popperOptions['modifiers']['preventOverflow'] = {
                                                    escapeWithReference: true
                                                }
                                            }
                                        }
                                        if (typeof selector !== 'object') {
                                            selector = document.querySelector(selector)
                                        }
                                        appendTo = whereAppendTippy(null, props, dmp_parent_selector, singletonEnabled, refElement);
                                        if (props.parentSlideMenuContainer.length || appendTo === 'parent' || (dmp_parent_selector !== '' && singletonEnabled === true)) {
                                            popperOptions['modifiers']['preventOverflow'] = {
                                                priority: ['left', 'top']
                                            };
                                            if (props.parentSlideMenuContainer.length && props.parentSlideMenuContainer.css('right') !== '') {
                                                popperOptions['modifiers']['computeStyle']['y'] = 'right';
                                                popperOptions['modifiers']['preventOverflow'] = {
                                                    priority: ['right', 'top']
                                                }
                                            }
                                        }
                                    }

                                    function addReferences(divimegapro_id, instance, dmp_parent_selector, divimegapro) {
                                        if (dmp_parent_selector === '') {
                                            tippyv5.hideAll({
                                                duration: 0,
                                                exclude: instance
                                            });
                                            $("html,body").addClass('divimegapro-open')
                                        }
                                        divimegapro.addClass('dmp-open');
                                        if (instance.popper.className.indexOf('dmp') == -1) {
                                            instance.popper.className = instance.popper.className + ' dmp-' + divimegapro_id;
                                            instance.popper.setAttribute('data-dmpid', divimegapro_id)
                                        }
                                    }

                                    function updateContent(divimegapro_id, instance, tippyDmpSelector, divimegapro_selector, returnContent) {
                                        instance = (instance === undefined || instance === null) ? '' : instance;
                                        returnContent = (returnContent === undefined || returnContent === null) ? '' : returnContent;
                                        let cloneRef = (singletonEnabled === true && instance === '') ? 'singleton' : instance.id;
                                        let dmpContainerID = 'divimegapro-container-' + divimegapro_id + '-clone-' + cloneRef,
                                            dmpContainerPopper = tippyDmpSelector + '.tippy-popper .tippy-content';
                                        toggleSrcInPlayableTags(divimegapro);
                                        if ($(divimegapro_container_selector + ' ' + divimegapro_selector).length) {
                                            $(dmpContainerPopper).html('')
                                        }
                                        if (typeof divimegapros[divimegapro_id] !== 'undefined' && divimegapro_container.find('.divimegapro').length > 0) {
                                            divimegapros[divimegapro_id]['html'] = $('.divimegapro-wrapper #divimegapro-container-' + divimegapro_id + ' #divimegapro-' + divimegapro_id).detach()
                                        }
                                        let dmpCloneContainer = $(divimegapros[divimegapro_id]['html']).attr('id', dmpContainerID).attr('data-dmpcid', divimegapro_id);
                                        $.each(divimegapro_container.prop("attributes"), function() {
                                            if ((this.name).indexOf('data') !== -1) {
                                                dmpCloneContainer.attr(this.name, this.value)
                                            }
                                        });
                                        if (returnContent !== 0) {
                                            dmpCloneContainer.css('width', divimegapro_container.width())
                                        }
                                        if (returnContent === 0) {
                                            let isAppended = $(dmpContainerPopper).find(dmpCloneContainer).length;
                                            if (isAppended <= 0) {
                                                dmpCloneContainer.appendTo(dmpContainerPopper)
                                            }
                                        } else {
                                            return dmpCloneContainer[0].outerHTML
                                        }
                                    }
                                    if (dmp_parent_selector !== '' && singletonEnabled === true) {
                                        boundary = documentBody;
                                        popperOptions['modifiers'] = {
                                            computeStyle: {
                                                gpuAcceleration: true
                                            }
                                        }
                                    }
                                    if (diviMobile === true) {
                                        triggerType = 'mouseenter focus';
                                        if (props.parentDiviTopHeader.length || props.parentDiviMainHeader.length) {
                                            if (isDiviMenuBarVisible === true) {
                                                options['megaprowidth'] = '100%';
                                                maxWidth = '100%';
                                                flip = true;
                                                flipBehavior = ["bottom", "top", "left", "right"]
                                            }
                                        } else if (props.parentDiviMainContent.length) {
                                            if (props.placement == 'top') {
                                                flip = true;
                                                flipBehavior = ["top", "left", "right"];
                                                boundary = 'viewport'
                                            }
                                        }
                                    }
                                    if (dmp_parent_selector === '' && singletonEnabled === false) {
                                        if (props.parentDiviETMainArea.length && props.parentDiviETMainAreaAltFooter.length) {
                                            if (props.placement === 'top') {
                                                flip = true;
                                                flipBehavior = ["top", "left", "right", "bottom"];
                                                boundary = document.querySelector('footer.et-l--footer')
                                            }
                                        }
                                        if (diviPageContainer === diviAltHeader) {
                                            flip = true;
                                            flipBehavior = ["top", "bottom"]
                                        }
                                    }
                                    if (isIphone) {
                                        options['megaprowidth'] = '100%';
                                        maxWidth = '100%';
                                        flip = false;
                                        popperOptions['positionFixed'] = true
                                    }
                                    if (props.parentDiviTopHeader.length === 0 && props.parentDiviMainHeader.length === 0 && props.parentDiviRowWithMenu.length === 0 && props.parentDiviModuleMenu.length === 0 && props.parentSlideMenuContainer.length === 0 && props.parentDiviPageContainerHeader.length === 0 && props.parentDiviPageContainer.length === 0 && props.parentDiviETMainArea.length === 0 && props.parentDiviMainContent.length === 0 && props.parentDiviMainFooter.length === 0 && props.parentDiviETMainAreaAltFooter.length === 0) {
                                        if (diviMobile === true) {
                                            boundary = 'viewport'
                                        }
                                        if (props.placement === 'top') {
                                            if (diviMobile === true) {
                                                flipBehavior = ["top", "left", "right"]
                                            }
                                            boundary = documentBody
                                        }
                                    }
                                    if ((props.parentDiviTopHeader.length || props.parentDiviMainHeader.length) && (props.parentDiviTopHeader.css('position') === 'fixed' || props.parentDiviMainHeader.css('position') === 'fixed')) {
                                        popperOptions['positionFixed'] = true
                                    }
                                    props.centerHorizontal = false;
                                    let bkpMegaProWidth = 'auto';
                                    if (options['megaprowidth'] !== '100%') {
                                        bkpMegaProWidth = options['megaprowidth']
                                    }
                                    if (options['centerHorizontal'] === true) {
                                        options['megaprowidth'] = '100%';
                                        maxWidth = '100%';
                                        popperOptions['positionFixed'] = true;
                                        props.centerHorizontal = true;
                                        boundary = documentBody
                                    }
                                    if (haveNestingMenus(divimegapro_id) === true) {
                                        interactiveDebounce = 1;
                                        interactiveBorder = 10
                                    }
                                    if (dmp_parent_selector === '' && singletonEnabled === false && (props.parentDiviETMainArea.length !== 0 || props.parentDiviMainContent.length !== 0)) {
                                        flip = false;
                                        flipBehavior = [props.placement];
                                        popperOptions['modifiers']['preventOverflow'] = {
                                            escapeWithReference: true
                                        }
                                    }
                                    allProps = {
                                        appendTo: appendTo,
                                        aria: 'describedby',
                                        role: ariaRole,
                                        allowHTML: true,
                                        arrow: options['arrowEnabled'],
                                        boundary: boundary,
                                        maxWidth: maxWidth,
                                        placement: props.placement,
                                        content: function content() {
                                            if (singletonEnabled && dmp_parent_selector === '') {
                                                var content = updateContent(divimegapro_id, null, tippyDmpSelector, divimegapro_selector, 1);
                                                return content
                                            }
                                            return ''
                                        },
                                        delay: [1, options['delay']],
                                        animation: options['animation'],
                                        distance: (options['distance'] + '').concat('px'),
                                        offset: '0,0',
                                        interactive: true,
                                        interactiveDebounce: interactiveDebounce,
                                        interactiveBorder: interactiveBorder,
                                        zIndex: zIndex,
                                        trigger: triggerType,
                                        theme: 'dmmbasic',
                                        lazy: false,
                                        flip: flip,
                                        flipBehavior: flipBehavior,
                                        flipOnUpdate: true,
                                        hideOnClick: hideOnClick,
                                        ignoreAttributes: true,
                                        sticky: true,
                                        popperOptions: popperOptions,
                                        plugins: [hideOnEsc],
                                        centerHorizontal: props.centerHorizontal,
                                        onCreate: function onCreate(instance) {
                                            if (TriggerFromMobileMenu.length) {
                                                instance.popper.className = instance.popper.className + ' ' + cssClassTriggerFromMobileMenu
                                            }
                                            if (options['arrowType'] !== 'round') {
                                                instance.popper.className = instance.popper.className + ' tippy-arrow-triangle'
                                            }
                                            if ((props.parentDiviTopHeader.length || props.parentDiviMainHeader.length)) {
                                                instance.popper.className = instance.popper.className + ' tippy-reference-header'
                                            } else if (props.parentDiviMainContent.length) {
                                                instance.popper.className = instance.popper.className + ' tippy-reference-content'
                                            } else if (props.parentDiviMainFooter.length) {
                                                instance.popper.className = instance.popper.className + ' tippy-reference-footer'
                                            }
                                            if (options['centerHorizontal'] === true) {
                                                instance.popperChildren.content.style.width = bkpMegaProWidth;
                                                instance.popper.className = instance.popper.className + ' tippy-popper-centered-horizontal';
                                                instance.popperChildren.content.classList.add('tippy-content-centered-horizontal')
                                            }
                                        },
                                        onTrigger(instance, event) {
                                            let insTippyContent = instance.reference._tippy.popperChildren.content;
                                            if (insTippyContent.getAttribute('data-eventtype') === null) {
                                                insTippyContent.setAttribute('data-eventtype', event.type)
                                            }
                                        },
                                        onUntrigger(instance, event) {
                                            let insTippyContent = instance.reference._tippy.popperChildren.content;
                                            if (insTippyContent.getAttribute('data-eventtype') !== null) {
                                                insTippyContent.removeAttribute('data-eventtype', event.type)
                                            }
                                        },
                                        onShow: function onShow(instance) {
                                            instance.popper.removeAttribute('data-etlinkclass');
                                            instance.popper.removeAttribute('data-etlinkurl');
                                            instance.popper.removeAttribute('data-etlinktarget');
                                            documentHTML.addClass('divimegapro-opening');
                                            if (singletonEnabled === true && dmp_parent_selector === '') {
                                                if (instance.popper.className.indexOf('transition') == -1) {
                                                    instance.popper.className = instance.popper.className + ' tippy-popper-transition'
                                                }
                                                if (instance.popper.className.indexOf('singleton') == -1) {
                                                    instance.popper.className = instance.popper.className + ' tippy-popper-singleton';
                                                    setTimeout(function() {
                                                        var tippyContent = document.querySelector('.tippy-popper-singleton .tippy-tooltip .tippy-content')
                                                    }, 1)
                                                }
                                                singletonTransitionListener(instance)
                                            }
                                            if (singletonEnabled === false || (dmp_parent_selector !== '' && singletonEnabled === true)) {
                                                if (trigger == 'mouseenter focus' && exitType == 'click' && !diviMobile) {
                                                    instance.setProps({
                                                        trigger: 'click'
                                                    })
                                                }
                                                if ((trigger == 'click' || trigger == 'mousedown focus') && exitType == 'hover' && !diviMobile) {
                                                    instance.setProps({
                                                        trigger: tippyv5.defaultProps.trigger
                                                    })
                                                }
                                            }
                                            $document.trigger("divimegapro:onShow");
                                            $document.trigger("divimegapro:onShow:" + divimegapro_id)
                                        },
                                        onMount: function onMount(instance) {
                                            if (singletonEnabled === true) {
                                                instance.popperInstance.update()
                                            }
                                            var cloneRef = (singletonEnabled === true) ? 'singleton' : instance.id,
                                                divimegapro_container_selector = '#divimegapro-container-' + divimegapro_id,
                                                dmpContainerID = 'divimegapro-container-' + divimegapro_id + '-clone-' + cloneRef;
                                            addReferences(divimegapro_id, instance, dmp_parent_selector, divimegapro);
                                            if (singletonEnabled === false || (dmp_parent_selector !== '' && singletonEnabled === true)) {
                                                updateContent(divimegapro_id, instance, tippyDmpSelector, divimegapro_selector, 0);
                                                checkNestingMenus(divimegapro_id, singletonEnabled, instance)
                                            }
                                            initDiviElements(divimegapro_id, singletonEnabled);
                                            updateDiviIframes('#' + dmpContainerID);
                                            if (singletonEnabled === true && dmp_parent_selector === '') {
                                                animateContent(instance);
                                                animateWidthHeight(instance, divimegapro_id);
                                                var tippyIns = instance.reference._tippy
                                            }
                                            adminOnlyFunctions(true, refElement);
                                            $document.trigger("divimegapro:onMount");
                                            $document.trigger("divimegapro:onMount:" + divimegapro_id)
                                        },
                                        onBeforeUpdate: function onBeforeUpdate(instance) {
                                            setTimeout(function() {
                                                if (instance.popperChildren.content.firstChild !== null) {
                                                    var tippyIns = instance.reference._tippy,
                                                        dmpid = tippyIns.popperChildren.content.firstChild.getAttribute('data-dmpcid'),
                                                        divimegapro_container_selector = '#divimegapro-container-' + dmpid,
                                                        divimegapro_container = $(divimegapro_container_selector),
                                                        options = dmpGetOptions(divimegapro_id);
                                                    setMaxHeight(tippyIns, dmpid, props, true, divimegapro_container_selector)
                                                }
                                            }, 1)
                                        },
                                        onAfterUpdate: function onAfterUpdate(instance, updatedProps) {
                                            if (singletonEnabled && dmp_parent_selector === '' && updatedProps.allowHTML !== null && updatedProps.allowHTML === true) {
                                                instance.props.popperOptions['positionFixed'] = popperOptions['positionFixed'];
                                                tippyv5.hideAll({
                                                    duration: 500,
                                                    exclude: instance
                                                });
                                                var tippyIns = instance.reference._tippy,
                                                    dmpid = tippyIns.popperChildren.content.firstChild.getAttribute('data-dmpcid'),
                                                    options = dmpGetOptions(dmpid),
                                                    cloneRef = 'singleton',
                                                    dmpContainerID = 'divimegapro-container-' + dmpid + '-clone-' + cloneRef,
                                                    divimegapro_container_selector = '#divimegapro-container-' + dmpid,
                                                    divimegapro_container = $(divimegapro_container_selector),
                                                    tippyContent = $(tippyIns.popperChildren.content);
                                                if (typeof divimegapros[dmpid] !== 'undefined' && divimegapro_container.find('.divimegapro').length === 0) {
                                                    tippyContent.html('');
                                                    $(divimegapros[dmpid]['html']).appendTo(tippyContent)
                                                }
                                                animateContent(instance);
                                                updateDiviIframes('#' + dmpContainerID);
                                                initDiviElements(dmpid, true);
                                                singletonTransitionListener(instance);
                                                animateWidthHeight(instance, dmpid)
                                            }
                                        },
                                        onShown: function onShown(instance) {
                                            dmmTogglePlayableTags('.tippy-popper.dmp-' + divimegapro_id, 1000);
                                            let dmpContainerPopper = tippyDmpSelector + '.tippy-popper .tippy-content',
                                                tippyContent = $(dmpContainerPopper);
                                            let et_pb_newsletter = tippyContent.find('.et_pb_newsletter_form form .et_pb_newsletter_fields');
                                            if (et_pb_newsletter.length) {
                                                var et_pb_signup_divimegaproid = et_pb_newsletter.find('.et_pb_signup_divimegaproid');
                                                if (et_pb_signup_divimegaproid.length < 1) {
                                                    $('<input>').attr({
                                                        type: 'text',
                                                        name: 'et_pb_signup_divimegaproid',
                                                        class: 'et_pb_signup_divimegaproid et_pb_signup_custom_field',
                                                        'data-original_id': 'et_pb_signup_divimegaproid',
                                                        value: divimegapro_id
                                                    }).appendTo(et_pb_newsletter)
                                                }
                                            }
                                            supportDiviMenu(dmpContainerPopper, refElement, triggerFromDiviMenu, false);
                                            if (options['megaprofixedheight'] === '' || options['megaprofixedheight'] <= 0) {
                                                dynamicHeight(instance, false)
                                            }
                                            if (!refElement.is(':visible')) {
                                                if (instance.popper.className.indexOf('topfixed') == -1) {
                                                    instance.popper.className = instance.popper.className + ' topfixed'
                                                }
                                            }
                                            documentHTML.removeClass('divimegapro-opening');
                                            divimegapro.addClass('divimegapro-opened');
                                            dmpRemoveDiviFix(dmpContainerPopper);
                                            deflectFocusControl(instance);
                                            addClosingListeners();
                                            $document.trigger("divimegapro:onShown");
                                            $document.trigger("divimegapro:onShown:" + divimegapro_id)
                                        },
                                        onHide: function onHide(instance) {
                                            let tippySingletonContent = $('.tippy-popper-singleton .tippy-tooltip .tippy-content');
                                            if (tippySingletonContent.length > 0) {
                                                tippySingletonContent.css({
                                                    'height': '1px'
                                                })
                                            }
                                            let dmpContainerPopper = tippyDmpSelector + '.tippy-popper .tippy-content';
                                            supportDiviMenu(dmpContainerPopper, refElement, triggerFromDiviMenu, true);
                                            if (options['megaprofixedheight'] === '' || options['megaprofixedheight'] <= 0) {
                                                dynamicHeight(instance, true)
                                            }
                                            if (singletonEnabled === false || (dmp_parent_selector !== '' && singletonEnabled === true)) {
                                                if (trigger == 'mouseenter focus' && exitType == 'click' && !diviMobile) {
                                                    instance.setProps({
                                                        trigger: tippyv5.defaultProps.trigger
                                                    })
                                                }
                                                if ((trigger == 'click' || trigger == 'mousedown focus') && exitType == 'hover' && !diviMobile) {
                                                    instance.setProps({
                                                        trigger: 'click'
                                                    })
                                                }
                                            }
                                            if (refElement.parents('.et_mobile_menu').is(':visible')) {
                                                refElement.parents('.mobile_nav').removeClass('closed');
                                                refElement.parents('.mobile_nav').addClass('opened');
                                                refElement.parents('.et_mobile_menu').removeClass('dmp-divimobilemenu-visible');
                                                refElement.parents('.et_mobile_menu').attr('style', 'display:block')
                                            }
                                            divimegapro.removeClass('dmp-open');
                                            divimegapro.addClass('dmp-close');
                                            divimegapro.removeClass('divimegapro-opened');
                                            refElement.trigger("focus");
                                            setTimeout(function() {
                                                let popper = instance.popper,
                                                    dataETlinkclass = popper.getAttribute('data-etlinkclass'),
                                                    dataETlinkurl = popper.getAttribute('data-etlinkurl'),
                                                    dataETlinktarget = popper.getAttribute('data-etlinktarget');
                                                if ('undefined' !== dataETlinkclass && dataETlinkclass !== '' && dataETlinkclass !== null) {
                                                    onCloseScrollTo(dataETlinkclass, dataETlinkurl, dataETlinktarget)
                                                }
                                            }, 1);
                                            adminOnlyFunctions(false, refElement);
                                            $document.trigger("divimegapro:onHide");
                                            $document.trigger("divimegapro:onHide:" + divimegapro_id)
                                        },
                                        onHidden: function onHidden(instance) {
                                            divimegapro.removeClass('dmp-close');
                                            if (dmp_parent_selector == '' && $('.dmp-open').length === 0) {
                                                $("html,body").removeClass('divimegapro-open');
                                                let activeMegapro = $('.dmp-' + divimegapro_id);
                                                if ($(documentBody).hasClass('admin-bar') && activeMegapro.parents('.custom-fixed-header').length > 0) {
                                                    activeMegapro.css('margin-top', '')
                                                }
                                            }
                                            dmmTogglePlayableTags(divimegapro_selector);
                                            $document.trigger("divimegapro:onHidden");
                                            $document.trigger("divimegapro:onHidden:" + divimegapro_id)
                                        }
                                    };
                                    if (!isIOS && diviMobile === true) {
                                        let dURL = refElement.attr('href');
                                        if ('undefined' !== typeof dURL && dURL !== '' && typeof refElement.attr('data-dmphref') === 'undefined') {
                                            refElement.attr('data-dmphref', refElement.attr('href'));
                                            if ('#' !== dURL[0]) {
                                                refElement.attr('href', '#dmpro')
                                            }
                                            const onClick = emulateIOS((e) => {
                                                e.target.href = e.target.getAttribute('data-dmphref')
                                            });
                                            selector.removeEventListener('click', onClick);
                                            selector.addEventListener('click', onClick)
                                        }
                                    }
                                    let isChildMenu = $(selector).parents('.divimegapro-container');
                                    if (isChildMenu.length && dmp_parent_selector === '') {
                                        return
                                    }
                                    tippyIns = tippyv5(selector, allProps);
                                    if (typeof tippyIns !== 'undefined' && singletonEnabled === true && dmp_parent_selector === '') {
                                        tippyIns.disable();
                                        dmps_tippyinstances.push(tippyIns);
                                        setTimeout(function() {
                                            callSingleton(dmps_tippyinstances, allProps)
                                        }, 1)
                                    }
                                }, 1)
                            }

                            function callSingleton(dmps_tippyinstances, allProps) {
                                if (dmpsSingleton === 0) {
                                    dmpsSingleton += 1;
                                    var tippyInstances = dmps_tippyinstances;
                                    var optionalProps = {
                                        delay: [0, 100],
                                        updateDuration: 600,
                                        interactiveBorder: 60,
                                        interactiveDebounce: 200,
                                        plugins: [hideOnEsc],
                                        overrides: ['aria', 'allowHTML', 'arrow', 'maxWidth', 'placement', 'content', 'animation', 'distance', 'offset', 'interactive', 'zIndex', 'theme', 'lazy', 'flip', 'flipBehavior', 'flipOnUpdate', 'ignoreAttributes', 'onShow', 'onMount', 'onBeforeUpdate', 'onAfterUpdate', 'onShown', 'onHide', 'onHidden']
                                    };
                                    if (optionalProps === void 0) {
                                        optionalProps = {}
                                    }
                                    if (!Array.isArray(tippyInstances)) {
                                        console.log(['The first argument passed to createSingleton() must be an array of tippy', 'instances. The passed value was', String(tippyInstances)].join(' '));
                                        return
                                    }
                                    tippyInstances.forEach(function(instance) {
                                        instance.disable()
                                    });
                                    var currentAria, currentTarget, overrides = optionalProps.overrides,
                                        shouldSkipUpdate = false,
                                        mutTippyInstances = tippyInstances,
                                        references = tippyInstances.map(function(instance) {
                                            return instance.reference
                                        });
                                    var popperOptions = allProps.popperOptions;
                                    if (diviMobile === true) {
                                        popperOptions['modifiers'] = {
                                            computeStyle: {
                                                gpuAcceleration: false
                                            }
                                        }
                                    } else {
                                        popperOptions['modifiers'] = {
                                            computeStyle: {
                                                gpuAcceleration: true
                                            }
                                        }
                                    }
                                    var singleton = {
                                        fn: function fn(instance) {
                                            function handleAriaDescribedByAttribute(isShow) {
                                                if (!currentAria) {
                                                    return
                                                }
                                                var attr = "aria-" + currentAria;
                                                if (isShow && !instance.props.interactive) {
                                                    currentTarget.setAttribute(attr, instance.popperChildren.tooltip.id)
                                                } else {
                                                    currentTarget.removeAttribute(attr)
                                                }
                                            }
                                            return {
                                                onDestroy: function onDestroy() {
                                                    tippyInstances.forEach(function(instance) {
                                                        instance.enable()
                                                    })
                                                },
                                                onCreate: function onCreate(instance) {
                                                    if (allProps['maxWidth'] === '100%') {
                                                        instance.popper.style.width = '100%';
                                                        instance.popperChildren.tooltip.style.maxWidth = '100%'
                                                    }
                                                    instance.props.popperOptions['positionFixed'] = popperOptions['positionFixed']
                                                },
                                                onHide: function onHide(instance) {
                                                    tippyv5.hideAll({
                                                        duration: 0,
                                                        exclude: instance
                                                    })
                                                },
                                                onUntrigger: function onUntrigger() {},
                                                onTrigger: function onTrigger(_, event) {
                                                    var target = event.currentTarget;
                                                    var index = references.indexOf(target);
                                                    if (target === currentTarget) {
                                                        return
                                                    }
                                                    currentTarget = target;
                                                    currentAria = null;
                                                    if (instance.state.isVisible) {
                                                        handleAriaDescribedByAttribute(true)
                                                    }
                                                    instance.popperInstance.reference = target;
                                                    instance.setContent(tippyInstances[index].props.content);
                                                    var overrideProps = (overrides || []).concat('content').reduce(function(acc, prop) {
                                                        acc[prop] = mutTippyInstances[index].props[prop];
                                                        return acc
                                                    }, {});
                                                    instance.setProps(Object.assign({}, overrideProps));
                                                    instance.props.popperOptions = popperOptions
                                                }
                                            }
                                        }
                                    };
                                    dmpSingletonInstance = tippyv5(div(), Object.assign({}, removeProperties(optionalProps, ['overrides']), {
                                        appendTo: diviPageContainer,
                                        sticky: 'reference',
                                        plugins: [singleton].concat(optionalProps.plugins || []),
                                        triggerTarget: references
                                    }));
                                    var originalSetProps = dmpSingletonInstance.setProps;
                                    dmpSingletonInstance.setProps = function(props) {
                                        overrides = props.overrides || overrides;
                                        originalSetProps(props)
                                    };
                                    return dmpSingletonInstance
                                }
                            }

                            function adminOnlyFunctions(init, referenceTrigger) {
                                if (body.hasClass('admin-bar')) {
                                    if (init === true) {
                                        let ctrlExtraMargin_Timer = setInterval(function() {
                                            if ($('.divimegapro-open .divimegapro').length === 0) {
                                                clearInterval(ctrlExtraMargin_Timer)
                                            }
                                            extraMarginTop(referenceTrigger)
                                        }, 100)
                                    } else if (init === false) {}
                                }
                            }

                            function extraMarginTop(referenceTrigger) {
                                let activeMegapro = $('.divimegapro-open .divimegapro'),
                                    tippyMegapro = activeMegapro.parents('.tippy-popper');
                                if ('undefined' === typeof referenceTrigger) {
                                    referenceTrigger = false
                                }
                                setTimeout(function() {
                                    if (activeMegapro.parents('.custom-fixed-header').length > 0 || (referenceTrigger && referenceTrigger.parents('.et_pb_section--fixed').length > 0) || (body.hasClass('et_fixed_nav') && $('.et-fixed-header').length > 0)) {
                                        let bodyMarginTop = body.css('margin-top'),
                                            pageContainerMarginTop = documentHTML.css('margin-top'),
                                            megaproMarginTop = 0;
                                        if (parseInt(bodyMarginTop) > 0) {
                                            megaproMarginTop = bodyMarginTop
                                        }
                                        if (parseInt(pageContainerMarginTop) > 0) {
                                            megaproMarginTop = pageContainerMarginTop
                                        }
                                        tippyMegapro.css('margin-top', ('-').concat(megaproMarginTop))
                                    } else {
                                        tippyMegapro.css('margin-top', '')
                                    }
                                }, 10)
                            }

                            function div() {
                                return document.createElement('div')
                            }

                            function removeProperties(obj, keys) {
                                var clone = Object.assign({}, obj);
                                keys.forEach(function(key) {
                                    delete clone[key]
                                });
                                return clone
                            }

                            function removeClassRegExp(value, regexp) {
                                regexp = new RegExp(regexp);
                                var classes = [];
                                $.each(value.split(' '), function(i, c) {
                                    if (regexp.test(c)) {
                                        classes.push(c)
                                    }
                                });
                                return classes.join(' ')
                            }

                            function dynamicHeight(instance, off) {
                                if (off === true || typeof instance === 'undefined') {
                                    clearTimeout(dynamicHeightTimer)
                                } else if (off === false) {
                                    dynamicHeightTimer = setTimeout(() => {
                                        dynamicHeight(instance, false);
                                        instance.popperInstance.update()
                                    }, 500)
                                }
                            }

                            function supportDiviMenu(dmpContainerPopper, refElement, triggerFromDiviMenu, off) {
                                let menuItem, menuItemHasClass = refElement.hasClass('menu-item'),
                                    parentMenuItem = refElement.parent(),
                                    parentMenuItemHasClass = parentMenuItem.hasClass('menu-item'),
                                    refElementNode, dmpContainer = $(dmpContainerPopper);
                                if (menuItemHasClass) {
                                    menuItem = refElement;
                                    refElementNode = refElement[0]
                                }
                                if (parentMenuItemHasClass) {
                                    menuItem = parentMenuItem;
                                    refElementNode = parentMenuItem[0]
                                }
                                if (typeof menuItem === 'undefined') {
                                    return
                                }
                                diviMenuHover_observer.disconnect();
                                if (!menuItem.hasClass('et-hover')) {
                                    menuItem.addClass('et-hover')
                                }
                                if (off === true) {
                                    dmpContainer.off("mousemove.dmpMousemove mouseenter.dmpMouseenter");
                                    setTimeout(() => {
                                        menuItem.removeClass('et-hover')
                                    }, 50)
                                } else if (off === false) {
                                    if (triggerFromDiviMenu.length > 0) {
                                        if (menuItemHasClass || parentMenuItemHasClass) {
                                            diviMenuHover_observer.observe(refElementNode, diviMenuHover_observeConfig);
                                            dmpContainer.on("mousemove.dmpMousemove mouseenter.dmpMouseenter", function(e) {
                                                if (!menuItem.hasClass('et-hover')) {
                                                    menuItem.addClass('et-hover')
                                                }
                                            })
                                        }
                                    }
                                }
                            }

                            function whereAppendTippy(tippy, props, dmp_parent_selector, singletonEnabled, refElement) {
                                var tippyInstance = false,
                                    tippyParent = props.appendTo,
                                    appendTo, refTippyInstance, options = [],
                                    dmpid;
                                const wrapper = document.createElement('div');
                                wrapper.className = 'tippy-wrapper';
                                if (tippy !== null) {
                                    tippyInstance = true
                                }
                                if (tippyInstance) {
                                    let dmpid = tippy.popper.getAttribute('data-dmpid');
                                    if (dmpid !== null) {
                                        options = dmpGetOptions(dmpid)
                                    }
                                }
                                if (props.parentDiviTopHeader.length) {
                                    tippyParent = diviTopHeader
                                }
                                if (props.parentDiviMainHeader.length) {
                                    tippyParent = diviPageContainer
                                }
                                if (props.parentDiviMainContent.length) {
                                    tippyParent = diviPageContainer
                                }
                                if (window.et_is_vertical_nav && (props.parentDiviTopHeader.length || props.parentDiviMainHeader.length)) {
                                    tippyParent = diviPageContainer
                                }
                                if (dmp_parent_selector !== undefined && dmp_parent_selector !== '' && refElement !== '') {
                                    refTippyInstance = refElement._tippy;
                                    if (typeof refTippyInstance === 'undefined') {
                                        tippyParent = document.querySelector(dmp_parent_selector)
                                    } else {
                                        tippyParent = document.querySelector(dmp_parent_selector);
                                        refTippyInstance.props.appendTo = tippyParent
                                    }
                                }
                                appendTo = tippyParent;
                                if (appendTo === '' || appendTo === null) {
                                    tippyParent = appendTo = 'parent';
                                    if (tippyInstance) {
                                        tippy.props.flip = true
                                    }
                                }
                                if (props.parentDivioverlay.length) {
                                    tippyParent = appendTo = props.parentDivioverlay[0]
                                }
                                if (props.parentDiviDefaultSubmenu.length) {
                                    tippyParent = appendTo = props.parentDiviDefaultSubmenu.parent()[0];
                                    if (props.centerHorizontal === true || options['centerHorizontal'] === true) {
                                        tippyParent = appendTo = diviPageContainer
                                    }
                                }
                                if (tippyInstance) {
                                    var placement = tippy.props.placement;
                                    if (placement !== 'left' && placement !== 'right') {
                                        if (tippyParent == diviPageContainer) {
                                            tippy.props.flip = true;
                                            if ((tippy.popper.className.indexOf('tippy-reference-header') !== -1 && tippy.props.placement === 'bottom') || (tippy.popper.className.indexOf('tippy-reference-header') !== -1 && tippy.props.placement === 'bottom-start') || (tippy.popper.className.indexOf('tippy-reference-footer') !== -1 && tippy.props.placement === 'top')) {
                                                tippy.props.flip = false
                                            }
                                        } else {
                                            tippy.props.flip = false
                                        }
                                    }
                                    if (singletonEnabled === true || diviMobile === true) {
                                        tippy.props.appendTo = diviPageContainer
                                    } else {
                                        tippy.props.appendTo = tippyParent
                                    }
                                }
                                return appendTo
                            }

                            function haveNestingMenus(divimegapro_id) {
                                let $divimegapro = $('#divimegapro-' + divimegapro_id);
                                if ($divimegapro.find('[data-divimegaproid]').length) {
                                    return true
                                }
                                return false
                            }

                            function checkNestingMenus(parentdmp_id, singletonEnabled, instance) {
                                var divimegapro_popper = '.tippy-popper.dmp-' + parentdmp_id;
                                setTimeout(function() {
                                    $(divimegapro_popper + ' .divimegapro-body [data-divimegaproid]').each(function() {
                                        var pThis = this,
                                            divimegapro_id = parseInt($(pThis).attr('data-divimegaproid'));
                                        if (typeof divimegapro_id == 'number' && divimegapro_popper !== '') {
                                            createDiviMegaPro(divimegapro_id, pThis, divimegapro_popper, singletonEnabled)
                                        }
                                    })
                                }, 150)
                            }

                            function setCustomWidth(instance, options, singletonEnabled) {
                                var megaprowidth = options['megaprowidth'] + '',
                                    tippyPopperWideClass = 'tippy-popper-wide';
                                const viewportWidth = $(window).width();
                                const customWidthInt = parseInt(megaprowidth);
                                const customWidthUnit = megaprowidth.replace(/[0-9]/g, '');
                                var customWidth = 0;
                                if (customWidthInt > 0) {
                                    if (customWidthUnit == '') {
                                        customWidth = customWidthInt + 'px'
                                    } else {
                                        customWidth = customWidthInt + customWidthUnit
                                    }
                                    if (customWidthInt > viewportWidth && customWidthUnit == 'px') {
                                        customWidth = viewportWidth + 'px'
                                    }
                                    if (singletonEnabled === true) {
                                        if (customWidthUnit === '%') {
                                            customWidth = Math.round(((customWidthInt / 100) * viewportWidth)) + 'px'
                                        }
                                    }
                                    instance.popper.style.width = customWidth;
                                    instance.popper.className = instance.popper.className.replace(/\btippy-popper-wide\b/g, '');
                                    if (options['megaprowidth'] == '100%') {
                                        instance.popper.className = instance.popper.className + ' ' + tippyPopperWideClass
                                    }
                                }
                            }

                            function singletonTransitionListener(instance) {
                                var tippyIns = instance.reference._tippy,
                                    dmpid = tippyIns.popperChildren.content.firstChild.getAttribute('data-dmpcid'),
                                    dmpmainparent = tippyIns.popperChildren.content.firstChild.parentElement.parentElement.parentElement;
                                if (dmpmainparent.getAttribute('data-dmpid') === null) {
                                    dmpmainparent.setAttribute('data-dmpid', dmpid)
                                }
                                dmpid = dmpmainparent.getAttribute('data-dmpid');
                                if (instance.popper.className.indexOf('transition') == -1) {
                                    instance.popper.className = instance.popper.className + ' tippy-popper-transition'
                                }
                                const tooltip = instance.popperChildren.tooltip;
                                const content = instance.popperChildren.content;

                                function onTransitionEnd(event) {
                                    if ((event.target === event.currentTarget && event.propertyName === 'transform') || (event.target === event.currentTarget && event.propertyName === 'opacity')) {
                                        var dmpidCheck = tippyIns.popperChildren.content.firstChild.getAttribute('data-dmpcid');
                                        dmpmainparent = tippyIns.popperChildren.content.firstChild.parentElement.parentElement.parentElement;
                                        dmpid = dmpmainparent.getAttribute('data-dmpid');
                                        if (dmpid === dmpidCheck) {
                                            setTimeout(function() {
                                                instance.popper.className = instance.popper.className.replace(/\btippy-popper-transition\b/g, '');
                                                checkNestingMenus(dmpid, true, instance)
                                            }, 500)
                                        }
                                    }
                                }
                                if (!instance._transitionEndListener) {
                                    instance._transitionEndListener = onTransitionEnd
                                }
                                if (tooltip.getAttribute('data-event-transitionend') !== 'true') {
                                    tooltip.setAttribute('data-event-transitionend', 'true');
                                    tooltip.addEventListener('transitionend', onTransitionEnd)
                                }
                            }

                            function animateContent(instance) {
                                const content = instance.popperChildren.content;
                                const diviRows = $(content).find('.et_pb_row');
                                diviRows.each(function() {
                                    var e = $(this),
                                        v = '0.3';
                                    e.css('opacity', v)
                                });
                                setTimeout(function() {
                                    diviRows.each(function() {
                                        var e = $(this),
                                            v = '1';
                                        e.css('opacity', v)
                                    })
                                }, 150)
                            }

                            function animateWidthHeight(instance, dmpid) {
                                let tippySingleton = $('.tippy-popper-singleton'),
                                    tippySingletonContent = $('.tippy-popper-singleton .tippy-tooltip .tippy-content');
                                if (tippySingletonContent !== null && (tippySingleton.parent()).length > 0) {
                                    let divimegaproBodySelector = '#divimegapro-container-' + dmpid,
                                        divimegaproBody = $(divimegaproBodySelector);
                                    if ('undefined' === typeof divimegaproBody) {
                                        return
                                    }
                                    let divimegaproBodyOnSingleton = $(divimegaproBodySelector + '-clone-singleton');
                                    let divimegaproBodyWidth = divimegaproBody.width(),
                                        tippySingletonWidth = divimegaproBodyWidth,
                                        divimegaproBodyWidthPx = divimegaproBodyWidth + 'px',
                                        divimegaproBodyCurrentHeight = divimegaproBody.height(),
                                        customHeight = 0,
                                        divimegaproBodyHeight, options = dmpGetOptions(dmpid);
                                    if (options['megaprofixedheight'] > 0) {
                                        customHeight = options['megaprofixedheight'];
                                        divimegaproBodyHeight = customHeight
                                    }
                                    let divimegaproBodyRealSize = divimegaproBodyOnSingleton.clone().attr('id', divimegaproBodySelector + '-temp').css('width', divimegaproBodyWidthPx).attr('class', 'dmphidden');
                                    divimegaproBodyRealSize.appendTo(tippySingleton.parent());
                                    setTimeout(() => {
                                        divimegaproBodyRealSize.css('display', 'inline-block', 'important');
                                        divimegaproBodyHeight = divimegaproBodyRealSize[0].offsetHeight;
                                        divimegaproBodyRealSize.css('display', '');
                                        divimegaproBodyRealSize.remove();
                                        let divimegaproBodyRealSizeElem = document.getElementById(divimegaproBodySelector + '-temp');
                                        if (divimegaproBodyRealSizeElem !== null) {
                                            divimegaproBodyRealSizeElem.parentNode.removeChild(divimegaproBodyRealSizeElem);
                                            divimegaproBodyRealSizeElem.remove()
                                        }
                                        if ('undefined' === typeof divimegaproBodyHeight) {
                                            return
                                        }
                                        let viewportHeight = $(window).height(),
                                            distance = instance.props.distance,
                                            clientRect = instance.reference.getBoundingClientRect(),
                                            referenceHeight = clientRect['height'],
                                            maxHeight = viewportHeight - referenceHeight - distance,
                                            dmpTotalHeight, forceHeight = true,
                                            distanceFromTop = parseFloat(instance.popper.style.top),
                                            instanceMatrix = getMatrix(instance.popper),
                                            instanceX = instanceMatrix.x,
                                            instanceY = instanceMatrix.y;
                                        if (distanceFromTop === 0 && customHeight == 0) {
                                            if (instance.popperInstance.options.placement === 'top' || instance.popperInstance.options.placement === 'bottom') {
                                                distanceFromTop = instanceY
                                            }
                                        }
                                        dmpTotalHeight = (divimegaproBodyHeight + distanceFromTop);
                                        maxHeight = viewportHeight - distanceFromTop;
                                        if (dmpTotalHeight > 0 && dmpTotalHeight <= maxHeight) {
                                            maxHeight = dmpTotalHeight
                                        }
                                        if (isNaN(maxHeight)) {
                                            maxHeight = 0
                                        }
                                        if ((divimegaproBodyHeight != divimegaproBodyCurrentHeight && divimegaproBodyHeight < divimegaproBodyCurrentHeight && maxHeight > divimegaproBodyCurrentHeight) || (divimegaproBodyHeight != divimegaproBodyCurrentHeight && divimegaproBodyHeight < divimegaproBodyCurrentHeight && maxHeight < divimegaproBodyCurrentHeight)) {
                                            divimegaproBodyHeight = divimegaproBodyCurrentHeight
                                        }
                                        if (customHeight > 0) {
                                            divimegaproBodyHeight = customHeight
                                        }
                                        instance.popper.style.width = divimegaproBodyWidthPx;
                                        divimegaproBodyOnSingleton.css({
                                            'width': divimegaproBodyWidthPx
                                        });
                                        tippySingleton.css({
                                            'width': tippySingletonWidth + 'px'
                                        });
                                        tippySingletonContent.css({
                                            'width': divimegaproBodyWidthPx,
                                            'height': divimegaproBodyHeight + 'px'
                                        });
                                        setTimeout(function() {
                                            setMaxHeight(instance.reference._tippy, dmpid, instance.props, true, '#divimegapro-container-' + dmpid)
                                        }, 500)
                                    }, 50)
                                }
                            }

                            function setMaxHeight(instance, dmpid, props, forceHeight, divimegaproBodySelector) {
                                if (instance.popperChildren.content.firstChild === null) {
                                    return
                                }
                                let tippyActive = $('.tippy-popper.dmp-' + dmpid),
                                    divimegaproBody = $(divimegaproBodySelector + '-clone-singleton'),
                                    refA, refB, refC, refD, options = dmpGetOptions(dmpid),
                                    reference;
                                if ('undefined' !== typeof divimegaproBody) {
                                    reference = 'singleton';
                                    if ('undefined' !== typeof tippyActive[0] && tippyActive[0]._tippy.popperChildren.content.firstChild !== null) {
                                        divimegaproBodySelector = tippyActive[0]._tippy.popperChildren.content.firstChild.getAttribute('id');
                                        divimegaproBody = $('#' + divimegaproBodySelector)
                                    }
                                }
                                if ('undefined' === typeof divimegaproBody) {
                                    return
                                }
                                if (reference !== 'singleton') {
                                    setTimeout(() => {
                                        let dmphiddens = $(tippyActive.parent()).find('.dmphidden');
                                        if (dmphiddens.length > 1) {
                                            dmphiddens.remove()
                                        }
                                    }, 1)
                                }
                                let divimegaproBodyWidth = divimegaproBody.width(),
                                    divimegaproBodyRealSize = divimegaproBody.clone().attr('id', divimegaproBodySelector + '-temp').attr('style', 'display:none').css('width', divimegaproBodyWidth).attr('class', 'dmphidden');
                                divimegaproBodyRealSize.appendTo(tippyActive.parent());
                                setTimeout(() => {
                                    let divimegaproBodyCurrentHeight = divimegaproBody.height(),
                                        divimegaproBodyHeight;
                                    if (divimegaproBodyRealSize.length === 0) {
                                        divimegaproBodyRealSize.remove();
                                        return
                                    }
                                    divimegaproBodyRealSize.css('display', 'inline-block', 'important');
                                    divimegaproBodyHeight = divimegaproBodyRealSize[0].offsetHeight;
                                    divimegaproBodyRealSize.css('display', '');
                                    if (divimegaproBodyHeight < 1) {
                                        divimegaproBodyHeight = divimegaproBodyCurrentHeight
                                    }
                                    divimegaproBodyRealSize.remove();
                                    let divimegaproBodyRealSizeElem = document.getElementById(divimegaproBodySelector + '-temp');
                                    if (divimegaproBodyRealSizeElem !== null) {
                                        divimegaproBodyRealSizeElem.parentNode.removeChild(divimegaproBodyRealSizeElem);
                                        divimegaproBodyRealSizeElem.remove()
                                    }
                                    const viewportWidth = $(window).width();
                                    const viewportHeight = $(window).height();
                                    let dmpTotalHeight = divimegaproBodyHeight,
                                        customHeight = 0,
                                        dmpTotalHeightDistanceFromTop = 0,
                                        viewportHeightDistanceFromTop = 0;
                                    if (dmpTotalHeight === 0 || 'undefined' === typeof dmpTotalHeight) {
                                        let allDiviSections = divimegaproBody.find('.et_pb_section'),
                                            totalHeightAllSections = 0;
                                        allDiviSections.each(function() {
                                            totalHeightAllSections += $(this).height()
                                        });
                                        if ('undefined' !== typeof totalHeightAllSections && !isNaN(totalHeightAllSections) && totalHeightAllSections > 0) {
                                            dmpTotalHeight = divimegaproBodyHeight = totalHeightAllSections
                                        } else {
                                            return
                                        }
                                    }
                                    if ('undefined' !== typeof options && options['megaprofixedheight'] > 0) {
                                        customHeight = options['megaprofixedheight']
                                    }
                                    if (forceHeight !== true) {
                                        if (viewportWidth >= themesBreakpoint['Divi'] && (dmpTotalHeight <= viewportHeight && customHeight === 0)) {
                                            if ((props.parentDiviMainContent.length || props.parentDiviPageContainer.length || props.parentDiviETMainArea.length || props.parentDiviMainFooter.length) && !(props.parentDiviTopHeader.length || props.parentDiviMainHeader.length || props.parentDiviModuleMenu.length || props.parentSlideMenuContainer.length)) {
                                                instance.popperChildren.content.querySelector('.divimegapro-flexheight').style.height = dmpTotalHeight + 'px';
                                                return
                                            }
                                        }
                                    }
                                    const clientRect = instance.reference.getBoundingClientRect();
                                    const referenceHeight = clientRect['height'];
                                    const referenceTop = clientRect['top'];
                                    const distance = instance.props.distance;
                                    var maxHeight = viewportHeight - referenceHeight - distance;
                                    var distanceFromTop = parseFloat(instance.popper.style.top);
                                    if (distanceFromTop === 0 && customHeight == 0) {
                                        var instanceMatrix = getMatrix(instance.popper),
                                            instanceX = instanceMatrix.x,
                                            instanceY = instanceMatrix.y;
                                        if (instance.popperInstance.options.placement === 'top' || instance.popperInstance.options.placement === 'bottom') {
                                            distanceFromTop = instanceY
                                        }
                                    }
                                    if (distanceFromTop > 0) {
                                        dmpTotalHeightDistanceFromTop = (divimegaproBodyHeight + distanceFromTop);
                                        viewportHeightDistanceFromTop = viewportHeight - distanceFromTop
                                    } else {
                                        viewportHeightDistanceFromTop = viewportHeight
                                    }
                                    applyStylesfromFirstSection(instance);
                                    instance.popperChildren.content.querySelector('.divimegapro-flexheight').style.height = dmpTotalHeight + 'px';
                                    if (forceHeight !== true) {
                                        if (dmpTotalHeight <= viewportHeight && customHeight == 0) {
                                            if (dmpTotalHeight > divimegaproBodyCurrentHeight) {
                                                instance.props.maxHeight = dmpTotalHeight;
                                                instance.popperChildren.tooltip.style.maxHeight = dmpTotalHeight + 'px';
                                                instance.popperChildren.content.style.maxHeight = dmpTotalHeight + 'px';
                                                instance.popperChildren.content.querySelector('.divimegapro-flexheight').style.height = dmpTotalHeight + 'px'
                                            }
                                            return
                                        }
                                    }
                                    if (dmpTotalHeight > 0 && dmpTotalHeight <= maxHeight) {
                                        maxHeight = dmpTotalHeight
                                    }
                                    if (dmpTotalHeightDistanceFromTop > 0 && viewportHeightDistanceFromTop > 0 && dmpTotalHeightDistanceFromTop > viewportHeightDistanceFromTop) {
                                        maxHeight = viewportHeightDistanceFromTop
                                    }
                                    if ((divimegaproBodyHeight != divimegaproBodyCurrentHeight && divimegaproBodyHeight < divimegaproBodyCurrentHeight && maxHeight > divimegaproBodyCurrentHeight) || (divimegaproBodyHeight != divimegaproBodyCurrentHeight && divimegaproBodyHeight < divimegaproBodyCurrentHeight && maxHeight < divimegaproBodyCurrentHeight)) {
                                        maxHeight = divimegaproBodyCurrentHeight
                                    }
                                    if (customHeight > 0) {
                                        maxHeight = customHeight;
                                        if (customHeight < dmpTotalHeight) {
                                            instance.popperChildren.content.querySelector('.divimegapro-flexheight').style.height = maxHeight + 'px'
                                        }
                                    }
                                    refA = instance.props.maxHeight;
                                    if (refA === maxHeight) {
                                        return
                                    }
                                    if (('' === instance.popperChildren.tooltip.style.maxHeight && '' === instance.popperChildren.content.style.maxHeight) || (maxHeight > instance.props.maxHeight && maxHeight > parseFloat(instance.popperChildren.tooltip.style.maxHeight) && maxHeight > parseFloat(instance.popperChildren.content.style.maxHeight))) {
                                        instance.props.maxHeight = maxHeight;
                                        instance.popperChildren.tooltip.style.maxHeight = maxHeight + 'px';
                                        instance.popperChildren.content.style.maxHeight = maxHeight + 'px';
                                        if (dmpTotalHeight >= viewportHeight || (customHeight > 0 && dmpTotalHeight > customHeight)) {
                                            instance.popperChildren.content.style.overflowY = 'auto'
                                        }
                                    }
                                }, 1)
                            }

                            function getMatrix(element) {
                                if ('undefined' !== typeof element.style) {
                                    let values = element.style.transform.split(/\w+\(|\);?/);
                                    if ('undefined' !== typeof values[1]) {
                                        let transform = values[1].split(/,\s?/g).map(function(numStr) {
                                            return parseInt(numStr)
                                        });
                                        return {
                                            x: transform[0],
                                            y: transform[1],
                                            z: transform[2]
                                        }
                                    }
                                }
                                return {
                                    x: 0,
                                    y: 0,
                                    z: 0
                                }
                            }

                            function applyStylesfromFirstSection(instance) {
                                let firstDiviSection = instance.popperChildren.content.querySelectorAll('.et_pb_section:first-child'),
                                    $firstDiviSection = $(firstDiviSection),
                                    cssclass_nopaddingnoboxshadow = 'dl-noboxshadow-nopadding',
                                    cssclass_noboxshadow = 'dl-noboxshadow';
                                if (firstDiviSection.length === 0) {
                                    return
                                }
                                firstDiviSection = $(firstDiviSection);
                                if (firstDiviSection.length === 0) {
                                    return
                                }
                                if ($firstDiviSection.hasClass(cssclass_nopaddingnoboxshadow)) {
                                    $firstDiviSection.removeClass(cssclass_nopaddingnoboxshadow)
                                }
                                const firstDiviSectionBoxShadow = firstDiviSection.css('box-shadow');
                                if (firstDiviSectionBoxShadow !== '' && firstDiviSectionBoxShadow !== 'none' && instance.popperChildren.content.style.boxShadow !== firstDiviSectionBoxShadow) {
                                    instance.popperChildren.content.style.boxShadow = firstDiviSectionBoxShadow;
                                    $firstDiviSection.parent().addClass(cssclass_nopaddingnoboxshadow);
                                    $firstDiviSection.parent().addClass(cssclass_noboxshadow)
                                }
                                const firstDiviSectionborderTopLeftRadius = firstDiviSection.css('border-top-left-radius');
                                const firstDiviSectionborderTopRightRadius = firstDiviSection.css('border-top-right-radius');
                                const firstDiviSectionborderBottomRightRadius = firstDiviSection.css('border-bottom-right-radius');
                                const firstDiviSectionborderBottomLeftRadius = firstDiviSection.css('border-bottom-left-radius');
                                if (firstDiviSectionborderTopLeftRadius !== '' && firstDiviSectionborderTopLeftRadius !== '0px' && firstDiviSectionborderTopLeftRadius !== instance.popperChildren.content.style.borderTopLeftRadius) {
                                    instance.popperChildren.content.style.borderTopLeftRadius = firstDiviSectionborderTopLeftRadius
                                }
                                if (firstDiviSectionborderTopRightRadius !== '' && firstDiviSectionborderTopRightRadius !== '0px' && firstDiviSectionborderTopRightRadius !== instance.popperChildren.content.style.borderTopRightRadius) {
                                    instance.popperChildren.content.style.borderTopRightRadius = firstDiviSectionborderTopRightRadius
                                }
                                if (firstDiviSectionborderBottomRightRadius !== '' && firstDiviSectionborderBottomRightRadius !== '0px' && firstDiviSectionborderBottomRightRadius !== instance.popperChildren.content.style.borderBottomRightRadius) {
                                    instance.popperChildren.content.style.borderBottomRightRadius = firstDiviSectionborderBottomRightRadius
                                }
                                if (firstDiviSectionborderBottomLeftRadius !== '' && firstDiviSectionborderBottomLeftRadius !== '0px' && firstDiviSectionborderBottomLeftRadius !== instance.popperChildren.content.style.borderBottomLeftRadius) {
                                    instance.popperChildren.content.style.borderBottomLeftRadius = firstDiviSectionborderBottomLeftRadius
                                }
                                let firstDiviSectionBackgroundColor = firstDiviSection.css('background-color');
                                if (firstDiviSection.css('background') === 'rgba(0, 0, 0, 0) none repeat scroll 0% 0%') {
                                    firstDiviSectionBackgroundColor = '#FFF'
                                }
                                if (firstDiviSectionBackgroundColor !== '' && firstDiviSectionBackgroundColor !== instance.popperChildren.content.style.backgroundColor) {
                                    instance.popperChildren.content.style.backgroundColor = firstDiviSectionBackgroundColor
                                }
                            }

                            function triggerResizes() {
                                $(window).trigger("resize");
                                window.dispatchEvent(new Event('resize'))
                            }

                            function initDiviElements(divimegapro_id, singletonEnabled) {
                                let $dmp = $(divimegapros[divimegapro_id]['html']),
                                    alreadyInit = typeof $dmp.attr('data-dmpinitdivielemsonce');
                                if ('undefined' !== alreadyInit) {
                                    return
                                }
                                triggerResizes();
                                if ('undefined' === alreadyInit) {
                                    $dmp.attr('data-dmpinitdivielemsonce', 1)
                                }
                                clearTimeout(initDiviElements_timer);
                                clearTimeout(initDiviFuncs_timer);
                                var dmpRef = (singletonEnabled === true) ? '.tippy-popper[data-dmpid="' + divimegapro_id + '"]' : '.tippy-popper.dmp-' + divimegapro_id,
                                    slowTimer, balanceTimer, fastTimer = 1;
                                if (singletonEnabled === true) {
                                    slowTimer = 1000, balanceTimer = 500, fastTimer = 10
                                } else {
                                    slowTimer = balanceTimer = fastTimer
                                }
                                resetDiviAnimations(dmpRef);
                                $(dmpRef + ' .divimegapro-body .et_animated').each(function() {
                                    et_remove_animation($(this))
                                });
                                initIGMaps(divimegapro_id, dmpRef);
                                initDiviGearProductCarousel();
                                initDiviGearDiviBlogCarousel();
                                initDiviGearDiviCarousel();
                                initCCPWCalculator(dmpRef);
                                initDMPRO_carousel();
                                initDSM_BlogCarousel(dmpRef);
                                initDiviElements_timer = setTimeout(function() {
                                    initDPX_AdvancedTabs(dmpRef);
                                    initDSM_AdvancedTabs(dmpRef);
                                    initDFH_AdvancedTabs(dmpRef);
                                    initRevSlider(divimegapro_id, dmpRef);
                                    var $divimegaprobody = $(dmpRef + ' .divimegapro-body'),
                                        $et_pb_circle_counter = $(dmpRef + ' .divimegapro-body .et_pb_circle_counter'),
                                        $et_pb_number_counter = $(dmpRef + ' .divimegapro-body .et_pb_number_counter'),
                                        $et_pb_countdown_timer = $(dmpRef + ' .divimegapro-body .et_pb_countdown_timer'),
                                        $et_pb_tabs = $(dmpRef + ' .divimegapro-body .et_pb_tabs'),
                                        $et_pb_map = $(dmpRef + ' .divimegapro-body .et_pb_map_container'),
                                        $et_pb_slider = $divimegaprobody.find(".et_pb_slider");
                                    if (typeof window.et_fix_testimonial_inner_width !== 'undefined') {
                                        window.et_fix_testimonial_inner_width()
                                    }
                                    $et_pb_circle_counter.length && window.et_pb_reinit_circle_counters($et_pb_circle_counter), $et_pb_number_counter.length && window.et_pb_reinit_number_counters($et_pb_number_counter), $et_pb_countdown_timer.length && window.et_pb_countdown_timer_init($et_pb_countdown_timer), clear_et_tabs_cache($et_pb_tabs), $et_pb_tabs.length && window.et_pb_tabs_init($et_pb_tabs), $et_pb_slider.unbind().removeData(), $et_pb_slider.length > 0 && $et_pb_slider.each((function() {
                                        et_pb_slider_init($(this))
                                    })), et_pb_init_maps($et_pb_map);
                                    if (singletonEnabled === false) {
                                        let tippyRef = '.tippy-popper ',
                                            dt = $(tippyRef + ".et_pb_contact_form_container");
                                        dt.each(function() {
                                            let t = $(this);
                                            t.find("form").off('submit')
                                        });
                                        window.et_reinit_waypoint_modules();
                                        let searchBar = $('.et_pb_searchform .et_pb_s'),
                                            bkpSearchBarHeight = searchBar.css('height');
                                        if (diviMobile !== true) {
                                            window.et_pb_init_modules()
                                        } else if (diviMobile === true) {
                                            initETContactForm()
                                        }
                                        let fixDiviLoopWhenInitModules = setTimeout(function() {
                                            if (diviMobile === true) {
                                                window.et_fix_slider_height = diviet_fix_slider_height
                                            }
                                        }, 200);
                                        searchBar.css('height', bkpSearchBarHeight);
                                        fixMobileMenuAfterDiviInit()
                                    } else {
                                        et_reinit_waypoint_modules(dmpRef)
                                    }
                                    fixDiviAccordionTogglingBug(dmpRef);
                                    clickOffMobileLinkswithHashtagOnly();
                                    initDiviFuncs_timer = setTimeout(function() {
                                        callDiviLifeFuncs(dmpRef + ' ')
                                    }, fastTimer)
                                }, balanceTimer)
                            }

                            function fixDiviAccordionTogglingBug(dmpRef) {
                                $("body").on("click", dmpRef + ' .et_pb_toggle_title', (function() {
                                    let i = $(this).closest(".et_pb_toggle"),
                                        r = i.closest(".et_pb_accordion"),
                                        s = r.length;
                                    if (s) {
                                        let maxTries = 3,
                                            fixAccordionTogglingBugCount = 0,
                                            fixAccordionTogglingBug = setInterval(function() {
                                                if (r.hasClass("et_pb_accordion_toggling")) {
                                                    r.removeClass("et_pb_accordion_toggling");
                                                    clearInterval(fixAccordionTogglingBug)
                                                }
                                                fixAccordionTogglingBugCount += 1;
                                                if (fixAccordionTogglingBugCount === maxTries) {
                                                    clearInterval(fixAccordionTogglingBug)
                                                }
                                            }, 1000)
                                    }
                                }))
                            }

                            function clear_et_tabs_cache(t) {
                                t.each(function() {
                                    var t = $(this);
                                    t.data("et_pb_simple_slider", '')
                                })
                            }

                            function initIGMaps(dmpid, dmpRef) {
                                if (typeof iMaps !== 'undefined') {
                                    let mapsindmp = $(dmpRef + ' .divimegapro-body .map_render'),
                                        callMapsInit = false;
                                    if (mapsindmp.length > 0) {
                                        mapsindmp.each(function() {
                                            let pThis = $(this),
                                                mapid = pThis.attr('id').replace(/\D/g, '');
                                            if (typeof supportIGMap[dmpid] === 'undefined') {
                                                let mapcontent = $('#divimegapro-' + dmpid + ' #map_' + mapid).detach();
                                                supportIGMap[dmpid] = {};
                                                supportIGMap[dmpid][mapid] = mapcontent
                                            }
                                            pThis.remove()
                                        })
                                    }
                                    if (typeof supportIGMap[dmpid] !== 'undefined') {
                                        let maps = supportIGMap[dmpid];
                                        if (Object.keys(maps).length > 0) {
                                            callMapsInit = true;
                                            $.each(maps, function(mapid, mapcontent) {
                                                $(dmpRef + ' .divimegapro-body #map_wrapper_' + mapid + ' .map_container').html(mapcontent)
                                            })
                                        }
                                        if (callMapsInit === true) {
                                            iMaps.init()
                                        }
                                    }
                                }
                            }

                            function initDiviGearProductCarousel() {
                                var e = $,
                                    o = document,
                                    tippyRef = '.tippy-popper ';
                                if (e(tippyRef + ".dgpc_product_carousel").length > 0) {
                                    e(tippyRef + ".dgpc_product_carousel").each(function(t, o) {
                                        var n = o.querySelector(tippyRef + ".dgpc-container"),
                                            r = o.querySelector(tippyRef + ".swiper-container"),
                                            a = n.dataset,
                                            c = "on" == a.arrow && {
                                                nextEl: ".sbn" + a.order,
                                                prevEl: ".sbp" + a.order
                                            },
                                            i = "on" == a.dots && {
                                                el: ".sp" + a.order,
                                                clickable: !0
                                            },
                                            s = Number(a.spacebetween.replace(/[^0-9.]/g, "")),
                                            l = {
                                                rotate: Number(parseInt(a.coverflow)),
                                                stretch: 0,
                                                depth: 100,
                                                modifier: 1,
                                                slideShadows: "off" !== a.shadow
                                            };
                                        e(this).find(".products").addClass("dg-products"), e(this).find(".products").removeClass("products");
                                        var p = new Swiper(r, {
                                            slidesPerView: Number(a.slidesperview),
                                            slidesPerGroup: "on" == a.multislide ? Number(a.slidesperview) : 1,
                                            spaceBetween: s > 0 ? s : Number(0),
                                            speed: Number(a.transition),
                                            loop: "on" == a.loop,
                                            centeredSlides: "on" == a.center,
                                            autoplay: "on" == a.autoplay && {
                                                delay: a.autospeed,
                                                disableOnInteraction: !1
                                            },
                                            slideClass: "product",
                                            wrapperClass: "dg-products",
                                            navigation: c,
                                            pagination: i,
                                            effect: a.effect,
                                            coverflowEffect: "coverflow" == a.effect ? l : null,
                                            setWrapperSize: !0,
                                            observer: !0,
                                            observeParents: !0,
                                            observeSlideChildren: !0,
                                            preventClicks: !0,
                                            preventClicksPropagation: !0,
                                            slideToClickedSlide: !1,
                                            touchMoveStopPropagation: !0,
                                            threshold: 15,
                                            breakpoints: {
                                                981: {
                                                    slidesPerView: Number(a.slidesperview),
                                                    slidesPerGroup: "on" == a.multislide ? Number(a.slidesperview) : 1
                                                },
                                                768: {
                                                    slidesPerView: Number(a.tablet),
                                                    slidesPerGroup: "on" == a.multislide ? Number(a.tablet) : 1
                                                },
                                                1: {
                                                    slidesPerView: Number(a.mobile),
                                                    slidesPerGroup: "on" == a.multislide ? Number(a.mobile) : 1
                                                }
                                            }
                                        });
                                        "on" == a.hoverpause && "on" == a.autoplay && (r.addEventListener("mouseover", function() {
                                            p.autoplay.stop()
                                        }), r.addEventListener("mouseout", function() {
                                            p.autoplay.start()
                                        }))
                                    })
                                }
                            }

                            function initDiviGearDiviBlogCarousel() {
                                var e = $,
                                    t = document,
                                    tippyRef = '.tippy-popper ';
                                if (e(tippyRef + ".dgbc_blog_carousel").length > 0) {
                                    e(tippyRef + ".dgbc_blog_carousel").each(function(e, t) {
                                        var o = t.querySelector(tippyRef + ".swiper-container"),
                                            r = t.querySelector(tippyRef + ".dgbc_carousel_wrapper").dataset,
                                            n = JSON.parse(r.props),
                                            a = Number(n.spacing.replace(/[^0-9.]/g, "")),
                                            c = Number(n.tablet_spacing.replace(/[^0-9.]/g, "")),
                                            i = Number(n.mobile_spacing.replace(/[^0-9.]/g, "")),
                                            l = "on" == n.arrow && {
                                                nextEl: ".dg-bc-arrow-next-" + n.order,
                                                prevEl: ".dg-bc-arrow-prev-" + n.order
                                            },
                                            p = "on" == n.dots && {
                                                el: ".dg-bc-dots-" + n.order,
                                                clickable: !0
                                            },
                                            s = {
                                                rotate: Number(parseInt(n.coverflow)),
                                                stretch: 0,
                                                depth: 100,
                                                modifier: 1,
                                                slideShadows: "off" !== n.shadow
                                            },
                                            u = new Swiper(o, {
                                                slidesPerView: Number(n.xlarge),
                                                slidesPerGroup: "on" == n.multislide ? Number(n.xlarge) : 1,
                                                spaceBetween: a >= 0 ? a : "0",
                                                speed: Number(n.speed),
                                                navigation: l,
                                                pagination: p,
                                                slideClass: "dgbc_post_item",
                                                wrapperClass: "swiper-wrapper",
                                                centeredSlides: "on" == n.centermode,
                                                loop: "on" == n.loop,
                                                autoplay: "on" == n.autoplay && {
                                                    delay: Number(n.autoplay_speed)
                                                },
                                                effect: n.effect,
                                                coverflowEffect: "coverflow" == n.effect ? s : null,
                                                observer: !0,
                                                observeParents: !0,
                                                observeSlideChildren: !0,
                                                setWrapperSize: !0,
                                                cache: !1,
                                                threshold: 15,
                                                breakpoints: {
                                                    981: {
                                                        slidesPerView: Number(n.desktop),
                                                        slidesPerGroup: "on" == n.multislide ? Number(n.desktop) : 1
                                                    },
                                                    768: {
                                                        slidesPerView: Number(n.tablet),
                                                        slidesPerGroup: "on" == n.multislide ? Number(n.tablet) : 1,
                                                        spaceBetween: c >= 0 ? c : "0"
                                                    },
                                                    1: {
                                                        slidesPerView: Number(n.mobile),
                                                        slidesPerGroup: "on" == n.multislide ? Number(n.mobile) : 1,
                                                        spaceBetween: i >= 0 ? i : "0"
                                                    }
                                                }
                                            });
                                        "on" == n.hoverpause && "on" == n.autoplay && (o.addEventListener("mouseover", function() {
                                            u.autoplay.stop()
                                        }), o.addEventListener("mouseout", function() {
                                            u.autoplay.start()
                                        }))
                                    })
                                }
                            }

                            function initDiviGearDiviCarousel() {
                                var e = $,
                                    o = document,
                                    tippyRef = '.tippy-popper ';
                                if (e(tippyRef + ".dica_divi_carousel").length > 0) {
                                    e(tippyRef + ".dica_divi_carousel").each(function(t, o) {
                                        var n = o.querySelector(tippyRef + ".swiper-container"),
                                            a = o.querySelector(tippyRef + ".dica-container"),
                                            r = JSON.parse(a.dataset.props),
                                            c = Number(r.speed),
                                            i = Number(r.desktop),
                                            l = Number(r.tablet),
                                            s = Number(r.mobile),
                                            p = r.arrow,
                                            d = r.dots,
                                            u = r.autoplay,
                                            _ = Number(r.autoSpeed),
                                            h = r.loop,
                                            v = Number(r.item_spacing.replace(/[^0-9.]/g, "")),
                                            b = r.center_mode,
                                            f = r.slider_effec,
                                            m = r.pause_onhover,
                                            g = r.multislide,
                                            y = r.cfshadow,
                                            w = r.order,
                                            I = "on" == r.lazyload && {
                                                loadedClass: "swiper-lazy-loaded"
                                            },
                                            N = r.scroller_effect,
                                            x = Number(r.scroller_speed),
                                            P = r.autowidth,
                                            k = Number(r.item_spacing_tablet.replace(/[^0-9.]/g, "")),
                                            S = Number(r.item_spacing_phone.replace(/[^0-9.]/g, ""));
                                        var O = "on" == p && {
                                                nextEl: ".dica-next-btn-" + w,
                                                prevEl: ".dica-prev-btn-" + w
                                            },
                                            C = "on" == d && {
                                                el: ".dica-paination-" + w,
                                                clickable: !0
                                            },
                                            z = Number(parseInt(r.cover_rotate));
                                        z = isNaN(z) ? 0 : z;
                                        var j = new Swiper(n, {
                                            slidesPerView: "on" !== P ? i : "auto",
                                            slidesPerGroup: "on" == g && "on" !== P && "on" !== N ? Number(i) : 1,
                                            navigation: O,
                                            pagination: C,
                                            spaceBetween: v,
                                            speed: "on" !== N ? c : x,
                                            autoplay: "on" == u && {
                                                delay: _,
                                                disableOnInteraction: !1
                                            },
                                            slideClass: "dica_divi_carouselitem",
                                            loop: "on" == h,
                                            centeredSlides: "on" == b,
                                            effect: "1" == f ? "slide" : f,
                                            coverflowEffect: {
                                                rotate: z,
                                                stretch: 0,
                                                depth: 100,
                                                modifier: 1,
                                                slideShadows: "off" !== y
                                            },
                                            observer: !0,
                                            observeParents: !0,
                                            observeSlideChildren: !0,
                                            preloadImages: "on" != r.lazyload,
                                            watchSlidesVisibility: !0,
                                            preventClicks: !0,
                                            preventClicksPropagation: !0,
                                            slideToClickedSlide: !1,
                                            touchMoveStopPropagation: !0,
                                            threshold: 15,
                                            lazy: I,
                                            breakpoints: {
                                                981: {
                                                    slidesPerView: "on" !== P ? i : "auto",
                                                    slidesPerGroup: "on" == g && "on" !== P && "on" !== N ? Number(i) : 1,
                                                    spaceBetween: v
                                                },
                                                768: {
                                                    slidesPerView: "on" !== P ? l : "auto",
                                                    slidesPerGroup: "on" == g && "on" !== P && "on" !== N ? Number(l) : 1,
                                                    spaceBetween: k
                                                },
                                                1: {
                                                    slidesPerView: "on" !== P ? s : "auto",
                                                    slidesPerGroup: "on" == g && "on" !== P && "on" !== N ? Number(s) : 1,
                                                    spaceBetween: S
                                                }
                                            }
                                        });
                                        if ("on" == N && "on" == u) {
                                            var E = function() {
                                                j.autoplay.start()
                                            };
                                            (j.freeMode = !0), j.autoplay.stop(), e(window).on("load", function() {
                                                setTimeout(E, 1e3)
                                            })
                                        }
                                        "on" !== N && j.on("observerUpdate", function(e) {
                                            "on" == u && ((j.autoplay.paused = !1), (j.translate = 0)), j.update()
                                        }), "on" == m && "on" == u && (n.addEventListener("mouseover", function() {
                                            j.autoplay.stop()
                                        }), n.addEventListener("mouseout", function() {
                                            j.autoplay.start()
                                        })), "on" == r.lazyload && j.on("lazyImageReady", function(e, t) {
                                            e.querySelector(".dica-item").classList.remove("loading")
                                        }), e(this).find(".dica_divi_carouselitem .et_pb_module_inner").on("click", function(t) {
                                            var o = e(this).find(".dica-item")[0].dataset.link;
                                            if (o) {
                                                t.stopPropagation();
                                                var n = e(this).find(".dica-item")[0].dataset.target;
                                                void 0 !== o && ("_blank" === n ? window.open(o) : (window.location = o))
                                            }
                                        })
                                    })
                                }
                            }

                            function initCCPWCalculator(dmpRef) {
                                $(dmpRef + ' .divimegapro-body .ccpw_calculator').each(function() {
                                    let pThisCCPW = $(this),
                                        type = pThisCCPW.data("type"),
                                        ID, el = dmpRef + ' .divimegapro-body [data-calc-id="' + pThisCCPW.attr("data-calc-id") + '"]';
                                    pThisCCPW.find('.select2').remove();
                                    $(el).removeAttr("data-select2-id");
                                    $(el).find(".crypto_select, .fiat_select").each(function(i, val) {
                                        let pThis = $(this);
                                        pThis.removeClass('select2-hidden-accessible');
                                        pThis.off();
                                        pThis.select2({
                                            dropdownParent: $(dmpRef)
                                        })
                                    });
                                    let convert_numbers = function() {
                                        let crypto_amount = $(el).find("#crypto_amount").val(),
                                            cryptocurrency = $(el).find("#crypto_dd").val(),
                                            currency = $(el).find("#fiat_dd").val(),
                                            coin_name = $(el).find("#crypto_dd option:selected").text(),
                                            currency_name = $(el).find("#fiat_dd option:selected").text(),
                                            label, calculate_price, formated_price;
                                        if ("" == crypto_amount && (crypto_amount = 1), "Crypto Currencies" == $(el).find("#fiat_dd option:selected").closest("optgroup").prop("label")) {
                                            calculate_price = crypto_amount * (parseFloat(cryptocurrency) / parseFloat(currency))
                                        } else {
                                            calculate_price = parseFloat(cryptocurrency) * crypto_amount * parseFloat(currency)
                                        }
                                        if (calculate_price >= 25) {
                                            formated_price = numeral(calculate_price).format("0,0.00")
                                        } else if (calculate_price >= .5 && calculate_price < 25) {
                                            formated_price = numeral(calculate_price).format("0,0.000")
                                        } else if (calculate_price >= .01 && calculate_price < .5) {
                                            formated_price = numeral(calculate_price).format("0,0.0000")
                                        } else if (calculate_price >= 1e-4 && calculate_price < .01) {
                                            formated_price = numeral(calculate_price).format("0,0.00000")
                                        } else {
                                            formated_price = numeral(calculate_price).format("0,0.00000000")
                                        }
                                        $(el).find(".cmc_cal_rs").text(formated_price + " " + currency_name), $(el).find(".cmc_rs_lbl").text(crypto_amount + " " + coin_name)
                                    };
                                    $(document).on("change keyup", el, convert_numbers), convert_numbers()
                                })
                            }

                            function initRevSlider(dmpid, dmpRef) {
                                let slidersindmp = $('#divimegapro-container-' + dmpid + ' rs-module-wrap');
                                if (typeof supportRevSlider[dmpid] === 'undefined') {
                                    if (slidersindmp.length > 0) {
                                        slidersindmp.each(function() {
                                            let pThis = $(this),
                                                sliderModule = pThis.find('rs-module'),
                                                sliderid = sliderModule.attr('id'),
                                                parent_etpbcodeCSSclasses = pThis.parents('.et_pb_code').attr('class'),
                                                slidercontent = pThis.detach();
                                            if (typeof supportRevSlider[dmpid] === 'undefined') {
                                                supportRevSlider[dmpid] = {}
                                            }
                                            if (typeof supportRevSlider[dmpid][sliderid] === 'undefined') {
                                                supportRevSlider[dmpid][sliderid] = {}
                                            }
                                            supportRevSlider[dmpid][sliderid]['content'] = slidercontent;
                                            supportRevSlider[dmpid][sliderid]['parent'] = parent_etpbcodeCSSclasses;
                                            pThis.remove()
                                        })
                                    }
                                }
                                if (typeof supportRevSlider[dmpid] !== 'undefined') {
                                    let sliders = supportRevSlider[dmpid];
                                    if (Object.keys(sliders).length > 0) {
                                        $.each(sliders, function(sliderid, slider) {
                                            let sliderModuleId = sliderid.replace(/\D/g, ''),
                                                revsliderid = 'revslider' + sliderModuleId,
                                                sliderParentRef = '.' + slider['parent'].replaceAll(' ', '.'),
                                                sliderParent = $(dmpRef + ' .divimegapro-body ' + sliderParentRef);
                                            if (sliderParent.length > 0) {
                                                sliderParent.find('.et_pb_code_inner').html(slider['content'].prop("outerHTML"));
                                                let theSlider = $('#' + sliderid);
                                                if (theSlider.length > 0) {
                                                    theSlider.revstart()
                                                }
                                            }
                                        })
                                    }
                                }
                            }

                            function initDMPRO_carousel() {
                                if (typeof window.dmpro_carousel !== 'undefined') {
                                    window.dmpro_carousel()
                                }
                            }

                            function initDPX_AdvancedTabs(dmpRef) {
                                if (typeof window.dipi_at_sticky !== 'undefined') {
                                    let pThis = $(dmpRef + ' .divimegapro-body'),
                                        tabs = pThis.find('.dipi-at-tabs .dipi-at-tab'),
                                        panels = pThis.find('.dipi-at-panels .dipi_advanced_tabs_item'),
                                        firstTab = pThis.find('.dipi-at-tab:first-child'),
                                        firstPanel = pThis.find('.dipi_advanced_tabs_item:first-child');
                                    tabs.off();
                                    tabs.removeClass("dipi-at-tab--active animated animateOut animateIn");
                                    panels.removeClass("dipi-at-panel--active animated animateOut animateIn");
                                    firstTab.addClass("dipi-at-tab--active");
                                    firstPanel.addClass("dipi-at-panel--active");
                                    pThis.find('.dipi-advanced-tabs-front').each(function(t, i) {
                                        $(this).dipiAdvancedTabs()
                                    })
                                }
                            }

                            function initDSM_AdvancedTabs(dmpRef) {
                                let e = document.querySelectorAll(dmpRef + ' .dsm-advanced-tabs-container'),
                                    s = s => {
                                        let {
                                            tabs: a,
                                            index: t,
                                            tabsContent: d,
                                            animationName: i,
                                            innerAnimationName: c,
                                            currentTabId: l,
                                            deepLink: n,
                                            container: r
                                        } = s, o = d[t].querySelector(".dsm-inner-content-wrapper");
                                        d.forEach((e, s) => {
                                            o.classList.remove(`${ c }`), e.classList.remove("dsm-active", `${ i }`), a[s].classList.remove("dsm-active", `${ i }`)
                                        }), e.forEach(e => {
                                            e && e.classList.remove("dsm-active-deep-link")
                                        }), a[t].classList.add("dsm-active"), d[t].classList.add("dsm-active", `${ i }`), o.classList.add("animated", c), n && (location.hash = l, location.hash.substring(1) === l && r.classList.add("dsm-active-deep-link"))
                                    };
                                e.forEach((e, a) => {
                                    let t = e.querySelectorAll(".dsm-tab"),
                                        d = e.querySelectorAll(".dsm-content-wrapper"),
                                        i = e.dataset.trigger,
                                        c = e.dataset.animation,
                                        l = e.dataset.inner_animation,
                                        n = "on" === e.dataset.deep_link;
                                    t.forEach((a, r) => {
                                        let o = a.querySelector(".dsm-title"),
                                            m = null != o ? o.innerHTML.toLowerCase().replaceAll(" ", "-") : "";
                                        "" !== location.hash && ("" === location.hash || e.classList.contains("dsm-active-deep-link")) || (t[0].classList.add("dsm-active"), d[0].classList.add("dsm-active", `${ c }`), d[0].querySelector(".dsm-inner-content-wrapper").classList.add("animated", l));
                                        let h = {
                                            tabs: t,
                                            index: r,
                                            deepLink: n,
                                            tabsContent: d,
                                            animationName: c,
                                            innerAnimationName: l,
                                            currentTabId: m,
                                            container: e
                                        };
                                        n && "" !== location.hash && m === location.hash.substring(1) && s(h), a.addEventListener("click", () => {
                                            "click" === i && s(h)
                                        }), a.addEventListener("mouseover", () => {
                                            "hover" === i && s(h)
                                        })
                                    })
                                })
                            }

                            function initDFH_AdvancedTabs(dmpRef) {
                                $(dmpRef + ' .difl_advancedtab').each(function(index, ele) {
                                    let _this = $(this),
                                        container = _this.find('.df_at_container'),
                                        nav_container = _this.find('.df_at_nav_container'),
                                        navs = _this.find('.df_at_nav'),
                                        settings = _this.find('.df_at_container').data().settings,
                                        sticky_selector = '.' + settings.module_class + ' .df_at_nav_wrap',
                                        sticky_container = '.' + settings.module_class + ' .df_at_container',
                                        Sticky = null,
                                        space = df_tab_distance(settings);
                                    if (settings.use_sticky_nav === 'on') {
                                        Sticky = new hcSticky(sticky_selector, {
                                            stickTo: sticky_container,
                                            top: space.desktop,
                                            responsive: {
                                                980: {
                                                    top: space.tablet,
                                                    disable: settings.turn_off_sticky === 'tablet_phone' ? true : false
                                                },
                                                767: {
                                                    top: space.phone,
                                                    disable: settings.turn_off_sticky === 'phone' || settings.turn_off_sticky === 'tablet_phone' ? true : false
                                                }
                                            }
                                        });
                                        Sticky.refresh();
                                        if (typeof window.df_at_sticky !== 'undefined') {
                                            window.df_at_sticky.push(Sticky)
                                        }
                                    }
                                    _this.find('.df_at_nav:first-child').addClass('df_at_nav_active');
                                    _this.find('.difl_advancedtabitem:first-child').addClass('df_at_content_active');
                                    navs.on(settings.tab_event_type, function(e) {
                                        var active_class = e.currentTarget.classList[0];
                                        navs.removeClass('df_at_nav_active');
                                        $(this).addClass('df_at_nav_active');
                                        if (settings.use_sticky_nav === 'on') {
                                            df_at_nav_sticky_scroll(container, space)
                                        }
                                        if (settings.use_sticky_nav !== 'on' && settings.use_scroll_to_content === 'on') {
                                            df_scroll_to_content(_this.find('.df_at_all_tabs_wrap'))
                                        }
                                        df_tab_anime(_this, `.${settings.module_class } .df_at_all_tabs`, settings.tab_animation, parseInt(settings.animation_duration), active_class)
                                    })
                                });
                                onElementHeightChange(document.body, function() {
                                    if (typeof window.df_at_sticky !== 'undefined' && window.df_at_sticky.length > 0) {
                                        for (var i = 0; i < window.df_at_sticky.length; i += 1) {
                                            window.df_at_sticky[i].refresh()
                                        }
                                    }
                                });

                                function onElementHeightChange(elm, callback) {
                                    var lastHeight = elm.clientHeight,
                                        newHeight;
                                    (function run() {
                                        newHeight = elm.clientHeight;
                                        if (lastHeight !== newHeight) {
                                            callback()
                                        }
                                        lastHeight = newHeight;
                                        if (elm.onElementHeightChangeTimer) {
                                            clearTimeout(elm.onElementHeightChangeTimer)
                                        }
                                        elm.onElementHeightChangeTimer = setTimeout(run, 200)
                                    })()
                                }

                                function df_tab_distance(settings) {
                                    var extra_space = settings.extra_space === true ? 32 : 0;
                                    var space = parseInt(settings.sticky_distance) + extra_space;
                                    var space_tablet = settings.sticky_distance_tablet !== '' ? parseInt(settings.sticky_distance_tablet) + extra_space : space;
                                    var space_phone = settings.sticky_distance_phone !== '' ? parseInt(settings.sticky_distance_phone) + extra_space : space_tablet;
                                    return {
                                        'desktop': space,
                                        'tablet': space_tablet,
                                        'phone': space_phone
                                    }
                                }

                                function df_at_nav_sticky_scroll(selector, space) {
                                    var position_top = selector.offset().top;
                                    if ($(window).width() > 980) {
                                        position_top = position_top - space.desktop
                                    }
                                    if ($(window).width() < 981 && $(window).width() > 767) {
                                        position_top = position_top - space.tablet
                                    }
                                    if ($(window).width() < 768) {
                                        position_top = position_top - space.phone
                                    }
                                    $([document.documentElement, document.body]).animate({
                                        scrollTop: position_top
                                    }, 700)
                                }

                                function df_scroll_to_content(selector) {
                                    var position_top = selector.offset().top;
                                    if ($(window).width() < 981) {
                                        $([document.documentElement, document.body]).animate({
                                            scrollTop: position_top
                                        }, 500)
                                    }
                                }
                                var animations = {
                                    slide_left: {
                                        opacity: ['1', '0'],
                                        translateX: ['0', '-100px']
                                    },
                                    slide_right: {
                                        opacity: ['1', '0'],
                                        translateX: ['0', '100px']
                                    },
                                    slide_up: {
                                        opacity: ['1', '0'],
                                        translateY: ['0', '-100px']
                                    },
                                    slide_down: {
                                        opacity: ['1', '0'],
                                        translateY: ['0', '100px']
                                    },
                                    fade_in: {
                                        opacity: ['1', '0']
                                    },
                                    zoom_left: {
                                        opacity: ['1', '0'],
                                        scale: ['1', '.5'],
                                        transformOrigin: ['0% 50%', '0% 50%'],
                                    },
                                    zoom_center: {
                                        opacity: ['1', '0'],
                                        scale: ['1', '.5'],
                                        transformOrigin: ['50% 50%', '50% 50%'],
                                    },
                                    zoom_right: {
                                        opacity: ['1', '0'],
                                        scale: ['1', '.5'],
                                        transformOrigin: ['100% 50%', '100% 50%'],
                                    }
                                };

                                function df_tab_anime(_this, selector, config = 'slide_left', duration, active_class) {
                                    var object = {
                                        targets: selector,
                                        direction: 'alternate',
                                        easing: 'linear',
                                        duration: duration,
                                        endDelay: 1,
                                        update: function(anim) {
                                            if (anim.progress === 100) {
                                                _this.find('.difl_advancedtabitem').removeClass('df_at_content_active');
                                                _this.find('.df_at_all_tabs .' + active_class).addClass('df_at_content_active')
                                            }
                                        }
                                    };
                                    var anime_config = Object.assign(object, animations[config]);
                                    if (window.anime) {
                                        window.anime(anime_config)
                                    }
                                }
                            }

                            function initDSM_BlogCarousel(dmpRef) {
                                let e = $;
                                e(dmpRef + ' .dsm_blog_carousel').each(function(o, t) {
                                    let s = e(this),
                                        f = s.find(".dsm-blog-carousel").data(),
                                        r = "." + s.attr("class").split(" ").join(".") + " .swiper-container",
                                        l = {
                                            nextEl: ".dsm-arrow-button-next" + f.ordernumber,
                                            prevEl: ".dsm-arrow-button-prev" + f.ordernumber
                                        },
                                        a = {
                                            el: ".dsm-pagination" + f.ordernumber,
                                            clickable: !0,
                                            type: "progressbar" !== f.pagiButtonStyle ? "bullets" : "progressbar",
                                            dynamicBullets: "dynamic" === f.pagiButtonStyle
                                        },
                                        c = 1 === f.loop,
                                        n = "on" === f.centered,
                                        i = "on" !== f.touchMove,
                                        u = "on" === f.grab,
                                        p = new Swiper(r, {
                                            effect: f.effect,
                                            coverflowEffect: {
                                                slideShadows: "on" === f.effectShadows,
                                                rotate: f.effectCoverflowRotate,
                                                depth: f.effectCoverflowDepth
                                            },
                                            flipEffect: {
                                                rotate: 30,
                                                slideShadows: "on" === f.effectShadows
                                            },
                                            cubeEffect: {
                                                slideShadows: "on" === f.effectShadows,
                                                shadow: "on" === f.effectShadows,
                                                shadowOffset: 20,
                                                shadowScale: .94
                                            },
                                            speed: Number(f.speed),
                                            loop: !0 === n || "on" !== f.multiRow && c,
                                            autoplay: "on" === f.autoplay && {
                                                delay: f.autoplayspeed
                                            },
                                            setWrapperSize: "cube" !== f.effect && "flip" !== f.effect,
                                            observer: !0,
                                            observeParents: !0,
                                            observeSlideChildren: !0,
                                            slideClass: "dsm-blog-carousel-item",
                                            wrapperClass: "dsm-blog-carousel-wrapper",
                                            navigation: l,
                                            pagination: a,
                                            centeredSlides: n,
                                            slidesPerColumn: "on" === f.multiRow ? Number(f.row) : 1,
                                            slidesPerColumnFill: "row",
                                            grabCursor: !1 !== i && u,
                                            allowTouchMove: i,
                                            breakpoints: {
                                                320: {
                                                    slidesPerView: "cube" === f.effect || "flip" === f.effect ? 1 : Number(f.columnsphone),
                                                    spaceBetween: "cube" === f.effect || "flip" === f.effect ? 0 : Number(f.spacingphone)
                                                },
                                                480: {
                                                    slidesPerView: "cube" === f.effect || "flip" === f.effect ? 1 : Number(f.columnsphone),
                                                    spaceBetween: "cube" === f.effect || "flip" === f.effect ? 0 : Number(f.spacingphone)
                                                },
                                                768: {
                                                    slidesPerView: "cube" === f.effect || "flip" === f.effect ? 1 : Number(f.columnstablet),
                                                    spaceBetween: "cube" === f.effect || "flip" === f.effect ? 0 : Number(f.spacingtablet)
                                                },
                                                981: {
                                                    slidesPerView: "cube" === f.effect || "flip" === f.effect ? 1 : Number(f.columnsdesktop),
                                                    spaceBetween: "cube" === f.effect || "flip" === f.effect ? 0 : Number(f.spacing)
                                                }
                                            }
                                        });
                                    "on" === f.pauseOnHover && (e(this).on("mouseenter", function(e) {
                                        p.autoplay.stop()
                                    }), e(this).on("mouseleave", function(e) {
                                        p.autoplay.start()
                                    }))
                                })
                            }

                            function et_pb_init_maps($et_pb_map) {
                                $et_pb_map.each(function() {
                                    et_pb_map_init($(this))
                                })
                            }

                            function et_get_animation_classes() {
                                return ["et_animated", "infinite", "fade", "fadeTop", "fadeRight", "fadeBottom", "fadeLeft", "slide", "slideTop", "slideRight", "slideBottom", "slideLeft", "bounce", "bounceTop", "bounceRight", "bounceBottom", "bounceLeft", "zoom", "zoomTop", "zoomRight", "zoomBottom", "zoomLeft", "flip", "flipTop", "flipRight", "flipBottom", "flipLeft", "fold", "foldTop", "foldRight", "foldBottom", "foldLeft", "roll", "rollTop", "rollRight", "rollBottom", "rollLeft"]
                            }

                            function et_remove_animation($element) {
                                var animation_classes = et_get_animation_classes();
                                $element.removeClass(animation_classes.join(" ")), $element.removeAttr("style")
                            }

                            function et_reinit_waypoint_modules(dmpRef) {
                                initETContactForm();
                                var n = $,
                                    o = "function" == typeof Symbol && "symbol" == n(Symbol.iterator) ? function(t) {
                                        return n(t)
                                    } : function(t) {
                                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : n(t)
                                    },
                                    a = "object" === o(window.ET_Builder),
                                    t = n(dmpRef + ".et_pb_circle_counter"),
                                    e = n(dmpRef + ".et_pb_number_counter"),
                                    i = n(dmpRef + ".et_pb_section_video_bg video");
                                if (n.fn.waypoint && window.et_pb_custom && "yes" !== window.et_pb_custom.ignore_waypoints && !a) {
                                    gt(!0), n(".et-waypoint").each(function() {
                                        ht(n(this), {
                                            offset: vt(n(this), "100%"),
                                            handler: function() {
                                                n(this.element).addClass("et-animated")
                                            }
                                        }, 2)
                                    }), t.length && t.each(function() {
                                        var t = n(this).find(".et_pb_circle_counter_inner");
                                        t.is(":visible") && !bt(t) && ht(t, {
                                            offset: vt(n(this), "100%"),
                                            handler: function() {
                                                t.data("PieChartHasLoaded") || void 0 === t.data("easyPieChart") || r || (t.data("easyPieChart").update(t.data("number-value")), t.data("PieChartHasLoaded", !0))
                                            }
                                        }, 2)
                                    }), e.length && e.each(function() {
                                        var t = n(this);
                                        bt(t) || ht(t, {
                                            offset: vt(n(this), "100%"),
                                            handler: function() {
                                                t.data("easyPieChart").update(t.data("number-value"))
                                            }
                                        })
                                    }), a || n.each(et_pb_custom.ab_tests, function(t, e) {
                                        var r = jt(e.post_id);
                                        if (0 === r.length) {
                                            return !0
                                        }
                                        ht(r, {
                                            offset: vt(n(this), "80%"),
                                            handler: function() {
                                                !Z[e.post_id].read_goal && r.length && r.visible(!0) && (setTimeout(function() {
                                                    r.length && r.visible(!0) && !Z[e.post_id].read_goal && Ct("read_goal", e.post_id, void 0, e.test_id)
                                                }, 3e3), xt(r, "view_goal"))
                                            }
                                        })
                                    })
                                } else {
                                    gt(!1);
                                    var o = a ? "et-animated--vb" : "et-animated";
                                    n(".et-waypoint").addClass(o), n(".et-waypoint").each(function() {
                                        mt(n(this))
                                    }), t.length && t.each(function() {
                                        var t = n(this).find(".et_pb_circle_counter_inner");
                                        t.is(":visible") && (t.data("PieChartHasLoaded") || void 0 === t.data("easyPieChart") || (t.data("easyPieChart").update(t.data("number-value")), t.data("PieChartHasLoaded", !0)))
                                    }), e.length && e.each(function() {
                                        var t = n(this);
                                        t.data("easyPieChart").update(t.data("number-value"))
                                    }), n.each(et_pb_custom.ab_tests, function(t, e) {
                                        var n = jt(e.post_id);
                                        return (0 === n.length || !(!Z[e.post_id].read_goal && n.length && n.visible(!0)) || (setTimeout(function() {
                                            n.length && n.visible(!0) && !Z[e.post_id].read_goal && Ct("read_goal", e.post_id, void 0, e.test_id)
                                        }, 3e3), void xt(n, "view_goal")))
                                    })
                                }
                                i.length && i.each(function() {
                                    var t = n(this);
                                    et_pb_video_background_init(t, this)
                                })
                            }

                            function initETContactForm() {
                                let n = $,
                                    tippyRef = '.tippy-popper ',
                                    lt = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                                    dt = n(tippyRef + ".et_pb_contact_form_container"),
                                    gt = document.body.innerHTML.match(/<script [^>]*src="[^"].*google.com\/recaptcha\/api.js\?.*render.*"[^>]*>([\s\S]*?)<\/script>/gim),
                                    wt = n("#et-recaptcha-v3-js"),
                                    yt = gt && gt.length > wt.length,
                                    at;
                                if (n(".et_pb_module.et_pb_recaptcha_enabled").length > 0 && typeof etCore !== 'undefined' && etCore.api.spam.recaptcha.isEnabled()) {
                                    at = etCore.api.spam.recaptcha;
                                    n("body").addClass("et_pb_recaptcha_enabled")
                                }
                                if (dt.length) {
                                    dt.each(function() {
                                        var t = n(this),
                                            e = t.find("form"),
                                            i = void 0 !== t.data("redirect_url") ? t.data("redirect_url") : "";
                                        e.find("input[type=checkbox]").on("change", (function() {
                                            var t = n(this),
                                                e = t.siblings("input[type=text]").first(),
                                                i = t.prop("checked");
                                            e.val(i ? e.data("checked") : e.data("unchecked"))
                                        })), e.on("submit", (function(e) {
                                            e.preventDefault();
                                            var a = n(this);
                                            if (!0 !== a.data("submitted")) {
                                                var o = a.find('input[type=text], .et_pb_checkbox_handle, .et_pb_contact_field[data-type="radio"], textarea, select'),
                                                    r = a.find(".et_pb_contact_captcha"),
                                                    s = t.find(".et-pb-contact-message"),
                                                    c = void 0 !== t.data("form_unique_num") ? t.data("form_unique_num") : 0,
                                                    l = !1,
                                                    _ = "",
                                                    d = "",
                                                    p = [],
                                                    u = [],
                                                    h = n.Deferred();
                                                at && t.hasClass("et_pb_recaptcha_enabled") ? at.interaction("Divi/Module/ContactForm/".concat(c)).then((function(t) {
                                                    h.resolve(t)
                                                })) : h.resolve(""), n.when(h).done((function(e) {
                                                    if (_ = "<ul>", o.removeClass("et_contact_error"), o.each((function() {
                                                            var t = n(this),
                                                                e = !1;
                                                            "checkbox" === t.data("field_type") && (e = t.parents(".et_pb_contact_field")).removeClass("et_contact_error"), "radio" === t.data("type") && (e = (t = t.find('input[type="radio"]')).parents(".et_pb_contact_field"));
                                                            var i, a = t.attr("id"),
                                                                o = t.val(),
                                                                r = t.siblings("label").first().text(),
                                                                s = void 0 !== t.data("field_type") ? t.data("field_type") : "text",
                                                                c = void 0 !== t.data("required_mark") ? t.data("required_mark") : "not_required",
                                                                f = void 0 !== t.data("original_id") ? t.data("original_id") : "",
                                                                h = !1;
                                                            if ("radio" === s) {
                                                                if (0 !== e.find('input[type="radio"]').length) {
                                                                    s = "radio";
                                                                    var b = e.find('input[type="radio"]').first();
                                                                    c = void 0 !== b.data("required_mark") ? b.data("required_mark") : "not_required", o = "", e.find('input[type="radio"]:checked') && (o = e.find('input[type="radio"]:checked').val())
                                                                }
                                                                r = e.find(".et_pb_contact_form_label").text(), a = e.find('input[type="radio"]').first().attr("name"), f = e.attr("data-id"), 0 === e.find('input[type="radio"]:checked').length && (h = !0)
                                                            }
                                                            if ("checkbox" === s) {
                                                                if (o = "", 0 !== e.find('input[type="checkbox"]').length) {
                                                                    s = "checkbox";
                                                                    var v = e.find(".et_pb_checkbox_handle");
                                                                    c = void 0 !== v.data("required_mark") ? v.data("required_mark") : "not_required", e.find('input[type="checked"]:checked') && (o = [], e.find('input[type="checkbox"]:checked').each((function() {
                                                                        o.push(n(this).val())
                                                                    })), o = o.join(", "))
                                                                }
                                                                if (e.find(".et_pb_checkbox_handle").val(o), 0 === (r = e.find(".et_pb_contact_form_label").text()).trim().length) {
                                                                    var m = e.find('.et_pb_contact_field_checkbox input[type="checkbox"]');
                                                                    if (m.length > 0) {
                                                                        var g = [];
                                                                        m.each((function() {
                                                                            g.push(n(this).val())
                                                                        })), 0 === (r = g.join(", ")).trim().length && (r = et_pb_custom.wrong_checkbox)
                                                                    }
                                                                }
                                                                a = e.find(".et_pb_checkbox_handle").attr("name"), f = e.attr("data-id"), 0 === e.find('input[type="checkbox"]:checked').length && (h = !0)
                                                            }
                                                            if (r = r.replace(/"/g, "&quot;"), t.is(":visible") || !t.parents("[data-conditional-logic]").length || "hidden" === t.attr("type") || "radio" === t.attr("type")) {
                                                                if ("hidden" !== t.attr("type") && "radio" !== t.attr("type") || t.parents(".et_pb_contact_field").is(":visible")) {
                                                                    if (void 0 !== a && p.push({
                                                                            field_id: a,
                                                                            original_id: f,
                                                                            required_mark: c,
                                                                            field_type: s,
                                                                            field_label: r
                                                                        }), "required" !== c || "" !== o && !0 !== h || t.is('[id^="et_pb_contact_et_number_"]') || (!1 === e ? t.addClass("et_contact_error") : e.addClass("et_contact_error"), l = !0, "" === (i = r) && (i = et_pb_custom.captcha), d += "<li>".concat(i, "</li>")), "email" === s) {
                                                                        var w = o.trim().toLowerCase(),
                                                                            y = function(t) {
                                                                                if (6 > t.length) {
                                                                                    return !1
                                                                                }
                                                                                if (!1 === function(t, e, n) {
                                                                                        var i = (t + "").indexOf("@", 1);
                                                                                        return -1 !== i && i
                                                                                    }(t)) {
                                                                                    return !1
                                                                                }
                                                                                var e = t.split("@", 2),
                                                                                    n = e[0],
                                                                                    i = e[1];
                                                                                if (!/^[a-zA-Z0-9!#$%&\'*+\/=?^_`{|}~\.-]+$/.test(n)) {
                                                                                    return !1
                                                                                }
                                                                                if (/\.{2,}/.test(i)) {
                                                                                    return !1
                                                                                }
                                                                                if (s(i, " \t\n\r\0\v.") !== i) {
                                                                                    return !1
                                                                                }
                                                                                var a = i.split(".");
                                                                                if (2 > a.length) {
                                                                                    return !1
                                                                                }
                                                                                for (var o in a) {
                                                                                    var r = a[o];
                                                                                    if (s(r, " \t\n\r\0\v-") !== r) {
                                                                                        return !1
                                                                                    }
                                                                                    if (!/^[a-z0-9-]+$/i.test(r)) {
                                                                                        return !1
                                                                                    }
                                                                                }
                                                                                return !0;

                                                                                function s(t, e) {
                                                                                    var n = [" ", "\n", "\r", "\t", "\f", "\v", "\xa0", "\u2000", "\u2001", "\u2002", "\u2003", "\u2004", "\u2005", "\u2006", "\u2007", "\u2008", "\u2009", "\u200a", "\u200b", "\u2028", "\u2029", "\u3000"].join(""),
                                                                                        i = 0,
                                                                                        a = 0;
                                                                                    for (t += "", e && (n = (e + "").replace(/([[\]().?/*{}+$^:])/g, "$1")), i = t.length, a = 0; a < i; a += 1) {
                                                                                        if (-1 === n.indexOf(t.charAt(a))) {
                                                                                            t = t.substring(a);
                                                                                            break
                                                                                        }
                                                                                    }
                                                                                    for (a = (i = t.length) - 1; a >= 0; a -= 1) {
                                                                                        if (-1 === n.indexOf(t.charAt(a))) {
                                                                                            t = t.substring(0, a + 1);
                                                                                            break
                                                                                        }
                                                                                    }
                                                                                    return -1 === n.indexOf(t.charAt(0)) ? t : ""
                                                                                }
                                                                            }(w);
                                                                        "" === w || r === w || y || (t.addClass("et_contact_error"), l = !0, y || (_ += "<li>".concat(et_pb_custom.invalid, "</li>")))
                                                                    }
                                                                } else {
                                                                    u.push(f)
                                                                }
                                                            } else {
                                                                u.push(f)
                                                            }
                                                        })), r.length && "" !== r.val()) {
                                                        var h = parseInt(r.data("first_digit")),
                                                            b = parseInt(r.data("second_digit"));
                                                        parseInt(r.val()) !== h + b && (_ += "<li>".concat(et_pb_custom.wrong_captcha, "</li>"), l = !0, h = Math.floor(15 * Math.random() + 1), b = Math.floor(15 * Math.random() + 1), r.data("first_digit", h), r.data("second_digit", b), r.val(""), a.find(".et_pb_contact_captcha_question").empty().append("".concat(h, " + ").concat(b)))
                                                    }
                                                    if (!l) {
                                                        a.data("submitted", !0);
                                                        var v = a.attr("action"),
                                                            m = a.serializeArray();
                                                        m.push({
                                                            name: "et_pb_contact_email_fields_".concat(c),
                                                            value: JSON.stringify(p)
                                                        }), m.push({
                                                            name: "token",
                                                            value: e
                                                        }), u.length > 0 && m.push({
                                                            name: "et_pb_contact_email_hidden_fields_".concat(c),
                                                            value: JSON.stringify(u)
                                                        }), t.removeClass("et_animated").removeAttr("style").fadeTo("fast", .2, (function() {
                                                            t.load("".concat(v, " #").concat(t.attr("id"), "> *"), m, (function(e, a) {
                                                                if ("error" === a) {
                                                                    var o = n("#".concat(t.attr("id")), e);
                                                                    o.length > 0 && t.html(o)
                                                                }
                                                                n(e).find(".et_pb_contact_error_text").length || (xt(t, "con_goal"), "" !== i && (window.location.href = i)), t.fadeTo("fast", 1)
                                                            }))
                                                        }))
                                                    }
                                                    _ += "</ul>", "" !== d && ("<ul></ul>" !== _ && (_ = '<p class="et_normal_padding">'.concat(et_pb_custom.contact_error_message, "</p>").concat(_)), d = "<ul>".concat(d, "</ul>"), d = "<p>".concat(et_pb_custom.fill_message, "</p>").concat(d), _ = d + _), "<ul></ul>" !== _ && (s.html(_), t.parents(".et_pb_section_parallax").length && t.parents(".et_pb_section_parallax").each((function() {
                                                        !n(this).children(".et_parallax_bg").hasClass("et_pb_parallax_css") && f.trigger("resize")
                                                    })))
                                                }))
                                            }
                                        }))
                                    })
                                }
                            }

                            function xt(t, e, n) {
                                var r = (function(t) {
                                        var e = t.attr("class"),
                                            n = parseInt(e.replace(/^.*et_pb_ab_goal_id-(\d+).*$/, "$1"));
                                        return isNaN(n) ? 0 : n
                                    })(t),
                                    i = void 0 === e ? "con_goal" : e;
                                t.hasClass("et_pb_ab_goal") && !K[r][i] ? Ct(i, r) : void 0 !== n && n()
                            }

                            function ht(t, e, n) {
                                n = n || t.data("et_waypoint_max_instances") || 1;
                                var r = t.data("et_waypoint") || [];
                                if (r.length < n) {
                                    var i = t.waypoint(e);
                                    i && i.length > 0 && (r.push(i[0]), t.data("et_waypoint", r))
                                } else {
                                    for (var o = 0; o < r.length; o += 1) {
                                        r[o].context.refresh()
                                    }
                                }
                            }

                            function vt(t, e) {
                                var n = $,
                                    r = t.parents(".et_pb_section").index(),
                                    i = n(".et_pb_section").length - 1,
                                    o = t.parents(".et_pb_row").index(),
                                    a = t.parents(".et_pb_section").children().length - 1;
                                return r === i && o === a ? "bottom-in-view" : e
                            }

                            function mt(t) {
                                var e = t,
                                    n = $;
                                if (!e.hasClass("et_had_animation")) {
                                    var r = e.attr("data-animation-style"),
                                        i = e.attr("data-animation-repeat"),
                                        o = e.attr("data-animation-duration"),
                                        a = e.attr("data-animation-delay"),
                                        s = e.attr("data-animation-intensity"),
                                        c = e.attr("data-animation-starting-opacity"),
                                        u = e.attr("data-animation-speed-curve"),
                                        l = e.parent(".et_pb_button_module_wrapper"),
                                        d = n("body").hasClass("edge");
                                    e.is(".et_pb_section") && "roll" === r && n(et_frontend_scripts.builderCssContainerPrefix + ", " + et_frontend_scripts.builderCssLayoutPrefix).css("overflow-x", "hidden"), (function(t) {
                                        for (var e = [], r = t.get(0).attributes, i = 0; i < r.length; i += 1) {
                                            "data-animation-" === r[i].name.substring(0, 15) && e.push(r[i].name)
                                        }
                                        n.each(e, function(e, n) {
                                            t.removeAttr(n)
                                        })
                                    })(e);
                                    var f = isNaN(parseInt(c)) ? 0 : 0.01 * parseInt(c); - 1 === n.inArray(u, ["linear", "ease", "ease-in", "ease-out", "ease-in-out"]) && (u = "ease-in-out"), l.length > 0 && (e.removeClass("et_animated"), (e = l).addClass("et_animated")), e.css({
                                        "animation-duration": o,
                                        "animation-delay": a,
                                        opacity: f,
                                        "animation-timing-function": u
                                    }), ("slideTop" !== r && "slideBottom" !== r) || e.css("left", 0);
                                    for (var p = {}, _ = isNaN(parseInt(s)) ? 50 : parseInt(s), h = ["slide", "zoom", "flip", "fold", "roll"], v = !1, m = !1, g = 0; g < h.length; g += 1) {
                                        var b = h[g];
                                        if (r && r.substr(0, b.length) === b) {
                                            (v = b), "" !== (m = r.substr(b.length, r.length)) && (m = m.toLowerCase());
                                            break
                                        }
                                    }
                                    if ((!1 !== v && !1 !== m && (p = (function(t, e, n) {
                                            var r = {};
                                            switch (t) {
                                                case "slide":
                                                    switch (e) {
                                                        case "top":
                                                            r = {
                                                                transform: "translate3d(0, " + -2 * n + "%, 0)"
                                                            };
                                                            break;
                                                        case "right":
                                                            r = {
                                                                transform: "translate3d(" + 2 * n + "%, 0, 0)"
                                                            };
                                                            break;
                                                        case "bottom":
                                                            r = {
                                                                transform: "translate3d(0, " + 2 * n + "%, 0)"
                                                            };
                                                            break;
                                                        case "left":
                                                            r = {
                                                                transform: "translate3d(" + -2 * n + "%, 0, 0)"
                                                            };
                                                            break;
                                                        default:
                                                            r = {
                                                                transform: "scale3d(" + (i = 0.01 * (100 - n)) + ", " + i + ", " + i + ")"
                                                            }
                                                    }
                                                    break;
                                                case "zoom":
                                                    var i = 0.01 * (100 - n);
                                                    switch (e) {
                                                        case "top":
                                                        case "right":
                                                        case "bottom":
                                                        case "left":
                                                        default:
                                                            r = {
                                                                transform: "scale3d(" + i + ", " + i + ", " + i + ")"
                                                            }
                                                    }
                                                    break;
                                                case "flip":
                                                    switch (e) {
                                                        case "right":
                                                            r = {
                                                                transform: "perspective(2000px) rotateY(" + Math.ceil(0.9 * n) + "deg)"
                                                            };
                                                            break;
                                                        case "left":
                                                            r = {
                                                                transform: "perspective(2000px) rotateY(" + -1 * Math.ceil(0.9 * n) + "deg)"
                                                            };
                                                            break;
                                                        case "top":
                                                        default:
                                                            r = {
                                                                transform: "perspective(2000px) rotateX(" + Math.ceil(0.9 * n) + "deg)"
                                                            };
                                                            break;
                                                        case "bottom":
                                                            r = {
                                                                transform: "perspective(2000px) rotateX(" + -1 * Math.ceil(0.9 * n) + "deg)"
                                                            }
                                                    }
                                                    break;
                                                case "fold":
                                                    switch (e) {
                                                        case "top":
                                                            r = {
                                                                transform: "perspective(2000px) rotateX(" + -1 * Math.ceil(0.9 * n) + "deg)"
                                                            };
                                                            break;
                                                        case "bottom":
                                                            r = {
                                                                transform: "perspective(2000px) rotateX(" + Math.ceil(0.9 * n) + "deg)"
                                                            };
                                                            break;
                                                        case "left":
                                                            r = {
                                                                transform: "perspective(2000px) rotateY(" + Math.ceil(0.9 * n) + "deg)"
                                                            };
                                                            break;
                                                        case "right":
                                                        default:
                                                            r = {
                                                                transform: "perspective(2000px) rotateY(" + -1 * Math.ceil(0.9 * n) + "deg)"
                                                            }
                                                    }
                                                    break;
                                                case "roll":
                                                    switch (e) {
                                                        case "right":
                                                        case "bottom":
                                                            r = {
                                                                transform: "rotateZ(" + -1 * Math.ceil(3.6 * n) + "deg)"
                                                            };
                                                            break;
                                                        case "top":
                                                        case "left":
                                                        default:
                                                            r = {
                                                                transform: "rotateZ(" + Math.ceil(3.6 * n) + "deg)"
                                                            }
                                                    }
                                            }
                                            return r
                                        })(v, m, _)), n.isEmptyObject(p) || e.css(d ? n.extend(p, {
                                            transition: "transform 0s ease-in"
                                        }) : p), e.addClass("et_animated"), e.addClass(r), e.addClass(i), !i)) {
                                        var w = parseInt(o),
                                            y = parseInt(a);
                                        setTimeout(function() {
                                            wt(e)
                                        }, w + y), d && !n.isEmptyObject(p) && setTimeout(function() {
                                            e.css("transition", "")
                                        }, w + y + 50)
                                    }
                                }
                            }

                            function gt(t) {
                                if ("undefined" != typeof et_animation_data && et_animation_data.length > 0) {
                                    var n = $,
                                        X = '';
                                    n("body").css("overflow-x", "hidden"), n("#page-container").css("overflow-y", "hidden");
                                    for (var e = 0; e < et_animation_data.length; e += 1) {
                                        var r = et_animation_data[e];
                                        if (r.class && r.style && r.repeat && r.duration && r.delay && r.intensity && r.starting_opacity && r.speed_curve) {
                                            var i = n(".tippy-popper ." + r.class),
                                                o = Ot(),
                                                a = "desktop" === o;
                                            X = o;
                                            var s = "";
                                            a || (s += "_" + o);
                                            var c = a || void 0 === r["style" + s] ? r.style : r["style" + s],
                                                u = a || void 0 === r["repeat" + s] ? r.repeat : r["repeat" + s],
                                                l = a || void 0 === r["duration" + s] ? r.duration : r["duration" + s],
                                                d = a || void 0 === r["delay" + s] ? r.delay : r["delay" + s],
                                                f = a || void 0 === r["intensity" + s] ? r.intensity : r["intensity" + s],
                                                p = a || void 0 === r["starting_opacity" + s] ? r.starting_opacity : r["starting_opacity" + s],
                                                _ = a || void 0 === r["speed_curve" + s] ? r.speed_curve : r["speed_curve" + s];
                                            i.attr({
                                                "data-animation-style": c,
                                                "data-animation-repeat": "once" === u ? "" : "infinite",
                                                "data-animation-duration": l,
                                                "data-animation-delay": d,
                                                "data-animation-intensity": f,
                                                "data-animation-starting-opacity": p,
                                                "data-animation-speed-curve": _
                                            }), !0 === t ? i.hasClass("et_pb_circle_counter") ? (ht(i, {
                                                offset: "100%",
                                                handler: function() {
                                                    var t = n(this.element).find(".et_pb_circle_counter_inner");
                                                    t.data("PieChartHasLoaded") || void 0 === t.data("easyPieChart") || (t.data("easyPieChart").update(t.data("number-value")), t.data("PieChartHasLoaded", !0), mt(n(this.element)))
                                                }
                                            }), ht(i, {
                                                offset: "bottom-in-view",
                                                handler: function() {
                                                    var t = n(this.element).find(".et_pb_circle_counter_inner");
                                                    t.data("PieChartHasLoaded") || void 0 === t.data("easyPieChart") || (t.data("easyPieChart").update(t.data("number-value")), t.data("PieChartHasLoaded", !0), mt(n(this.element)))
                                                }
                                            })) : i.hasClass("et_pb_number_counter") ? (ht(i, {
                                                offset: "100%",
                                                handler: function() {
                                                    n(this.element).data("easyPieChart").update(n(this.element).data("number-value")), mt(n(this.element))
                                                }
                                            }), ht(i, {
                                                offset: "bottom-in-view",
                                                handler: function() {
                                                    n(this.element).data("easyPieChart").update(n(this.element).data("number-value")), mt(n(this.element))
                                                }
                                            })) : ht(i, {
                                                offset: "100%",
                                                handler: function() {
                                                    mt(n(this.element))
                                                }
                                            }) : mt(i)
                                        }
                                    }
                                }
                            }

                            function bt(t) {
                                var e = !1;
                                if ("undefined" != typeof et_animation_data && et_animation_data.length > 0) {
                                    for (var n = 0; n < et_animation_data.length; n += 1) {
                                        var r = et_animation_data[n];
                                        if (r.class && t.hasClass(r.class)) {
                                            e = !0;
                                            break
                                        }
                                    }
                                }
                                return e
                            }

                            function wt(t) {
                                if (!t.hasClass("infinite")) {
                                    t.is(".et_pb_section") && t.is(".roll") && n(et_frontend_scripts.builderCssContainerPrefix + ", " + et_frontend_scripts.builderCssLayoutPrefix).css("overflow-x", ""), t.removeClass(["et_animated", "infinite", "et-waypoint", "fade", "fadeTop", "fadeRight", "fadeBottom", "fadeLeft", "slide", "slideTop", "slideRight", "slideBottom", "slideLeft", "bounce", "bounceTop", "bounceRight", "bounceBottom", "bounceLeft", "zoom", "zoomTop", "zoomRight", "zoomBottom", "zoomLeft", "flip", "flipTop", "flipRight", "flipBottom", "flipLeft", "fold", "foldTop", "foldRight", "foldBottom", "foldLeft", "roll", "rollTop", "rollRight", "rollBottom", "rollLeft", "transformAnim"].join(" ")), t.css({
                                        "animation-delay": "",
                                        "animation-duration": "",
                                        "animation-timing-function": "",
                                        opacity: "",
                                        transform: "",
                                        left: ""
                                    }), t.addClass("et_had_animation")
                                }
                            }

                            function Ot() {
                                var c = $(window),
                                    t = c.width(),
                                    e = "desktop";
                                return t <= 980 && t > 479 ? (e = "tablet") : t <= 479 && (e = "phone"), e
                            }

                            function resetDiviAnimations(dmpRef) {
                                $(dmpRef + ' .et_pb_section.et_animated').each(function() {
                                    var e = $(this);
                                    e.removeClass('et_animated')
                                });
                                return;
                                $(dmpRef + ' .et_had_animation').each(function() {
                                    var e = $(this),
                                        c = e.attr("data-animation-starting-opacity"),
                                        f = isNaN(parseInt(c)) ? 0 : 0.01 * parseInt(c);
                                    e.css('opacity', f);
                                    e.removeClass('et_had_animation')
                                })
                            }

                            function setContainerWidth(divimegapro_container, options) {
                                let divimegaproBodyWidth;
                                divimegaproBodyWidth = dmpGetContainerWidth(options);
                                divimegapro_container.css('width', divimegaproBodyWidth)
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

                            function toggleSrcInPlayableTags(str) {
                                str.find("iframe").each(function() {
                                    var src = $(this).data('src');
                                    $(this).attr('src', src)
                                });
                                return str
                            }

                            function getActiveDiviMegaPro() {
                                var divimegapro = null,
                                    divimegapro_id = null,
                                    elemID = null,
                                    placement = null;
                                divimegapro = $('body').find('.divimegapro.open');
                                if (!divimegapro) {
                                    divimegapro = $('body').find('.divimegapro.close')
                                }
                                if (divimegapro.length) {
                                    var divimegaproArr = divimegapro.attr('id').split('-'),
                                        divimegapro_id = divimegaproArr[1]
                                }
                                return divimegapro_id
                            }

                            function removeMonarch() {
                                if ($('.divimegapro .et_social_inline').length) {
                                    $('.divimegapro .et_social_inline').parents('.et_pb_row').remove()
                                }
                                removeMonarchTimer = setTimeout(removeMonarch, 500)
                            }

                            function escapeRegExp(string) {
                                return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            }

                            function isDiviMobile() {
                                diviMobile = false;
                                if ($('body').hasClass('et_mobile_device')) {
                                    diviMobile = true
                                }
                                return diviMobile
                            }

                            function isIphone() {
                                isIphone = false;
                                if ($('body').hasClass('iphone')) {
                                    isIphone = true
                                }
                                return isIphone
                            }
                        }
                        var checkCursorOverDiviTabTimer = 0,
                            checkDiviTabElem;

                        function enableDiviURLLinkModules(parent) {
                            var e = $;
                            "undefined" != typeof et_link_options_data && et_link_options_data.length > 0 && e.each(et_link_options_data, function(t, n) {
                                if (n.class && n.url && n.target) {
                                    var r = e(parent + " ." + n.class);
                                    r.off("click"), r.on("click", function(t) {
                                        if ((t.target !== t.currentTarget && !et_is_click_exception(e(t.target))) || t.target === t.currentTarget) {
                                            t.stopPropagation();
                                            var r = n.url;
                                            if (((r = (r = r.replace(/&#91;/g, "[")).replace(/&#93;/g, "]")), "_blank" === n.target)) {
                                                return void window.open(r)
                                            }
                                            if ("#product_reviews_tab" === r) {
                                                var i = e(".reviews_tab a");
                                                i.length > 0 && (i.trigger("click"), et_pb_smooth_scroll(i, void 0, 800), history.pushState(null, "", r))
                                            } else {
                                                r && "#" === r[0] && e(r).length ? (et_pb_smooth_scroll(e(r), void 0, 800), history.pushState(null, "", r)) : (window.location = r)
                                            }
                                        }
                                    }), r.on("click", "a, button", function(t) {
                                        et_is_click_exception(e(this)) || t.stopPropagation()
                                    })
                                }
                            })
                        }

                        function et_is_click_exception($element) {
                            for (var is_exception = !1, click_exceptions = [".et_pb_toggle_title", ".mejs-container *", ".et_pb_contact_field input", ".et_pb_contact_field textarea", ".et_pb_contact_field_checkbox *", ".et_pb_contact_field_radio *", ".et_pb_contact_captcha", ".et_pb_tabs_controls a", ".flex-control-nav *", ".et_pb_menu__search-button", ".et_pb_menu__close-search-button", ".et_pb_menu__search-container *", ".et_pb_fullwidth_header_scroll *"], r = 0; r < click_exceptions.length; r += 1) {
                                if ($element.is(click_exceptions[r])) {
                                    is_exception = !0;
                                    break
                                }
                            }
                            return is_exception
                        }

                        function enableDiviToggleHover(parent) {
                            if (typeof parent === 'undefined') {
                                var parent = ''
                            }
                            $(parent + '.et_pb_toggle').on('mouseenter', function(e) {
                                $(this).children('.et_pb_toggle_title').trigger("click")
                            })
                        }

                        function enableDiviTabHover(parent) {
                            if (typeof parent === 'undefined') {
                                var parent = ''
                            }
                            $(parent + ' .et_pb_tabs .et_pb_tabs_controls > [class^="et_pb_tab_"]').on('mouseenter', function(e) {
                                if (!$(this).hasClass('et_pb_tab_active')) {
                                    checkDiviTabElem = $(this)
                                } else {
                                    checkDiviTabElem = false
                                }
                                if (checkDiviTabElem !== false) {
                                    checkDiviTab()
                                }
                            })
                        }

                        function checkDiviTab() {
                            var clickTrigger = false;
                            if (checkDiviTabElem !== false && checkDiviTabElem.is(':hover')) {
                                if (checkDiviTabElem) {
                                    if (!checkDiviTabElem.hasClass('et_pb_tab_active')) {
                                        clearTimeout(checkCursorOverDiviTabTimer);
                                        checkDiviTabElem.find('a').trigger("click")
                                    }
                                    if (checkDiviTabElem.hasClass('et_pb_tab_active')) {
                                        clickTrigger = true
                                    }
                                }
                                if (clickTrigger === false) {
                                    checkCursorOverDiviTabTimer = setTimeout(checkDiviTab, 150)
                                }
                            } else {
                                clearTimeout(checkCursorOverDiviTabTimer)
                            }
                        }

                        function callDiviLifeFuncs(parent) {
                            removeMobileMenuDuplicates();
                            enableDiviURLLinkModules(parent);
                            if (typeof diviTabsToggleHover !== 'undefined') {
                                if (diviTabsToggleHover === true) {
                                    enableDiviTabHover(parent);
                                    enableDiviToggleHover(parent)
                                }
                            }
                        }

                        function removeMobileMenuDuplicates() {
                            var mobile_menu_selector = $('.et_pb_menu__wrap .et_mobile_menu').filter(":hidden");
                            $(mobile_menu_selector).each(function() {
                                $('[id="' + this.id + '"]:gt(0)').remove()
                            })
                        }

                        function fixMobileMenuAfterDiviInit() {
                            let viewportWidth = $(window).width();
                            if (viewportWidth >= themesBreakpoint['Extra']) {
                                $(".et-menu-nav ul.nav").each(function(t) {
                                    et_duplicate_menu($(this), $(this).closest(".et_pb_module").find("div .mobile_nav"), "mobile_menu" + (t + 1), "et_mobile_menu")
                                })
                            }
                        }

                        function clickOffMobileLinkswithHashtagOnly() {
                            let $et_pb_menu = $(".mobile_nav").filter(":visible");
                            $et_pb_menu.length > 0 && $et_pb_menu.each((function(t) {
                                let s = $(this),
                                    link = s.find("a[data-divimegaproid]");
                                link.each((function() {
                                    let href = $(this).attr('href');
                                    if (href !== undefined) {
                                        let hash = href[0];
                                        if (hash == '#' && href.length > 1) {
                                            let refTippyInstance = $(this)._tippy;
                                            if (typeof refTippyInstance === 'undefined') {
                                                $(this).off("click")
                                            }
                                        }
                                    }
                                }))
                            }))
                        }
                        if (typeof diviTabsToggleHoverGlobal !== 'undefined') {
                            if (diviTabsToggleHoverGlobal === true) {
                                callDiviLifeFuncs()
                            }
                        }

                        function updateDiviIframes(selector) {
                            var $dibiframes = $(selector + ' iframe'),
                                ratio = 1;
                            setTimeout(function() {
                                $dibiframes.each(function() {
                                    ratio = $(this).attr("data-ratio");
                                    if (ratio === undefined) {
                                        var iframeHeight = this.height;
                                        if (iframeHeight == '') {
                                            iframeHeight = $(this).height()
                                        }
                                        var iframeWidth = this.width;
                                        if (iframeWidth == '') {
                                            iframeWidth = $(this).width()
                                        }
                                        iframeHeight = parseInt(iframeHeight);
                                        iframeWidth = parseInt(iframeWidth);
                                        ratio = iframeHeight / iframeWidth;
                                        $(this).attr("data-ratio", ratio)
                                    } else {
                                        ratio = $(this).attr('data-ratio')
                                    }
                                    $(this).removeAttr("width").removeAttr("height");
                                    var width = $(this).parent().width();
                                    $(this).width(width).height(width * ratio)
                                })
                            }, 50)
                        }
                    };

                    function dmpGetOptions(divimegapro_id) {
                        let dmmdataObject = divimegapros[divimegapro_id]['options'],
                            options = [];
                        if (dmmdataObject === null) {
                            return null
                        }
                        options['animation'] = dmmdataObject['animation'];
                        options['triggertype'] = 'mouseenter focus';
                        if (dmmdataObject['triggertype'] == 'click') {
                            options['triggertype'] = 'mousedown focus'
                        }
                        options['placement'] = dmmdataObject['placement'];
                        options['distance'] = parseInt(dmmdataObject['margintopbottom']);
                        if (!dmpIsInt(options['distance'])) {
                            options['distance'] = 0
                        }
                        if (dmmdataObject['megaprowidth'] === 'custom') {
                            options['megaprowidth'] = dmmdataObject['megaprowidthcustom']
                        } else {
                            options['megaprowidth'] = dmmdataObject['megaprowidth'] + '%'
                        }
                        options['megaprofixedheight'] = parseInt(dmmdataObject['megaprofixedheight']);
                        if (!dmpIsInt(options['megaprofixedheight'])) {
                            options['megaprofixedheight'] = 0
                        }
                        options['position'] = dmmdataObject['dmp_cssposition'];
                        if (dmmdataObject['exittype'] == 'click') {
                            options['exittype'] = 'click'
                        } else {
                            options['exittype'] = 'hover'
                        }
                        if (dmmdataObject['exitdelay'] != 0 && dmmdataObject['exitdelay'] != '' && options['exittype'] == 'hover' && dmmdataObject['exitdelay'] > 0) {
                            options['delay'] = dmmdataObject['exitdelay'] * 1000
                        } else {
                            options['delay'] = 0.1
                        }
                        options['arrowEnabled'] = false;
                        if (dmmdataObject['enable_arrow'] == 1) {
                            options['arrowEnabled'] = true
                        }
                        options['centerHorizontal'] = false;
                        if (dmmdataObject['dmp_enablecenterhorizontal'] == 1) {
                            options['centerHorizontal'] = true
                        }
                        options['arrowType'] = dmmdataObject['arrowfeature_type'];
                        options['bgcolor'] = dmmdataObject['bgcolor'];
                        options['fontcolor'] = dmmdataObject['fontcolor'];
                        return options
                    }

                    function dmpGetContainerWidth(options) {
                        let megaprowidth = options['megaprowidth'] + '',
                            divimegaproBodyWidth;
                        const viewportWidth = $(window).width();
                        const customWidthInt = parseInt(megaprowidth);
                        const customWidthUnit = megaprowidth.replace(/[0-9]/g, '');
                        if (customWidthUnit == '') {
                            divimegaproBodyWidth = customWidthInt + 'px'
                        } else {
                            divimegaproBodyWidth = customWidthInt + customWidthUnit
                        }
                        if (customWidthInt > viewportWidth && customWidthUnit == 'px') {
                            divimegaproBodyWidth = viewportWidth + 'px'
                        };
                        if (customWidthUnit === '%') {
                            divimegaproBodyWidth = Math.round(((customWidthInt / 100) * viewportWidth)) + 'px'
                        }
                        if (megaprowidth == '100%') {
                            divimegaproBodyWidth = viewportWidth + 'px'
                        }
                        return divimegaproBodyWidth
                    }

                    function dmpIsInt(value) {
                        var x;
                        return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x)
                    }

                    function dmpRemoveDiviFix(divimegapro_selector) {
                        var divimegapro = $(divimegapro_selector),
                            et_pb_section_first = divimegapro.find('.et_pb_section_first');
                        et_pb_section_first.removeAttr('style');
                        et_pb_section_first.data('fix-page-container', 'off')
                    }

                    function deflectFocusControl(instance, wasFocusOnCloseBtn) {
                        if ($('.et_mobile_menu').is(':hidden') === false) {
                            return false
                        }
                        if (typeof wasFocusOnCloseBtn === 'undefined') {
                            var wasFocusOnCloseBtn = false
                        }
                        let insTippyContent = instance.reference._tippy.popperChildren.content,
                            tippyContent = $(insTippyContent);
                        let firstLink = tippyContent.find('.et_pb_section a').eq(0);
                        if (firstLink.length > 0) {
                            firstLink.trigger("focus")
                        } else {
                            let firstInput = tippyContent.find('.et_pb_section input').eq(0);
                            if (firstInput.length > 0) {
                                firstInput.trigger("focus")
                            } else {
                                let firstSelect = tippyContent.find('.et_pb_section select').eq(0);
                                if (firstSelect.length > 0) {
                                    firstSelect.trigger("focus")
                                } else {
                                    let firstButton = tippyContent.find('.et_pb_section button').eq(0);
                                    if (firstButton.length > 0) {
                                        firstButton.trigger("focus")
                                    } else {
                                        let event = insTippyContent.getAttribute('data-eventtype');
                                        if (event === 'focus' && wasFocusOnCloseBtn === false) {
                                            let popperContentCloseBtnContainer = tippyContent.find('.divimegapro-close-container'),
                                                popperContentCloseBtn = tippyContent.find('.divimegapro-close');
                                            popperContentCloseBtnContainer.addClass('divimegapro-close-container-visible');
                                            popperContentCloseBtn.attr('aria-disabled', 'false');
                                            popperContentCloseBtn.trigger("focus")
                                        }
                                    }
                                }
                            }
                        }
                    }

                    function dmmTogglePlayableTags(selector_ref, wait) {
                        var $ = jQuery;
                        if (!selector_ref) {
                            selector_ref = ''
                        }
                        if (!wait) {
                            wait = 1
                        }
                        setTimeout(function() {
                            $(selector_ref + ' .divimegapro').find("iframe").not('[id^="gform"], .frm-g-recaptcha').each(function() {
                                var iframeParent = $(this).parent();
                                if (iframeParent.attr("class") == 'gm-style') {
                                    return
                                }
                                if (iframeParent.hasClass("fluid-width-video-wrapper")) {
                                    return
                                }
                                var iframe = $(this).prop("outerHTML");
                                var src = iframe.match(/src=[\'"]?((?:(?!\/>|>|"|\'|\s).)+)"/);
                                if (src !== null) {
                                    src = src[0];
                                    src = src.replace("src", "data-src");
                                    iframe = iframe.replace(/src=".*?"/i, "src=\"about:blank\" data-src=\"\"");
                                    if (src != "data-src=\"about:blank\"") {
                                        iframe = iframe.replace("data-src=\"\"", src)
                                    }
                                    $(iframe).insertAfter($(this));
                                    $(this).remove()
                                }
                            })
                        }, wait);
                        $(selector_ref + ' .divimegapro').find("video").each(function() {
                            let pThis = $(this),
                                parentHasClassLwpVideoAutoplay = pThis.parents('.lwp-video-autoplay'),
                                parentHasClassDmpVideoAutoplay = pThis.parents('.dmp-video-autoplay'),
                                parentHasClassRemoveControls = pThis.parents('.dmp-video-autoplay-removecontrols');
                            if (parentHasClassRemoveControls.length > 0) {
                                pThis.removeAttr('controls')
                            }
                            if (selector_ref != '' && (parentHasClassDmpVideoAutoplay.length > 0 || parentHasClassRemoveControls.length > 0 || parentHasClassLwpVideoAutoplay.length > 0)) {
                                setTimeout(function() {
                                    pThis.get(0).play()
                                }, 1)
                            } else {
                                pThis.get(0).pause()
                            }
                        });
                        $(selector_ref + ' .divimegapro').find("audio").each(function() {
                            this.pause();
                            this.currentTime = 0
                        })
                    }
                    dmmTogglePlayableTags('', 1000);
                    $(window).on('resize orientationchange', function() {
                        dmpRemoveDiviFix('.divimegapro.dmp-open');
                        if (divimegapro_singleton['header'] === true || divimegapro_singleton['content'] === true || divimegapro_singleton['footer'] === true) {
                            if (dmpSingletonInstance !== null && dmpSingletonInstance.popperInstance !== null && dmpSingletonInstance.state.isEnabled === true && dmpSingletonInstance.state.isDestroyed === false) {
                                let dmpid = dmpSingletonInstance.popper.getAttribute('data-dmpid');
                                if (dmpid !== null) {
                                    let tippySingleton = $('.tippy-popper-singleton'),
                                        tippySingletonContent = $('.tippy-popper-singleton .tippy-tooltip .tippy-content'),
                                        divimegapro_container_selector = '#divimegapro-container-' + dmpid,
                                        divimegapro_container = $(divimegapro_container_selector),
                                        divimegaproBodyOnSingleton = $(divimegapro_container_selector + '-clone-singleton'),
                                        options = dmpGetOptions(dmpid),
                                        divimegaproBodyWidth;
                                    divimegaproBodyWidth = dmpGetContainerWidth(options);
                                    dmpSingletonInstance.popper.style.width = divimegaproBodyWidth;
                                    divimegaproBodyOnSingleton.css({
                                        'width': divimegaproBodyWidth
                                    });
                                    tippySingleton.css({
                                        'width': divimegaproBodyWidth
                                    });
                                    tippySingletonContent.css({
                                        'width': divimegaproBodyWidth
                                    });
                                    setTimeout(function() {
                                        dmpSingletonInstance.popperInstance.update()
                                    }, 1)
                                }
                            }
                        }
                    });
                    let wait = 1;
                    if ($('body').hasClass('et_mobile_device')) {
                        wait = 1000
                    }
                    pagecontainer.prepend(divimegaprowrapper);
                    const overlayLoader = $('.overlay-loader .loader'),
                        overlayLoaderExists = overlayLoader.length > 0;
                    if (overlayLoaderExists === true) {
                        var dmp_loaderTimer = setInterval(function() {
                            if (overlayLoader.css('display') === 'none') {
                                $('.divimegapro-wrapper .divimegapro').mainDiviMegaPro();
                                clearInterval(dmp_loaderTimer)
                            }
                        }, 100)
                    } else {
                        setTimeout(function() {
                            $('.divimegapro-wrapper .divimegapro').mainDiviMegaPro()
                        }, wait)
                    }
                    const dmp_etmobilemenu = setInterval(function() {
                        let target = document.querySelectorAll('.et_mobile_menu');
                        if (target.length > 0) {
                            $('.divimegapro-wrapper .divimegapro').mainDiviMegaPro();
                            clearInterval(dmp_etmobilemenu)
                        }
                    }, 500);
                    let gravityFormPages = document.querySelectorAll('.gform_page');
                    if (gravityFormPages.length > 0) {
                        const gformpage_observeConfig = {
                                attributes: false,
                                childList: true,
                                subtree: false
                            },
                            gformpage_callback = function(mutationsList, observer) {
                                mutationsList.forEach(function(mutation) {
                                    if (mutation.type === 'childList') {
                                        $('.divimegapro-wrapper .divimegapro').mainDiviMegaPro()
                                    }
                                })
                            },
                            gformpage_observer = new MutationObserver(gformpage_callback),
                            gform_wrapper = document.querySelector('.gform_wrapper');
                        gformpage_observer.observe(gform_wrapper, gformpage_observeConfig)
                    }
                })(jQuery, window, document)
            }, delayMegaProInit);
            clearInterval(dmp_nTimer)
        }
    }, 50)
})();