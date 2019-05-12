import {fetchBody} from '../utils';

const authToken = process.env.TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJJRCIsInByb2ZpbGUiOiJBTk5PVEFUT1IiLCJpcCI6IioiLCJ1c2VyTmFtZSI6IkNyZWVkIEJyYXR0b24iLCJleHRlcm5hbFRva2VuIjoiM2QxMzgyZTI2NWY5YzZkM2ZlZDc5NjYzNTM3ZDNlZTM3OWI4ZmVjYiIsImV4cCI6MTU4ODkzMDk5MywiaXNzIjoibWluaV9wdyIsImlhdCI6MTU1NzMwODU0OSwianRpIjoiMmExZThlMDUtNDdiOC00YzI4LWE1YmEtNjYzM2FmODM5MTkzIn0.bqNMxuJeC3ecRrnGSdXcKaaotT69T82MCN8oC8WBex0';
const apiUrl = 'http://annotations.mini.pw.edu.pl/api/annotations';
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf8",
  'X-AUTH-TOKEN': authToken
};


export default class PublicationsService {
  async getPage(publicationId, pageNumber) {
    const publication = await fetchBody(`${apiUrl}/publications/${publicationId}`, {
      headers
    });
    const page = await this.getPageData(publicationId, pageNumber);
    return {...publication, page};
  }

  async getPublication(publicationId) {
    const publication = await fetchBody(`${apiUrl}/publications/${publicationId}`, {
      headers
    });
    const {count} = await fetchBody(`${apiUrl}/publications/pages`, {
      method: 'POST',
      body: JSON.stringify({
        pageNumber: 1,
        pageSize: 1,
        searchCriteria: {
          publicationId
        }
      }),
      headers
    });
    return {...publication, pageCount: count};
  }

  async getPublicationPreviews(pageNumber) {
    const {list: publications} = await fetchBody(`${apiUrl}/publications`, {
      method: 'POST',
      body: JSON.stringify({
        pageNumber,
        pageSize: 8
      }),
      headers
    });
    const imagesSrc = await Promise.all(publications.map(({id}) => this.getPageData(id, 1)));
    return publications.map((page, ind) => ({...page, src: imagesSrc[ind].imageUrl}));
  }

  async getPageData(publicationId, pageNumber) {
    const {list} = await fetchBody(`${apiUrl}/publications/pages`, {
      method: 'POST',
      body: JSON.stringify({
        pageNumber: pageNumber,
        pageSize: 1,
        searchCriteria: {
          publicationId
        }
      }),
      headers
    });
    if (list && list.length > 0) {
      return list[0];
    }
    return '';
  }
}
