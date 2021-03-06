'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var functionallibrary = require('functionallibrary');

var Selector = function Selector(prop) {
	this.prop = prop;
	this.selected = [];
};

Selector.prototype.clearSelection = function clearSelection () {
	this.selected = [];
	return this.selected;
};

Selector.prototype.isSelected = function isSelected (item) {
	return Boolean(functionallibrary.find(functionallibrary.equality(item), this.selected));
};

var MultiSelectorOfObjects = /*@__PURE__*/(function (Selector) {
	function MultiSelectorOfObjects () {
		Selector.apply(this, arguments);
	}

	if ( Selector ) MultiSelectorOfObjects.__proto__ = Selector;
	MultiSelectorOfObjects.prototype = Object.create( Selector && Selector.prototype );
	MultiSelectorOfObjects.prototype.constructor = MultiSelectorOfObjects;

	MultiSelectorOfObjects.prototype.addItem = function addItem (item) {
		return this.selected.concat(item);
	};

	MultiSelectorOfObjects.prototype.addOrRemoveEveryThing = function addOrRemoveEveryThing (flagAll, options) {
		this.selected = flagAll ? functionallibrary.map(functionallibrary.setNewProperty('isSelected', true), options) : [];
		return this.selected;
	};

	MultiSelectorOfObjects.prototype.removeItem = function removeItem (item) {
		var this$1 = this;

		return this.selected.filter(function (itemSelected) { return itemSelected[this$1.prop] !== item[this$1.prop]; });
	};

	MultiSelectorOfObjects.prototype.selection = function selection (item) {
		var newItem = functionallibrary.setNewProperty('isSelected', !item.isSelected)(item);
		this.selected = newItem.isSelected ? this.addItem(newItem) : this.removeItem(newItem);
		return this.selected;
	};

	MultiSelectorOfObjects.prototype.isSelected = function isSelected (item) {
		return Boolean(functionallibrary.find(functionallibrary.equality(this.prop, item[this.prop]), this.selected));
	};

	return MultiSelectorOfObjects;
}(Selector));

var MultiSelectorOfNonObjects = /*@__PURE__*/(function (Selector) {
	function MultiSelectorOfNonObjects () {
		Selector.apply(this, arguments);
	}

	if ( Selector ) MultiSelectorOfNonObjects.__proto__ = Selector;
	MultiSelectorOfNonObjects.prototype = Object.create( Selector && Selector.prototype );
	MultiSelectorOfNonObjects.prototype.constructor = MultiSelectorOfNonObjects;

	MultiSelectorOfNonObjects.prototype.addItem = function addItem (item) {
		return this.selected.concat(item);
	};

	MultiSelectorOfNonObjects.prototype.addOrRemoveEveryThing = function addOrRemoveEveryThing (flagAll, options) {
		this.selected = flagAll ? [].concat( options ) : [];
		return this.selected;
	};

	MultiSelectorOfNonObjects.prototype.removeItem = function removeItem (item) {
		return this.selected.filter(function (itemSelected) { return itemSelected !== item; });
	};

	MultiSelectorOfNonObjects.prototype.selection = function selection (item) {
		var exist = functionallibrary.find(functionallibrary.equality(item), this.selected);
		this.selected = exist ? this.removeItem(item) : this.addItem(item);
		return this.selected;
	};

	return MultiSelectorOfNonObjects;
}(Selector));

var SimpleSelectorOfObjects = /*@__PURE__*/(function (Selector) {
	function SimpleSelectorOfObjects () {
		Selector.apply(this, arguments);
	}

	if ( Selector ) SimpleSelectorOfObjects.__proto__ = Selector;
	SimpleSelectorOfObjects.prototype = Object.create( Selector && Selector.prototype );
	SimpleSelectorOfObjects.prototype.constructor = SimpleSelectorOfObjects;

	SimpleSelectorOfObjects.prototype.selection = function selection (item) {
		var newItem = functionallibrary.setNewProperty('isSelected', !item.isSelected)(item);
		this.selected = newItem.isSelected ? [newItem] : [];
		return this.selected;
	};

	SimpleSelectorOfObjects.prototype.isSelected = function isSelected (item) {
		return Boolean(functionallibrary.find(functionallibrary.equality(this.prop, item[this.prop]), this.selected));
	};

	return SimpleSelectorOfObjects;
}(Selector));

