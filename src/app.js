import React from 'react';
import useSWR from 'swr';
import Task from './components';


export default function App({ pageSize=6, seed=12345, ...props }) {
    const urlParams = new URLSearchParams(window.location.search);
    const noun = urlParams.get('noun');
    let page = parseInt(urlParams.get('page')) || 0;
    page = isNaN(page) ? undefined : page;
  
    const { nouns, pageData, total } = useFullCsv('/images/frames_meta.json', { noun, page, pageSize, seed });
    console.log({ nouns, page, total });
    // page={page} total={total}
    return (<>
      {pageData && <Task {...props} page={page+1} total={total} noun={noun} images={pageData} />}
      <ul>
        {nouns.map(n => <li key={n}><a href={`?noun=${n}`}>{n}</a></li>)}
      </ul>
    </>)
};
  
  
  
  const useFullCsv = (url, { noun, page, pageSize=6, seed=12345 }) => {
    const { data, error, isLoading } = useSWR(url, (url) => fetch(url).then(r => r.json()))
    const nouns = React.useMemo(() => {
      return Object.keys(data?.reduce((o, x) => ({...o, [x.noun]: true}), {}) || {})
    })
  
    const allData = React.useMemo(() => {
      return data && shuffle(data?.filter(d => d.noun === noun).map(d => {
        return {...d, url: `/images/frames/${d.file_name}`}
      }), seed)
    }, [data, noun, seed]);
  
    const pageData = React.useMemo(() => {
      return allData?.slice(page * pageSize, (page+1) * pageSize)
    }, [allData, page, pageSize]);
  
    const total = Math.ceil(allData?.length / pageSize);
    return { nouns, data, pageData, page, total };
  }
  
  
  function shuffle(array, seed) {
    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(random(seed) * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
      ++seed;
    }
    return array;
  }
  
  function random(seed) {
    var x = Math.sin(seed++) * 10000; 
    return x - Math.floor(x);
  }