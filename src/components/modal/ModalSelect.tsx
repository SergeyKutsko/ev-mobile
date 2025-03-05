import { Icon, Spinner } from 'native-base';
import React, { useState, useRef, useCallback } from 'react';
import Modal from 'react-native-modal';
import { ItemSelectionMode } from '../list/ItemsList';
import computeStyleSheet from './ModalSelectStyles';
import I18n from 'i18n-js';
import SelectableList from '../../screens/base-screen/SelectableList';
import ListItem from '../../types/ListItem';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import computeListItemCommonStyle from '../list/ListItemCommonStyle';
import computeModalCommonStyle from './ModalCommonStyle';
import { Button } from 'react-native-elements';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { scale } from 'react-native-size-matters';
import Utils from '../../utils/Utils';

export interface Props<T> {
  defaultItems?: T[];
  buildItemName?: (item: T) => string;
  disabled?: boolean;
  label?: string;
  renderItem?: (item?: T) => React.ReactElement;
  renderItems?: (items?: T[]) => React.ReactElement;
  renderNoItem?: () => React.ReactElement;
  renderItemPlaceholder?: () => React.ReactElement;
  clearable?: boolean;
  selectionMode: ItemSelectionMode;
  onItemsSelected: (selectedItems: T[]) => void;
  defaultItemLoading?: boolean;
  openable?: boolean;
  itemsEquals?: (a: T, b: T) => boolean;
}

const ModalSelect = <T extends ListItem>({
  defaultItems,
  buildItemName,
  disabled,
  label,
  renderItem,
  renderItems,
  renderNoItem,
  renderItemPlaceholder,
  clearable,
  selectionMode,
  onItemsSelected,
  defaultItemLoading = false,
  openable = true,
  itemsEquals
}: Props<T>) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [noneSelected, setNoneSelected] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const itemsListRef = useRef<SelectableList<T>>(null);

  const clearSelection = useCallback(() => {
    itemsListRef.current?.clearSelectedItems();
  }, []);

  const resetInput = useCallback((noneSelected: boolean = false, items: T[] = []) => {
    itemsListRef.current?.clearSelectedItems();
    setNoneSelected(noneSelected);
    setSelectedItems(items);
    setIsVisible(false);
    onItemsSelected(items);
  }, [onItemsSelected]);

  const validateSelection = useCallback(() => {
    const selectedItems = itemsListRef.current?.getSelectedItems();
    if (!Utils.isEmptyArray(selectedItems)) {
      setIsVisible(false);
      setSelectedItems(selectedItems);
      onItemsSelected(selectedItems);
    }
  }, [onItemsSelected]);

  const onItemSelected = useCallback((selectedItems: T[]) => {
    if (selectionMode === ItemSelectionMode.MULTI) {
      setNoneSelected(false);
    } else if (selectionMode === ItemSelectionMode.SINGLE && !Utils.isEmptyArray(selectedItems)) {
      setSelectedItems(selectedItems);
      setIsVisible(false);
      setNoneSelected(false);
      onItemsSelected(selectedItems);
    }
  }, [onItemsSelected, selectionMode]);

  const onListContentUpdated = useCallback(() => {
    // Force update equivalent
  }, []);

  const renderButton = useCallback((style: any) => {
    const listItemCommonStyle = computeListItemCommonStyle();
    const commonColors = Utils.getCurrentCommonColor();

    if (defaultItemLoading) {
      return (
        <View style={[listItemCommonStyle.container, style.spinnerContainer]}>
          <Spinner size={scale(20)} color={commonColors.textColor} style={style.spinner} />
        </View>
      );
    }

    if ((selectedItems?.[0] || defaultItems?.[0])) {
      return (
        <View style={style.itemContainer}>
          <TouchableOpacity
            disabled={disabled || !openable}
            onPress={() => setIsVisible(true)}
            style={[style.itemButtonContainer, disabled && style.buttonDisabled]}>
            {selectionMode === ItemSelectionMode.MULTI ?
              renderItems?.(Utils.isEmptyArray(selectedItems) ? defaultItems : selectedItems)
              :
              renderItem?.(selectedItems?.[0] ?? defaultItems?.[0])
            }
          </TouchableOpacity>
          {clearable && (
            <TouchableOpacity style={style.clearContainer} onPress={() => resetInput(true)}>
              <Icon size={scale(25)} style={style.clearIcon} as={EvilIcons} name={'close'} />
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (renderItemPlaceholder && (noneSelected || !renderNoItem)) {
      return (
        <TouchableOpacity onPress={() => setIsVisible(true)} style={style.itemContainer}>
          {renderItemPlaceholder?.()}
        </TouchableOpacity>
      );
    } else {
      return <View style={style.itemContainer}>{renderNoItem?.()}</View>;
    }
  }, [
    defaultItemLoading, renderItem, renderItems, selectedItems, defaultItems,
    disabled, openable, clearable, resetInput, renderItemPlaceholder, noneSelected, renderNoItem
  ]);

  const style = computeStyleSheet();
  const modalCommonStyle = computeModalCommonStyle();
  const itemsList = React.Children.only<T>(children);
  const canValidateMultiSelect = itemsListRef.current?.getSelectedItems()?.length > 0;
  const title = itemsListRef.current?.buildModalHeaderTitle();
  const subtitle = itemsListRef.current?.buildModalHeaderSubtitle();

  return (
    <View style={style.container}>
      {label && <Text style={style.label}>{label}</Text>}
      {renderButton(style)}
      <Modal
        propagateSwipe={true}
        useNativeDriverForBackdrop={true}
        supportedOrientations={['portrait', 'landscape']}
        style={style.modal}
        isVisible={isVisible}
        swipeDirection={['down']}
        statusBarTranslucent={true}
        animationInTiming={500}
        animationOutTiming={500}
        onSwipeComplete={() => setIsVisible(false)}
        onBackButtonPress={() => setIsVisible(false)}
        hideModalContentWhileAnimating={true}>
        <SafeAreaView style={style.modalContainer}>
          <View style={style.modalHeader}>
            <View style={style.modalTitleContainer}>
              {title && <Text ellipsizeMode={'tail'} numberOfLines={1} style={style.modalTitle}>{title}</Text>}
              {subtitle && <Text numberOfLines={1} style={style.modalSubtitle}>{subtitle}</Text>}
            </View>
            <TouchableOpacity onPress={() => setIsVisible(false)}>
              <Icon size={scale(30)} style={style.closeIcon} as={EvilIcons} name={'close'} />
            </TouchableOpacity>
          </View>
          <View style={style.listContainer}>
            {React.cloneElement(itemsList, {
              onItemsSelected: onItemSelected,
              selectionMode,
              isModal: true,
              onContentUpdated: onListContentUpdated,
              ref: (itemsList: SelectableList<T>) => {
                if (itemsList && itemsListRef.current !== itemsList) {
                  itemsListRef.current = itemsList;
                }
              }
            })}
          </View>
          {selectionMode === ItemSelectionMode.MULTI && (
            <View style={style.buttonsContainer}>
              <Button
                disabled={!canValidateMultiSelect}
                title={I18n.t('general.validate')}
                disabledStyle={style.disabledButton}
                disabledTitleStyle={style.disabledButtonText}
                containerStyle={[style.buttonContainer]}
                onPress={validateSelection}/>
              <Button
                containerStyle={[style.buttonContainer, modalCommonStyle.primaryButton]}
                title={I18n.t('general.reset')}
                onPress={clearSelection} />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default ModalSelect;