var SimpleSelectorOfNonObjects = /*@__PURE__*/(function (Selector) {
	function SimpleSelectorOfNonObjects () {
		Selector.apply(this, arguments);
	}

	if ( Selector ) SimpleSelectorOfNonObjects.__proto__ = Selector;
	SimpleSelectorOfNonObjects.prototype = Object.create( Selector && Selector.prototype );
	SimpleSelectorOfNonObjects.prototype.constructor = SimpleSelectorOfNonObjects;

	SimpleSelectorOfNonObjects.prototype.selection = function selection (item) {
		this.selected = this.selected[0] === item ? [] : [item];
		return this.selected;
	};

	return SimpleSelectorOfNonObjects;
}(Selector));

function classInstance(multiselect, item, prop) {
	if (multiselect) {
		return typeof item === 'object'
			? new MultiSelectorOfObjects(prop)
			: new MultiSelectorOfNonObjects();
	}
	return typeof item === 'object'
		? new SimpleSelectorOfObjects(prop)
		: new SimpleSelectorOfNonObjects();
}

var MenuLocation = function MenuLocation(pageHeight, multiselectNode, multiselectMenuNode) {
	var totalChildren = multiselectMenuNode.children.length;
	var n = totalChildren <= 3 ? totalChildren : 4;
	var firstChildren = multiselectMenuNode.children[0];
	this.menu = {
		children: multiselectMenuNode.children,
		height: {
			initial: multiselectMenuNode.offsetHeight,
			item: firstChildren && firstChildren.offsetHeight,
			min: firstChildren && (firstChildren.offsetHeight * n),
		},
		node: multiselectMenuNode,
		position: multiselectMenuNode.getBoundingClientRect(),
		width: multiselectMenuNode.getBoundingClientRect().width,
	};
	var offsetHeight = multiselectNode.offsetHeight;
	var offsetTop = multiselectNode.offsetTop;
	this.page = {
		height: {
			total: pageHeight,
			remain: pageHeight - (offsetTop + offsetHeight + 20),
		},
	};
	this.select = {
		node: multiselectNode,
		position: multiselectNode.getBoundingClientRect(),
	};
};

var prototypeAccessors = { menuTop: { configurable: true },menuHeight: { configurable: true },menuWidth: { configurable: true },remainHeight: { configurable: true },menuLeftPos: { configurable: true },menuTopPos: { configurable: true } };

prototypeAccessors.menuTop.get = function () {
	return this.remainHeight.top > this.remainHeight.bottom;
};

prototypeAccessors.menuHeight.get = function () {
	return ((this.menuHeightCalculated()) + "px");
};

prototypeAccessors.menuWidth.get = function () {
	return ((this.menu.width) + "px");
};

prototypeAccessors.remainHeight.get = function () {
	return {
		bottom: this.page.height.total - this.select.position.bottom,
		top: this.select.position.top,
	};
};

prototypeAccessors.menuLeftPos.get = function () {
	var left = this.select.node.offsetLeft;
	return (left + "px");
};

prototypeAccessors.menuTopPos.get = function () {
	var top = this.select.node.offsetTop;
	if (this.menuTop) {
		return ((top - this.menuHeightCalculated()) + "px");
	}
	var selectHeight = this.select.node.offsetHeight;
	return ((top + selectHeight) + "px");
};

MenuLocation.prototype.menuHeightCalculated = function menuHeightCalculated () {
	var ref = this.remainHeight;
		var top = ref.top;
		var bottom = ref.bottom;
	var ref$1 = this.menu.height;
		var menuItemHeight = ref$1.item;
		var maxHeightByItems = ref$1.initial;
	var avaliableHeight = this.menuTop ? top : bottom;
	var nChildren = Math.floor(avaliableHeight / menuItemHeight);
	var height = nChildren * menuItemHeight;
	return maxHeightByItems > height ? height : maxHeightByItems;
};

MenuLocation.prototype.viewItemInPage = function viewItemInPage (index) {
	var ref = this.menu.children[index];
		var offsetTop = ref.offsetTop;
	this.menu.node.scrollTo({
		top: offsetTop,
		behavior: 'smooth',
	});
};

Object.defineProperties( MenuLocation.prototype, prototypeAccessors );

//

function mounted() {
	var self = this;
	document.addEventListener('click', function () {
		if (self.showMenu) {
			self.hideMenu();
		}
	});
}

