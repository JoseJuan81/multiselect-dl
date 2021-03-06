<template>
	<div
		class="dl-main-container"
		ref="multiselect"
		:style="`min-height:${minHeight};`"
		@click.stop="toogleMenu"
	>
		<div class="dl-select-container">
			<div
				data-cy="tags"
				:class="[
					'dl-items-container',
					{ 'disabled': disabled },
				]"
			>
				<input type="text" ref="input" class="dl-hidden-input" :disabled="disabled"
					@keydown.enter="selectingItem"
					@keydown.down="updateHoverIndex(1)"
					@keydown.up="updateHoverIndex(-1)"
					@keydown.esc="closeMenu"
				>
				<span
					class="dl-item"
					v-for="(tag, index) in value"
					:key="index"
				>
					<slot name="tag" :tag="tag" :removeIt="addOrRemove"></slot>
				</span>
			</div>
			<div class="dl-activator-icons-container">
				<div class="dl-activator-icons">
					<div data-cy="clearable" @click.stop="clearAction" v-if="clearable">
						<slot name="clear-icon"></slot>
					</div>
					<div class="dl-icon-menu" :style="`transform:rotateZ(${showMenu ? '180deg' : '0deg'})`">
						<slot name="menu-activator" :show-menu="showMenu"></slot>
					</div>
				</div>
			</div>
		</div>
		<transition :name="transitionName" :mode="transitionMode">
			<div v-if="showMenu">
				<ul
					data-cy="multiselect-menu"
					ref="multiselect-menu"
					class="dl-multi-select-menu"
					:style="`max-height:${menuMaxHeight}`"
				>
					<li
						v-if="selectAll"
						data-cy="selectAll"
						class="dl-menu-item-wrapper"
						@click.stop="onSelectAll"
					>
						<slot
							name="select-all-items"
							:is-selected="allIsSelected"
							:is-hovered="optionComputed.length === hoverIndex"
						></slot>
					</li>
					<li
						v-for="(option, indexO) in optionComputed"
						:key="indexO"
						class="dl-menu-item-wrapper"
						@click.stop="addOrRemove(option)"
					>
						<slot
							name="menu"
							:menu-item="option"
							:is-hovered="indexO === hoverIndex"
							:index-item="indexO"
							:selected="itemSelected(option)"></slot>
					</li>
				</ul>
			</div>
		</transition>
	</div>
</template>

<script>
import {
	equality, find, map, setNewProperty, isEmpty,
} from 'functionallibrary';
import InstanceSelection from '../class';
import MenuLocation from '../class/menuLocation';

function mounted() {
	const self = this;
	document.addEventListener('click', () => {
		if (self.showMenu) {
			self.hideMenu();
		}
	});
}

function hideMenu() {
	this.showMenu = false;
}

function toogleMenu() {
	if (!this.disabled) {
		this.showMenu = !this.showMenu;
		if (this.showMenu) {
			const index = this.selectAll ? this.optionComputed.length : 0;
			this.$refs.input.focus();
			this.$nextTick(() => {
				this.checkPageBottom();
				this.setHoverIndex(index);
			});
		}
	}
}

function checkPageBottom() {
	const pageHeight = window.innerHeight;
	const multiselectContainer = this.$refs.multiselect;
	const multiselectMenu = this.$refs['multiselect-menu'];
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
	const sample = this.options[0];
	const typeObject = typeof sample === 'object';
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
	return map(
		setNewProperty(
			'isSelected',
			o => Boolean(
				find(
					equality(this.prop, o[this.prop]),
					this.value,
				),
			),
		),
		this.options,
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
	this.$emit('input', [...this.selected]);
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
	this.SelectorInstance = InstanceSelection(newVal, this.options[0], this.prop);
}

function setHoverIndex(index) {
	this.hoverIndex = index;
}

function updateHoverIndex(k) {
	const last = this.menuLocation.menu.children.length;
	let newIndex = this.hoverIndex + k;
	newIndex = newIndex < 0 ? last - 1 : newIndex;
	this.hoverIndex = newIndex % last;
	this.menuLocation.viewItemInPage(this.hoverIndex);
}

function selectingItem() {
	const currentItem = this.optionComputed[this.hoverIndex];
	const noCurrentItem = isEmpty(currentItem);
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
		SelectorInstance: InstanceSelection(this.multiselect, this.options[0], this.prop),
		selected: [],
		showMenu: false,
	};
}

export default {
	name: 'multiselect-dl',
	computed: {
		allIsSelected,
		objectsInOptions,
		optionComputed,
		noObjectsInOptions,
		selectingOptions,
	},
	data,
	methods: {
		addOrRemove,
		clearAction,
		closeMenu,
		checkPageBottom,
		emitInputEvent,
		hideMenu,
		itemSelected,
		onSelectAll,
		selectingItem,
		setHoverIndex,
		setStylesOnMenu,
		toogleMenu,
		updateHoverIndex,
	},
	mounted,
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
			default: () => [],
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
		multiselect,
	},
};
</script>
<style lang="scss">
.dl-main-container {
	// position: relative;
}

.dl-select-container {
	display: flex;

	.dl-items-container {
		display: flex;
		flex: 1 1 auto;

		&.disabled {
			cursor: not-allowed;
		}
	}

	.dl-activator-icons-container {
		display: flex;
		justify-self: flex-end;
		.dl-activator-icons {
			align-items: center;
			display: flex;
		}
	}
}
.dl-icon-menu {
	cursor: pointer;
	max-width: fit-content;
	transform-origin: center;
	transition: transform 0.175s linear;
}

.dl-multi-select-menu {
	background-color: white;
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	display: block;
	left: 0;
	margin: 0.25rem 0;
	min-width: 10rem;
	overflow: auto;
	padding: 0.5rem 0;
	position: absolute;
	transition: display 1s ease-in;
	text-align: center;
	list-style: none;
	z-index: 99;
}
</style>
