import {Link} from 'react-router-dom';
import React from 'react';

export default function PageTitleComponent({publication, match}) {
  return <div>
    <span>{publication.name}</span><br/>
    <Link to={`/paper/${match.params.id}/${Number(match.params.page) - 1}`}
          style={{
            textDecoration: 'none',
            visibility: match.params.page > 1 ? 'unset' : 'hidden',
            color: '#000'
          }}>❮&nbsp;</Link>
    <span>Page {match.params.page} / {publication.pageCount}</span>
    <Link to={`/paper/${match.params.id}/${Number(match.params.page) + 1}`}
          style={{
            textDecoration: 'none',
            visibility: match.params.page < publication.pageCount ? 'unset' : 'hidden',
            color: '#000'
          }}>&nbsp;❯</Link>
  </div>;
}