function hideMenu() {
	this.showMenu = false;
}

function toogleMenu() {
	var this$1 = this;

	if (!this.disabled) {
		this.showMenu = !this.showMenu;
		if (this.showMenu) {
			var index = this.selectAll ? this.optionComputed.length : 0;
			this.$refs.input.focus();
			this.$nextTick(function () {
				this$1.checkPageBottom();
				this$1.setHoverIndex(index);
			});
		}
	}
}

function checkPageBottom() {
	var pageHeight = window.innerHeight;
	var multiselectContainer = this.$refs.multiselect;
	var multiselectMenu = this.$refs['multiselect-menu'];
	this.menuLocation = new MenuLocation(pageHeight, multiselectContainer, multiselectMenu);
	this.setStylesOnMenu();
}

function setStylesOnMenu() {
	this.menuLocation.menu.node.style.height = this.menuLocation.menuHeight;
	this.menuLocation.menu.node.style.width = this.menuLocation.menuWidth;
	this.menuLocation.menu.node.style.left = this.menuLocation.menuLeftPos;
	this.menuLocation.menu.node.style.top = this.menuLocation.menuTopPos;
}

function optionComputed() {
	var sample = this.options[0];
	var typeObject = typeof sample === 'object';
	return typeObject ? this.objectsInOptions : this.noObjectsInOptions;
}

function noObjectsInOptions() {
	return this.options;
}

function objectsInOptions() {
	if (this.multiselect) {
		return this.value && this.value.length ? this.selectingOptions : this.options;
	}
	return this.value ? this.selectingOptions : this.options;
}

function selectingOptions() {
	var this$1 = this;

	return functionallibrary.map(
		functionallibrary.setNewProperty(
			'isSelected',
			function (o) { return Boolean(
				functionallibrary.find(
					functionallibrary.equality(this$1.prop, o[this$1.prop]),
					this$1.value
				)
			); }
		),
		this.options
	);
}

function addOrRemove(item) {
	this.selected = this.SelectorInstance.selection(item);
	this.emitInputEvent();
	if (!this.multiselect && this.selected.length > 0) {
		this.closeMenu();
	}
}

function clearAction() {
	this.selected = this.SelectorInstance.clearSelection();
	this.emitInputEvent();
}

function emitInputEvent() {
	this.$emit('input', [].concat( this.selected ));
}

function onSelectAll() {
	this.allFlag = !this.allFlag;
	this.selected = this.SelectorInstance.addOrRemoveEveryThing(this.allFlag, this.optionComputed);
	this.emitInputEvent();
}

function allIsSelected() {
	return this.selected.length === this.options.length;
}

function itemSelected(item) {
	return this.SelectorInstance.isSelected(item);
}

function multiselect(newVal) {
	this.SelectorInstance = classInstance(newVal, this.options[0], this.prop);
}

function setHoverIndex(index) {
	this.hoverIndex = index;
}

function updateHoverIndex(k) {
	var last = this.menuLocation.menu.children.length;
	var newIndex = this.hoverIndex + k;
	newIndex = newIndex < 0 ? last - 1 : newIndex;
	this.hoverIndex = newIndex % last;
	this.menuLocation.viewItemInPage(this.hoverIndex);
}

function selectingItem() {
	var currentItem = this.optionComputed[this.hoverIndex];
	var noCurrentItem = functionallibrary.isEmpty(currentItem);
	if (noCurrentItem && this.hoverIndex === this.optionComputed.length) {
		this.onSelectAll();
	} else {
		this.addOrRemove(currentItem);
	}
}

function closeMenu() {
	this.showMenu = false;
}

function data() {
	return {
		allFlag: false,
		hoverIndex: null,
		menuLocation: null,
		SelectorInstance: classInstance(this.multiselect, this.options[0], this.prop),
		selected: [],
		showMenu: false,
	};
}

