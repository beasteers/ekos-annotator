import React, {useMemo} from 'react';
import useSWR from 'swr';
import Task from './components';
import Papa from 'papaparse';


const TASK_KEY = {
  'noun': 'noun',
  'predicate': 'state',
}

export default function App({ pageSize=6, seed=12345, ...props }) {
    const urlParams = new URLSearchParams(window.location.search);
    const group = urlParams.get('group');
    const task = urlParams.get('task') || props.task || 'noun';
    console.log(task, group)
    let page = parseInt(urlParams.get('page')) || 0;
    page = isNaN(page) ? undefined : page;
  
    // const { nouns, pageData, total } = useFullCsv(`/mturk_batches_${props.task}.json`, { noun, page, pageSize, seed });
    const { options, pageData, total } = useBatchCsv(props.images ? null : `/mturk_batches_${task}.csv`, { group, page, pageSize, seed, batchKey: TASK_KEY[task] });
    console.log({ options, pageData, group, page, total, props });

    return (<>
      <form>
        {pageData ? 
          <Task task={task} page={page} total={total} {...pageData} {...props} />
          : <Task {...props} />}
      </form>
      <ul>
        {options.map(n => <li key={n}><a href={`?group=${n}`}>{n}</a></li>)}
      </ul>
    </>)
};


const fixNounFormat = (noun) => {
  let ns = noun.split(':');
  let n = ns.shift()
  return [...ns, n].join(' ');
}
  

const useCsv = (url) => {
    const { data, error, isLoading } = useSWR(url, (url) => fetch(url).then(r => r.text()).then(r => Papa.parse(r, {header: true})))
    const {
      data: rawData,
      errors: csvErrors,
    } = data || {};
    console.log(url, rawData?.length, csvErrors, error, isLoading)
    return { data: rawData, error, isLoading };
}


const useBatchCsv = (url, { page, batchKey, group }) => {
    const { data:result, error, isLoading } = useSWR(url, (url) => fetch(url).then(r => r.text()).then(r => Papa.parse(r, {header: true})))
    const {
      data: rawData,
      errors: csvErrors,
    } = result || {};
    console.log(url, rawData?.length, csvErrors, error, isLoading)
  
    let data = React.useMemo(() => {
      return rawData && rawData?.map((d) => {
        let images = []
        let i = images.length+1;
        while (d[`image_${i}_file_name`]) {
          let polygons = d[`image_${i}_polygons`];
          if (polygons) {
            polygons = JSON.parse(polygons);
          }
          images.push({
            file_name: d[`image_${i}_file_name`],
            polygons,
          })
          i = images.length+1;
        }
        return { group: d[batchKey], ...d, images }
      })
    }, [rawData]);

    const options = React.useMemo(() => {
      console.log(data)
      return Object.keys(data?.reduce((o, x) => (x[batchKey] == null ? o : {...o, [x[batchKey]]: true}), {}) || {})
    })
    console.log(options, group)

    data = useMemo(() => data?.filter(d => d[batchKey] == group), [data, group]); 
    console.log(data);

    const total = data?.length
    return { options, data: data, pageData: data?.[page], page, total };
}
  
  
  const useFullCsv = (url, { noun, page, pageSize=6, seed=12345 }) => {
    const { data, error, isLoading } = useSWR(url, (url) => fetch(url).then(r => r.json()))
    console.log(isLoading, error)
    
    const nouns = React.useMemo(() => {
      return Object.keys(data?.reduce((o, x) => ({...o, [x.noun]: true}), {}) || {})
    })
  
    const allData = React.useMemo(() => {
      return data && shuffle(data?.filter(d => d.noun === noun).map(d => {
        return {...d, src: `/images/frames/${d.file_name}`}
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