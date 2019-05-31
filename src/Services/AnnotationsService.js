import {fetchBody} from '../utils';
import {groupBy} from '../common';

const apiUrl = 'http://annotations.mini.pw.edu.pl/api/annotations';

export default class AnnotationsService {
  constructor(authService, annotationsControllerService) {
    this.authService = authService;
    this.annotationsControllerService = annotationsControllerService;
  }

  get headers() {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf8',
      'X-AUTH-TOKEN': this.authService.token
    };
  }

  async getAnnotations(pageId) {
    await this.authService.ensureLoggedIn();
    const {list} = await fetchBody(`${apiUrl}/annotations/list`, {
      method: 'POST',
      body: JSON.stringify({
        pageNumber: 1,
        pageSize: 100,
        searchCriteria: {
          pageId
        }
      }),
      headers: this.headers
    });
    return list;
  }

  async getAnnotationsForPublication(publicationId) {
    await this.authService.ensureLoggedIn();
    const {list} = await fetchBody(`${apiUrl}/annotations/list`, {
      method: 'POST',
      body: JSON.stringify({
        pageNumber: 1,
        pageSize: 100,
        searchCriteria: {
          publicationId
        }
      }),
      headers: this.headers
    });
    return groupBy(x => x.pageId)(list);
  }

  async saveChanges(annotations, pageId, pageIndex) {
    await this.authService.ensureLoggedIn();
    const updatedAnnotations = annotations
      .map(({data}) => ({annotation: data, pageId, annotationsUsed: []}));
    const res = await fetch(`${apiUrl}/annotations/new`, {
      method: 'POST',
      body: JSON.stringify(updatedAnnotations),
      headers: this.headers
    });
    const newIds = await res.json();
    if (Array.isArray(newIds)) {
      this.annotationsControllerService.updateAnnotationsIds(pageIndex, newIds)
    }
  }
}
