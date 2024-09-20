import { useParams } from '@tanstack/react-router';
import useSWR from 'swr';
import { useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const Pokemon = () => {
  const params = useParams({ strict: false });
  const { pokemonName } = params;

  const localStorageKey = `pokemon-${pokemonName}`;
   
  const initialData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(localStorageKey) || 'null') : null;
    
  const { data, error, isLoading } = useSWR(
    pokemonName ? `https://pokeapi.co/api/v2/pokemon/${pokemonName}` : null,
    fetcher,
    { fallbackData: initialData }
  );

  useEffect(() => {
    if (data) {
      localStorage.setItem(localStorageKey, JSON.stringify(data));
    }
  }, [data, localStorageKey]);
  
  if (error) return <div>failed to load</div>;
  if (isLoading) return (
    <div className='w-96 flex flex-col gap-4 mx-auto m-2'>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
    </div>);

    const goBack = () => {
        window.history.back();
    };

  
  return (
    <div className='w-96 mx-auto m-2'>        
        <div className="card bg-base-100 w-96 shadow-xl dark:border dark:border-solid dark:border-white">
            <figure>
                <img
                src={data.sprites.front_default}
                alt={data.name} />
            </figure>
            <div className="card-body">
                <h2 className="card-title capitalize">{data.name}</h2>
                <p>Heigh : {data.height}</p>
                <p>Weight : {data.weight}</p>
                <p>Types : {data.types.map((typeObj: { type: { name: string } }) => (
                    <span key={typeObj.type.name} className='badge badge-outline'>{typeObj.type.name} </span>
                  ))}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-neutral hover:bg-base-100 hover:text-black" onClick={goBack}>Back</button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Pokemon;