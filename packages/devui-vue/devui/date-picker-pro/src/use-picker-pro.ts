import { shallowRef, ref, computed } from 'vue';
import type { SetupContext } from 'vue';
import { DatePickerProProps, UseDatePickerProReturnType } from './date-picker-pro-types';
import { onClickOutside } from '@vueuse/core';
import type { Dayjs } from 'dayjs';
import { formatDayjsToStr, isDateEquals, getFormatterDate, parserDate } from './utils';

export default function usePickerPro(props: DatePickerProProps, ctx: SetupContext): UseDatePickerProReturnType {
  const containerRef = shallowRef<HTMLElement>();
  const originRef = ref<HTMLElement>();
  const inputRef = shallowRef<HTMLElement>();
  const overlayRef = shallowRef<HTMLElement>();
  const isPanelShow = ref(false);
  const placeholder = computed(() => props.placeholder);
  const isMouseEnter = ref(false);

  const toggleChange = (bool: boolean) => {
    isPanelShow.value = bool;
    ctx.emit('toggleChange', bool);
  };

  onClickOutside(containerRef, () => {
    toggleChange(false);
  });

  const onFocus = function (e: MouseEvent) {
    e.stopPropagation();
    toggleChange(true);
  };

  const dateValue = computed(() => {
    let result;
    if (props.modelValue) {
      result = parserDate(props.modelValue, props.format);
    }
    return result;
  });

  const displayDateValue = computed(() => {
    const formatDate = formatDayjsToStr(dateValue.value, props.format);
    if (formatDate) {
      return formatDate;
    }
    return '';
  });

  const showCloseIcon = computed(() => isMouseEnter.value && (props.modelValue ? true : false));

  const onSelectedDate = (date: Dayjs, isConfirm?: boolean) => {
    const result = date ? date.toDate() : date;
    if (!isDateEquals(props.modelValue, result)) {
      const formatDate = getFormatterDate(date, props.format);
      ctx.emit('update:modelValue', date ? formatDate : date);
      if (isConfirm) {
        ctx.emit('confirmEvent', date);
        toggleChange(false);
      }
    }
  };

  const handlerClearTime = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    ctx.emit('update:modelValue', '');
  };

  return {
    containerRef,
    originRef,
    inputRef,
    overlayRef,
    isPanelShow,
    placeholder,
    dateValue,
    displayDateValue,
    isMouseEnter,
    showCloseIcon,
    onFocus,
    onSelectedDate,
    handlerClearTime,
  };
}
