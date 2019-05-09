const authToken = process.env.TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJJRCIsInByb2ZpbGUiOiJBTk5PVEFUT1IiLCJpcCI6IioiLCJ1c2VyTmFtZSI6IkFubm90YXRpb25zIFRlYW0iLCJleHRlcm5hbFRva2VuIjoiZTk2OThlZWM4YTI0ZjMyN2QxOWIzZTdlZTkwODg3NTg1NjE3MjViZSIsImV4cCI6MTU4ODkzMDk5MywiaXNzIjoibWluaV9wdyIsImlhdCI6MTU1NzMwODU0OSwianRpIjoiMmExZThlMDUtNDdiOC00YzI4LWE1YmEtNjYzM2FmODM5MTkzIn0.Pw8epqRfOPrYHgdIdezT-NSTQmDhJFPQD5ZXiW7HW5E';
const apiUrl = 'http://104.211.24.171/api/annotations';
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf8",
  'X-AUTH-TOKEN': authToken
};

const fetchBody = async (...args) => (await fetch(...args)).json();

export default class PublicationsService {
  async getPublicationPreviews(pageNumber) {
    const {list: publications} = await fetchBody(`${apiUrl}/publications`, {
      method: 'POST',
      body: JSON.stringify({
        pageNumber,
        pageSize: 8
      }),
      headers
    });
    const imagesSrc = await Promise.all(publications.map(({id}) => this.getPagePreview(id, 1)));
    return publications.map((page, ind) => ({...page, src: imagesSrc[ind]}));
  }

  async getPagePreview(publicationId, pageNumber) {
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
      return list[0].imageUrl;
    }
    return '';
  }
}
