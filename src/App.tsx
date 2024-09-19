import useSWR from 'swr';
import { Link, useNavigate } from '@tanstack/react-router';
import { indexRoute } from './routes';

interface Pokemon {  
  name: string;
  url: string;
}

function App() {
  const navigate = useNavigate({ from: '/' });
  const searchParams = indexRoute.useSearch();
  const page = parseInt(searchParams.page.toString() ?? "1");
  const itemPerPage = 20;
  const pageOffset = (page - 1) * itemPerPage;
  
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { data, error, isLoading } = useSWR(`https://pokeapi.co/api/v2/pokemon/?limit=10&offset=${pageOffset}`, fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div className="flex w-2/4 flex-col gap-4 mx-auto m-2">
    <div className="skeleton h-4 w-full"></div>
    <div className="skeleton h-4 w-28"></div>
    <div className="skeleton h-4 w-full"></div>
    <div className="skeleton h-4 w-full"></div>
  </div>;

  const goToPage = (newPage: number) => {
    navigate({
      search: { page: newPage.toString() }
    });
  };

  return (
    <div className="w-2/4 mx-auto text-center m-2">
      <h1 className='text-2xl'>{data.count} Pokemon </h1>
      <h2>My react learning project</h2>
      <div className="overflow-x-auto m-2">
        <table className="table table-zebra table-lg">
          {/* head */}
          <thead>
            <tr>
              <th></th>        
            </tr>
          </thead>
          <tbody>
            {data.results.map((item: Pokemon) => (  
              <tr key={item.name}>
                <td className='text-center hover:bg-neutral hover:text-white'>
                  <Link to={`/pokemon/${item.name}`} className='items-center'>
                    {item.name}
                  </Link>
       kemo     </td>
              </tr>     
            ))} 
          </tbody>
        </table>
        <p className='text-sm'>You are in page {page}</p>
        <div className="join grid grid-cols-2 m-1">
          <button 
            className='join-item btn btn-outline' 
            onClick={() => goToPage(page - 1)} 
            disabled={page <= 1}>
            Previous
          </button>
          <button 
            className='join-item btn btn-outline' 
            onClick={() => goToPage(page + 1)}>
            Next
          </button>
        </div>
      </div>        
    </div>
  );
}

export default App;
