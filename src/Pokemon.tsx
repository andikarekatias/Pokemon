import { useParams } from '@tanstack/react-router';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const Pokemon = () => {
  const params = useParams({ strict: false });
  const { pokemonName } = params;
    
  const { data, error, isLoading } = useSWR(
    pokemonName ? `https://pokeapi.co/api/v2/pokemon/${pokemonName}` : null,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return 
    <div className='w-96 mx-auto m-2'>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
    </div>;

    const goBack = () => {
        window.history.back(); // This uses the browser's back functionality
    };

  
  return (
    <div className='w-96 mx-auto m-2'>        
        <div className="card bg-base-100 w-96 shadow-xl">
            <figure>
                <img
                src={data.sprites.front_default}
                alt={data.name} />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{data.name}</h2>
                <p>Heigh : {data.height}</p>
                <p>Weight : {data.weight}</p>
                <p>Types : {data.types.map((typeObj: { type: { name: string } }) => (
                    <span key={typeObj.type.name} className='badge badge-outline'>{typeObj.type.name} </span>
                  ))}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary" onClick={goBack}>Back</button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Pokemon;