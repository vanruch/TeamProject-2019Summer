import {fetchBody} from '../utils';

const authToken = process.env.TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJJRCIsInByb2ZpbGUiOiJBTk5PVEFUT1IiLCJpcCI6IioiLCJ1c2VyTmFtZSI6IkNyZWVkIEJyYXR0b24iLCJleHRlcm5hbFRva2VuIjoiM2QxMzgyZTI2NWY5YzZkM2ZlZDc5NjYzNTM3ZDNlZTM3OWI4ZmVjYiIsImV4cCI6MTU4ODkzMDk5MywiaXNzIjoibWluaV9wdyIsImlhdCI6MTU1NzMwODU0OSwianRpIjoiMmExZThlMDUtNDdiOC00YzI4LWE1YmEtNjYzM2FmODM5MTkzIn0.bqNMxuJeC3ecRrnGSdXcKaaotT69T82MCN8oC8WBex0';
const apiUrl = 'http://104.211.24.171/api/annotations';
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf8",
  'X-AUTH-TOKEN': authToken
};

export default class AnnotationsService {
  async getAnnotations(pageId) {
    const {list} = await fetchBody(`${apiUrl}/annotations/list`, {
      method: 'POST',
      body: JSON.stringify({
        pageNumber: 1,
        pageSize: 100,
        searchCriteria: {
          pageId
        }
      }),
      headers
    });
    return list;
  }

  async saveChanges(annotations, pageId) {
    const updatedAnnotations = annotations
      .map(({data}) => ({annotation: data, pageId}));
    await fetch(`${apiUrl}/annotations/new`, {
      method: 'POST',
      body: JSON.stringify(updatedAnnotations),
      headers
    });
  }
}
