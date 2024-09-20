import { useState } from 'react';
import useSWR, { SWRConfig } from 'swr';
import { Link, useNavigate } from '@tanstack/react-router';
import { indexRoute } from './routes';

interface Pokemon {
  name: string;
  url: string;
}

// Create a localStorage-based persistent cache provider https://swr.vercel.app/docs/advanced/cache#localstorage-based-persistent-cache
function localStorageProvider() {
  const map = new Map<string, any>(JSON.parse(localStorage.getItem('app-cache') || '[]'));

  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem('app-cache', appCache);
  });

  return map;
}

function App() {
  const navigate = useNavigate({ from: '/' });
  const searchParams = indexRoute.useSearch();
  const page = searchParams.page ?? 1;
  const itemPerPage = 10;
  const pageOffset = (page - 1) * itemPerPage;
  const [searchName, setSearchName] = useState(searchParams.name ?? "");
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { data, error, isLoading } = useSWR(`https://pokeapi.co/api/v2/pokemon/?limit=1302`, fetcher,{
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  if (error) return <div>failed to load</div>;
  if (isLoading) return (
    <div className="flex w-2/4 flex-col gap-4 mx-auto m-2">
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-28"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
    </div>
  );
  
  const filteredResults = data.results.filter((item: Pokemon) =>
    item.name.toLowerCase().includes(searchName.toLowerCase())
  );
  
  const paginatedResults = filteredResults.slice(pageOffset, pageOffset + itemPerPage);

  const goToPage = (newPage: number) => {
    navigate({
      search: { page: newPage, name: searchName }
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setSearchName(newName);
    navigate({
      search: { page: 1, name: newName }
    });
  };

  return (
    <div className="lg:w-2/4 mx-auto text-center m-2">
      <h1 className='text-2xl'>{data.count} Pokémon</h1>
      <h2 className='text-xl flex gap-2 items-center justify-center'>My react learning project <a href="https://github.com/andikarekatias/pokemon"><img src="/github-mark.svg" alt="github" className='w-6'/></a></h2>
      <h3>Data from <a href="https://pokeapi.co/">pokeapi.co</a></h3>      
      <div className="my-1">
        <input
          type="text"
          placeholder="Search Pokémon by name"
          value={searchName}
          onChange={handleSearchChange}
          className="input input-bordered w-full max-w-xs"
        />
      </div>

      <div className="overflow-x-auto m-2">
        <table className="table table-zebra table-lg">
          {/* head */}
          <thead>
            <tr>
              <th className='text-center'>Pokémon Name</th>
            </tr>
          </thead>
          <tbody>
            {paginatedResults.map((item: Pokemon) => (
              <tr key={item.name}>
                <td className='text-center hover:bg-neutral hover:text-white'>
                  <Link to={`/pokemon/${item.name}`} className='items-center capitalize'>
                    {item.name}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className='text-sm'>You are on page {page}</p>

        <div className="join grid grid-cols-2 m-1">
          <button
            className='join-item btn btn-outline'
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </button>
          <button
            className='join-item btn btn-outline'
            onClick={() => goToPage(page + 1)}
            disabled={page * itemPerPage >= filteredResults.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Wrap your App with SWRConfig
export default function WrappedApp() {
  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      <App />
    </SWRConfig>
  );
}
