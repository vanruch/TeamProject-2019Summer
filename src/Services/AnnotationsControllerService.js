import React from 'react';
import Prompt from '../Components/Prompt';
import Popup from 'react-popup';

export default class AnnotationsControllerService {
  selectedAnnotations = [];
  annotations = [];

  constructor(messageService) {
    this.messageService = messageService;
  }

  selectAnnotation(pageIndex, annotationIndex) {
    this.selectedAnnotations = [{pageIndex, annotationIndex}];
  }

  updateAnnotationsIds(pageIndex, newIds) {
    this.annotations[pageIndex] = this.annotations[pageIndex].map((annotation, ind) => ({...annotation, id: newIds[ind]}));
    this.annotations = [...this.annotations];
  }

  isAnnotationSelected(pageIndex, annotationIndex) {
    return this.selectedAnnotations.some((annotation) => annotation.pageIndex === pageIndex &&
      annotation.annotationIndex === annotationIndex);
  }

  toggleAnnotationSelection(pageIndex, annotationIndex) {
    if (this.isAnnotationSelected(pageIndex, annotationIndex)) {
      this.selectedAnnotations = this.selectedAnnotations.filter((annotation) => !(annotation.pageIndex === pageIndex &&
        annotation.annotationIndex === annotationIndex));
    } else {
      this.selectedAnnotations = [...this.selectedAnnotations, {pageIndex, annotationIndex}];
    }
  }

  addAnnotationToPage(pageIndex, newAnnotation) {
    Popup.registerPlugin('prompt', function (callback) {
      let defaultType = ["linear_plot"];
      newAnnotation.data.type = defaultType;
      newAnnotation.data.text = null;
      newAnnotation.tags = [];
      let promptType = defaultType;
      let promptText = null;
      let promptTags = [];

      let promptChange = function (type, text, tags) {
        promptType = type;
        promptText = text;
        promptTags = tags;
      };

      this.create({
        title: 'New annotation',
        content: <Prompt type={["linear_plot"]} text="" tags={[]} onChange={promptChange}/>,
        buttons: {
          left: ['cancel'],
          right: [
            {
              text: 'Save',
              key: '⌘+s',
              className: 'success',
              action: function () {
                callback(promptType, promptText, promptTags);
                Popup.close();
              }
            }]
        }
      });
    });

    /** Call the plugin */
    Popup.plugins().prompt(function (type, text, tags) {
      newAnnotation.data.type = type;
      newAnnotation.data.text = text;
      newAnnotation.tags = tags;
    });
    this.annotations[pageIndex] = [...this.annotations[pageIndex], newAnnotation];
    this.annotations = [...this.annotations];
  }

  deleteSelectedAnnotations() {
    this.annotations = this.annotations.map((annotationsOnPage, pageIndex) =>
      annotationsOnPage.filter((_, annotationIndex) => !this.isAnnotationSelected(pageIndex, annotationIndex)));
    this.selectedAnnotations = [];
  }

  editSelectedAnnotation() {
    if (this.selectedAnnotations.length !== 1) {
      throw new Error('Only one annotation must be selected for edit');
    }
    const [{pageIndex, annotationIndex}] = this.selectedAnnotations;
    Popup.registerPlugin('prompt', function (defaultType, defaultText, defaultTags, callback) {
      let promptType = null;
      let promptText = null;
      let promptTags = [];

      let promptChange = function (type, text, tags) {
        promptType = type;
        promptText = text;
        promptTags = tags;
      };

      this.create({
        title: 'Zmień adnotację',
        content: <Prompt type={defaultType} text={defaultText} tags={defaultTags} onChange={promptChange}/>,
        buttons: {
          left: ['cancel'],
          right: [
            {
              text: 'Save',
              key: '⌘+s',
              className: 'success',
              action: function () {
                callback(promptType, promptText, promptTags);
                Popup.close();
              }
            }]
        }
      });
    });

    let updateAnnotation = (type, text, tags) => {
      this.annotations[pageIndex][annotationIndex].data.type = type;
      this.annotations[pageIndex][annotationIndex].data.text = text;
      this.annotations[pageIndex][annotationIndex].tags = tags;
    };
    const originalType = this.annotations[pageIndex][annotationIndex].data.type;
    const originalText = this.annotations[pageIndex][annotationIndex].data.text;
    const originalTags = this.annotations[pageIndex][annotationIndex].tags;
    Popup.plugins().prompt(originalType, originalText, originalTags, updateAnnotation);
  }

  copySelectedAnnotations(copyOffset) {
    const updatedAnnotations = [...this.annotations];
    this.selectedAnnotations.forEach(({pageIndex, annotationIndex}) => updatedAnnotations[pageIndex].push({
      ...updatedAnnotations[pageIndex][annotationIndex],
      data: {
        ...updatedAnnotations[pageIndex][annotationIndex].data,
        x1: updatedAnnotations[pageIndex][annotationIndex].data.x1 + copyOffset,
        x2: updatedAnnotations[pageIndex][annotationIndex].data.x2 + copyOffset,
        y1: updatedAnnotations[pageIndex][annotationIndex].data.y1 + copyOffset,
        y2: updatedAnnotations[pageIndex][annotationIndex].data.y2 + copyOffset
      }
    }));
    this.annotations = updatedAnnotations;
  }

  transformAnnotation(pageIndex, annotationIndex, newDataFields) {
    this.annotations[pageIndex][annotationIndex].data = {
      ...this.annotations[pageIndex][annotationIndex].data,
      ...newDataFields
    };
    this.annotations = [...this.annotations];
  }

  getSelectedAnnotationsIds() {
    return this.selectedAnnotations.map(({pageIndex, annotationIndex}) => this.annotations[pageIndex][annotationIndex].id);
  }

  connectSelectedAnnotations() {
    const selectedIds = this.getSelectedAnnotationsIds();
    if (selectedIds.some((id) => !id)) {
      this.messageService.showError(
        'Musisz opublikować bieżące zmiany przed tym jak dodać referencję między adnotacjami');
      return;
    }
    this.annotations = this.annotations.map((annotationsOnPage, pageIndex) =>
      annotationsOnPage.map((annotation, annotationIndex) => {
        if (!this.isAnnotationSelected(pageIndex, annotationIndex)) {
          return annotation;
        }
        const currentReferences = annotation.data.text.split(',').filter((text) => text.length > 0) || [];
        const additionalAnnotations = selectedIds.filter((id) => id !== annotation.id && !currentReferences.includes(id));
        return {
          ...annotation,
          data: {...annotation.data, text: [...currentReferences, ...additionalAnnotations].join(',')}
        };
      }));
    this.selectedAnnotations = [];
  }
}
