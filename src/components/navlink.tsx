import { Link } from "@tanstack/react-router"
const navlink = () => {
  return (
    <>
        <li>
            <Link to="/" search={{ page: undefined, name: undefined}} className="outline outline-1 [&.active]:font-bold m-1">
                Pokemon
            </Link>
        </li>
        <li>
            <a className="outline outline-1 m-1" href="https://andikarekatias.com">
                Andika Rekatias
            </a>
        </li>
    </>
  )
}

export default navlink