var script = {
	name: 'multiselect-dl',
	computed: {
		allIsSelected: allIsSelected,
		objectsInOptions: objectsInOptions,
		optionComputed: optionComputed,
		noObjectsInOptions: noObjectsInOptions,
		selectingOptions: selectingOptions,
	},
	data: data,
	methods: {
		addOrRemove: addOrRemove,
		clearAction: clearAction,
		closeMenu: closeMenu,
		checkPageBottom: checkPageBottom,
		emitInputEvent: emitInputEvent,
		hideMenu: hideMenu,
		itemSelected: itemSelected,
		onSelectAll: onSelectAll,
		selectingItem: selectingItem,
		setHoverIndex: setHoverIndex,
		setStylesOnMenu: setStylesOnMenu,
		toogleMenu: toogleMenu,
		updateHoverIndex: updateHoverIndex,
	},
	mounted: mounted,
	props: {
		clearable: {
			default: false,
			type: Boolean,
		},
		disabled: {
			default: false,
			type: Boolean,
		},
		menuMaxHeight: {
			default: 'auto',
			type: String,
		},
		minHeight: {
			default: '0.5rem',
			type: String,
		},
		multiselect: {
			default: false,
			type: Boolean,
		},
		selectAll: {
			default: false,
			type: Boolean,
		},
		options: {
			default: function () { return []; },
			type: Array,
		},
		prop: {
			default: '',
			type: String,
		},
		transitionName: {
			default: '',
			type: String,
		},
		transitionMode: {
			default: 'out-in',
			type: String,
		},
		value: null,
	},
	watch: {
		multiselect: multiselect,
	},
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        { return function () { }; }
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: function () { return context._renderStyles(context._styles); }
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return function (id, style) { return addStyle(id, style, context); };
}
function addStyle(id, css, context) {
    var group = process.env.NODE_ENV === 'production' ? css.media || 'default' : id;
    var style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        var code = css.source;
        if (process.env.NODE_ENV !== 'production' && css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    Buffer.from(unescape(encodeURIComponent(JSON.stringify(css.map)))).toString('base64') +
                    ' */';
        }
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    var css = '';
    for (var key in styles) {
        var style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      ref: "multiselect",
      staticClass: "dl-main-container",
      style: "min-height:" + _vm.minHeight + ";",
      on: {
        click: function($event) {
          $event.stopPropagation();
          return _vm.toogleMenu($event)
        }
      }
    },
    [
      _vm._ssrNode(
        '<div class="dl-select-container">',
        "</div>",
        [
          _vm._ssrNode(
            '<div data-cy="tags"' +
              _vm._ssrClass(null, [
                "dl-items-container",
                { disabled: _vm.disabled }
              ]) +
              ">",
            "</div>",
            [
              _vm._ssrNode(
                '<input type="text"' +
                  _vm._ssrAttr("disabled", _vm.disabled) +
                  ' class="dl-hidden-input"> '
              ),
              _vm._l(_vm.value, function(tag, index) {
                return _vm._ssrNode(
                  '<span class="dl-item">',
                  "</span>",
                  [
                    _vm._t("tag", null, { tag: tag, removeIt: _vm.addOrRemove })
                  ],
                  2
                )
              })
            ],
            2
          ),
          _vm._ssrNode(" "),
          _vm._ssrNode('<div class="dl-activator-icons-container">', "</div>", [
            _vm._ssrNode(
              '<div class="dl-activator-icons">',
              "</div>",
              [
                _vm.clearable
                  ? _vm._ssrNode(
                      '<div data-cy="clearable">',
                      "</div>",
                      [_vm._t("clear-icon")],
                      2
                    )
                  : _vm._e(),
                _vm._ssrNode(" "),
                _vm._ssrNode(
                  '<div class="dl-icon-menu"' +
                    _vm._ssrStyle(
                      null,
                      "transform:rotateZ(" +
                        (_vm.showMenu ? "180deg" : "0deg") +
                        ")",
                      null
                    ) +
                    ">",
                  "</div>",
                  [_vm._t("menu-activator", null, { showMenu: _vm.showMenu })],
                  2
                )
              ],
              2
            )
          ])
        ],
        2
      ),
      _vm._ssrNode(" "),
      _c(
        "transition",
        { attrs: { name: _vm.transitionName, mode: _vm.transitionMode } },
        [
          _vm.showMenu
            ? _c("div", [
                _c(
                  "ul",
                  {
                    ref: "multiselect-menu",
                    staticClass: "dl-multi-select-menu",
                    style: "max-height:" + _vm.menuMaxHeight,
                    attrs: { "data-cy": "multiselect-menu" }
                  },
                  [
                    _vm.selectAll
                      ? _c(
                          "li",
                          {
                            staticClass: "dl-menu-item-wrapper",
                            attrs: { "data-cy": "selectAll" },
                            on: {
                              click: function($event) {
                                $event.stopPropagation();
                                return _vm.onSelectAll($event)
                              }
                            }
                          },
                          [
                            _vm._t("select-all-items", null, {
                              isSelected: _vm.allIsSelected,
                              isHovered:
                                _vm.optionComputed.length === _vm.hoverIndex
                            })
                          ],
                          2
                        )
                      : _vm._e(),
                    _vm._v(" "),
                    _vm._l(_vm.optionComputed, function(option, indexO) {
                      return _c(
                        "li",
                        {
                          key: indexO,
                          staticClass: "dl-menu-item-wrapper",
                          on: {
                            click: function($event) {
                              $event.stopPropagation();
                              return _vm.addOrRemove(option)
                            }
                          }
                        },
                        [
                          _vm._t("menu", null, {
                            menuItem: option,
                            isHovered: indexO === _vm.hoverIndex,
                            indexItem: indexO,
                            selected: _vm.itemSelected(option)
                          })
                        ],
                        2
                      )
                    })
                  ],
                  2
                )
              ])
            : _vm._e()
        ]
      )
    ],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-43b3ccab_0", { source: ".dl-select-container {\n  display: flex;\n}\n.dl-select-container .dl-items-container {\n  display: flex;\n  flex: 1 1 auto;\n}\n.dl-select-container .dl-items-container.disabled {\n  cursor: not-allowed;\n}\n.dl-select-container .dl-activator-icons-container {\n  display: flex;\n  justify-self: flex-end;\n}\n.dl-select-container .dl-activator-icons-container .dl-activator-icons {\n  align-items: center;\n  display: flex;\n}\n.dl-icon-menu {\n  cursor: pointer;\n  max-width: fit-content;\n  transform-origin: center;\n  transition: transform 0.175s linear;\n}\n.dl-multi-select-menu {\n  background-color: white;\n  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\n  display: block;\n  left: 0;\n  margin: 0.25rem 0;\n  min-width: 10rem;\n  overflow: auto;\n  padding: 0.5rem 0;\n  position: absolute;\n  transition: display 1s ease-in;\n  text-align: center;\n  list-style: none;\n  z-index: 99;\n}\n\n/*# sourceMappingURL=multiselect-dl.vue.map */", map: {"version":3,"sources":["/Users/frontend/Documents/JJ/dl-components/my-components/multiselect-dl/src/components/multiselect-dl.vue","multiselect-dl.vue"],"names":[],"mappings":"AAuTA;EACA,aAAA;ACtTA;ADwTA;EACA,aAAA;EACA,cAAA;ACtTA;ADwTA;EACA,mBAAA;ACtTA;AD0TA;EACA,aAAA;EACA,sBAAA;ACxTA;ADyTA;EACA,mBAAA;EACA,aAAA;ACvTA;AD2TA;EACA,eAAA;EACA,sBAAA;EACA,wBAAA;EACA,mCAAA;ACxTA;AD2TA;EACA,uBAAA;EACA,mFAAA;EACA,cAAA;EACA,OAAA;EACA,iBAAA;EACA,gBAAA;EACA,cAAA;EACA,iBAAA;EACA,kBAAA;EACA,8BAAA;EACA,kBAAA;EACA,gBAAA;EACA,WAAA;ACxTA;;AAEA,6CAA6C","file":"multiselect-dl.vue","sourcesContent":["<template>\n\t<div\n\t\tclass=\"dl-main-container\"\n\t\tref=\"multiselect\"\n\t\t:style=\"`min-height:${minHeight};`\"\n\t\t@click.stop=\"toogleMenu\"\n\t>\n\t\t<div class=\"dl-select-container\">\n\t\t\t<div\n\t\t\t\tdata-cy=\"tags\"\n\t\t\t\t:class=\"[\n\t\t\t\t\t'dl-items-container',\n\t\t\t\t\t{ 'disabled': disabled },\n\t\t\t\t]\"\n\t\t\t>\n\t\t\t\t<input type=\"text\" ref=\"input\" class=\"dl-hidden-input\" :disabled=\"disabled\"\n\t\t\t\t\t@keydown.enter=\"selectingItem\"\n\t\t\t\t\t@keydown.down=\"updateHoverIndex(1)\"\n\t\t\t\t\t@keydown.up=\"updateHoverIndex(-1)\"\n\t\t\t\t\t@keydown.esc=\"closeMenu\"\n\t\t\t\t>\n\t\t\t\t<span\n\t\t\t\t\tclass=\"dl-item\"\n\t\t\t\t\tv-for=\"(tag, index) in value\"\n\t\t\t\t\t:key=\"index\"\n\t\t\t\t>\n\t\t\t\t\t<slot name=\"tag\" :tag=\"tag\" :removeIt=\"addOrRemove\"></slot>\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t\t<div class=\"dl-activator-icons-container\">\n\t\t\t\t<div class=\"dl-activator-icons\">\n\t\t\t\t\t<div data-cy=\"clearable\" @click.stop=\"clearAction\" v-if=\"clearable\">\n\t\t\t\t\t\t<slot name=\"clear-icon\"></slot>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"dl-icon-menu\" :style=\"`transform:rotateZ(${showMenu ? '180deg' : '0deg'})`\">\n\t\t\t\t\t\t<slot name=\"menu-activator\" :show-menu=\"showMenu\"></slot>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<transition :name=\"transitionName\" :mode=\"transitionMode\">\n\t\t\t<div v-if=\"showMenu\">\n\t\t\t\t<ul\n\t\t\t\t\tdata-cy=\"multiselect-menu\"\n\t\t\t\t\tref=\"multiselect-menu\"\n\t\t\t\t\tclass=\"dl-multi-select-menu\"\n\t\t\t\t\t:style=\"`max-height:${menuMaxHeight}`\"\n\t\t\t\t>\n\t\t\t\t\t<li\n\t\t\t\t\t\tv-if=\"selectAll\"\n\t\t\t\t\t\tdata-cy=\"selectAll\"\n\t\t\t\t\t\tclass=\"dl-menu-item-wrapper\"\n\t\t\t\t\t\t@click.stop=\"onSelectAll\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<slot\n\t\t\t\t\t\t\tname=\"select-all-items\"\n\t\t\t\t\t\t\t:is-selected=\"allIsSelected\"\n\t\t\t\t\t\t\t:is-hovered=\"optionComputed.length === hoverIndex\"\n\t\t\t\t\t\t></slot>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li\n\t\t\t\t\t\tv-for=\"(option, indexO) in optionComputed\"\n\t\t\t\t\t\t:key=\"indexO\"\n\t\t\t\t\t\tclass=\"dl-menu-item-wrapper\"\n\t\t\t\t\t\t@click.stop=\"addOrRemove(option)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<slot\n\t\t\t\t\t\t\tname=\"menu\"\n\t\t\t\t\t\t\t:menu-item=\"option\"\n\t\t\t\t\t\t\t:is-hovered=\"indexO === hoverIndex\"\n\t\t\t\t\t\t\t:index-item=\"indexO\"\n\t\t\t\t\t\t\t:selected=\"itemSelected(option)\"></slot>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</transition>\n\t</div>\n</template>\n\n<script>\nimport {\n\tequality, find, map, setNewProperty, isEmpty,\n} from 'functionallibrary';\nimport InstanceSelection from '../class';\nimport MenuLocation from '../class/menuLocation';\n\nfunction mounted() {\n\tconst self = this;\n\tdocument.addEventListener('click', () => {\n\t\tif (self.showMenu) {\n\t\t\tself.hideMenu();\n\t\t}\n\t});\n}\n\nfunction hideMenu() {\n\tthis.showMenu = false;\n}\n\nfunction toogleMenu() {\n\tif (!this.disabled) {\n\t\tthis.showMenu = !this.showMenu;\n\t\tif (this.showMenu) {\n\t\t\tconst index = this.selectAll ? this.optionComputed.length : 0;\n\t\t\tthis.$refs.input.focus();\n\t\t\tthis.$nextTick(() => {\n\t\t\t\tthis.checkPageBottom();\n\t\t\t\tthis.setHoverIndex(index);\n\t\t\t});\n\t\t}\n\t}\n}\n\nfunction checkPageBottom() {\n\tconst pageHeight = window.innerHeight;\n\tconst multiselectContainer = this.$refs.multiselect;\n\tconst multiselectMenu = this.$refs['multiselect-menu'];\n\tthis.menuLocation = new MenuLocation(pageHeight, multiselectContainer, multiselectMenu);\n\tthis.setStylesOnMenu();\n}\n\nfunction setStylesOnMenu() {\n\tthis.menuLocation.menu.node.style.height = this.menuLocation.menuHeight;\n\tthis.menuLocation.menu.node.style.width = this.menuLocation.menuWidth;\n\tthis.menuLocation.menu.node.style.left = this.menuLocation.menuLeftPos;\n\tthis.menuLocation.menu.node.style.top = this.menuLocation.menuTopPos;\n}\n\nfunction optionComputed() {\n\tconst sample = this.options[0];\n\tconst typeObject = typeof sample === 'object';\n\treturn typeObject ? this.objectsInOptions : this.noObjectsInOptions;\n}\n\nfunction noObjectsInOptions() {\n\treturn this.options;\n}\n\nfunction objectsInOptions() {\n\tif (this.multiselect) {\n\t\treturn this.value && this.value.length ? this.selectingOptions : this.options;\n\t}\n\treturn this.value ? this.selectingOptions : this.options;\n}\n\nfunction selectingOptions() {\n\treturn map(\n\t\tsetNewProperty(\n\t\t\t'isSelected',\n\t\t\to => Boolean(\n\t\t\t\tfind(\n\t\t\t\t\tequality(this.prop, o[this.prop]),\n\t\t\t\t\tthis.value,\n\t\t\t\t),\n\t\t\t),\n\t\t),\n\t\tthis.options,\n\t);\n}\n\nfunction addOrRemove(item) {\n\tthis.selected = this.SelectorInstance.selection(item);\n\tthis.emitInputEvent();\n\tif (!this.multiselect && this.selected.length > 0) {\n\t\tthis.closeMenu();\n\t}\n}\n\nfunction clearAction() {\n\tthis.selected = this.SelectorInstance.clearSelection();\n\tthis.emitInputEvent();\n}\n\nfunction emitInputEvent() {\n\tthis.$emit('input', [...this.selected]);\n}\n\nfunction onSelectAll() {\n\tthis.allFlag = !this.allFlag;\n\tthis.selected = this.SelectorInstance.addOrRemoveEveryThing(this.allFlag, this.optionComputed);\n\tthis.emitInputEvent();\n}\n\nfunction allIsSelected() {\n\treturn this.selected.length === this.options.length;\n}\n\nfunction itemSelected(item) {\n\treturn this.SelectorInstance.isSelected(item);\n}\n\nfunction multiselect(newVal) {\n\tthis.SelectorInstance = InstanceSelection(newVal, this.options[0], this.prop);\n}\n\nfunction setHoverIndex(index) {\n\tthis.hoverIndex = index;\n}\n\nfunction updateHoverIndex(k) {\n\tconst last = this.menuLocation.menu.children.length;\n\tlet newIndex = this.hoverIndex + k;\n\tnewIndex = newIndex < 0 ? last - 1 : newIndex;\n\tthis.hoverIndex = newIndex % last;\n\tthis.menuLocation.viewItemInPage(this.hoverIndex);\n}\n\nfunction selectingItem() {\n\tconst currentItem = this.optionComputed[this.hoverIndex];\n\tconst noCurrentItem = isEmpty(currentItem);\n\tif (noCurrentItem && this.hoverIndex === this.optionComputed.length) {\n\t\tthis.onSelectAll();\n\t} else {\n\t\tthis.addOrRemove(currentItem);\n\t}\n}\n\nfunction closeMenu() {\n\tthis.showMenu = false;\n}\n\nfunction data() {\n\treturn {\n\t\tallFlag: false,\n\t\thoverIndex: null,\n\t\tmenuLocation: null,\n\t\tSelectorInstance: InstanceSelection(this.multiselect, this.options[0], this.prop),\n\t\tselected: [],\n\t\tshowMenu: false,\n\t};\n}\n\nexport default {\n\tname: 'multiselect-dl',\n\tcomputed: {\n\t\tallIsSelected,\n\t\tobjectsInOptions,\n\t\toptionComputed,\n\t\tnoObjectsInOptions,\n\t\tselectingOptions,\n\t},\n\tdata,\n\tmethods: {\n\t\taddOrRemove,\n\t\tclearAction,\n\t\tcloseMenu,\n\t\tcheckPageBottom,\n\t\temitInputEvent,\n\t\thideMenu,\n\t\titemSelected,\n\t\tonSelectAll,\n\t\tselectingItem,\n\t\tsetHoverIndex,\n\t\tsetStylesOnMenu,\n\t\ttoogleMenu,\n\t\tupdateHoverIndex,\n\t},\n\tmounted,\n\tprops: {\n\t\tclearable: {\n\t\t\tdefault: false,\n\t\t\ttype: Boolean,\n\t\t},\n\t\tdisabled: {\n\t\t\tdefault: false,\n\t\t\ttype: Boolean,\n\t\t},\n\t\tmenuMaxHeight: {\n\t\t\tdefault: 'auto',\n\t\t\ttype: String,\n\t\t},\n\t\tminHeight: {\n\t\t\tdefault: '0.5rem',\n\t\t\ttype: String,\n\t\t},\n\t\tmultiselect: {\n\t\t\tdefault: false,\n\t\t\ttype: Boolean,\n\t\t},\n\t\tselectAll: {\n\t\t\tdefault: false,\n\t\t\ttype: Boolean,\n\t\t},\n\t\toptions: {\n\t\t\tdefault: () => [],\n\t\t\ttype: Array,\n\t\t},\n\t\tprop: {\n\t\t\tdefault: '',\n\t\t\ttype: String,\n\t\t},\n\t\ttransitionName: {\n\t\t\tdefault: '',\n\t\t\ttype: String,\n\t\t},\n\t\ttransitionMode: {\n\t\t\tdefault: 'out-in',\n\t\t\ttype: String,\n\t\t},\n\t\tvalue: null,\n\t},\n\twatch: {\n\t\tmultiselect,\n\t},\n};\n</script>\n<style lang=\"scss\">\n.dl-main-container {\n\t// position: relative;\n}\n\n.dl-select-container {\n\tdisplay: flex;\n\n\t.dl-items-container {\n\t\tdisplay: flex;\n\t\tflex: 1 1 auto;\n\n\t\t&.disabled {\n\t\t\tcursor: not-allowed;\n\t\t}\n\t}\n\n\t.dl-activator-icons-container {\n\t\tdisplay: flex;\n\t\tjustify-self: flex-end;\n\t\t.dl-activator-icons {\n\t\t\talign-items: center;\n\t\t\tdisplay: flex;\n\t\t}\n\t}\n}\n.dl-icon-menu {\n\tcursor: pointer;\n\tmax-width: fit-content;\n\ttransform-origin: center;\n\ttransition: transform 0.175s linear;\n}\n\n.dl-multi-select-menu {\n\tbackground-color: white;\n\tbox-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\n\tdisplay: block;\n\tleft: 0;\n\tmargin: 0.25rem 0;\n\tmin-width: 10rem;\n\toverflow: auto;\n\tpadding: 0.5rem 0;\n\tposition: absolute;\n\ttransition: display 1s ease-in;\n\ttext-align: center;\n\tlist-style: none;\n\tz-index: 99;\n}\n</style>\n",".dl-select-container {\n  display: flex;\n}\n.dl-select-container .dl-items-container {\n  display: flex;\n  flex: 1 1 auto;\n}\n.dl-select-container .dl-items-container.disabled {\n  cursor: not-allowed;\n}\n.dl-select-container .dl-activator-icons-container {\n  display: flex;\n  justify-self: flex-end;\n}\n.dl-select-container .dl-activator-icons-container .dl-activator-icons {\n  align-items: center;\n  display: flex;\n}\n\n.dl-icon-menu {\n  cursor: pointer;\n  max-width: fit-content;\n  transform-origin: center;\n  transition: transform 0.175s linear;\n}\n\n.dl-multi-select-menu {\n  background-color: white;\n  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\n  display: block;\n  left: 0;\n  margin: 0.25rem 0;\n  min-width: 10rem;\n  overflow: auto;\n  padding: 0.5rem 0;\n  position: absolute;\n  transition: display 1s ease-in;\n  text-align: center;\n  list-style: none;\n  z-index: 99;\n}\n\n/*# sourceMappingURL=multiselect-dl.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = "data-v-43b3ccab";
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject shadow dom */
  

  
  var __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    createInjectorSSR,
    undefined
  );

var install = function install(Vue) {
	if (install.installed) { return; }
	install.installed = true;
	Vue.component(__vue_component__.name, __vue_component__);
};

__vue_component__.install = install;

var plugin = {
	install: install,
};

var GlobalVue = null;

if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}

if (GlobalVue) {
	GlobalVue.use(plugin);
}

exports.default = __vue_component__;
